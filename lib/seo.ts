/*
 * lib/seo.ts — the single metadata factory (Phase 17, Agent A).
 *
 * Every page in the app builds its Metadata through buildMetadata, so the
 * title/description limits are enforced in code. Enforcing at build time —
 * throwing — is the only enforcement that survives contact with a deadline:
 * a linting warning gets ignored, a failed build does not.
 *
 * The factory always emits the canonical URL, the en-IN hreflang alternative,
 * and the robots directives instrtion.md requires (max-snippet -1,
 * max-image-preview large, max-video-preview -1).
 *
 * This module has no node-only imports and can be used anywhere, but the
 * throw-on-overlength contract means it should only run where a build failure
 * is visible (server / build contexts), not inside client event handlers.
 */

import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi-one.vercel.app";
/* The fallback is the CURRENT live host, not an aspirational one. It was
   pointing at a design-codename domain, so every canonical, every sitemap
   entry and every share card advertised a domain the practice does not own.
   Set NEXT_PUBLIC_SITE_URL in Vercel to the real domain the day it resolves;
   until then this keeps the URLs honest. Exactly one definition exists in
   the repo — every other module imports this constant instead of declaring
   its own fallback. */

/* The generated share card. Without this, every link shared to WhatsApp —
   which is how an Indian small-business client actually forwards a
   recommendation — renders as a bare grey rectangle. */
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export const SITE_NAME = "Amit Modi & Co.";

/** instrtion.md: titles strictly under 60 characters. */
export const TITLE_LIMIT = 60;

/** The practical meta-description ceiling. */
export const DESCRIPTION_LIMIT = 155;

/**
 * The generated default social card (app/opengraph-image.tsx). Pages with a
 * real cover pass their own `image` instead.
 */

/* ---- fitting helpers --------------------------------------------------- */

/**
 * Truncate to `limit` at a word boundary with an ellipsis. Content titles and
 * summaries are written for the page, not for the SERP, so the meta values are
 * fitted here — after which buildMetadata still throws if the result is
 * over-length, guarding hand-authored values.
 */
function fit(text: string, limit: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= limit) return trimmed;
  const cut = trimmed.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const end = lastSpace > limit * 0.6 ? lastSpace : cut.length;
  return `${cut.slice(0, end).trimEnd()}…`;
}

/** Site title with the brand suffix, fitted to the 60-char limit. */
export function withSiteName(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= TITLE_LIMIT ? full : fit(title, TITLE_LIMIT);
}

/** A meta description that will never trip the 155-char build guard. */
export function fitDescription(text: string): string {
  return fit(text, DESCRIPTION_LIMIT);
}

/* ---- the factory ------------------------------------------------------- */

export type BuildMetadataArgs = {
  /** The complete <title>, already including any site-name suffix. */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/services/gst-registration". */
  path: string;
  /** Site-relative image path; defaults to the generated OG card. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  /** Link headers / alternate content types, e.g. { "text/markdown": "…/x.md" }. */
  alternateTypes?: Record<string, string>;
};

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  alternateTypes,
}: BuildMetadataArgs): Metadata {
  if (title.length > TITLE_LIMIT) {
    throw new Error(
      `buildMetadata: title exceeds ${TITLE_LIMIT} characters (${title.length}): "${title}"`,
    );
  }
  if (description.length > DESCRIPTION_LIMIT) {
    throw new Error(
      `buildMetadata: description exceeds ${DESCRIPTION_LIMIT} characters (${description.length}): "${description}"`,
    );
  }

  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");
  const url = `${SITE_URL}${canonical}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { "en-IN": canonical },
      ...(alternateTypes ? { types: alternateTypes } : {}),
    },
    robots: {
      index: !noIndex,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      type,
      locale: "en_IN",
      url,
      siteName: SITE_NAME,
      title,
      description,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
