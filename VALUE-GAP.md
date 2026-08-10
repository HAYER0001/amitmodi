# Why this doesn't look like ₹2,00,000 yet — and what closes the gap

Written bluntly, because a polite version of this is useless to you.

---

## 1. The honest assessment

**The tool is right about what it can see, and wrong about what was built.**

An automated analyser looks at rendered pages. It sees an editorial homepage and
32 plainer pages, and prices that at freelancer tier. Fair.

What it cannot see, and what genuinely is agency-tier work:

| Built | Why it's not visible |
|---|---|
| GEO layer — `llms.txt`, `llms-full.txt`, markdown mirrors, AI-crawler content negotiation | Invisible to humans and to the analyser. Almost no Indian tax practice has this. |
| Full Schema.org layer — Service, LocalBusiness, Person, FAQ, HowTo, BreadcrumbList | Renders as JSON-LD in `<head>` |
| 5 calculators with tested pure-function cores | **Switched off** — showing "rates pending verification" |
| 8 deep service pages, 12 articles, 4 guides, 60 glossary entries | Real, but visually plain |
| Custom 3D pipeline (Tripo → Meshopt → R3F, 673 KB, CSP-safe) | One object on one page |
| Custom asset pipeline (Gemini → Swift alpha-keying → optimise; 342 MB → 23 MB) | Invisible by definition |
| Multi-step form, server validation, rate limiting, honeypot, Google Sheets mirror | **Not wired to a key — currently drops every enquiry** |

**So the real problem is not that too little was built. It is that what was built
is switched off, unverified, or only skin-deep on one page.**

---

## 2. The four things that make it look cheap

### 2.1 The homepage is a different website from the other 32 pages
This is the single biggest reason it reads as freelancer work. Someone lands on
a striking editorial homepage, clicks "GST Registration", and arrives somewhere
that looks like a competent Bootstrap template. That drop is more damaging than
if the homepage had been plain all along, because it announces that the quality
was a veneer.

**Fix:** extend the design system — the poster type scale, marginalia, cut-outs,
scroll scrubbing — to the service pages, tools, guides and glossary.
**Effort: 3–4 days. Highest visual return of anything on this list.**

### 2.2 The calculators are dark
Five working calculators with tested arithmetic, all displaying "rates pending
verification" because every rate in `data/tax-rates.ts` is `null`. These are the
highest-ROI pages on the site — they attract links, rank for hundreds of
long-tail queries, and get cited by AI engines. Right now they are dead weight.

**Fix:** Amit fills the current GST slabs, TDS rates and late-fee rules and flips
`verified: true`. **Effort: 2 hours of his time.** Nothing I can do for him —
publishing a guessed tax rate is a professional liability, which is exactly why
they ship `null`.

### 2.3 There is no proof anywhere
Zero case studies, zero testimonials, no client count, no years-in-practice, no
Bar enrolment number, no photograph. Correctly gated — I refuse to invent them —
but the consequence is a site that asks for trust and offers none.

**Fix:** one real photograph, the enrolment number, and three anonymised case
studies with written consent. **Effort: an afternoon with Amit.**

### 2.4 It cannot receive a lead
`RESEND_API_KEY` is unset. A visitor fills the form, sees a success message, and
**the enquiry vanishes silently.** This is not a polish gap. The site's entire
commercial function is currently dead.

**Fix: 10 minutes.** It is the first thing on the list for a reason.

---

## 3. The plan to make it worth what you charged

### Week 1 — make it earn (nothing here is optional)
| # | Task | Owner | Time |
|---|---|---|---|
| 1 | Resend key → form actually delivers | you | 10 min |
| 2 | Real email, office hours, lat/long | Amit | 20 min |
| 3 | Verify GST slabs + TDS rates → calculators go live | Amit | 2 hrs |
| 4 | Google Sheets lead capture (`GOOGLE-SHEETS-LEADS.md`) | you | 15 min |
| 5 | Google Business Profile claimed, NAP exact, 10 photos | Amit | 1 hr |
| 6 | Search Console + Bing, submit sitemap | you | 20 min |

### Week 2 — make it look like the price
| # | Task | Time |
|---|---|---|
| 7 | Extend the design system to all 8 service pages | 2 days |
| 8 | Same for tools, guides, glossary, contact | 1.5 days |
| 9 | Place the 17 unused assets | half day |
| 10 | Principal page: photo, credentials, real bio | half day |

### Week 3 — make it convert
| # | Task | Time |
|---|---|---|
| 11 | 3 real case studies, consent obtained | Amit + you |
| 12 | WhatsApp button (converts far better than a form in India) | 2 hrs |
| 13 | Clear the 625 VERIFY markers — rates and dates first | Amit, ongoing |
| 14 | 10 Google reviews from past clients | Amit |

---

## 4. Honest expectations on leads

**The website will not be what gets him his first clients. The Google Business
Profile will.**

For a local professional practice in Suratgarh, the realistic order of impact:

1. **Google Business Profile + reviews** — most of the first 3 months' leads
2. **WhatsApp** — Indian small-business owners message; they don't fill forms
3. **The calculators** — once live, these pull the long-tail search traffic
4. **The GEO layer** — the genuine differentiator, but it compounds over 3–6
   months, not weeks
5. **The editorial design** — does not generate traffic. It converts the traffic
   the others bring, and it makes a ₹25,000 fee feel reasonable instead of steep

Anyone promising "100 leads from the website" in month one is selling something.
What this site does is make sure that when someone in Sri Ganganagar district
searches "GST notice reply" at 11pm, Amit is the answer they find and the one
they trust enough to call.

**Timeline to steady inbound: 3–4 months, if weeks 1–3 above actually happen.**
The site is a multiplier on the Google Business Profile, not a replacement for it.

---

## 5. What I'd tell you if you were my client

You charged ₹2,00,000 and the work is currently at maybe ₹90,000 of *delivered*
value — not because too little was built, but because the last 20% that makes it
real is unfinished: the form doesn't deliver, the calculators are dark, 32 pages
look half-finished, and there is no proof on the site.

That last 20% is roughly **6–8 working days** of my time plus **half a day of
Amit's**. Do that and the delivered work genuinely sits in the ₹1.5–3 lakh
boutique-agency band the tool describes — because the GEO layer, the tested
calculators, the schema depth and the custom asset pipeline are things a
₹45,000 freelancer does not build.

Do not ship it as it stands. A client who sees the current state will price it
the way that tool did, and they will be right to.
