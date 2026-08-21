# Go-Live Checklist — why the site gets no leads, and how to fix it

The site is live, technically sound, and invisible. This is the ordered list of
what is unfinished and exactly how to finish it.

Diagnosed 2026-08-15 against the live deployment.

## What is NOT the problem

Ruled out by measurement, so nobody wastes time here:

- **Indexability** — `robots.txt` allows Googlebot, Bingbot and every AI crawler
  (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot). Sitemap returns 200 with
  **158 URLs**. Canonical and `index, follow` are correct.
- **Content** — 25 articles, 61 glossary terms, 8 services, 7 guides,
  5 case studies, 5 calculators, all published.
- **Deployment** — the live build is current.
- **Structured data** — richer than the category leader's.

The site is built. It is not *connected to anything*.

---

# STEP 1 — Leads had nowhere to go  ⚠️ THE BIGGEST ONE

**Symptom:** somebody fills the consultation form and sees an error. Nothing is
recorded. You never know they tried.

**Cause:** `app/api/consultation/route.ts` throws when `RESEND_API_KEY` is
absent, returns early, and the enquiry is abandoned. It is absent in production.

**Already fixed in code:** the lead is now written to the spreadsheet *before*
the email is attempted, so a misconfigured mailbox costs a notification, never
the enquiry. But you still need the two settings below or nothing is delivered.

### 1a. Resend (email delivery)
1. Sign up at **resend.com** (free tier is enough to start).
2. **API Keys → Create API Key.** Copy it.
3. In **Vercel → your project → Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = the key
   - `CONTACT_TO_EMAIL` = the inbox Amit actually reads
4. Redeploy.
5. **Test it yourself**: submit the form on the live site and confirm the email
   arrives. Do not skip this.

### 1b. Google Sheet mirror (the safety net)
Even with email working, this guarantees no lead is ever lost.
1. Create a Google Sheet.
2. **Extensions → Apps Script**, publish as a **Web App** ("Anyone" access).
3. Add to Vercel: `SHEETS_WEBHOOK_URL` and `SHEETS_SHARED_SECRET`.

---

# STEP 2 — WhatsApp is switched off

**Symptom:** on a phone the only way to make contact is a form. In India, for a
local practice, that is the wrong ask — WhatsApp is how people actually enquire.

**Cause:** `data/brand.ts` line 52 reads `whatsapp: 'TBD'`. `ToolCta` and the
contact page deliberately hide the WhatsApp button until the number is
confirmed, so it renders nowhere.

**Fix:** confirm whether **+91 94145 04617** takes WhatsApp. If yes, set it. If
Amit prefers a separate WhatsApp Business number, use that.

One line of data turns on the WhatsApp path across the whole site.

---

# STEP 3 — No Google Business Profile  ⚠️ BIGGEST LOCAL MISS

For a local practice this is where most leads come from — more than the website.
Somebody in Suratgarh searching "GST consultant near me" sees the map pack. If
there is no profile, Amit does not exist in that search.

1. Go to **business.google.com** → Add your business.
2. Name: **Amit Modi & Co.** (not the "Best…" version — see Step 7).
3. Category: primary **Tax Consultant**; secondary **Accountant**,
   **Tax Preparation Service**.
4. Address: Modi Complex, near mosque, Ward no 40, Suratgarh, Rajasthan 335804.
5. Phone: +91 94145 04617. Website: the live URL.
6. **Verify** (postcard or phone). Nothing ranks until verified.
7. Add hours, services, and photos of the actual office.
8. Put the profile URL into `data/brand.ts` → `gbpUrl`.

Then get the **latitude and longitude** from the map pin and set `lat` / `lng`
in `data/brand.ts`. `LocalBusinessSchema` returns `null` without them, so the
site currently emits no local schema at all.

---

# STEP 4 — Buy the real domain

`amitmodi-one.vercel.app` has no domain authority and reads as unfinished to a
business owner deciding whether to trust Amit with a tax notice.

1. Buy **amitmodi.co.in**.
2. Vercel → Settings → Domains → add it, set as primary.
3. Point the registrar's DNS at Vercel.
4. Set `NEXT_PUBLIC_SITE_URL` to `https://amitmodi.co.in` in Vercel.
5. Redeploy. Every canonical, OG tag and schema URL follows automatically.

---

# STEP 5 — Tell Google the site exists

New sites are not crawled promptly on their own.

1. **Google Search Console** → add the property (do this *after* Step 4).
2. Verify via DNS.
3. **Sitemaps → submit** `sitemap.xml`.
4. **URL Inspection → Request Indexing** on the homepage and the top 5 services.
5. Repeat in **Bing Webmaster Tools** — it feeds ChatGPT search.

---

# STEP 6 — Facts that are still blank

`data/brand.ts` still carries these. Each one is invisible on the site until
filled, by design — nothing is ever invented.

| Field | Why it matters |
|---|---|
| `email` | Lead delivery, contact schema |
| `whatsapp` | Step 2 |
| `lat` / `lng` | Local schema, map pack |
| `hours` (all 7 days) | Shown on GBP and in schema |
| `gbpUrl` | Links the site to the profile |
| `legalName`, `entityType`, `foundedYear` | Organisation schema |
| `gstin`, `pan` | Trust signals in the footer |
| `membershipNo`, `qualifications`, `yearsPractice`, `barAdmissions` | Credibility — see below |
| `serviceArea.cities` | Location pages cannot be built without it |

**The credentials are the biggest credibility gap.** The category leader states
plainly: ICAI member since May 1994, ICSI since 2006, LLB, 30+ years. Amit's
equivalents are all `TBD`, so right now he is not a person on his own website.
One afternoon fixes it.

---

# STEP 7 — Decide the advertising question

The Google Business Profile title is *"The Best Tax & GST Advisor Advocate"*.

If Amit is an enrolled **Advocate**, Bar Council conduct rules restrict
advertising, solicitation, superlatives and testimonials. "Best" is exactly the
kind of claim those rules restrict, and it also cannot be verified.

This decision gates: paid ads, review requests, and any published success
metrics. It is a question for Amit's own professional judgement — but it must be
answered deliberately, because Steps 8 and 9 depend on it.

---

# STEP 8 — Ask for reviews

There is exactly **one** testimonial on the entire site. Reviews are the single
strongest local ranking factor and the strongest trust signal.

Once the GBP is verified (Step 3), ask past clients for a Google review. Do not
script the wording for them and never fabricate one.

Gated on Step 7.

---

# STEP 9 — Only now, run the ad

Do not spend before Steps 1–3. An ad pointing at a site that cannot capture a
lead is money set on fire.

Prerequisites: Facebook Page → Meta Business Suite → ad account with an Indian
payment method → Pixel ID into `NEXT_PUBLIC_META_PIXEL_ID` in Vercel.

The Pixel is already built and is **off** until that variable is set.

---

# ORDER OF WORK

| # | Step | Who | Blocks |
|---|---|---|---|
| 1 | Resend + Sheet | You (Vercel) | Everything |
| 2 | WhatsApp number | Amit | The mobile funnel |
| 3 | Google Business Profile | Amit | Local leads |
| 4 | Buy the domain | You | Authority, trust |
| 5 | Search Console | You | Indexing |
| 6 | Fill the facts | Amit | Schema, credibility |
| 7 | Advertising decision | Amit | Steps 8, 9 |
| 8 | Reviews | Amit | Local ranking |
| 9 | Meta ad | You | — |

**Steps 1–3 are the ones that turn a live site into a site that gets leads.**
Everything else compounds; those three are the difference between zero and
non-zero.
