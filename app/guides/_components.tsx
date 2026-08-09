import Link from "next/link";
import type { Post } from "@/lib/mdx";
import type { LeadMagnetAsset } from "@/lib/schemas";

/*
 * app/guides/_components.tsx — shared server-only UI for the /guides routes.
 * The GUIDE_MAGNETS map pairs each guide (by slug) with the formatted PDF
 * whose content it extends; guides without a dedicated PDF get the document
 * checklist pack. Underscore-prefixed, so Next never treats it as a route.
 */

export function formatGuideDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export type GuideMagnet = {
  slug: LeadMagnetAsset;
  title: string;
  blurb: string;
};

const MAGNET_COPY: Record<LeadMagnetAsset, Omit<GuideMagnet, "slug">> = {
  "gst-compliance-checklist": {
    title: "The GST Compliance Checklist",
    blurb:
      "A print-ready, month-by-month GST checklist — reconciliations, returns, and the annual items, tick-boxed.",
  },
  "document-checklist-pack": {
    title: "The Master Document Pack",
    blurb:
      "A print-ready pack of the documents needed for every service the practice runs, service by service.",
  },
  "annual-compliance-calendar": {
    title: "The Annual Compliance Calendar",
    blurb:
      "A one-page calendar of the recurring deadlines an Indian business carries — monthly, quarterly, and annual.",
  },
};

export const DEFAULT_GUIDE_MAGNET: GuideMagnet = {
  slug: "document-checklist-pack",
  ...MAGNET_COPY["document-checklist-pack"],
};

/** The magnet that pairs with a guide slug. Unknown guides get the default. */
export function magnetForGuide(slug: string): GuideMagnet {
  const explicit: Partial<Record<string, LeadMagnetAsset>> = {
    "gst-compliance-checklist": "gst-compliance-checklist",
  };
  const asset = explicit[slug];
  if (!asset) return DEFAULT_GUIDE_MAGNET;
  return { slug: asset, ...MAGNET_COPY[asset] };
}

export function GuideCard({ guide }: { guide: Post }) {
  return (
    <article className="flex h-full flex-col rounded-md border border-rule bg-paper p-6 shadow-cut">
      <div className="flex items-center justify-between gap-4">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          Guide
        </p>
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {guide.readingTime}
        </p>
      </div>
      <h2 className="mt-3 font-display text-h3 text-ink">
        <Link
          href={`/guides/${guide.slug}`}
          className="transition-colors hover:text-seal"
        >
          {guide.title}
        </Link>
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
        {guide.summary}
      </p>
      <div className="mt-auto pt-4">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {formatGuideDate(guide.datePublished)}
        </p>
        {guide.status === "template" && (
          <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-stamp">
            Structural sample — not published
          </p>
        )}
      </div>
    </article>
  );
}
