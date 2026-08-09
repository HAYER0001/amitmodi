import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import {
  getPublishedTerms,
  getTermBySlug,
  getAllTermSlugs,
  slugForTermName,
  type GlossaryTerm,
} from "@/lib/glossary";
import { SERVICES } from "@/data/services";
import { buildMetadata, withSiteName, fitDescription } from "@/lib/seo";

/*
 * app/glossary/[term]/page.tsx — one statically generated page per term.
 *
 * Each entry is small but it ranks: the term, its full form, a ~40-word
 * definition (written to stand alone, so an AI assistant can quote it
 * verbatim), where it appears in practice, a worked example, the related
 * terms, and the service that handles it. Every term page is a legitimate
 * internal link into a commercial page.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedTerms().map((term) => ({ term: term.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const entry = getTermBySlug(slug);
  if (!entry) return {};
  return buildMetadata({
    title: withSiteName(`${entry.term} definition`),
    description: fitDescription(entry.definition),
    path: `/glossary/${entry.slug}`,
    type: "article",
  });
}

function serviceLinkFor(entry: GlossaryTerm) {
  if (entry.serviceLinks.length > 0) return entry.serviceLinks[0];
  if (entry.serviceTag) {
    const service = SERVICES.find((s) => s.slug === entry.serviceTag);
    if (service) return { label: service.shortName, href: `/services/${service.slug}` };
  }
  return null;
}

function RelatedTerms({ entry }: { entry: GlossaryTerm }) {
  if (entry.related.length === 0) return null;
  const known = getAllTermSlugs();
  return (
    <section aria-labelledby="related-title" className="border-t border-rule pt-8">
      <h2 id="related-title" className="font-display text-h2 text-ink">
        Related terms
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {entry.related.map((name) => {
          const slug = slugForTermName(name, known);
          if (!slug) {
            return (
              <li
                key={name}
                className="rounded-pill border border-rule bg-paper px-4 py-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft"
              >
                {name}
              </li>
            );
          }
          return (
            <li key={name}>
              <Link
                href={`/glossary/${slug}`}
                className="inline-flex items-center rounded-pill border border-rule bg-paper px-4 py-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const entry = getTermBySlug(slug);
  if (!entry) notFound();

  const service = serviceLinkFor(entry);

  return (
    <>
      <article className="bg-paper-deep">
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
          <Breadcrumbs />
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <header className="pt-6">
            <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
              Glossary
            </p>
            <h1 className="mt-3 font-display text-h1 text-ink">{entry.term}</h1>
            <p className="mt-2 font-label text-base uppercase tracking-[0.14em] text-ink-soft">
              {entry.fullForm}
            </p>

            {entry.definition && (
              <div className="mt-8 rounded-md border-l-4 border-seal bg-paper p-6 shadow-cut">
                <p className="font-body text-body leading-relaxed text-ink">
                  {entry.definition}
                </p>
              </div>
            )}
          </header>

          <div className="mt-10 space-y-10">
            {entry.practice && (
              <section>
                <h2 className="font-display text-h2 text-ink">
                  Where it appears in practice
                </h2>
                <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
                  {entry.practice}
                </p>
              </section>
            )}

            {entry.example && (
              <section>
                <h2 className="font-display text-h2 text-ink">A worked example</h2>
                <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
                  {entry.example}
                </p>
              </section>
            )}

            <RelatedTerms entry={entry} />

            {service && (
              <section className="border-t border-rule pt-8">
                <h2 className="font-display text-h2 text-ink">
                  Let the practice handle it
                </h2>
                <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
                  This term sits inside real compliance work — returns, filings,
                  and deadlines. That work is one of the services the practice
                  runs end to end.
                </p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill bg-seal px-6 font-label text-sm uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
                >
                  {service.label} <span aria-hidden="true">→</span>
                </Link>
              </section>
            )}
          </div>
        </div>
      </article>

      <ClosingCTA />
    </>
  );
}
