import type { Metadata } from "next";
import LateFeeCalculator from "@/components/tools/LateFeeCalculator";
import { parseLateFeeQuery } from "@/lib/calc/gst-late-fee";
import { queryStringFromParams } from "../_params";

/*
 * app/tools/late-fee-calculator/page.tsx — SSR entry for the late-fee tool.
 */

const DEFAULTS = {
  returnType: "gstr-3b",
  filingStatus: "regular",
  turnoverSlabId: "upto-1.5cr",
  daysLate: 40,
  taxPayable: 0,
} as const;

const CANONICAL = "/tools/late-fee-calculator";

export const metadata: Metadata = {
  title: "GST Late Fee & Interest Calculator | Compliance in Check",
  description:
    "Work out the late fee and 18% interest on a delayed GSTR-1 or GSTR-3B. Per-day fee, turnover-tier caps, and net cash tax — all itemised.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "Compliance in Check",
    title: "GST Late Fee & Interest Calculator",
    description: "The true cost of a missed GST due date: per-day late fee plus 18% interest, itemised.",
  },
  robots: { index: true, follow: true },
};

export default async function LateFeeCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseLateFeeQuery(queryStringFromParams(params));
  const initial = {
    returnType: parsed.returnType ?? DEFAULTS.returnType,
    filingStatus: parsed.filingStatus ?? DEFAULTS.filingStatus,
    turnoverSlabId: parsed.turnoverSlabId ?? DEFAULTS.turnoverSlabId,
    daysLate: parsed.daysLate ?? DEFAULTS.daysLate,
    taxPayable: parsed.taxPayable ?? DEFAULTS.taxPayable,
  };

  return <LateFeeCalculator initial={initial} />;
}
