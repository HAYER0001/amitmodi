import Link from "next/link";
import CutOut from "@/components/ui/CutOut";
import Marginalia from "@/components/ui/Marginalia";
import { ASSETS, type AssetKey } from "@/data/assets";
import { formatINR, formatTurnaround } from "@/lib/content";
import type { Service } from "@/types/content";

/*
 * ServiceHero — the compact service-page hero.
 *
 * Eyebrow (category), H1 in display type, the one-liner, turnaround and
 * price-from chips, and a small ink CutOut. Deliberately NOT full-viewport:
 * on a service page the user has a task, so the direct answer below must be
 * visible without scrolling on a laptop.
 *
 * Chips render only real data — a turnaround with minDays 0 (TBD) and an
 * "on-request" fee render as nothing / "Fee on request", never "0 days" or
 * "₹0".
 */

const FIGURE_BY_SLUG: Record<string, AssetKey> = {
  "pan-card-services": "fig-consultant",
  "gst-registration": "fig-shopkeeper",
  "entity-formation": "fig-founder",
  "income-tax-tds-returns": "fig-accountant-desk",
  "gst-returns-filing": "fig-couple-shop",
  "income-tax-appeals": "fig-worried",
  "gst-appeals": "fig-restaurateur",
  "import-export-licence": "fig-exporter",
};

const CATEGORY_LABEL: Record<string, string> = {
  registration: "Registration",
  filing: "Filing & Returns",
  litigation: "Litigation & Appeals",
  trade: "Trade & Cross-Border",
};

export default function ServiceHero({ service }: { service: Service }) {
  const figure = ASSETS[FIGURE_BY_SLUG[service.slug] ?? "fig-accountant-desk"];
  const category = CATEGORY_LABEL[service.category] ?? "Services";
  const turnaround =
    service.turnaround.minDays > 0 ? formatTurnaround(service.turnaround) : null;
  const fee = service.pricing.professionalFee;
  const priceFrom = typeof fee === "number" ? `From \u20b9${formatINR(fee)}` : null;

  return (
    <section
      aria-labelledby="service-hero-title"
      className="relative overflow-hidden border-b border-rule"
    >
      {/* Statute notes + one collage object. Without these a service page read
          as a different, cheaper website than the homepage — which is the single
          thing that most made the whole build feel like a veneer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Marginalia count={9} seed={7} exclude={{ top: 8, left: 2, right: 74, bottom: 94 }} />
        <div className="cut-out-drift absolute right-[4%] top-[14%] hidden w-24 rotate-6 lg:block xl:w-32">
          <CutOut
            src={ASSETS["cut-rubber-stamp"].src}
            alt=""
            width={ASSETS["cut-rubber-stamp"].width}
            height={ASSETS["cut-rubber-stamp"].height}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:py-24">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            {category}
          </p>
          <h1 id="service-hero-title" className="mt-3 max-w-[15ch] font-display text-h1 leading-[0.9] tracking-[-0.02em] text-seal lg:text-display lg:leading-[0.86]">
            {service.name}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-body italic leading-relaxed text-ink">
            {service.oneLiner}
          </p>

          {(turnaround || priceFrom) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {turnaround && (
                <span className="inline-flex min-h-11 items-center rounded-pill border border-rule bg-paper px-5 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {turnaround}
                </span>
              )}
              {priceFrom ? (
                <span className="inline-flex min-h-11 items-center rounded-pill border border-seal/30 bg-seal/5 px-5 font-label text-xs uppercase tracking-[0.14em] text-seal">
                  {priceFrom}
                </span>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center rounded-pill border border-rule bg-paper px-5 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
                >
                  Fee on request
                </Link>
              )}
            </div>
          )}
        </div>

        <CutOut
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          rotate={-2}
          className="mx-auto w-48 drop-shadow-md lg:w-64 xl:w-72"
        />
      </div>
    </section>
  );
}
