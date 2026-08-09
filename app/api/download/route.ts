/*
 * app/api/download/route.ts — POST handler for gated downloads (Phase 15, Agent A).
 *
 * The lead-magnet PDFs are never served here. This route takes an email +
 * consent, validates it with the same downloadSchema the client form uses,
 * and EMAILS the download link. Emailing the link (instead of returning the
 * file) is the point: it confirms the address is real, so the practice gets a
 * deliverable lead rather than a bounced one.
 *
 * Order of operations, cheapest first (mirrors app/api/consultation):
 *   1. parse the body (JSON from the client component)
 *   2. honeypot — a non-empty `company` is a bot: reply 200 so it learns
 *      nothing, and send no email and no rate-limit penalty
 *   3. rate limit — max 4 requests per IP per hour, 429 + Retry-After
 *   4. validate — 400 on bad fields (email, consent, asset)
 *   5. send — the download-link email to the address; a lead note to the inbox
 *
 * Security: RESEND_API_KEY / CONTACT_TO_EMAIL come from process.env only.
 * Resend errors are logged (with masked emails) but never returned.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { downloadSchema, type DownloadOutput } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 4;
const hits = new Map<string, { count: number; resetAt: number }>();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.complianceincheck.com";
const CONTACT_TO = process.env.CONTACT_TO_EMAIL;
const RESEND_FROM =
  process.env.RESEND_FROM || "Compliance in Check <onboarding@resend.dev>";

const GENERIC_ERROR = "Your request could not be sent. Please try again in a moment.";
const RATE_LIMIT_ERROR = "Too many requests. Please try again in a little while.";

const ASSET_TITLES: Record<DownloadOutput["asset"], string> = {
  "gst-compliance-checklist": "GST Compliance Checklist",
  "document-checklist-pack": "Document Checklist Pack",
  "annual-compliance-calendar": "Annual Compliance Calendar",
};

function clientIp(request: NextRequest): string {
  for (const header of ["x-forwarded-for", "x-real-ip", "x-vercel-forwarded-for"]) {
    const value = request.headers.get(header);
    if (value) return value.split(",")[0].trim();
  }
  return "unknown";
}

/** Never log an email in full: keep two characters on each side of the @. */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}${"*".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

function rateLimit(key: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= MAX_HITS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

function downloadBody(input: DownloadOutput): string {
  const title = ASSET_TITLES[input.asset];
  const url = `${SITE_URL}/docs/${input.asset}.pdf`;
  return [
    "Hi there,",
    "",
    `Your download is ready: ${title}.`,
    "",
    `Get it here: ${url}`,
    "",
    "The link stays valid, so you can come back to it later.",
    "",
    "— The Compliance in Check team",
    "",
    "If you did not request this download, you can ignore this email.",
  ].join("\n");
}

function leadNoteBody(input: DownloadOutput, ip: string): string {
  return [
    "New download lead",
    "Site: Compliance in Check",
    "",
    `ASSET: ${ASSET_TITLES[input.asset]} (${input.asset}.pdf)`,
    `EMAIL: ${input.email}`,
    "",
    `Requested: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
    `IP: ${ip}`,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  /* 1 — parse the body. */
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR } as const, {
      status: 400,
    });
  }

  /* 2 — honeypot. A filled `company` is a bot; reply success and stop. */
  if (raw && typeof raw === "object" && "company" in raw && raw.company !== "") {
    return NextResponse.json({ ok: true, message: "Received." } as const);
  }

  /* 3 — rate limit (only genuine submissions reach this point). */
  const { allowed, retryAfterSec } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: RATE_LIMIT_ERROR } as const, {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    });
  }

  /* 4 — validate with the same schema the client uses. */
  const parsed = downloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "There was a problem with one or more fields. Please review and try again.",
      } as const,
      { status: 400 },
    );
  }
  const input = parsed.data;

  /* 5 — send. The download-link email is the critical path. */
  let resend: Resend;
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM,
      to: input.email,
      replyTo: CONTACT_TO || RESEND_FROM,
      subject: `Your download is ready: ${ASSET_TITLES[input.asset]} — Compliance in Check`,
      text: downloadBody(input),
    });
  } catch (error) {
    console.error(
      "[download] download email send failed",
      {
        stage: "download-email",
        asset: input.asset,
        ip,
        emailMasked: maskEmail(input.email),
        error: error instanceof Error ? error.message : String(error),
      },
    );
    return NextResponse.json({ ok: false, error: GENERIC_ERROR } as const, {
      status: 500,
    });
  }

  try {
    if (CONTACT_TO) {
      await resend.emails.send({
        from: RESEND_FROM,
        to: CONTACT_TO,
        subject: `[Download lead] ${ASSET_TITLES[input.asset]}`,
        text: leadNoteBody(input, ip),
      });
    }
  } catch (error) {
    console.error(
      "[download] lead note send failed",
      {
        stage: "lead-note",
        asset: input.asset,
        ip,
        emailMasked: maskEmail(input.email),
        error: error instanceof Error ? error.message : String(error),
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "The download link is on its way — check your inbox.",
    } as const,
    { status: 200 },
  );
}
