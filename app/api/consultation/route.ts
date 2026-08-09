/*
 * app/api/consultation/route.ts — POST handler for consultation requests.
 *
 * One contract: the payload is re-validated here with the same consultationSchema
 * the client form uses (lib/schemas.ts). The client is never trusted.
 *
 * Order of operations, cheapest first:
 *   1. parse the body (JSON from the stepped client, form-urlencoded from the
 *      no-JavaScript native fallback)
 *   2. honeypot — a non-empty `company` is a bot: reply 200/redirect so it
 *      learns nothing, and send no email and no rate-limit penalty
 *   3. rate limit — max 5 submissions per IP per hour, 429 + Retry-After
 *   4. validate — 400 on bad fields
 *   5. send — notification to the practice inbox, confirmation to the enquirer
 *
 * Security: RESEND_API_KEY / CONTACT_TO_EMAIL come from process.env only.
 * Resend errors are logged (with masked contact details) but never returned
 * to the client.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { consultationSchema, type ConsultationOutput } from "@/lib/schemas";
import { SERVICES } from "@/data/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

const CONTACT_TO = process.env.CONTACT_TO_EMAIL;
const RESEND_FROM =
  process.env.RESEND_FROM || "Amit Modi & Co. <onboarding@resend.dev>";

const GENERIC_ERROR = "Your request could not be sent. Please try again in a moment.";
const RATE_LIMIT_ERROR = "Too many requests. Please try again in a little while.";

const URGENCY_LABELS: Record<ConsultationOutput["urgency"], string> = {
  "this week": "This week",
  "this month": "This month",
  "planning ahead": "Planning ahead",
};

const SITUATION_LABELS: Record<ConsultationOutput["situation"], string> = {
  "starting out": "Starting out",
  "ongoing compliance": "Ongoing compliance",
  "received a notice": "Received a notice",
  "appeal or dispute": "Appeal or dispute",
  "not sure": "Not sure",
};

function serviceLabel(service: ConsultationOutput["service"]): string {
  if (service === "other") return "Other";
  return SERVICES.find((s) => s.slug === service)?.name ?? service;
}

function clientIp(request: NextRequest): string {
  for (const header of ["x-forwarded-for", "x-real-ip", "x-vercel-forwarded-for"]) {
    const value = request.headers.get(header);
    if (value) return value.split(",")[0].trim();
  }
  return "unknown";
}

/** Never log PII in full: keep two digits on each end of a phone, two of an email. */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  return `${digits.slice(0, 2)}${"*".repeat(digits.length - 4)}${digits.slice(-2)}`;
}

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

/** body form -> plain object; coerce the consent checkbox to a real boolean. */
function formDataToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    out[key] = key === "consent" ? value === "true" : value;
  }
  return out;
}

function notificationBody(input: ConsultationOutput, ip: string): string {
  return [
    "New consultation request",
    "Site: Amit Modi & Co.",
    "",
    `SERVICE: ${serviceLabel(input.service)}`,
    `SITUATION: ${SITUATION_LABELS[input.situation]}`,
    `URGENCY: ${URGENCY_LABELS[input.urgency]}`,
    "",
    "FROM",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email || "(not given)"}`,
    "",
    "MESSAGE",
    input.message && input.message.trim() ? input.message : "(none)",
    "",
    `Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
    `IP: ${ip}`,
  ].join("\n");
}

function confirmationBody(input: ConsultationOutput): string {
  const firstName = input.name.trim().split(/\s+/)[0] ?? input.name;
  const about =
    input.service !== "other"
      ? ` about ${serviceLabel(input.service).toLowerCase()}`
      : "";
  return [
    `Hi ${firstName},`,
    "",
    `We've received your request${about}.`,
    "",
    "What happens next:",
    "1. A member of the team reviews your request.",
    "2. You'll hear back by email or phone within one business day.",
    "3. If you marked it urgent, we'll reach out as soon as we can during office hours.",
    "",
    "You don't need to do anything else. Want to add more detail? Just reply to this email.",
    "",
    "— The Amit Modi & Co. team",
  ].join("\n");
}

async function sendNotification(resend: Resend, input: ConsultationOutput, ip: string) {
  if (!CONTACT_TO) {
    throw new Error("CONTACT_TO_EMAIL is not configured");
  }
  return resend.emails.send({
    from: RESEND_FROM,
    to: CONTACT_TO,
    replyTo: input.email || CONTACT_TO,
    subject: `[Consultation] ${serviceLabel(input.service)} · ${URGENCY_LABELS[input.urgency]}`,
    text: notificationBody(input, ip),
  });
}

async function sendConfirmation(resend: Resend, input: ConsultationOutput) {
  if (!input.email) return;
  await resend.emails.send({
    from: RESEND_FROM,
    to: input.email,
    replyTo: CONTACT_TO || RESEND_FROM,
    subject: "We received your consultation request — Amit Modi & Co.",
    text: confirmationBody(input),
  });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const isForm = (request.headers.get("content-type") ?? "").includes(
    "application/x-www-form-urlencoded",
  );

  /* 1 — parse the body. JSON from the client form, urlencoded from the
     no-JavaScript native fallback. */
  let raw: unknown;
  try {
    raw = isForm
      ? formDataToObject(await request.formData())
      : await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: GENERIC_ERROR } as const,
      { status: 400 },
    );
  }

  /* 2 — honeypot. A filled `company` is a bot; reply success and stop. */
  if (raw && typeof raw === "object" && "company" in raw && raw.company !== "") {
    if (isForm) {
      return NextResponse.redirect(
        new URL("/contact/thank-you", request.url),
        { status: 303 },
      );
    }
    return NextResponse.json({ ok: true, message: "Received." } as const);
  }

  /* 3 — rate limit (only genuine submissions reach this point). */
  const { allowed, retryAfterSec } = rateLimit(ip);
  if (!allowed) {
    if (isForm) {
      return NextResponse.redirect(
        new URL("/contact?error=rate", request.url),
        { status: 303 },
      );
    }
    return NextResponse.json({ ok: false, error: RATE_LIMIT_ERROR } as const, {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    });
  }

  /* 4 — validate with the same schema the client uses. */
  const parsed = consultationSchema.safeParse(raw);
  if (!parsed.success) {
    if (isForm) {
      return NextResponse.redirect(
        new URL("/contact?error=1", request.url),
        { status: 303 },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: "There was a problem with one or more fields. Please review your answers and try again.",
      } as const,
      { status: 400 },
    );
  }
  const input = parsed.data;

  /* 5 — send. The inbox notification is the critical path; the confirmation
     to the enquirer is a nice-to-have and failing it must not fail the request. */
  let resend: Resend;
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
    await sendNotification(resend, input, ip);
  } catch (error) {
    console.error(
      "[consultation] notification send failed",
      {
        stage: "notification",
        service: input.service,
        situation: input.situation,
        urgency: input.urgency,
        ip,
        phoneMasked: maskPhone(input.phone),
        emailMasked: input.email ? maskEmail(input.email) : null,
        error: error instanceof Error ? error.message : String(error),
      },
    );
    if (isForm) {
      return NextResponse.redirect(
        new URL("/contact?error=1", request.url),
        { status: 303 },
      );
    }
    return NextResponse.json({ ok: false, error: GENERIC_ERROR } as const, {
      status: 500,
    });
  }

  try {
    await sendConfirmation(resend, input);
  } catch (error) {
    console.error(
      "[consultation] confirmation send failed",
      {
        stage: "confirmation",
        service: input.service,
        situation: input.situation,
        urgency: input.urgency,
        ip,
        emailMasked: input.email ? maskEmail(input.email) : null,
        error: error instanceof Error ? error.message : String(error),
      },
    );
  }

  if (isForm) {
    return NextResponse.redirect(
      new URL("/contact/thank-you", request.url),
      { status: 303 },
    );
  }
  return NextResponse.json(
    { ok: true, message: "Request received. We will respond within one business day." } as const,
    { status: 200 },
  );
}
