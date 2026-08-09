import { buildCalendarICS } from "@/lib/ics";

/*
 * app/compliance-calendar/calendar.ics/route.ts — the subscribe-able calendar.
 *
 * Generated once at build time (force-static) from the verified entries in
 * data/compliance-calendar.ts, so the visitor gets a stable, cacheable file
 * that their calendar app can poll — a recurring reminder of the practice,
 * once a month, forever. The content is identical to what the page shows.
 */

export const dynamic = "force-static";

export function GET() {
  const body = buildCalendarICS();
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="compliance-in-check-calendar.ics"',
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
