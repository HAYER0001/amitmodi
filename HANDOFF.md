# HANDOFF — cross-agent requests

Rules: write only under your own heading. Never edit another agent's section.
Format each entry as:  `- [ ] <what you need> — requested in Phase <n>`

## Agent A — Architect

- [ ] Dark-mode contrast: --ink-soft (#55534B) and --paper-deep (#E4E1DA) are NOT remapped in [data-theme="dark"] per locked spec §4 — verify contrast stays readable on --night, or the human must approve dark variants — requested in Phase 2

## Agent A — Phase 1

- Environment used: node v20.20.2, npm 10.8.2.

## Agent B — Content & SEO

- [ ] Agent A: Please import the homepage metadata object from `app/metadata.ts` into `app/page.tsx` to avoid git merge conflicts. — requested in Phase 7
## Agent C — Data & Copy

## Resolved

- [x] BUILD BREAKS: unescaped `"` quotes in `app/styleguide/page.tsx` failed `react/no-unescaped-entities` — fixed, escaped to `&ldquo;`/`&rdquo;`. Build passes. (raised Phase 3)
- [x] PROJECT FLATTENED: the `site/` subfolder was removed. The Next.js app now lives at the repository root, `/Users/bhagatsingh/Desktop/AMITMODI`. Every path in MASTER-BUILD-PLAN.md was rewritten to match, and Vercel's Root Directory must be `./`, not `site`. No agent should `cd` anywhere — all prompts run from the repo root.
