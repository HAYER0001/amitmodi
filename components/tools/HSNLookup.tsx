"use client";

import { useMemo, useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { TextInput } from "./fields";
import { searchHSNSAC } from "@/lib/calc/hsn-sac";
import { formatPct } from "@/lib/calc/helpers";

/*
 * HSNLookup — HSN/SAC code + GST rate lookup.
 *
 * The search box and results table are the form itself; the result panel
 * summarises the match count. The dataset is a curated subset (the full
 * schedule is tens of thousands of lines) and the page says so — honest by
 * design, matching the site's approach to penalties and fees.
 */

export type HSNInitial = {
  query: string;
};

export default function HSNLookup({ initial }: { initial: HSNInitial }) {
  const [query, setQuery] = useState(initial.query);

  const result = useMemo(() => searchHSNSAC(query), [query]);

  return (
    <CalculatorShell
      eyebrow="GST"
      title="HSN & SAC Code Lookup"
      description="Find the GST rate for a goods (HSN) or services (SAC) code — or search a description like 'biscuits' or 'consultancy'. One code in the wrong slab can mean a short-paid return and penalties."
      resultLabel="Match count"
      summary={`${result.matches.length} of ${result.total} codes`}
      breakdown={result.breakdown}
      invalid={null}
      shareQuery={query.trim() === "" ? "" : `q=${encodeURIComponent(query.trim())}`}
    >
      <div className="space-y-6 rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-6">
        <TextInput
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a code (e.g. 8517) or description (e.g. biscuits)"
          aria-label="Search HSN or SAC codes"
        />

        {result.matches.length === 0 ? (
          <p className="font-body text-sm leading-relaxed text-ink-soft">
            No match in this curated subset. The full HSN/SAC schedule runs to
            thousands of entries — try a shorter code or a simpler word.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">HSN/SAC codes and their GST slab rates</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="py-2 pr-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Code
                  </th>
                  <th scope="col" className="py-2 pr-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Type
                  </th>
                  <th scope="col" className="py-2 pr-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Description
                  </th>
                  <th scope="col" className="py-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.matches.map((entry, index) => (
                  <tr key={`${entry.code}-${index}`} className="border-b border-rule/50">
                    <td className="py-2 pr-4 font-body text-base font-medium text-seal">{entry.code}</td>
                    <td className="py-2 pr-4 font-label text-xs uppercase tracking-[0.1em] text-ink-soft">{entry.type}</td>
                    <td className="py-2 pr-4 font-body text-sm leading-relaxed text-ink">
                      {entry.description}
                      {entry.note && <span className="mt-0.5 block text-ink-soft">{entry.note}</span>}
                    </td>
                    <td className="py-2 font-body text-base font-medium text-ink">{formatPct(entry.ratePct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
          This is an indicative subset, not the complete HSN/SAC schedule. Rates
          can depend on fine print — exemptions, abatements, compensation cess,
          and retail-price splits for garments. Confirm the rate for your exact
          supply before you file.
        </p>
      </div>
    </CalculatorShell>
  );
}
