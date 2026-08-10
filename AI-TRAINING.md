# Training the tax assistant with the client's real tax books

The chatbot on the site (`/api/ask`, powered by Groq's Llama) is **grounded,
not fine-tuned**. That is deliberate: you cannot fine-tune a hosted model with
your API key, and you should not want to — grounding by a knowledge file keeps
every answer inside the guardrails the site already enforces (never states a
current rate/due date/penalty, tax topics only).

"Training" = turning the client's tax books into short entries in
**`lib/knowledge/tax-books.md`**, which the server injects into every request.

## The one-time setup

1. Create a free key at [console.groq.com](https://console.groq.com) (free
   tier, Llama 3.3 70B).
2. In Vercel → Settings → Environment Variables add:
   | Name | Value |
   |---|---|
   | `GROQ_API_KEY` | `gsk_…` |
   | `GROQ_MODEL` | `llama-3.3-70b-versatile` (optional override) |
3. Redeploy. The chat launcher (bottom-right corner) now answers for real.
   Without the key the route returns a friendly "not switched on yet" message
   and points to the contact form — nothing breaks.

## The training workflow (repeat per book)

1. **Take the client's book** (PDF/DOCX/text) and paste the relevant chapters
   into Claude.
2. **Ask Claude for practice-knowledge entries**, one per topic, using this
   prompt (paste as-is):

   > You are preparing a knowledge base for an Indian tax & GST practice's
   > website assistant. From the text I provide, write practice-knowledge
   > entries. Rules:
   > - One entry per topic; each entry uses exactly these fields:
   >   `### <Topic>`, `- **What it is:**`, `- **Who it applies to:**`,
   >   `- **How it works / steps:**` (3–6 short bullets), `- **Common questions:**` (1–2 one-liners),
   >   `- **Source:**`.
   > - Plain English, no jargon without a definition.
   > - NEVER include numbers that can change: no rates, thresholds, due dates,
   >   penalties, fees. If a figure matters, write "the current figure should
   >   be confirmed with the practice".
   > - Answer only from the text given. If the text does not cover the topic,
   >   say so.
   > - Keep each entry under 450 characters excluding the heading.
   > - Output only the entries, in Markdown.

3. **Paste Claude's entries** into `lib/knowledge/tax-books.md` under the
   `## Knowledge` heading, in the documented format.
4. **Verify against the book** — skim each entry once. A wrong mechanic is
   worse than no entry.
5. **Commit and push** (`npm run build` first). Vercel redeploys and the
   assistant immediately answers from the new knowledge.

## Capacity & rules of thumb

- The file is capped at **6,000 characters**. Trim the oldest, least-asked
  entries as it grows.
- The cap protects the model's focus and your token bill. Sharp and short
  beats exhaustive.
- This file is code, not chat history. Everything in it is invented-free and
  sourced — the `- **Source:**` line on every entry is what makes that possible.
- Numbers that change stay out by rule; put "confirm with the practice" in
  their place. The site's paranoia here is not a constraint to fight — it is
  what keeps a wrong answer from costing a client money.