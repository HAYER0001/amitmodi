/*
 * lib/sheets.ts — mirror every consultation enquiry into a Google Sheet.
 *
 * WHY A WEB APP AND NOT THE SHEETS API
 * The Sheets API needs a Google Cloud project, a service account, a JSON key
 * file and OAuth scopes — and the key would have to live in the repo's env. An
 * Apps Script Web App is a single URL that appends a row. No SDK, no key, no
 * extra dependency in the bundle. For "put the lead in a spreadsheet" that is
 * the whole job.
 *
 * WHY IT NEVER THROWS
 * This runs alongside the Resend email in the consultation route. If the sheet
 * is unreachable — script redeployed, quota hit, Google having a bad morning —
 * the enquiry must still reach the practice by email and the visitor must still
 * see success. A spreadsheet copy is a convenience; the email is the product.
 * Every failure here is logged and swallowed.
 */

export type LeadRow = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  situation: string;
  urgency: string;
  message?: string;
  /** Where the enquiry came from, for attribution. */
  source?: string;
};

/**
 * Appends one row. Returns true on success, false on any failure — callers are
 * expected to ignore the result and carry on.
 */
export async function appendLeadToSheet(lead: LeadRow): Promise<boolean> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SHARED_SECRET;

  // Not configured yet is a normal state, not an error. Say nothing.
  if (!url) return false;

  try {
    /*
     * A 6s ceiling. Without it a hanging Google request would hold the whole
     * API route open, and the visitor would sit on a spinner waiting for a
     * spreadsheet they will never see.
     */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        timestamp: new Date().toISOString(),
        ...lead,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[sheets] append failed: HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    /* Never log the lead itself — it holds a real person's phone and email. */
    console.error(
      "[sheets] append threw:",
      err instanceof Error ? err.message : "unknown error",
    );
    return false;
  }
}
