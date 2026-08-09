import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { COMPLIANCE_CALENDAR } from "@/data/compliance-calendar";

/*
 * app/compliance-calendar/page.tsx — a public, indexable calendar of the
 * statutory deadlines (Phase 15, Agent A).
 *
 * Only entries flagged `verified: true` in data/compliance-calendar.ts are
 * shown. Every entry in that file starts unverified, so until a human confirms
 * the dates the page shows an honest empty state — a wrong due date on a tax
 * practice's website is worse than no date. A build-time .ics subscription
 * (/compliance-calendar/calendar.ics) turns the same verified list into
 * recurring reminders, once a month, forever.
 */

export const metadata: Metadata = {
  title: "Compliance Calendar — Statutory Deadlines | Compliance in Check",
  description:
    "The recurring deadlines an Indian business carries — monthly, quarterly, and annual GST, income tax, TDS, and statutory filings. Subscribe to the .ics and never miss one.",
  alternates: { canonical: "/compliance-calendar" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/compliance-calendar",
    siteName: "Compliance in Check",
    title: "Compliance Calendar — Statutory Deadlines",
    description:
      "Verified recurring deadlines for GST, income tax, and TDS filings, with a subscribe-able calendar.",
  },
  robots: { index: true, follow: true },
};

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

const FREQUENCY_ORDER = ["monthly", "quarterly", "annual"] as const;
const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
};

function dayLabel(day: number): string {
  if (day <= 0) return "Date pending verification";
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `By the ${day}${suffix}`;
}

export default function ComplianceCalendarPage() {
  const entries = (
    COMPLIANCE_CALENDAR as readonly unknown[] as readonly CalendarEntry[]
  ).filter((entry) => entry.verified === true);

  const groups = FREQUENCY_ORDER.map((frequency) => ({
    frequency,
    label: FREQUENCY_LABELS[frequency],
    entries: entries.filter((entry) => entry.frequency === frequency),
  })).filter((group) => group.entries.length > 0);

  return (
    <>
      <div className="bg-paper-deep">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Breadcrumbs />
          <header className="max-w-2xl pb-10 pt-4">
            <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
              Compliance Calendar
            </p>
            <h1 className="mt-3 font-display text-display text-ink">
              The deadlines, on a calendar.
            </h1>
            <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
              Every deadline on this page has been checked against the current
              statute and the government&apos;s notifications before it is shown.
              Subscribe to the calendar and each deadline comes to you as a
              recurring reminder.
            </p>
          </header>

          <div className="flex flex-wrap items-center gap-4 pb-10">
            <Link
              href="/compliance-calendar/calendar.ics"
              className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-seal px-6 font-label text-sm uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
            >
              Add to your calendar (.ics) <span aria-hidden="true">↓</span>
            </Link>
            <p className="max-w-sm font-body text-sm leading-relaxed text-ink-soft">
              Opens in Google Calendar, Apple Calendar, or Outlook. Updates
              whenever the practice verifies a changed deadline.
            </p>
          </div>

          {groups.length === 0 ? (
            <section className="rounded-md border border-rule bg-paper p-8 shadow-cut">
              <h2 className="font-display text-h2 text-ink">Deadlines are being verified.</h2>
              <p className="mt-3 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
                Nothing is listed yet because nothing on this page is shown
                until a human has confirmed it against the current statute and
                notifications. A wrong due date is worse than no date. Check
                back, or add the calendar above now — it will populate itself
                as each deadline is verified.
              </p>
            </section>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.frequency} aria-labelledby={`freq-${group.frequency}`}>
                  <h2
                    id={`freq-${group.frequency}`}
                    className="border-b-2 border-rule pb-2 font-display text-h2 text-brass"
                  >
                    {group.label}
                  </h2>
                  <ul className="mt-4 divide-y divide-rule border border-rule bg-paper shadow-cut">
                    {group.entries.map((entry) => (
                      <li key={entry.id} className="grid gap-2 p-5 sm:grid-cols-[220px_1fr] sm:gap-6">
                        <div>
                          <p className="font-label text-base font-medium text-ink">{entry.formName}</p>
                          <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-stamp">
                            {dayLabel(entry.dueDay)}
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-body leading-relaxed text-ink">
                            {entry.description}
                          </p>
                          <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
                            Applies to {entry.appliesTo.join(", ")}.{" "}
                            <span className="text-ink-soft/70">{entry.statuteRef}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          <p className="mt-10 border-t border-rule pt-6 font-body text-sm leading-relaxed text-ink-soft">
            This calendar is general information, not advice for your specific
            filing. Verify each deadline against your own obligations before
            relying on it.
          </p>
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}
