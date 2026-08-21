# Google Sheet lead mirror — setup

Every consultation enquiry is written here before the notification email is
attempted, so a lead survives even when email is misconfigured or rate-limited.

Paste `lead-sheet.gs` into the sheet's Apps Script editor and follow these steps.

## 1. Create the sheet
New Google Sheet. Name it something obvious — "Amit Modi & Co. — Leads".
Leave it empty; the script writes its own header row on the first enquiry.

## 2. Add the script
**Extensions → Apps Script.** Delete whatever is in `Code.gs` and paste the
whole of `lead-sheet.gs`. Save.

## 3. Generate a secret
Any long random string. From a terminal:

```
openssl rand -hex 32
```

Keep it somewhere safe — it goes in two places and must match exactly.

## 4. Store the secret in the script
In the editor, open `setSecret()`, replace `PASTE-YOUR-SECRET-HERE` with the
value from step 3, then **Run** it once. Approve the permission prompt.

It is stored in Script Properties, not in the file — so if the sheet is ever
shared with an accountant, the secret does not travel with it. Blank the value
back out of `setSecret()` afterwards.

## 5. Prove it works before going near the live site
Run `selfTest()`. A test row should appear in the sheet. If it does not, the
problem is here, not in the website — fix it now rather than debugging through
a live form.

Delete the test row afterwards.

## 6. Deploy as a Web App
**Deploy → New deployment → gear icon → Web app.**

| Setting | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — Vercel's servers call this URL unauthenticated. The
shared secret is what protects it, which is why step 3 must be a real random
string and not a word.

Copy the **Web app URL**. It ends in `/exec`.

## 7. Add both values to Vercel
**Vercel → project → Settings → Environment Variables:**

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from step 6 |
| `SHEETS_SHARED_SECRET` | the secret from step 3 |

Redeploy.

## 8. Test end to end
Submit the real consultation form on the live site. A row should appear.

---

## Notes

**Re-deploying after an edit.** Apps Script keeps the old code live until you
publish a new version. After changing the script: **Deploy → Manage deployments
→ edit → Version: New version → Deploy.** The URL stays the same. Forgetting
this is the usual reason "my change did nothing".

**A wrong secret looks like success from the website's side.** Apps Script
always answers HTTP 200 — it cannot return a 401 — so `lib/sheets.ts` sees a
200 and logs success while the script quietly refuses to write. The only
reliable check is whether a row actually appears. That is why step 8 exists.

**Phone numbers are stored with a leading apostrophe** so Sheets treats `+91…`
as text. Without it a leading `+` is read as a formula and the number is
mangled.

**Nothing here is a substitute for email.** The sheet is the safety net. Set
`RESEND_API_KEY` and `CONTACT_TO_EMAIL` as well — see `GO-LIVE-CHECKLIST.md`
step 1a.
