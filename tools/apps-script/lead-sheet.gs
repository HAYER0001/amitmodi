/**
 * lead-sheet.gs — receives every consultation enquiry from the website and appends
 * it as a row.
 *
 * Paste into: your Google Sheet → Extensions → Apps Script (replace Code.gs).
 * Setup steps are in tools/apps-script/README.md.
 *
 * Matches the payload sent by lib/sheets.ts exactly:
 *   { secret, timestamp, name, phone, email?, service, situation, urgency,
 *     message?, source? }
 */

/** Columns, in order. Must stay in sync with LeadRow in lib/sheets.ts. */
var HEADERS = [
  'Received (IST)',
  'Name',
  'Phone',
  'Email',
  'Service',
  'Situation',
  'Urgency',
  'Message',
  'Source'
];

function doPost(e) {
  // One writer at a time. Two enquiries landing together would otherwise both
  // read the same last row and one would overwrite the other.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty body' });
    }

    var body = JSON.parse(e.postData.contents);

    // Shared secret. Stored in Script Properties, never in this file — the
    // script travels with the sheet if it is ever shared.
    var expected = PropertiesService.getScriptProperties()
      .getProperty('SHARED_SECRET');

    if (!expected || body.secret !== expected) {
      // Deliberately vague. Do not confirm whether the secret exists.
      return json({ ok: false, error: 'rejected' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // First write creates the header row and freezes it.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    // The site sends UTC. Store it in IST so the row reads correctly to the
    // person who has to call this lead back.
    var received = body.timestamp ? new Date(body.timestamp) : new Date();
    var ist = Utilities.formatDate(
      received,
      'Asia/Kolkata',
      'yyyy-MM-dd HH:mm:ss'
    );

    sheet.appendRow([
      ist,
      body.name || '',
      // Leading apostrophe keeps +91… as text. Without it Sheets treats a
      // leading + as a formula and the number is mangled.
      body.phone ? "'" + body.phone : '',
      body.email || '',
      body.service || '',
      body.situation || '',
      body.urgency || '',
      body.message || '',
      body.source || ''
    ]);

    return json({ ok: true });
  } catch (err) {
    // Never log the enquiry itself — it holds a real person's phone and email.
    console.error('append failed: ' + (err && err.message));
    return json({ ok: false, error: 'failed' });
  } finally {
    lock.releaseLock();
  }
}

/** Apps Script always answers 200; the body carries the real result. */
function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this ONCE from the editor to store the secret.
 * Put the same value in Vercel as SHEETS_SHARED_SECRET.
 */
function setSecret() {
  var SECRET = 'PASTE-YOUR-SECRET-HERE';
  if (SECRET === 'PASTE-YOUR-SECRET-HERE') {
    throw new Error('Edit setSecret() and put your real secret in first.');
  }
  PropertiesService.getScriptProperties().setProperty('SHARED_SECRET', SECRET);
  Logger.log('Secret stored. You can blank it out of this function now.');
}

/** Run this to prove the sheet accepts a row before touching the live site. */
function selfTest() {
  var secret = PropertiesService.getScriptProperties()
    .getProperty('SHARED_SECRET');
  if (!secret) throw new Error('Run setSecret() first.');

  var res = doPost({
    postData: {
      contents: JSON.stringify({
        secret: secret,
        timestamp: new Date().toISOString(),
        name: 'Test row — delete me',
        phone: '+919999999999',
        email: 'test@example.com',
        service: 'gst-registration',
        situation: 'test',
        urgency: 'not-urgent',
        message: 'Written by selfTest()',
        source: 'apps-script-selftest'
      })
    }
  });
  Logger.log(res.getContent());
}
