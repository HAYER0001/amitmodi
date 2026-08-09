import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import ReadingProgress from "@/components/mdx/ReadingProgress";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import {
  getPublishedPosts,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  canonicalTag,
  type Post,
  type TocItem,
} from "@/lib/mdx";
import { getAllServices } from "@/lib/content";
import { formatPostDate } from "../_components";
import { buildMetadata, withSiteName, fitDescription } from "@/lib/seo";

/*
 * app/insights/[slug]/page.tsx — the article template (Phase 14, Agent A).
 *
 * - revalidate = 3600: the ISR requirement from instrtion.md — tax content
 *   must refresh when rates change without a full rebuild.
 * - dynamicParams = false: a template slug (or a miss) is a real 404, never
 *   an on-demand page built from broken metadata.
 * - generateStaticParams covers every published post.
 *
 * Reading order (an SEO and trust decision): title · byline linking to the
 * principal's E-E-A-T page · published/modified/reviewed dates · content with
 * a sticky TOC · "Last reviewed on <date> by <name>" · related · older/newer ·
 * share links · a contextual CTA matched to the post's service tag.
 */

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: withSiteName(post.title),
    description: fitDescription(post.summary),
    path: `/insights/${slug}`,
    type: "article",
    publishedTime: post.datePublished.toISOString(),
    modifiedTime: (post.dateModified ?? post.datePublished).toISOString(),
  });
}

/* ---- article sub-parts ------------------------------------------------- */

function StickyToc({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <nav aria-label="In this article" className="sticky top-24">
      <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        In this article
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

function ShareLinks({ slug }: { slug: string }) {
  const url = `${SITE_URL}/insights/${slug}`;
  const share = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      label: "Share by email",
      href: `mailto:?subject=${encodeURIComponent("A post from Compliance in Check")}&body=${encodeURIComponent(url)}`,
    },
  ];
  return (
    <ul className="flex flex-wrap gap-2">
      {share.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-pill border border-rule bg-paper px-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContextualCta({ post }: { post: Post }) {
  const service = post.serviceTag
    ? getAllServices().find((s) => s.slug === post.serviceTag)
    : undefined;

  const href = service ? `/services/${service.slug}` : "/contact";
  const label = service ? `See ${service.shortName}` : "Book a consultation";
  const line = service
    ? `Need the compliance behind this article handled? It is one of the services the practice runs end to end.`
    : `This article is general guidance. A matter is specific — the practice can look at yours.`;

  return (
    <section
      aria-labelledby="cta-title"
      className="border-t border-rule pt-10"
    >
      <h2 id="cta-title" className="font-display text-h2 text-ink">
        {line}
      </h2>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill bg-seal px-6 font-label text-sm uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
      >
        {label} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function PostLink({
  label,
  title,
  href,
  direction,
}: {
  label: string;
  title: string;
  href: string;
  direction: "newer" | "older";
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-md border border-rule bg-paper p-5 shadow-cut transition-colors hover:border-seal"
    >
      <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {direction === "newer" ? "← Newer post" : "Older post →"}
      </span>
      <span className="font-display text-h3 text-ink group-hover:text-seal">
        {title}
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}

/* ---- the page ---------------------------------------------------------- */

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.source,
    components: mdxComponents,
  });

  const related = getRelatedPosts(post);
  const { newer, older } = getAdjacentPosts(post);

  return (
    <>
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
                    {post.category}
                  </p>
                  {post.status === "template" && (
                    <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
                      Structural sample — not published
                    </p>
                  )}
                </div>
                <h1 className="mt-4 font-display text-h1 text-ink">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
                  {post.summary}
                </p>

                <div className="mt-6 border-t border-rule pt-5">
                  <p className="font-body text-sm leading-relaxed text-ink">
                    By{" "}
                    <Link
                      href="/practice/principal"
                      className="text-seal underline underline-offset-2 hover:text-seal-deep"
                    >
                      {post.author}
                    </Link>
                  </p>
                  <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Published {formatPostDate(post.datePublished)}
                    {post.dateModified && (
                      <>
                        {" "}
                        · Updated {formatPostDate(post.dateModified)}
                      </>
                    )}
                    {" · "}
                    {post.readingTime}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => {
                      const canonical = canonicalTag(tag);
                      return (
                        <Link
                          key={canonical}
                          href={`/insights/tag/${encodeURIComponent(canonical)}`}
                          className="rounded-pill border border-rule bg-paper px-3 py-1 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
                        >
                          {canonical}
                        </Link>
                      );
                    })}
                  </p>
                </div>
              </header>

              <div className="mt-8">{content}</div>

              <footer className="mt-12 border-t border-rule pt-8">
                {post.dateReviewed && (
                  <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Last reviewed on {formatPostDate(post.dateReviewed)} by{" "}
                    <Link
                      href="/practice/principal"
                      className="text-seal underline underline-offset-2 hover:text-seal-deep"
                    >
                      {post.author}
                    </Link>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Share this post
                  </p>
                  <ShareLinks slug={post.slug} />
                </div>

                {(newer || older) && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {newer && (
                      <PostLink
                        label="Next post"
                        direction="newer"
                        title={newer.title}
                        href={`/insights/${newer.slug}`}
                      />
                    )}
                    {older && (
                      <PostLink
                        label="Previous post"
                        direction="older"
                        title={older.title}
                        href={`/insights/${older.slug}`}
                      />
                    )}
                  </div>
                )}

                <ContextualCta post={post} />
              </footer>
            </div>

            <aside className="hidden lg:block">
              <StickyToc toc={post.toc} />
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="border-t border-rule bg-paper"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
              Keep reading
            </p>
            <h2 id="related-title" className="mt-3 font-display text-h2 text-ink">
              Related posts
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group flex flex-col gap-2 rounded-md border border-rule bg-paper p-6 shadow-cut transition-colors hover:border-seal"
                >
                  <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
                    {post.category}
                  </p>
                  <h3 className="font-display text-h3 text-ink group-hover:text-seal">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-ink-soft">
                    {post.readingTime} · {formatPostDate(post.datePublished)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClosingCTA />
    </>
  );
}
