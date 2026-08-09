import type { Metadata } from "next";
import ITRFormSelector from "@/components/tools/ITRFormSelector";
import { parseITRQuery } from "@/lib/calc/itr-form";
import { queryStringFromParams } from "../_params";

/*
 * app/tools/itr-form-selector/page.tsx — SSR entry for the ITR selector.
 */

const DEFAULTS = {
  taxpayer: "individual-resident",
  businessNature: "none",
  complex: false,
  totalIncome: 3000000,
} as const;

const CANONICAL = "/tools/itr-form-selector";

export const metadata: Metadata = {
  title: "Which ITR Should I File? — ITR 1 to 7 Selector | Compliance in Check",
  description:
    "Answer five questions and get the right income tax return form — ITR-1 Sahaj through ITR-7 — with the reasons, based on your taxpayer status, income, and any disqualifying conditions.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "Compliance in Check",
    title: "Which ITR Should I File?",
    description: "The right ITR form in five questions, with the reasons spelled out.",
  },
  robots: { index: true, follow: true },
};

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
