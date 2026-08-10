import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import {
  getConsentedCaseStudies,
  sectionExcerpt,
} from "@/lib/case-studies";
import { buildMetadata, withSiteName } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: withSiteName("Case Studies"),
  description:
    "How the practice works, matter by matter — Situation, Task, Action, Result.",
  path: "/case-studies",
});

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

  /*
   * No consented case studies yet, so there is nothing to show.
   *
   * Returning null served a 200 with an empty body — a live, linked, sitemapped
   * URL rendering literally nothing. Search engines classify that as a soft 404
   * and it drags on sitewide quality; a visitor who clicks it sees a blank page.
   * A real 404 is the honest answer until a client gives written consent to
   * publish their matter. The page returns on its own the moment one does.
   */
  if (studies.length === 0) notFound();

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Case studies
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
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
