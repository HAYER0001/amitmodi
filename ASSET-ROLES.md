# Which asset does which job

Every asset has **one** role. Two assets doing the same job is what makes a
collage read as decoration; one asset per job is what makes it read as a system.

---

## 1. The notes (marginalia) — the paper itself

40 real statute references — `Sec 44AB`, `GSTR-3B`, `Form 26AS`, `u/s 139(1)` —
scattered as pencil annotation.

**In the reference, the chess notation is on every screen of the scroll.** It is
not an accent on the hero; it is what the page is made of. Eight of our pages had
none at all, which is why they read as a plainer site even after their headings
were fixed.

Density is now a rule, not a per-page guess:

| Density | Count | Pages | Reasoning |
|---|---|---|---|
| `landing` | 12 | homepage | The page *is* the message |
| `interior` | 8 | services, practice, guides, insights, case studies | Content leads, texture supports |
| `utility` | 5 | tools, contact, calendar, glossary | Someone is doing a task here |
| `reading` | 0 | articles, guide bodies | Nothing competes with running text |

Every page uses a **different seed** (3, 11, 13, 17, 19, 23, 29, 31, 37), so no
two pages share a scatter. Repeated placement is what makes texture look like a
template.

Set once, per page, via `<PageAtmosphere density="…" seed={…} />`.

---

## 2. The objects (cut-outs) — one per page, never repeated on the same screen

Each carries a specific idea. They are chosen for meaning, not for looks.

| Object | Lives on | The idea |
|---|---|---|
| `cut-brass-seal` | Practice page · hero 3D fallback | Authority, the stamp of approval |
| `cut-rupee-500` | The Problem | What non-compliance costs, stated plainly |
| `cut-rupee-crumpled` | Closing CTA (25% opacity) | Money already lost — texture, not object |
| `cut-coin-stack` | Homepage hero | Accumulation; the money being protected |
| `cut-revenue-stamp` | The Problem · compliance calendar | The official act, the deadline |
| `cut-rubber-stamp` | Service heroes · contact | Approval granted — the outcome being sought |
| `cut-paperclip` | Homepage hero · insights | Papers held together; the practice's actual job |
| `cut-file-folder` | Homepage hero · case studies | A matter, a case, a client's file |
| `cut-calculator` | Tools index | The page about calculators |
| `cut-ledger-book` | Guides · practice | The long record; permanence |

---

## 3. The figures (ink drawings) — people, and only where a person is meant

All twelve are real situations, never generic stock poses.

| Figure | Lives on | Who they are |
|---|---|---|
| `fig-shopkeeper` | GST registration | The business that crosses the threshold first |
| `fig-consultant` | PAN card services | Someone mid-task, between meetings |
| `fig-founder` | Entity formation | Choosing a structure for the first time |
| `fig-accountant-desk` | Income tax & TDS returns | Records before a deadline |
| `fig-couple-shop` | GST returns filing | The partnership firm, two people |
| `fig-worried` | Income tax appeals · hero · bridge copy | The notice has arrived |
| `fig-restaurateur` | GST appeals | Daily-compliance business in dispute |
| `fig-exporter` | Import & export licence | Cross-border, documents in hand |
| `fig-textile-trader` | Services index | The archetypal visitor to that page |
| `fig-handshake` | The Proof | The engagement beginning |
| `fig-relieved` | Bridge copy (inline) | The resolution — carries the sentence's turn |
| `fig-walking-row` | Footer strip | The clientele, walking past |

**All 8 services now map to a distinct figure.** Two previously shared
`fig-worried`, which made two different services look like the same page.

---

## 4. The surfaces — structure, not ornament

| Surface | Job |
|---|---|
| `tex-torn-edge` | `TornDivider`, where the homepage changes register from paper to paper-deep. Every section previously met on an identical 1px hairline. |
| `tex-ink-blot` | Behind the `AnswerBlock` at 18%, and on the glossary. The one block on a service page where a reader actually stops. |

---

## 5. The documents — evidence

| Asset | Job |
|---|---|
| `spread-*` (6) | One per panel in the horizontal services gallery, cycling. The reference's book-spread section. |
| `cover-*` (4) | Guide cards lead with their cover, matched by slug with an index fallback so a fifth guide reuses one rather than leaving a hole. |

---

## 6. Social and icons

| Asset | Job |
|---|---|
| `og-default` | Every page's share card |
| `og-service` | Service pages specifically |
| `favicon-src`, `apple-touch` | **Build sources only.** Next.js serves `app/icon.png` and `app/apple-icon.png`, generated from these. They will never appear in a component, and an unused-asset audit should not flag them. |

---

## Rules that keep this a system

1. **One job per asset.** If two assets do the same job, one is redundant.
2. **Never two objects on the same screen** unless the second is under 30%
   opacity and reading as texture.
3. **Notes never touch the copy.** `PageAtmosphere` carries a keep-out
   rectangle; on the service pages this had to learn that when the zone reaches
   the left edge there is no room on that side.
4. **Long-form reading gets nothing.** Articles and guide bodies are `reading`
   density — zero. A note beside a paragraph someone is trying to read is not
   texture, it is interference.
5. **Different seed per page.** Same seed twice is a visible repeat.
