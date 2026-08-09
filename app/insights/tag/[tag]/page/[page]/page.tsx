import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PostCard, Pagination } from "../../../../_components";
import { getAllTags, getPostsByTag, canonicalTag, paginate } from "@/lib/mdx";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/insights/tag/[tag]/page/[page]/page.tsx — paginated tag archives with
 * real URLs. Page 1 of a tag lives at /insights/tag/[tag]; this route serves
 * 2+ and redirects page 1 to the canonical location.
 */

export const dynamicParams = true;

const TITLE_PATTERN = /^[0-9]+$/;

export function generateStaticParams() {
  const tags = getAllTags();
  const params: { tag: string; page: string }[] = [];
  for (const tag of tags) {
    const { totalPages } = paginate(getPostsByTag(tag), 1);
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ tag, page: String(page) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; page: string }>;
}): Promise<Metadata> {
  const { tag, page } = await params;
  return buildMetadata({
    title: withSiteName(`${tag} — Insights, Page ${page}`),
    description: `Posts filed under “${tag}” — page ${page}.`,
    path: `/insights/tag/${encodeURIComponent(tag)}/page/${page}`,
  });
}

export default async function TagArchivePage({
  params,
}: {
  params: Promise<{ tag: string; page: string }>;
}) {
  const { tag, page: pageParam } = await params;
  if (!TITLE_PATTERN.test(pageParam)) notFound();

  const current = Number(pageParam);
  if (current <= 1) redirect(`/insights/tag/${tag}`);

  const canonical = canonicalTag(tag);
  if (canonical !== tag) {
    redirect(`/insights/tag/${encodeURIComponent(canonical)}/page/${current}`);
  }

  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

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
            Filed under “{tag}”.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            Page {current} of {page.totalPages}.
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
