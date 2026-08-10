import PageAtmosphere from "@/components/ui/PageAtmosphere";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PostCard, TagFilter, Pagination } from "./_components";
import { getPublishedPosts, getPostsByTag, paginate } from "@/lib/mdx";
import { buildMetadata, withSiteName } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: withSiteName("Insights"),
  description:
    "Compliance notes, guides, and updates for Indian businesses — GST, income tax, TDS, and trade.",
  path: "/insights",
});

/*
 * app/insights/page.tsx — page 1 of the archive. Filterable by tag via
 * ?tag=; pagination uses real URLs (/insights/page/2) — never infinite
 * scroll, which would leave part of the archive invisible to crawlers.
 */

export default async function InsightsIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const activeTag = tag && tag.length > 0 ? tag : null;
  const posts = activeTag ? getPostsByTag(activeTag) : getPublishedPosts();
  const page = paginate(posts, 1);

  return (
    <div className="relative bg-paper-deep">
      <PageAtmosphere density="interior" seed={17} object="cut-paperclip" objectClassName="right-[6%] top-[9%] hidden w-24 rotate-12 lg:block xl:w-36" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Insights
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
            The compliance notes.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            What changes in tax and compliance, how it affects your business,
            and what to do before the deadline. Every article is reviewed and
            dated.
          </p>
        </header>

        <TagFilter activeTag={activeTag} />

        {page.items.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="mt-10 border-t border-rule pt-8 font-body text-body leading-relaxed text-ink-soft">
            No posts under “{activeTag}” yet.
          </p>
        )}
      </div>
    </div>
  );
}
