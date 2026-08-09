import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import {
  getConsentedCaseStudies,
  sectionExcerpt,
} from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | Compliance in Check",
  description:
    "How the practice works, matter by matter — Situation, Task, Action, Result.",
  alternates: { canonical: "/case-studies" },
};

/*
 * app/case-studies/page.tsx — index of consented case studies.
 *
 * Every study on disk carries status: 'template' and consentObtained: false
 * until the practice replaces it with a real, consenting matter — so this
 * page renders nothing (no heading, no "coming soon") until one is flipped.
 * Absence is invisible.
 */

export default function CaseStudiesIndex() {
  const studies = getConsentedCaseStudies();
  if (studies.length === 0) return null;

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Case studies
          </p>
          <h1 className="mt-3 font-display text-display text-ink">
            How the work actually went.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            Each matter is told as it happened: the position the client was
            in, what needed to happen, what we did, and what changed.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => {
            const excerpt = sectionExcerpt(study, "situation");
            return (
              <article
                key={study.slug}
                className="flex flex-col rounded-md border border-rule bg-paper p-6 shadow-cut"
              >
                <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
                  Case study
                </p>
                <h2 className="mt-3 font-display text-h3 text-ink">
                  {study.title}
                </h2>
                {excerpt && (
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
                    {excerpt}
                  </p>
                )}
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
                >
                  Read the matter
                  <span aria-hidden="true" className="text-base leading-none">
                    →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <ClosingCTA />
    </div>
  );
}
