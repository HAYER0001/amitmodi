# Sending every enquiry into a Google Sheet

Fifteen minutes, no coding. Every consultation request will land as a new row,
**and** still arrive by email exactly as it does now.

> **The email is the product; the sheet is a convenience.** The site is built so
> that if the spreadsheet is unreachable — script redeployed, quota hit, Google
> having a bad morning — the enquiry still sends and the visitor still sees
> success. You will never lose a lead because a spreadsheet was down.

---

## Step 1 — Make the sheet

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

## Step 2 — Add the script

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

## Step 3 — Deploy it

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

## Step 4 — Tell the website about it

In Vercel → your project → **Settings → Environment Variables**, add two:

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from Step 3 |
| `SHEETS_SHARED_SECRET` | the exact string from Step 2 |

Then **Deployments → ⋯ → Redeploy**. Environment variables are read at build
time, so an existing deployment will not pick them up.

---

## Step 5 — Test it

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

## Optional — get a phone alert on every lead

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

## What this deliberately does not do

- **No Google Cloud project, service account, or JSON key.** The Sheets API
  would need all three, and the key would have to live in the repo's
  environment. A Web App URL plus a shared secret does the same job with
  nothing to leak.
- **No spreadsheet write on the visitor's critical path.** The request is capped
  at 6 seconds and every failure is swallowed, so a slow Google can never make
  someone sit on a spinner or see an error for an enquiry that actually sent.
- **Nothing sensitive is logged.** Failures record the reason, never the row —
  the payload holds a real person's phone number and tax situation.
