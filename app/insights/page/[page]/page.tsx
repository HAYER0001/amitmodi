import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PostCard, TagFilter, Pagination } from "../../_components";
import {
  getPublishedPosts,
  getPostsByTag,
  paginate,
  getAllPosts,
} from "@/lib/mdx";

/*
 * app/insights/page/[page]/page.tsx — pages 2+ of the archive, with real
 * URLs. Page 1 lives at /insights (this route redirects /insights/page/1
 * there). generateStaticParams only emits pages that exist, so the crawler
 * sees a finite, fully-linked archive — never an infinite scroll.
 */

export const dynamicParams = true;

const TITLE_PATTERN = /^[0-9]+$/;

export function generateStaticParams() {
  const { totalPages } = paginate(getAllPosts(), 1);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Insights — Page ${page} | Compliance in Check`,
    description:
      "Compliance notes, guides, and updates for Indian businesses — page by page.",
    alternates: { canonical: `/insights/page/${page}` },
    robots: { index: true, follow: true },
  };
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { page: pageParam } = await params;
  if (!TITLE_PATTERN.test(pageParam)) notFound();

  const current = Number(pageParam);
  if (current <= 1) redirect("/insights");

  const { tag } = await searchParams;
  const activeTag = tag && tag.length > 0 ? tag : null;
  const posts = activeTag ? getPostsByTag(activeTag) : getPublishedPosts();
  const page = paginate(posts, current);
  if (page.current !== current) notFound();

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Insights
          </p>
          <h1 className="mt-3 font-display text-h1 text-ink">
            The compliance notes.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            Page {current} of {page.totalPages}.
          </p>
        </header>

        <TagFilter activeTag={activeTag} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {page.items.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination
          current={page.current}
          totalPages={page.totalPages}
          tag={activeTag}
        />
      </div>
    </div>
  );
}
