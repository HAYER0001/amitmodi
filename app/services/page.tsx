import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import { getAllServices, formatTurnaround } from "@/lib/content";
import type { Service, ServiceCategory } from "@/types/content";

export const metadata: Metadata = {
  title: "Services | Compliance in Check",
  description:
    "GST registration, income tax and TDS returns, appeals, and import-export licensing for Indian businesses — handled by one practice.",
  alternates: { canonical: "/services" },
};

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "registration", label: "Registration" },
  { id: "filing", label: "Filing & Returns" },
  { id: "litigation", label: "Litigation & Appeals" },
  { id: "trade", label: "Trade & Cross-Border" },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const marginal = { "--rot": "3deg" } as CSSProperties;
  const turnaround =
    service.turnaround.minDays > 0 ? formatTurnaround(service.turnaround) : null;

  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)} className="h-full">
      <article className="relative flex h-full flex-col gap-3 rounded-md border border-rule bg-paper p-6 shadow-cut">
        <span className="marginalia font-margin text-base" style={marginal}>
          {service.statuteRefs[0] ?? "Sec 1"}
        </span>
        <h3 className="font-display text-h2 leading-tight text-ink">
          {service.name}
        </h3>
        <p className="font-body text-sm leading-relaxed text-ink-soft">
          {service.oneLiner}
        </p>
        {turnaround && (
          <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
            {turnaround}
          </p>
        )}
        <Link
          href={`/services/${service.slug}`}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
        >
          View service
          <span aria-hidden="true" className="text-base leading-none">
            →
          </span>
        </Link>
      </article>
    </Reveal>
  );
}

export default function ServicesIndex() {
  const services = getAllServices();
  let counter = 0;

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Services
          </p>
          <h1 className="mt-3 font-display text-display text-ink">
            Eight moves, one board.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            Every compliance a growing Indian business faces — registration,
            filing, appeals, and trade — handled in one place, by people who
            know the deadlines.
          </p>
        </header>

        {CATEGORIES.map((category) => {
          const grouped = services.filter((s) => s.category === category.id);
          if (grouped.length === 0) return null;

          return (
            <section
              key={category.id}
              aria-labelledby={`cat-${category.id}`}
              className="border-t border-rule py-12"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 id={`cat-${category.id}`} className="font-display text-h3 text-ink">
                  {category.label}
                </h2>
                <p className="font-label text-xs tracking-[0.14em] text-ink-soft">
                  {String(grouped.length).padStart(2, "0")} services
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped.map((service) => (
                  <ServiceCard
                    key={service.slug}
                    service={service}
                    index={counter++}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
