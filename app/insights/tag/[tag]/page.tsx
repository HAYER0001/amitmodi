import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PostCard, Pagination } from "../../_components";
import { getAllTags, getPostsByTag, canonicalTag, paginate } from "@/lib/mdx";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/insights/tag/[tag]/page.tsx — one statically generated archive per tag.
 * Tags come from the posts themselves; a tag with no posts is a 404. Case
 * variants of a tag redirect to the canonical casing so there is exactly one
 * URL per topic.
 */

export const dynamicParams = true;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return buildMetadata({
    title: withSiteName(`${tag} — Insights`),
    description: `Posts filed under “${tag}” on the Compliance in Check insights archive.`,
    path: `/insights/tag/${encodeURIComponent(tag)}`,
  });
}

export default async function TagArchive({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const canonical = canonicalTag(tag);
  if (canonical !== tag) {
    redirect(`/insights/tag/${encodeURIComponent(canonical)}`);
  }
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const page = paginate(posts, 1);

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Insights
          </p>
          <h1 className="mt-3 font-display text-h1 text-ink">
            Filed under “{tag}”.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            {page.total} post{page.total === 1 ? "" : "s"} on this topic.
          </p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {page.items.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination
          current={page.current}
          totalPages={page.totalPages}
          tag={null}
          basePath={`/insights/tag/${tag}`}
        />
      </div>
    </div>
  );
}
