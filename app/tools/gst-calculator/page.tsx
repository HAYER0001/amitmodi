import type { Metadata } from "next";
import GSTCalculator from "@/components/tools/GSTCalculator";
import { parseGSTQuery } from "@/lib/calc/gst";
import { queryStringFromParams } from "../_params";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/tools/gst-calculator/page.tsx — SSR entry for the GST calculator.
 *
 * The server parses the URL query through the tested parseGSTQuery and
 * merges validated values over the defaults; the client component then owns
 * the live inputs and keeps the URL in sync for shareable results.
 */

const DEFAULTS = { amount: 10000, mode: "exclusive", ratePct: 18, place: "intra-state" } as const;

export const metadata: Metadata = buildMetadata({
  title: withSiteName("GST Amount Calculator — CGST, SGST & IGST"),
  description:
    "Calculate GST on any supply — split into CGST + SGST (intra-state) or IGST (inter-state) at the correct slab rate.",
  path: "/tools/gst-calculator",
});

export default async function GSTCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseGSTQuery(queryStringFromParams(params));
  const initial = {
    amount: parsed.amount ?? DEFAULTS.amount,
    mode: parsed.mode ?? DEFAULTS.mode,
    ratePct: parsed.ratePct ?? DEFAULTS.ratePct,
    place: parsed.place ?? DEFAULTS.place,
  };

  return <GSTCalculator initial={initial} />;
}
