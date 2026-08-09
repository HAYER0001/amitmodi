"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { GlossaryTerm } from "@/lib/glossary";

/*
 * app/glossary/_GlossaryIndex.tsx — the client-side A–Z index (Phase 15, Agent A).
 *
 * The page (server) passes the complete term list here, and this component
 * renders every term in its initial HTML. The filter input only hides and
 * shows those already-rendered entries in memory — there is no fetch, and the
 * server-rendered HTML always contains every term, so all of them stay
 * crawlable. The alphabet jump bar stays sticky below the site header and
 * scopes its letters to whatever the current filter shows.
 */

type LetterGroup = { letter: string; terms: GlossaryTerm[] };

function groupTerms(terms: GlossaryTerm[]): LetterGroup[] {
  const map = new Map<string, GlossaryTerm[]>();
  for (const term of terms) {
    const bucket = map.get(term.letter) ?? [];
    bucket.push(term);
    map.set(term.letter, bucket);
  }
  return [...map.entries()]
    .sort((a, b) => {
      if (a[0] === "#") return 1;
      if (b[0] === "#") return -1;
      return a[0].localeCompare(b[0]);
    })
    .map(([letter, grouped]) => ({ letter, terms: grouped }));
}

const FILTER_FIELDS = (t: GlossaryTerm) =>
  `${t.term} ${t.fullForm} ${t.definition} ${t.related.join(" ")}`.toLowerCase();

export default function GlossaryIndex({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return terms;
    return terms.filter((term) => FILTER_FIELDS(term).includes(needle));
  }, [query, terms]);

  const groups = useMemo(() => groupTerms(filtered), [filtered]);
  const visibleLetters = groups.map((group) => group.letter);

  return (
    <section aria-label="Glossary terms" className="rounded-md border border-rule bg-paper shadow-cut">
      <div className="sticky top-24 z-20 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <label htmlFor="glossary-filter" className="sr-only">
              Filter glossary terms
            </label>
            <input
              id="glossary-filter"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter terms — e.g. ITC, GSTIN, e-Way Bill"
              autoComplete="off"
              className="w-full rounded-pill border border-rule bg-paper-deep px-4 py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-seal focus:ring-2 focus:ring-seal/30"
            />
          </div>
          <nav
            aria-label="Jump to letter"
            className="flex flex-wrap items-center gap-1"
          >
            {visibleLetters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-rule font-label text-sm text-ink-soft transition-colors hover:border-seal hover:text-seal"
              >
                {letter}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} of {terms.length} terms
      </p>

      <div className="px-4 py-8 sm:px-6">
        {groups.length === 0 ? (
          <p className="font-body text-body leading-relaxed text-ink-soft">
            No terms match “{query}”. Try a shorter word, or an abbreviation
            like ITC or GSTIN.
          </p>
        ) : (
          groups.map((group) => (
            <section
              key={group.letter}
              id={`letter-${group.letter}`}
              aria-label={`Terms starting with ${group.letter}`}
              className="scroll-mt-40 border-t border-rule first:border-t-0"
            >
              <h2 className="py-4 font-display text-h3 text-brass">{group.letter}</h2>
              <ul className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
                {group.terms.map((term) => (
                  <li key={term.slug} className="bg-paper">
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="group flex h-full flex-col gap-1 p-4 transition-colors hover:bg-paper-deep"
                    >
                      <span className="font-label text-sm font-medium text-ink transition-colors group-hover:text-seal">
                        {term.term}
                      </span>
                      <span className="font-body text-sm leading-relaxed text-ink-soft">
                        {term.fullForm}
                      </span>
                      <span className="pt-1 font-body text-sm leading-relaxed text-ink-soft/80 line-clamp-2">
                        {term.definition}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </section>
  );
}
