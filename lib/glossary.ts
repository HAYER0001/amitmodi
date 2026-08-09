/*
 * lib/glossary.ts — the glossary content reader (Phase 15, Agent A).
 *
 * A glossary term is a distinct content type from an article. Each term is a
 * short MDX file whose frontmatter carries the display name and slug, and
 * whose body carries the structure an entry page needs:
 *
 *   # <Full form>            the expanded name (optional — some files state
 *                            "Full form: ..." inline instead)
 *   <definition>             the ~40-word plain-language definition
 *   ### Example              one worked example
 *   ### When It Matters in Practice   where the term shows up in real work
 *   ### Related Terms        bullet list of sibling terms
 *   ### Services             links to the commercial service pages
 *
 * The schema here is deliberately tolerant — a term does not need a date, a
 * tag list, or even a summary to be publishable. lib/mdx.ts defers glossary
 * files to this module (see getAllPosts), so the article feed and the
 * glossary can disagree about shape without breaking each other's build.
 *
 * This module uses node:fs, so it must only be imported from server code.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { slugify } from "./utils";

const termSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and hyphens"),
  summary: z.string().optional(),
  datePublished: z.coerce.date().optional(),
  serviceTag: z.string().optional(),
  status: z.enum(["template", "live"]).default("live"),
  verified: z.boolean().default(false),
});

/** The parsed, displayable shape of one glossary entry. */
export type GlossaryTerm = {
  term: string;
  slug: string;
  fullForm: string;
  /** The ~40-word plain-language definition. */
  definition: string;
  /** The "where it appears in practice" section, when present. */
  practice: string;
  /** The worked example section, when present. */
  example: string;
  /** Related term names, in the order the file lists them. */
  related: string[];
  /** Links to commercial service pages extracted from the Services section. */
  serviceLinks: { label: string; href: string }[];
  serviceTag: string | null;
  summary: string;
  datePublished: Date | null;
  /** "A"–"Z", or "#" when the term starts with a digit/symbol. */
  letter: string;
  status: "template" | "live";
  verified: boolean;
  source: string;
};

/* ---- body parsing ------------------------------------------------------ */

type ParsedBody = {
  fullForm: string;
  definition: string;
  sections: Map<string, string>;
};

const headingRe = /^(#{1,3})\s+(.+)$/;

/**
 * Splits the markdown body into its structural pieces. Heading text is
 * normalised to a lowercase key (punctuation stripped) so files that write
 * "When It Matters in Practice" and "When it matters in practice" land in the
 * same bucket.
 */
function parseBody(source: string): ParsedBody {
  let fullForm = "";
  const definition: string[] = [];
  const rawSections = new Map<string, string[]>();
  let current: { key: string; lines: string[] } | null = null;

  for (const raw of source.split("\n")) {
    const match = raw.match(headingRe);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      if (level === 1 && !fullForm) {
        fullForm = text;
      } else {
        if (current) rawSections.set(current.key, current.lines);
        current = { key: text, lines: [] };
      }
      continue;
    }

    const line = raw.trim();
    if (!line) continue;

    /* "Full form: Section 12A of the Income Tax Act, 1961" — some files state
       the expansion inline instead of using an H1. It is metadata, not part of
       the definition paragraph. */
    const fullFormMatch = line.match(/^full\s*form:\s*(.+)$/i);
    if (fullFormMatch && !fullForm) {
      fullForm = fullFormMatch[1].trim();
      continue;
    }

    if (!current) {
      definition.push(line);
    } else {
      current.lines.push(line);
    }
  }
  if (current) rawSections.set(current.key, current.lines);

  const sections = new Map<string, string>();
  const keyFor = (key: string) => key.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  for (const [key, lines] of rawSections) {
    sections.set(keyFor(key), lines.join("\n"));
  }

  return { fullForm, definition: definition.join(" ").trim(), sections };
}

function sectionText(
  parsed: ParsedBody,
  matchers: string[],
): string {
  for (const [key, text] of parsed.sections) {
    if (matchers.some((m) => key.includes(m))) return text;
  }
  return "";
}

function bulletNames(text: string): string[] {
  const names: string[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) continue;
    const item = trimmed.replace(/^-\s*/, "").replace(/\[([^\]]+)\]\([^)]*\)/, "$1").trim();
    if (item) names.push(item);
  }
  return names;
}

function linksIn(text: string): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  for (const match of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g)) {
    links.push({ label: match[1], href: match[2] });
  }
  return links;
}

/** Strip markdown formatting so the definition reads clean as a sentence. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function letterFor(term: string): string {
  const first = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

/* ---- reading ----------------------------------------------------------- */

function readTermFile(file: string): GlossaryTerm {
  const filePath = path.join(process.cwd(), "content", "glossary", file);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  const parsed = termSchema.safeParse(data);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter in content/glossary/${file} — ${detail}`);
  }

  const fm = parsed.data;
  const body = parseBody(content);
  const practice = sectionText(body, ["when it matter", "in practice"]);
  const example = sectionText(body, ["example"]);
  const related = bulletNames(sectionText(body, ["related term"]));
  const serviceLinks = linksIn(
    sectionText(body, ["service"]),
  ).filter((link) => link.href.startsWith("/"));

  return {
    term: fm.title,
    slug: fm.slug,
    fullForm: body.fullForm || fm.title,
    definition: stripMarkdown(body.definition || fm.summary || ""),
    practice: stripMarkdown(practice),
    example: stripMarkdown(example),
    related,
    serviceLinks,
    serviceTag: fm.serviceTag ?? null,
    summary: stripMarkdown(fm.summary ?? body.definition ?? ""),
    datePublished: fm.datePublished ?? null,
    letter: letterFor(fm.title),
    status: fm.status,
    verified: fm.verified,
    source: content,
  };
}

/* ---- accessors --------------------------------------------------------- */

/**
 * Every term on disk, sorted by term name. Throws on invalid frontmatter —
 * same loud contract as the article pipeline, but with the tolerant schema.
 */
export function getAllTerms(): GlossaryTerm[] {
  const dir = path.join(process.cwd(), "content", "glossary");
  if (!fs.existsSync(dir)) return [];
  const terms = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readTermFile(file));
  return terms.sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
}

/** Terms safe to show. `status: 'template'` terms are excluded in production. */
export function getPublishedTerms(): GlossaryTerm[] {
  return getAllTerms().filter(
    (term) => term.status === "live" || process.env.NODE_ENV !== "production",
  );
}

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return getPublishedTerms().find((term) => term.slug === slug);
}

/** Every term whose slug matches a name, for resolving "related terms". */
export function getAllTermSlugs(): Set<string> {
  return new Set(getAllTerms().map((term) => term.slug));
}

/** Resolve a related-term name to its canonical slug, or null if unknown. */
export function slugForTermName(name: string, known: Set<string>): string | null {
  const candidate = slugify(name);
  return known.has(candidate) ? candidate : null;
}
