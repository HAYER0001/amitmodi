import type { CSSProperties } from "react";
import Link from "next/link";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { SERVICES } from "@/data/services";

/*
 * TheServices — the eight services as a horizontal book-spread gallery.
 *
 * Each panel is one "move": statute marginalia in the corner, the service
 * name in display type, its one-liner, who it is for, and a real link to
 * /services/<slug>. The panels are passed as children to the client
 * HorizontalScroll primitive, which pins the row and moves it on X as the
 * page scrolls on desktop, and degrades to a swipeable overflow row below
 * 1024px (and under prefers-reduced-motion).
 *
 * The <a> links live in server-rendered markup — the pinned transform never
 * hides them from a crawler. Every one of the eight hrefs appears in the
 * static HTML (verified in the Phase 8 curl check).
 *
 * The "who it is for" lines are the first "Who Needs This" bullet for each
 * service from COPY-DECK.md, kept local to this section.
 */

const WHO_FOR: Record<string, string> = {
  "pan-card-services": "New business owners and partners.",
  "gst-registration": "Businesses crossing the mandatory turnover threshold.",
  "entity-formation": "Two or more individuals starting a business together.",
  "income-tax-tds-returns":
    "Proprietors and salaried individuals with complex investments.",
  "gst-returns-filing": "Any business holding an active GSTIN.",
  "income-tax-appeals": "Taxpayers who received a high-pitched assessment order.",
  "gst-appeals": "Taxpayers facing an unjust tax demand or a cancelled registration.",
  "import-export-licence": "Manufacturers and traders moving goods across borders.",
};

function ServicePanel({
  index,
  name,
  shortName,
  slug,
  oneLiner,
  statute,
  whoFor,
}: {
  index: number;
  name: string;
  shortName: string;
  slug: string;
  oneLiner: string;
  statute: string;
  whoFor: string;
}) {
  const marginal = { "--rot": "3deg" } as CSSProperties;
  return (
    <article className="relative flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-md border border-rule bg-paper p-6 shadow-cut sm:w-[64vw] lg:h-[70vh] lg:w-[44vw] lg:p-10">
      <span
        className="marginalia font-margin text-lg"
        style={marginal}
      >
        {statute}
      </span>

      <p className="font-label text-xs tracking-[0.14em] text-stamp">
        Move {String(index + 1).padStart(2, "0")} / 08
      </p>

      <h3 className="mt-4 font-display text-h2 leading-none text-ink lg:text-h1">
        {name}
      </h3>

      <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
        {oneLiner}
      </p>

      <p className="mt-6 lg:mt-8">
        <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          For
        </span>
        <span className="mt-1 block font-body text-base leading-relaxed text-ink">
          {whoFor}
        </span>
      </p>

      <Link
        href={`/services/${slug}`}
        className="mt-auto inline-flex min-h-11 items-center gap-2 pt-8 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
      >
        Open the {shortName.toLowerCase()}
        <span aria-hidden="true" className="text-base leading-none">
          →
        </span>
      </Link>
    </article>
  );
}

export default function TheServices() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:pb-16 lg:pt-28">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
          Services
        </p>
        <h2
          id="services-title"
          className="mt-3 font-display text-h1 text-ink"
        >
          Eight moves, one board.
        </h2>
        <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
          Every compliance a growing Indian business faces — registration,
          filing, appeals, and trade — handled in one place, by people who
          know the deadlines. Slide through the spread, or jump straight to a
          service.
        </p>
      </div>

      <HorizontalScroll className="px-4 pb-4 sm:px-6 lg:px-12 lg:pb-12">
        {SERVICES.map((service, index) => (
          <ServicePanel
            key={service.slug}
            index={index}
            name={service.name}
            shortName={service.shortName}
            slug={service.slug}
            oneLiner={service.oneLiner}
            statute={service.statuteRefs[0] ?? "Sec 1"}
            whoFor={WHO_FOR[service.slug] ?? "Businesses facing this compliance."}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}
