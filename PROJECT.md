# Amit Modi & Co. — project handbook

Everything operational for this site in one file. Consolidated 2026-08-11.

> The 5,290-line build plan, the original brief and the copy deck are history
> now — the build they describe is finished. They are in `docs/archive/` rather
> than inlined here, because a 7,600-line handbook is a file nobody opens.

## Contents


1. [Overview](#1-overview)

2. [What Amit still needs to supply](#2-what-amit-still-needs-to-supply)

3. [Deploying](#3-deploying)

4. [Leads into Google Sheets](#4-leads-into-google-sheets)

5. [The tax assistant](#5-the-tax-assistant)

6. [Brand facts (source of truth)](#6-brand-facts-source-of-truth)

7. [Design system](#7-design-system)

8. [Asset roles](#8-asset-roles)

9. [Motion rules](#9-motion-rules)

10. [Design audit](#10-design-audit)

11. [Value gap and plan](#11-value-gap-and-plan)

12. [Content strategy](#12-content-strategy)

13. [Cross-agent handoff log](#13-cross-agent-handoff-log)


---


# 1. Overview

*(was `README.md`)*

## Compliance in Check

"Compliance in Check" is a modern, high-performance web application designed for a GST, Tax, and Compliance Practice. Built on Next.js App Router and optimized for both Generative Engine Optimization (GEO) and Core Web Vitals, it treats tax compliance like a game of chess—proactive, strategic, and definitive.

### The Three-Agent Workflow

This repository is built using a highly structured 20-phase, parallel 3-agent workflow:
- **Agent A (Architect):** Handles Next.js core, routing, 3D assets, components, state, and `package.json`.
- **Agent B (Content & SEO Engineer):** Responsible for editorial strategy, MDX pages, SEO data, and runbooks (you are reading an Agent B file).
- **Agent C (Data & Copy Hand):** Focuses on JSON/TS data files, checklists, FAQs, and tightly constrained structured data.

Each agent operates strictly within its designated folder ownership. If an agent needs a file modified outside its zone, it leaves a request in `HANDOFF.md`.

### Running Locally

To run the Next.js frontend locally:

Everything runs from the repository root — there is no separate frontend folder.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Documentation

For further information regarding content and deployment strategy, please refer to:
- [Deployment Runbook](./DEPLOYMENT.md) - A zero-assumed-knowledge guide for setting up the Vercel deployment, environments, and domain mapping.
- [Content Strategy](./CONTENT-STRATEGY.md) - The editorial spine detailing service mappings, keyword SEO, interlinking, and AI-optimized quotable statistics.

---


# 2. What Amit still needs to supply

*(was `CLIENT-INPUTS.md`)*

## What Amit Modi & Co. still needs to supply

**Everything below is a real-world fact only the client has.** Nothing here can be
guessed, generated, or looked up by me — a wrong tax figure or a wrong phone number on a
practice's website is worse than a blank space, so every unknown currently renders as
*nothing at all* rather than a placeholder.

Work top to bottom. **Section 1 is launch-blocking. Sections 2–4 are not** — the site is
live and working without them, they just make it convert better.

**How to apply any change:**

```bash
cd /Users/bhagatsingh/Desktop/AMITMODI
## edit the file named in the instruction
npm run build     # confirm it still builds
git add -A && git commit -m "client facts: <what you added>" && git push
```

Vercel redeploys automatically on push. Live now at
**https://amitmodi-one.vercel.app** → moving to **amitmodi.co.in**.

---

## 1. LAUNCH-BLOCKING

### 1.1 The domain — amitmodi.co.in

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

### 1.2 A working email address

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

### 1.3 Resend API key — makes the form actually send

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

### 1.4 Office hours

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

### 1.5 Latitude and longitude

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

### 1.6 Tax rates — the calculators are switched off until these are filled

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

## 2. HIGH VALUE — do these in week one

### 2.1 Google Business Profile

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

### 2.2 Bar Council enrolment number

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

### 2.3 A photograph of Amit

**Why it matters:** the principal page is the site's credibility anchor. A real face
converts.

**Must be a real photograph.** Do not generate one — an AI portrait presented as a named
professional is a fabricated likeness, and it destroys exactly the trust it was meant to
build. A phone photo against a plain wall in daylight beats anything generated.

**What to do:** save as `public/images/principal.jpg`, then `data/brand.ts` line 30:
```ts
photo: '/images/principal.jpg',
```

### 2.4 Google Analytics

**Where to get it:** [analytics.google.com](https://analytics.google.com) → create a
property → Data Streams → Web → copy the Measurement ID (`G-XXXXXXXXXX`).

**What to do:** Vercel → Environment Variables → `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`.

### 2.5 Google Search Console

[search.google.com/search-console](https://search.google.com/search-console) → add
`amitmodi.co.in` → verify by DNS → submit `https://amitmodi.co.in/sitemap.xml`.

Do the same at [Bing Webmaster Tools](https://www.bing.com/webmasters) — Bing feeds
Copilot, so it matters more than its market share suggests.

---

## 3. MEDIUM VALUE — do these in month one

### 3.1 Fees and turnaround times

Pricing transparency is the most trust-building thing on a tax site, because it is what
every competitor hides. You can publish "On request" — but a real number converts better.

Fill the table in `BRAND-FACTS.md` section 5, then `data/services.ts` for each service:

```ts
pricing: { govtFee: 1000, professionalFee: 2500, currency: 'INR' },
turnaround: { minDays: 7, maxDays: 10, note: '' },
```

Government fee and professional fee are shown as **separate** figures — that distinction
is deliberate and it is what makes the practice look honest.

### 3.2 Firm details

`data/brand.ts`:
```ts
legalName: '...',        // as on the PAN card
entityType: '...',       // Proprietorship / Partnership / LLP
foundedYear: '...',      // e.g. '2011'
gstin: '...',            // the firm's own GSTIN
```

### 3.3 WhatsApp

If `+91 94145 04617` takes WhatsApp, set line 52: `whatsapp: '+919414504617'`. A WhatsApp
button converts far better than a form for Indian small-business clients — many will not
fill a form but will send a message.

### 3.4 Real case studies

Five templates exist in `content/case-studies/`, all marked `status: 'template'` and
`consentObtained: false`, so **none of them render**. That is deliberate — publishing a
fabricated case study as real is a fraud risk.

To publish one: replace the details with a real matter, anonymise the client
("a textile trader in Suratgarh with turnover around ₹4 crore"), get **written consent**,
then set `status: 'published'` and `consentObtained: true`.

### 3.5 Testimonials — check the rules first

`data/testimonials.ts` is an empty array and `ADVERTISING_MODE` is `'conservative'`.

**Amit is listed as an Advocate.** Bar Council of India Rule 36 restricts advocates from
soliciting or advertising. Published testimonials may not be permitted. **Confirm with the
Rajasthan State Bar Council before adding any.** If confirmed permissible, add entries with
`consentObtained: true` and switch `ADVERTISING_MODE` to `'standard'` in
`data/credentials.ts`.

The site is complete and ranks fine without testimonials.

---

## 4. THE 625 VERIFY MARKERS

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

## 5. QUICK REFERENCE — every environment variable

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

## 6. THE ONE-PAGE CHECKLIST

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

---


# 3. Deploying

*(was `DEPLOYMENT.md`)*

## DEPLOYMENT RUNBOOK

This runbook covers the end-to-end process of deploying the "Compliance in Check" web application to Vercel, including setting up the GitHub repository, configuring environment variables, attaching a custom domain, and handling rollbacks.

### 1. Creating the GitHub Repository

We will create a GitHub repository to host the code and trigger Vercel deployments.

#### Option A: Using the GitHub CLI (`gh`) - Recommended
1. **Authenticate the GitHub CLI**:
   ```bash
   gh auth login
   ```
   Follow the interactive prompts to authenticate via your web browser.

2. **Create the repository and push code**:
   ```bash
   # Run this from the root of your project
   gh repo create amitmodi-site --public --source=. --remote=origin --push
   ```

#### Option B: Using the GitHub Web UI (Fallback)
If you don't have the `gh` CLI installed:
1. Go to [GitHub](https://github.com/new) and create a new repository (e.g., `amitmodi-site`).
2. Run the following commands in your local project root:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/amitmodi-site.git
   git branch -M main
   git push -u origin main
   ```

### 2. Connecting the Repository to Vercel

We use Vercel for zero-config deployments of our Next.js App Router application.

1. **Install the Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Authenticate with Vercel**:
   ```bash
   vercel login
   ```
   Select your preferred login method (e.g., GitHub).

3. **Link the project**:
   ```bash
   vercel link
   ```
   *Interactive Prompts:*
   - Set up and develop `~/path/to/amitmodi-site`? **Y**
   - Which scope do you want to deploy to? **(Select your team/personal account)**
   - Link to existing project? **N**
   - What's your project's name? **amitmodi-site**
   - In which directory is your code located? **./** (leave as the default)

   **Root Directory: leave it as `./`.** The Next.js app lives at the repository root —
   `package.json`, `app/` and `next.config.ts` all sit at the top level, alongside the
   planning documents. There is no `site/` subfolder.

   > If you previously set the Root Directory to `site` in the Vercel dashboard, change it
   > back to `./` now — Vercel caches this setting per project, and a stale value fails the
   > build with "No package.json found", which reads like a dependency problem and is not one.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### 3. Environment Variables

This project requires specific environment variables to function correctly. 

**CRITICAL RULE:** Never commit these values to git. Add them only to `.env.local` for local development, and the Vercel Dashboard (`Settings > Environment Variables`) for production.

| Variable Name | Required At | Where to Set | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Build time | Vercel UI | The production URL of the site (e.g., `https://www.yourdomain.com`). |
| `RESEND_API_KEY` | Runtime | Vercel UI | API key for Resend to send transactional emails (e.g., lead capture). |
| `CONTACT_TO_EMAIL` | Runtime | Vercel UI | The email address that receives the consultation form submissions. |
| `NEXT_PUBLIC_GA_ID` | Build time | Vercel UI | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). |
| `NEXT_PUBLIC_GTM_ID` | Build time | Vercel UI | Google Tag Manager ID (if applicable). |

### 4. Custom Domain Configuration

To attach a custom domain, go to your Vercel Project Dashboard > **Settings** > **Domains**.

Add your domain (e.g., `example.com`). Vercel will recommend setting up the `www` subdomain and redirecting the apex (root) domain to it, or vice versa.

#### DNS Records to Configure in your Domain Registrar

**1. Apex Domain Configuration (`example.com`)**
If you want users to visit `example.com` directly:
- **Type:** `A`
- **Name:** `@` (or leave blank, depending on registrar)
- **Value:** `76.76.21.21` (Vercel's Anycast IP)

**2. WWW Subdomain Configuration (`www.example.com`)**
If you want users to visit `www.example.com` directly:
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com.`

*Best Practice:* Set `www.example.com` as your primary domain in Vercel, and configure `example.com` to redirect to `www.example.com` (Vercel does this automatically when you add both).

### 5. Rolling Back a Bad Deploy

If a deployment breaks production, you can roll back instantly from the Vercel Dashboard:

1. Go to your project on Vercel.
2. Click on the **Deployments** tab.
3. Find the previous successful deployment in the list.
4. Click the three dots (`...`) next to that deployment.
5. Select **Promote to Production** (or **Assign Custom Domains**).
6. Confirm the prompt.

The rollback is instantaneous because Vercel simply updates the routing at the Edge network to point to the previously built version.

---


# 4. Leads into Google Sheets

*(was `GOOGLE-SHEETS-LEADS.md`)*

## Sending every enquiry into a Google Sheet

Fifteen minutes, no coding. Every consultation request will land as a new row,
**and** still arrive by email exactly as it does now.

> **The email is the product; the sheet is a convenience.** The site is built so
> that if the spreadsheet is unreachable — script redeployed, quota hit, Google
> having a bad morning — the enquiry still sends and the visitor still sees
> success. You will never lose a lead because a spreadsheet was down.

---

### Step 1 — Make the sheet

1. Go to [sheets.new](https://sheets.new) — this creates a blank spreadsheet.
2. Name it **Amit Modi & Co. — Leads** (top-left corner).
3. In the first row, type these **11 headers**, one per cell, A1 through K1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Email | Service | Situation | Urgency | Message | Source | Status | Notes |

**Status** and **Notes** are yours — the website never writes to them. That's
deliberate: it leaves you two columns to actually work the leads in
(*Called / Quoted / Won / Not a fit*) without the script ever overwriting them.

---

### Step 2 — Add the script

1. In the spreadsheet menu: **Extensions → Apps Script**.
2. Delete whatever is in the editor.
3. Paste **all** of this:

```javascript
/**
 * Receives a lead from the Amit Modi & Co. website and appends it as a row.
 *
 * Deployed as a Web App. The site POSTs JSON here; this appends and replies.
 */

// Must match SHEETS_SHARED_SECRET in Vercel. Change both together.
const SHARED_SECRET = 'CHANGE_THIS_TO_A_LONG_RANDOM_STRING';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Reject anything that does not carry the shared secret. The Web App URL
    // has to be world-callable for the site to reach it, so this is what stops
    // a stranger who finds the URL from filling your sheet with junk.
    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorised' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name      || '',
      body.phone     || '',
      body.email     || '',
      body.service   || '',
      body.situation || '',
      body.urgency   || '',
      body.message   || '',
      body.source    || '',
      'New',   // Status — starting value, yours to change afterwards
      ''       // Notes  — never written to again
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **Change `CHANGE_THIS_TO_A_LONG_RANDOM_STRING`** to a long random string.
   Anything works — mash the keyboard, 30+ characters. **Copy it somewhere**;
   you need the exact same value in Step 4.
5. Click the **save** icon.

---

### Step 3 — Deploy it

1. Top right: **Deploy → New deployment**.
2. Click the gear next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `lead capture`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google will ask you to authorise. Click **Authorize access** → choose your
   account → you will see *"Google hasn't verified this app"* → click
   **Advanced** → **Go to (project name) (unsafe)** → **Allow**.

   That warning is expected. It appears for every unpublished personal script;
   you are authorising a script you just wrote yourself, in your own account,
   that can only touch this one spreadsheet.

6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

**Every time you edit the script you must redeploy** — Deploy → Manage
deployments → pencil icon → Version: **New version** → Deploy. Editing without
redeploying is the single most common reason "it stopped working".

---

### Step 4 — Tell the website about it

In Vercel → your project → **Settings → Environment Variables**, add two:

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from Step 3 |
| `SHEETS_SHARED_SECRET` | the exact string from Step 2 |

Then **Deployments → ⋯ → Redeploy**. Environment variables are read at build
time, so an existing deployment will not pick them up.

---

### Step 5 — Test it

Submit the contact form on the live site with your own details.

Within a few seconds you should see: a **new row in the sheet**, and the
**email** in the practice's inbox.

**If the email arrives but the row does not**, the site is working and the sheet
link is not. Check, in this order:

1. `SHEETS_WEBHOOK_URL` ends in `/exec` — not `/dev`
2. The secret in Vercel matches the script **character for character**
3. Deployment access is **Anyone**, not "Anyone with Google account"
4. You redeployed after the last script edit
5. Vercel → Logs, look for a line starting `[sheets]`

---

### Optional — get a phone alert on every lead

Add this to the script, above `doPost`, and call `notify(body)` just after
`appendRow`:

```javascript
function notify(body) {
  MailApp.sendEmail({
    to: 'YOUR_EMAIL@example.com',
    subject: 'New enquiry: ' + body.service + ' (' + body.urgency + ')',
    body: body.name + '\n' + body.phone + '\n\n' + (body.message || '')
  });
}
```

With the Gmail app set to notify on that address, a lead reaches the phone in
seconds. For a practice competing on responsiveness, calling back within ten
minutes rather than the next morning is most of the advantage.

---

### What this deliberately does not do

- **No Google Cloud project, service account, or JSON key.** The Sheets API
  would need all three, and the key would have to live in the repo's
  environment. A Web App URL plus a shared secret does the same job with
  nothing to leak.
- **No spreadsheet write on the visitor's critical path.** The request is capped
  at 6 seconds and every failure is swallowed, so a slow Google can never make
  someone sit on a spinner or see an error for an enquiry that actually sent.
- **Nothing sensitive is logged.** Failures record the reason, never the row —
  the payload holds a real person's phone number and tax situation.

---


# 5. The tax assistant

*(was `AI-TRAINING.md`)*

## Training the tax assistant with the client's real tax books

The chatbot on the site (`/api/ask`, powered by Groq's Llama) is **grounded,
not fine-tuned**. That is deliberate: you cannot fine-tune a hosted model with
your API key, and you should not want to — grounding by a knowledge file keeps
every answer inside the guardrails the site already enforces (never states a
current rate/due date/penalty, tax topics only).

"Training" = turning the client's tax books into short entries in
**`lib/knowledge/tax-books.md`**, which the server injects into every request.

### The one-time setup

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

### The training workflow (repeat per book)

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

### Capacity & rules of thumb

- The file is capped at **6,000 characters**. Trim the oldest, least-asked
  entries as it grows.
- The cap protects the model's focus and your token bill. Sharp and short
  beats exhaustive.
- This file is code, not chat history. Everything in it is invented-free and
  sourced — the `- **Source:**` line on every entry is what makes that possible.
- Numbers that change stay out by rule; put "confirm with the practice" in
  their place. The site's paranoia here is not a constraint to fight — it is
  what keeps a wrong answer from costing a client money.

---


# 6. Brand facts (source of truth)

*(was `BRAND-FACTS.md`)*

## BRAND-FACTS.md — Single Source of Truth

> **STOP. Fill this in before Phase 3.**
> Every AI agent is forbidden from inventing anything on this page.
> Wrong data here becomes wrong `LocalBusiness` schema, wrong Google Business Profile
> matching, and wrong AI-search answers about your client. That directly costs leads.
>
> Anything you genuinely don't know yet: write `TBD` — never guess.
> Agents must render `TBD` fields as hidden/omitted, never as placeholder text on the live site.

---

### 1. Legal identity

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

### 2. Practitioner credentials — drives E-E-A-T and `Person` schema

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

### 3. Contact & location — drives `LocalBusiness` schema and Maps ranking

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

### 4. Service area — drives the multi-city pages in Phase 18

> Only list cities where you can genuinely take on and service a client.
> Fake city pages are thin content and get filtered out of search.

| Field | Value |
|---|---|
| Primary city | **Suratgarh** |
| Secondary cities (real ones only) | `TBD` |
| States covered for GST | **Rajasthan** |
| Remote/pan-India services? | `TBD` |

### 5. Commercials — drives the pricing-transparency sections

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

### 6. Proof assets — the highest-leverage SEO input you can supply

| Field | Value |
|---|---|
| No. of clients served (real figure) | `TBD` |
| No. of returns filed to date | `TBD` |
| Appeals won / matters represented | `TBD` |
| 3–5 real case studies (situation → action → result, anonymised) | `TBD` |
| Real client testimonials + consent to publish | `TBD` |
| Accreditation logos you may legally display | `TBD` |
| Existing Google reviews count & rating | `TBD` |

### 7. Assets on hand

| Field | Value |
|---|---|
| Existing logo file? | `TBD` |
| Photos of principal / team / office? | `TBD` |
| Existing website URL (for 301 redirect map) | `TBD` |
| Existing social profiles | `TBD` |

---

### ⚠️ Advertising-rules guardrail — read once, decide once

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

#### Note on the Google Business Profile title

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

---


# 7. Design system

*(was `DESIGN-SYSTEM.md`)*

## DESIGN SYSTEM & STYLEGUIDE

This document outlines the design system for the "Compliance in Check" web application, defining the visual language, typography, color usage rules, and accessibility standards.

### 1. Concept Translation

The visual identity is based on translating a chess metaphor into tax compliance vocabulary, presenting the practice as strategic and proactive.

| Reference Used | Our Translation |
| :--- | :--- |
| Chessboard grid background | **Ledger grid** — accountant's ruled paper, same faint 8×8 feel |
| Chess notation marginalia (`Nf3`, `Bc4`) | **Statute marginalia** — `Sec 44AB`, `GSTR-3B`, `Form 26AS`, `Rule 46`, `u/s 139(1)` in pencil, scattered, low opacity, slightly rotated |
| Floating cut-out dollar bills | **Cut-out ₹500 notes, revenue stamps, brass seals, a steel paperclip** — desaturated, drop-shadowed |
| Hand-drawn ink figures | **Indian business owners** — shopkeeper, exporter, textile trader, startup founder — same sketchy ink line style |
| Book-spread horizontal gallery | **Compliance-guide spreads** — filing calendars, penalty tables, flowcharts |
| Chess knight hero object | **Brass chess knight on a ledger board**, rupee coins as pawns (3D) |
| "The Book" / "The Author" | **"The Practice" / "The Principal"** |
| Emerald green | Kept exactly — reads as both money and "cleared/approved" |

### 2. Usage Rules

#### The Display Type Rule
**The `--font-display` (Instrument Serif) must be used at most twice per page.** 
It should be reserved exclusively for massive, high-contrast headline statements (like the H1 and Hero text). Display type must stay an *event* rather than becoming a repetitive texture throughout the page.

#### The `--stamp` Color Rule
**The `--stamp` (#B3392B) color is reserved exclusively for deadlines, penalties, and warnings.**
It must *never* be used for decoration, general buttons, or accents. When users see `--stamp`, it should instantly communicate a compliance risk, a looming due date, or a statutory penalty.

### 3. Marginalia Vocabulary

The `.marginalia` class is used to scatter faded, rotated, handwritten text across the background (`.ledger-grid`). Use the following 30 real statute and form references to create this texture. Never invent references or use lorem ipsum.

1. `Sec 44AB`
2. `GSTR-3B`
3. `Form 26AS`
4. `Rule 46`
5. `u/s 139(1)`
6. `ITC-04`
7. `Form 16`
8. `Form 16A`
9. `GSTR-1`
10. `GSTR-9`
11. `GSTR-9C`
12. `Sec 80C`
13. `Sec 194J`
14. `Sec 194C`
15. `Sec 234A`
16. `Sec 234B`
17. `Sec 234C`
18. `Form 3CD`
19. `Form 10B`
20. `DRC-01`
21. `DRC-03`
22. `AS-26`
23. `GSTR-2A`
24. `GSTR-2B`
25. `Sec 12A`
26. `Sec 80G`
27. `Rule 42`
28. `Rule 43`
29. `ITR-1`
30. `ITR-4`

### 4. Accessibility Contract

Every component built in this project must strictly adhere to the following accessibility guarantees:

- **Touch Targets:** All clickable and interactive elements must have a minimum touch target size of 44×44px.
- **Visible Focus:** Every interactive element must have a clear, visible focus state for keyboard navigation (never `outline: none` without a custom focus ring).
- **Color Independence:** Any meaning communicated by color (like `--stamp` for errors, or `--seal` for success) must also be conveyed through text or a supplementary icon. Color cannot be the only visual means of conveying information.
- **Keyboard Operability:** Full keyboard operability is required. Users must be able to navigate, interact with, and submit every form and component built in later phases using only the keyboard.

### 5. Images & Assets

#### Component Usage Rules
- **`<Figure>`:** Use exclusively for *meaningful* images that add editorial value (e.g., `fig-*`, `spread-*`, `cover-*`). It renders an HTML `<figure>` with an optional `<figcaption>`. This ensures the caption is visible to everyone and properly semantic.
- **`<CutOut>`:** Use for purely *decorative* or textural assets (e.g., `cut-rupee-*`, `cut-paperclip`). These bypass `<Figure>` entirely to prevent cluttering the accessibility tree with empty `alt` attributes or meaningless semantic wrappers.
- **`<Model3D>`:** Use specifically for interactive 3D `.glb` assets.

#### Captions vs Alt Text
- **Alt Text:** Descriptive text hidden from sighted users but critical for screen readers. It describes the literal visual content of the image.
- **Captions:** Editorial text visible to all users via `<figcaption>`. It must explain *why* the image matters in context and add information rather than just restating what the image looks like.

#### The No-Text-In-Images Rule
No image on this site may ever contain readable text. Generated text in images is notoriously unreliable, unsearchable by search engines, and impossible to translate or style dynamically. Any textual information must be built natively in HTML/CSS.

---


# 8. Asset roles

*(was `ASSET-ROLES.md`)*

## Which asset does which job

Every asset has **one** role. Two assets doing the same job is what makes a
collage read as decoration; one asset per job is what makes it read as a system.

---

### 1. The notes (marginalia) — the paper itself

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

### 2. The objects (cut-outs) — one per page, never repeated on the same screen

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

### 3. The figures (ink drawings) — people, and only where a person is meant

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

### 4. The surfaces — structure, not ornament

| Surface | Job |
|---|---|
| `tex-torn-edge` | `TornDivider`, where the homepage changes register from paper to paper-deep. Every section previously met on an identical 1px hairline. |
| `tex-ink-blot` | Behind the `AnswerBlock` at 18%, and on the glossary. The one block on a service page where a reader actually stops. |

---

### 5. The documents — evidence

| Asset | Job |
|---|---|
| `spread-*` (6) | One per panel in the horizontal services gallery, cycling. The reference's book-spread section. |
| `cover-*` (4) | Guide cards lead with their cover, matched by slug with an index fallback so a fifth guide reuses one rather than leaving a hole. |

---

### 6. Social and icons

| Asset | Job |
|---|---|
| `og-default` | Every page's share card |
| `og-service` | Service pages specifically |
| `favicon-src`, `apple-touch` | **Build sources only.** Next.js serves `app/icon.png` and `app/apple-icon.png`, generated from these. They will never appear in a component, and an unused-asset audit should not flag them. |

---

### Rules that keep this a system

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

---


# 9. Motion rules

*(was `MOTION-RULES.md`)*

## MOTION & INTERACTION RULES

This document serves as the absolute governing framework for all animation, transition, and motion decisions across the "Compliance in Check" web application. These rules are finalized decisions, documented here so later phases do not relitigate them.

### 1. The Global Easing Curve
There is exactly **one easing curve** for the entire project: `[0.16, 1, 0.3, 1]`. 

**Why:** A single, global easing curve is what makes a site feel *designed* rather than *assembled*. When every element accelerates and decelerates with the identical physical physics, the interface feels like a unified environment. Mixing cubic-beziers breaks this illusion immediately.

### 2. The Motion Budget
**No more than 3 animated elements may be active in any single viewport at one time.**

Complex, overlapping animations exhaust the user and degrade performance. A strict budget of three concurrent animations forces us to prioritize what actually matters on the screen. If a fourth thing needs to move, one of the first three must become static.

### 3. The Typography Rule
**Display type (`--font-display`) animates at most twice per page.**

Display typography is loud, authoritative, and demanding. If every headline flies in on scroll, the effect turns from impactful to annoying. Display type must remain an *event*. 

Furthermore, **no animation on anything a user is trying to read while it moves.** If it contains body copy, it must finish its entry animation *before* the user's eye begins to parse the words.

### 4. The Hover Rule
**Hover effects never move layout.**

When a user hovers over a button, card, or link, it may only change color, opacity, or a CSS transform (like a slight scale or translation that does not affect document flow). Hover states must never alter `width`, `height`, `margin`, `padding`, or `border-width` in a way that shifts surrounding elements.

### 5. The Four Legitimate Jobs of Motion
Every animation must justify its existence. If an animation does none of the following four jobs, it gets deleted:

1. **Directing Attention:** Guiding the user's eye to the primary action or a critical penalty warning.
2. **Showing Spatial Relationship:** Explaining where an element came from or where it went (e.g., an accordion expanding to reveal content).
3. **Giving Feedback:** Confirming a user's action (e.g., a button's magnetic pull or a form's success state).
4. **Expressing Brand at Moments of Transition:** Using the brief window during page loads or section transitions to reinforce the calm, strategic aesthetic of the practice.

### 6. Motion Quality = Search Ranking (Core Web Vitals)
Motion is an SEO concern. Scroll-linked animations that force the browser to recalculate layout on the main thread will ruin the site's **Interaction to Next Paint (INP)** score. 

INP is a direct Google search ranking signal. If an animation causes layout thrashing, the site feels sluggish to the user and is actively penalized by search engines. Therefore, motion quality and search ranking are the exact same problem here, not competing concerns. All animations must be hardware-accelerated (`transform` and `opacity` only) to preserve our INP score and protect our organic search traffic.

---


# 10. Design audit

*(was `DESIGN-AUDIT.md`)*

## Design audit — Amit Modi & Co.

Reviewed against the built site, not the plan. Every finding below was observed
on a rendered page. Ordered by how much each one costs in leads, not by how
hard it is to fix.

**Framing:** the visitor is not browsing. They have a notice, a deadline, or a
registration they've never done before. They are anxious, they don't know the
vocabulary, and they are deciding in about eight seconds whether this practice
is competent. Every finding is judged against that, not against taste.

---

### A. What is genuinely working

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

### B. Critical — costs leads directly

#### B1. Green means three different things
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

#### B2. There is not one human face on the site
Ink drawings, a chess piece, a rubber stamp. No photograph of Amit anywhere.

Faces are the strongest trust signal available, and for a regulated professional
service the effect is not marginal. A visitor about to hand over their PAN, bank
statements and a tax notice is asking one question — *is there a real, competent
person behind this?* The site currently answers "there is a beautiful brand."

**Fix:** one real photograph, on the principal page and in the footer.
*(Needs Amit — but it is the highest-value single asset on the list.)*

#### B3. The disclaimer sits above the calculator
It primes doubt before the tool is used. Anxiety is already the visitor's
default state; leading with a warning deepens it at the exact moment you want
them to feel capable.

**Fix:** move it directly beneath the result. Same words, same prominence — it
then reads as professional care about a number they already have, rather than a
hedge about a number they haven't got yet.

#### B4. Calculator pages are orphaned from the design system
The GST calculator has no paper texture, no ledger grid, no marginalia, no
collage, and its `h1` is small grey `--ink` while service pages carry huge
`--seal` display type. Three different `h1` treatments now exist across the
site.

These are the pages that will pull the most search traffic once the rates are
verified. A visitor arriving from Google lands here *first* — and this is the
weakest-looking page on the site.

**Fix:** the `ServiceHero` treatment, applied to `CalculatorShell`.

---

### C. Serious — costs credibility

#### C1. Inconsistent heading scale
Homepage `--t-display` centred · service pages `--t-display` left · calculators
roughly `--t-h2` · articles somewhere between. A reader cannot learn the
system, so nothing feels authored.

**Fix:** two levels only. Landing pages get display; interior pages get h1. No
third size.

#### C2. Body copy switches between roman and italic without meaning
The homepage subhead is italic, service one-liners are italic, calculator intros
are roman. Italic currently signals nothing.

**Fix:** italic means *editorial voice* (the practice speaking). Roman means
*instruction*. Pick per block and hold it.

#### C3. Dead space right of the calculator result
The result panel ends and roughly 40% of the viewport height below it is empty
on desktop. Empty space reads as unfinished unless it is obviously deliberate.

**Fix:** the "when you need a professional" block — already written — moves into
that column. It is also the conversion bridge, so this fixes composition and
commerce at once.

#### C4. `--brass` is effectively unused
A defined palette colour appearing almost nowhere. It was specified for
credentials and trust marks, which is exactly the content that does not exist
yet (B2).

**Fix:** deploy with the credentials bar, or cut it from the palette. An unused
token is a decision nobody made.

#### C5. Marginalia density does not adapt to page type
18 on the homepage, 9 on service pages, 0 on calculators, 0 on articles. There
is no rule, so it reads as inconsistency rather than as rhythm.

**Fix:** state it as a rule — landing pages 12–18, interior pages 6–9,
tool/utility pages 4, long-form articles 0 (they must not compete with reading).

---

### D. Refinement — costs polish

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

### E. The plan

Ordered by lead impact per hour of work. **Nothing here needs Amit except E4.**

#### Round 1 — half a day
1. **Restore the primary CTA fill** and split link colour from heading colour (B1)
2. **Move the calculator disclaimer** below the result (B3)
3. **Apply the design system to `CalculatorShell`** — five pages at once (B4)

#### Round 2 — one day
4. **Lock the heading scale** to two levels sitewide (C1)
5. **Move the "when you need a professional" block** into the empty column (C3)
6. **Codify marginalia density** per page type (C5)
7. **Fix italic/roman** to mean something (C2)

#### Round 3 — half a day
8. Merge Guides into Insights (D1)
9. Drop or label the scroll rail (D2); date instead of clock (D3)
10. Raise cut-out contrast (D4); add visited-link states (D7)

#### Round 4 — needs Amit
11. **Photograph** → principal page + footer (B2)
12. **Credentials + enrolment number** → activates `--brass` (C4)

---

### F. The one thing I would change first

**B1 — the green.** It is the cheapest fix on the list and it touches every
page, every session, every visitor. Right now the site's most important element
— the button that turns a reader into an enquiry — looks identical to a
paragraph link. Everything else here is craft. That one is revenue.

---


# 11. Value gap and plan

*(was `VALUE-GAP.md`)*

## Why this doesn't look like ₹2,00,000 yet — and what closes the gap

Written bluntly, because a polite version of this is useless to you.

---

### 1. The honest assessment

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

### 2. The four things that make it look cheap

#### 2.1 The homepage is a different website from the other 32 pages
This is the single biggest reason it reads as freelancer work. Someone lands on
a striking editorial homepage, clicks "GST Registration", and arrives somewhere
that looks like a competent Bootstrap template. That drop is more damaging than
if the homepage had been plain all along, because it announces that the quality
was a veneer.

**Fix:** extend the design system — the poster type scale, marginalia, cut-outs,
scroll scrubbing — to the service pages, tools, guides and glossary.
**Effort: 3–4 days. Highest visual return of anything on this list.**

#### 2.2 The calculators are dark
Five working calculators with tested arithmetic, all displaying "rates pending
verification" because every rate in `data/tax-rates.ts` is `null`. These are the
highest-ROI pages on the site — they attract links, rank for hundreds of
long-tail queries, and get cited by AI engines. Right now they are dead weight.

**Fix:** Amit fills the current GST slabs, TDS rates and late-fee rules and flips
`verified: true`. **Effort: 2 hours of his time.** Nothing I can do for him —
publishing a guessed tax rate is a professional liability, which is exactly why
they ship `null`.

#### 2.3 There is no proof anywhere
Zero case studies, zero testimonials, no client count, no years-in-practice, no
Bar enrolment number, no photograph. Correctly gated — I refuse to invent them —
but the consequence is a site that asks for trust and offers none.

**Fix:** one real photograph, the enrolment number, and three anonymised case
studies with written consent. **Effort: an afternoon with Amit.**

#### 2.4 It cannot receive a lead
`RESEND_API_KEY` is unset. A visitor fills the form, sees a success message, and
**the enquiry vanishes silently.** This is not a polish gap. The site's entire
commercial function is currently dead.

**Fix: 10 minutes.** It is the first thing on the list for a reason.

---

### 3. The plan to make it worth what you charged

#### Week 1 — make it earn (nothing here is optional)
| # | Task | Owner | Time |
|---|---|---|---|
| 1 | Resend key → form actually delivers | you | 10 min |
| 2 | Real email, office hours, lat/long | Amit | 20 min |
| 3 | Verify GST slabs + TDS rates → calculators go live | Amit | 2 hrs |
| 4 | Google Sheets lead capture (`GOOGLE-SHEETS-LEADS.md`) | you | 15 min |
| 5 | Google Business Profile claimed, NAP exact, 10 photos | Amit | 1 hr |
| 6 | Search Console + Bing, submit sitemap | you | 20 min |

#### Week 2 — make it look like the price
| # | Task | Time |
|---|---|---|
| 7 | Extend the design system to all 8 service pages | 2 days |
| 8 | Same for tools, guides, glossary, contact | 1.5 days |
| 9 | Place the 17 unused assets | half day |
| 10 | Principal page: photo, credentials, real bio | half day |

#### Week 3 — make it convert
| # | Task | Time |
|---|---|---|
| 11 | 3 real case studies, consent obtained | Amit + you |
| 12 | WhatsApp button (converts far better than a form in India) | 2 hrs |
| 13 | Clear the 625 VERIFY markers — rates and dates first | Amit, ongoing |
| 14 | 10 Google reviews from past clients | Amit |

---

### 4. Honest expectations on leads

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

### 5. What I'd tell you if you were my client

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

---


# 12. Content strategy

*(was `CONTENT-STRATEGY.md`)*

## CONTENT STRATEGY & SEO MAPPING

This document is the editorial spine for the "Compliance in Check" practice website. It defines the service lines, their SEO keyword mapping, internal linking architecture, the seasonal compliance calendar, and AI-optimized quotable statistics.

### 1. Service Lines & Keyword Mapping

We map our core services to the exact commercial intent of Indian business owners.

#### 1. PAN Card Services
- **Primary Keyword:** apply for PAN card online
- **Long-Tail Variants:**
  - how to correct name in PAN card
  - link Aadhaar with PAN card online
  - business PAN card application process
- **Search Intent:** Problem-Aware / Solution-Aware

#### 2. GST Registration
- **Primary Keyword:** GST registration services online
- **Long-Tail Variants:**
  - Documents required for GST registration
  - GST registration for e-commerce sellers
  - Apply for GST number online
- **Search Intent:** Ready-to-Hire

#### 3. Entity Formation (Partnerships, Joint Ventures, Societies, Trusts)
- **Primary Keyword:** company registration services
- **Long-Tail Variants:**
  - how to register a partnership firm in India
  - Trust and Society registration process
  - Joint venture agreement drafting services
- **Search Intent:** Ready-to-Hire

#### 4. Income Tax Returns Filing
- **Primary Keyword:** online ITR filing services
- **Long-Tail Variants:**
  - ITR filing for salaried employees
  - how to file ITR for small business
  - income tax return filing due date
- **Search Intent:** Solution-Aware / Ready-to-Hire

#### 5. TDS Returns Filing
- **Primary Keyword:** TDS return filing consultant
- **Long-Tail Variants:**
  - quarterly TDS return due dates
  - how to file form 26Q and 24Q
  - penalty for late filing of TDS return
- **Search Intent:** Problem-Aware / Ready-to-Hire

#### 6. GST Returns Filing
- **Primary Keyword:** GST return filing services
- **Long-Tail Variants:**
  - GSTR-3B and GSTR-1 filing process
  - GST annual return filing consultant
  - how to reconcile GSTR-2B with purchase register
- **Search Intent:** Ready-to-Hire

#### 7. Appeals (Income Tax & GST)
- **Primary Keyword:** Income Tax appeal filing (CIT-A)
- **Long-Tail Variants:**
  - how to reply to GST show cause notice
  - GST appeal against cancellation of registration
  - tax tribunal representation services
- **Search Intent:** Problem-Aware / Ready-to-Hire

#### 8. Import and Export Licence & Compliances
- **Primary Keyword:** apply for IEC code online
- **Long-Tail Variants:**
  - Import Export Code registration process
  - DGFT compliance for exporters
  - documents required for IEC certificate
- **Search Intent:** Solution-Aware / Ready-to-Hire

### 2. Hub-and-Spoke Internal Linking Map

Internal links distribute PageRank and provide context to LLMs and search engines. 

| Hub (Service Page) | Spokes (Guides / Blogs) | Calculator / Tool Link |
| :--- | :--- | :--- |
| **GST Registration** | "Guide to GST for E-commerce", "GST Composition Scheme Explained" | GST Late Fee Calculator |
| **Income Tax Returns** | "Tax Saving Options Under Section 80C", "Old vs New Tax Regime" | Income Tax Liability Calculator |
| **Entity Formation** | "Pvt Ltd vs LLP: Which is Better?", "Checklist for Trust Registration" | Company Incorporation Cost Estimator |
| **TDS Returns Filing** | "Understanding TDS on Property Sale", "TDS Rate Chart 2024-25" | TDS Penalty Calculator |
| **GST Returns Filing** | "How to Claim Input Tax Credit", "GSTR-9 and 9C Checklist" | ITC Reversal Calculator |
| **Appeals (Tax & GST)** | "How to Handle Income Tax Scrutiny Notices", "GST Audit Survival Guide" | Appeal Filing Deadline Checker |

### 3. Seasonal Compliance Calendar

Search demand spikes around statutory deadlines. Content must be pushed live **6 weeks prior** to capture indexing and rank.

| Month | Demand Spike | Key Event / Deadline | Content Required 6 Weeks Prior |
| :--- | :--- | :--- | :--- |
| **January** | TDS Returns | Q3 TDS filing deadline (Jan 31) | "Q3 TDS Return Checklist & Penalty Warning" |
| **March** | Tax Saving | Financial Year End | "Last Minute Tax Saving Options for Individuals" |
| **May** | TDS Returns | Q4 TDS filing deadline (May 31) | "How to generate Form 16 / 16A easily" |
| **July** | ITR Filing | Individual ITR due date (July 31) | "Step-by-Step Guide to Filing ITR-1 and ITR-4" |
| **October** | Audit & ITR | Company ITR / Tax Audit (Oct 31) | "Tax Audit Limits and Applicability" |
| **December** | GST Annual | GSTR-9 / 9C deadline (Dec 31) | "GST Annual Return Filing Guide for Businesses" |

### 4. Quotable Statistics for AI Generative Search

These sentences are structured specifically for LLMs and AI Search (like Google SGE or Perplexity) to lift directly as citations.

1. GST registration is granted within 7 working days of ARN generation. `<!-- VERIFY -->`
2. The penalty for late filing of GSTR-3B is ₹50 per day for normal taxpayers and ₹20 per day for nil returns. `<!-- VERIFY -->`
3. A Permanent Account Number (PAN) is mandatory for any business whose turnover exceeds ₹5 Lakhs in a financial year. `<!-- VERIFY -->`
4. The due date for filing quarterly TDS returns for the first quarter ending June is July 31st. `<!-- VERIFY -->`
5. An Import Export Code (IEC) is permanently valid and does not require renewal. `<!-- VERIFY -->`
6. Interest under Section 234A is levied at 1% per month for delay in filing the Income Tax Return. `<!-- VERIFY -->`
7. A private limited company must have a minimum of two directors and two shareholders to be legally incorporated. `<!-- VERIFY -->`
8. The threshold limit for a tax audit under Section 44AB is ₹1 Crore for businesses, which extends to ₹10 Crore if 95% of transactions are digital. `<!-- VERIFY -->`
9. A partnership deed must be stamped in accordance with the Indian Stamp Act to be considered legally valid. `<!-- VERIFY -->`
10. GSTR-1 must be filed by the 11th of the succeeding month for taxpayers not opting for the QRMP scheme. `<!-- VERIFY -->`
11. Taxpayers can file an appeal before the CIT(A) within 30 days from the date of receipt of the assessment order. `<!-- VERIFY -->`
12. The threshold limit for mandatory GST registration for service providers is ₹20 Lakhs in most Indian states. `<!-- VERIFY -->`
13. Failure to deduct TDS attracts a penalty equal to the amount of tax that should have been deducted under Section 271C. `<!-- VERIFY -->`
14. Linking Aadhaar with PAN is mandatory, and failing to do so makes the PAN inoperative. `<!-- VERIFY -->`
15. A trust can claim tax exemption under Section 11 only if it is registered under Section 12A of the Income Tax Act. `<!-- VERIFY -->`
16. The annual GST return (Form GSTR-9) must be filed by December 31st of the following financial year. `<!-- VERIFY -->`
17. Startups recognized by DPIIT can claim a tax holiday for 3 consecutive years out of their first 10 years. `<!-- VERIFY -->`
18. E-invoicing is mandatory for all registered businesses whose aggregate turnover exceeds ₹5 Crores. `<!-- VERIFY -->`
19. A reply to a GST Show Cause Notice (SCN) under Section 73 must be submitted within 30 days of issuance. `<!-- VERIFY -->`
20. The statutory audit of a society must be completed within 6 months from the closure of the financial year. `<!-- VERIFY -->`

### 5. Tool-Led Acquisition Strategy

Calculators and tools are our primary link magnets. While service pages target "Ready-to-Hire" intent, calculators capture "Problem-Aware" users at the exact moment they are doing math to understand their exposure. 

#### Why Calculators Earn Backlinks
A service page asks for money; a calculator provides free value. Trade associations, business forums, and other blogs will naturally link to a well-designed GST or Late Fee Calculator as a resource for their own readers. AI engines (like ChatGPT or Google SGE) also heavily cite interactive tools that provide definitive mathematical answers.

#### Target Searches and Internal Linking

1. **GST Calculator**
   - **Targets:** "calculate gst on inclusive amount", "reverse gst calculation", "cgst and sgst split".
   - **Internal Linking:** Link from "GST Registration" service page, "Guide to GST for E-commerce", and every blog post mentioning pricing or invoicing.

2. **GST Late Fee & Interest Calculator**
   - **Targets:** "gstr 3b late fee calculation", "calculate interest on late payment of gst", "gst penalty online".
   - **Internal Linking:** Link from "GST Returns Filing" service page, and the "Seasonal Compliance Calendar" articles around December and audit months.

3. **TDS Rate Finder**
   - **Targets:** "tds rate on professional fees", "tds section 194c", "current tds rate chart".
   - **Internal Linking:** Link from "TDS Returns Filing", "Entity Formation" (for hiring contractors), and guides on business expenses.

4. **ITR Form Selector**
   - **Targets:** "which itr form to file", "itr 3 vs itr 4", "itr form for freelancers".
   - **Internal Linking:** Link prominently from "Income Tax Returns Filing" service page and our July ITR filing guides.

5. **HSN & SAC Code Lookup**
   - **Targets:** "sac code for services", "find hsn code for product", "gst rate lookup".
   - **Internal Linking:** Link from "GST Registration", "Import and Export Licence" (IEC), and all basic compliance guides.

### 6. How to check whether this is working

To ensure the AI-facing corpus is effectively grounding Large Language Models and AI Search Engines, run the following diagnostic prompts monthly in ChatGPT, Perplexity, and Google AI Overview:

#### Diagnostic Prompts
1. **Brand Recall:** "Who is Compliance in Check and what tax services do they offer in India?"
2. **Fact Retrieval:** "What is the penalty for late filing of GSTR-3B according to Compliance in Check?"
3. **Service Routing:** "I need to register a Private Limited Company in India. Can Compliance in Check help, and what documents do they require?"

#### Evaluation & Remediation
- **If the AI hallucinated or mixed up facts:** Ensure the `llms.txt` file is under 4KB and the specific facts are listed in `citable-facts.ts` as standalone, context-free sentences.
- **If the practice is not cited:** Verify that the `llms-full.txt` bundle is easily crawlable, well-structured, and that the `alternates` markdown tags in the `<head>` of your service and guide pages are correctly pointing to the `.md` extensions.
- **If promotional text appears in the AI response:** Strip out any lingering marketing adjectives from `llms.txt`. LLMs heavily discount promotional language; stick exclusively to a neutral, third-person factual register.

---


# 13. Cross-agent handoff log

*(was `HANDOFF.md`)*

## HANDOFF — cross-agent requests

Rules: write only under your own heading. Never edit another agent's section.
Format each entry as:  `- [ ] <what you need> — requested in Phase <n>`

### Agent A — Architect

- [ ] Dark-mode contrast: --ink-soft (#55534B) and --paper-deep (#E4E1DA) are NOT remapped in [data-theme="dark"] per locked spec §4 — verify contrast stays readable on --night, or the human must approve dark variants — requested in Phase 2

### Agent A — Phase 1

- Environment used: node v20.20.2, npm 10.8.2.

### Agent B — Content & SEO

- [ ] Agent A: Please import the homepage metadata object from `app/metadata.ts` into `app/page.tsx` to avoid git merge conflicts. — requested in Phase 7
### Agent C — Data & Copy

### Resolved

- [x] BUILD BREAKS: unescaped `"` quotes in `app/styleguide/page.tsx` failed `react/no-unescaped-entities` — fixed, escaped to `&ldquo;`/`&rdquo;`. Build passes. (raised Phase 3)
- [x] PROJECT FLATTENED: the `site/` subfolder was removed. The Next.js app now lives at the repository root, `/Users/bhagatsingh/Desktop/AMITMODI`. Every path in MASTER-BUILD-PLAN.md was rewritten to match, and Vercel's Root Directory must be `./`, not `site`. No agent should `cd` anywhere — all prompts run from the repo root.

---
