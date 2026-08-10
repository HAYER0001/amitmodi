# Design audit — Amit Modi & Co.

Reviewed against the built site, not the plan. Every finding below was observed
on a rendered page. Ordered by how much each one costs in leads, not by how
hard it is to fix.

**Framing:** the visitor is not browsing. They have a notice, a deadline, or a
registration they've never done before. They are anxious, they don't know the
vocabulary, and they are deciding in about eight seconds whether this practice
is competent. Every finding is judged against that, not against taste.

---

## A. What is genuinely working

Stated briefly so the rest is readable in context.

- **The homepage poster.** Type filling the frame with the knight cutting
  through it is a real composition, and it does the one job a hero has: it makes
  the practice look considered before a word is read.
- **Answer-first structure on service pages.** The direct answer sits above the
  marketing. This is correct for both anxious readers and AI extraction.
- **The calculator shows its working.** `₹10,000 × 18%`, then the CGST/SGST
  split explained underneath. Anyone can output a number; showing the arithmetic
  is a competence display, and competence is the entire product here.
- **Honest disclaimers.** "Indicative only — not tax advice" in `--stamp`.
- **Absence is handled properly.** No fake testimonials, no invented stats.

---

## B. Critical — costs leads directly

### B1. Green means three different things
`--seal` is used for headlines, for links, **and** for the CTA. When everything
green is clickable, a green headline becomes a false affordance — the eye is
drawn to it, the hand goes to click, nothing happens. That micro-frustration
repeats on every page.

Worse in the other direction: the underlined-text CTAs I introduced now look
exactly like body links. The primary action no longer reads as an action.

**Fix:** headlines keep `--seal`. Inline links become `--ink` with a `--seal`
underline. The primary CTA gets one visual property nothing else has — a solid
`--seal` fill. Reserve it, then use it exactly once per screen.

> I over-corrected earlier. Killing the filled pill fixed the "SaaS template"
> feel and broke the affordance. The pill was wrong in the *header*, next to
> plain nav; it is right as the single primary action on a page.

### B2. There is not one human face on the site
Ink drawings, a chess piece, a rubber stamp. No photograph of Amit anywhere.

Faces are the strongest trust signal available, and for a regulated professional
service the effect is not marginal. A visitor about to hand over their PAN, bank
statements and a tax notice is asking one question — *is there a real, competent
person behind this?* The site currently answers "there is a beautiful brand."

**Fix:** one real photograph, on the principal page and in the footer.
*(Needs Amit — but it is the highest-value single asset on the list.)*

### B3. The disclaimer sits above the calculator
It primes doubt before the tool is used. Anxiety is already the visitor's
default state; leading with a warning deepens it at the exact moment you want
them to feel capable.

**Fix:** move it directly beneath the result. Same words, same prominence — it
then reads as professional care about a number they already have, rather than a
hedge about a number they haven't got yet.

### B4. Calculator pages are orphaned from the design system
The GST calculator has no paper texture, no ledger grid, no marginalia, no
collage, and its `h1` is small grey `--ink` while service pages carry huge
`--seal` display type. Three different `h1` treatments now exist across the
site.

These are the pages that will pull the most search traffic once the rates are
verified. A visitor arriving from Google lands here *first* — and this is the
weakest-looking page on the site.

**Fix:** the `ServiceHero` treatment, applied to `CalculatorShell`.

---

## C. Serious — costs credibility

### C1. Inconsistent heading scale
Homepage `--t-display` centred · service pages `--t-display` left · calculators
roughly `--t-h2` · articles somewhere between. A reader cannot learn the
system, so nothing feels authored.

**Fix:** two levels only. Landing pages get display; interior pages get h1. No
third size.

### C2. Body copy switches between roman and italic without meaning
The homepage subhead is italic, service one-liners are italic, calculator intros
are roman. Italic currently signals nothing.

**Fix:** italic means *editorial voice* (the practice speaking). Roman means
*instruction*. Pick per block and hold it.

### C3. Dead space right of the calculator result
The result panel ends and roughly 40% of the viewport height below it is empty
on desktop. Empty space reads as unfinished unless it is obviously deliberate.

**Fix:** the "when you need a professional" block — already written — moves into
that column. It is also the conversion bridge, so this fixes composition and
commerce at once.

### C4. `--brass` is effectively unused
A defined palette colour appearing almost nowhere. It was specified for
credentials and trust marks, which is exactly the content that does not exist
yet (B2).

**Fix:** deploy with the credentials bar, or cut it from the palette. An unused
token is a decision nobody made.

### C5. Marginalia density does not adapt to page type
18 on the homepage, 9 on service pages, 0 on calculators, 0 on articles. There
is no rule, so it reads as inconsistency rather than as rhythm.

**Fix:** state it as a rule — landing pages 12–18, interior pages 6–9,
tool/utility pages 4, long-form articles 0 (they must not compete with reading).

---

## D. Refinement — costs polish

- **D1.** Header nav is 6 items plus a dropdown plus a CTA plus a theme toggle —
  9 targets. At the density a tax visitor needs, "Guides" and "Insights" are the
  same promise. Merge them.
- **D2.** The N/S scroll rail is decorative and unlabelled. On the reference it
  reads as a compass; here it reads as an artefact. Either explain it or drop it.
- **D3.** The live clock is precise to the minute and updates every 30s. Nothing
  on the page is time-sensitive, so it draws the eye to no purpose. A date alone
  would carry the editorial signal without the tick.
- **D4.** Cut-outs sit at low opacity against paper and read as smudges at small
  sizes rather than as objects. Raise contrast or size them up.
- **D5.** Ambient drift runs on marginalia and cut-outs but not the 3D model's
  container, so the knight is the only static element in a moving field.
- **D6.** Focus rings are correct but identical everywhere. On a long form,
  a stronger ring on the *current step* would aid orientation.
- **D7.** No visited-link state anywhere. On a 60-entry glossary and a 12-post
  archive, a reader cannot see where they have been.

---

## E. The plan

Ordered by lead impact per hour of work. **Nothing here needs Amit except E4.**

### Round 1 — half a day
1. **Restore the primary CTA fill** and split link colour from heading colour (B1)
2. **Move the calculator disclaimer** below the result (B3)
3. **Apply the design system to `CalculatorShell`** — five pages at once (B4)

### Round 2 — one day
4. **Lock the heading scale** to two levels sitewide (C1)
5. **Move the "when you need a professional" block** into the empty column (C3)
6. **Codify marginalia density** per page type (C5)
7. **Fix italic/roman** to mean something (C2)

### Round 3 — half a day
8. Merge Guides into Insights (D1)
9. Drop or label the scroll rail (D2); date instead of clock (D3)
10. Raise cut-out contrast (D4); add visited-link states (D7)

### Round 4 — needs Amit
11. **Photograph** → principal page + footer (B2)
12. **Credentials + enrolment number** → activates `--brass` (C4)

---

## F. The one thing I would change first

**B1 — the green.** It is the cheapest fix on the list and it touches every
page, every session, every visitor. Right now the site's most important element
— the button that turns a reader into an enquiry — looks identical to a
paragraph link. Everything else here is craft. That one is revenue.
