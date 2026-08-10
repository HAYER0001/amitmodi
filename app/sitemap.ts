/*
 * app/sitemap.ts — dynamic sitemap (Phase 17, Agent A).
 *
 * Every public URL lives here. lastModified comes only from a content file's
 * real date — the pipeline's dateModified (updatedAt) falling back to
 * datePublished — never from `new Date()`. A sitemap that claims every page
 * changed today is noise, and crawlers learn to ignore it. Static pages that
 * have no content file simply omit lastModified.
 *
 * services and tools get the highest priority; glossary the lowest.
 */

import type { MetadataRoute } from "next";
import { getConsentedCaseStudies } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/seo";
import { getAllServices } from "@/lib/content";
import {
  getPublishedPosts,
  getPostsByTag,
  getAllTags,
  paginate,
  POSTS_PER_PAGE,
} from "@/lib/mdx";
import { getPublishedTerms } from "@/lib/glossary";
import { BRAND } from "@/data/brand";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

function entry({
  path,
  lastModified,
  changeFrequency,
  priority,
}: Entry): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: lastModified ?? undefined,
    changeFrequency,
    priority,
  };
}

/** The stable, hand-written static routes (robots disallows the rest). */
const STATIC: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools", changeFrequency: "weekly", priority: 0.9 },
  { path: "/insights", changeFrequency: "weekly", priority: 0.7 },
  { path: "/guides", changeFrequency: "weekly", priority: 0.7 },
  { path: "/glossary", changeFrequency: "weekly", priority: 0.5 },
  { path: "/compliance-calendar", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/practice", changeFrequency: "monthly", priority: 0.5 },
  { path: "/practice/principal", changeFrequency: "monthly", priority: 0.5 },
];

/*
 * /case-studies only exists while at least one client has consented to publish.
 * Until then the route 404s, so listing it here would advertise a dead URL to
 * every crawler — a sitemap full of 404s is a trust signal you spend once.
 * It reappears automatically the moment a study is consented.
 */
const CONDITIONAL: Entry[] = getConsentedCaseStudies().length
  ? [{ path: "/case-studies", changeFrequency: "monthly", priority: 0.5 }]
  : [];

/** The five calculator routes (the same list app/tools/page.tsx renders). */
const TOOLS: Entry[] = [
  { path: "/tools/gst-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/late-fee-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/tds-rate-finder", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/itr-form-selector", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/hsn-sac-lookup", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const map: MetadataRoute.Sitemap = [];

  for (const item of STATIC) map.push(entry(item));
  for (const item of CONDITIONAL) map.push(entry(item));

  for (const service of getAllServices()) {
    map.push(
      entry({
        path: `/services/${service.slug}`,
        changeFrequency: "weekly",
        priority: 0.9,
      }),
    );
  }

  for (const item of TOOLS) map.push(entry(item));

  const posts = getPublishedPosts();
  const articles = posts.filter((post) => post.category === "article");
  const guides = posts.filter((post) => post.category === "guide");

  for (const article of articles) {
    map.push(
      entry({
        path: `/insights/${article.slug}`,
        lastModified: (article.dateModified ?? article.datePublished).toISOString(),
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );
  }

  for (const guide of guides) {
    map.push(
      entry({
        path: `/guides/${guide.slug}`,
        lastModified: (guide.dateModified ?? guide.datePublished).toISOString(),
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );
  }

  for (const term of getPublishedTerms()) {
    map.push(
      entry({
        path: `/glossary/${term.slug}`,
        lastModified: term.datePublished?.toISOString() ?? undefined,
        changeFrequency: "yearly",
        priority: 0.4,
      }),
    );
  }

  /* Insights index + pagination. */
  const insightPages = paginate(articles, 1, POSTS_PER_PAGE).totalPages;
  for (let page = 1; page <= insightPages; page += 1) {
    map.push(
      entry({
        path: page === 1 ? "/insights" : `/insights/page/${page}`,
        changeFrequency: "weekly",
        priority: page === 1 ? 0.7 : 0.5,
      }),
    );
  }

  /* Tag archives + pagination. */
  for (const tag of getAllTags()) {
    const encoded = encodeURIComponent(tag);
    const tagPages = paginate(getPostsByTag(tag), 1, POSTS_PER_PAGE).totalPages;
    for (let page = 1; page <= tagPages; page += 1) {
      map.push(
        entry({
          path:
            page === 1
              ? `/insights/tag/${encoded}`
              : `/insights/tag/${encoded}/page/${page}`,
          changeFrequency: "monthly",
          priority: 0.3,
        }),
      );
    }
  }

  /* City pages — none exist yet (BRAND.serviceArea.cities is empty); when a
   * city is confirmed it is added here so the sitemap never invents one. */
  const confirmedCities = BRAND.serviceArea.cities as readonly string[];
  for (const city of confirmedCities) {
    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    map.push(
      entry({
        path: `/services/gst-registration/${slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    );
  }

  return map;
}
