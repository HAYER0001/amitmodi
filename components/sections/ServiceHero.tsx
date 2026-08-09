import Link from "next/link";
import CutOut from "@/components/ui/CutOut";
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
  "pan-card-services": "fig-couple-shop",
  "gst-registration": "fig-shopkeeper",
  "entity-formation": "fig-founder",
  "income-tax-tds-returns": "fig-accountant-desk",
  "gst-returns-filing": "fig-textile-trader",
  "income-tax-appeals": "fig-worried",
  "gst-appeals": "fig-worried",
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
      className="border-b border-rule bg-paper"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-center lg:py-16">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            {category}
          </p>
          <h1 id="service-hero-title" className="mt-3 font-display text-h1 text-ink">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
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
          className="mx-auto w-28 lg:w-40"
        />
      </div>
    </section>
  );
}
