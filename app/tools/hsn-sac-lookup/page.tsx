import type { Metadata } from "next";
import HSNLookup from "@/components/tools/HSNLookup";
import { queryStringFromParams } from "../_params";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/tools/hsn-sac-lookup/page.tsx — SSR entry for the HSN/SAC lookup.
 */

export const metadata: Metadata = buildMetadata({
  title: withSiteName("HSN & SAC Code Lookup — GST Rates"),
  description:
    "Look up the GST slab rate for goods (HSN) and services (SAC) codes — from milk and mobile phones to hotels and consultancy — with the fine-print notes.",
  path: "/tools/hsn-sac-lookup",
});

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
