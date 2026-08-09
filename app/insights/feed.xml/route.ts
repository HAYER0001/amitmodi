import { getPublishedPosts } from "@/lib/mdx";

/*
 * app/insights/feed.xml/route.ts — RSS 2.0 feed (Phase 14, Agent A).
 *
 * Regenerated on each request so a post revalidated by ISR appears in the
 * feed without a rebuild. Aggregators and some AI crawlers discover new
 * content through this. Posts with status: 'template' never appear.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getPublishedPosts();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/insights/${post.slug}`;
      const reviewed = post.dateReviewed ? post.dateReviewed.toUTCString() : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${post.datePublished.toUTCString()}</pubDate>
      ${reviewed ? `      <dc:date>${reviewed}</dc:date>\n` : ""}      <description>${escapeXml(post.summary)}</description>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Compliance in Check — Insights</title>
    <link>${escapeXml(SITE_URL)}/insights</link>
    <description>Compliance notes, guides, and updates for Indian businesses — GST, income tax, TDS, and trade.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
