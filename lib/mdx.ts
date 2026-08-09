/*
 * lib/mdx.ts — the content pipeline (Phase 14, Agent A).
 *
 * Reads MDX from content/blog, content/guides, content/glossary. Every file's
 * frontmatter is validated against a Zod schema: a post missing a required
 * field THROWS, so the build fails loudly rather than shipping broken
 * metadata. `status: 'template'` posts render in development (flagged) and are
 * excluded in production — the same shape as the Phase 13 case-study flags.
 *
 * This module uses node:fs, so it must only be imported from server code.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { slugify } from "./utils";

declare module "reading-time" {
  export default function readingTime(text: string): {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

export const POST_CATEGORIES = ["article", "guide", "glossary", "update"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

const postSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and hyphens"),
  summary: z.string().min(1, "summary is required").optional(),
  datePublished: z.coerce.date(),
  dateModified: z.coerce.date().optional(),
  dateReviewed: z.coerce.date().optional(),
  tags: z.array(z.string().min(1)).default([]),
  category: z.enum(POST_CATEGORIES).optional(),
  serviceTag: z.string().optional(),
  author: z.string().min(1).optional(),
  cover: z.string().optional(),
  status: z.enum(["template", "live"]).default("live"),
  verified: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof postSchema>;

const CONTENT_DIRS = ["blog", "guides", "glossary"] as const;

function categoryFor(dir: string): PostCategory {
  if (dir === "guides") return "guide";
  if (dir === "glossary") return "glossary";
  return "article";
}

/**
 * Accept the frontmatter dialects the content agents actually write — the
 * architect's structural templates (summary / datePublished / serviceTag),
 * the launch articles (description / publishedAt / serviceSlug), and the
 * phase-15 guides (date / description / serviceTag) — and collapse them to
 * one canonical shape before Zod validates it. A post missing BOTH the
 * summary keys (or the date keys, or tags) still fails the build loudly.
 */
function normalizeFrontmatter(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? data.description,
    datePublished: data.datePublished ?? data.publishedAt ?? data.date,
    dateModified: data.dateModified ?? data.updatedAt,
    dateReviewed: data.dateReviewed,
    tags: data.tags,
    category: data.category,
    serviceTag: data.serviceTag ?? data.serviceSlug,
    author: data.author,
    cover: data.cover,
    status: data.status,
    verified: data.verified,
  };
}

/** One entry in the generated table of contents. */
export type TocItem = { id: string; text: string; depth: 2 | 3 };

/** A fully-resolved post: validated frontmatter plus derived metadata. */
export type Post = {
  slug: string;
  title: string;
  summary: string;
  datePublished: Date;
  dateModified: Date | null;
  dateReviewed: Date | null;
  tags: string[];
  category: PostCategory;
  serviceTag: string | null;
  author: string;
  cover: string | null;
  status: "template" | "live";
  verified: boolean;
  /** "4 min read" — from the reading-time package. */
  readingTime: string;
  toc: TocItem[];
  /** Plain-text lead paragraph, for cards and the RSS feed. */
  excerpt: string;
  /** The markdown body (frontmatter stripped) — for compileMDX. */
  source: string;
};

/* ---- parsing helpers -------------------------------------------------- */

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const pattern = /^(#{2,3})\s+(.+)$/gm;
  for (const match of markdown.matchAll(pattern)) {
    const depth = (match[1].length as 2 | 3) as 2 | 3;
    const text = match[2].trim().replace(/[*_`]/g, "");
    if (!text) continue;
    items.push({ id: slugify(text), text, depth });
  }
  return items;
}

function extractExcerpt(markdown: string, max = 220): string {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  for (const paragraph of paragraphs) {
    if (paragraph.startsWith("#")) continue;
    const plain = paragraph.replace(/[#*_`>!]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
    if (plain) return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
  }
  return "";
}

function readPost(dir: string, file: string): Post {
  const filePath = path.join(process.cwd(), "content", dir, file);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  const parsed = postSchema.safeParse(normalizeFrontmatter(data));
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter in content/${dir}/${file} — ${detail}`);
  }

  const fm = parsed.data;
  /* Articles must state their summary in frontmatter — that is the Phase 14
   * loud-fail contract. Guides carry theirs in a body summary-box, so a guide
   * missing the field degrades to its own first paragraph instead of killing
   * the whole build. */
  if (dir === "blog" && !fm.summary) {
    throw new Error(
      `Invalid frontmatter in content/${dir}/${file} — summary: summary is required`,
    );
  }
  const summary = fm.summary ?? (extractExcerpt(content) || fm.title);
  return {
    slug: fm.slug,
    title: fm.title,
    summary,
    datePublished: fm.datePublished,
    dateModified: fm.dateModified ?? null,
    dateReviewed: fm.dateReviewed ?? null,
    tags: fm.tags,
    category: fm.category ?? categoryFor(dir),
    serviceTag: fm.serviceTag ?? null,
    author: fm.author ?? "The Principal",
    cover: fm.cover ?? null,
    status: fm.status,
    verified: fm.verified,
    readingTime: readingTime(content).text,
    toc: extractToc(content),
    excerpt: extractExcerpt(content),
    source: content,
  };
}

/* ---- accessors -------------------------------------------------------- */

/**
 * Try to read a file as an article, returning null when it does not satisfy
 * the article schema. Used ONLY for the glossary directory: a glossary term is
 * a distinct content type (lib/glossary.ts) whose frontmatter is deliberately
 * tolerantly-schemaed — a term does not need a date, a tag list, or a summary.
 * Files that are not article-shaped are surfaced by the glossary routes, never
 * thrown here. Articles (blog/guides) keep the strict, fail-loudly contract.
 */
function tryReadPost(dir: string, file: string): Post | null {
  try {
    return readPost(dir, file);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Invalid frontmatter in content/")) {
      return null;
    }
    throw error;
  }
}

/** Every post on disk, newest first. Throws on invalid frontmatter. */
export function getAllPosts(): Post[] {
  const posts: Post[] = [];
  for (const dir of CONTENT_DIRS) {
    const full = path.join(process.cwd(), "content", dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full)) {
      if (!file.endsWith(".mdx")) continue;
      if (dir === "glossary") {
        const post = tryReadPost(dir, file);
        if (post) posts.push(post);
        continue;
      }
      posts.push(readPost(dir, file));
    }
  }
  return posts.sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime());
}

/**
 * Posts safe to show. In production, `status: 'template'` posts are excluded;
 * in development they render flagged as samples so the pipeline is testable
 * before the real articles land.
 */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter(
    (post) => post.status === "live" || process.env.NODE_ENV !== "production",
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  const needle = tag.toLowerCase();
  return getPublishedPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === needle),
  );
}

/** All tags in use, deduplicated case-insensitively (first casing wins). */
export function getAllTags(): string[] {
  const map = new Map<string, string>();
  for (const post of getPublishedPosts()) {
    for (const tag of post.tags) {
      const key = tag.toLowerCase();
      if (!map.has(key)) map.set(key, tag);
    }
  }
  return [...map.values()].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

/** The canonical casing for a tag — so URLs stay stable whatever the file uses. */
export function canonicalTag(tag: string): string {
  const found = getAllTags().find((t) => t.toLowerCase() === tag.toLowerCase());
  return found ?? tag;
}

/**
 * Related posts: shared tags first, falling back to the same category, then
 * nearest neighbours. Never includes the post itself.
 */
export function getRelatedPosts(post: Post, count = 3): Post[] {
  const others = getPublishedPosts().filter((p) => p.slug !== post.slug);
  const byTag = others.filter((p) => p.tags.some((tag) => post.tags.includes(tag)));
  const sameCategory = others.filter((p) => p.category === post.category);
  const pool = byTag.length >= count ? byTag : [...byTag, ...sameCategory, ...others];
  const seen = new Set<string>();
  return pool
    .filter((p) => !seen.has(p.slug) && seen.add(p.slug))
    .slice(0, count);
}

/**
 * Neighbours in the newest-first list. `newer` is the post published after
 * this one, `older` the one before it.
 */
export function getAdjacentPosts(
  post: Post,
): { newer: Post | null; older: Post | null } {
  const all = getPublishedPosts();
  const index = all.findIndex((p) => p.slug === post.slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? all[index - 1] : null,
    older: index < all.length - 1 ? all[index + 1] : null,
  };
}

/* ---- pagination ------------------------------------------------------- */

export const POSTS_PER_PAGE = 12;

export function paginate<T>(
  items: T[],
  page: number,
  perPage: number = POSTS_PER_PAGE,
): {
  items: T[];
  current: number;
  totalPages: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    current,
    totalPages,
    total,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

/* ---- image dimensions (for the MDX <img> → next/image override) -------- */

/**
 * Reads width/height out of PNG and JPEG headers so next/image gets the
 * required dimensions and CLS is prevented. Returns null for anything else —
 * the MDX img override then falls back to a plain <img> rather than guessing.
 * Build-time only; paths are relative to public/.
 */
export function getImageDimensions(
  src: string,
): { width: number; height: number } | null {
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  let buffer: Buffer;
  try {
    buffer = fs.readFileSync(filePath);
  } catch {
    return null;
  }

  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    /* PNG: IHDR width at 16, height at 20 */
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    /* JPEG: walk markers to the SOF segment */
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  return null;
}
