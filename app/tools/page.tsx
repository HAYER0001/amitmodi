import CutOut from "@/components/ui/CutOut";
import { ASSETS } from "@/data/assets";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/tools/page.tsx — the /tools hub.
 *
 * One card per calculator. Every tool is a client component wrapped in the
 * shared CalculatorShell; the math lives in pure, tested functions under
 * lib/calc (run by `npm test`), and every rate/threshold lives in the data
 * files. This page is the index that ties the suite together.
 */

const TOOLS = [
  {
    href: "/tools/gst-calculator",
    title: "GST Amount Calculator",
    answer: "How much GST is on this supply, and what's the total?",
    description: "From an amount with or without GST, split into CGST + SGST (intra-state) or IGST (inter-state).",
    tag: "GST",
  },
  {
    href: "/tools/late-fee-calculator",
    title: "Late Fee & Interest Calculator",
    answer: "What does a missed GST due date actually cost?",
    description: "Per-day late fee capped by your turnover tier, plus 18% interest on the net cash tax paid late.",
    tag: "GST",
  },
  {
    href: "/tools/tds-rate-finder",
    title: "TDS Rate Finder",
    answer: "Which section, what rate, and how much to deduct?",
    description: "Interest, contracts, rent, professional fees, property purchases — the threshold check and the exact deduction.",
    tag: "Income tax",
  },
  {
    href: "/tools/itr-form-selector",
    title: "Which ITR Should I File?",
    answer: "ITR-1 through ITR-7 — which one is yours?",
    description: "Five questions, one answer, with the reasons spelled out — simple forms are capped at ₹50 lakh.",
    tag: "Income tax",
  },
  {
    href: "/tools/hsn-sac-lookup",
    title: "HSN & SAC Code Lookup",
    answer: "What GST rate applies to this code or description?",
    description: "A curated, searchable subset of the most common goods (HSN) and services (SAC) codes.",
    tag: "GST",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: withSiteName("Compliance Calculators & Tools"),
  description:
    "GST calculator, late-fee and interest calculator, TDS rate finder, ITR form selector, and an HSN/SAC code lookup — free tools that show their working.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      {/* The calculator cut-out, on the page about calculators. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="cut-out-drift absolute right-[4%] top-[6%] hidden w-24 rotate-6 lg:block xl:w-32">
          <CutOut
            src={ASSETS["cut-calculator"].src}
            alt=""
            width={ASSETS["cut-calculator"].width}
            height={ASSETS["cut-calculator"].height}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumbs />
        <section className="py-10">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">Tools</p>
          <h1 className="mt-2 max-w-2xl font-display text-h2 text-ink">
            Calculators that show their working
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-ink-soft">
            Every tool here computes from a single source of truth for rates
            and thresholds, and prints the arithmetic underneath the answer —
            so you can see how the number was reached, check it, and take it
            to your professional. None of them are tax advice.
          </p>
        </section>

        <section className="border-t border-rule py-10" aria-label="Tools">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="group flex h-full flex-col rounded-md border border-rule bg-paper p-5 shadow-cut transition-colors hover:border-seal"
                >
                  <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">{tool.tag}</p>
                  <h2 className="mt-3 font-display text-h3 text-ink transition-colors group-hover:text-seal">
                    {tool.title}
                  </h2>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{tool.description}</p>
                  <p className="mt-auto pt-4 font-label text-xs uppercase tracking-[0.1em] text-seal">
                    {tool.answer}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-rule py-10">
          <p className="font-body text-sm leading-relaxed text-ink-soft">
            Behind the scenes: the arithmetic lives in pure functions under{" "}
            <code className="rounded bg-paper-deep px-1.5 py-0.5 font-mono text-xs">lib/calc</code>,
            tested with <code className="rounded bg-paper-deep px-1.5 py-0.5 font-mono text-xs">npm test</code>.
            Rates and thresholds live in the data files there — when a Finance
            Act changes them, one edit updates every tool.
          </p>
        </section>
      </div>

      <ClosingCTA />
    </>
  );
}
