# Firm knowledge base — the assistant's source of truth

This file is loaded by `/api/ask` on the server and injected into the model's
context before every answer. It is how the chatbot is "trained" with the real
tax books the client supplies.

---

## HOW THIS FILE WORKS

- Everything below `## Knowledge` is read at server start, capped at 6,000
  characters, and given to the model as a **firm knowledge base**.
- The model still obeys the master rule from `app/api/ask/route.ts`: it never
  states a rate, threshold, due date, penalty, or fee as current. Figures in
  this file are for *mechanics and process* — what a form is for, who it
  applies to, what steps a filing involves, how a notice is normally answered.
  If a figure is needed, the model says "the current figure should be
  confirmed with the practice".
- Use only the client's actual books. Do not paste Wikipedia-style content.
  Every entry below must come from a book the client provided.

## HOW TO ADD AN ENTRY (the training workflow)

1. Open the tax book (or the client's notes) in Claude.
2. Ask Claude for a short "practice knowledge entry" using the prompt in
   `AI-TRAINING.md`.
3. Paste the result under the right topic heading below, in the exact format
   of the example entry.
4. Run `npm run build`, commit, push. Vercel redeploys and the assistant
   picks it up automatically.

## FORMAT OF AN ENTRY

```markdown
### <Topic — a heading a question would match>
- **What it is:** 1–2 plain sentences.
- **Who it applies to:** who normally needs it.
- **How it works / steps:** the process in 3–6 short bullets.
- **Common questions:** one or two one-line answers.
- **Source:** <book name, chapter> — last reviewed <date>
```

Keep the whole file under 6,000 characters. When it grows, the oldest, least
asked entries get cut first — the assistant must stay sharp, not encyclopedic.

---

## Knowledge

<!-- Paste curated entries below. Delete this comment when the first entry is added. -->

_Knowledge base empty. Until entries are added the assistant answers from its
system prompt alone, which still covers GST, income tax, TDS/TCS, PAN/TAN,
entity formation, IEC, assessments, notices and appeals at a general level._