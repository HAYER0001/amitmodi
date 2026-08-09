# MASTER BUILD PLAN
## "Compliance in Check" — GST, Tax & Compliance Practice Website
### 20 phases × 3 parallel AI agents = 60 copy-paste prompts

---

## 0. HOW TO USE THIS DOCUMENT

You will run **three AI coding agents at the same time**. This document gives you
**60 prompts**: 20 phases, 3 prompts per phase (one per agent).

> ## 📍 One folder, one working directory
>
> Everything — the Next.js app, the planning documents, the reference video — lives in:
>
> ```
> /Users/bhagatsingh/Desktop/AMITMODI
> ```
>
> **Every command in this document runs from there.** Every path in every prompt is relative
> to it. No prompt asks any agent to `cd` anywhere, and there is no `site/` subfolder.
> If an agent starts inventing subdirectories, point it back at this line.

**The loop, per phase:**

1. Open three terminals. One agent per terminal, all pointed at the same project folder.
2. Copy **Prompt A** into Agent A, **Prompt B** into Agent B, **Prompt C** into Agent C.
   Paste all three within a minute of each other — they are designed to run concurrently.
3. Wait until **all three** report done and have committed.
4. Run the phase's **Gate check** yourself (one command, given at the end of each phase).
5. Only then move to the next phase.

**Never start a phase before the previous phase's gate passes.** Each phase assumes the
previous one's files exist. Skipping ahead is the single fastest way to break this build.

**⭐ Phase 4 is the exception.** It has no agent-written brief — it contains **41
copy-paste prompts you run yourself** in Gemini and Tripo 3D, each one telling you the exact
filename and the exact folder to save into. Its three agent prompts build the code that
consumes those files. You can run them immediately and generate the artwork afterwards;
every component is built to survive missing assets. Any later phase that needs a specific
file carries a **📦 Assets used here** note pointing back to the Phase 4 list.

Every prompt is self-contained: it names its own files, its own commands, and its own
finish line. You do not need to explain context to the agents — the prompt does it.

---

## 1. THE THREE AGENTS

| | Agent A | Agent B | Agent C |
|---|---|---|---|
| **Your tool** | Big Pickle (primary CLI) | Antigravity — Gemini 3.1 Pro CLI | OpenRouter free model |
| **Role** | **Architect** | **Content & SEO Engineer** | **Data & Copy Hand** |
| **Gets** | Hard architecture, animation, 3D, state, build config, anything that can break the build | Pages, schema, SEO/GEO, MDX, long-form content, structured data | Mechanical, fully-specified work: JSON/TS data files, constants, alt text, redirects, checklists |
| **Never gets** | Bulk repetitive typing | Build config, `package.json`, animation internals | Anything requiring a judgement call |

**If your tool names differ, ignore the top row — the roles are what matter.** A stays the
strongest model, B the second strongest, C the free one.

**Why C's tasks look easy:** a free model given an ambiguous task will hallucinate a plausible
wrong answer and cost you an hour of debugging. Every Prompt C in this document specifies the
exact file, exact shape, and exact content, so there is nothing left to get creative about.
That is not underuse — it is the correct use of a weak model in a parallel pipeline, and it
keeps A and B free for work only they can do.

---

## 2. GOLDEN RULES — these are repeated inside every prompt, on purpose

1. **File ownership is absolute.** Each agent may create or edit only files inside its own
   ownership zone for that phase. Touching another agent's file is the only way three parallel
   agents can corrupt each other's work. If an agent needs a change in someone else's file, it
   writes the request into `HANDOFF.md` under its own heading and moves on.
2. **Only Agent A runs installs.** `npm install`, `npm uninstall`, and anything that rewrites
   `package.json` or `package-lock.json` belong to A alone. B and C running installs
   simultaneously will corrupt the lockfile.
3. **Commit narrowly, never `git add .`** — always `git add <explicit paths>`. `git add .`
   will sweep up another agent's half-finished files.
4. **Always `git pull --rebase` before `git push`.** Every prompt ends with the exact sequence.
5. **Never invent a fact about the business.** Name, address, phone, fees, credentials,
   client counts and years of experience come from `BRAND-FACTS.md` only. If a field says
   `TBD`, the agent omits that UI entirely — it does not write a placeholder, a lorem line,
   or a plausible-sounding guess. Fabricated credentials on a tax practice's site are a real
   liability, not a cosmetic bug.
6. **Never invent a legal fact either.** Due dates, penalty amounts, section numbers, fee
   figures and turnaround times must be marked `<!-- VERIFY -->` in the source if the agent
   is not certain. Phase 20 sweeps every `VERIFY` marker for human sign-off before launch.
7. **Every command runs from a prompt.** No agent should tell you "now run X yourself." If a
   command is needed, it is written inside the prompt and the agent runs it.
8. **No secrets in the repo.** API keys go in `.env.local` (git-ignored) and in the Vercel
   dashboard. Any agent that writes a key into a tracked file has failed the phase.

---

## 3. FILE OWNERSHIP MAP

**Everything lives in one folder. There is no `site/` subfolder.** The Next.js app, the
planning documents and the reference material all sit together at the repository root, which
is also where you run every command in this plan:

```
/Users/bhagatsingh/Desktop/AMITMODI/          ← git root · run all commands here
│
├── app/                             ── the Next.js App Router
│   ├── layout.tsx  globals.css      A
│   ├── api/                         A   route handlers
│   ├── services/  insights/  tools/ B   pages and routes
│   ├── sitemap.ts  robots.ts        B
│   └── llms.txt/  llms-full.txt/    B
├── components/
│   ├── ui/                          A   primitives, motion, 3D
│   ├── sections/                    A   hero, scroll sections
│   ├── content/                     B   content-driven blocks
│   └── seo/                         B   JSON-LD emitters
├── content/                         B   MDX: blog, guides, glossary, cities
├── data/                            C   typed data: services, faqs, cities, fees
├── lib/                             A   helpers, motion, seo, calc
├── types/                           A   shared TypeScript types
├── styles/tokens.css                A
├── tools/                           A   alpha-key.swift, batch-key.sh
├── public/
│   ├── images/                      C   finished, keyed assets
│   ├── images/_raw/                 you generated files land here (git-ignored)
│   ├── models/                      A   .glb from Tripo
│   ├── video/                       you optional Veo output
│   └── docs/                        C   lead-magnet PDFs
│
├── next.config.ts  tsconfig.json    A   config
├── package.json  .prettierrc        A
├── middleware.ts                    A   (Phase 16)
│
├── MASTER-BUILD-PLAN.md             this file
├── BRAND-FACTS.md                   you — fill before Phase 3
├── HANDOFF.md                       all agents (own heading only)
├── buisness.md  instrtion.md        the original brief
└── *.mp4  attachment_*.png          reference material (git-ignored)
```

**Every path in every prompt is relative to this folder.** An agent's working directory is
always `/Users/bhagatsingh/Desktop/AMITMODI`. No prompt asks anyone to `cd` anywhere.

**Rule of thumb:** A owns anything that runs, B owns anything that reads, C owns anything
that lists.

---

## 4. THE CREATIVE CONCEPT — "Compliance in Check"

The reference video (`moneyincheck-1r.mp4`) is a literary site built on a chess metaphor.
We keep its *visual language* completely and swap its *vocabulary* for tax compliance.

**The thesis:** tax compliance is chess, not paperwork. Most businesses react move by move
and get checkmated by a deadline. This practice plays the position ahead of time.

| Reference used | Our translation |
|---|---|
| Chessboard grid background | **Ledger grid** — accountant's ruled paper, same faint 8×8 feel |
| Chess notation marginalia (`Nf3`, `Bc4`) | **Statute marginalia** — `Sec 44AB`, `GSTR-3B`, `Form 26AS`, `Rule 46`, `u/s 139(1)` in pencil, scattered, low opacity, slightly rotated |
| Floating cut-out dollar bills | **Cut-out ₹500 notes, revenue stamps, brass seals, a steel paperclip** — desaturated, drop-shadowed |
| Hand-drawn ink figures | **Indian business owners** — shopkeeper, exporter, textile trader, startup founder — same sketchy ink line style |
| Book-spread horizontal gallery | **Compliance-guide spreads** — filing calendars, penalty tables, flowcharts |
| Chess knight hero object | **Brass chess knight on a ledger board**, rupee coins as pawns (3D) |
| "The Book" / "The Author" | **"The Practice" / "The Principal"** |
| Emerald green | Kept exactly — reads as both money and "cleared/approved" |

### Design tokens (locked — every agent uses these, no substitutions)

```
--paper:        #EFEDE8   warm newsprint, the dominant surface
--paper-deep:   #E4E1DA   section alternation
--ink:          #14140F   body text, near-black warm
--ink-soft:     #55534B   secondary text
--rule:         #D9D6CE   ledger grid lines, hairlines
--seal:         #0A6B4E   primary accent — CTAs, active states, key numbers
--seal-deep:    #064834   hover
--stamp:        #B3392B   RESERVED: deadlines, penalties, warnings only. Never decorative.
--brass:        #A8842C   trust badges, credential marks
--night:        #12130F   dark-mode surface
```

**Type stack** (all free, all loaded via `next/font` — zero external requests):

```
Display   Instrument Serif        — huge scroll-scaled headlines, high contrast Didone feel
Body      Newsreader              — editorial serif body copy, reads long-form beautifully
Label     IBM Plex Mono           — small-caps eyebrows, statute refs, table figures
Margin    Caveat                  — the pencil marginalia only, never UI text
```

**Motion law:** everything eases `[0.16, 1, 0.3, 1]`. Nothing bounces. Nothing spins for
decoration. All motion respects `prefers-reduced-motion`.

**The line that must never be crossed:** this is a tax practice, not an art project. Every
animation must survive the question *"does this help a stressed business owner with a GST
notice find the answer faster?"* If not, cut it. The editorial styling earns trust and
dwell time; gratuitous motion costs Core Web Vitals and rankings.

---

## 5. LOCKED TECH STACK

| Layer | Choice | Why locked |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | Required by `instrtion.md` |
| Styling | Tailwind CSS v4 + CSS custom properties | Zero unused CSS shipped |
| Motion | Framer Motion + Lenis smooth scroll | Required by `instrtion.md` |
| 3D | React Three Fiber + Drei, self-hosted `.glb` | See note below |
| Content | MDX via `next-mdx-remote` + local files | No CMS cost, git-versioned |
| Forms | React Hook Form + Zod | Type-safe validation both sides |
| Email | Resend | Simplest reliable transactional sender |
| Deploy | Vercel + GitHub | Required by `instrtion.md` |
| Analytics | GA4 + Vercel Analytics | Required by `instrtion.md` |

> **Note on 3D.** `instrtion.md` specifies a Spline embed. We implement the identical visual
> with a self-hosted `.glb` through React Three Fiber instead, because the Spline runtime adds
> roughly 1 MB of blocking JavaScript and will cost you LCP — the exact metric this build is
> optimising for. Phase 7 Prompt A contains a drop-in Spline variant if you prefer the
> original approach; the rest of the build is unaffected either way.

---

## 6. PHASE INDEX

| # | Phase | A builds | B builds | C builds |
|---|---|---|---|---|
| 1 | Foundation & Deploy Pipeline | Next.js scaffold, config, GitHub | Vercel, docs | `.gitignore`, HANDOFF |
| 2 | Design System & Tokens | tokens, Tailwind, fonts | type scale docs | colour/spacing constants |
| 3 | Content Truth Layer | — | brand ingest, copy deck | services/fees/FAQ data |
| 4 | Asset Generation ⭐ | alpha-key tool + 3D loader | captions + image sitemap | image manifest + alt text |
| 5 | Layout Shell | nav, footer, scroll rail | breadcrumbs, skip links | nav/footer link data |
| 6 | Motion & Scroll Engine | Lenis, motion primitives | reduced-motion docs | easing constants |
| 7 | Hero & Opening Sequence | hero, 3D, collage | hero copy variants | marginalia token list |
| 8 | Homepage Scroll Narrative | scroll sections | narrative copy | stats/proof data |
| 9 | Services Architecture | dynamic routes, templates | service page bodies | service registry |
| 10 | The Eight Service Pages | interactive blocks | all 8 deep bodies | checklists + doc lists |
| 11 | Compliance Tools | 5 calculators | tool explainer copy | rate/slab tables |
| 12 | Lead Capture Funnel | multi-step form, API | form copy, thank-you | form field schema |
| 13 | Trust & Social Proof | carousel, badges | case studies (STAR) | testimonial data |
| 14 | Insights Engine (MDX+ISR) | MDX pipeline, ISR | 12 launch articles | tags/authors data |
| 15 | Knowledge Base | glossary UI, gating | glossary + guides | A–Z term data |
| 16 | GEO / LLM Readiness | middleware, negotiation | `llms.txt`, MD mirrors | citation-stat list |
| 17 | Technical SEO & Schema | metadata infra | all JSON-LD, sitemap | keyword→URL map |
| 18 | Local & Multi-City SEO | city routes, map | city page bodies | city/jurisdiction data |
| 19 | Performance & CWV | budgets, bundle, images | image audit | asset compression pass |
| 20 | Security, Analytics, Launch | CSP, GA4, headers | legal pages | launch checklist sweep |

---

# ══════════════════════════════════════
# PHASE 1 — FOUNDATION & DEPLOY PIPELINE
# ══════════════════════════════════════

**Goal:** a running Next.js 15 app, on GitHub, auto-deploying to Vercel, before a single
line of design work exists.

**Done when:** `npm run dev` serves a page locally, the repo is on GitHub, and a Vercel URL
returns that same page.

### ▶ PROMPT 1-A — Agent A (Architect)

```text
You are Agent A (Architect) on a 3-agent parallel build. You own build configuration and
architecture. Do not edit files outside your ownership zone.

CONTEXT
We are building a website for an Indian GST / income-tax / compliance practice. The working
folder is the current directory. Read ./buisness.md and ./instrtion.md before you start —
they define the services and the technical requirements. Read ./MASTER-BUILD-PLAN.md
sections 2 through 5 for the rules, the design tokens, and the locked tech stack.

TASK
1. Scaffold a Next.js 15 project into a subfolder named `site`:
   npx create-next-app@latest site --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
2. cd into `site` and install the locked dependencies in ONE command:
   npm install framer-motion lenis @react-three/fiber @react-three/drei three next-themes react-hook-form zod @hookform/resolvers next-mdx-remote gray-matter reading-time resend clsx tailwind-merge
   npm install -D @next/bundle-analyzer @types/three prettier prettier-plugin-tailwindcss
3. Create `next.config.ts` with: reactStrictMode on, images configured for AVIF+WebP
   formats, `poweredByHeader: false`, compress on, and the bundle analyzer wired behind an
   `ANALYZE=true` env flag. Leave a clearly-marked empty `redirects()` and `headers()`
   function — later phases fill them.
4. Create `tsconfig.json` paths for `@/components`, `@/lib`, `@/data`, `@/content`.
5. Create `.prettierrc` with the tailwind plugin.
6. Create these empty-but-committed directories with a `.gitkeep` in each:
   components/ui, components/sections, components/content, components/seo,
   content/blog, content/guides, content/glossary, data, lib,
   public/images, public/models, public/docs, styles
7. Replace `app/page.tsx` with a minimal placeholder that renders exactly:
   an <h1> reading "Build in progress" and a <p> reading the current phase number.
   No styling work — that is Phase 2.
8. Verify the app builds and runs:
   npm run build
   If the build fails, fix it before continuing. Do not proceed with a failing build.

GIT
From the repository root (the folder containing MASTER-BUILD-PLAN.md):
   git init -b main
   git add app components lib data content styles types public next.config.ts package.json tsconfig.json .prettierrc
   git commit -m "phase-1(A): next.js 15 scaffold, locked deps, build config"

CONSTRAINTS
- You are the ONLY agent permitted to run npm install in this entire build. If you see a
  request in HANDOFF.md for a package, you install it — nobody else does.
- Do not create any page content, styling, or components beyond the placeholder above.
- Do not run `git add .` — add explicit paths only.

REPORT WHEN DONE
Print: the Next.js version installed, the full dependency list with versions, and the
output of `npm run build` (the route table). Then write into HANDOFF.md under a heading
"## Agent A — Phase 1" the exact node and npm versions you used.
```

### ▶ PROMPT 1-B — Agent B (Content & SEO Engineer)

```text
You are Agent B (Content & SEO Engineer) on a 3-agent parallel build. You own content,
pages, and SEO. Do not edit files outside your ownership zone.

CONTEXT
Read ./buisness.md, ./instrtion.md, and ./MASTER-BUILD-PLAN.md sections 2 through 6.
Agent A is scaffolding the Next.js app into this same folder right now. Do NOT create or edit
app/, components/, lib/, styles/, types/, or any config file this phase — you will collide
with A. You are writing .md documents at the root only.

TASK — you are writing documentation only this phase, at the repository root.

1. Create `DEPLOYMENT.md` containing a complete, numbered, zero-assumed-knowledge runbook:
   - Creating the GitHub repository from the CLI with `gh repo create`, including how to
     authenticate `gh` first, and the fallback if `gh` is not installed (create via web UI,
     then `git remote add origin`).
   - Connecting that repo to Vercel: `npm i -g vercel`, `vercel login`, `vercel link`,
     `vercel --prod`. Include the answers to each interactive prompt Vercel asks, given our
     project lives in the `` subdirectory — the root-directory setting is the one people
     get wrong, so call it out explicitly.
   - The full environment-variable table this project will eventually need, with which are
     required at build time vs runtime, and where each is set:
       NEXT_PUBLIC_SITE_URL, RESEND_API_KEY, CONTACT_TO_EMAIL,
       NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_GTM_ID
     Mark clearly that none of these values are ever committed to git.
   - Custom domain attachment on Vercel, with the exact DNS records (A record and CNAME)
     and the difference between apex and www configuration.
   - How to roll back a bad deploy from the Vercel dashboard in under a minute.

2. Create `CONTENT-STRATEGY.md` — the editorial spine of this build. Include:
   - The eight service lines from buisness.md, each with: the primary commercial keyword a
     business owner would actually type, 3 long-tail variants, and the search intent stage
     (problem-aware / solution-aware / ready-to-hire).
   - A hub-and-spoke internal-linking map: which guides link into which service pages, and
     which service pages link into which calculators.
   - The seasonal calendar for Indian tax compliance — the months where search demand spikes
     (ITR season, GST annual return, TDS quarters, audit deadlines) and what content must be
     live 6 weeks before each spike.
   - A "quotable statistics" list: 20 factual, self-contained sentences of the form
     "GST registration is granted within N working days of ARN generation" that AI search
     engines can lift verbatim as citations. Mark EVERY one with `<!-- VERIFY -->` because
     you must not assert an unverified compliance fact — a human confirms each before launch.

3. Create `README.md` at the repository root: what this project is, the three-agent workflow,
   how to run it locally, and a link to the other two docs.

GIT
   git add DEPLOYMENT.md CONTENT-STRATEGY.md README.md
   git commit -m "phase-1(B): deployment runbook, content strategy, readme"

CONSTRAINTS
- Do not touch app/, components/, lib/, styles/, types/ or any config file — Agent A owns
  the whole application tree this phase. You write .md documents at the root only.
- Do not invent any fact about the business. Where a fact is needed, reference
  BRAND-FACTS.md as the source and leave the placeholder.
- Every compliance fact, due date or penalty figure gets a `<!-- VERIFY -->` marker.

REPORT WHEN DONE
List the three files created and the number of keywords mapped in CONTENT-STRATEGY.md.
```

### ▶ PROMPT 1-C — Agent C (Data & Copy Hand)

```text
You are Agent C on a 3-agent parallel build. Your job is precise, mechanical file creation.
Follow the specification exactly. Do not add anything that is not specified. Do not be
creative. If something is ambiguous, write the literal text given and move on.

CONTEXT
Working folder is the current directory. Do NOT create or edit app/, components/, lib/,
styles/, types/ or any config file — another agent is working there right now.

TASK — create exactly three files at the repository root.

FILE 1 — `.gitignore`
Write a .gitignore covering: node_modules, .next, out, build, .DS_Store, *.pem,
npm-debug.log*, yarn-debug.log*, .env, .env.local, .env*.local, .vercel, *.tsbuildinfo,
next-env.d.ts, coverage, .turbo, and .idea. Add a comment line above each group naming
what it is. Add this line with its comment at the end:
   # Never commit secrets — see DEPLOYMENT.md
   .env*.local

FILE 2 — `HANDOFF.md`
Create it with exactly this structure and nothing else:

   # HANDOFF — cross-agent requests
   
   Rules: write only under your own heading. Never edit another agent's section.
   Format each entry as:  `- [ ] <what you need> — requested in Phase <n>`
   
   ## Agent A — Architect
   
   ## Agent B — Content & SEO
   
   ## Agent C — Data & Copy
   
   ## Resolved

FILE 3 — `.env.example`
Create a template listing every variable name with an empty value and a one-line comment
above each explaining what it is. Include exactly these keys in this order:
   NEXT_PUBLIC_SITE_URL
   RESEND_API_KEY
   CONTACT_TO_EMAIL
   NEXT_PUBLIC_GA_ID
   NEXT_PUBLIC_GTM_ID
Put no real values in this file. Every value must be empty after the `=`.

GIT
   git add .gitignore HANDOFF.md .env.example
   git commit -m "phase-1(C): gitignore, handoff log, env template"

CONSTRAINTS
- Exactly three files. Do not create a fourth.
- Do not run npm install or any npm command.
- Do not use `git add .` — use the explicit paths above.

REPORT WHEN DONE
Print the contents of all three files so they can be verified.
```

### ✅ Phase 1 gate check

```bash
npm run build && cd .. && git log --oneline | head -5
```

You should see a successful build and three commits. Then follow `DEPLOYMENT.md` to push to
GitHub and link Vercel — do that now, before Phase 2, so every later phase auto-deploys.

---

# ══════════════════════════════════
# PHASE 2 — DESIGN SYSTEM & TOKENS
# ══════════════════════════════════

**Goal:** the entire "Compliance in Check" visual language exists as tokens, before any
component uses it. This is what stops three agents producing three different-looking sites.

**Done when:** a `/styleguide` route renders every colour, type size, and surface treatment.

### ▶ PROMPT 2-A — Agent A (Architect)

```text
You are Agent A (Architect). You own styling infrastructure. Work inside the project root only.

CONTEXT
Read ./MASTER-BUILD-PLAN.md section 4 — "THE CREATIVE CONCEPT". The design tokens and type
stack there are LOCKED. Do not substitute, improve, or add colours. Also study these
reference frames if present: ../attachment_147590016.png. The visual target is a warm
newsprint editorial site with a faint ledger grid, huge Didone serif headlines, deep green
accents, and pencil marginalia.

TASK

1. `styles/tokens.css` — declare every token from section 4 as a CSS custom property on
   :root. Add a `[data-theme="dark"]` block that remaps paper→night, ink→#EDEAE3,
   rule→#2A2B24, keeping --seal and --stamp identical in both themes. Add spacing tokens on
   a 4px base (--s-1 through --s-16), radius tokens (--r-sm 2px, --r-md 6px, --r-pill 999px),
   and one shadow token --shadow-cut for the floating cut-out collage elements:
   a soft, offset, low-opacity drop shadow that reads as paper lifted off paper.

2. Configure Tailwind v4 in `app/globals.css` using @theme to expose every token as a
   utility: bg-paper, text-ink, border-rule, bg-seal, text-stamp, and so on. Import
   tokens.css first.

3. Load the four typefaces with next/font/google in `app/layout.tsx`, each assigned to a CSS
   variable: Instrument Serif → --font-display, Newsreader → --font-body,
   IBM Plex Mono → --font-label, Caveat → --font-margin. Use display:'swap' and subset
   'latin'. These must be self-hosted by next/font — zero requests to fonts.googleapis.com.

4. Build the fluid type scale in globals.css using clamp(), from mobile 375px to 1920px:
   --t-display  clamp(3.5rem, 12vw, 11rem)    line-height 0.88, letter-spacing -0.03em
   --t-h1       clamp(2.5rem, 6vw, 5rem)      line-height 0.95
   --t-h2       clamp(1.75rem, 3.5vw, 3rem)   line-height 1.05
   --t-h3       clamp(1.25rem, 2vw, 1.75rem)
   --t-body     clamp(1rem, 1.1vw, 1.1875rem) line-height 1.65
   --t-label    0.75rem, letter-spacing 0.14em, uppercase
   The display size must genuinely fill the viewport width on desktop like the reference.

5. Build the signature surface treatments as utility classes in globals.css:
   - `.ledger-grid` — a repeating-linear-gradient background producing faint 1px rules in
     --rule at a 96px square pitch. Must be pure CSS, no image file.
   - `.paper` — --paper background plus a very subtle noise via an inline SVG feTurbulence
     data-URI at under 3% opacity. Keep the data-URI under 400 bytes.
   - `.cut-out` — applies --shadow-cut, for the floating collage images.
   - `.marginalia` — --font-margin, --ink-soft at 45% opacity, small, and a CSS custom
     property --rot that each instance sets for its own rotation.

6. Style the scrollbar to match the palette (thin, --rule track, --ink-soft thumb) and add
   `:focus-visible` outlines in --seal at 2px offset 3px across all interactive elements.

7. Set up next-themes in app/layout.tsx with attribute="data-theme", defaultTheme="light",
   and suppressHydrationWarning on <html>.

8. Run `npm run build` and confirm zero errors before committing.

GIT
   git add styles/tokens.css app/globals.css app/layout.tsx
   git commit -m "phase-2(A): design tokens, fluid type scale, paper and ledger surfaces"

CONSTRAINTS
- Exactly the colours in section 4. If you feel a colour is missing, add a request to
  HANDOFF.md instead of inventing one.
- No component files this phase — tokens and global CSS only.
- All motion-related CSS is Phase 6, not now.

REPORT WHEN DONE
Print the final token list and the computed display font-size at 375px, 1280px and 1920px.
```

### ▶ PROMPT 2-B — Agent B (Content & SEO Engineer)

```text
You are Agent B (Content & SEO Engineer). This phase you are documenting the design system
and building the styleguide page content. Work inside ./app/styleguide only, plus one
root doc. Agent A is editing globals.css and layout.tsx right now — do not open those files.

TASK

1. Create `app/styleguide/page.tsx` — an internal reference page, not linked from navigation.
   It must render, using only Tailwind utility classes that Agent A is defining
   (bg-paper, text-ink, border-rule, bg-seal, text-stamp, font-display, font-body,
   font-label, font-margin) and the classes .ledger-grid .paper .cut-out .marginalia:
   - A swatch row for all nine palette colours, each showing the token name, the hex, and
     its contrast ratio against --paper and against --ink. Label each ratio PASS/FAIL for
     WCAG AA (4.5:1) and AAA (7:1) at body size.
   - A full type-scale specimen: display, h1, h2, h3, body, label — each set in real
     sentences about GST and income tax, never lorem ipsum.
   - A demonstration of `.marginalia` showing six statute references — Sec 44AB, GSTR-3B,
     Form 26AS, Rule 46, u/s 139(1), ITC-04 — each at a different --rot rotation.
   - A `.ledger-grid` panel and a `.paper` panel side by side.
   - Add `export const metadata = { robots: { index: false, follow: false } }` — this page
     must never be indexed.

2. Create `DESIGN-SYSTEM.md` at the repository root documenting: the concept translation
   table from MASTER-BUILD-PLAN section 4, when to use --stamp (deadlines, penalties and
   warnings ONLY — never decoration), the marginalia vocabulary (a list of 30 real statute
   and form references usable as background texture), and the rule that display type is used
   at most twice per page so it stays an event rather than a texture.

3. Add to DESIGN-SYSTEM.md an accessibility contract: minimum 44×44px touch targets,
   visible focus on every interactive element, all colour-carried meaning also carried by
   text or icon, and full keyboard operability of every component built in later phases.

GIT
   git add app/styleguide/page.tsx DESIGN-SYSTEM.md
   git commit -m "phase-2(B): styleguide page, design system documentation"

CONSTRAINTS
- Do not open or edit globals.css, tokens.css, or layout.tsx. If a class you need does not
  exist, note it in HANDOFF.md under "## Agent B — Content & SEO" and use the class name
  anyway — Agent A will define it.
- Never use lorem ipsum. Every specimen string is real copy about tax compliance.

REPORT WHEN DONE
List every Tailwind class and CSS class your page depends on, so Agent A can confirm each
one exists.
```

### ▶ PROMPT 2-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Precise, mechanical file creation. Follow the spec literally. Do not
improvise. Do not add extra entries beyond what is specified.

CONTEXT
Work only in ./data. Do not touch any other folder.

TASK — create exactly two TypeScript files.

FILE 1 — `data/design-tokens.ts`
Export a single frozen const named `tokens` typed with `as const`, mirroring these exact
values so JavaScript code can read them without parsing CSS:

  colors: paper #EFEDE8, paperDeep #E4E1DA, ink #14140F, inkSoft #55534B, rule #D9D6CE,
          seal #0A6B4E, sealDeep #064834, stamp #B3392B, brass #A8842C, night #12130F
  fonts:  display 'var(--font-display)', body 'var(--font-body)',
          label 'var(--font-label)', margin 'var(--font-margin)'
  ease:   standard [0.16, 1, 0.3, 1]
  radius: sm '2px', md '6px', pill '999px'

Add a TypeScript type export `TokenColor` that is the union of the colour key names.

FILE 2 — `data/marginalia.ts`
Export a const array named `MARGINALIA` typed `readonly string[]`. It contains exactly these
40 strings in this order, each one a real Indian tax reference used as background texture:

  "Sec 44AB", "GSTR-1", "GSTR-3B", "GSTR-9", "GSTR-9C", "Form 26AS", "AIS", "TIS",
  "u/s 139(1)", "u/s 139(4)", "u/s 143(1)", "u/s 148", "Rule 46", "Rule 36(4)",
  "ITC-04", "CMP-08", "Form 16", "Form 16A", "Form 26Q", "Form 24Q", "Form 27Q",
  "PAN 49A", "PAN 49AA", "REG-01", "REG-06", "DRC-01", "DRC-03", "APL-01",
  "IEC", "RCMC", "LUT", "Sec 80G", "Sec 12A", "Sec 194C", "Sec 194J", "Sec 194Q",
  "Sec 206AB", "TAN", "e-Way Bill", "e-Invoice"

Then export a function `pickMarginalia(count: number, seed: number): string[]` that returns
a deterministic pseudo-random selection of that many entries. Deterministic matters: the
server and client must render the same marginalia or React will throw a hydration error.
Use a simple mulberry32 or equivalent seeded PRNG — do not use Math.random().

GIT
   git add data/design-tokens.ts data/marginalia.ts
   git commit -m "phase-2(C): token constants and marginalia vocabulary"

CONSTRAINTS
- Exactly 40 marginalia strings, in exactly the order given.
- Do NOT use Math.random() anywhere. The function must be deterministic for a given seed.
- Do not create any other file.

REPORT WHEN DONE
Print both files in full, and print the output of pickMarginalia(8, 1) to prove determinism
by calling it twice and showing identical results.
```

### ✅ Phase 2 gate check

```bash
npm run build && npm run dev
```

Open `http://localhost:3000/styleguide`. You should see the full palette, the type scale
filling the screen, and pencil marginalia. **If it does not look like expensive newsprint at
this point, stop and fix it here** — every later phase inherits this look.

---

# ═════════════════════════════════
# PHASE 3 — CONTENT TRUTH LAYER
# ═════════════════════════════════

**Goal:** every fact the site will ever state exists in one typed, verifiable place. No
component invents copy after this phase.

**Done when:** `data/services.ts` type-checks and covers all eight service lines.

### ▶ PROMPT 3-A — Agent A (Architect)

```text
You are Agent A (Architect). This phase you build the type system and content utilities that
everything downstream imports. Work inside ./lib and ./types only.

TASK

1. Create `types/content.ts` with strict TypeScript types. No `any`, no optional-everything.
   Define:
   - `Money` = { govtFee: number | 'on-request' | null; professionalFee: number | 'on-request' | null; currency: 'INR' }
   - `Turnaround` = { minDays: number; maxDays: number; note?: string }
   - `DocumentRequirement` = { id: string; label: string; appliesTo: string[]; mandatory: boolean; note?: string }
   - `FAQ` = { id: string; question: string; answer: string; verified: boolean }
   - `ProcessStep` = { order: number; title: string; description: string; owner: 'client' | 'firm' | 'government'; durationDays: number }
   - `Service` = { slug, name, shortName, category, oneLiner, primaryKeyword, secondaryKeywords[], intentStage, whoNeedsIt[], pricing: Money, turnaround: Turnaround, documents: DocumentRequirement[], process: ProcessStep[], faqs: FAQ[], penalties?, relatedSlugs[], statuteRefs[] }
   The `verified: boolean` field is load-bearing: any FAQ or figure not human-confirmed
   renders with a visible "pending verification" state in development and is omitted
   entirely from production builds. Build that rule into the types now.

2. Create `lib/content.ts` with pure, tested helpers:
   - `getService(slug)`, `getAllServices()`, `getServicesByCategory()`
   - `formatINR(n)` — Indian digit grouping (1,00,000 not 100,000). This is a real
     correctness issue, not cosmetic: Western grouping on an Indian tax site reads as
     amateur to exactly the audience you are trying to convert.
   - `formatTurnaround(t)` → "7–10 working days"
   - `verifiedOnly<T extends {verified:boolean}>(items)` — strips unverified entries when
     NODE_ENV === 'production'.

3. Create `lib/utils.ts` with `cn()` (clsx + tailwind-merge) and `slugify()`.

4. Create `lib/brand.ts` — reads and exposes the business facts. It must import from
   `data/brand.ts` (Agent C is creating that file this phase) and export a `brand` object
   plus a `hasFact(key)` guard. Any consumer calling for a `TBD` field gets `null`, and
   components are contractually required to render nothing rather than a placeholder.
   Write that contract as a comment at the top of the file.

5. Run `npx tsc --noEmit` and confirm zero type errors.

GIT
   git add types/content.ts lib/content.ts lib/utils.ts lib/brand.ts
   git commit -m "phase-3(A): content type system and formatting utilities"

CONSTRAINTS
- Do not write any actual service data — that is Agent C's file this phase.
- No `any` types. If you need an escape hatch, use `unknown` and narrow it.

REPORT WHEN DONE
Print the full `Service` type and demonstrate formatINR with 100000, 1500000 and 12345678.
```

### ▶ PROMPT 3-B — Agent B (Content & SEO Engineer)

```text
You are Agent B (Content & SEO Engineer). This phase you write the master copy deck — the
actual words that will sell this practice. Work in ./COPY-DECK.md at the repository root only.

CONTEXT
Read ./buisness.md for the eight service lines, ./BRAND-FACTS.md for what is and is not
known about the business, and ./CONTENT-STRATEGY.md which you wrote in Phase 1.

Read the ADVERTISING GUARDRAIL section at the bottom of BRAND-FACTS.md and obey whichever
box is ticked. If none is ticked, write in conservative mode: factual capability statements,
no superlatives, no "best/cheapest/guaranteed", no testimonials.

AUDIENCE — write for exactly this person, not for a marketing committee:
A 34-year-old who runs a business doing ₹2-8 crore a year. They have just received a notice,
or a deadline is 9 days away, or they are registering something for the first time. They are
anxious, they do not know the vocabulary, and they have been burned before by a consultant
who went quiet. They will hire whoever makes them feel like the problem is already handled.

TASK — write COPY-DECK.md containing:

1. Positioning: one sentence, under 15 words, that says what this practice does and for whom.
   Then three alternates. Then the reason each works.

2. The homepage narrative, section by section, matching the scroll structure:
   - Hero headline (max 7 words, display type) + subhead (max 25 words) + CTA label
   - The "what goes wrong" section — the cost of reacting instead of planning
   - The eight services as one-liners
   - The proof section — structure only, real numbers come from BRAND-FACTS.md
   - The process section — what actually happens after someone contacts them
   - The closing CTA
   Write 3 variants of the hero headline. They must feel like the reference site's voice:
   declarative, literary, confident, short. Not "We provide GST solutions."

3. For each of the eight services, write:
   - An H1 (under 60 characters, contains the primary keyword)
   - A meta title (under 60 chars) and meta description (under 155 chars, written for
     click-through, not for robots)
   - A 40-word direct answer that opens the page — this is the block AI search engines will
     quote, so it must be self-contained and factually complete on its own
   - Three paragraphs of body copy in plain language, with every piece of jargon defined
     inline on first use
   - The "who needs this" list
   - The penalty/risk paragraph — what happens if they do nothing

4. A lexicon table: 40 pieces of tax jargon mapped to how a normal person says it.
   (e.g. "Input Tax Credit" → "the GST you already paid on your purchases, which you can
   subtract from what you owe")

5. Microcopy: button labels, form field labels, error messages, empty states, the toast
   after a form submits, the 404 page. Every error message must say what to do next, never
   just what went wrong.

RULES
- Never state a fee, due date, penalty amount, or turnaround without a `<!-- VERIFY -->`
  marker immediately after it.
- Never state a client count, years of experience, or credential — those come from
  BRAND-FACTS.md and are currently TBD.
- Short sentences. No "leverage", "solutions", "seamless", "cutting-edge", "one-stop".
- Write the anxiety out of the reader. Competence, not enthusiasm.

GIT
   git add COPY-DECK.md
   git commit -m "phase-3(B): master copy deck for all pages and services"

REPORT WHEN DONE
Print the three hero headline variants and one complete service page copy block.
```

### ▶ PROMPT 3-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Precise, mechanical data entry from a specification. Do not invent values.
Where a value is unknown, use the literal placeholder specified. Do not be creative.

CONTEXT
Work only in ./data. Read ./buisness.md for the service list. Read
./types/content.ts if it exists (Agent A is writing it right now) — if it does not
exist yet, still write your file to match the shapes described below exactly.

TASK — create exactly two files.

FILE 1 — `data/brand.ts`
Export a const `BRAND` object. Every value is the string 'TBD' or null, because
BRAND-FACTS.md has not been filled in yet. Keys, exactly:
  tradingName, legalName, entityType, foundedYear, gstin, pan, domain,
  principal: { name, designation, membershipNo, yearsPractice, qualifications, linkedin },
  address: { line1, line2, city, state, pin, country: 'India', lat: null, lng: null },
  contact: { phone, whatsapp, email, gbpUrl },
  hours: an array of 7 objects { day, opens, closes } all with 'TBD',
  serviceArea: { primaryCity: 'TBD', cities: [], states: [] },
  proof: { clientsServed: null, returnsFiled: null, appealsHandled: null }
Add this comment at the top of the file, verbatim:
  // DO NOT INVENT VALUES. Fill from ./BRAND-FACTS.md only.
  // 'TBD' and null are meaningful: consumers must render nothing, not a placeholder.

FILE 2 — `data/services.ts`
Export a const `SERVICES` array with exactly EIGHT entries, one per line in buisness.md:
  1. pan-card-services            — "PAN Card Services"
  2. gst-registration             — "GST Registration"
  3. entity-formation             — "Formation & Registration of Entities"
  4. income-tax-tds-returns       — "Income Tax & TDS Returns Filing"
  5. gst-returns-filing           — "GST Returns Filing"
  6. income-tax-appeals           — "Appeals under the Income Tax Act"
  7. gst-appeals                  — "Appeals under the GST Act"
  8. import-export-licence        — "Import & Export Licence and Compliances"

For each entry fill these fields:
  slug, name, shortName, category ('registration' | 'filing' | 'litigation' | 'trade'),
  oneLiner (one factual sentence, max 20 words, describing what the service is —
    take the description straight from buisness.md, do not embellish),
  primaryKeyword (the phrase a business owner would type into Google),
  secondaryKeywords (exactly 4 realistic long-tail variants),
  intentStage ('problem-aware' | 'solution-aware' | 'ready-to-hire'),
  statuteRefs (2-4 real references, e.g. gst-registration → ['Sec 22 CGST Act', 'Form REG-01', 'Form REG-06']),
  relatedSlugs (2-3 other slugs from this same list),
  pricing: { govtFee: null, professionalFee: 'on-request', currency: 'INR' },
  turnaround: { minDays: 0, maxDays: 0, note: 'VERIFY — pending BRAND-FACTS.md' },
  documents: [], process: [], faqs: []
The empty arrays are filled in Phase 10. Leave them empty now.

Entry 3 (entity-formation) additionally gets a `subTypes` array with exactly:
  'Partnership Firm', 'Joint Venture', 'Society', 'Trust'

GIT
   git add data/brand.ts data/services.ts
   git commit -m "phase-3(C): brand placeholder object and eight-service registry"

CONSTRAINTS
- Exactly eight services. Not seven, not nine.
- Every pricing and turnaround number stays at null / 0 / 'on-request'. You must not
  invent a fee or a number of days. This is the single most important constraint in this task.
- Do not fill documents, process, or faqs — later phases own those.

REPORT WHEN DONE
Print the full services.ts file and confirm the count is exactly 8.
```

### ✅ Phase 3 gate check

```bash
npx tsc --noEmit && node -e "console.log(require('fs').readFileSync('data/services.ts','utf8').match(/slug:/g).length + ' services')"
```

---

# ══════════════════════════════════════
# PHASE 4 — ASSET GENERATION
# ══════════════════════════════════════

**This phase works differently from all the others.** In every other phase you paste three
prompts into three coding agents. Here, **you** generate the artwork first, then the agents
wire it into the code.

## The loop

| Step | Who | What |
|---|---|---|
| 1 | **You** | Copy a prompt below into **Gemini** or **Tripo 3D** |
| 2 | **You** | Save the result with the **exact filename** into the **exact folder** given |
| 3 | **You** | Run one command to add transparency |
| 4 | **Agents** | Prompts 4-A / 4-B / 4-C build the code that uses those files |

You can run Step 4 straight away and generate art afterwards — every component is built to
survive missing files, so the build stays green with an empty images folder.

## Three things to know about Gemini before you start

**1. It cannot make transparent images.** Everything comes back opaque. So you generate on a
background we can remove later: **pure white** for line drawings, **flat magenta** for
objects. Step 3 removes it. Every prompt below already says which one to use.

**2. You pick an aspect ratio, you don't type pixel sizes.** Gemini gives you roughly 1024px
on the long edge at whichever ratio you choose (1:1, 3:4, 4:3, 9:16, 16:9). Each asset below
tells you the ratio to pick and the final size to resize to in Step 3.

**3. Attach the anchor image every time.** This is the single most important habit in this
phase. Generate the two anchors first, then attach the relevant anchor to every follow-up
prompt. Without it you get twelve drawings by twelve different artists. Attach the **anchor**
each time, never the previous output — style drifts if you chain them.

## Where files go

```
public/images/_raw/     ← everything you generate lands here first (git-ignored)
public/images/          ← Step 3 writes the finished files here
public/models/          ← .glb files from Tripo go straight here
```

Create the folders now:

```bash
mkdir -p public/images/_raw public/models
```

---

# ═══════════════════════════════════════════
# STEP 1 — THE PROMPT LIBRARY (copy · paste · save)
# ═══════════════════════════════════════════

## A. THE TWO ANCHORS — generate these first, get them right

Everything else inherits from these two. Spend real time here; an hour on the anchors saves
redoing twelve figures later.

### `anchor-ink.png`
**Save to:** `public/images/_raw/anchor-ink.png` · **Gemini ratio:** 3:4

```text
Draw a single figure in loose black ink line art. Use one consistent pen weight throughout,
about two pixels, with no thick-and-thin variation. The linework is quick and imperfect,
with small breaks in the lines and slight overshoots where strokes cross, as if sketched in
under a minute by a confident illustrator. There is no shading, no cross-hatching, no fill
and no colour anywhere — pure black lines on nothing else. The subject is an Indian
shopkeeper in his forties standing behind a counter with his arms folded, wearing a plain
short-sleeved shirt, drawn from a slight angle rather than straight on. The background is
completely flat, even, pure white with nothing else in the frame. Leave generous white
margin on all four sides.
```

Regenerate until the lines look hand-drawn and a little scratchy. If it looks smooth,
vector-like, or like clip art, it is wrong — say *"looser, quicker, more imperfect linework,
let some strokes overshoot and some lines break"* and try again.

### `anchor-cutout.png`
**Save to:** `public/images/_raw/anchor-cutout.png` · **Gemini ratio:** 1:1

```text
Photograph a single crumpled Indian five hundred rupee note lying flat, shot from directly
above with flat, even, diffuse studio lighting. The image is almost entirely desaturated —
near greyscale, with only the faintest trace of colour left. Contrast is high and the
highlights are slightly blown out, the way a magazine photograph looks after being
photocopied once. The note's own creases and soft shadows are visible across its surface,
but it casts no shadow onto anything behind it. The background is a completely flat, even,
uniform magenta field, hex FF00FF, with no gradient, no texture and no shadow falling on it
anywhere. The note sits slightly off-centre and rotated a few degrees.
```

The flat magenta matters. If the background has any gradient or shadow, Step 3 cannot remove
it cleanly and you get a pink halo around the object.

---

## B. INK FIGURES — 12 files

**All 12:** attach `anchor-ink.png` · **ratio 3:4** · save to `public/images/_raw/`
· final size 900×1200

Each prompt below is complete and paste-ready. Attach the anchor, paste, save.

### `fig-shopkeeper.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a shopkeeper in his fifties standing behind a
counter with his arms folded, looking straight ahead. Leave generous white margin on all
sides.
```

### `fig-exporter.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a person in their thirties checking a stacked
cardboard shipping carton, holding a clipboard in one hand. Leave generous white margin on
all sides.
```

### `fig-textile-trader.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a fabric trader carrying a heavy bolt of cloth
balanced over one shoulder, mid-stride. Leave generous white margin on all sides.
```

### `fig-founder.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a young founder sitting cross-legged on the floor
with a laptop balanced on their knees, leaning forward slightly. Leave generous white margin
on all sides.
```

### `fig-restaurateur.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a restaurant owner leaning both forearms on a
counter, sleeves rolled up, looking out at the room. Leave generous white margin on all
sides.
```

### `fig-consultant.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a professional walking while reading a document
held in both hands, head down, mid-step. Leave generous white margin on all sides.
```

### `fig-worried.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: a person standing still holding an opened letter
in both hands, shoulders dropped, head lowered towards the page. Leave generous white margin
on all sides.
```

### `fig-relieved.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: the same person as a previous drawing, standing
upright with their shoulders back, the letter now lowered to their side, looking ahead.
Leave generous white margin on all sides.
```

### `fig-couple-shop.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw two figures in that identical style: a couple running a small shop together, one
stacking goods on a shelf while the other writes in a register. Leave generous white margin
on all sides.
```

### `fig-accountant-desk.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a new figure in that identical style: someone seated at a desk almost buried under
leaning stacks of paper files and folders, one hand on an open ledger. Leave generous white
margin on all sides.
```

### `fig-handshake.png`
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw two figures in that identical style: two people shaking hands mid-step, both turned
slightly towards each other, drawn from the side. Leave generous white margin on all sides.
```

### `fig-walking-row.png` — footer strip
**Ratio 16:9** (not 3:4) · final 2400×600 after cropping
```text
Use the attached drawing as the exact style reference — same artist, same pen weight, same
loose quick imperfect linework, same flat pure white background, no shading, no colour.
Draw a row of nine different people in that identical style, all walking from left to right,
seen from the side, evenly spaced across the width of the image and standing on the same
invisible ground line. Each person is a different age, build and posture — one carries a
briefcase, one pushes a handcart, one walks a dog. Leave white space above and below the row.
```
Generate at 16:9, then crop to the strip. Do not ask Gemini for a 4:1 image — there is no
such ratio and asking distorts the figures.

---

## C. CUT-OUT OBJECTS — 10 files

**All 10:** attach `anchor-cutout.png` · **ratio 1:1** · save to `public/images/_raw/`
· final size ~1200px longest edge

Every prompt ends with the same background sentence. Do not edit it — it is what makes
Step 3 work.

### `cut-rupee-500.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
single crisp Indian five hundred rupee note lying flat, shot from directly above, rotated a
few degrees off square. The background is a completely flat, even, uniform magenta field,
hex FF00FF, with no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-rupee-crumpled.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
heavily crumpled and partly unfolded rupee note, its creases catching the light, shot from
directly above. The background is a completely flat, even, uniform magenta field, hex
FF00FF, with no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-coin-stack.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
short leaning stack of seven Indian coins, shot from a low three-quarter angle so the edges
of the coins are visible. The background is a completely flat, even, uniform magenta field,
hex FF00FF, with no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-revenue-stamp.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
small perforated-edge revenue stamp, slightly curled at one corner, shot from directly
above. Its printed detail is visible as fine pattern but carries no readable words or
numbers. The background is a completely flat, even, uniform magenta field, hex FF00FF, with
no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-rubber-stamp.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
wooden-handled rubber office stamp standing upright, shot from a three-quarter angle. The
background is a completely flat, even, uniform magenta field, hex FF00FF, with no gradient,
no texture and no shadow falling on it anywhere.
```

### `cut-brass-seal.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
round brass embossing seal with a scissor-style handle, shot from a three-quarter angle, its
brass slightly worn and matte rather than shiny. The background is a completely flat, even,
uniform magenta field, hex FF00FF, with no gradient, no texture and no shadow falling on it
anywhere.
```

### `cut-paperclip.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
single large steel paperclip lying at an angle, shot from directly above, slightly bent out
of shape. The background is a completely flat, even, uniform magenta field, hex FF00FF, with
no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-file-folder.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
worn cardboard file folder tied with a cloth string, bulging with papers, shot from a
three-quarter angle. The background is a completely flat, even, uniform magenta field, hex
FF00FF, with no gradient, no texture and no shadow falling on it anywhere.
```

### `cut-calculator.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph an
old desktop calculator with large rounded buttons, shot from a high three-quarter angle. Its
display and buttons are blank with no numbers or symbols on them. The background is a
completely flat, even, uniform magenta field, hex FF00FF, with no gradient, no texture and
no shadow falling on it anywhere.
```

### `cut-ledger-book.png`
```text
Use the attached photograph as the exact style reference — same flat even lighting, same
near-greyscale desaturation, same high contrast and slightly blown highlights. Photograph a
thick hardbound accounting ledger lying closed with its spine towards the camera, corners
soft with wear, shot from a three-quarter angle. The background is a completely flat, even,
uniform magenta field, hex FF00FF, with no gradient, no texture and no shadow falling on it
anywhere.
```

---

## D. SURFACES — 2 files

**Ratio 1:1 and 16:9** · save to `public/images/_raw/`

### `tex-ink-blot.png` — ratio 1:1, final 800×800
```text
Draw a single small ink smudge in black on a completely flat, even, pure white background.
It is the kind of mark a fountain pen leaves when the nib catches — one irregular blot with
a couple of fine spatter dots near it. No other marks in the frame.
```

### `tex-torn-edge.png` — ratio 16:9, final 2400×200 after cropping
```text
Photograph the torn edge of a sheet of thick paper against a completely flat, even, pure
white background, shot from directly above so the ragged fibrous edge runs horizontally
across the full width of the frame. Near greyscale, high contrast, flat even lighting.
```
Crop the strip containing the torn edge out of the generated image.

> **Not generated, deliberately:** the paper grain and the ledger grid. Phase 2-A already
> draws both in pure CSS — the grain as an inline SVG turbulence pattern, the grid as a
> repeating gradient. Generating them would mean two extra downloads for something the
> browser makes for free, and Gemini does not tile seamlessly anyway.

---

## E. DOCUMENT SPREADS — 6 files

**Ratio 4:3** · save **directly** to `public/images/` (these stay opaque — no keying)
· final 1600×1100 · save as `.jpg`

These sit in the horizontal gallery on the homepage, so they keep their background.

**One rule for all six:** if a spread comes back with readable paragraphs of body text,
**regenerate it.** Gemini renders text well, and legible generated text is very often
plausible-looking nonsense. Nonsense that reads like tax guidance, inside a tax practice's
own imagery, is a credibility problem rather than a cosmetic one. Charts crisp, body copy
indistinct.

### `spread-filing-calendar.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. The left page shows a large twelve-month calendar grid
with some cells shaded, and the right page shows a simple bar chart. The body text on both
pages is deliberately indistinct — soft grey lines of type, too small and too soft to read
as words. Two thin green sticky tabs protrude from the right page edge. Near greyscale
except for the green tabs.
```

### `spread-penalty-table.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. Both pages are filled with a ruled table of rows and
columns, the ruling crisp and clear but every cell's text rendered as indistinct soft grey
marks too small to read as words. One green sticky tab on the top edge. Near greyscale
except for the green tab.
```

### `spread-gst-flow.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. The spread shows a large flowchart of boxes connected
by arrows across both pages. The boxes and arrows are crisp; the labels inside them are
indistinct soft grey marks too small to read as words. Near greyscale.
```

### `spread-itr-forms.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. The spread shows a comparison layout of several
form-like boxes arranged in a grid, each with ruled fields inside. All lettering is
indistinct soft grey marks too small to read as words. Three green sticky tabs along the
outer edge. Near greyscale except for the tabs.
```

### `spread-appeal-process.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. The spread shows a numbered vertical timeline running
down the left page and a dense block of indistinct grey body text on the right. The timeline
markers are crisp; all lettering is too soft and small to read as words. Near greyscale.
```

### `spread-iec-checklist.jpg`
```text
Photograph an open printed guide lying flat on a warm off-white paper surface, shot from
directly above with soft even light. The spread shows a long checklist with empty square
tick-boxes running down both pages. The boxes are crisp and clearly drawn; the text beside
each one is indistinct soft grey marks too small to read as words. Near greyscale.
```

---

## F. 3D MODELS — 2 files, via Tripo 3D

**Two stages: generate a still in Gemini, then feed that still to Tripo.**

Do not use Tripo's text-to-3D. Driving it from a Gemini still gives you a model that matches
this site's art direction instead of a generically plausible object.

### Stage 1 — the source stills (Gemini, ratio 1:1)

#### `src-knight-3q.png` → save to `public/images/_raw/src-knight-3q.png`
```text
Photograph a chess knight carved from brushed brass, shot in a clean three-quarter view with
flat, even, diffuse studio lighting and no dramatic shadow anywhere. The brass is matte and
slightly worn along the edges, not polished or reflective. The entire piece is inside the
frame with clear margin on all four sides, standing upright on a plain surface. The
background is a plain, even mid-grey.
```

#### `src-seal-3q.png` → save to `public/images/_raw/src-seal-3q.png` *(optional)*
```text
Photograph a round brass embossing seal with a scissor-style handle, shot in a clean
three-quarter view with flat, even, diffuse studio lighting and no dramatic shadow anywhere.
The brass is matte and slightly worn, not polished. The whole object is inside the frame
with clear margin on all four sides. The background is a plain, even mid-grey.
```

**Why flat lighting and full margin:** Tripo reconstructs geometry from what it can see. A
hard cast shadow gets modelled as if it were part of the object, and anything cropped at the
frame edge comes back as a truncated mesh.

### Stage 2 — Tripo 3D

1. Go to tripo3d.ai → **Image to 3D**
2. Upload `src-knight-3q.png`
3. Turn **PBR / textured** output **on**
4. Turn **quad remesh / low-poly** **on**, target around 30–40k triangles
5. Generate, then **Export → GLB**
6. Save the raw export as `public/models/_raw/knight-brass.glb`

Repeat for the seal → `public/models/_raw/seal-stamp.glb`.

Keep the raw export. Stage 3 writes the optimised copy to `public/models/`, so you can
re-tune texture size later without spending Tripo credits regenerating.

**Tripo's free tier is credit-limited.** Spend credits on the knight first — it is the hero
object. The seal is optional and the site is complete without it.

### Stage 3 — compress (required)

```bash
npx --yes @gltf-transform/cli@4 optimize public/models/_raw/knight-brass.glb public/models/knight-brass.glb --compress meshopt --texture-size 1024
```

Then check what you got:

```bash
npx --yes @gltf-transform/cli@4 inspect public/models/knight-brass.glb
```

**Budgets:** under 800 KB, under 40k triangles, one 1024px texture.

> ### ⚠️ Use `meshopt`, never `draco` — this is a hard requirement, not a preference
>
> Draco compresses geometry slightly better, so it is the reflexive choice. It would break
> this site.
>
> `@react-three/drei` turns Draco **on by default** and fetches its decoder from
> `https://www.gstatic.com/draco/versioned/decoders/1.5.5/` — verified in
> `node_modules/@react-three/drei/core/Gltf.js`. The strict Content Security Policy built in
> Phase 20 sets `script-src 'self'`, which blocks that request. The model then fails to load
> **in production only**, while working perfectly in local development, because the CSP is
> only applied on the deployed site.
>
> Meshopt's decoder is imported from `three-stdlib` and bundled into your JavaScript. Zero
> network requests, nothing for the CSP to block. Its decoder is also roughly 10 KB against
> Draco's ~200 KB, so on a single hero model **meshopt ships fewer total bytes** even though
> its compression ratio is lower — the decoder saving exceeds the geometry saving.
>
> It is also `gltf-transform`'s own default for `--compress`.
>
> **If you ever do need Draco**, self-host the decoder instead of accepting drei's default:
> copy `node_modules/three/examples/jsm/libs/draco/` into `public/draco/` and load with
> `useGLTF(src, '/draco/')`.

**Hard rule:** if it is still over 1 MB after compression, drop the 3D and ship the static
image fallback instead. A heavy hero model wrecks Largest Contentful Paint, and LCP is a
ranking factor. No model is worth that trade.

**Optional extra saving:** add `--texture-compress webp` to the optimize command. three.js
reads WebP textures in GLB via the `EXT_texture_webp` extension and it typically cuts the
texture payload substantially. Verify the model still renders after applying it.

---

## G. SOCIAL & ICONS — 4 files

Save **directly** to `public/images/` — no keying needed.

### `og-default.jpg` — ratio 16:9, final 1200×630
```text
A warm off-white paper background with a very faint ruled grid across it, like accounting
paper. A brass chess knight sits on the right third of the frame, photographed with flat
even lighting, near greyscale. The entire left two-thirds of the image is empty paper with
nothing on it at all. No text anywhere in the image.
```
The empty left side is where the page title gets drawn as real text at render time.

### `og-service.jpg` — ratio 16:9, final 1200×630
```text
A warm off-white paper background with a very faint ruled grid across it, like accounting
paper. A few small desaturated objects — a steel paperclip, a folded rupee note — are
scattered along the bottom edge of the frame. The upper two-thirds of the image is empty
paper with nothing on it at all. No text anywhere in the image.
```

### `favicon-src.png` — ratio 1:1, final 1024×1024
```text
A single solid silhouette of a chess knight, filled flat in deep green hex 0A6B4E, centred
on a flat warm off-white background hex EFEDE8. No outline, no shading, no gradient, no
detail inside the silhouette. Simple and bold enough to stay readable when shrunk to
sixteen pixels.
```

### `apple-touch.png` — 180×180
Do not regenerate this. Resize the favicon:
```bash
sips -Z 180 public/images/favicon-src.png --out public/images/apple-touch.png
```

---

## H. GUIDE COVERS — 4 files

For the four evergreen guides built in Phase 15. **Ratio 4:3** · save **directly** to
`public/images/` · final 1200×900 `.jpg` · no keying.

Same treatment as the document spreads — closed guides rather than open ones.

### `cover-entity-formation.jpg`
```text
Photograph a slim closed printed booklet lying at a slight angle on a warm off-white paper
surface, shot from directly above with soft even light. Its cover is plain with a wide blank
band across the upper half where a title would go, but no text on it anywhere. A brass
paperclip rests on one corner. Near greyscale.
```

### `cover-gst-compliance.jpg`
```text
Photograph a slim closed printed booklet lying at a slight angle on a warm off-white paper
surface, shot from directly above with soft even light. Its cover is plain and blank with no
text anywhere. Two green sticky tabs protrude from the fore edge. Near greyscale except for
the green tabs.
```

### `cover-tax-notices.jpg`
```text
Photograph a slim closed printed booklet lying on a warm off-white paper surface with a
folded official-looking letter beside it, shot from directly above with soft even light.
Neither the booklet nor the letter has any readable text on it. Near greyscale.
```

### `cover-exporter.jpg`
```text
Photograph a slim closed printed booklet lying at a slight angle on a warm off-white paper
surface next to a small stack of shipping labels, shot from directly above with soft even
light. Nothing in the frame has readable text on it. Near greyscale.
```

---

## I. VIDEO — optional, read this before generating any

**The recommendation is not to use video on the marketing pages.** An autoplaying hero video
is one of the most reliable ways to destroy Largest Contentful Paint, and Phase 7 is built
around the headline *text* being the LCP element. The reference site uses no video at all.

If you want video anyway, generate it with **Veo** through Gemini and confine it to these
two cases:

### `vid-process-loop.mp4` → `public/video/vid-process-loop.mp4`
```text
A four second silent looping animation in loose black ink line art on a flat warm off-white
background. A single continuous line draws itself from left to right, forming a simple path
with five small circular waypoints along it, then holds. Same loose imperfect hand-drawn
line quality throughout. No text, no colour other than the black line.
```
Rules: under 2 MB, muted, `preload="none"`, a poster frame, and **never above the fold**.

### Explainer videos inside guide pages
Generate as needed, below the fold only.

**Every video on this site needs a full text transcript rendered beneath it** — see addendum
E2. A video is completely invisible to search engines and to the AI answer engines this whole
build is targeting, so an untranscribed video is content you paid for and cannot rank.

---

# ═══════════════════════════════════
# STEP 1b — GENERATION ORDER
# ═══════════════════════════════════

You do not need everything before moving on. Generate in this order and you can build
continuously:

| Priority | Assets | Why first |
|---|---|---|
| 1 | `anchor-ink`, `anchor-cutout` | Everything inherits these |
| 2 | `cut-rupee-500`, `cut-coin-stack`, `cut-paperclip`, `src-knight-3q` → `knight-brass.glb` | The hero, Phase 7 |
| 3 | `fig-worried`, `fig-relieved`, `fig-handshake` | Homepage narrative, Phase 8 |
| 4 | `og-default`, `favicon-src` | Needed the moment anyone shares a link |
| 5 | The six document spreads | Services gallery, Phase 9 |
| 6 | Remaining figures, cut-outs, guide covers | Fill in over time |

---

# ═══════════════════════════════════════════════
# STEP 2 — PROCESS THE ASSETS (two commands)
# ═══════════════════════════════════════════════

Once a batch is generated and saved in `public/images/_raw/`, run these two, in order.

**1. Remove the backgrounds.**

```bash
bash tools/batch-key.sh public/images/_raw public/images
```

Picks the method from the filename — `fig-*` and `tex-*` are keyed off white, `cut-*` off
magenta, everything else is copied through opaque. It auto-detects the *actual* background
colour from the image corners rather than trusting the nominal hex, because a generated
`#FF00FF` arrives as something like `#FF40FF` after the model's renderer and PNG encoding
have touched it.

**2. Trim, resize and compress.**

```bash
bash tools/optimize-assets.sh
```

This is the step that decides your Core Web Vitals score. Gemini returns everything at one
canvas size — 2816×1536 in practice — so a portrait figure arrives centred in a wide frame
with 50–83% of the canvas empty. The script crops each transparent asset to its real content
bounding box, then resizes to the size it is actually displayed at, then recompresses JPEGs.

Measured on the first full run: **342 MB → 26 MB**, with no visible quality loss.

**3. Check it worked.** Anything reporting `hasAlpha: no` did not key:

```bash
for f in public/images/{fig,cut,tex}-*.png; do printf "%-32s " "$(basename $f)"; sips -g hasAlpha "$f" | tail -1; done
```

**4. Update the manifest.** `data/assets.ts` carries the width and height of every asset, and
next/image uses them to reserve space before the image loads. If they disagree with the
files on disk, the page shifts as images arrive — that is a Cumulative Layout Shift penalty,
and CLS is a ranking signal. Re-read the real dimensions with:

```bash
cd public/images && for f in *.png *.jpg; do sips -g pixelWidth -g pixelHeight "$f" | awk -v n="$f" '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{printf "%s %s %s\n", n, w, h}'; done
```

Files in `_raw/` stay on your machine and are never committed.

> **Do not put anything in `_raw/` that is not a generated asset.** It is git-ignored, so
> nothing warns you, and it sits inside the project consuming disk quietly.

---

# ═══════════════════════════════════════════
# STEP 3 — THE THREE AGENT PROMPTS
# ═══════════════════════════════════════════

These build the code that consumes the files above. **Run them now** — do not wait until the
artwork is finished. Every component is built to survive missing files.

### ▶ PROMPT 4-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the asset tooling and the asset-loading components.
Work in ./tools, ./components/ui, and ./public/models.

TOOLING CONTEXT
The human generates 2D images with GEMINI and 3D models with TRIPO 3D. Gemini cannot output
transparency, so you must build the tool that removes the background afterwards.
This machine has Swift at /usr/bin/swift, Node 20, and the macOS `sips` command.
It does NOT have Homebrew, ffmpeg, ImageMagick, sharp, canvas, or any Python image library.
Do not write tooling that depends on any of those.

⚠️ TASKS 1 AND 2 ARE ALREADY DONE. `tools/alpha-key.swift` and `tools/batch-key.sh` are
built, tested and working — both modes verified on real images, including background
auto-detection. DO NOT rewrite them. Read them, confirm they run, and move to task 3.
They are described below only so you understand what they do.

TASK

1. [DONE — do not rebuild] `tools/alpha-key.swift` — adds an alpha channel to an opaque PNG.
   CoreGraphics and ImageIO only, no packages.

   Usage:
     swift tools/alpha-key.swift <in.png> <out.png> --mode luminance [--threshold 240]
     swift tools/alpha-key.swift <in.png> <out.png> --mode chroma --key FF00FF [--tolerance 40]

   luminance mode — for black ink line art on white. Pixels at or above the threshold become
   fully transparent; below it they keep their colour. Scale alpha smoothly across a narrow
   band around the threshold rather than cutting hard, or the linework ships with visibly
   jagged edges instead of its anti-aliasing.

   chroma mode — for objects on flat magenta. Pixels within `tolerance` RGB distance of the
   key colour become transparent, again with a soft edge band. Then de-fringe: for any
   surviving pixel whose colour sits between the subject and the key, suppress its magenta
   component. Without this every cut-out ships with a pink halo.

   Print a summary: input size, output size, percentage of pixels made transparent. If that
   percentage is below 5% or above 95%, print a WARNING — it almost certainly means the wrong
   mode or a wrong threshold, and catching it here beats discovering it in the browser.

2. [DONE — do not rebuild] `tools/batch-key.sh <in-dir> <out-dir>` — runs the tool over a
   folder, choosing the mode from the filename prefix: fig-* and tex-* use luminance, cut-*
   use chroma, anything else is copied through untouched.

3. Build `components/ui/Model3D.tsx` — a React Three Fiber wrapper that:
   - is loaded ONLY via next/dynamic with { ssr: false } and a skeleton fallback
   - does not mount until within 200px of the viewport (IntersectionObserver)
   - does not mount at all on devices reporting under 4 CPU cores, or a coarse pointer with a
     viewport under 768px — those get the static image fallback
   - respects prefers-reduced-motion with a single static frame, no animation
   - props: src, fallbackImage, rotationSpeed, className
   - uses <Suspense>, useGLTF with preload, and disposes properly on unmount

   CRITICAL — call useGLTF as:  useGLTF(src, false, true)
   The second argument DISABLES Draco, the third ENABLES Meshopt. drei defaults Draco to
   true and then fetches its decoder from https://www.gstatic.com/draco/... — an external
   request that the Phase 20 Content Security Policy blocks. That failure appears only in
   production, never in local dev, which makes it expensive to diagnose later. Our models
   are Meshopt-compressed and its decoder is bundled, so no network call happens.
   Put that reasoning in a comment above the call so nobody "fixes" it back later.

4. Build `components/ui/CutOut.tsx` — the floating collage element. Props: src, alt, width,
   height, rotate, className. Wraps next/image, applies rotation via a CSS custom property,
   sets explicit width and height to prevent layout shift, and sets aria-hidden when alt is
   an empty string.
   The shadow must be CSS `filter: drop-shadow()`, never `box-shadow` — drop-shadow follows
   the transparent silhouette, box-shadow would outline the rectangular bounding box and
   give away that these are cut-outs pasted onto the page.

5. Build `components/ui/Marginalia.tsx` — scattered statute references. Props: count, seed,
   className. Imports pickMarginalia from data/marginalia.ts. Each item absolutely positioned
   with a deterministic pseudo-random top/left/rotation from the seed, so server and client
   render identically. Always aria-hidden.

6. Create `public/models/README.md` listing the expected models, budgets and their sources:
     knight-brass.glb   hero, ≤800 KB, ≤40k tris   ← Tripo, from src-knight-3q.png
     seal-stamp.glb     optional, ≤400 KB          ← Tripo, from src-seal-3q.png

7. Append to the root .gitignore (do not rewrite it, Agent C owns that file):
     # Raw generated assets — keyed finals are committed, sources stay local
     public/images/_raw/

VERIFY THE EXISTING TOOL STILL RUNS (do not rewrite it)
   swift tools/alpha-key.swift
It must print its usage text. That is all the confirmation needed — it has already been
tested against both modes on real images.

GIT
   git add tools/ components/ui/Model3D.tsx components/ui/CutOut.tsx components/ui/Marginalia.tsx public/models/README.md .gitignore
   git commit -m "phase-4(A): alpha-key tooling and asset-loading primitives"

CONSTRAINTS
- Swift, Node and sips only. No Homebrew, ffmpeg, ImageMagick, sharp, canvas or Python.
- Model3D must never be imported statically. Enforce it with a comment at the top of the file.
- Every component must render correctly when its asset file is MISSING. Build and confirm
  this now, while public/images is still empty.

REPORT WHEN DONE
Print the alpha-key usage string, your round-trip test result including the transparent-pixel
percentage, and the three component signatures.
```

### ▶ PROMPT 4-B — Agent B (Content & SEO Engineer)

```text
You are Agent B (Content & SEO Engineer). You own image accessibility and image SEO.
Work in ./components/content, ./app, and ./data/image-seo.ts.

CONTEXT
Read the Phase 4 asset list in ./MASTER-BUILD-PLAN.md — it names every file the site will
use. The files themselves may not exist yet; that is expected and does not block you.

TASK

1. `components/content/Figure.tsx` — the wrapper for every meaningful image on the site.
   Renders <figure> with next/image and an optional <figcaption>. Props: asset key, caption,
   priority. Reads dimensions from data/assets.ts so width and height are always set.
   Decorative images bypass this component entirely and use CutOut instead — a <figure> with
   no caption and an empty alt is noise in the accessibility tree.

2. `data/image-seo.ts` — export `IMAGE_CAPTIONS`, a Record mapping each meaningful asset key
   to a caption string. Write captions for all 12 fig-* assets, all 6 spread-* assets, and
   the 4 cover-* assets. A caption is read by everyone, unlike alt text which is read only by
   screen readers, so write them as real editorial captions that add information rather than
   restating the image.

3. `app/image-sitemap.xml/route.ts` — generate an image sitemap listing every indexable
   image with its page URL, caption and title. Images inside a normal sitemap are frequently
   missed; a dedicated image sitemap is how the document spreads and figures become eligible
   for image search, which for a compliance practice is a real secondary traffic source.

4. Add to `DESIGN-SYSTEM.md` an "Images" section: when to use Figure vs CutOut vs Model3D,
   the alt-text rules, the caption rules, and the instruction that no image on this site ever
   contains text because generated text is unreliable, unsearchable and untranslatable.

GIT
   git add components/content/Figure.tsx data/image-seo.ts app/image-sitemap.xml DESIGN-SYSTEM.md
   git commit -m "phase-4(B): figure component, captions, image sitemap"

CONSTRAINTS
- Do not edit data/assets.ts — Agent C owns it this phase.
- Do not write alt text here; Agent C owns alt text. Captions only.
- Do not attempt to generate, download or modify any image file.

REPORT WHEN DONE
Print five example captions and confirm the image sitemap builds.
```

### ▶ PROMPT 4-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation from a specification. Do not invent. Do not add
entries beyond the specification.

CONTEXT
Work only in ./data and ./public/images.
Read the Phase 4 asset list in ./MASTER-BUILD-PLAN.md — every filename is listed there
under STEP 1, grouped A to I. Use those exact filenames.

TASK — create exactly two files plus one empty folder.

⚠️ THIS FILE IS ALREADY BUILT from the real generated files, with correct dimensions,
decorative flags and alt text. Do NOT rewrite it. Read it, improve the alt text only if you
can genuinely do better, and confirm every entry matches a file on disk.

FILE 1 — `data/assets.ts`
Export a const `ASSETS` object, one entry per asset, with this exact shape:
  { src: string; width: number; height: number; alt: string; decorative: boolean;
    ratio: '1:1'|'3:4'|'4:3'|'9:16'|'16:9'; key: 'white'|'magenta'|'none' }

Set `key` by prefix: fig-* and tex-* are 'white', cut-* are 'magenta', everything else
(spread-*, cover-*, og-*, favicon, apple-touch, src-*) is 'none'.
Set `ratio` and the final width/height from the Phase 4 list.

ALT TEXT RULES — this is the part that matters, follow it exactly:
- Decorative items (all cut-*, all tex-*, og-*, favicon, apple-touch, src-*) get `alt: ''`
  and `decorative: true`. An empty alt is CORRECT for decorative images — a screen reader
  must skip them silently. Do not write "image of a rupee note" for these.
- Meaningful items (all fig-*, all spread-*, all cover-*) get `decorative: false` and a
  specific, useful alt describing what the image COMMUNICATES, not what it depicts.
    Good:  "A shopkeeper reviewing purchase invoices before filing GSTR-3B"
    Bad:   "Line drawing of a man"
- Every alt string under 125 characters, and none may contain "image of", "picture of" or
  "graphic showing".

Also export `getAsset(key)` which returns the entry, and `assetExists(key)` which returns
false for an unknown key rather than throwing — a missing asset must degrade, never crash.

FILE 2 — `public/images/README.md`
A checklist table, one row per asset, with these columns:
  filename | group | ratio | final size | key | generated ☐ | keyed ☐ | resized ☐
For assets with key 'none', put "n/a" in the keyed column rather than an empty box, so
nobody waits on a step that does not apply. Group the rows A to I to match the plan.

Put this at the top of the file, exactly:
  Generate these with the prompts in MASTER-BUILD-PLAN.md Phase 4, STEP 1.
  1. Save the Gemini output into _raw/ using the FINAL filename
  2. bash tools/batch-key.sh public/images/_raw public/images
  3. sips -Z <final size> the resulting file
  4. sips -g hasAlpha <file>   — must say yes for anything keyed
  Use these exact filenames. The build will not find them under any other name.

FOLDER — create `public/images/_raw/.gitkeep` so the folder exists in a fresh clone.

GIT
   git add data/assets.ts public/images/README.md public/images/_raw/.gitkeep
   git commit -m "phase-4(C): asset manifest with ratios, keying flags and alt text"

CONSTRAINTS
- Every asset in the Phase 4 list must appear in assets.ts. Count them and confirm the total.
- Do NOT write descriptive alt text for decorative images. An empty string is the correct
  answer and it is not laziness — it is the accessibility standard.
- Do not attempt to generate, download or key any image.

REPORT WHEN DONE
Print the total entry count, the count per `key` value, the count marked decorative, and
five example alt strings.
```

### ✅ Phase 4 gate check

```bash
npm run build && swift tools/alpha-key.swift 2>&1 | head -3
```

The build must pass **with no assets present at all**, and `alpha-key.swift` must print its
usage string — that proves the tool compiles before you depend on it.

Then generate in the Step 2 priority order. **You can move to Phase 5 immediately** — the
artwork can arrive at any time.

---

# ════════════════════════════
# PHASE 5 — LAYOUT SHELL
# ════════════════════════════

**Goal:** the frame every page lives inside — navigation, footer, scroll rail, theme toggle.

**Done when:** any route renders with sticky nav, a working footer, and the N→S scroll
indicator on the right edge.

> **📦 Assets used here** — generate with the Phase 4 prompts if you haven't yet:
> `fig-walking-row.png` (the footer strip). Not a blocker — the footer renders without it.

### ▶ PROMPT 5-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the layout shell. Work in ./components/ui,
./components/sections, and ./app/layout.tsx.

REFERENCE BEHAVIOUR
The target is the reference editorial site: a quiet, thin header that never shouts, and a
vertical progress rail on the right edge labelled N at the top and S at the bottom (compass
north/south) with a green fill that tracks scroll position.

TASK

1. `components/sections/Header.tsx` — sticky, backdrop-blurred, 1px --rule bottom border.
   Left: wordmark in font-display. Centre: nav links with dropdown for Services. Right: a
   pill CTA "Book a consultation" in --seal, and the theme toggle.
   Behaviour: full height at scroll 0, compresses to 56px after 80px of scroll with a
   smooth height transition. Hides on scroll down, reveals on scroll up — but ALWAYS visible
   at the top of the page and never hidden when a dropdown is open.
   Accessibility: real <nav>, dropdown operable by keyboard (Enter/Space to open, Escape to
   close, arrow keys to move, focus returns to the trigger), aria-expanded and aria-current
   set correctly.

2. `components/sections/MobileNav.tsx` — a full-screen sheet, not a hamburger dropdown.
   Slides in from the right. Traps focus. Closes on Escape and on route change. Body scroll
   locked while open. All touch targets at least 44×44px. The CTA is the last item and it is
   the largest thing on the screen.

3. `components/ui/ScrollRail.tsx` — the right-edge progress indicator. A 1px --rule vertical
   line, 60vh tall, vertically centred, 24px from the right edge, with a --seal fill that
   grows with scrollYProgress from Framer Motion's useScroll. Letter "N" above, "S" below in
   font-label at 10px. Hidden below 1024px viewport width. aria-hidden — it is decoration,
   the page already has real landmarks.

4. `components/sections/Footer.tsx` — four columns on desktop, stacked on mobile:
   practice/about, services (all eight), resources, contact. Above the columns, the
   fig-walking-row.png strip runs edge to edge as a CutOut (decorative). Below: the legal
   disclaimer line required by instrtion.md — a permanent statement that content is
   informational and not a substitute for professional advice on a specific matter — plus
   copyright and the trust-badge row.
   Every fact (address, phone, email) comes from lib/brand.ts and renders NOTHING when the
   value is 'TBD'. Do not render an empty <p> or a dash.

5. `components/ui/ThemeToggle.tsx` — next-themes based, no hydration flash, accessible label
   that states the action not the state ("Switch to dark theme").

6. Wire all of it into `app/layout.tsx`: html lang="en-IN", the four font variables,
   ThemeProvider, a skip-to-content link as the first focusable element, <main id="main">,
   and the .paper .ledger-grid classes on the body.

7. Build and confirm zero errors and zero hydration warnings in the console.

GIT
   git add components/sections/Header.tsx components/sections/MobileNav.tsx components/sections/Footer.tsx components/ui/ScrollRail.tsx components/ui/ThemeToggle.tsx app/layout.tsx
   git commit -m "phase-5(A): layout shell, sticky nav, scroll rail, footer"

CONSTRAINTS
- Import navigation and footer link data from data/navigation.ts (Agent C creates it this
  phase). If the file is not there yet, import it anyway and let the build fail until C
  finishes — do not duplicate the data locally.
- lang="en-IN" not "en". This is a signal for regional search targeting.
- Zero hydration warnings. If you get one, fix the cause; do not silence it.

REPORT WHEN DONE
Describe the header's scroll behaviour states and confirm keyboard operability of the
dropdown was tested.
```

### ▶ PROMPT 5-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You own navigational content structure and crawl-path components. Work in
./components/seo and ./components/content.

TASK

1. `components/seo/Breadcrumbs.tsx` — renders a visible breadcrumb trail AND is the single
   source that Phase 17 will use to emit BreadcrumbList JSON-LD. Derives the trail from the
   current pathname plus a label map imported from data/navigation.ts. Uses <nav
   aria-label="Breadcrumb"> and an ordered list. The current page is the last item, marked
   aria-current="page" and NOT a link. Renders nothing on the homepage.

2. `components/content/AnswerBlock.tsx` — the single most important content component in
   this build. It renders the direct, self-contained answer at the top of every service and
   guide page: a short question as an <h2>, a 40-60 word answer, and an optional list of
   2-4 supporting facts.
   Why it matters: AI search engines and featured snippets extract the first coherent answer
   on a page. If that answer depends on surrounding context, it cannot be quoted, and the
   citation goes to a competitor instead. So this component must render an answer that makes
   complete sense with zero surrounding context — including naming the entity in full
   ("Goods and Services Tax (GST) registration") rather than using a pronoun or short form.
   Mark it up with semantic HTML only — no divs where a <p> or <dl> belongs.

3. `components/content/FAQAccordion.tsx` — accessible disclosure pattern. Each item is a
   <button aria-expanded> controlling a region. Keyboard operable. The answer content stays
   in the DOM when collapsed (visually hidden with height, not removed) so crawlers and AI
   agents read every answer without executing JavaScript. This is a deliberate SEO decision:
   never gate content behind a click for a crawler.

4. `components/content/Prose.tsx` — the typographic wrapper for all long-form content.
   Sets measure to 68 characters, font-body, --t-body, correct spacing for h2/h3/ul/ol/
   blockquote/table, and styles links as underlined --seal. Tables must scroll horizontally
   inside their own container on mobile without the page scrolling sideways.

GIT
   git add components/seo/Breadcrumbs.tsx components/content/AnswerBlock.tsx components/content/FAQAccordion.tsx components/content/Prose.tsx
   git commit -m "phase-5(B): breadcrumbs, answer block, FAQ accordion, prose wrapper"

CONSTRAINTS
- Do not edit layout.tsx, Header.tsx, or Footer.tsx — Agent A owns those this phase.
- No content is hidden from crawlers behind JavaScript. Collapsed does not mean removed.

REPORT WHEN DONE
Explain in three sentences why FAQAccordion keeps collapsed content in the DOM.
```

### ▶ PROMPT 5-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical data file creation. Follow the specification literally.

CONTEXT
Work only in ./data. Read ./data/services.ts for the eight service slugs and names.

TASK — create exactly one file: `data/navigation.ts`

Export these four consts:

1. `MAIN_NAV` — array of { label, href, children? }:
   - { label: 'Services', href: '/services', children: [...] } where children is one entry
     per service from services.ts: { label: <service.shortName>, href: '/services/<slug>' }
   - { label: 'Tools', href: '/tools' }
   - { label: 'Insights', href: '/insights' }
   - { label: 'Guides', href: '/guides' }
   - { label: 'The Practice', href: '/practice' }
   - { label: 'Contact', href: '/contact' }

2. `FOOTER_NAV` — array of exactly four column objects { heading, links: [{label, href}] }:
   - 'The Practice': /practice, /practice/principal, /case-studies, /contact
   - 'Services': all eight service links
   - 'Resources': /tools, /guides, /glossary, /insights, /compliance-calendar
   - 'Legal': /privacy, /terms, /disclaimer, /refund-policy

3. `BREADCRUMB_LABELS` — a Record<string, string> mapping every URL segment used anywhere
   above to its human label. Include: services, tools, insights, guides, practice, contact,
   glossary, case-studies, compliance-calendar, privacy, terms, disclaimer, refund-policy,
   principal, and every one of the eight service slugs.

4. `CTA` — { label: 'Book a consultation', href: '/contact' }

GIT
   git add data/navigation.ts
   git commit -m "phase-5(C): navigation, footer, and breadcrumb label data"

CONSTRAINTS
- Import the service list from './services' and derive the service links programmatically.
  Do not hand-copy the eight services — derive them, so they can never drift out of sync.
- Exactly the routes listed. Do not add a route that is not in this specification.
- One file only.

REPORT WHEN DONE
Print the file and the total count of unique hrefs.
```

### ✅ Phase 5 gate check

```bash
npm run build && npm run dev
```

Tab through the whole page with the keyboard only. You must be able to reach every link,
open the Services dropdown, close it with Escape, and see a visible focus ring at every step.
If you cannot, that is a Phase 5 bug — fix it before Phase 6.

---

# ═══════════════════════════════════
# PHASE 6 — MOTION & SCROLL ENGINE
# ═══════════════════════════════════

**Goal:** one motion system, used by every later phase. Without this, three agents will write
three different animation styles and the site will feel incoherent.

**Done when:** `/styleguide/motion` demonstrates every primitive, and everything stops
moving when `prefers-reduced-motion` is set.

### ▶ PROMPT 6-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the motion system. Work in ./components/ui and
./lib.

TASK

1. `lib/motion.ts` — the shared vocabulary. Export:
   - EASE = [0.16, 1, 0.3, 1] as const  (the only easing curve in this project)
   - DUR = { fast: 0.3, base: 0.6, slow: 1.0, epic: 1.6 }
   - variants: fadeUp, fadeIn, scaleIn, staggerParent, staggerChild, maskReveal
   - `useReducedMotion()` re-export and a `motionSafe(variants)` helper that returns
     instant, zero-duration variants when reduced motion is requested.

2. `components/ui/SmoothScroll.tsx` — Lenis provider. Client component wrapping children.
   Configure: duration 1.1, the project easing, smoothWheel true, smoothTouch FALSE.
   Smooth touch scrolling on mobile fights the operating system's own scroll physics and
   consistently feels broken — leave it off. Must destroy the instance on unmount and must
   disable itself entirely under prefers-reduced-motion.

3. `components/ui/Reveal.tsx` — the workhorse. Props: children, delay, direction
   ('up'|'left'|'right'|'none'), once (default true), amount (default 0.25).
   Uses whileInView. Default state must be VISIBLE with opacity 1 in the server-rendered
   HTML, then animated — never ship HTML where content is invisible until JavaScript runs.
   Crawlers and users on slow connections must see the content regardless.

4. `components/ui/ScrollScale.tsx` — the reference site's signature move: huge display text
   that scales and fades as it passes through the viewport. Uses useScroll with a target ref
   and offset ['start end','end start'], mapping progress to scale and opacity. Must use
   transform only — never animate width, height, top, or left, which force layout and
   destroy INP.

5. `components/ui/HorizontalScroll.tsx` — the pinned horizontal gallery from the reference
   (the book-spread section). A tall outer section, a sticky inner viewport, and a track that
   translates on X as the user scrolls Y. Falls back to a normal horizontal-overflow
   swipe container below 1024px and under reduced motion. Must include real keyboard access:
   the track is focusable and arrow keys move it.

6. `components/ui/Magnetic.tsx` — subtle pointer attraction for primary CTAs only. Max 8px
   displacement. Disabled on touch devices and under reduced motion.

7. Wire SmoothScroll into app/layout.tsx.

8. Add a `data-motion` attribute to <html> set to 'full' or 'reduced' so CSS can respond too.

GIT
   git add lib/motion.ts components/ui/SmoothScroll.tsx components/ui/Reveal.tsx components/ui/ScrollScale.tsx components/ui/HorizontalScroll.tsx components/ui/Magnetic.tsx app/layout.tsx
   git commit -m "phase-6(A): motion vocabulary, smooth scroll, reveal and scroll-scale primitives"

CONSTRAINTS
- Animate transform and opacity ONLY. If you find yourself animating a layout property,
  restructure instead.
- Every primitive must degrade to a static, fully-visible state under prefers-reduced-motion.
  Not a faster animation — no animation.
- Content must be present and visible in the server-rendered HTML before hydration.

REPORT WHEN DONE
List each primitive with its reduced-motion behaviour, and confirm no layout properties are
animated anywhere.
```

### ▶ PROMPT 6-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. This phase you build the motion styleguide page and document the rules.
Work in ./app/styleguide/motion and ./MOTION-RULES.md.

TASK

1. `app/styleguide/motion/page.tsx` — an internal, noindex page demonstrating every primitive
   Agent A is building: Reveal in all four directions, ScrollScale with a real headline,
   HorizontalScroll with six placeholder panels, Magnetic on a CTA, and a staggered list.
   Each demo is labelled with the component name, its props, and a one-line note on when to
   use it. Use real tax copy in every demo, never lorem ipsum.
   Add `export const metadata = { robots: { index: false, follow: false } }`.

2. `MOTION-RULES.md` at the repository root. Write the governing rules as decisions, with
   the reasoning, so later phases do not relitigate them:
   - One easing curve for the entire project, and why a single curve is what makes a site
     feel designed rather than assembled.
   - Motion budget: at most 3 animated elements in any single viewport at one time.
   - Display type animates at most twice per page.
   - No animation on anything a user is trying to read while it moves.
   - Hover effects never move layout — they change colour, opacity or a transform only.
   - Every animation has a job. Document the four legitimate jobs: directing attention,
     showing spatial relationship, giving feedback, and expressing brand at moments of
     transition. Anything that does none of these gets deleted.
   - The Core Web Vitals link: explain concretely that scroll-linked animation which forces
     layout shows up as Interaction to Next Paint, that INP is a ranking signal, and that
     therefore motion quality and search ranking are the same problem here, not competing
     concerns.

GIT
   git add app/styleguide/motion/page.tsx MOTION-RULES.md
   git commit -m "phase-6(B): motion styleguide and governing rules"

CONSTRAINTS
- Do not edit any file in components/ui — Agent A owns those this phase.
- Real copy only.

REPORT WHEN DONE
Print the motion budget rules.
```

### ▶ PROMPT 6-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/motion-presets.ts`

Export a const `PRESETS` object. Each key maps to a plain object with `initial`, `animate`
(or `whileInView`), and `transition`. Use the easing array [0.16, 1, 0.3, 1] in every
transition. Create exactly these fourteen presets with these exact parameter values:

  fadeIn          opacity 0 → 1, duration 0.6
  fadeUp          opacity 0 + y 24 → opacity 1 + y 0, duration 0.6
  fadeDown        opacity 0 + y -24 → opacity 1 + y 0, duration 0.6
  fadeLeft        opacity 0 + x 32 → opacity 1 + x 0, duration 0.6
  fadeRight       opacity 0 + x -32 → opacity 1 + x 0, duration 0.6
  scaleIn         opacity 0 + scale 0.96 → opacity 1 + scale 1, duration 0.6
  scaleOut        opacity 0 + scale 1.04 → opacity 1 + scale 1, duration 0.6
  maskUp          clipPath inset(100% 0 0 0) → inset(0% 0 0 0), duration 1.0
  maskDown        clipPath inset(0 0 100% 0) → inset(0 0 0% 0), duration 1.0
  blurIn          opacity 0 + filter blur(8px) → opacity 1 + filter blur(0px), duration 0.6
  rotateIn        opacity 0 + rotate -3 → opacity 1 + rotate 0, duration 0.6
  slowRise        opacity 0 + y 60 → opacity 1 + y 0, duration 1.6
  staggerParent   no initial/animate, transition { staggerChildren: 0.08, delayChildren: 0.1 }
  staggerChild    opacity 0 + y 16 → opacity 1 + y 0, duration 0.5

Add `as const` to the whole export and a type export `PresetName = keyof typeof PRESETS`.

At the top of the file, add this comment verbatim:
  // Only transform, opacity, filter and clip-path are animated here.
  // Animating layout properties (width/height/top/left) is forbidden — it forces
  // reflow on every frame and shows up directly in the INP metric.

GIT
   git add data/motion-presets.ts
   git commit -m "phase-6(C): fourteen motion presets"

CONSTRAINTS
- Exactly fourteen presets, exactly these names and values.
- No width, height, top, left, margin or padding in any preset.
- One file only.

REPORT WHEN DONE
Print the file and confirm the preset count is 14.
```

### ✅ Phase 6 gate check

```bash
npm run build
```

Then in macOS: System Settings → Accessibility → Display → **Reduce motion ON**. Reload
`/styleguide/motion`. Everything must be instantly visible and completely still. Turn it back
off before continuing.

---

# ══════════════════════════════════════
# PHASE 7 — HERO & OPENING SEQUENCE
# ══════════════════════════════════════

**Goal:** the first 100vh. This is the shot that decides whether a visitor stays.

**Done when:** the hero renders at 60fps, LCP is under 2.0s locally, and it works with
JavaScript disabled.

> **📦 Assets used here** — this is the set worth generating first (Phase 4, priority 2):
> `knight-brass.glb`, `cut-rupee-500.png`, `cut-coin-stack.png`, `cut-paperclip.png`.
> The hero still builds and passes its gate check without them — the headline is the LCP
> element by design, not the artwork.

### ▶ PROMPT 7-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the hero. This is the highest-stakes component in the
build. Work in ./components/sections and ./app/page.tsx.

REFERENCE — study this composition carefully and reproduce its STRUCTURE, not its content:
The reference hero fills the viewport with an enormous two-line Didone serif headline in
deep green, set against warm newsprint with a faint grid. A photographic object (a chess
piece) overlaps the type. Small marginalia float in the whitespace at various rotations. A
tiny centred "s c r o l l" cue sits under the headline. Below the fold line, a single line of
body copy begins in huge grey type that the next scroll reveals. Four small labels sit in the
corners of the lower band: the title, a tagline, a live date/time, and a location.

TASK

1. `components/sections/Hero.tsx`:
   - Full-viewport section with .paper and .ledger-grid.
   - The headline in font-display at --t-display, colour --seal, max two lines, set from
     COPY-DECK.md's chosen hero headline. It must genuinely fill the viewport width on
     desktop — if it does not, the size is wrong.
   - The 3D brass knight (Model3D with knight-brass.glb) positioned to OVERLAP the headline,
     dynamically imported with ssr:false, with cut-knight.png or the CutOut fallback while
     it loads and on low-power devices.
   - Two or three CutOut collage elements (cut-rupee-500, cut-coin-stack) at fixed positions
     with explicit dimensions and slight rotations.
   - Marginalia with count 10, seed 1.
   - The subhead in font-body below the headline, max 25 words.
   - Primary CTA (Magnetic, --seal pill) and a secondary text link.
   - The four corner labels in font-label, one of which is a live date/time rendered
     CLIENT-SIDE ONLY after mount — a server-rendered timestamp causes a hydration mismatch
     and is also wrong for every visitor in a different timezone.
   - A scroll cue with letter-spaced text and a subtle downward motion.

2. LCP discipline — this is the section instrtion.md's performance requirements live or die in:
   - The headline is server-rendered text. It is the LCP element. It must NOT be inside any
     component that starts at opacity 0.
   - No image or 3D asset is allowed to become the LCP element. Verify this in Lighthouse.
   - Preload the hero fallback image with fetchPriority="high" and priority on next/image.
   - The 3D model must not be requested at all until after the page is interactive.

3. `components/sections/HeroBridge.tsx` — the transition section directly beneath the hero,
   reproducing the reference's move: a long sentence in huge grey type that scroll-scales up
   and colour-shifts to --ink as it enters the viewport, with a cut-out drifting across it.

4. Rewrite `app/page.tsx` to render Hero and HeroBridge, nothing else yet.

5. Test with JavaScript disabled in the browser. The headline, subhead, and CTA must all be
   visible and the CTA must be a working link. If the hero is blank without JavaScript, the
   build has failed a hard requirement — fix it.

OPTIONAL SPLINE VARIANT
If the human prefers the Spline embed named in instrtion.md over the self-hosted .glb:
   npm install @splinetool/react-spline @splinetool/runtime
and swap Model3D for a dynamically-imported <Spline scene={url} /> with the same
IntersectionObserver gating and the same static fallback. Keep every other constraint
identical. Note in HANDOFF.md which variant was used.

GIT
   git add components/sections/Hero.tsx components/sections/HeroBridge.tsx app/page.tsx
   git commit -m "phase-7(A): hero with 3D knight, collage, marginalia, and scroll bridge"

CONSTRAINTS
- The LCP element must be text, not an image.
- No hydration warnings. The live clock renders only after mount.
- Works with JavaScript disabled.

REPORT WHEN DONE
Report: which element Lighthouse identifies as LCP, the LCP time, and confirmation that the
page renders with JavaScript off.
```

### ▶ PROMPT 7-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. This phase you finalise hero copy and build the homepage's SEO foundation.
Work in ./app/page.tsx metadata export ONLY (coordinate: Agent A owns the component
body, you own the exported metadata object), plus ./data/hero-copy.ts and ./COPY-DECK.md.

To avoid a collision: put the metadata in a SEPARATE file `app/metadata.ts` and tell Agent A
in HANDOFF.md to import it. Do not edit page.tsx yourself.

TASK

1. `data/hero-copy.ts` — export the three hero headline variants from COPY-DECK.md as a
   typed const, with the chosen one marked. Each variant carries: headline (max 7 words),
   subhead (max 25 words), ctaPrimary, ctaSecondary, and a `rationale` string explaining
   what it promises the reader. Also export the four corner labels.

   The headline must do one job: make an anxious business owner believe this practice will
   handle it. It should sound like the reference site — declarative, short, a little literary.
   It must not contain the words "solutions", "services", "one-stop", or "trusted partner".

2. `app/metadata.ts` — export the homepage Metadata object:
   - title: under 60 characters, sentence case, leads with the primary commercial keyword
   - description: under 155 characters, written purely for click-through
   - openGraph: type website, locale en_IN, images og-default.jpg with dimensions
   - twitter: summary_large_image
   - alternates.canonical: '/'
   - robots: index, follow, max-image-preview large, max-snippet -1
   The max-snippet:-1 directive matters here: it permits search and AI engines to quote as
   much of the page as they want. For a practice competing on being the clearest explanation
   of a complex topic, longer quotation is an advantage, not a leak.

3. Update COPY-DECK.md: mark the selected hero variant and add the reasoning.

GIT
   git add data/hero-copy.ts app/metadata.ts COPY-DECK.md
   git commit -m "phase-7(B): hero copy variants and homepage metadata"

CONSTRAINTS
- Do not edit app/page.tsx or any component — Agent A owns those this phase.
- Title under 60 characters. Count them and print the count.

REPORT WHEN DONE
Print all three headline variants with character counts, and the final metadata object.
```

### ▶ PROMPT 7-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly. Do not invent
values or add entries.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/hero-layout.ts`

This file positions the decorative elements in the hero. Export a const `HERO_LAYOUT` object
with three arrays. Every position is a percentage string, every rotation a number in degrees.

1. `cutouts` — exactly 3 entries, each { asset, top, left, width, rotate, zIndex }:
     { asset: 'cut-rupee-500',  top: '18%', left: '8%',  width: 220, rotate: -12, zIndex: 2 }
     { asset: 'cut-coin-stack', top: '62%', left: '78%', width: 180, rotate:   7, zIndex: 2 }
     { asset: 'cut-paperclip',  top: '78%', left: '14%', width: 120, rotate: -28, zIndex: 1 }

2. `marginalia` — exactly 10 entries, each { top, left, rotate }. Distribute them across the
   full 0-100% range on both axes. Rotations between -18 and 18 degrees. Do not place any
   entry between left 30% and left 70% AND top 35% and top 65% — that rectangle is where the
   headline sits and marginalia must not collide with it. Verify each of your 10 entries
   against that rule before writing the file.

3. `cornerLabels` — exactly 4 entries, each { position, key }:
     { position: 'bottom-left',   key: 'practiceName' }
     { position: 'bottom-center', key: 'tagline' }
     { position: 'bottom-right',  key: 'location' }
     { position: 'top-right',     key: 'liveTime' }

Add `as const` to the export.

Then add a second export: `MOBILE_HERO_LAYOUT` with only the FIRST cutout and only 4 of the
marginalia entries — the hero must not be cluttered on a 375px screen.

GIT
   git add data/hero-layout.ts
   git commit -m "phase-7(C): hero decorative element positions"

CONSTRAINTS
- Exactly 3 cutouts, exactly 10 marginalia, exactly 4 corner labels.
- Check the collision rule on every marginalia entry. State in your report that you checked.
- One file only.

REPORT WHEN DONE
Print the file, and list each marginalia entry with a PASS/FAIL against the collision rule.
```

### ✅ Phase 7 gate check

```bash
npm run build && npx lighthouse http://localhost:3000 --only-categories=performance --view
```

Check the LCP element in the report. **It must be the headline text.** If it is an image or
the 3D canvas, Prompt 7-A's LCP discipline was not followed — send it back.

---

# ═══════════════════════════════════════
# PHASE 8 — HOMEPAGE SCROLL NARRATIVE
# ═══════════════════════════════════════

**Goal:** the rest of the homepage — a scroll story, not a stack of boxes.

**Done when:** the homepage reads top to bottom as one argument and ends on a CTA.

> **📦 Assets used here** — `fig-worried.png` and `fig-handshake.png` (Phase 4 priority 3),
> plus all six `spread-*.jpg` document spreads for the horizontal services gallery
> (priority 5). Sections render without them.

### ▶ PROMPT 8-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the homepage scroll sections. Work in
./components/sections and ./app/page.tsx.

NARRATIVE STRUCTURE — build these six sections in this order. Each is one beat of an argument:
  1. Hero (built)              — the claim
  2. HeroBridge (built)        — the thesis
  3. TheProblem                — what going wrong actually costs
  4. TheServices               — the eight moves available
  5. TheProcess                — what happens after you contact us
  6. TheProof                  — evidence
  7. ClosingCTA                — the ask

TASK

1. `components/sections/TheProblem.tsx` — the emotional core. A large statement in font-display
   that ScrollScales, with a row of three or four --stamp-coloured consequence cards
   (late fee, interest, notice, prosecution exposure). Each card states the trigger and the
   consequence. Every figure carries a `verified` flag from the data and unverified figures
   are omitted in production. Use --stamp here — this is exactly the case it is reserved for.
   Include one fig-worried.png ink figure as a CutOut.

2. `components/sections/TheServices.tsx` — the eight services. Reproduce the reference site's
   horizontal book-spread gallery using your HorizontalScroll primitive: eight panels, each a
   service, pinned and moving on X as the user scrolls Y. Each panel: statute marginalia
   in the corner, service name in font-display, the one-liner, a "who this is for" line, and
   a link. Below 1024px it becomes a swipeable overflow row.
   Every panel links to /services/<slug> with a real <a>. The horizontal mechanic must not
   hide any link from a crawler — verify all eight hrefs appear in `curl` output of the page.

3. `components/sections/TheProcess.tsx` — a horizontal timeline of what happens after contact:
   consultation → documents → filing → confirmation → ongoing compliance. Each step has a
   duration and who is responsible (you / us / the department). Uses the ProcessStep type.
   Animate the connecting line drawing in as it enters view, using SVG stroke-dashoffset.

4. `components/sections/TheProof.tsx` — proof without fabrication. Renders whatever real
   numbers exist in data/brand.ts; if `proof.clientsServed` is null it renders the section
   WITHOUT the number rather than showing "0" or "500+". Include the credential line from
   BRAND-FACTS.md and the trust badge row. Ink figure fig-handshake.png as a CutOut.

5. `components/sections/ClosingCTA.tsx` — the final ask, full-bleed --seal background,
   reversed type, one Magnetic CTA, phone number and email beside it (omitted if TBD), and
   the response-time promise from COPY-DECK.md.

6. Compose all of these into app/page.tsx in narrative order.

GIT
   git add components/sections/TheProblem.tsx components/sections/TheServices.tsx components/sections/TheProcess.tsx components/sections/TheProof.tsx components/sections/ClosingCTA.tsx app/page.tsx
   git commit -m "phase-8(A): homepage scroll narrative sections"

CONSTRAINTS
- Motion budget from MOTION-RULES.md: max 3 animated elements per viewport.
- All eight service links must be in the server-rendered HTML. Verify with:
    curl -s http://localhost:3000 | grep -o '/services/[a-z-]*' | sort -u
  You must see all eight slugs.
- Never render a fabricated statistic. Null means the element does not exist.

REPORT WHEN DONE
Paste the output of the curl command above.
```

### ▶ PROMPT 8-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the narrative copy and the homepage's structured content.
Work in ./data/homepage.ts and ./COPY-DECK.md.

TASK

1. `data/homepage.ts` — export typed content for each of the five new sections, so Agent A's
   components contain zero hardcoded copy:

   `PROBLEM` — { headline, body, consequences: [{ trigger, consequence, figure, statuteRef,
   verified: false }] }. Write 4 consequences covering: late GST return filing, missed ITR
   deadline, TDS non-deduction, and non-response to a departmental notice. State the
   mechanism factually and plainly. Every figure gets verified:false and a
   `<!-- VERIFY -->` note in a comment — you must not assert a penalty amount that has not
   been checked against the current Act by a human.

   `PROCESS` — 5 ProcessStep entries with realistic descriptions. Mark durationDays as 0
   with a VERIFY comment where you cannot be certain.

   `PROOF` — the structure only: which credential lines and badge slots exist. All values
   read from brand.ts at render time, none hardcoded here.

   `CLOSING` — headline, body, cta label, response-time promise.

2. Homepage FAQ set: export `HOMEPAGE_FAQS` — 8 FAQs answering the questions a first-time
   visitor actually has before they will contact anyone:
   what does the first consultation cost, how fast can you register a GST number, do you
   work with clients outside your city, what do you need from me to start, what happens if
   I have already received a notice, do you handle both filing and appeals, how do you
   charge, and who will actually be handling my file.
   Each answer: 40-70 words, self-contained, no cross-references. These are the highest-value
   sentences on the site for AI search citation — an AI engine answering "how much does GST
   registration cost in <city>" will quote whichever site answers the question completely in
   one paragraph.

3. Update COPY-DECK.md with everything above.

GIT
   git add data/homepage.ts COPY-DECK.md
   git commit -m "phase-8(B): homepage narrative copy and FAQ set"

CONSTRAINTS
- Every penalty figure, due date and rupee amount gets verified:false and a VERIFY comment.
- No superlatives. Check the advertising guardrail in BRAND-FACTS.md first.

REPORT WHEN DONE
Print the 8 homepage FAQs with word counts.
```

### ▶ PROMPT 8-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/compliance-calendar.ts`

Export a const `COMPLIANCE_CALENDAR` — an array of recurring Indian tax compliance deadlines.
Each entry has this exact shape:
  { id, formName, description, dueDay, frequency, appliesTo, statuteRef, verified: false }

  frequency is one of: 'monthly' | 'quarterly' | 'annual'
  dueDay is a number (day of month) for monthly, or a string 'DD-MMM' for annual
  verified is ALWAYS false — every single entry
  appliesTo is an array of strings describing who it applies to

Create exactly these 14 entries. Use the form names and descriptions given; put `dueDay: 0`
and a `// VERIFY` comment on the line for any date you are not completely certain of.
DO NOT GUESS A DATE. A wrong due date on a tax practice's website is worse than no date.

  GSTR-1        monthly    outward supplies return
  GSTR-3B       monthly    summary return and tax payment
  GSTR-9        annual     annual return
  GSTR-9C       annual     reconciliation statement
  CMP-08        quarterly  composition scheme statement
  ITR (individual, non-audit)   annual
  ITR (audit cases)             annual
  Tax audit report (3CA/3CB-3CD) annual
  TDS payment                    monthly
  Form 24Q      quarterly  TDS on salary
  Form 26Q      quarterly  TDS on non-salary payments
  Form 27Q      quarterly  TDS on payments to non-residents
  Form 16       annual     salary TDS certificate to employees
  Advance tax instalments        quarterly

Then export a function `getUpcoming(fromDate: Date, count: number)` that returns the next N
deadlines sorted by date, SKIPPING any entry where verified is false. Since all entries start
unverified, this function correctly returns an empty array until a human verifies the dates.
Add a comment explaining that this behaviour is intentional, not a bug.

GIT
   git add data/compliance-calendar.ts
   git commit -m "phase-8(C): compliance calendar skeleton, all entries pending verification"

CONSTRAINTS
- verified: false on every entry, no exceptions.
- Do not guess any date. dueDay: 0 with a VERIFY comment is the correct answer when unsure.
- One file only.

REPORT WHEN DONE
Print the file and confirm all 14 entries have verified: false.
```

### ✅ Phase 8 gate check

```bash
npm run build && curl -s http://localhost:3000 | grep -o '/services/[a-z-]*' | sort -u | wc -l
```

Must output `8`.

---

# ═══════════════════════════════════
# PHASE 9 — SERVICES ARCHITECTURE
# ═══════════════════════════════════

**Goal:** the route structure and page template that all eight services share.

**Done when:** `/services` lists eight services and each `/services/<slug>` renders.

> **📦 Assets used here** — one `fig-*.png` per service page, mapped in `data/assets.ts`.
> Suggested pairing: GST registration → `fig-shopkeeper`, import-export → `fig-exporter`,
> entity formation → `fig-couple-shop`, appeals → `fig-worried`, ITR/TDS →
> `fig-accountant-desk`, PAN → `fig-consultant`, GST returns → `fig-textile-trader`.

### ▶ PROMPT 9-A — Agent A (Architect)

```text
You are Agent A (Architect). You own routing and the page template. Work in
./app/services and ./components/sections.

TASK

1. `app/services/page.tsx` — the services index. Server component. Renders all eight from
   data/services.ts, grouped by category (registration / filing / litigation / trade).
   Each card: statute marginalia, name in font-display, one-liner, turnaround, and a link.
   Reveal animation with stagger. Breadcrumbs at the top.

2. `app/services/[slug]/page.tsx` — the dynamic service template. Must include:
   - `generateStaticParams()` returning all eight slugs so every service page is statically
     generated at build time — these are the highest-commercial-intent pages on the site and
     they must be instant.
   - `generateMetadata({ params })` producing per-service title, description, canonical and
     OpenGraph from the service data.
   - `notFound()` for an unknown slug.
   - The page composition, in this exact order (the order is an SEO decision — the answer
     comes before the marketing):
       Breadcrumbs
       H1 (service.name variant from copy deck)
       AnswerBlock          ← the quotable 40-60 word direct answer
       Who needs this
       What's included
       Documents required   ← interactive checklist component
       Process timeline
       Pricing              ← government fee vs professional fee, clearly separated
       Penalties / risk of inaction
       FAQ accordion
       Related services
       CTA

3. `components/sections/ServiceHero.tsx` — a compact service-page hero: eyebrow label with
   the category, H1 in font-display, the one-liner, turnaround and price-from chips, and a
   CutOut of the relevant ink figure. Never full-viewport — on a service page the user has
   a task, so the answer must be visible without scrolling on a laptop.

4. `components/sections/PricingBlock.tsx` — renders government fee and professional fee as
   two visually distinct amounts with a total. If a fee is null it renders "On request" with
   a link to contact, never "₹0" or "Free". Uses formatINR for Indian digit grouping.

5. `app/services/[slug]/opengraph-image.tsx` — dynamic OG image generation using next/og,
   rendering the service name over the paper/ledger background. Size 1200×630, edge runtime.

GIT
   git add app/services components/sections/ServiceHero.tsx components/sections/PricingBlock.tsx
   git commit -m "phase-9(A): services index, dynamic service template, pricing block, OG images"

CONSTRAINTS
- All eight service pages must be statically generated. Confirm in the build output that
  each shows as ● (SSG), not ƒ (dynamic).
- The AnswerBlock must appear before any marketing copy in the DOM order.
- Never render ₹0 for an unknown price.

REPORT WHEN DONE
Paste the build output route table showing all eight service routes and their render mode.
```

### ▶ PROMPT 9-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You own service page content and per-service SEO. Work in
./data/service-content.ts and ./components/content.

TASK

1. `components/content/DocumentChecklist.tsx` — an interactive tick-box list of required
   documents, as specified in instrtion.md. Requirements:
   - Renders as a real <ul> with real text — the list must be fully readable without
     JavaScript, because this is exactly the content an AI search engine gets asked for
     ("what documents do I need for GST registration").
   - Checkbox state persists in localStorage, keyed by service slug.
   - Shows "N of M collected" progress.
   - A "download this checklist" button that generates a plain text file client-side — no
     server round trip, no email gate. Give the checklist away; the gated lead magnet is a
     different asset in Phase 15.
   - Each document can carry a `note` explaining an edge case, in a disclosure.

2. `components/content/RelatedServices.tsx` — renders the relatedSlugs as cards. This is the
   internal-linking engine instrtion.md calls for: every service page must pass authority to
   2-3 others, and every service must be reachable within two clicks from any other.

3. `data/service-content.ts` — for each of the eight services, export the long-form content:
   - `h1` (under 60 chars, contains primary keyword)
   - `metaTitle` (under 60), `metaDescription` (under 155)
   - `directAnswer` — 40-60 words, completely self-contained, names the entity in full
   - `whoNeedsIt` — 4-6 bullet strings, each a recognisable real situation, not a category
   - `whatsIncluded` — 5-8 bullet strings describing deliverables
   - `bodyHtml` — 3-5 paragraphs of plain-language explanation
   - `penaltyNote` — what happens if they do nothing, with verified:false
   - `intro` for the OG image

   Writing standard for `directAnswer`: assume it will be displayed with no other context,
   attributed to this practice, in a ChatGPT or Google AI answer. It must be true, complete,
   and useful standing alone. Never begin with "We provide" — begin with the fact.
   Good: "GST registration is mandatory for businesses with annual turnover above the
   threshold applicable to their state and supply type. Registration is applied for in
   Form REG-01 and the GSTIN is issued in Form REG-06."
   Bad: "We provide fast and reliable GST registration services for all your business needs."

GIT
   git add components/content/DocumentChecklist.tsx components/content/RelatedServices.tsx data/service-content.ts
   git commit -m "phase-9(B): document checklist, related services, service long-form content"

CONSTRAINTS
- Every threshold, rate, fee and deadline gets verified:false and a VERIFY comment.
- The checklist must be readable with JavaScript disabled.
- Do not edit anything in app/services — Agent A owns those this phase.

REPORT WHEN DONE
Print all eight directAnswer strings with word counts. Every one must be 40-60 words.
```

### ▶ PROMPT 9-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical data entry. Follow the specification exactly.

CONTEXT
Work only in ./data. Read ./data/services.ts for the eight slugs.

TASK — create exactly one file: `data/documents.ts`

Export a const `DOCUMENTS_BY_SERVICE` — a Record mapping each of the eight service slugs to
an array of DocumentRequirement objects:
  { id, label, appliesTo: string[], mandatory: boolean, note?: string }

Fill in the document lists from the standard requirements below. Use exactly these, do not
add documents you are not certain about — an incorrect document list wastes a client's time
and makes the practice look careless.

pan-card-services:
  Proof of identity, Proof of address, Proof of date of birth, Passport-size photographs,
  Signature specimen. mandatory: true for all. appliesTo: ['Individual'] except where the
  applicant is a company or firm, where the requirement is a certificate of incorporation
  or partnership deed instead — add those as separate entries with appliesTo ['Company'] /
  ['Partnership Firm'].

gst-registration:
  PAN of applicant, Aadhaar of authorised signatory, proof of business registration or
  incorporation certificate, identity and address proof of promoters/directors with
  photographs, address proof of place of business, bank account statement or cancelled
  cheque, digital signature (DSC) where applicable, letter of authorisation / board
  resolution for the authorised signatory.

entity-formation:
  PAN and identity proof of each partner/trustee/member, address proof of each,
  passport-size photographs, proof of registered office address, NOC from the property
  owner, the draft deed (partnership deed / trust deed / society memorandum and rules),
  and the subscriber signatures page.

income-tax-tds-returns:
  PAN, Form 16 / Form 16A, bank statements for the year, Form 26AS and AIS download,
  investment and deduction proofs, capital gains statements, rental income details,
  previous year's return copy, TAN (for TDS returns), challan details of tax paid.

gst-returns-filing:
  Sales register / outward supply invoices, purchase register / inward supply invoices,
  debit and credit notes, e-way bill data, HSN summary, previous period's returns,
  ITC reconciliation with GSTR-2B, and the GST portal credentials.

income-tax-appeals:
  Copy of the assessment order, notice of demand, the return filed for that year,
  submissions and evidence filed during assessment, grounds of appeal, statement of facts,
  proof of payment of the appeal fee, and the authorisation in favour of the representative.

gst-appeals:
  Copy of the order appealed against, the show cause notice and reply, grounds of appeal,
  statement of facts, proof of pre-deposit, relevant returns and reconciliations, and
  the authorisation.

import-export-licence:
  PAN, Aadhaar, certificate of incorporation or partnership deed, bank certificate or
  cancelled cheque bearing the entity name, address proof of the business premises,
  digital signature, and the list of products intended to be imported or exported.

For every entry: write a clear `label`, set `mandatory` honestly (if a document is only
required in some cases, mandatory is false and the `note` explains when it applies), and set
`appliesTo` to the applicant types it covers.

At the top of the file add this comment verbatim:
  // Document lists are indicative and must be confirmed against the current
  // departmental requirements before publication. See Phase 20 VERIFY sweep.

GIT
   git add data/documents.ts
   git commit -m "phase-9(C): document requirement lists for all eight services"

CONSTRAINTS
- All eight slugs must be present as keys.
- Do not add documents beyond those specified. If unsure whether something belongs, leave
  it out rather than guessing.
- One file only.

REPORT WHEN DONE
Print the count of documents per service and confirm all 8 keys exist.
```

### ✅ Phase 9 gate check

```bash
npm run build 2>&1 | grep -A 20 "Route (app)"
```

All eight `/services/[slug]` entries must show as statically prerendered.

---

# ═════════════════════════════════════
# PHASE 10 — THE EIGHT SERVICE PAGES
# ═════════════════════════════════════

**Goal:** fill every service page with content deep enough to outrank a national portal.

**Reality check:** a generic "we do GST registration" page cannot beat ClearTax or IndiaFilings
on volume. It can beat them on *specificity* — real jurisdictional detail, the actual edge
cases, and a named human being with credentials behind the answer. That is the entire
strategy of this phase.

### ▶ PROMPT 10-A — Agent A (Architect)

```text
You are Agent A (Architect). You build the interactive blocks the service pages need.
Work in ./components/content and ./components/ui.

TASK

1. `components/content/ProcessTimeline.tsx` — the visual roadmap instrtion.md requires.
   A vertical timeline on mobile, horizontal on desktop. Each step: order number in
   font-label, title, description, duration chip, and an owner badge (You / Us / Department)
   colour-coded. An SVG connector line draws in on scroll. Total elapsed days shown at the end.
   Must be readable as a plain ordered list with CSS disabled.

2. `components/content/PenaltyCallout.tsx` — the risk block. --stamp left border, no fill
   (a solid red block reads as an error state, which is not the message). States the trigger,
   the consequence, and the statute reference. If `verified` is false, renders nothing in
   production and renders a loud yellow "UNVERIFIED — do not publish" banner in development.

3. `components/content/FeeTable.tsx` — the pricing transparency table. Two clearly separated
   columns: what the government charges and what the practice charges. A note explaining
   that government fees are set by the department and are not the practice's revenue —
   this single distinction is the most trust-building thing on a tax site, because it is the
   thing every competitor obscures.
   Mobile: the table must scroll inside its own container. The page must never scroll
   horizontally.

4. `components/ui/StickyCTA.tsx` — a service-page sidebar CTA on desktop that sticks below
   the header, and a bottom bar on mobile that appears after 40% scroll depth. Contains:
   the CTA button, the phone number, and a WhatsApp link (both omitted when TBD). Must not
   cover content, must be dismissible, and dismissal persists for the session.

5. `components/ui/TableOfContents.tsx` — auto-generated from the page's h2 elements, sticky
   on desktop, with scroll-spy highlighting the current section. Improves dwell time on long
   pages and gives crawlers an explicit section map. Uses IntersectionObserver, cleans up
   properly, hidden below 1280px.

GIT
   git add components/content/ProcessTimeline.tsx components/content/PenaltyCallout.tsx components/content/FeeTable.tsx components/ui/StickyCTA.tsx components/ui/TableOfContents.tsx
   git commit -m "phase-10(A): process timeline, penalty callout, fee table, sticky CTA, TOC"

CONSTRAINTS
- PenaltyCallout must not render unverified content in production. Test both NODE_ENV values.
- No horizontal page scroll at 320px viewport width. Test it.

REPORT WHEN DONE
Confirm the production/development behaviour of PenaltyCallout and the 320px test result.
```

### ▶ PROMPT 10-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. This is your biggest content phase. You write the full body of all eight
service pages. Work in ./content/services/*.mdx and ./data/service-faqs.ts.

TASK

1. Create one MDX file per service in `content/services/`, named `<slug>.mdx`. Each file
   is 1200-1800 words and follows this exact structure:

   ---
   frontmatter: slug, title, metaTitle, metaDescription, updated, author, reviewedBy
   ---
   ## <The direct question a person would ask>
   <The 40-60 word direct answer — already written in Phase 9, reuse it verbatim>

   ## Who needs this
   ## What the process actually involves
   ## Documents you will need
   ## How long it takes and what can delay it     ← the differentiator, see below
   ## What it costs
   ## What happens if you do not do this
   ## Common mistakes
   ## How this practice handles it
   ## Frequently asked questions

   THE DIFFERENTIATOR: the "what can delay it" section is where you beat the national
   portals. They publish the happy path. Write the failure modes: address proof mismatches,
   Aadhaar authentication failure, the officer raising a query, a mismatch between the PAN
   name and the bank record, jurisdiction assignment delays. A business owner searching at
   11pm because their application was rejected will find only your page. That visitor is
   worth more than a hundred top-of-funnel ones.

2. `data/service-faqs.ts` — 10 FAQs per service, 80 total. Each: question phrased exactly as
   a person would type or speak it, answer 40-80 words and self-contained, verified:false.
   Cover: cost, timeline, documents, eligibility, what-if-rejected, penalties, whether it can
   be done online, whether they need to visit, what happens after, and renewal/ongoing duties.

   Do NOT stuff keywords. instrtion.md is explicit about this and it is correct: an FAQ
   block that repeats "GST registration" nine times reads as spam to both a human and a
   modern ranking system. Write them the way you would answer on the phone.

3. Every compliance assertion gets `<!-- VERIFY -->` inline. There will be hundreds. That is
   expected and correct.

GIT
   git add content/services data/service-faqs.ts
   git commit -m "phase-10(B): eight full service page bodies and 80 FAQs"

CONSTRAINTS
- 1200-1800 words per service. Count and report each.
- Exactly 10 FAQs per service, 80 total.
- No keyword stuffing. No superlatives. Check the advertising guardrail first.

REPORT WHEN DONE
Print a table: service, word count, FAQ count, VERIFY marker count.
```

### ▶ PROMPT 10-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical data entry. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/process-steps.ts`

Export a const `PROCESS_BY_SERVICE` — a Record mapping each of the eight service slugs to an
array of ProcessStep objects:
  { order: number; title: string; description: string; owner: 'client'|'firm'|'government'; durationDays: number }

Write 5 to 7 steps per service. Rules for filling this in:
- `owner` is who is actually doing the work in that step, which is the whole point of this
  data: it tells a prospective client exactly how much of this lands on them.
- `durationDays` is 0 with a `// VERIFY` comment wherever you are not certain. Do not guess.
- `description` is one plain sentence, present tense, addressed to the client as "you" when
  owner is 'client'.

Structure every service's steps around this spine, adapted to the specific service:
  1. Initial consultation and scope confirmation                     owner: firm
  2. Document collection from the client                             owner: client
  3. Verification and preparation of the application/return          owner: firm
  4. Filing / submission on the relevant portal                      owner: firm
  5. Departmental processing, queries, or verification               owner: government
  6. Certificate / acknowledgement delivered to the client           owner: firm
  7. Ongoing compliance handover (where applicable)                  owner: firm

For income-tax-appeals and gst-appeals, replace steps 3-5 with: grounds of appeal drafting,
statement of facts preparation, appeal filing with fee payment, and hearing representation.

For import-export-licence, add a step for the bank certificate / cancelled cheque validation.

GIT
   git add data/process-steps.ts
   git commit -m "phase-10(C): process steps for all eight services"

CONSTRAINTS
- All eight slugs present. 5-7 steps each.
- durationDays: 0 with a VERIFY comment wherever uncertain. Do not invent timelines.
- One file only.

REPORT WHEN DONE
Print the step count per service and the total count of VERIFY comments.
```

### ✅ Phase 10 gate check

```bash
npm run build && grep -ro "VERIFY" content/ data/ | wc -l
```

Note that number. Phase 20 clears it to zero.

---

# ═══════════════════════════════
# PHASE 11 — COMPLIANCE TOOLS
# ═══════════════════════════════

**Goal:** five calculators. These are the highest-ROI pages on the entire site.

**Why they matter more than blog posts:** a calculator is a link magnet, ranks for hundreds
of long-tail queries, is quoted by AI engines as a resource, and captures someone at the
exact moment they have a number-shaped problem. One good calculator outperforms twenty blog
posts, and competitors cannot copy it in an afternoon.

### ▶ PROMPT 11-A — Agent A (Architect)

```text
You are Agent A (Architect). You build the calculators. Work in ./app/tools and
./components/tools and ./lib/calc.

BUILD THESE FIVE, each at its own indexable route:

  /tools/gst-calculator              — GST inclusive/exclusive, all slabs, CGST+SGST vs IGST split
  /tools/gst-late-fee-calculator     — late fee and interest for delayed GSTR-1 / GSTR-3B
  /tools/tds-rate-finder             — select payment type → applicable section and rate
  /tools/itr-form-selector           — answer 5 questions → which ITR form applies and why
  /tools/hsn-sac-lookup              — search HSN/SAC codes with the applicable rate

TASK

1. `lib/calc/*.ts` — put every calculation in PURE FUNCTIONS with zero React dependency,
   one file per calculator. Each function takes typed inputs and returns a typed result
   including a `breakdown` array explaining how it got there. Showing the working is the
   product: anyone can output a number, and a tax practice that shows the arithmetic is
   demonstrating competence.

2. Write a test file per calculator using Node's built-in test runner
   (`node --test`), covering at minimum: zero, the boundary of each slab, a value above the
   highest slab, and a negative input (which must throw, not return NaN). Add
   `"test": "node --test lib/calc/*.test.ts"` to package.json scripts.
   These are the only functions on the site where a wrong answer directly misleads someone
   about money they owe. They get tests.

3. `components/tools/CalculatorShell.tsx` — shared chrome: title, the tool, the breakdown
   panel, a "copy result" button, a "print / save as PDF" button, a share link that encodes
   the inputs in the URL query string (so results are linkable — this is how calculators earn
   backlinks), and a prominent disclaimer that the result is indicative and not tax advice.

4. Each calculator UI: inputs update the result live with no submit button, all rates come
   from data files not hardcoded numbers, keyboard fully operable, and the result region is
   `aria-live="polite"` so screen reader users hear it update.

5. `app/tools/page.tsx` — the tools index, linking all five, with a one-line description of
   what problem each solves.

6. Every calculator page gets its inputs and results in the server-rendered HTML with sensible
   defaults, so the page has real indexable content before JavaScript runs.

GIT
   git add app/tools components/tools lib/calc package.json
   git commit -m "phase-11(A): five compliance calculators with tested pure-function cores"

CONSTRAINTS
- No rate, slab, or threshold is hardcoded in a component. All of it comes from data files
  (Agent C's job this phase) so a rate change is a one-line data edit, not a code hunt.
- Every calculator has passing tests before you commit. Run `npm test` and paste the output.
- Negative and non-numeric inputs must be handled explicitly, never produce NaN on screen.

REPORT WHEN DONE
Paste the full `npm test` output.
```

### ▶ PROMPT 11-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You make the calculators rank. Work in ./content/tools/*.mdx and
./data/tool-meta.ts.

TASK

1. For each of the five tools, write an MDX explainer that renders BELOW the calculator,
   600-900 words, in `content/tools/<tool-slug>.mdx`:
   - How the calculation actually works, with the formula written out
   - A worked example with real numbers
   - The edge cases the calculator handles and the ones it does not
   - When you would need a professional rather than a calculator ← the conversion bridge
   - 6 FAQs specific to that calculation

   The "when you need a professional" section is the commercial engine of this phase. It must
   be honest, not a hard sell: name the specific situations where a calculator's answer would
   be wrong or incomplete (multiple states, reverse charge, ITC reversal, a notice already
   received). Honesty here converts far better than urgency, because the reader can tell you
   just talked them out of paying you in the simple case.

2. `data/tool-meta.ts` — per tool: metaTitle (under 60), metaDescription (under 155),
   primary keyword, 8 long-tail keyword variants, and a 40-word directAnswer for the
   AnswerBlock at the top of the page.

3. Add to CONTENT-STRATEGY.md a section on tool-led acquisition: which searches each
   calculator targets, what to link to it from, and why a calculator page attracts links
   that a service page never will.

GIT
   git add content/tools data/tool-meta.ts CONTENT-STRATEGY.md
   git commit -m "phase-11(B): calculator explainers, metadata, and acquisition strategy"

CONSTRAINTS
- Every rate or threshold mentioned gets a VERIFY marker.
- Do not edit anything in app/tools, components/tools, or lib/calc — Agent A owns those.

REPORT WHEN DONE
Print the five metaTitles with character counts.
```

### ▶ PROMPT 11-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical data entry. This file feeds live calculators, so accuracy of
STRUCTURE matters even though the human verifies the VALUES.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/tax-rates.ts`

Export four typed consts. Every single numeric value carries a sibling `verified: false`
field, and every group carries an `effectiveFrom: 'TBD'` and `source: 'TBD'` field.

1. `GST_SLABS` — array of { rate: number; label: string; examples: string[]; verified: false }
   Rates: 0, 0.25, 3, 5, 12, 18, 28. For `examples`, give 3-4 broad, uncontroversial
   category names per slab. If you are not confident a category belongs in a slab, use the
   string 'TBD — verify' instead of guessing. A wrong slab on a live calculator is a
   material error.

2. `TDS_SECTIONS` — array of { section: string; paymentType: string; rateIndividual: number|null;
   rateOther: number|null; thresholdAnnual: number|null; verified: false }
   Include these sections with paymentType filled in and ALL rate/threshold values set to
   null with a `// VERIFY` comment: 192, 192A, 194, 194A, 194C, 194D, 194H, 194I(a), 194I(b),
   194J, 194K, 194N, 194O, 194Q, 194R, 206AB, 206C(1H).
   Set every rate to null. Do not guess a TDS rate.

3. `LATE_FEE_RULES` — array of { form: string; perDayFee: number|null; perDayFeeNilReturn: number|null;
   maxFee: number|null; interestRatePA: number|null; verified: false }
   For forms: GSTR-1, GSTR-3B, GSTR-4, GSTR-9. All numeric values null with VERIFY comments.

4. `ITR_FORMS` — array of { form: string; appliesTo: string[]; doesNotApplyTo: string[]; verified: false }
   For ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, ITR-7. The appliesTo/doesNotApplyTo are
   descriptive text, not numbers, so fill these in with the standard eligibility descriptions.

At the top of the file, this comment verbatim:
  // EVERY NUMERIC VALUE HERE IS UNVERIFIED AND SET TO null BY DESIGN.
  // Calculators render a "rates pending verification" state until a human fills these in
  // from the current official notification and flips verified to true.
  // Publishing a guessed tax rate is the single worst failure mode of this project.

Export a helper `allRatesVerified(): boolean` that returns true only when every entry in all
four consts has verified === true.

GIT
   git add data/tax-rates.ts
   git commit -m "phase-11(C): tax rate tables, all values pending human verification"

CONSTRAINTS
- Every rate, threshold and fee is null. Zero exceptions. Do not fill in a single number.
- verified: false on every entry.
- One file only.

REPORT WHEN DONE
Confirm that zero numeric rate values were filled in, and print allRatesVerified()'s result
(it must be false).
```

### ✅ Phase 11 gate check

```bash
npm test && npm run build
```

Calculators will show a "rates pending verification" state. **That is correct.** Fill
`data/tax-rates.ts` from the current official notifications, flip `verified` to `true`, and
they go live. Do not launch with guessed rates.

---

# ═══════════════════════════════════
# PHASE 12 — LEAD CAPTURE FUNNEL
# ═══════════════════════════════════

**Goal:** turn traffic into consultations. Everything before this phase was setup.

**Done when:** a submitted form arrives as an email and the user sees a real confirmation.

### ▶ PROMPT 12-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the form system and the API. Work in
./app/contact, ./app/api, ./components/forms, ./lib.

TASK

1. `lib/schemas.ts` — Zod schemas shared by client and server. `consultationSchema`:
   name (2-80 chars), phone (Indian mobile: 10 digits, optionally +91 prefixed — write the
   regex correctly and test it), email (optional but validated when present), service (enum
   of the eight slugs plus 'other'), situation (enum: 'starting out' | 'ongoing compliance' |
   'received a notice' | 'appeal or dispute' | 'not sure'), urgency (enum: 'this week' |
   'this month' | 'planning ahead'), message (max 1500 chars, optional),
   consent (must be literal true), and a honeypot field `company` that must be empty.

2. `components/forms/ConsultationForm.tsx` — the multi-step form instrtion.md requires:
   Step 1: what do you need help with (service + situation)
   Step 2: how urgent is it
   Step 3: your details (name, phone, email)
   Step 4: anything else (message + consent)
   Requirements:
   - Progress indicator showing step N of 4.
   - Validates the current step before advancing; cannot skip ahead.
   - Back preserves all entered data.
   - Inline errors appear below the field, are announced via aria-describedby, and say what
     to do next, not just what is wrong.
   - Framer Motion transitions between steps, disabled under reduced motion.
   - The first field of each step receives focus on entry.
   - A "one question at a time" form converts better than a wall of fields, but ONLY if it
     never loses data. Test the back button on every step.
   - The whole form works without JavaScript as a single-page native form POST fallback.

3. `app/api/consultation/route.ts` — POST handler:
   - Re-validates with the same Zod schema. Never trust the client.
   - Rejects if the honeypot field is non-empty (silently return 200 so a bot learns nothing).
   - In-memory rate limit: max 5 submissions per IP per hour, returning 429 with a
     Retry-After header.
   - Sends via Resend to CONTACT_TO_EMAIL with a clean, readable plain-text body and a
     subject line containing the service and urgency so the practice can triage from the
     inbox list without opening anything.
   - Sends a confirmation email to the enquirer if they gave one, stating what happens next
     and by when.
   - Returns typed JSON. Never leaks the error message from Resend to the client.
   - Logs failures to the server console with enough context to debug, and never logs the
     enquirer's phone or email in full.

4. `components/ui/Toast.tsx` — the non-intrusive feedback instrtion.md requires. Accessible
   (role="status", aria-live polite), auto-dismisses after 6 seconds, dismissible, stacks.

5. `app/contact/page.tsx` — the form, the direct contact details from brand.ts (omitted when
   TBD), office hours, and the map placeholder (Phase 18 fills it).

6. `app/contact/thank-you/page.tsx` — a real page, not a modal. It must be a distinct URL so
   it can be used as a GA4 conversion destination. States what happens next and by when.

GIT
   git add lib/schemas.ts components/forms app/api/consultation components/ui/Toast.tsx app/contact
   git commit -m "phase-12(A): multi-step consultation form, validated API route, toasts"

CONSTRAINTS
- Server-side validation is mandatory and independent of the client.
- RESEND_API_KEY is read from process.env only. It must never appear in a tracked file.
- Test the Indian phone regex against: 9876543210, +919876543210, 919876543210,
  09876543210, 1234567890, 98765 43210. Report which pass and confirm the behaviour is
  what you intend for each.

REPORT WHEN DONE
Paste the phone regex test results and confirm the no-JavaScript fallback works.
```

### ▶ PROMPT 12-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the form's words. Words are most of a form's conversion rate.
Work in ./data/form-copy.ts and ./COPY-DECK.md.

TASK

1. `data/form-copy.ts` — every string in the form, typed:
   - Step headings and subheadings. Each heading is a question in plain language, not a
     label. "What do you need help with?" not "Service selection".
   - Every field label and placeholder. Placeholders show format, never repeat the label.
   - Every error message. The rule: say what to do, not what went wrong.
     Bad:  "Invalid phone number"
     Good: "Enter a 10-digit mobile number, like 9876543210"
   - The consent checkbox text. It must plainly state what the practice will do with the
     information and that it will not be shared. Write it as a sentence a person would
     actually read, not as legal boilerplate.
   - The submit button label at each step, and the final one. The final label states the
     outcome: "Request a consultation", never "Submit".
   - The success toast, the thank-you page copy, and the failure message with a fallback
     phone number.
   - The urgency and situation option labels. These should be phrased as the visitor
     experiences them, e.g. "I've received a notice" — a person in that situation will
     recognise themselves and self-select, which gives the practice triage information for free.

2. `data/contact-reasons.ts` — the routing map: which situation + service combination should
   produce which email subject prefix, so the practice can filter its inbox.

3. Write the confirmation email body: what happens next, the expected response window, what
   to have ready before the call, and the practice's direct number if it is urgent. Keep it
   under 120 words. Nobody reads more than that in a confirmation email.

4. Update COPY-DECK.md with all of it.

GIT
   git add data/form-copy.ts data/contact-reasons.ts COPY-DECK.md
   git commit -m "phase-12(B): form microcopy, error messages, confirmation email"

CONSTRAINTS
- Every error message must contain an instruction.
- Do not edit any component or API file — Agent A owns those this phase.

REPORT WHEN DONE
Print every error message string so they can be reviewed together for tone consistency.
```

### ▶ PROMPT 12-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly one file: `data/form-fields.ts`

Export the field configuration the form renders from. Four consts:

1. `SERVICE_OPTIONS` — derived from ./services by mapping each service to
   { value: slug, label: shortName }, then append exactly one extra entry:
   { value: 'other', label: 'Something else' }.
   Derive it — do not hand-copy the eight services.

2. `SITUATION_OPTIONS` — exactly these five, in this order:
   { value: 'starting-out',    label: "I'm starting something new" }
   { value: 'ongoing',         label: 'I need ongoing filing and compliance' }
   { value: 'notice',          label: "I've received a notice" }
   { value: 'appeal',          label: 'I have a dispute or appeal' }
   { value: 'unsure',          label: "I'm not sure — I need advice" }

3. `URGENCY_OPTIONS` — exactly these three, in this order:
   { value: 'this-week',   label: 'This week', hint: 'There is a deadline or a notice' }
   { value: 'this-month',  label: 'This month', hint: 'It needs doing but is not on fire' }
   { value: 'planning',    label: 'Planning ahead', hint: 'I want to get this right first' }

4. `FORM_STEPS` — an array of 4 objects:
   { id, order, fields: string[], headingKey: string }
   Step 1 fields: ['service', 'situation']
   Step 2 fields: ['urgency']
   Step 3 fields: ['name', 'phone', 'email']
   Step 4 fields: ['message', 'consent']

Add `as const` and export a type `ServiceOption = typeof SERVICE_OPTIONS[number]['value']`.

GIT
   git add data/form-fields.ts
   git commit -m "phase-12(C): form field options and step configuration"

CONSTRAINTS
- SERVICE_OPTIONS must be derived from services.ts programmatically, not typed by hand.
- Exactly 5 situations, exactly 3 urgency levels, exactly 4 steps.
- One file only.

REPORT WHEN DONE
Print the file and the resolved SERVICE_OPTIONS array (all nine entries).
```

### ✅ Phase 12 gate check

Add your Resend key to `.env.local`, then:

```bash
npm run dev
```

Submit the form. **A real email must arrive.** Then submit with JavaScript disabled — it must
still work. Then submit six times in an hour — the sixth must be rejected with a 429.

---

# ═══════════════════════════════════
# PHASE 13 — TRUST & SOCIAL PROOF
# ═══════════════════════════════════

> **Read the advertising guardrail in `BRAND-FACTS.md` before running this phase.**
> If the principal is a practising Chartered Accountant under ICAI, run this phase in
> **conservative mode**: no testimonials, no client logos, no superlatives. The prompts
> below handle both modes — tell each agent which one applies.

**Goal:** make a stranger believe this practice will not go quiet on them.

> **📦 Assets here are NOT generated. Do not use Gemini for any of them.**
> - **The principal's photograph** must be a real photograph of the real person. An
>   AI-generated portrait presented as a named, credentialed professional is a fabricated
>   likeness on a page whose entire purpose is proving a real human stands behind the advice.
>   It also defeats the E-E-A-T signal it was meant to create.
> - **Accreditation logos** come from the issuing bodies, and only ones the practice is
>   entitled to display. Never regenerate a regulator's mark.
> - **Client logos**, if used at all, come from the clients with permission.
>
> Take a decent photo on a phone against a plain wall in soft daylight. That outranks any
> generated portrait, because it is true.

### ▶ PROMPT 13-A — Agent A (Architect)

```text
You are Agent A (Architect). You build the trust components. Work in
./components/sections and ./app/practice.

FIRST: read the advertising guardrail at the bottom of ./BRAND-FACTS.md. Build every
component so it renders correctly in BOTH modes, switching on a single exported constant
`ADVERTISING_MODE` in data/brand.ts ('conservative' | 'standard'). In conservative mode,
testimonial and client-logo components render nothing at all — not an empty state, nothing.

TASK

1. `components/sections/CredentialBar.tsx` — the trust badges instrtion.md requires. Renders
   only badges the practice may legally display, from data. Each badge: the mark, the
   accrediting body's full name, and the membership or registration number where applicable.
   A badge with no number attached is weaker than no badge — omit unverified ones.

2. `components/sections/CaseStudyCard.tsx` + `app/case-studies/page.tsx` +
   `app/case-studies/[slug]/page.tsx` — the STAR-structured case studies instrtion.md calls
   for (Situation, Task, Action, Result). Each renders as four labelled sections. Statically
   generated. Every case study is anonymised at the source and carries an explicit
   `consentObtained: boolean` — any entry without consent does not render, in either mode.

3. `components/sections/TestimonialCarousel.tsx` — STANDARD MODE ONLY. Reproduce the
   reference's smooth horizontal card scroll. Requirements: real drag/swipe, arrow buttons,
   keyboard arrows, pauses on hover and on focus, respects reduced motion (becomes a static
   grid), and every card is real text in the DOM, not an image. Cards carry name, role, and
   the service used.

4. `components/sections/ClientMarquee.tsx` — STANDARD MODE ONLY. The infinite logo scroll.
   CSS-animated (not JavaScript), pauses on hover, duplicated track for seamless looping,
   aria-hidden with a visually-hidden real list beside it for screen readers and crawlers.

5. `app/practice/page.tsx` and `app/practice/principal/page.tsx` — the About pages. The
   principal page is an E-E-A-T page and it is one of the most important pages on the site:
   full name, credentials with membership numbers, years in practice, areas of specialisation,
   professional history, and a real photograph. Google and AI engines both weight
   author identity heavily for financial and legal topics — an anonymous tax site competes
   at a permanent structural disadvantage against one with a named, credentialed human.
   Every field comes from brand.ts and omits itself when TBD.

GIT
   git add components/sections/CredentialBar.tsx components/sections/CaseStudyCard.tsx components/sections/TestimonialCarousel.tsx components/sections/ClientMarquee.tsx app/case-studies app/practice
   git commit -m "phase-13(A): credentials, case studies, testimonials, practice pages"

CONSTRAINTS
- Test both ADVERTISING_MODE values. In conservative mode the site must have no dangling
  headings or empty sections where testimonials were.
- consentObtained:false means the case study does not render. No exceptions.

REPORT WHEN DONE
Describe what the homepage and practice page look like in each of the two modes.
```

### ▶ PROMPT 13-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the proof content. Work in ./content/case-studies/*.mdx and
./data/practice-content.ts.

FIRST: read the advertising guardrail in ./BRAND-FACTS.md and write accordingly.

TASK

1. Write 5 case studies in `content/case-studies/`, using the STAR structure:
   - Situation: the client's position when they arrived (anonymised: "a textile trader in
     <city> with turnover around ₹4 crore")
   - Task: what needed to happen and by when
   - Action: what the practice actually did, step by step, naming the forms and sections
   - Result: the measurable outcome

   Cover these five scenarios: a GST registration rejected twice before the practice took it
   over; a business that received a Section 148 reassessment notice; a trust seeking 12A and
   80G registration; an exporter setting up IEC and LUT for the first time; a company with
   three years of unfiled TDS returns and accumulated late fees.

   CRITICAL: these are ILLUSTRATIVE STRUCTURES, not claims. Every file's frontmatter carries
   `status: 'template'` and `consentObtained: false`, so none of them render. They exist so
   the practice can replace the details with real matters and flip the flags. Add a comment
   block at the top of each file stating this in plain language.
   Publishing a fabricated case study as real is a fraud risk and a reputational one — the
   flags make that mistake structurally impossible rather than relying on someone remembering.

2. `data/practice-content.ts` — the About and Principal page copy. Structure only, with every
   factual field reading from brand.ts. Write the narrative connective tissue: the practice's
   approach, how it works with clients, what a client can expect. No claims about size,
   experience, or client count.

3. Write the `PRINCIPLES` section: 4-6 statements of how this practice works
   (e.g. "You will always know which stage your matter is at"). These are commitments, not
   boasts, and they are checkable — which is why they build more trust than adjectives.

GIT
   git add content/case-studies data/practice-content.ts
   git commit -m "phase-13(B): five case study templates and practice narrative"

CONSTRAINTS
- Every case study: status 'template', consentObtained false. Non-negotiable.
- No invented client names, no invented figures presented as real outcomes.

REPORT WHEN DONE
Confirm all five case studies carry status:'template' and consentObtained:false.
```

### ▶ PROMPT 13-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly two files.

FILE 1 — `data/testimonials.ts`
Export a const `TESTIMONIALS` as an EMPTY array typed as
  { id: string; quote: string; name: string; role: string; serviceSlug: string;
    consentObtained: boolean; datePublished: string }[]
Above it, add this comment verbatim:
  // EMPTY BY DESIGN. Do not add testimonials here.
  // Every entry requires: (1) the client's written consent to publish, and
  // (2) confirmation that publishing testimonials is permitted under the
  // advertising rules applicable to this practice — see BRAND-FACTS.md.
  // Components render nothing while this array is empty. That is correct behaviour.
Then export `const TESTIMONIALS_ENABLED = false;`

FILE 2 — `data/credentials.ts`
Export a const `CREDENTIALS` array. Each entry:
  { id: string; body: string; abbreviation: string; registrationNo: string | null;
    logoAsset: string | null; verified: boolean }
Create exactly these five entries, all with registrationNo: null, logoAsset: null,
verified: false:
  - Institute of Chartered Accountants of India (ICAI)
  - Goods and Services Tax Network (GSTN)
  - Ministry of Micro, Small and Medium Enterprises (MSME / Udyam)
  - Directorate General of Foreign Trade (DGFT)
  - Income Tax Department e-Return Intermediary
Add this comment at the top verbatim:
  // A credential renders ONLY when verified is true AND registrationNo is present.
  // Displaying an accreditation logo the practice is not entitled to display is a
  // legal exposure, not a design decision.

Also export `const ADVERTISING_MODE: 'conservative' | 'standard' = 'conservative';`
with a comment saying to change this only after the guardrail checkbox in BRAND-FACTS.md
has been ticked by a human.

GIT
   git add data/testimonials.ts data/credentials.ts
   git commit -m "phase-13(C): empty testimonial store and unverified credential registry"

CONSTRAINTS
- TESTIMONIALS is an empty array. Do not write a single example testimonial, not even a
  placeholder one. A placeholder testimonial that reaches production is a fabricated
  endorsement.
- All credentials verified:false, registrationNo:null.
- ADVERTISING_MODE defaults to 'conservative'.

REPORT WHEN DONE
Confirm TESTIMONIALS.length === 0 and print ADVERTISING_MODE.
```

### ✅ Phase 13 gate check

```bash
npm run build && grep -c "consentObtained: false" content/case-studies/*.mdx
```

Load the homepage. There must be **no empty testimonial section, no "coming soon", no
placeholder faces.** Absence should be invisible.

---

# ══════════════════════════════════════════
# PHASE 14 — INSIGHTS ENGINE (MDX + ISR)
# ══════════════════════════════════════════

**Goal:** the publishing system, plus twelve launch articles.

**Done when:** `/insights` lists posts, each renders with schema, and ISR revalidates.

### ▶ PROMPT 14-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the MDX pipeline. Work in ./lib/mdx.ts,
./app/insights, ./components/mdx.

TASK

1. `lib/mdx.ts` — the content pipeline:
   - Reads MDX from content/blog, content/guides, content/glossary
   - Parses frontmatter with gray-matter, validated by a Zod schema (a post missing a
     required field fails the build loudly rather than shipping broken metadata)
   - Computes reading time
   - Extracts headings into a TOC structure
   - Provides getAllPosts, getPostBySlug, getPostsByTag, getRelatedPosts (by shared tags,
     falling back to same-category), getAdjacentPosts

2. `components/mdx/index.tsx` — the MDX component map. Every heading gets an auto-generated
   id and an anchor link. Override img to next/image with required dimensions. Override a
   to next/link for internal hrefs with prefetch, and add rel="noopener" + an external
   indicator for outbound. Add custom components usable inside MDX: <Callout>, <StatBox>,
   <ComparisonTable>, <StatuteRef>, <Verify> (renders a visible warning in dev, nothing in prod).

3. `app/insights/page.tsx` — the index. Filterable by tag, paginated at 12 per page with
   real /insights/page/2 URLs (never infinite scroll — an infinite-scroll archive is
   partially invisible to crawlers, which is a self-inflicted indexing problem).

4. `app/insights/[slug]/page.tsx` — the article template:
   - generateStaticParams for all posts
   - `export const revalidate = 3600` — the ISR requirement from instrtion.md
   - generateMetadata with article OpenGraph, published/modified times, and author
   - Reading progress bar (instrtion.md requirement), transform-only, reduced-motion safe
   - Sticky TOC on desktop
   - Author byline linking to the principal page
   - "Last reviewed on <date> by <name>" — for tax content this is a genuine ranking and
     trust factor, because readers and search engines both need to know whether the
     information predates the last rate change
   - Related posts, previous/next, share links, and a contextual CTA matched to the post's
     service tag

5. `app/insights/tag/[tag]/page.tsx` — tag archives, statically generated.

6. `app/insights/feed.xml/route.ts` — an RSS feed. Cheap to build, and it is how aggregators
   and some AI crawlers discover new content.

GIT
   git add lib/mdx.ts components/mdx app/insights
   git commit -m "phase-14(A): MDX pipeline, insights index, article template with ISR"

CONSTRAINTS
- revalidate = 3600 on the article route.
- Paginated archives with real URLs. No infinite scroll.
- A post with invalid frontmatter must fail the build. Test it by breaking one deliberately,
  confirming the failure, then fixing it.

REPORT WHEN DONE
Confirm the deliberate-failure test worked, and paste the insights routes from the build output.
```

### ▶ PROMPT 14-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the twelve launch articles. Work in ./content/blog/*.mdx.

TARGETING PRINCIPLE
Do not write "top 10 tips" content — it ranks nowhere and gets cited by nobody. Every article
targets one specific question a person types when they have a real problem, and answers it
completely in the first 60 words. The rest of the article exists to satisfy the reader who
needs more, and to give search engines something substantial to index.

TASK — write these twelve, each 1400-2200 words:

  1. What happens after you receive a GST notice — and the first three things to do
  2. GST registration rejected? The eight reasons applications actually get refused
  3. Section 148 reassessment notice: what it means and how long you have
  4. Partnership firm vs LLP vs Private Limited: which one fits your situation
  5. Trust registration and 12A/80G: the sequence that avoids a re-application
  6. TDS defaults: how interest, late fee and penalty stack up
  7. Input Tax Credit reversal under Rule 42/43, explained without the jargon
  8. Getting an IEC and LUT: the first-time exporter's actual sequence
  9. GSTR-9 and 9C: who has to file, and the reconciliations that catch people out
 10. Filing an appeal before the CIT(A): timelines, fees and what to prepare
 11. Form 26AS vs AIS vs your books: reconciling the three before you file
 12. The compliance calendar every business with a GSTIN should have on the wall

STRUCTURE for every article:
  - Frontmatter: title, slug, description, publishedAt, updatedAt, author, reviewedBy,
    tags, serviceSlug, readingTime, featured
  - H1 matching the title
  - The direct answer in the first 60 words, before any preamble ← non-negotiable
  - Body with descriptive H2s phrased as the questions they answer
  - At least one table or structured list (extractable data ranks and gets quoted)
  - A "what to do next" section that links to the relevant service page
  - 4-6 FAQs
  - "Last reviewed" date

RULES
  - Every statutory reference, rate, threshold, deadline and penalty gets <Verify /> around it
  - Define jargon inline on first use
  - Internal-link every article to at least 2 service pages and 2 other articles, per the
    hub-and-spoke map in CONTENT-STRATEGY.md
  - Short paragraphs. This is read on a phone by someone who is worried.

GIT
   git add content/blog
   git commit -m "phase-14(B): twelve launch articles"

REPORT WHEN DONE
Print a table: title, word count, internal link count, Verify marker count.
```

### ▶ PROMPT 14-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly two files.

FILE 1 — `data/authors.ts`
Export a const `AUTHORS` — a Record<string, Author> where Author is
  { id, name, role, credentials, bio, avatar, linkedin, url }
Create exactly one entry with id 'principal'. Every field's value is the string 'TBD'
except: id ('principal'), avatar (null), and url ('/practice/principal').
Add this comment at the top verbatim:
  // Populated from BRAND-FACTS.md section 2. Author identity is an E-E-A-T signal for
  // financial content — an article attributed to 'TBD' should not be published.
Export a helper `isAuthorComplete(id: string): boolean` returning false if any field is 'TBD'.

FILE 2 — `data/tags.ts`
Export a const `TAGS` array. Each entry:
  { slug, label, description, relatedServiceSlug: string | null }
Create exactly these 14 tags, with a one-sentence description each and the related service
slug where one applies:
  gst, gst-registration, gst-returns, gst-notices, income-tax, itr-filing, tds,
  tax-notices, appeals, entity-formation, trusts-societies, import-export,
  compliance-calendar, pan-tan

Map relatedServiceSlug using the eight slugs in services.ts. Set it to null for tags with no
direct service match (compliance-calendar).

Export a helper `getTag(slug: string)` and a type `TagSlug = typeof TAGS[number]['slug']`.

GIT
   git add data/authors.ts data/tags.ts
   git commit -m "phase-14(C): author registry and tag taxonomy"

CONSTRAINTS
- Exactly one author, all fields 'TBD'. Do not invent a name or a biography.
- Exactly 14 tags with the exact slugs listed.
- One file each, two files total.

REPORT WHEN DONE
Print both files and confirm isAuthorComplete('principal') returns false.
```

### ✅ Phase 14 gate check

```bash
npm run build && curl -s http://localhost:3000/insights/feed.xml | head -20
```

---

# ══════════════════════════════
# PHASE 15 — KNOWLEDGE BASE
# ══════════════════════════════

**Goal:** the glossary, the evergreen guides, and the gated lead magnets.

> **📦 Assets used here** — the four `cover-*.jpg` guide covers from Phase 4, group H:
> `cover-entity-formation`, `cover-gst-compliance`, `cover-tax-notices`, `cover-exporter`.
> The lead-magnet PDFs are generated from real content in this phase, not by an image tool.

**Why the glossary earns its keep:** an A–Z of compliance terms captures hundreds of
zero-competition "what is X" searches, and every entry is a natural internal link into a
service page. It is the cheapest ranking surface on the site.

### ▶ PROMPT 15-A — Agent A (Architect)

```text
You are Agent A (Architect). You build the knowledge-base infrastructure. Work in
./app/glossary, ./app/guides, ./components/content, ./app/api/download.

TASK

1. `app/glossary/page.tsx` — the A–Z index. A sticky alphabet jump bar, entries grouped by
   letter, and a client-side instant filter input. Every entry is present in the server-
   rendered HTML — the filter hides, it never fetches. All terms must be crawlable.

2. `app/glossary/[term]/page.tsx` — an individual page per term, statically generated.
   Each: the term, its full form, a 40-word definition, where it appears in practice, related
   terms, and a link to the relevant service. These pages are small but they rank, and each
   one is a legitimate internal link into a commercial page.

3. `app/guides/page.tsx` + `app/guides/[slug]/page.tsx` — long-form evergreen guides. Same
   MDX pipeline as insights but a different template: a sticky TOC, chapter navigation, an
   estimated read time, and a download-as-PDF option at the end.

4. `components/content/LeadMagnet.tsx` + `app/api/download/route.ts` — the gated download
   instrtion.md calls for. Behaviour:
   - The page's actual content is NEVER gated. Only the formatted PDF is.
   - Email + consent required, validated by Zod on both sides.
   - The API emails the file link rather than returning the file directly, which confirms
     the address is real and gives you a deliverable lead rather than a bounced one.
   - Rate limited per IP, honeypot field, and the same anti-abuse handling as Phase 12.
   - Fires a GA4 event on success.
   Gating the readable content behind a form would cost you the ranking that produced the
   visitor in the first place. Gate the artefact, never the answer.

5. `app/compliance-calendar/page.tsx` — a public, indexable calendar rendered from
   data/compliance-calendar.ts. Shows only verified entries. Includes a downloadable .ics
   file generated at build time so a visitor can subscribe to the deadlines. An .ics
   subscription is a recurring reminder of the practice, once a month, forever.

GIT
   git add app/glossary app/guides app/compliance-calendar components/content/LeadMagnet.tsx app/api/download
   git commit -m "phase-15(A): glossary, guides, lead magnets, compliance calendar"

CONSTRAINTS
- No readable content is ever behind the email gate.
- Every glossary term is in the server-rendered HTML of the index page.
- The calendar renders only verified:true entries and shows an honest empty state otherwise.

REPORT WHEN DONE
Confirm the glossary index count in the raw HTML matches the data file count.
```

### ▶ PROMPT 15-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the knowledge base. Work in ./content/guides/*.mdx and
./content/glossary/*.mdx.

TASK

1. Write 4 evergreen guides, 3000-5000 words each, in `content/guides/`:
   - The complete guide to registering a business entity in India (partnership, JV, society,
     trust — the whole decision tree, then each path in full)
   - The complete GST compliance guide for a growing business (registration through annual
     return, including what changes as turnover crosses each threshold)
   - The complete guide to responding to income tax notices (every common notice type, what
     it means, the deadline, and the response)
   - The first-time exporter's compliance guide (IEC, LUT, RCMC, refunds, documentation)

   Each guide: a chapter structure with H2 chapters and H3 sections, a summary box at the
   top, at least three tables, a decision flowchart described in text (Agent A's
   <ComparisonTable> and <Callout> components are available), and a chapter-end action list.
   These are the assets other sites link to. Depth is the point — do not compress.

2. Write 60 glossary entries in `content/glossary/`, one MDX file each. Cover every term a
   confused business owner will hit: ARN, ITC, RCM, LUT, IEC, TAN, TDS, TCS, GSTIN, HSN, SAC,
   CIT(A), ITAT, DRC-01, SCN, e-Way Bill, e-Invoice, Composition Scheme, Nil Return,
   Place of Supply, Reverse Charge, Zero-Rated Supply, Exempt Supply, Assessment Year,
   Previous Year, Advance Tax, Self-Assessment Tax, Form 26AS, AIS, TIS, 12A, 80G, FCRA,
   Section 8 Company, and the rest.

   Each entry: full form on first line, a 40-word plain-language definition, one worked
   example, when it matters in practice, related terms, and the related service link.
   The 40-word definition is written to be quoted verbatim by an AI search engine — complete,
   standalone, and correct without the surrounding page.

3. Write the lead magnet copy: 3 downloadable PDFs — a GST compliance checklist, a document
   checklist pack for all eight services, and an annual compliance calendar. Write the
   content; Agent C assembles the source files.

GIT
   git add content/guides content/glossary
   git commit -m "phase-15(B): four evergreen guides and sixty glossary entries"

CONSTRAINTS
- 60 glossary entries. Count them.
- Every definition standalone in 40 words or fewer.
- VERIFY markers on every rate, threshold, deadline and penalty.

REPORT WHEN DONE
Print the guide word counts and the glossary entry count.
```

### ▶ PROMPT 15-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data and ./public/docs.

TASK — create exactly two files.

FILE 1 — `data/glossary-index.ts`
Export a const `GLOSSARY_INDEX` — an array of { term, fullForm, slug, letter, relatedServiceSlug }.
Read the filenames in content/glossary/ if they exist and build one entry per file. If that
folder is empty (Agent B is writing it right now), create entries for exactly these 60 terms,
deriving `slug` by lowercasing and hyphenating, and `letter` as the uppercase first character:

  ARN, AIS, Advance Tax, Assessment Year, Assessing Officer, Bill of Entry, CIT(A), CGST,
  Composition Scheme, Cess, DRC-01, DRC-03, DSC, e-Invoice, e-Way Bill, Exempt Supply,
  FCRA, Form 16, Form 16A, Form 26AS, Form 26Q, Form 3CD, GSTIN, GSTR-1, GSTR-2B, GSTR-3B,
  GSTR-9, GSTR-9C, HSN, IEC, IGST, ITAT, ITC, ITR, LUT, Nil Return, PAN, Place of Supply,
  Previous Year, RCM, RCMC, REG-01, REG-06, Reverse Charge, SAC, SCN, Section 8 Company,
  Section 12A, Section 80G, Self-Assessment Tax, SGST, TAN, TCS, TDS, TIS, Tax Audit,
  Turnover Threshold, UDIN, Udyam, Zero-Rated Supply

Set `relatedServiceSlug` by mapping each term to the most relevant of the eight service slugs
from services.ts, or null if none fits. Do not force a match.

Export helpers: `getByLetter(letter: string)` and `getAvailableLetters(): string[]`.

FILE 2 — `public/docs/README.md`
A checklist table for the three lead-magnet PDFs: filename, title, source content location,
generated (unchecked), reviewed by a human (unchecked). Use these exact filenames:
  gst-compliance-checklist.pdf
  document-checklist-pack.pdf
  annual-compliance-calendar.pdf
Add a line at the top: "These PDFs go out to real prospects with the practice's name on
them. Nothing here is published until a human has reviewed every figure inside it."

GIT
   git add data/glossary-index.ts public/docs/README.md
   git commit -m "phase-15(C): glossary index and lead-magnet manifest"

CONSTRAINTS
- Exactly 60 glossary terms.
- Do not force a relatedServiceSlug match. null is a valid, correct answer.
- Two files only.

REPORT WHEN DONE
Print the entry count, the letters covered, and how many entries have a null service.
```

### ✅ Phase 15 gate check

```bash
npm run build && curl -s http://localhost:3000/glossary | grep -c 'href="/glossary/'
```

---

# ═══════════════════════════════════
# PHASE 16 — GEO / LLM READINESS
# ═══════════════════════════════════

**Goal:** implement Section II of `instrtion.md` in full. This is the phase most competitors
have not done at all, and it is the one most likely to produce the leads you are after.

**The bet, stated plainly:** a large and growing share of "how do I register for GST" queries
now get answered inside ChatGPT, Perplexity, Gemini and Google's AI Overviews rather than on
a results page. Those systems need clean, unambiguous, self-contained text to quote and
attribute. Almost no Indian tax practice is serving that. A site that is trivially easy for
a model to read and cite gets named in the answer — and being *the cited source* converts far
better than being the fourth blue link.

### ▶ PROMPT 16-A — Agent A (Architect)

```text
You are Agent A (Architect). You implement content negotiation and the AI-facing endpoints.
Work in ./middleware.ts, ./lib/markdown-export.ts, ./app/api/md.

TASK

1. `lib/markdown-export.ts` — converts any page's content into clean Markdown:
   - Title as H1, then the direct answer, then the body with correct heading hierarchy
   - Tables as Markdown tables, lists as Markdown lists
   - NO navigation, NO footer, NO CTA blocks, NO cookie banner, NO decorative elements
   - A short YAML frontmatter block with title, url, updated, and author
   - Absolute URLs on every link, so a model that ingests the file can resolve references
   This is instrtion.md's "HTML noise reduction" and "token efficiency" requirement made
   concrete: every navigation element in an AI-facing response is context window spent on
   something the model cannot use.

2. `app/[...slug]/route.ts` (or an equivalent) exposing a `.md` variant of every content
   page: /services/gst-registration.md returns the Markdown version. Statically generated
   at build time, cached at the edge.

3. `middleware.ts` — content negotiation, per instrtion.md:
   - Detect AI agent user-agents (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot,
     Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended,
     Applebot-Extended, CCBot, Bytespider, meta-externalagent) and requests sending
     `Accept: text/markdown` or `Accept: text/plain`.
   - Serve the Markdown representation to those requests, and the full page to everyone else.
   - Set `Vary: Accept, User-Agent` so caches do not serve the wrong representation.
   - Bypass any cookie/consent modal for bot user agents, per instrtion.md.
   IMPORTANT: this must be identical content in a different format. Serving materially
   different content to crawlers than to users is cloaking and it is a manual-action risk.
   Format negotiation is legitimate; content substitution is not. Add that as a comment.

4. Add `X-Robots-Tag` handling and confirm the middleware adds no measurable latency —
   keep it to header inspection and a rewrite, with no data fetching.

5. Route-level caching: the .md endpoints get
   `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.

GIT
   git add middleware.ts lib/markdown-export.ts app/api/md
   git commit -m "phase-16(A): markdown export, AI content negotiation middleware"

CONSTRAINTS
- Same content, different format. Never different content.
- Middleware must not fetch data. Header inspection and rewrite only.
- Test with: curl -H "User-Agent: GPTBot" and curl -H "Accept: text/markdown"

REPORT WHEN DONE
Paste the output of both curl tests against /services/gst-registration.
```

### ▶ PROMPT 16-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You author the AI-facing corpus. Work in ./app/llms.txt,
./app/llms-full.txt, and ./data/citable-facts.ts.

TASK

1. `app/llms.txt/route.ts` — generate the llms.txt file at the domain root, per instrtion.md.
   Structure it exactly like this:

   # <Practice trading name>
   
   > <A 3-4 sentence blockquote establishing what this practice is, where it operates, who
   > it serves, and what it is authorised to do. This is the "system prompt grounding"
   > requirement — it is the first thing a model reads, and it sets the frame for every
   > answer it gives about this business. Write it as neutral, factual, third-person
   > description. No marketing language: a model will discount promotional text, and a user
   > reading an AI answer will discount it too.>
   
   ## Services
   - [GST Registration](https://domain/services/gst-registration.md): one factual sentence
   ... all eight, each pointing at the .md variant
   
   ## Tools
   ## Guides
   ## Glossary
   ## About
   ## Contact
   
   Every link points to the .md variant, not the HTML page.
   Keep the whole file under 4 KB. instrtion.md is right that context window size matters:
   a bloated index gets truncated and the truncated half is invisible.

2. `app/llms-full.txt/route.ts` — the full-text bundle. Concatenates the direct answers, all
   FAQs, all glossary definitions, the service summaries, and the practice's factual details
   into one plain-text file. Target under 200 KB. Order it most-important-first, because a
   model with a budget reads the top.

3. `data/citable-facts.ts` — 40 self-contained, quotable factual statements about this
   practice and about the compliance landscape it operates in, each with a `verified` flag
   and a `sourceUrl`. These are the sentences you want lifted verbatim into an AI answer.
   Format rule: each is one sentence, contains its own subject, and needs no context.
   Good: "GST registration applications are filed in Form REG-01 and the registration
   certificate is issued in Form REG-06."
   Bad:  "It usually takes about a week."
   All start at verified:false.

4. Update every service and guide page's `<head>` with `<link rel="alternate"
   type="text/markdown" href="...md">` so the Markdown variant is discoverable.

5. Add a section to CONTENT-STRATEGY.md: "How to check whether this is working" — the
   specific prompts to run monthly in ChatGPT, Perplexity and Google AI Mode to see whether
   the practice is being cited, and what to change if it is not.

GIT
   git add app/llms.txt app/llms-full.txt data/citable-facts.ts CONTENT-STRATEGY.md
   git commit -m "phase-16(B): llms.txt, full-text bundle, citable facts corpus"

CONSTRAINTS
- llms.txt under 4 KB. Print the byte count.
- No marketing language anywhere in llms.txt. Neutral factual register only.
- Every citable fact starts verified:false.

REPORT WHEN DONE
Print llms.txt in full with its byte count, and five example citable facts.
```

### ▶ PROMPT 16-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./public and ./data.

TASK — create exactly two files.

FILE 1 — `public/robots.txt` — NOTE: only create this as a static reference copy at
`data/robots-reference.txt`. Do NOT create public/robots.txt; Next.js generates it from
app/robots.ts in Phase 17 and a static file would silently override it.

So: create `data/robots-reference.txt` containing the intended directives, which Phase 17
will implement in code:

  Allow, with no crawl delay:
    Googlebot, Googlebot-Image, Bingbot, DuckDuckBot, Slurp, Applebot,
    GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot,
    PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended,
    Amazonbot, meta-externalagent, cohere-ai, Bytespider, CCBot, Diffbot, Timpibot
  Disallow for all agents:
    /api/, /styleguide, /styleguide/motion, /contact/thank-you, /_next/static/chunks/
  Sitemap: <NEXT_PUBLIC_SITE_URL>/sitemap.xml

Add a comment block above explaining, in two sentences, that AI crawlers are explicitly
allowed here as a deliberate decision — blocking them removes the practice from AI-generated
answers entirely, which is the opposite of this project's strategy.

FILE 2 — `data/ai-crawlers.ts`
Export a const `AI_CRAWLER_UAS` — a readonly string array of the user-agent tokens the
Phase 16 middleware matches against. Exactly these 14, lowercase:
  'gptbot', 'chatgpt-user', 'oai-searchbot', 'claudebot', 'claude-user',
  'claude-searchbot', 'perplexitybot', 'perplexity-user', 'google-extended',
  'applebot-extended', 'ccbot', 'bytespider', 'meta-externalagent', 'cohere-ai'

Export a function `isAICrawler(userAgent: string | null): boolean` that lowercases the input,
returns false for null or empty, and checks whether it includes any token in the list.

Export a second const `SEARCH_CRAWLER_UAS` with: 'googlebot', 'bingbot', 'duckduckbot',
'slurp', 'applebot', 'yandexbot', 'baiduspider'
and a matching `isSearchCrawler()` function.

GIT
   git add data/robots-reference.txt data/ai-crawlers.ts
   git commit -m "phase-16(C): crawler allowlists and detection helpers"

CONSTRAINTS
- Do NOT create public/robots.txt. It would override the generated one silently.
- Exactly 14 AI crawler tokens, all lowercase.
- Two files only.

REPORT WHEN DONE
Print ai-crawlers.ts and confirm public/robots.txt was NOT created.
```

### ✅ Phase 16 gate check

```bash
npm run build && curl -s http://localhost:3000/llms.txt && curl -s -H "User-Agent: GPTBot" http://localhost:3000/services/gst-registration | head -30
```

The second command must return Markdown, not HTML.

---

# ══════════════════════════════════════════
# PHASE 17 — TECHNICAL SEO & STRUCTURED DATA
# ══════════════════════════════════════════

**Goal:** implement Section III of `instrtion.md` completely.

### ▶ PROMPT 17-A — Agent A (Architect)

```text
You are Agent A (Architect). You own the metadata infrastructure and redirects. Work in
./lib/seo.ts, ./app/sitemap.ts, ./app/robots.ts, ./next.config.ts,
./app/not-found.tsx.

TASK

1. `lib/seo.ts` — the single metadata factory every page uses:
   - `buildMetadata({ title, description, path, image, type, publishedTime, modifiedTime,
     noIndex })` returning a complete Next.js Metadata object
   - Enforces the limits in code: throws at build time if title exceeds 60 characters or
     description exceeds 155. A build-time failure is the only enforcement that survives
     contact with a deadline — a linting warning gets ignored.
   - Always sets canonical from `path` + NEXT_PUBLIC_SITE_URL
   - Sets `alternates.languages` with `en-IN` per instrtion.md's hreflang requirement
   - Sets robots: max-snippet -1, max-image-preview large, max-video-preview -1

2. `app/sitemap.ts` — dynamic sitemap per instrtion.md. Includes every static page, all
   eight services, all tools, all insights, all guides, all glossary terms, all tags, all
   city pages. `lastModified` comes from the actual content file's frontmatter `updatedAt`,
   never from `new Date()` — a sitemap that claims every page changed today is noise, and
   crawlers learn to ignore it. Set changeFrequency and priority meaningfully: services and
   tools highest, glossary lowest.

3. `app/robots.ts` — generate from data/robots-reference.txt's rules. Reference the sitemap.

4. `app/not-found.tsx` — the custom 404 instrtion.md requires. It must route the lost visitor
   back into the funnel: a search input, the eight service links, the five tools, and the
   contact CTA. Never a dead end.

5. `next.config.ts` redirects() — the 301 map. Read data/redirects.ts (Agent C's file this
   phase) and emit permanent redirects. Add a comment explaining that these are permanent
   (308/301) and must never be changed once live, because inbound links depend on them.

6. `app/opengraph-image.tsx` and per-route OG images using next/og, rendering real text over
   the paper/ledger background, at 1200×630 with the edge runtime.

GIT
   git add lib/seo.ts app/sitemap.ts app/robots.ts app/not-found.tsx next.config.ts app/opengraph-image.tsx
   git commit -m "phase-17(A): metadata factory, sitemap, robots, 404, redirects, OG images"

CONSTRAINTS
- buildMetadata must THROW on an over-length title or description. Test it.
- lastModified from content frontmatter, never new Date().
- Every page in the app must go through buildMetadata. Grep for any remaining raw
  `export const metadata` and convert it.

REPORT WHEN DONE
Paste the sitemap URL count and confirm the over-length title test throws.
```

### ▶ PROMPT 17-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You own all structured data. Work in ./components/seo.

instrtion.md is explicit and correct on this: use standard Schema.org only. There is no
separate "AEO schema" standard — anything sold as one is not real. Everything below is
server-rendered JSON-LD, generated at render time from real data, never hand-written into a
template.

TASK — build one emitter component per schema type, each taking typed props and rendering a
<script type="application/ld+json"> with sanitised JSON:

1. `WebSiteSchema` — on the root layout. name, url, publisher, inLanguage en-IN,
   and potentialAction SearchAction if a site search exists.

2. `OrganizationSchema` / `AccountingServiceSchema` — the practice. Include legalName, url,
   logo, telephone, email, address (PostalAddress), areaServed, founder, foundingDate,
   knowsAbout (the eight service areas plus the statutes), and identifier fields for GSTIN
   where present. Every field omitted when the underlying brand.ts value is TBD — an
   incomplete schema is fine; a schema with the string "TBD" in it is actively harmful.

3. `LocalBusinessSchema` — geo coordinates, openingHoursSpecification, priceRange, address,
   telephone, hasMap. Renders NOTHING if lat/lng are null, because a LocalBusiness without
   a location fails validation and can suppress the whole block.

4. `ServiceSchema` — on each of the eight service pages. serviceType, provider, areaServed,
   offers with priceCurrency INR (omit price when unknown — never emit price 0), and
   hasOfferCatalog listing what is included.

5. `FAQPageSchema` — on pages with FAQ blocks. Emits ONLY FAQs where verified === true.
   Marking up an unverified answer is publishing it with a search engine's endorsement.

6. `BlogPostingSchema` / `ArticleSchema` — headline, description, image, datePublished,
   dateModified, author (Person with credentials and url), publisher, mainEntityOfPage,
   wordCount, articleSection, keywords.

7. `PersonSchema` — the principal. name, jobTitle, worksFor, alumniOf, hasCredential
   (EducationalOccupationalCredential with the issuing body and membership number),
   knowsAbout, sameAs. This is the E-E-A-T anchor for the whole domain.

8. `BreadcrumbListSchema` — generated from the Breadcrumbs component's trail, so the visible
   breadcrumb and the markup can never disagree.

9. `HowToSchema` — on the process timeline of each service page. step, totalTime, supply
   (the documents), and tool. Genuinely applicable here and frequently surfaced in results.

10. `WebPageSchema` with `speakable` on the AnswerBlock selector.

Then: wire every emitter into its page, and validate the output.

GIT
   git add components/seo
   git commit -m "phase-17(B): complete Schema.org structured data layer"

CONSTRAINTS
- Every value comes from data at render time. No hardcoded JSON-LD in any page.
- Never emit a field whose source value is TBD, null, or unverified.
- Never emit price: 0.
- Validate every page type at https://validator.schema.org and Google's Rich Results Test.

REPORT WHEN DONE
List each schema type, which routes it appears on, and paste the validator result for one
service page and one article.
```

### ▶ PROMPT 17-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data.

TASK — create exactly two files.

FILE 1 — `data/redirects.ts`
Export a const `REDIRECTS` — an array of { source: string; destination: string; permanent: true }.
Read ./BRAND-FACTS.md section 7 for an existing website URL. If it says 'TBD', export an
EMPTY array with this comment above it verbatim:
  // EMPTY until the old site's URL list is supplied (BRAND-FACTS.md section 7).
  // Every URL on the old site that had inbound links or ranked for anything must
  // 301 here, or that accumulated authority is thrown away at launch.
  // Get the list from Google Search Console > Pages, or from the old sitemap.xml.

Then, regardless, add these 12 defensive redirects for common URL patterns people and old
links guess at, all permanent:
  /gst              → /services/gst-registration
  /gst-registration → /services/gst-registration
  /pan              → /services/pan-card-services
  /itr              → /services/income-tax-tds-returns
  /tds              → /services/income-tax-tds-returns
  /appeals          → /services/income-tax-appeals
  /iec              → /services/import-export-licence
  /import-export    → /services/import-export-licence
  /about            → /practice
  /about-us         → /practice
  /blog             → /insights
  /contact-us       → /contact

FILE 2 — `data/keyword-map.ts`
Export a const `KEYWORD_MAP` — an array of
  { keyword: string; intent: 'informational'|'commercial'|'transactional'|'navigational';
    targetPath: string; priority: 1|2|3 }
Create one entry per row below. This is the canonical keyword-to-URL assignment, and its
purpose is to prevent two pages ever targeting the same keyword — when they do, they compete
with each other and both rank worse than one would have.

Build entries for, at minimum:
  - The 8 primary service keywords → their service pages (transactional, priority 1)
  - The 32 secondary keywords from services.ts → the same service pages (commercial, 2)
  - The 5 tool keywords → tool pages (transactional, 1)
  - The 12 article titles from content/blog → their post URLs (informational, 2)
  - The 14 tags → tag archives (informational, 3)
  - 20 "what is X" queries → glossary pages (informational, 3)

Export a function `findDuplicateTargets(): string[]` that returns any keyword appearing more
than once with different targetPaths. Run it and report the result — it must be empty.

GIT
   git add data/redirects.ts data/keyword-map.ts
   git commit -m "phase-17(C): redirect map and canonical keyword assignments"

CONSTRAINTS
- All redirects permanent: true.
- Every keyword maps to exactly ONE targetPath. Run findDuplicateTargets() and fix any hits.
- Two files only.

REPORT WHEN DONE
Print the total keyword count and the output of findDuplicateTargets() (must be empty).
```

### ✅ Phase 17 gate check

```bash
npm run build && curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"
```

Then paste a service page URL into Google's Rich Results Test. Zero errors required.

---

# ═══════════════════════════════════
# PHASE 18 — LOCAL & MULTI-CITY SEO
# ═══════════════════════════════════

> **📦 The map image is NOT generated.** `LocationMap` needs a static map of the real office
> location — take it from the Google Static Maps API or a screenshot of the real map. An
> AI-generated "map" is geographically fictional, and it sits on the one page where a local
> visitor is checking whether this practice is actually near them.

> **Read this before running the phase.** Programmatic city pages are the fastest way to
> either double your leads or get the site filtered out of search entirely. The difference
> is whether each page contains genuinely different information. Eight services × twenty
> cities with the city name swapped in is doorway-page spam and Google has a specific policy
> against it. **Only generate a city page where the practice can actually take the work and
> where you can write something true and specific about that jurisdiction.** Three excellent
> city pages beat sixty templated ones — and cost less to maintain.

### ▶ PROMPT 18-A — Agent A (Architect)

```text
You are Agent A (Architect). You build the local infrastructure. Work in
./app/[city], ./components/sections/LocationMap.tsx, ./lib/local.ts.

TASK

1. `lib/local.ts` — helpers reading data/cities.ts: getCity, getAllCities,
   getServicesForCity, and `hasUniqueContent(city, service): boolean` which returns false
   unless that combination has at least 300 words of city-specific content in the data.

2. `app/[city]/page.tsx` — the city landing page. `generateStaticParams` returns ONLY cities
   where `city.active === true`. A city with active:false does not get a route at all.

3. `app/[city]/[service]/page.tsx` — city × service pages, with a hard gate:
   generateStaticParams returns a combination ONLY if `hasUniqueContent()` is true.
   Add a build-time console warning listing every combination that was skipped and why.
   This gate is the whole point: it makes it structurally impossible to ship a thin,
   templated page even if someone later adds cities in a hurry.

4. `components/sections/LocationMap.tsx` — the custom-styled map instrtion.md requires.
   Requirements: it must NOT load a third-party map script on page load. Render a static
   styled map image with the office marked, and load the interactive embed only after the
   user clicks it. A Google Maps iframe on page load costs roughly 1 MB and several hundred
   milliseconds of main-thread time, on the exact page where a local visitor is deciding
   whether to call.
   Include the address, directions link, and office hours from brand.ts as real text beside
   it — a map image is invisible to a crawler, the text is not.

5. `app/[city]/opengraph-image.tsx` — per-city OG images.

GIT
   git add app/[city] components/sections/LocationMap.tsx lib/local.ts
   git commit -m "phase-18(A): city routes with thin-content gate, deferred map"

CONSTRAINTS
- No city × service route generates without 300+ words of unique content. The gate is
  non-negotiable and must fail closed.
- No third-party map script before user interaction.

REPORT WHEN DONE
Paste the build output listing generated city routes and skipped combinations.
```

### ▶ PROMPT 18-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. You write the local content. Work in ./content/cities/*.mdx.

FIRST: read BRAND-FACTS.md section 4. Write pages ONLY for cities listed there. If it says
TBD, write ONE page for the primary city as a template, clearly marked `draft: true`, and
stop. Do not invent a service area.

TASK — for each active city, write 800-1200 words of genuinely city-specific content:

  - The GST jurisdiction and Commissionerate covering that city, and which zone
  - The Income Tax ward/circle structure for that area
  - Any state-specific requirement that differs from the national baseline (professional
    tax, shops and establishments registration, state-specific stamp duty on deeds)
  - The dominant business types in that city and the compliance issues each hits
    (a textile hub, a port city, and an IT corridor genuinely have different problems)
  - Whether the practice serves it from a physical office or remotely, stated plainly
  - Local landmarks or areas for the address context

  What makes this rank is that a competitor cannot generate it. Anyone can write
  "GST registration in <city>". Almost nobody writes which Commissionerate handles the
  application and what that means for the timeline.

  If you cannot write 800 words of genuinely city-specific content for a city, say so and
  do not write the page. A missing page costs nothing. A thin page costs sitewide quality
  signal.

Each file's frontmatter: city, slug, state, active, services (which of the eight are offered
there), draft. Set `active: false` and `draft: true` on every file — a human turns them on
after confirming the practice can service that city.

GIT
   git add content/cities
   git commit -m "phase-18(B): city-specific compliance content"

CONSTRAINTS
- 800+ words of city-SPECIFIC content, or no page at all.
- Every jurisdiction claim gets a VERIFY marker.
- active:false and draft:true on every file.

REPORT WHEN DONE
List each city written, its word count, and its "unique content" justification in one line.
```

### ▶ PROMPT 18-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical file creation. Follow the specification exactly.

CONTEXT
Work only in ./data. Read ./BRAND-FACTS.md section 4 for the service area.

TASK — create exactly one file: `data/cities.ts`

Export a const `CITIES` — an array of:
  { slug, name, state, stateCode, lat: number|null, lng: number|null,
    gstJurisdiction: string|null, itWard: string|null, servicesOffered: string[],
    hasPhysicalOffice: boolean, active: boolean, uniqueContentWords: number }

Read BRAND-FACTS.md section 4. Create one entry per city listed there.
If section 4 says 'TBD', create exactly ONE entry with slug 'primary-city', name 'TBD',
and every other field null / empty / false / 0.

For EVERY entry regardless: set `active: false`, `uniqueContentWords: 0`, and leave
gstJurisdiction and itWard as null.

Add this comment at the top verbatim:
  // active:false means no route is generated for this city. That is the safe default.
  // A city becomes active only when: (1) the practice can genuinely service it,
  // (2) content/cities/<slug>.mdx has 800+ words of city-specific content, and
  // (3) a human has set uniqueContentWords to the real count.
  // Generating city pages without unique content is a doorway-page pattern and is
  // explicitly against Google's spam policies. The gate exists to make that mistake
  // impossible rather than merely discouraged.

Export a function `getActiveCities()` returning only entries with active === true AND
uniqueContentWords >= 800. It will return an empty array right now. That is correct.

GIT
   git add data/cities.ts
   git commit -m "phase-18(C): city registry, all inactive pending content and confirmation"

CONSTRAINTS
- Every city active:false, uniqueContentWords:0.
- Do NOT invent cities. Only what BRAND-FACTS.md lists, or one placeholder.
- One file only.

REPORT WHEN DONE
Print the file and confirm getActiveCities() returns an empty array.
```

### ✅ Phase 18 gate check

```bash
npm run build 2>&1 | grep -i "skipped\|city"
```

Expect zero city routes until you fill in real service areas and content. **That is the
correct starting state.**

---

# ══════════════════════════════════════════
# PHASE 19 — PERFORMANCE & CORE WEB VITALS
# ══════════════════════════════════════════

**Goal:** implement Section VI of `instrtion.md`. Speed is a ranking factor and, more
directly, a conversion factor — an anxious person on a phone with a bad connection leaves.

### ▶ PROMPT 19-A — Agent A (Architect)

```text
You are Agent A (Architect). Performance pass. Work across the project root as needed — this phase you
have write access to any file, because optimisation cuts across ownership. Coordinate: B and
C are working in data/ and content/ only this phase.

TASK — work through instrtion.md Section VI item by item and report on each.

1. Bundle analysis:
   ANALYZE=true npm run build
   Report the largest client bundles. For anything over 100 KB, either justify it in writing
   or fix it. Framer Motion, three.js and the MDX runtime are the usual suspects — three.js
   must be in its own lazy chunk that no route loads on first paint.

2. Dynamic imports: audit every heavy component. Model3D, HorizontalScroll, the calculators,
   TestimonialCarousel and LocationMap must all be `next/dynamic` with meaningful loading
   skeletons that match the final layout's dimensions — a skeleton of the wrong size causes
   the layout shift it was supposed to prevent.

3. Image discipline: every next/image has explicit width and height. Exactly one image per
   route has `priority`. Everything else lazy. Confirm AVIF and WebP are being served.
   Set `sizes` correctly on every responsive image — a missing `sizes` prop silently ships
   the largest variant to phones.

4. Font loading: confirm all four fonts are self-hosted by next/font, that
   `adjustFontFallback` is on, and that there is no request to fonts.googleapis.com in the
   network panel. Verify with: curl -s <page> | grep -c "fonts.googleapis" → must be 0.

5. Third-party scripts: every one uses next/script with the correct strategy. Analytics gets
   `afterInteractive` at the earliest, `worker` where it works. Nothing blocks first paint.

6. CLS: audit every element that appears after load — sticky CTA, toasts, the cookie notice,
   lazy images, the 3D canvas. Reserve space for each. Target CLS under 0.05.

7. INP: profile the calculators and the multi-step form. Any interaction over 200ms gets
   fixed. Check for scroll handlers doing layout reads — batch them or move to
   IntersectionObserver.

8. Add `app/api/vitals/route.ts` and a `<WebVitals />` reporter sending real field metrics to
   GA4, so you measure real users rather than only lab conditions.

9. Set a performance budget in next.config.ts and document it in PERFORMANCE.md:
   LCP < 2.0s, INP < 200ms, CLS < 0.05, total JS < 250 KB gzipped on the homepage.

10. Run Lighthouse on: homepage, one service page, one article, one calculator, the contact
    page. Mobile preset. Report all five scores.

GIT
   git add app components lib data content styles types public next.config.ts PERFORMANCE.md
   git commit -m "phase-19(A): performance pass, bundle optimisation, CWV budgets"

CONSTRAINTS
- Do not sacrifice the hero's visual quality for a score. Optimise the delivery, not the design.
- Every change must be verified by a before/after measurement, not assumed.

REPORT WHEN DONE
A table: page, LCP, INP, CLS, total JS, Lighthouse performance score — before and after.
```

### ▶ PROMPT 19-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. Content-side performance and quality audit. Work in ./content and
./CONTENT-AUDIT.md. Do not edit any component or config — Agent A is optimising those.

TASK

1. Audit every image reference in every MDX file. For each: confirm the file exists in
   public/images, confirm width and height are specified, confirm alt text follows the rules
   from Phase 4-C. List every violation in CONTENT-AUDIT.md with its file and line.

2. Audit every internal link across all content. Find and list: broken links, links to
   pages that do not exist yet, orphan pages (no inbound internal links at all), and pages
   more than 3 clicks from the homepage. Orphan pages effectively do not exist to a crawler.

3. Audit heading hierarchy in every MDX file. instrtion.md requires strict H1 > H2 > H3
   with no skipped levels — a jump from H2 to H4 breaks the structural signal that both
   screen readers and language models use to parse the page. List every violation.

4. Audit content length and thinness: any page under 300 words that is not a glossary term
   gets flagged. Any page whose direct answer is missing or longer than 60 words gets flagged.

5. Check keyword cannibalisation against data/keyword-map.ts: list any two pages targeting
   the same primary keyword.

6. Write CONTENT-AUDIT.md with every finding, grouped by severity, each with the exact file
   path and the specific fix. Then fix everything you own (MDX files) and re-run the audit.

GIT
   git add content CONTENT-AUDIT.md
   git commit -m "phase-19(B): content audit and fixes"

REPORT WHEN DONE
Print the finding counts by severity, before and after your fixes.
```

### ▶ PROMPT 19-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Mechanical verification work. Follow the specification exactly.

CONTEXT
Work in ./public/images and ./data.

TASK

1. Inventory every file actually present in public/images and public/models. For each,
   record: filename, file size in KB, and dimensions if determinable.

2. Compare that inventory against data/assets.ts. Produce `data/asset-status.ts` exporting:
   - `MISSING` — assets declared in assets.ts with no file on disk
   - `ORPHANED` — files on disk not declared in assets.ts
   - `OVERSIZED` — any file over these limits: PNG 300 KB, JPG 250 KB, GLB 800 KB
   Each as a typed array of { filename, expected, actual }.

3. Create `ASSET-REPORT.md` at the repository root: a table of every asset with columns
   filename, present (yes/no), size, within budget (yes/no), and the action needed.
   Sort it so the largest budget violations are at the top.

4. Do NOT delete, move, compress, or modify any image file. You are producing a report only.
   Deleting an asset another agent is mid-way through referencing would break the build.

GIT
   git add data/asset-status.ts ASSET-REPORT.md
   git commit -m "phase-19(C): asset inventory and budget report"

CONSTRAINTS
- Report only. Modify no binary file.
- Use `ls -la` and `sips -g pixelWidth -g pixelHeight <file>` on macOS to get real values.
  Do not estimate sizes.

REPORT WHEN DONE
Print the counts: total assets, missing, orphaned, oversized.
```

### ✅ Phase 19 gate check

```bash
ANALYZE=true npm run build && npx lighthouse http://localhost:3000 --preset=desktop --view
```

Targets: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100.

---

# ═══════════════════════════════════════════════
# PHASE 20 — SECURITY, ANALYTICS, QA & LAUNCH
# ═══════════════════════════════════════════════

**Goal:** implement Section VII of `instrtion.md`, clear every `VERIFY` marker, and ship.

### ▶ PROMPT 20-A — Agent A (Architect)

```text
You are Agent A (Architect). Security, analytics and the final build. Work across the project root.

TASK

1. Content Security Policy in next.config.ts headers(), per instrtion.md. Build it as
   restrictively as the site actually allows:
   - default-src 'self'
   - script-src 'self' + a nonce, plus the exact analytics domains. Generate the nonce in
     middleware per request. If any inline script cannot take a nonce, fix the script rather
     than adding 'unsafe-inline' — 'unsafe-inline' on script-src makes the whole policy
     decorative.
   - style-src 'self' 'unsafe-inline' (Next.js requires this for its style injection)
   - img-src 'self' data: blob: + any image host
   - font-src 'self'  (all fonts are self-hosted, so this can be strict)
   - frame-ancestors 'none', base-uri 'self', form-action 'self', object-src 'none'
   - upgrade-insecure-requests
   Then add: Strict-Transport-Security with a 2-year max-age and includeSubDomains,
   X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, and a
   Permissions-Policy denying camera, microphone, geolocation and interest-cohort.

   Test the CSP in report-only mode first, load every page type, collect the violations, fix
   them, and only then enforce. Shipping an untested enforcing CSP breaks production silently
   for the subset of users whose page happens to hit the blocked resource.

2. GA4 per instrtion.md, via next/script with `afterInteractive`. Track these events:
   consultation_started, consultation_step_completed (with the step number),
   consultation_booked, checklist_downloaded, calculator_used (with the tool name),
   guide_downloaded, phone_clicked, whatsapp_clicked, service_page_viewed.
   Set consultation_booked as the conversion. Consent-gate analytics: no tracking script
   loads before consent, and per instrtion.md, bot user-agents bypass the consent modal
   entirely so crawlers never index a page obscured by it.

3. `components/ui/ConsentBanner.tsx` — minimal, accessible, bottom-anchored, does not block
   content, remembers the choice, offers a genuine reject that actually prevents loading.
   Never rendered for crawler user-agents (use isSearchCrawler / isAICrawler from
   data/ai-crawlers.ts).

4. Final build verification:
   npm run build && npm test && npx tsc --noEmit && npm run lint
   All four must pass with zero errors before you commit.

5. Run the full VERIFY sweep:
   grep -rn "VERIFY" content data
   Output the complete list to VERIFY-SWEEP.md, grouped by file, with a checkbox each.
   Then add a build-time guard: a script that FAILS the production build if any content file
   contains an unverified figure marked for publication. Wire it into the build command.
   The point is that it must be impossible to accidentally publish a guessed tax figure.

GIT
   git add app components lib data content middleware.ts next.config.ts VERIFY-SWEEP.md
   git commit -m "phase-20(A): CSP, security headers, GA4, consent, verify guard"

CONSTRAINTS
- No 'unsafe-inline' on script-src.
- Test CSP in report-only mode before enforcing. Report the violations you found.
- All four verification commands pass.

REPORT WHEN DONE
Paste the CSP header, the four command results, and the VERIFY sweep count.
```

### ▶ PROMPT 20-B — Agent B (Content & SEO Engineer)

```text
You are Agent B. Legal pages and the launch content audit. Work in ./app/(legal) and
./LAUNCH-CHECKLIST.md.

TASK

1. Write four legal pages, per instrtion.md Section VII:

   `/privacy` — what is collected (form submissions, analytics, localStorage checklist
   state), why, how long it is retained, who it is shared with (Resend, Vercel, Google),
   the lawful basis, how to request deletion, and the contact address for privacy requests.
   Write it in plain language a client can actually read. Note clearly that this is a
   template that the practice's own legal review must confirm before launch — a privacy
   policy is a binding representation about data handling, and an AI-drafted one that does
   not match what the site actually does is worse than none.

   `/terms` — scope of the site, that using it does not create a professional engagement,
   fee terms pointing at the engagement letter, and limitation of liability.

   `/disclaimer` — the permanent textual boundary instrtion.md requires: the content is
   general information about tax and compliance law, it is not advice on any specific
   matter, law and rates change, and no professional relationship arises from reading it.
   This must also appear as a single line in the site footer on every page.

   `/refund-policy` — professional fee refund terms and what happens to government fees
   already paid (they are not refundable by the practice, which needs saying plainly).

   Every page: last-updated date, and `<!-- LEGAL REVIEW REQUIRED -->` at the top of the
   source of each.

2. Final SEO audit — write LAUNCH-CHECKLIST.md and verify each item yourself:
   - Every page has a unique title under 60 chars and description under 155
   - Every page has a canonical
   - Zero duplicate titles or descriptions sitewide (list any collisions)
   - Every image has alt text or is correctly marked decorative
   - Heading hierarchy valid on every page
   - Every service page has: AnswerBlock, FAQ, schema, internal links, a CTA
   - sitemap.xml includes every indexable page and excludes every noindex page
   - robots.txt allows the crawlers listed in data/robots-reference.txt
   - llms.txt is present, under 4 KB, and every link in it resolves
   - Every .md variant returns Markdown
   - No page is more than 3 clicks from the homepage
   - Zero orphan pages
   - Every VERIFY marker is either resolved or the content is unpublished

3. Add a post-launch operations section to LAUNCH-CHECKLIST.md: what to do in week 1
   (Search Console, Bing Webmaster, Google Business Profile, index the sitemap), month 1,
   and month 3, with the specific metric to watch at each point.

GIT
   git add app/\(legal\) LAUNCH-CHECKLIST.md
   git commit -m "phase-20(B): legal pages and launch checklist"

CONSTRAINTS
- LEGAL REVIEW REQUIRED marker on all four legal pages.
- Verify each checklist item yourself. Do not tick something you have not checked.

REPORT WHEN DONE
Print the checklist with real pass/fail status per item, not a blank template.
```

### ▶ PROMPT 20-C — Agent C (Data & Copy Hand)

```text
You are Agent C. Final mechanical sweep. Follow the specification exactly.

CONTEXT
Work at the repository root and in ./data.

TASK

1. Scan every file in content and data. Produce `VERIFY-INDEX.md` at the repository
   root: a table with one row per VERIFY marker, columns —
     file path | line number | the exact text being verified | category | resolved (unchecked)
   Category is one of: rate, threshold, deadline, penalty, fee, document, jurisdiction,
   process, credential.
   Sort by category, then by file. This is the list a human works through before launch.

2. Produce `data/verification-status.ts` exporting:
   - `TOTAL_MARKERS: number`
   - `BY_CATEGORY: Record<string, number>`
   - `BLOCKING: string[]` — the file paths containing a marker in a category of
     rate, threshold, deadline, penalty, or fee. These block launch, because each one is a
     number a reader could act on and lose money over. Document, process, jurisdiction and
     credential markers do not block launch but must be listed.
   - `canLaunch(): boolean` returning BLOCKING.length === 0

3. Produce `HANDOVER.md` at the repository root — what the practice owner needs, in plain
   language with no jargon:
   - How to change text on the site (which file, what to edit, how to publish)
   - How to publish a new article (create the MDX file, the frontmatter fields, push)
   - How to update a tax rate when it changes (data/tax-rates.ts, flip verified)
   - How to add a testimonial once consent is obtained
   - How to activate a city page
   - What to do if the site goes down (Vercel rollback, in three steps)
   - Who to contact for what
   Write it for someone who has never used git. Give the exact commands to copy.

GIT
   git add VERIFY-INDEX.md data/verification-status.ts HANDOVER.md
   git commit -m "phase-20(C): verification index, launch gate, owner handover guide"

CONSTRAINTS
- Every VERIFY marker in the codebase must appear in the index. Count them with grep first
  and confirm your table row count matches.
- Do not resolve or delete any marker yourself. You are indexing, not verifying.

REPORT WHEN DONE
Print TOTAL_MARKERS, BY_CATEGORY, BLOCKING.length, and canLaunch().
```

### ✅ Phase 20 gate check — the launch gate

```bash
npm run build && npm test && npx tsc --noEmit && npm run lint
```

Then, before you point the domain at it:

1. Work through `VERIFY-INDEX.md`. Every **rate, threshold, deadline, penalty and fee**
   marker must be confirmed against the current official notification and flipped to
   `verified: true`. `canLaunch()` must return `true`.
2. Fill `BRAND-FACTS.md` completely. Re-run the build.
3. Have the four legal pages reviewed.
4. Tick the advertising-guardrail box and set `ADVERTISING_MODE` accordingly.

**Do not launch a tax practice's website with a single guessed number on it.** Everything
else in this build can be fixed after launch. That cannot.

---

# ═══════════════════════════
# APPENDIX A — DAILY DRIVING
# ═══════════════════════════

## Running the three agents

Open three terminals, all in `/Users/bhagatsingh/Desktop/AMITMODI`:

```bash
cd /Users/bhagatsingh/Desktop/AMITMODI
```

Paste Prompt A into terminal 1, B into terminal 2, C into terminal 3. Within a minute of
each other.

## When two agents collide anyway

Symptom: `error: Your local changes would be overwritten by merge`.

```bash
git stash && git pull --rebase && git stash pop
```

If a real conflict appears in a file, the owner from the ownership map wins. Reset the other
agent's copy and re-run just that agent's prompt:

```bash
git checkout --theirs <path> && git add <path>
```

## Getting the most out of each agent

**Agent A** — give it room to think before it writes. If it produces something shallow, reply:
*"Before writing code, list the three approaches you considered and why you chose this one.
Then show me where this breaks under load, on a slow phone, and with JavaScript disabled."*

**Agent B** — its failure mode is fluent, plausible, wrong compliance detail. Push back with:
*"For every factual claim in what you just wrote, state whether you are certain, and mark
every uncertain one with VERIFY. Do not defend a claim you cannot source."*

**Agent C** — its failure mode is helpfully inventing what was not asked for. If it adds
entries or fields you did not specify, reply: *"You added items I did not specify. Remove
everything not in the specification and print the file again."* Do not negotiate — restate
the spec.

**All three** — end any phase where the output looks thin with:
*"Re-read the prompt's CONSTRAINTS section and check your work against each line. Report
pass or fail per constraint."*

## The one habit that matters most

**Run the gate check yourself after every phase.** The agents will tell you they are done.
The gate check tells you whether they are. When those two disagree, the gate check is right.

---

# ═════════════════════════════════════
# APPENDIX B — THE 100-CLIENT PLAYBOOK
# ═════════════════════════════════════

The website is the asset. It is not the strategy. Here is what actually produces the leads,
in the order the returns arrive.

### Weeks 1–2 — the things that cost nothing and matter most

1. **Google Business Profile.** For a local professional practice this outperforms the entire
   website for the first several months. Complete every field, add real photos of the office,
   list all eight services individually, and post weekly. NAP must match `BRAND-FACTS.md`
   character for character.
2. **Search Console + Bing Webmaster Tools.** Submit the sitemap. Bing matters more than its
   market share suggests, because it feeds Copilot.
3. **Ask every past client for a Google review.** Ten genuine reviews will move the local pack
   more than any on-page work in this document. (If the advertising guardrail applies, check
   what your body permits here first.)

### Month 1 — make the compounding start

4. Publish one article per week from the CONTENT-STRATEGY.md queue. Consistency beats volume.
5. Get the calculators linked from wherever your peers gather — trade associations, local
   business groups, industry forums. A calculator is linkable; a services page is not.
6. Claim and complete: Justdial, IndiaMART, Sulekha, LinkedIn company page, and any local
   trade directory. Consistent NAP everywhere.

### Months 2–3 — the AI-search play

7. Monthly, run these in ChatGPT, Perplexity, Gemini and Google AI Mode, and record whether
   the practice is cited:
   - "who can help me with GST registration in `<city>`"
   - "I received a GST notice, what do I do"
   - "best tax consultant in `<city>` for a small business"
   - "how do I register a trust and get 80G"
   If a competitor is cited instead, read what the model quoted. That sentence is the gap.
   Write the better version of it and put it in an AnswerBlock.
8. Watch `llms.txt` and the `.md` endpoints in your server logs for AI crawler hits. Rising
   crawl frequency from GPTBot, ClaudeBot and PerplexityBot is the leading indicator, weeks
   before citations appear.

### Months 3–6 — depth

9. Publish the four evergreen guides properly and promote each one individually.
10. Turn every real matter into a case study — with written consent — and publish it.
11. Add city pages only as the practice genuinely expands. Never ahead of it.
12. Update the compliance calendar before each season and push it out by email to the .ics
    subscriber list.

### What to measure, and what to ignore

| Watch | Ignore |
|---|---|
| Consultation form completions | Pageviews |
| Calls and WhatsApp clicks from the site | Bounce rate |
| Google Business Profile calls and direction requests | Keyword ranking for vanity terms |
| Which service pages convert, not which get traffic | Domain authority scores |
| Whether AI engines cite you by name | Social media followers |

**The honest framing on "100+ clients a year":** this website makes the practice findable,
credible, and easy to contact at the moment someone has a problem. It removes the reasons a
qualified lead would choose someone else. It cannot manufacture demand that is not there, and
no website can. What it can do — and what this build is engineered for — is make sure that
when a business owner in that city searches, or asks an AI, the practice is the answer they
get and the one they trust enough to call. That, plus a Google Business Profile worked
properly and a consistent publishing habit, is what gets you there.

---

# ═══════════════════════════════
# APPENDIX C — PHASE QUICK INDEX
# ═══════════════════════════════

| Phase | Gate command |
|---|---|
| 1 Foundation | `npm run build` |
| 2 Design system | Open `/styleguide` |
| 3 Content truth | `npx tsc --noEmit` |
| 4 Assets | Generate from `ASSET-BRIEF.md` |
| 5 Layout shell | Keyboard-only navigation test |
| 6 Motion | Reduced-motion test |
| 7 Hero | Lighthouse LCP element must be text |
| 8 Homepage | 8 service links in `curl` output |
| 9 Services | All 8 routes statically generated |
| 10 Service pages | Word counts 1200–1800 each |
| 11 Tools | `npm test` passes |
| 12 Forms | A real email arrives |
| 13 Trust | No empty sections in conservative mode |
| 14 Insights | RSS feed resolves |
| 15 Knowledge base | Glossary count matches data |
| 16 GEO | `curl -H "User-Agent: GPTBot"` returns Markdown |
| 17 SEO | Rich Results Test: zero errors |
| 18 Local | Zero city routes until content is real |
| 19 Performance | Lighthouse ≥ 95 / 100 / 95 / 100 |
| 20 Launch | `canLaunch() === true` |

---

*Built from `buisness.md`, `instrtion.md`, `moneyincheck-1r.mp4`, `original-…mp4`, and
`attachment_147590016.png`. Visual language from the first video; content architecture from
the second and the screenshot; technical requirements from `instrtion.md` in full.*

---

# ══════════════════════════════════════════════
# APPENDIX D — instrtion.md COVERAGE MAP
# ══════════════════════════════════════════════

Every requirement in `instrtion.md`, mapped to the phase that implements it. Use this to
audit the build against the original spec. **Ten requirements are only partially covered by
the phase prompts as written** — those are marked ⚠ and closed by the addenda in Appendix E.

### I. Next.js Foundation & Deployment (10)

| # | Requirement | Phase |
|---|---|---|
| 1 | App Router Migration | 1-A |
| 2 | Server-Side Rendering | 1-A, 9-A |
| 3 | Static Site Generation | 9-A, 14-A, 15-A |
| 4 | Incremental Static Regeneration | 14-A (`revalidate = 3600`) |
| 5 | Local Environment Setup | 1-A |
| 6 | Vercel Deployment | 1-B (`DEPLOYMENT.md`) |
| 7 | Edge Caching | 16-A, 17-A |
| 8 | Next/Image Component | 4-A, 19-A |
| 9 | Next/Link Prefetching | 14-A (MDX link override) |
| 10 | Font Optimization | 2-A, 19-A |

### II. GEO & LLM Readiness (20)

| # | Requirement | Phase |
|---|---|---|
| 11 | llms.txt Implementation | 16-B |
| 12 | Markdown Mapping | 16-A, 16-B |
| 13 | llms-full.txt Bundle | 16-B |
| 14 | HTML Noise Reduction | 16-A |
| 15 | Context Window Optimization | 16-B (4 KB cap) |
| 16 | Token Efficiency | 16-A |
| 17 | Content Negotiation | 16-A (`middleware.ts`) |
| 18 | Avoid "AEO Schema" Scams | 17-B (stated explicitly) |
| 19 | Semantic HTML5 | 5-B, 10-A |
| 20 | System Prompt Grounding | 16-B (llms.txt blockquote) |
| 21 | LLM Citation Strategy | 16-B (`citable-facts.ts`) |
| 22 | Direct Answer Formatting | 5-B (`AnswerBlock`), 9-B, 14-B |
| 23 | Entity Recognition Validation | 5-B, 9-B (full entity names) |
| 24 | Cookie Banners bypassed for crawlers | 20-A, 16-C |
| 25 | Brand Truth Baseline | 3-A, 3-C (`brand.ts`) |
| 26 | Automated Markdown Generation | 16-A (build-time, from MDX) |
| 27 | Heading Hierarchy | 19-B (audited), 14-A |
| 28 | Tabular Data Simplification | 16-A (MD tables → lists) |
| 29 | FAQ Density | 8-B, 9-B, 10-B (80 FAQs) |
| 30 | No "FAQ Stuffing" | 10-B (explicit constraint) |

### III. Traditional Technical SEO (20)

| # | Requirement | Phase |
|---|---|---|
| 31 | Metadata API | 17-A (`buildMetadata`) |
| 32 | Title Tag Optimization | 17-A (throws over 60 chars) |
| 33 | Human-Centric Meta Descriptions | 7-B, 9-B, 17-A |
| 34 | Dynamic XML Sitemaps | 17-A (real `lastmod`) |
| 35 | Robots.txt Configuration | 17-A, 16-C |
| 36 | WebSite Schema | 17-B |
| 37 | Service Schema | 17-B |
| 38 | Person Schema | 17-B |
| 39 | BlogPosting Schema | 17-B |
| 40 | BreadcrumbList Schema | 17-B, 5-B |
| 41 | Canonical URLs | 17-A |
| 42 | Deep Internal Linking | 9-B, 14-B, 19-B |
| 43 | URL Structure (flat, keyword-rich) | 5-C, 9-A |
| 44 | Language Tags (hreflang) | 17-A (`en-IN`) |
| 45 | OpenGraph Tags | 7-B, 9-A, 17-A |
| 46 | Twitter Cards | 7-B, 17-A |
| 47 | Server-Side Rendered JSON-LD | 17-B |
| 48 | LocalBusiness Schema | 17-B, 18-C |
| 49 | 404 Page Customization | 17-A |
| 50 | 301 Redirect Management | 17-A, 17-C |

### IV. Content Strategy & Compliance Copy (15)

| # | Requirement | Phase |
|---|---|---|
| 51 | Tax Season Hubs | ⚠ 1-B strategy only — **see E1** |
| 52 | Lexicon Mapping | 3-B (40-term table), 15-B |
| 53 | Case Study Framework (STAR) | 13-A, 13-B |
| 54 | Trust Badges | 13-A, 13-C |
| 55 | Glossary of Terms | 15-A, 15-B (60 entries) |
| 56 | Video Transcripts | ⚠ not covered — **see E2** |
| 57 | Evergreen Guides | 15-B (4 guides) |
| 58 | Downloadable Lead Magnets | 15-A, 15-C |
| 59 | Founder Authority Articles | ⚠ partial — **see E3** |
| 60 | Client Success Stories | 13-B (consent-gated) |
| 61 | Pricing Transparency | 9-A, 10-A (`FeeTable`) |
| 62 | Timeline Charts | 10-A (`ProcessTimeline`) |
| 63 | Multi-State Coverage | ⚠ partial — **see E4** |
| 64 | Document Checklists | 9-B, 9-C |
| 65 | Penalty Warnings | 10-A (`PenaltyCallout`) |

### V. UI, UX & Framer Motion (20)

| # | Requirement | Phase |
|---|---|---|
| 66 | Sticky Navigation | 5-A |
| 67 | Framer Motion Layout Animations (`AnimatePresence`) | ⚠ partial — **see E5** |
| 68 | Scroll-Driven Reveal (`whileInView`) | 6-A (`Reveal`) |
| 69 | Micro-Interactions | 6-A (`Magnetic`) |
| 70 | Accessible Color Contrast | 2-B (ratios computed) |
| 71 | Spline 3D Hero Integration | 7-A (+ Spline variant) |
| 72 | Skeleton Loaders | ⚠ partial — **see E6** |
| 73 | Touch Targets (44×44) | 2-B, 5-A |
| 74 | Form Error States | 12-A, 12-B |
| 75 | Multi-Step Form UX | 12-A (4 steps) |
| 76 | Dark Mode Support | 2-A (`next-themes`) |
| 77 | Custom Scrollbars | 2-A |
| 78 | Typography Hierarchy | 2-A (fluid scale) |
| 79 | Accordion FAQs | 5-B |
| 80 | Floating Action Button | ⚠ partial — **see E7** |
| 81 | Toast Notifications | 12-A |
| 82 | Progress Indicators | 14-A (reading progress) |
| 83 | Interactive Maps | 18-A (`LocationMap`) |
| 84 | Client Carousel | 13-A (`ClientMarquee`) |
| 85 | Focus States | 2-A |

### VI. Performance & Core Web Vitals (10)

| # | Requirement | Phase |
|---|---|---|
| 86 | LCP Optimization | 7-A, 19-A |
| 87 | CLS Prevention | 4-A, 19-A |
| 88 | FID/INP Reduction | 6-A, 19-A |
| 89 | Dynamic Imports | 4-A, 19-A |
| 90 | Third-Party Script Loading | 19-A, 20-A |
| 91 | CSS Minification | 2-A (Tailwind compile) |
| 92 | SVG Optimization | ⚠ not covered — **see E8** |
| 93 | Brotli Compression | ⚠ not covered — **see E9** |
| 94 | API Route Caching | ⚠ partial — **see E10** |
| 95 | Bundle Analyzer | 1-A, 19-A |

### VII. Security, Legal & Analytics (5)

| # | Requirement | Phase |
|---|---|---|
| 96 | Strict CSP | 20-A |
| 97 | Data Encryption (SSL/TLS) | 20-A (HSTS + `upgrade-insecure-requests`) |
| 98 | Google Analytics 4 | 20-A |
| 99 | Privacy Policy Generation | 20-B |
| 100 | Legal Disclaimer Footer | 5-A, 20-B |

---

# ══════════════════════════════════════════════
# APPENDIX E — GAP-CLOSING ADDENDA
# ══════════════════════════════════════════════

Ten requirements that the phase prompts cover only partially. Each addendum below is written
to be **pasted onto the end of the named prompt**, before you send it. They are separated out
rather than buried in the prompts so you can see exactly what was and was not handled.

### E1 — Tax Season Hubs → append to **PROMPT 15-B**

```text
ADDITIONAL TASK — Tax Season Hubs (instrtion.md IV)

Create 4 seasonal hub pages in content/hubs/, each a landing page for a temporal search spike:
  itr-filing-season.mdx        — peaks in the months before the ITR due date
  gst-annual-return-season.mdx — peaks before the GSTR-9/9C deadline
  tds-quarter-end.mdx          — peaks four times a year before each TDS return
  year-end-tax-planning.mdx    — peaks in the last quarter of the financial year

Each hub: 1000-1500 words, a countdown-ready deadline list pulled from
data/compliance-calendar.ts, links to every relevant service, tool and guide, a
"what to do this week" action list, and a "what happens if you miss it" section.

These pages must be published and indexed at least 6 weeks before their spike — a page
indexed the week the traffic arrives has missed the season. Add each hub's publish-by date
to CONTENT-STRATEGY.md so it is scheduled, not remembered.
```

### E2 — Video Transcripts → append to **PROMPT 10-A**

```text
ADDITIONAL TASK — Video & animation transcripts (instrtion.md IV)

Build components/content/MediaTranscript.tsx. Any explainer video, animated sequence or 3D
scene on the site renders a full text transcript beneath it, inside a <details> that is
open by default on mobile.

Requirements:
- The transcript is real text in the server-rendered HTML, always. It is the only version of
  that content a crawler or a language model can read at all.
- For a 3D scene or an animation with no narration, write a description of what it shows and
  what it is illustrating — this doubles as the accessibility long-description.
- Wire it into the Hero's 3D scene and into any video embedded in MDX.
- Add a `transcript` field to the MDX video component's props and make it REQUIRED, so a
  video cannot be added without one.
```

### E3 — Founder Authority Articles → append to **PROMPT 14-B**

```text
ADDITIONAL TASK — Founder authority articles (instrtion.md IV)

Beyond the twelve launch articles, create 3 opinion-piece TEMPLATES in content/blog/, each
with frontmatter `draft: true` and `author: 'principal'`:
  - A commentary on a recent or upcoming change in GST law and what it means practically
  - A piece on where businesses most often go wrong in their first two years of compliance
  - A forward-looking piece on where tax administration is heading (faceless assessment,
    e-invoicing thresholds, AI in scrutiny selection)

These are the highest E-E-A-T content on the site because they demonstrate judgement rather
than reciting rules — which is precisely what a search engine assessing expertise, and a
prospective client assessing competence, are both looking for.

CRITICAL: leave the opinions as clearly-marked prompts for the principal to answer in their
own words. Write the structure, the questions, and the research context — never write an
opinion and attribute it to a real named professional. Put this instruction at the top of
each file: "Draft structure only. The principal writes the opinions. Do not publish as-is."
```

### E4 — Multi-State Coverage → append to **PROMPT 18-B**

```text
ADDITIONAL TASK — Multi-state capability notes (instrtion.md IV)

Create content/multi-state-compliance.mdx, 1200-1600 words, covering what genuinely differs
by state and therefore what a client in one state needs that a client in another does not:
  - GST is state-wise: separate registration per state of supply, and what triggers that
  - Professional tax: which states levy it, and that it is a state subject
  - Shops & Establishments registration: state or municipal, and how it varies
  - Stamp duty on partnership deeds and trust deeds: state-specific rates
  - State-specific incentive and subsidy schemes worth knowing about

Then add a `multiStateNote` field to each service in data/services.ts (request this from
Agent C via HANDOFF.md) and render it on every service page: one honest sentence about
whether that service is uniform nationally or varies by state.

Every state-specific claim gets a VERIFY marker. State law changes independently and more
often than central law, so this page needs a review date and a shorter review cycle than
the rest of the site — note that at the top of the file.
```

### E5 — AnimatePresence page transitions → append to **PROMPT 6-A**

```text
ADDITIONAL TASK — Page transitions (instrtion.md V)

Build components/ui/PageTransition.tsx using Framer Motion's <AnimatePresence mode="wait">
keyed on the pathname, and wire it into app/template.tsx (template.tsx, not layout.tsx —
layout does not remount between routes and the transition will not fire).

Transition: a 240ms opacity and 8px Y fade. Short. A page transition longer than ~300ms is
perceived as the site being slow, not as the site being polished.

Hard requirements, because App Router page transitions break things quietly:
- Scroll position must reset to top on navigation. Verify this explicitly.
- Focus must move to the <main> element on route change, or keyboard and screen reader users
  are stranded at the old page's focus position.
- The exit animation must not delay the new page's LCP. Measure before and after; if LCP
  regresses at all, reduce the duration or drop the exit animation entirely.
- Fully disabled under prefers-reduced-motion.
```

### E6 — Skeleton Loaders → append to **PROMPT 19-A**

```text
ADDITIONAL TASK — Skeleton loaders (instrtion.md V)

Build components/ui/Skeleton.tsx: a shimmer placeholder using a CSS-only animated gradient
(no JavaScript, no layout properties animated), respecting prefers-reduced-motion by
rendering a static tint instead of a shimmer.

Then create matched skeletons for every dynamically-imported component, and for every
Next.js loading.tsx boundary: the 3D canvas, each calculator, the testimonial carousel, the
map, and the insights index.

THE RULE THAT MAKES SKELETONS WORTH HAVING: each skeleton must occupy the exact dimensions
of the content it replaces. A skeleton that is the wrong height causes the layout shift it
was added to prevent, which is strictly worse than showing nothing. Verify each one by
measuring the rendered height before and after the real content loads — they must match.
```

### E7 — Floating Action Button → append to **PROMPT 12-A**

```text
ADDITIONAL TASK — Floating action button (instrtion.md V)

Build components/ui/FloatingContact.tsx — the permanent bottom-right launcher.

Behaviour:
- Collapsed: a single circular button, 56px, --seal, with a clear icon and an accessible
  label ("Contact us"). Appears after 25% scroll depth on any page.
- Expanded on click: WhatsApp, call, and "book a consultation" as three labelled actions.
- Each action reads its target from lib/brand.ts and is OMITTED when the value is TBD. If
  all three are TBD, the button does not render at all.
- Fires the GA4 events phone_clicked / whatsapp_clicked / consultation_started.
- Keyboard operable, focus-trapped when expanded, Escape closes and returns focus.
- Dismissible, with dismissal persisted for the session.
- On mobile it must not overlap the sticky bottom CTA from Phase 10 — coordinate the two so
  only one is visible at a time. Decide the rule explicitly and document it in a comment.

Do NOT build a chat widget. A live-chat launcher on a practice with no one staffing it is
worse than no launcher: an unanswered chat is a lost client who believed they had made
contact. WhatsApp and phone are what this practice can actually answer.
```

### E8 — SVG Optimization → append to **PROMPT 19-C**

```text
ADDITIONAL TASK — SVG optimisation (instrtion.md VI)

For every .svg file in public/ and every inline SVG in components/:
1. Run it through SVGO:
     npx svgo --folder=public/images --recursive --precision=2
2. For inline SVGs, manually apply the same rules: remove the XML prolog, editor metadata,
   comments, unused ids, empty groups and hidden elements; round path precision to 2
   decimals; ensure a viewBox is present and width/height are not hardcoded.
3. Every decorative SVG gets aria-hidden="true" and focusable="false" (the latter matters
   for older browsers that put SVGs in the tab order).
4. Every meaningful SVG gets role="img" and a <title> as its first child.

Record before/after byte sizes for every file in ASSET-REPORT.md. Do not optimise any file
that is currently referenced by an in-flight component without checking it still renders —
SVGO's default plugins can break a path that another agent is animating.
```

### E9 — Brotli Compression → append to **PROMPT 20-A**

```text
ADDITIONAL TASK — Compression verification (instrtion.md VI)

Vercel applies Brotli automatically at the edge for text assets, so there is nothing to
configure — but "it should be on" is not verification. Confirm it:

  curl -sI -H "Accept-Encoding: br" https://<your-vercel-url>/ | grep -i content-encoding
  curl -sI -H "Accept-Encoding: br" https://<your-vercel-url>/llms-full.txt | grep -i content-encoding

Both must return `content-encoding: br`. Record the results in PERFORMANCE.md alongside the
uncompressed and compressed transfer sizes for: the homepage HTML, the main JS bundle, the
CSS bundle, and llms-full.txt.

If any text asset is served uncompressed, find out why — the usual cause is a wrong
content-type on a custom route handler, which is a real bug worth fixing rather than an
optimisation to skip. Note that .glb and image files are already compressed and will
correctly show no Brotli encoding.
```

### E10 — API Route Caching → append to **PROMPT 19-A**

```text
ADDITIONAL TASK — API and data caching (instrtion.md VI)

Set an explicit cache policy on every route handler. There is no safe default here: an
uncached read route wastes a function invocation on every request, and a cached write route
is a correctness bug.

  /api/consultation   POST — no-store. Never cached under any circumstance.
  /api/download       POST — no-store.
  /api/vitals         POST — no-store.
  /api/md/*           GET  — public, max-age=3600, stale-while-revalidate=86400
  /llms.txt           GET  — public, max-age=3600, stale-while-revalidate=86400
  /llms-full.txt      GET  — public, max-age=3600, stale-while-revalidate=86400
  /insights/feed.xml  GET  — public, max-age=3600, stale-while-revalidate=86400
  sitemap.xml         GET  — public, max-age=3600

Wrap any repeated filesystem content read in React's `cache()` so a single render does not
read the same MDX file more than once.

Then verify each one:
  curl -sI https://<url>/<path> | grep -i cache-control
Paste every result into PERFORMANCE.md. An endpoint whose actual header does not match the
intended policy above is a finding, not a rounding error.
```

---

**After applying E1–E10, all 100 requirements in `instrtion.md` are implemented.**

Paste each addendum onto the end of its named prompt before sending that phase. They are
written to sit after the prompt's existing CONSTRAINTS block without contradicting it.
