import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import ReadingProgress from "@/components/mdx/ReadingProgress";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArticleSchema } from "@/components/seo/SchemaEmitters";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { LeadMagnet } from "@/components/content/LeadMagnet";
import { getPublishedPosts, getPostBySlug, type Post, type TocItem } from "@/lib/mdx";
import { formatGuideDate, magnetForGuide } from "../_components";
import { PrintGuideButton } from "../_PrintGuideButton";
import { buildMetadata, withSiteName, fitDescription } from "@/lib/seo";

/*
 * app/guides/[slug]/page.tsx — the guide template (Phase 15, Agent A).
 *
 * Same MDX pipeline as insights, different reading experience: a sticky TOC,
 * chapter navigation between guides, an estimated read time, and — at the
 * end — a download-as-PDF option. The page's content is never gated; the
 * gated, formatted PDF (LeadMagnet) is a separate artefact, and the free
 * "save as PDF" button covers the page itself.
 */

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts()
    .filter((post) => post.category === "guide")
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPostBySlug(slug);
  if (!guide) return {};
  return buildMetadata({
    title: withSiteName(guide.title),
    description: fitDescription(guide.summary),
    path: `/guides/${slug}`,
    type: "article",
    publishedTime: guide.datePublished.toISOString(),
    modifiedTime: (guide.dateModified ?? guide.datePublished).toISOString(),
    alternateTypes: { "text/markdown": `/guides/${slug}.md` },
  });
}

/* ---- guide sub-parts --------------------------------------------------- */

function StickyToc({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <nav aria-label="In this guide" className="sticky top-24">
      <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        On this page
      </p>
      <ol className="mt-3 space-y-2 border-l border-rule">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={
                item.depth === 3
                  ? "block border-l-2 border-transparent py-1 pl-6 text-sm leading-relaxed text-ink-soft transition-colors hover:border-seal hover:text-ink"
                  : "block border-l-2 border-transparent py-1 pl-4 font-label text-sm leading-relaxed text-ink transition-colors hover:border-seal hover:text-seal"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function GuideNav({ guide }: { guide: Post }) {
  const guides = getPublishedPosts().filter((p) => p.category === "guide");
  const index = guides.findIndex((g) => g.slug === guide.slug);
  const prev = index > 0 ? guides[index - 1] : null;
  const next = index < guides.length - 1 ? guides[index + 1] : null;
  if (!prev && !next) return null;
  return (
    <div className="mt-12 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2">
      {next && (
        <Link
          href={`/guides/${next.slug}`}
          className="group flex flex-col gap-1 rounded-md border border-rule bg-paper p-5 shadow-cut transition-colors hover:border-seal"
        >
          <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
            ← Next chapter
          </span>
          <span className="font-display text-h3 text-ink group-hover:text-seal">
            {next.title}
          </span>
        </Link>
      )}
      {prev && (
        <Link
          href={`/guides/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-md border border-rule bg-paper p-5 text-right shadow-cut transition-colors hover:border-seal"
        >
          <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
            Previous chapter →
          </span>
          <span className="font-display text-h3 text-ink group-hover:text-seal">
            {prev.title}
          </span>
        </Link>
      )}
    </div>
  );
}

/* ---- the page ---------------------------------------------------------- */

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getPostBySlug(slug);
  if (!guide) notFound();

  const { content } = await compileMDX({
    source: guide.source,
    components: mdxComponents,
  });

  const magnet = magnetForGuide(guide.slug);

  return (
    <>
      <ArticleSchema post={guide} domain={process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi.com"} />
      <ReadingProgress />

      <article className="bg-paper-deep">
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
          <Breadcrumbs />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <header className="max-w-3xl pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
                    Guide
                  </p>
                  {guide.status === "template" && (
                    <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
                      Structural sample — not published
                    </p>
                  )}
                </div>
                <h1 className="mt-4 font-display text-h1 text-ink">{guide.title}</h1>
                <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
                  {guide.summary}
                </p>
                <div className="mt-6 border-t border-rule pt-5">
                  <p className="font-body text-sm leading-relaxed text-ink">
                    By{" "}
                    <Link
                      href="/practice/principal"
                      className="text-seal underline underline-offset-2 hover:text-seal-deep"
                    >
                      {guide.author}
                    </Link>
                  </p>
                  <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {guide.readingTime} · Published {formatGuideDate(guide.datePublished)}
                    {guide.dateModified && (
                      <> · Updated {formatGuideDate(guide.dateModified)}</>
                    )}
                  </p>
                </div>
              </header>

              <div className="mt-8">{content}</div>

              <footer className="mt-12 border-t border-rule pt-8">
                <div className="flex flex-col gap-4 rounded-md border border-rule bg-paper p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
                      Take it with you
                    </p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
                      Save this page as a PDF, or request the formatted,
                      print-ready version.
                    </p>
                  </div>
                  <PrintGuideButton />
                </div>

                <div className="mt-6">
                  <LeadMagnet
                    pdfSlug={magnet.slug}
                    title={magnet.title}
                    blurb={magnet.blurb}
                    gaEvent="guide_downloaded"
                  />
                </div>

                <GuideNav guide={guide} />
              </footer>
            </div>

            <aside className="hidden lg:block">
              <StickyToc toc={guide.toc} />
            </aside>
          </div>
        </div>
      </article>

      <ClosingCTA />
    </>
  );
}
