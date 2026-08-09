import type { Metadata } from "next";
import ITRFormSelector from "@/components/tools/ITRFormSelector";
import { parseITRQuery } from "@/lib/calc/itr-form";
import { queryStringFromParams } from "../_params";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/tools/itr-form-selector/page.tsx — SSR entry for the ITR selector.
 */

const DEFAULTS = {
  taxpayer: "individual-resident",
  businessNature: "none",
  complex: false,
  totalIncome: 3000000,
} as const;

export const metadata: Metadata = buildMetadata({
  title: withSiteName("Which ITR Should I File? — ITR 1 to 7 Selector"),
  description:
    "Answer five questions and get the right ITR form — ITR-1 Sahaj through ITR-7 — with reasons based on your taxpayer status and income.",
  path: "/tools/itr-form-selector",
});

export default async function ITRFormSelectorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseITRQuery(queryStringFromParams(params));
  const initial = {
    taxpayer: parsed.taxpayer ?? DEFAULTS.taxpayer,
    businessNature: parsed.businessNature ?? DEFAULTS.businessNature,
    complex: parsed.complex ?? DEFAULTS.complex,
    totalIncome: parsed.totalIncome ?? DEFAULTS.totalIncome,
  };

  return <ITRFormSelector initial={initial} />;
}
