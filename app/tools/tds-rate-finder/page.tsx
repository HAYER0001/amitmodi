import type { Metadata } from "next";
import TDSRateFinder from "@/components/tools/TDSRateFinder";
import { parseTDSQuery } from "@/lib/calc/tds-rate";
import { queryStringFromParams } from "../_params";

/*
 * app/tools/tds-rate-finder/page.tsx — SSR entry for the TDS rate finder.
 */

const DEFAULTS = { paymentTypeId: "194j-professional", amount: 100000 } as const;

const CANONICAL = "/tools/tds-rate-finder";

export const metadata: Metadata = {
  title: "TDS Rate Finder — Section, Rate & Threshold | Compliance in Check",
  description:
    "Find the exact TDS section, rate, and threshold for any payment — interest, contracts, rent, professional fees, property purchase and more — and the precise amount to deduct.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "Compliance in Check",
    title: "TDS Rate Finder",
    description: "The exact TDS section, rate, threshold and deduction for the payment you're making.",
  },
  robots: { index: true, follow: true },
};

export default async function TDSRateFinderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseTDSQuery(queryStringFromParams(params));
  const initial = {
    paymentTypeId: parsed.paymentTypeId ?? DEFAULTS.paymentTypeId,
    amount: parsed.amount ?? DEFAULTS.amount,
    payerKind: parsed.payerKind,
  };

  return <TDSRateFinder initial={initial} />;
}
