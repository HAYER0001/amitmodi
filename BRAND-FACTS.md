# BRAND-FACTS.md — Single Source of Truth

> **STOP. Fill this in before Phase 3.**
> Every AI agent is forbidden from inventing anything on this page.
> Wrong data here becomes wrong `LocalBusiness` schema, wrong Google Business Profile
> matching, and wrong AI-search answers about your client. That directly costs leads.
>
> Anything you genuinely don't know yet: write `TBD` — never guess.
> Agents must render `TBD` fields as hidden/omitted, never as placeholder text on the live site.

---

## 1. Legal identity

| Field | Value |
|---|---|
| Trading name (exact, as it should appear everywhere) | **Amit Modi & Co.** |
| Full legal entity name | `TBD` |
| Entity type (Proprietorship / Partnership / LLP / Pvt Ltd) | `TBD` |
| Year established | `TBD` |
| Firm registration no. (if any) | `TBD` |
| GSTIN | `TBD` |
| PAN (firm) | `TBD` |
| Domain to be purchased/used | `TBD` |

## 2. Practitioner credentials — drives E-E-A-T and `Person` schema

| Field | Value |
|---|---|
| Principal's full name | **Amit Modi** *(confirm spelling)* |
| Designation (CA / Advocate / Tax Consultant / CS) | **Advocate** *(confirm — see guardrail below)* |
| Membership no. (ICAI / Bar Council / ICSI) | `TBD` |
| Years of practice | `TBD` |
| Qualifications (B.Com, LL.B, FCA…) | `TBD` |
| Bar / tribunal admissions (for appeals work) | `TBD` |
| LinkedIn URL | `TBD` |
| Other partners / team (name, role, credential) | `TBD` |

## 3. Contact & location — drives `LocalBusiness` schema and Maps ranking

**NAP consistency rule:** the Name, Address and Phone written here must match your Google
Business Profile *character for character*. Mismatches split your local ranking signal.

| Field | Value |
|---|---|
| Office address line 1 | **Modi Complex, Near Mosque** |
| Address line 2 | **Ward No. 40** |
| City | **Suratgarh** |
| State | **Rajasthan** |
| PIN code | **335804** |
| Country | India |
| Latitude, Longitude | `TBD` |
| Primary phone (with +91) | **+91 94145 04617** |
| WhatsApp number | `TBD` |
| Public email | `TBD` |
| Google Business Profile URL | `TBD` |
| Office hours (per day) | `TBD` |

## 4. Service area — drives the multi-city pages in Phase 18

> Only list cities where you can genuinely take on and service a client.
> Fake city pages are thin content and get filtered out of search.

| Field | Value |
|---|---|
| Primary city | **Suratgarh** |
| Secondary cities (real ones only) | `TBD` |
| States covered for GST | **Rajasthan** |
| Remote/pan-India services? | `TBD` |

## 5. Commercials — drives the pricing-transparency sections

For each service: government fee, professional fee, turnaround. Write `On request` where
you don't want a public number, but never invent a number.

| Service | Govt. fee | Professional fee | Turnaround |
|---|---|---|---|
| PAN card (new/correction) | `TBD` | `TBD` | `TBD` |
| GST registration | `TBD` | `TBD` | `TBD` |
| GST returns (monthly) | `TBD` | `TBD` | `TBD` |
| GST returns (annual/9C) | `TBD` | `TBD` | `TBD` |
| ITR filing (individual) | `TBD` | `TBD` | `TBD` |
| ITR filing (business) | `TBD` | `TBD` | `TBD` |
| TDS returns (quarterly) | `TBD` | `TBD` | `TBD` |
| Partnership firm registration | `TBD` | `TBD` | `TBD` |
| Society registration | `TBD` | `TBD` | `TBD` |
| Trust registration (+12A/80G) | `TBD` | `TBD` | `TBD` |
| Joint venture drafting | `TBD` | `TBD` | `TBD` |
| IEC / Import-Export licence | `TBD` | `TBD` | `TBD` |
| Income Tax appeal (CIT-A) | `TBD` | `TBD` | `TBD` |
| GST appeal | `TBD` | `TBD` | `TBD` |

## 6. Proof assets — the highest-leverage SEO input you can supply

| Field | Value |
|---|---|
| No. of clients served (real figure) | `TBD` |
| No. of returns filed to date | `TBD` |
| Appeals won / matters represented | `TBD` |
| 3–5 real case studies (situation → action → result, anonymised) | `TBD` |
| Real client testimonials + consent to publish | `TBD` |
| Accreditation logos you may legally display | `TBD` |
| Existing Google reviews count & rating | `TBD` |

## 7. Assets on hand

| Field | Value |
|---|---|
| Existing logo file? | `TBD` |
| Photos of principal / team / office? | `TBD` |
| Existing website URL (for 301 redirect map) | `TBD` |
| Existing social profiles | `TBD` |

---

## ⚠️ Advertising-rules guardrail — read once, decide once

If the principal is an **ICAI member (Chartered Accountant)**, the ICAI Council Guidelines
restrict solicitation and advertising. Publicly displayed testimonials, client logos,
comparative superlatives ("best CA in the city"), and some forms of paid promotion can be
professional-misconduct exposure. The rules are materially looser for a **tax consultant,
advocate, or LLP** that is not holding out as a practising CA.

Tick the one that applies before Phase 13 (Trust & Social Proof) runs:

- [ ] Practising CA under ICAI → **conservative mode**: no testimonials, no client logos, no
      superlatives, no "best/cheapest/guaranteed". Use factual capability statements only.
      Rankings still come from the SEO/GEO layers, which are unaffected.
- [x] **Advocate under Bar Council** ← the Google Business Profile title says "Advocate",
      so this is the assumed position until confirmed otherwise. Bar Council of India
      Rule 36 (Chapter II, Part VI) restricts advocates from soliciting work or advertising.
      An amendment permits furnishing basic website particulars — name, address, telephone,
      email, enrolment number, and areas of practice — but **comparative and superlative
      claims are not covered by that permission**. Verify the current position with the
      Rajasthan State Bar Council before publishing anything promotional.
      → `ADVERTISING_MODE` stays `'conservative'`.
- [ ] Tax consultant / LLP / not a regulated-body member → **standard mode**: full trust
      layer, testimonials, case studies, badges.

### Note on the Google Business Profile title

The listing reads **"Amit Modi & Co. | The Best Tax & GST Advisor Advocate"**.

The site uses **"Amit Modi & Co."** as the name and a factual descriptor
(*"Tax, GST and compliance practice"*) rather than reproducing the "Best …" phrasing,
for two independent reasons:

1. **Rule 36 exposure.** "Best" is precisely the kind of comparative claim an advocate's
   advertising restrictions target. Your GBP listing is your decision; the website is a
   more visible, more permanent publication.
2. **It is weak SEO.** No one searches "best tax advisor advocate". They search
   *"GST registration Suratgarh"*, *"income tax notice reply Rajasthan"*, *"IEC code
   Sri Ganganagar"*. Keyword-stuffed superlatives in a business name are also against
   Google Business Profile's own naming guidelines and can get a listing suspended —
   the name field is supposed to be the real-world business name only.

If you want the superlative on the site anyway, say so and it goes in — it is your
practice and your call. This is flagged once, not repeatedly.

**Every agent must read this checkbox before writing any promotional copy.**
The build works either way — conservative mode swaps testimonials for anonymised
outcome data and credential statements, which AI search engines cite just as happily.
