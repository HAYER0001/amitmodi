import type { Metadata } from "next";
import HSNLookup from "@/components/tools/HSNLookup";
import { queryStringFromParams } from "../_params";

/*
 * app/tools/hsn-sac-lookup/page.tsx — SSR entry for the HSN/SAC lookup.
 */

const CANONICAL = "/tools/hsn-sac-lookup";

export const metadata: Metadata = {
  title: "HSN & SAC Code Lookup — GST Rates | Compliance in Check",
  description:
    "Look up the GST slab rate for goods (HSN) and services (SAC) codes — from milk and mobile phones to hotels and consultancy — with the fine-print notes.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "Compliance in Check",
    title: "HSN & SAC Code Lookup",
    description: "The GST rate for the goods or services code you're filing under.",
  },
  robots: { index: true, follow: true },
};

export default async function HSNLookupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = queryStringFromParams(params);
  const q = new URLSearchParams(query).get("q") ?? "";
  return <HSNLookup initial={{ query: q }} />;
}
