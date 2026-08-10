import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * /api/ask — the tax assistant, proxied to Groq.
 *
 * ─── WHY THIS ROUTE IS DELIBERATELY PARANOID ─────────────────────────────────
 * This answers tax questions under a practising advocate's name. A wrong answer
 * here is not a bad UX moment — it is a person filing something incorrectly and
 * a professional-conduct problem for Amit. So:
 *
 *   1. The model NEVER states a rate, a due date, a threshold or a penalty
 *      amount. It explains mechanics and points at the practice. Numbers change
 *      with every Finance Act and a stale number is worse than no number.
 *   2. Scope is enforced on the SERVER, in two places: a system prompt and a
 *      hard topic gate before the request is even sent. Client-side restriction
 *      is decoration — anyone can POST to this route directly.
 *   3. The key is server-only. NEXT_PUBLIC_ would ship it to every visitor and
 *      hand a stranger the practice's Groq bill.
 *   4. Rate limited per IP. An unmetered LLM endpoint on a public site is an
 *      invitation.
 *
 * ─── KNOWLEDGE BASE ─────────────────────────────────────────────────────────
 * lib/knowledge/tax-books.md is read once at server start and injected into
 * the system prompt (capped at 6000 chars). That file is how the practice
 * "trains" the assistant with the client's real tax books — see AI-TRAINING.md.
 * The no-numbers rule below applies to the knowledge base too: entries explain
 * mechanics, and the model still refuses to state current figures.
 */

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const KNOWLEDGE_CAP = 6000;
const KNOWLEDGE_PATH = join(process.cwd(), "lib", "knowledge", "tax-books.md");
let KNOWLEDGE = "";
try {
  KNOWLEDGE = readFileSync(KNOWLEDGE_PATH, "utf8").slice(0, KNOWLEDGE_CAP);
} catch {
  /* File absent — the assistant runs on the system prompt alone. That is the
     pre-training state and it is fine. */
}

const KNOWLEDGE_SECTION = KNOWLEDGE
  ? `

── FIRM KNOWLEDGE BASE (from the practice's real tax books) ──
The following knowledge comes from the practice's own books and is authoritative for HOW things work and WHAT is involved:
${KNOWLEDGE}
These entries describe mechanics, processes and who things apply to. The no-current-numbers rule above still applies to everything in them: quotes, rates, thresholds, due dates, penalties and fees here are descriptions, not figures to repeat as current.`
  : "";

const SYSTEM_PROMPT = `You are the assistant on the website of Amit Modi & Co., a tax, GST and compliance practice in Suratgarh, Rajasthan, India.${KNOWLEDGE_SECTION}

YOUR ONLY SUBJECT is Indian tax and business compliance: GST, income tax, TDS/TCS, PAN/TAN, entity formation (partnership, LLP, society, trust), import-export registration (IEC), assessments, notices and appeals.

ABSOLUTE RULES

1. NEVER state a specific tax rate, threshold, due date, penalty amount, late fee or interest rate. Not even one you are confident about. Rates change with every Finance Act and notification, and a stale figure on a practice's own website is worse than no figure. Instead say which form or section governs it and that the current figure should be confirmed with the practice.

2. You explain HOW something works and WHAT is involved. You do not tell anyone what to do in their specific situation. That is advice, and advice requires someone who has seen their documents.

3. If asked anything outside Indian tax and compliance — code, general knowledge, other countries' tax, medical, legal advice beyond tax, personal opinions, creative writing — decline in one short sentence and offer to answer a tax question instead. Do not explain your restrictions at length.

4. Never invent a fee, a turnaround time, a credential, a client count, or anything about Amit Modi personally. If asked, say the practice can confirm it directly.

5. Answer in 3 sentences or fewer wherever possible. The reader is anxious and usually on a phone. If the matter is genuinely specific — a notice received, a deadline close, an appeal — say so plainly and point them to the contact page.

6. Plain English. Define any term the first time you use it. Never use "leverage", "solutions", "seamless".

TONE: calm, precise, unhurried. Competence, not enthusiasm. You are the person who has seen this a hundred times.`;

/* ── topic gate ────────────────────────────────────────────────────────────
 * A cheap pre-filter before spending a token. This is not the only defence
 * (the system prompt is), but it stops the obvious abuse — someone using the
 * practice's API budget as a free coding assistant.
 */
const OFF_TOPIC = [
  /\b(write|generate|fix|debug|refactor)\b.{0,20}\b(code|script|program|function|python|javascript|java|c\+\+|sql|html|css)\b/i,
  /\b(python|javascript|typescript|react|sql query|regex)\b.{0,20}\b(code|script|snippet|example)\b/i,
  /\bwrite (me )?(a|an|some) (poem|story|essay|song|email|letter|blog)\b/i,
  /\b(recipe|movie|football|cricket score|weather|horoscope)\b/i,
  /\bignore (all )?(previous|prior|above) (instructions|prompts)\b/i,
  /\byou are now\b|\bact as\b|\bpretend to be\b|\bsystem prompt\b/i,
];

const ON_TOPIC_HINT =
  /\b(gst|tax|itr|tds|tcs|pan|tan|iec|invoice|return|filing|notice|appeal|audit|registration|compliance|deduction|refund|penalty|challan|assessment|partnership|llp|trust|society|turnover|hsn|sac|e-?way|composition)\b/i;

/* ── rate limit (in-memory; per instance) ─────────────────────────────────── */
const hits = new Map<string, { n: number; reset: number }>();
const LIMIT = 12;
const WINDOW = 60 * 60 * 1000;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { n: 1, reset: now + WINDOW });
    return false;
  }
  rec.n += 1;
  return rec.n > LIMIT;
}

const REFUSAL =
  "I can only help with Indian tax and compliance — GST, income tax, TDS, registrations, notices and appeals. Ask me one of those and I'll do my best.";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many questions for now. Please try again later, or use the contact form." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 600) {
    return NextResponse.json(
      { error: "Please ask a question, up to 600 characters." },
      { status: 400 },
    );
  }

  /* Refuse before spending a token. Anything clearly off-topic, and anything
     that mentions no tax concept at all, gets the standard line. */
  const clearlyOff = OFF_TOPIC.some((re) => re.test(message));
  const mentionsTax = ON_TOPIC_HINT.test(message);
  if (clearlyOff || (!mentionsTax && message.split(/\s+/).length > 6)) {
    return NextResponse.json({ reply: REFUSAL, refused: true });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    /* Not configured is a normal state before launch — say something useful
       rather than exposing that a key is missing. */
    return NextResponse.json({
      reply:
        "The assistant isn't switched on yet. In the meantime, the contact form reaches the practice directly and gets a reply within one business day.",
      unconfigured: true,
    });
  }

  /* Keep only the last few turns, and only their text. Long histories cost
     tokens and give a prompt-injection attempt more room to work. */
  const history = Array.isArray(body.history)
    ? (body.history as { role: string; content: string }[])
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string",
        )
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }))
    : [];

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2, // low: this is explanation, not invention
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`[ask] groq ${res.status}`);
      return NextResponse.json(
        { error: "The assistant is unavailable right now. The contact form still works." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() ?? REFUSAL;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ask] threw:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "The assistant is unavailable right now. The contact form still works." },
      { status: 502 },
    );
  }
}
