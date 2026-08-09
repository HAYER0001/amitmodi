/*
 * lib/calc/hsn-sac.ts — HSN/SAC code lookup (pure functions, no React).
 *
 * searchHSNSAC() matches a query against the curated dataset: if the query
 * is all digits it is matched as a code prefix, and the description is
 * searched as a substring (case-insensitive) either way. An empty query
 * returns the full curated list — the default page state is the at-a-glance
 * table, and the list stays indexable server-rendered content.
 *
 * The dataset is indicative, not the full schedule — the UI says so.
 */

import type { BreakdownLine } from "./types";
import { formatPct } from "./helpers";
import { HSN_SAC_ENTRIES, type HSNSACEntry } from "./data/hsn-sac";

export type HSNResult = {
  query: string;
  /** Size of the whole curated dataset (matches.length ≤ total). */
  total: number;
  matches: HSNSACEntry[];
  breakdown: BreakdownLine[];
};

export function searchHSNSAC(query: string): HSNResult {
  if (typeof query !== "string") {
    throw new TypeError("query must be a string");
  }
  const q = query.trim().toLowerCase();
  const isNumeric = /^\d+$/.test(q);

  const matches =
    q.length === 0
      ? [...HSN_SAC_ENTRIES]
      : HSN_SAC_ENTRIES.filter((entry) => {
          if (isNumeric && entry.code.startsWith(q)) return true;
          return entry.description.toLowerCase().includes(q);
        });

  const sorted = [...matches].sort((a, b) => a.code.localeCompare(b.code, "en", { numeric: true }));

  const breakdown: BreakdownLine[] = [
    {
      label: "Query",
      value: q === "" ? "(showing all)" : q,
      detail: isNumeric ? "Matched as a code prefix" : "Matched against descriptions",
    },
    {
      label: "Matches",
      value: `${sorted.length} of ${HSN_SAC_ENTRIES.length}`,
      detail: `Curated subset of ${HSN_SAC_ENTRIES.length} codes — not the full HSN/SAC schedule`,
    },
  ];

  return { query: q, total: HSN_SAC_ENTRIES.length, matches: sorted, breakdown };
}

/** Exact lookup by code, e.g. "8517" or "9963". Returns undefined when absent. */
export function entryByCode(code: string): HSNSACEntry | undefined {
  if (typeof code !== "string") {
    throw new TypeError("code must be a string");
  }
  return HSN_SAC_ENTRIES.find((e) => e.code === code.trim());
}

/** Breakdown line for a table row — reused by the lookup component. */
export function entryBreakdown(entry: HSNSACEntry): BreakdownLine[] {
  return [
    { label: "Code", value: entry.code, detail: `${entry.type} — ${entry.description}` },
    { label: "GST rate", value: formatPct(entry.ratePct), detail: entry.note },
  ];
}
