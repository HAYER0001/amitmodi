import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllTags, type Post } from "@/lib/mdx";

/*
 * app/insights/_components.tsx — shared server-only UI for the insights
 * routes (PostCard, TagFilter, Pagination). Underscore-prefixed, so Next
 * never treats it as a route.
 */

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function PostCard({ post }: { post: Post }) {
  const isSample = post.status === "template";
  return (
    <article className="flex h-full flex-col rounded-md border border-rule bg-paper p-6 shadow-cut">
      <div className="flex items-center justify-between gap-4">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          {post.category}
        </p>
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {formatPostDate(post.datePublished)}
        </p>
      </div>
      <h2 className="mt-3 font-display text-h3 text-ink">
        <Link
          href={`/insights/${post.slug}`}
          className="transition-colors hover:text-seal"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
        {post.summary}
      </p>
      <div className="mt-auto pt-4">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {post.readingTime} · {post.tags.slice(0, 3).join(", ")}
        </p>
        {isSample && (
          <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-stamp">
            Structural sample — not published
          </p>
        )}
      </div>
    </article>
  );
}

function pill(active: boolean) {
  return cn(
    "inline-flex min-h-11 items-center rounded-pill border px-4 font-label text-xs uppercase tracking-[0.14em] transition-colors",
    active
      ? "border-seal bg-seal text-paper"
      : "border-rule bg-paper text-ink-soft hover:border-seal hover:text-seal",
  );
}

export function TagFilter({ activeTag }: { activeTag: string | null }) {
  const tags = getAllTags();
  return (
    <nav
      aria-label="Filter posts by tag"
      className="flex flex-wrap items-center gap-2"
    >
      <Link href="/insights" className={pill(activeTag === null)}>
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/insights?tag=${encodeURIComponent(tag)}`}
          className={pill(activeTag === tag)}
        >
          {tag}
        </Link>
      ))}
    </nav>
  );
}

export function Pagination({
  current,
  totalPages,
  tag,
  basePath = "/insights",
}: {
  current: number;
  totalPages: number;
  tag: string | null;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const pageUrl = (page: number) =>
    page === 1 ? `${basePath}${query}` : `${basePath}/page/${page}${query}`;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-between border-t border-rule pt-6"
    >
      {current > 1 ? (
        <Link
          href={pageUrl(current - 1)}
          className="inline-flex min-h-11 items-center gap-2 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
        >
          <span aria-hidden="true">←</span> Newer
        </Link>
      ) : (
        <span />
      )}
      <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        Page {current} of {totalPages}
      </p>
      {current < totalPages ? (
        <Link
          href={pageUrl(current + 1)}
          className="inline-flex min-h-11 items-center gap-2 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
        >
          Older <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
