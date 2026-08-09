/*
 * lib/ics.ts — builds the compliance-calendar .ics subscription (Phase 15, Agent A).
 *
 * The .ics is generated at build time from data/compliance-calendar.ts and
 * served statically from /compliance-calendar/calendar.ics. Only entries with
 * `verified: true` AND a real due day appear; every entry in the data file
 * starts unverified, so the calendar is honestly empty until a human confirms
 * the dates — an empty subscription beats a wrong deadline.
 *
 * Rules are recurring (RRULE), so a visitor who subscribes once gets a
 * standing reminder every month/quarter/year rather than a one-off alert:
 *   monthly   → FREQ=MONTHLY;BYMONTHDAY=<day>
 *   quarterly → FREQ=MONTHLY;BYMONTH=1,4,7,10;BYMONTHDAY=<day>
 *   annual    → FREQ=YEARLY;BYMONTH=<month>;BYMONTHDAY=<day>   (month required)
 *
 * Annual entries without a due month are skipped rather than guessed at.
 */

import { COMPLIANCE_CALENDAR } from "@/data/compliance-calendar";

/** The fields the .ics builder needs. The data file is `as const`, so the
    literal `verified: false` types are broadened here via `unknown`. */
type CalendarEntry = {
  id: string;
  formName: string;
  description: string;
  dueDay: number;
  dueMonth?: number;
  frequency: string;
  appliesTo: readonly string[];
  statuteRef: string;
  verified: boolean;
};

const ALLOWED_FREQUENCIES = new Set(["monthly", "quarterly", "annual"]);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.complianceincheck.com";

/** Escape a text value for the iCalendar line-oriented format. */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold a line at 75 octets per RFC 5545. */
function fold(line: string): string {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = rest.slice(74);
  }
  chunks.push(rest);
  return chunks.map((chunk, i) => (i === 0 ? chunk : ` ${chunk}`)).join("\r\n");
}

function rruleFor(entry: CalendarEntry): string | null {
  if (entry.frequency === "monthly") {
    return `FREQ=MONTHLY;BYMONTHDAY=${entry.dueDay}`;
  }
  if (entry.frequency === "quarterly") {
    return `FREQ=MONTHLY;BYMONTH=1,4,7,10;BYMONTHDAY=${entry.dueDay}`;
  }
  if (entry.frequency === "annual") {
    if (!entry.dueMonth) return null;
    return `FREQ=YEARLY;BYMONTH=${entry.dueMonth};BYMONTHDAY=${entry.dueDay}`;
  }
  return null;
}

function eventFor(entry: CalendarEntry, anchorYear: number): string[] {
  const rrule = rruleFor(entry);
  if (!rrule) return [];
  const startMonth =
    entry.frequency === "annual" && entry.dueMonth ? String(entry.dueMonth).padStart(2, "0") : "01";
  const startDay = String(entry.dueDay).padStart(2, "0");
  const summary = `${entry.formName} — ${entry.description}`;
  const description = [
    entry.formName,
    entry.description,
    entry.appliesTo.length > 0 ? `Applies to: ${entry.appliesTo.join(", ")}.` : "",
    entry.statuteRef ? `Reference: ${entry.statuteRef}.` : "",
  ]
    .filter(Boolean)
    .join(". ");

  return [
    "BEGIN:VEVENT",
    `UID:${entry.id}@complianceincheck.com`,
    `DTSTAMP:${anchorYear}0101T000000Z`,
    `DTSTART;VALUE=DATE:${anchorYear}${startMonth}${startDay}`,
    `RRULE:${rrule}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(description)}`,
    `URL:${SITE_URL}/compliance-calendar`,
    "END:VEVENT",
  ];
}

/**
 * The complete .ics file. Deterministic at build time — it depends only on the
 * verified entries in data/compliance-calendar.ts and the anchor year.
 */
export function buildCalendarICS(): string {
  const anchorYear = new Date().getFullYear();
  const entries = (COMPLIANCE_CALENDAR as readonly unknown[] as readonly CalendarEntry[])
    .filter((entry) => entry.verified === true && entry.dueDay > 0)
    .filter((entry) => ALLOWED_FREQUENCIES.has(entry.frequency));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Compliance in Check//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Compliance in Check — statutory deadlines",
    "X-WR-TIMEZONE:Asia/Kolkata",
  ];

  for (const entry of entries) {
    lines.push(...eventFor(entry, anchorYear));
  }

  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
