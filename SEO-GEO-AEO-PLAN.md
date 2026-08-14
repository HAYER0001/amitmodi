# SEO / GEO / AEO Execution Plan — Amit Modi & Co.

Derived from the 50-point strategy, filtered against what this repository can
actually build, and sequenced by lead impact.

Every item below is written to be handed to an implementing agent. Each carries
a **path**, an **action**, and an **acceptance test**. Items that cannot be
verified by the agent are marked `HUMAN` and must not be attempted in code.

Audit baseline measured 2026-08-13 on commit `9919821`.

---

## GATE 0 — Facts that block specific work

None of these can be invented. Each one gates the items listed beside it.
Until a fact is confirmed, the dependent item **must not ship** — the emitters
in `components/seo/SchemaEmitters.tsx` already self-suppress on missing data and
that behaviour must be preserved.

| Fact | Currently | Blocks |
|---|---|---|
| Bar Council enrolment number | `membershipNo: 'TBD'` | 1.2 `Attorney` schema, 4.1 credentials block |
| Is Amit an enrolled Advocate? | `designation: 'Advocate'` unconfirmed | All of §1.2, the litigation positioning |
| Office lat / long | `null` | 3.1 `LocalBusiness`, local pack eligibility |
| Office hours | `TBD` | 3.1 `openingHoursSpecification` |
| Public email | `TBD` | Lead delivery, `ContactPoint` schema |
| Years in practice | `TBD` | 4.1 experience signals |
| Cities genuinely serviced | `cities: []` | 3.2 location pages — **do not guess** |
| Real client outcomes | 5 anonymised case studies exist | 4.3 outcome claims |

---

## THE ADVERTISING CONSTRAINT — read before Category 3 and 5

`data/brand.ts:18` already records this, and it shapes a large part of the
50-point plan:

> If Amit practises as an enrolled **Advocate**, Bar Council of India conduct
> rules restrict advertising and solicitation.

Under BCI Rule 36 an advocate's website may carry factual information — name,
address, contact, enrolment number, areas of practice, qualifications — but
**soliciting work, superlative claims, success rates and testimonials are
restricted**. Several strategy points collide with this directly:

| Point | Conflict |
|---|---|
| 13 — keyword-rich review harvesting | Solicited testimonials |
| 43 — "appeals represented, demands stayed" | Success-rate advertising |
| 16 — geo-targeted search ads | Solicitation |
| 19 — ABM outreach to CFOs | Direct solicitation |
| Brand title "The Best…" | Unverifiable superlative |

**Recommended split, for Amit to confirm with his own counsel:**

- Market the **firm** as a tax, GST and compliance *consultancy*
  (`AccountingService` / `ProfessionalService`) — advisory, filing, and
  representation-support work. This is where reviews, ads and metrics live.
- State the **advocate credential factually**, without solicitation, on
  `/practice/principal` only.

This is a live professional-conduct question, not a marketing preference. It is
flagged here so the decision is made deliberately rather than by default.

---

## PHASE 1 — Stop the bleeding

No new facts required. Highest lead impact per hour. Do this first.

### 1.1 Conversion path on all five tools
**Points 44, 48** · `app/tools/*/page.tsx`

Measured: all five tools carry **0 CTAs and 0 capture**. These are the
highest-intent pages on the site — somebody computing a GST late fee is in
active pain.

- Add a result-contextual CTA beneath every calculator output. The copy must
  reference the computed situation, not a generic "Contact us".
  - `late-fee-calculator` → "This penalty is still contestable in many cases. Have it reviewed."
  - `gst-calculator` → "Check whether this liability is correct before you file."
  - `tds-rate-finder` → "Mismatched TDS is the most common notice trigger."
  - `itr-form-selector` → "Confirm this is the right form before filing."
  - `hsn-sac-lookup` → "Wrong HSN is a classification dispute waiting to happen."
- Add the WhatsApp affordance already present on `/contact` (`wa.me`).
- Reuse `ClosingCTA`; do not invent a new component.

**Accept:** every `app/tools/*/page.tsx` renders ≥1 link to `/contact` and one
`wa.me` link. No fabricated urgency, no invented penalty figures.

### 1.2 Purge dead-domain references
**Point 1 (entity integrity)**

`complianceincheck.com` — the internal design codename — is still shipping:

| Path | Issue |
|---|---|
| `app/opengraph-image.tsx:104` | **Printed on the social share card.** Every WhatsApp forward shows a dead brand |
| `app/image-sitemap.xml/route.ts:3` | Fallback domain |
| `app/api/download/route.ts:32` | Fallback domain |
| `lib/ics.ts:37,93` | Fallback + calendar invite UIDs |

Also `https://amitmodi.com` (a domain the practice does **not** own — they are
acquiring `amitmodi.co.in`) is the fallback in 4 places:
`app/guides/[slug]/page.tsx`, `app/practice/principal/page.tsx`,
`app/services/[slug]/page.tsx`, `components/seo/Breadcrumbs.tsx`.

- Introduce one exported constant, `SITE_URL`, in `lib/seo.ts`. Every module
  imports it. No module declares its own fallback.
- Fallback value: `https://amitmodi-one.vercel.app` until the real domain is live.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel. It is currently blank in `.env.example`,
  so **every canonical, OG tag and schema URL depends on that fallback.**

**Accept:** `grep -rn "complianceincheck\|amitmodi\.com" app components lib`
returns nothing. Exactly one `SITE_URL` definition exists in the repo.

### 1.3 Article + FAQ schema on the 22 blog posts
**Points 2, 5, 9**

`app/insights/[slug]/page.tsx` emits **no structured data at all**. Guides emit
`ArticleSchema`; insights emit nothing. Neither emits `FAQPage`.

- Add `ArticleSchema` to `app/insights/[slug]/page.tsx`.
- Add `FAQPageSchema` to both insights and guides where frontmatter carries FAQs.
- Add `BreadcrumbListSchema` to both.

**Accept:** every `/insights/*` and `/guides/*` URL returns `Article` +
`BreadcrumbList` JSON-LD. Validate with Google's Rich Results Test.

---

## PHASE 2 — Entity & answer-engine surface (GEO / AEO)

This is the site's strongest existing asset. `llms.txt`, `llms-full.txt`,
`AnswerBlock` and speakable schema already exist — ahead of most practice sites.

### 2.1 Entity schema — scoped to what is true
**Point 1**

- Add `LegalService` **only if** Gate 0 confirms enrolment. Otherwise
  `AccountingService` + `ProfessionalService` only.
- `Attorney` schema: **gated on `membershipNo`**. Follow the existing
  `LocalBusinessSchema` pattern — return `null` when the fact is absent.
- Add `sameAs` linking every verified external profile (GBP, directories,
  LinkedIn) — this is the strongest entity-disambiguation signal for LLMs.

**Accept:** no schema type asserts a credential absent from `data/brand.ts`.

### 2.2 Statutory Q&A architecture
**Points 2, 5, 6, 9** · new content under `content/blog/`

The single highest-leverage AEO move. Target the exact statutory queries
businesses type in a panic:

- Section 73 vs Section 74 CGST — what the difference means for the taxpayer
- Responding to a GST show-cause notice (DRC-01)
- Section 148 reassessment notices
- ITC reversal under Rule 42/43
- GSTR-2B vs books mismatch
- Appeal timelines and pre-deposit before the Appellate Authority
- Section 143(1) intimation vs 143(2) scrutiny

Each must open with a **40–50 word direct answer** in the existing
`AnswerBlock` component, followed by an ordered procedure and a table.

Tag with schema `about` / `mentions` pointing at the statute (Point 9).

**Accept:** each post opens with an `AnswerBlock` under 50 words; `FAQPage`
schema present; **no rate, deadline, fee or penalty figure appears unless
sourced and marked verified.** This is a YMYL topic — a wrong number is a real
harm, and the existing `VERIFY` discipline (53 markers) must be preserved.

### 2.3 Extend `llms.txt` / `llms-full.txt`
**Point 10** · `app/llms.txt/route.ts`

Currently lists 8 services and tools. Add: the statutory Q&A index, the glossary
(61 terms), the case studies (5), and a factual practice description.

**Accept:** `llms-full.txt` covers every indexable URL.

### 2.4 Case study repository
**Point 8** · `content/case-studies/` (5 exist)

Existing five are well-formed and anonymised. Extend the frontmatter to carry
the statutory section involved, and surface that in schema.

**Do not add outcome claims** (demands stayed, penalties waived) until Gate 0
confirms them and the §Advertising decision is made.

---

## PHASE 3 — Local dominance

The largest single gap. This is what "most recommended in the area" means.

### 3.1 `LocalBusiness` completion
**Points 11, 18** · needs Gate 0 lat/long + hours

Schema is written and self-suppressing — it emits nothing today. Supplying the
coordinates activates it. Add an embedded map on `/contact`.

### 3.2 Location pages
**Points 12, 14** · `content/cities/` — **exists and is EMPTY**, no route

`data/brand.ts:69` says `cities: []` with the comment *"add only cities you can
genuinely service"*. Honour that: the list comes from Amit, not from a map.

- Build the `app/[city]/` route + loader (none exists).
- Candidate corridor, **for Amit to confirm**: Suratgarh, Sri Ganganagar,
  Hanumangarh, Bikaner, Anupgarh.
- Each page: local statutory context, the relevant jurisdictional authority, the
  services offered there, and a local CTA.
- **Not** doorway pages. Each needs genuinely distinct content or it will be
  treated as spam and suppress the whole domain.

**Accept:** one page per confirmed city, ≥400 words unique, `LocalBusiness` +
`BreadcrumbList` schema, linked from the footer.

### 3.3 Review infrastructure
**Point 13** · gated on the §Advertising decision

`Review` and `AggregateRating` emitters do not exist (0 files). Only **one**
testimonial exists site-wide.

- Build the emitters, gated on real reviews.
- Never fabricate a review. Never mark up a review that is not publicly
  verifiable on its source platform — that is a manual-action risk.

---

## PHASE 4 — Depth & productisation

### 4.1 Credentials block
**Point 43, gated** · `/practice/principal`

Facts only: qualifications, enrolment number, years, areas of practice. No
success metrics until the §Advertising question is settled.

### 4.2 Service packaging
**Points 28–35** · `data/services.ts` (8 exist)

The strategy's bundles map onto existing services. Highest-intent additions:

- **GST Notice Response** (Point 30) — pairs with the Phase 2 Section 73/74 content
- **Global Trader Onboarding** (Point 28) — IEC + LUT + RCMC; `import-export-licence` exists
- **NGO / Trust Compliance** (Point 32) — 12A/80G; a case study already exists
- **Pre-Notice Health Check** (Point 23) — the strongest enterprise wedge

Each new service page inherits the existing `ServiceSchema` + `FAQPageSchema` +
`HowToSchema` treatment automatically.

### 4.3 Industry guides
**Point 34** · `content/guides/` (7 exist)

E-commerce sellers, real estate developers, textile exporters, manufacturers.

---

## NOT AGENT WORK — `HUMAN`

These are in the 50-point plan but cannot be done in this repository. Listed so
the implementing agent does not attempt them and so Amit knows they are his.

| Points | Work |
|---|---|
| 3, 15 | Directory citations, bar/chamber listings |
| 4, 42 | Press mentions, budget commentary |
| 10 | Medium / Substack distribution |
| 11 | Google Business Profile |
| 16 | Google Ads |
| 17, 38 | Expos, speaking slots |
| 19, 27 | ABM outreach, referral partnerships |
| 36, 39, 40, 41 | Newsletter, LinkedIn, webinars, book |
| 37 | FICCI / CII memoranda |
| 45, 47, 50 | Client portal, reminders, nurture — separate product, not this site |
| 49 | Video testimonials — filming |

---

## SEQUENCE

1. **Phase 1** — no dependencies, highest lead impact. Start here.
2. **Gate 0** — Amit confirms facts. Runs in parallel.
3. **§Advertising decision** — blocks reviews, metrics, ads.
4. **Phase 2** — after 1.2 (single `SITE_URL`).
5. **Phase 3** — after Gate 0 coordinates + city list.
6. **Phase 4** — last.

## STANDING RULES FOR THE IMPLEMENTING AGENT

1. **Never invent a tax rate, due date, penalty, fee, threshold or section
   number.** Tax is YMYL. Unverified facts ship as `null` / `verified: false`.
2. **Never assert a credential** not present in `data/brand.ts`.
3. **Preserve the self-suppressing schema pattern** — emitters return `null` on
   missing data rather than emitting placeholders.
4. **No doorway pages.** A location page without distinct local substance harms
   the whole domain.
5. **Never fabricate a review, rating, client count or outcome.**
6. Run `npx tsc --noEmit`, `npx eslint`, and `npx next build` before every commit.

---

# PART B — COMPETING WITH A2Z TAXCORP

Added 2026-08-14 after a measured scan of `a2ztaxcorp.com` (CA Bimal Jain), the
category leader in Indian indirect tax.

## What they actually are

Not a practice website. **A tax news wire with a consultancy attached.** Their
category list is the whole model: `gst-case-update`, `income-tax-case-update`,
`cbic-news`, `notification-and-circular`, `cbdt-notification`,
`gst-portal-updates`, `press-release`. They summarise every judgment, circular,
portal change and council decision, daily.

| | A2Z Taxcorp | Amit Modi & Co. |
|---|---|---|
| Posts | **16,944** | 22 |
| Static pages | 5 | 25 routes |
| Calculators | **0** | **5** |
| Schema types emitted | 7 | **10** |
| `llms-full.txt` | ✗ | ✓ |
| Location pages | 0 | 0 |
| Named credentialed principal | ✓ | `TBD` |
| Platform | WordPress | Next.js |

## The strategic call

**Do not try to out-publish them.** 16,944 posts is a full-time newsroom built
over years. Chasing it burns the budget producing content nobody links to.

They are also a different business — national indirect-tax advisory, publishing
and training, 30 years deep. Amit is a regional practice. "Compete" here means
*take specific ground*, not match them everywhere.

### Where they are structurally weak — fight here

1. **Local.** Delhi + Guwahati, national positioning, **zero location pages**.
   Nobody owns the Suratgarh / Sri Ganganagar / Hanumangarh / Bikaner corridor.
2. **Tools.** They publish *about* tax. They compute nothing. Our five
   calculators are a category they have entirely ignored.
3. **Answer engines.** Their schema is thin — no `FAQPage`, no `HowTo`, no
   `Service`, no `LocalBusiness`, no speakable. Their `llms.txt` is an
   auto-generated post dump, not a curated entity description.
4. **Conversion.** Their `/newsletter/` page is **broken** — it renders the raw
   WordPress shortcode `[newsletter]` instead of a signup form.

### What to copy — pure upside, low cost

**B1. Make Amit a person, not a placeholder** · `/practice/principal`
Bimal Jain states plainly: ICAI member since May 1994, ICSI since 2006, LLB,
30+ years in indirect tax. Amit's `membershipNo`, `qualifications`,
`barAdmissions` and `yearsPractice` are all `TBD`. **This is the single largest
credibility gap and it costs one afternoon of Amit's time.** Gate 0 blocks it.

**B2. Owned distribution** · `HUMAN` + code
They have YouTube, a WhatsApp channel, webinars and a newsletter. We have none.
Cheapest first move: a **WhatsApp channel** plus a **weekly digest**. Code side
is a subscribe surface + archive route; the writing is Amit's.

**B3. A weekly statutory digest, not a daily wire** · `content/blog/`
One post per week summarising what changed — matched to a solo practice's
capacity. Do not attempt daily. Consistency beats volume for a regional player.

**B4. A product, not only services** (later)
Their book and paid update package create recurring revenue. Not a phase-one
move, but it is the eventual answer to "how does a practice scale past hours".

---

# PART C — THE ₹2,000 META CAMPAIGN

## Set expectations honestly

₹2,000 is a **test budget**. It buys one validated answer — which message makes
a local business owner contact Amit — not a client pipeline. Do not split it
across audiences, geographies or creatives; you will learn nothing from any of
them. One campaign, one ad set, one landing page.

Do not forecast leads, cost per lead or ROI from this. Nobody can, and any
number quoted before the test is invented.

## HARD PREREQUISITE — do not spend a rupee before this

**The calculators currently have zero call-to-action** (Phase 1.1). Sending paid
traffic to them today means paying for visitors who land on a dead end. Phase
1.1 ships first. Non-negotiable.

## C1. Meta Pixel — code

- Install the Meta Pixel via `next/script` with `strategy="afterInteractive"`,
  in `app/layout.tsx`, ID from `NEXT_PUBLIC_META_PIXEL_ID`.
- **Must not hardcode the ID.** Absent env var = no script rendered.
- Verify against the Phase-20 CSP — `connect.facebook.net` and
  `www.facebook.com` need allowing, or the Pixel silently fails in production
  and works in dev. This exact class of bug already bit the Draco decoder.
- Fire `Lead` on WhatsApp click and on consultation submit.
- Add a cookie-consent gate if targeting anyone in the EU. For India-only
  targeting, DPDP Act notice requirements still apply — put it behind consent.

**Accept:** Pixel absent from HTML when the env var is unset; `Lead` fires on
both actions; no CSP violations in the console.

## C2. Campaign structure

| | |
|---|---|
| Objective | Traffic → site (they want it connected to the website) |
| Geography | **One** — Suratgarh + surrounding radius. Not all of Rajasthan |
| Landing page | `/tools/late-fee-calculator` — highest pain, clearest next step |
| Placements | Automatic |
| Creative | 3 variants of **one** hook, not 3 different hooks |

**Why the late-fee calculator:** somebody computing a GST late fee is in active
financial pain at that exact moment. That is the warmest traffic available, and
it is a page we already have.

## C3. The funnel

```
Meta ad  →  late-fee calculator  →  "have this reviewed"  →  WhatsApp  →  consultation
```

Every step already exists except the CTA, which is Phase 1.1.

## C4. What Amit must supply — `HUMAN`

- A Facebook **Page** for the practice (ads cannot run without one)
- A **Meta Business Suite** account with the Page attached
- An **ad account** with an Indian payment method
- The **WhatsApp Business number** the ad should route to
- Written approval of the ad copy — see the compliance note below

## C5. COMPLIANCE — read before spending

Paid advertising is the item that collides hardest with Bar Council conduct
rules (see the advertising constraint in Part A). If Amit is an enrolled
Advocate, running Meta ads soliciting legal work is squarely the restricted
behaviour.

**The safe framing, for Amit to confirm with his own counsel:**
- Advertise the **free tool** and the **firm's compliance services** — not
  "hire this advocate".
- Ad copy should offer a calculation and a review, not promise an outcome.
- No superlatives, no success rates, no "best".

## C6. What success looks like at ₹2,000

Not clients. **A validated or invalidated hook**, plus the Pixel audience data
to retarget later. Judge it on whether anyone messages, and what they say — not
on revenue. If the hook works, that is when a real budget is justified.

