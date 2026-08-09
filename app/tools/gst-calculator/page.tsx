import type { Metadata } from "next";
import GSTCalculator from "@/components/tools/GSTCalculator";
import { parseGSTQuery } from "@/lib/calc/gst";
import { queryStringFromParams } from "../_params";

/*
 * app/tools/gst-calculator/page.tsx — SSR entry for the GST calculator.
 *
 * The server parses the URL query through the tested parseGSTQuery and
 * merges validated values over the defaults; the client component then owns
 * the live inputs and keeps the URL in sync for shareable results.
 */

const DEFAULTS = { amount: 10000, mode: "exclusive", ratePct: 18, place: "intra-state" } as const;

const CANONICAL = "/tools/gst-calculator";

export const metadata: Metadata = {
  title: "GST Amount Calculator — CGST, SGST & IGST | Compliance in Check",
  description:
    "Calculate GST on any supply instantly — from an amount with or without GST, split into CGST + SGST (intra-state) or IGST (inter-state) at the correct slab rate.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "Compliance in Check",
    title: "GST Amount Calculator",
    description: "GST on any supply, split into CGST + SGST or IGST at the correct slab rate.",
  },
  robots: { index: true, follow: true },
};

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
