import type { Metadata } from "next";
import TDSRateFinder from "@/components/tools/TDSRateFinder";
import { parseTDSQuery } from "@/lib/calc/tds-rate";
import { queryStringFromParams } from "../_params";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/tools/tds-rate-finder/page.tsx — SSR entry for the TDS rate finder.
 */

const DEFAULTS = { paymentTypeId: "194j-professional", amount: 100000 } as const;

export const metadata: Metadata = buildMetadata({
  title: withSiteName("TDS Rate Finder — Section, Rate & Threshold"),
  description:
    "Find the exact TDS section, rate, and threshold for any payment — interest, contracts, rent, professional fees, and more.",
  path: "/tools/tds-rate-finder",
});

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
