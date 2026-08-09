"use client";

/*
 * app/not-found.tsx — the custom 404 instrtion.md requires (Phase 17, Agent A).
 *
 * Never a dead end: a search box that filters the commercial funnel live, the
 * eight service links, the five tools, and a contact CTA. Everything on this
 * page routes the lost visitor back toward a consultation.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAllServices } from "@/lib/content";
import ClosingCTA from "@/components/sections/ClosingCTA";

const TOOLS = [
  { href: "/tools/gst-calculator", title: "GST Amount Calculator" },
  { href: "/tools/late-fee-calculator", title: "Late Fee & Interest Calculator" },
  { href: "/tools/tds-rate-finder", title: "TDS Rate Finder" },
  { href: "/tools/itr-form-selector", title: "Which ITR Should I File?" },
  { href: "/tools/hsn-sac-lookup", title: "HSN & SAC Code Lookup" },
];

function SearchBox() {
  const services = getAllServices();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const needle = query.trim().toLowerCase();
  const results = needle
    ? [
        ...services
          .filter((service) =>
            `${service.name} ${service.oneLiner}`.toLowerCase().includes(needle),
          )
          .map((service) => ({
            href: `/services/${service.slug}`,
            label: service.name,
            kind: "Service",
          })),
        ...TOOLS.filter((tool) =>
          `${tool.title}`.toLowerCase().includes(needle),
        ).map((tool) => ({ href: tool.href, label: tool.title, kind: "Tool" })),
      ].slice(0, 8)
    : [];

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="not-found-search" className="sr-only">
        Search the services and tools
      </label>
      <input
        ref={inputRef}
        id="not-found-search"
        type="search"
        autoComplete="off"
        placeholder="Search GST registration, TDS, ITR forms, appeals…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-md border border-rule bg-paper px-4 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-seal focus:ring-2 focus:ring-seal/30"
      />
      {results.length > 0 && (
        <ul className="mt-3 overflow-hidden rounded-md border border-rule bg-paper shadow-cut">
          {results.map((result) => (
            <li key={result.href} className="border-b border-rule last:border-b-0">
              <Link
                href={result.href}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-paper-deep"
              >
                <span className="font-body text-base text-ink">{result.label}</span>
                <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {result.kind}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {heading}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-body leading-relaxed text-ink transition-colors hover:text-seal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NotFound() {
  const services = getAllServices();

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-h1 text-ink">
          That page has moved or never existed.
        </h1>
        <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
          The compliance questions are all still here — registration, filing,
          appeals, and the free calculators. Search below, or pick a place to
          start.
        </p>

        <div className="mt-8">
          <SearchBox />
        </div>
      </div>

      <div className="mt-16 grid gap-12 border-t border-rule pt-12 md:grid-cols-3">
        <LinkColumn
          heading="Services"
          links={services.map((service) => ({
            href: `/services/${service.slug}`,
            label: service.name,
          }))}
        />
        <LinkColumn
          heading="Tools"
          links={TOOLS.map((tool) => ({ href: tool.href, label: tool.title }))}
        />
        <LinkColumn
          heading="Keep reading"
          links={[
            { href: "/insights", label: "Insights and updates" },
            { href: "/guides", label: "Guides" },
            { href: "/glossary", label: "Glossary of terms" },
            { href: "/compliance-calendar", label: "Compliance calendar" },
          ]}
        />
      </div>

      <div className="mt-12 border-t border-rule pt-10 text-center">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-seal px-6 font-label text-sm uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
        >
          Talk to the practice <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ClosingCTA />
    </main>
  );
}
