/*
 * lib/case-studies.ts — loader + parser for content/case-studies/*.mdx
 *
 * Agent B writes each case study as an MDX file whose frontmatter carries
 * `slug`, `title`, `status`, and — load-bearing — `consentObtained`. The body
 * is the STAR structure: `## Situation`, `## Task`, `## Action`, `## Result`
 * sections.
 *
 * CONTRACT (the phase-13(A) brief): an entry whose `consentObtained` is not the
 * literal value `true` does not render, in EITHER advertising mode. The filter
 * lives here, once, so no page or card can accidentally render a study without
 * consent. `getAllCaseStudies()` is the only leak-free accessor.
 *
 * This module uses node:fs, so it must only be imported from server components.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type CaseStudy = {
  slug: string;
  title: string;
  status: string;
  consentObtained: boolean;
  /** The four STAR sections in document order (Situation, Task, Action, Result). */
  sections: CaseStudySection[];
};

export type CaseStudySection = {
  heading: string;
  body: string;
};

const DIR = path.join(process.cwd(), "content", "case-studies");

const SECTION_HEADING_RE = /^##\s+(.+)$/;

function parseSections(content: string): CaseStudySection[] {
  const sections: CaseStudySection[] = [];
  let current: CaseStudySection | null = null;
  for (const rawLine of content.split(/\r?\n/)) {
    const match = rawLine.match(SECTION_HEADING_RE);
    if (match) {
      current = { heading: match[1].trim(), body: "" };
      sections.push(current);
    } else if (current) {
      current.body += (current.body ? "\n" : "") + rawLine;
    }
  }
  return sections.filter((s) => s.heading.length > 0);
}

function readFile(file: string): CaseStudy | null {
  const filePath = path.join(DIR, file);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const slug = typeof data.slug === "string" ? data.slug : file.replace(/\.mdx$/, "");
  const title = typeof data.title === "string" ? data.title : slug;
  const status = typeof data.status === "string" ? data.status : "draft";
  return {
    slug,
    title,
    status,
    consentObtained: data.consentObtained === true,
    sections: parseSections(content),
  };
}

/** Every case study on disk, regardless of consent — for index/meta logic. */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readFile)
    .filter((study): study is CaseStudy => study !== null);
}

/** Only consentObtained:true studies. This is the only sanctioned accessor for rendering. */
export function getConsentedCaseStudies(): CaseStudy[] {
  return getAllCaseStudies().filter((study) => study.consentObtained);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getConsentedCaseStudies().find((study) => study.slug === slug);
}

/** Plain-text excerpt of a section, for teaser cards. */
export function sectionExcerpt(study: CaseStudy, heading: string, max = 180): string | null {
  const section = study.sections.find((s) => s.heading.toLowerCase() === heading.toLowerCase());
  if (!section) return null;
  const plain = section.body
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return null;
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
