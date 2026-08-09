# What Amit Modi & Co. still needs to supply

**Everything below is a real-world fact only the client has.** Nothing here can be
guessed, generated, or looked up by me — a wrong tax figure or a wrong phone number on a
practice's website is worse than a blank space, so every unknown currently renders as
*nothing at all* rather than a placeholder.

Work top to bottom. **Section 1 is launch-blocking. Sections 2–4 are not** — the site is
live and working without them, they just make it convert better.

**How to apply any change:**

```bash
cd /Users/bhagatsingh/Desktop/AMITMODI
# edit the file named in the instruction
npm run build     # confirm it still builds
git add -A && git commit -m "client facts: <what you added>" && git push
```

Vercel redeploys automatically on push. Live now at
**https://amitmodi-one.vercel.app** → moving to **amitmodi.co.in**.

---

# 1. LAUNCH-BLOCKING

## 1.1 The domain — amitmodi.co.in

**Why it blocks:** every canonical URL, the sitemap, `llms.txt`, and every social share
image is built from this value. Ship without it and Google indexes the `.vercel.app`
address — then when you switch, you restart your ranking from zero.

**Where to get it:** a `.co.in` needs an Indian registrar. BigRock, GoDaddy India, or
Hostinger India all sell it, roughly ₹500–900/year. You said 5–10 days — that's fine, the
site runs on the Vercel URL until then.

**What to do when you have it:**

1. In Vercel → your project → **Settings → Domains** → add `amitmodi.co.in` **and**
   `www.amitmodi.co.in`.
2. Vercel shows you two DNS records. At your registrar's DNS panel, add:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
   *(use the exact values Vercel shows you — they occasionally change)*
3. Wait for the padlock (usually 10–60 minutes).
4. Then set the environment variable, in Vercel → **Settings → Environment Variables**:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://amitmodi.co.in` |

5. And in the code, `data/brand.ts` line 15:
   ```ts
   domain: 'amitmodi.co.in',
   ```
6. Redeploy.

## 1.2 A working email address

**Why it blocks:** the consultation form is the entire point of the site. Right now
submissions have nowhere to go.

**Where to get it:** if the domain includes email, use `amit@amitmodi.co.in`. Otherwise a
Gmail address works fine — but a professional address on the practice's own domain
converts noticeably better on a page asking someone to trust you with their tax affairs.

**What to do:**

`data/brand.ts` line 53:
```ts
email: 'amit@amitmodi.co.in',
```

And in Vercel → Environment Variables:

| Name | Value |
|---|---|
| `CONTACT_TO_EMAIL` | the address that should *receive* enquiries |

## 1.3 Resend API key — makes the form actually send

**Why it blocks:** without it, a visitor fills in the form, sees a success message, and
**the enquiry silently vanishes.** That is the worst failure mode on the site — a lost
client who thinks they contacted you.

**Where to get it:** [resend.com](https://resend.com) → sign up free (3,000 emails/month,
no card) → **API Keys** → **Create API Key** → copy it. It starts with `re_`.

**What to do:** Vercel → Environment Variables:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` |
| `RESEND_FROM` | `Amit Modi & Co. <onboarding@resend.dev>` |

Use `onboarding@resend.dev` until the domain is live. After that, verify
`amitmodi.co.in` inside Resend (**Domains → Add Domain**, then add the DNS records it
gives you) and change `RESEND_FROM` to `Amit Modi & Co. <contact@amitmodi.co.in>`.
Mail from your own domain lands in inboxes; mail from a shared sender lands in spam.

**Test it after setting:** submit the form on the live site. An email must arrive. If it
doesn't, check Vercel → Logs.

## 1.4 Office hours

**Why it blocks:** hours are part of `LocalBusiness` schema. Google uses them to show
"Open now" in local results, and a listing without them ranks below ones with them.

**Where to get it:** ask Amit. Include the lunch break if the office closes for one, and
say plainly if Sunday is closed.

**What to do:** `data/brand.ts` lines 58–64. Use 24-hour times, or `null` for a closed day:

```ts
hours: [
  { day: 'Monday',    opens: '10:00', closes: '19:00' },
  { day: 'Tuesday',   opens: '10:00', closes: '19:00' },
  { day: 'Wednesday', opens: '10:00', closes: '19:00' },
  { day: 'Thursday',  opens: '10:00', closes: '19:00' },
  { day: 'Friday',    opens: '10:00', closes: '19:00' },
  { day: 'Saturday',  opens: '10:00', closes: '15:00' },
  { day: 'Sunday',    opens: null,    closes: null    },
],
```

## 1.5 Latitude and longitude

**Why it blocks:** `LocalBusiness` schema **fails validation** without coordinates, and an
invalid block can suppress the whole thing — losing you the map pack, the single highest-
converting result for "GST consultant near me".

**Where to get it:** open [Google Maps](https://maps.google.com), search
*Modi Complex, Suratgarh*, **right-click the exact office** → the first item in the menu is
the coordinates. Click to copy. You get something like `29.3211, 73.8985`.

**What to do:** `data/brand.ts` lines 43–44 — numbers, not strings, no quotes:

```ts
lat: 29.3211,
lng: 73.8985,
```

## 1.6 Tax rates — the calculators are switched off until these are filled

**Why it blocks:** all five calculators currently show *"rates pending verification"*.
This is deliberate and it is the single most important safety rule in the build: **a
guessed GST rate or TDS threshold on a tax practice's own website is a professional
liability**, not a cosmetic gap. Someone will act on it.

**Where to get it:** the current official notifications —
- GST rates: [cbic-gst.gov.in](https://cbic-gst.gov.in) → Rate finder
- TDS rates: [incometax.gov.in](https://incometax.gov.in) → the TDS rate chart for the
  current financial year
- Late fees & interest: the current CGST notifications

Amit will know most of these from memory — but each still needs checking against the
current notification, because they change.

**What to do:** open `data/tax-rates.ts`. Every number is `null`. Fill the real value and
flip `verified: false` to `true` on that entry. A calculator switches on as soon as its
own rates are verified — you do not have to do all of them at once.

Start with `GST_SLABS`; that turns on the GST calculator, which is the most-searched of
the five.

---

# 2. HIGH VALUE — do these in week one

## 2.1 Google Business Profile

**This will out-perform the entire website for the first few months.** For a local
practice it is the highest-return thing on this list.

- Claim/verify at [business.google.com](https://business.google.com)
- **Name must read exactly `Amit Modi & Co.`** — not "Amit Modi & Co. | The Best Tax &
  GST Advisor Advocate". Keyword-stuffed names breach Google's naming guidelines and get
  listings suspended. The name field is for the real-world business name only.
- Address and phone must match the site **character for character** — mismatches split
  your local ranking signal
- Add all eight services individually
- Add real photos of the office and the signboard
- Post once a week (a due-date reminder is enough)

Then paste the profile URL into `data/brand.ts` line 54: `gbpUrl: '...'`.

## 2.2 Bar Council enrolment number

**Why it matters:** this is the strongest trust signal on the site. Google weighs author
credentials heavily for financial and legal topics, and a named, credentialed human beats
an anonymous firm every time. It also feeds `Person` schema.

**Where to get it:** Amit's Bar Council of India / Rajasthan enrolment certificate. Format
is like `R/1234/2015`.

**What to do:** `data/brand.ts` line 26:
```ts
membershipNo: 'R/1234/2015',
qualifications: 'B.Com, LL.B',
yearsPractice: '12',
```

## 2.3 A photograph of Amit

**Why it matters:** the principal page is the site's credibility anchor. A real face
converts.

**Must be a real photograph.** Do not generate one — an AI portrait presented as a named
professional is a fabricated likeness, and it destroys exactly the trust it was meant to
build. A phone photo against a plain wall in daylight beats anything generated.

**What to do:** save as `public/images/principal.jpg`, then `data/brand.ts` line 30:
```ts
photo: '/images/principal.jpg',
```

## 2.4 Google Analytics

**Where to get it:** [analytics.google.com](https://analytics.google.com) → create a
property → Data Streams → Web → copy the Measurement ID (`G-XXXXXXXXXX`).

**What to do:** Vercel → Environment Variables → `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`.

## 2.5 Google Search Console

[search.google.com/search-console](https://search.google.com/search-console) → add
`amitmodi.co.in` → verify by DNS → submit `https://amitmodi.co.in/sitemap.xml`.

Do the same at [Bing Webmaster Tools](https://www.bing.com/webmasters) — Bing feeds
Copilot, so it matters more than its market share suggests.

---

# 3. MEDIUM VALUE — do these in month one

## 3.1 Fees and turnaround times

Pricing transparency is the most trust-building thing on a tax site, because it is what
every competitor hides. You can publish "On request" — but a real number converts better.

Fill the table in `BRAND-FACTS.md` section 5, then `data/services.ts` for each service:

```ts
pricing: { govtFee: 1000, professionalFee: 2500, currency: 'INR' },
turnaround: { minDays: 7, maxDays: 10, note: '' },
```

Government fee and professional fee are shown as **separate** figures — that distinction
is deliberate and it is what makes the practice look honest.

## 3.2 Firm details

`data/brand.ts`:
```ts
legalName: '...',        // as on the PAN card
entityType: '...',       // Proprietorship / Partnership / LLP
foundedYear: '...',      // e.g. '2011'
gstin: '...',            // the firm's own GSTIN
```

## 3.3 WhatsApp

If `+91 94145 04617` takes WhatsApp, set line 52: `whatsapp: '+919414504617'`. A WhatsApp
button converts far better than a form for Indian small-business clients — many will not
fill a form but will send a message.

## 3.4 Real case studies

Five templates exist in `content/case-studies/`, all marked `status: 'template'` and
`consentObtained: false`, so **none of them render**. That is deliberate — publishing a
fabricated case study as real is a fraud risk.

To publish one: replace the details with a real matter, anonymise the client
("a textile trader in Suratgarh with turnover around ₹4 crore"), get **written consent**,
then set `status: 'published'` and `consentObtained: true`.

## 3.5 Testimonials — check the rules first

`data/testimonials.ts` is an empty array and `ADVERTISING_MODE` is `'conservative'`.

**Amit is listed as an Advocate.** Bar Council of India Rule 36 restricts advocates from
soliciting or advertising. Published testimonials may not be permitted. **Confirm with the
Rajasthan State Bar Council before adding any.** If confirmed permissible, add entries with
`consentObtained: true` and switch `ADVERTISING_MODE` to `'standard'` in
`data/credentials.ts`.

The site is complete and ranks fine without testimonials.

---

# 4. THE 625 VERIFY MARKERS

Search the project for `VERIFY` and you'll find **625 markers**. Each one is a compliance
fact an AI wrote that a human has not confirmed — a due date, a section number, a penalty
amount, a document requirement.

**These do not block launch.** Content with an unverified figure is either hidden in
production or renders without the number. But each one you verify makes a page more useful
and more likely to be cited.

**How to work through them:**

```bash
grep -rn "VERIFY" content data | less
```

Priority order — do them in this order, because this is the order a reader can be harmed:

1. **Rates, thresholds, penalties, fees** — someone could lose money acting on these
2. **Due dates** — someone could miss a deadline
3. **Document lists** — someone wastes a trip to the office
4. **Process steps and jurisdiction notes** — merely inaccurate

Amit can clear most of these quickly; they are things he knows. Delete the `VERIFY`
comment once the fact beside it is confirmed.

---

# 5. QUICK REFERENCE — every environment variable

Set all of these in **Vercel → Settings → Environment Variables** (never in the repo):

| Name | Needed for | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonicals, sitemap, OG images | `https://amitmodi.co.in` |
| `RESEND_API_KEY` | the consultation form | `re_xxxxxxxx` |
| `RESEND_FROM` | sender name on emails | `Amit Modi & Co. <contact@amitmodi.co.in>` |
| `CONTACT_TO_EMAIL` | where enquiries arrive | `amit@amitmodi.co.in` |
| `NEXT_PUBLIC_GA_ID` | analytics | `G-XXXXXXXXXX` |

After changing any of them you must **redeploy** — environment variables are read at build
time, so an existing deployment will not pick them up.

---

# 6. THE ONE-PAGE CHECKLIST

Print this. Tick as you go.

**Blocking**
- [ ] Buy `amitmodi.co.in`, point DNS at Vercel, set `NEXT_PUBLIC_SITE_URL`
- [ ] Email address → `data/brand.ts` + `CONTACT_TO_EMAIL`
- [ ] Resend key → `RESEND_API_KEY`, then submit the form and confirm an email arrives
- [ ] Office hours → `data/brand.ts`
- [ ] Latitude / longitude → `data/brand.ts`
- [ ] GST slabs verified → `data/tax-rates.ts` (turns the calculators on)

**Week one**
- [ ] Google Business Profile claimed, name exactly `Amit Modi & Co.`
- [ ] Bar enrolment number + qualifications → `data/brand.ts`
- [ ] Real photograph of Amit → `public/images/principal.jpg`
- [ ] Google Analytics ID → `NEXT_PUBLIC_GA_ID`
- [ ] Search Console + Bing Webmaster, sitemap submitted
- [ ] Ask past clients for Google reviews

**Month one**
- [ ] Fees and turnarounds → `data/services.ts`
- [ ] Firm legal details → `data/brand.ts`
- [ ] WhatsApp number → `data/brand.ts`
- [ ] Confirm advertising rules with the Rajasthan Bar Council
- [ ] Start clearing `VERIFY` markers, rates and dates first
- [ ] Publish the first real case study, with written consent
