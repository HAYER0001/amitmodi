import Link from "next/link";
import { formatINR } from "@/lib/content";
import type { Money } from "@/types/content";

/*
 * PricingBlock — government fee vs professional fee, clearly separated.
 *
 * Two visually distinct amounts plus a total. A null / "on-request" fee
 * renders "On request" with a link to contact — NEVER "₹0" or "Free".
 * The total row renders only when BOTH fees are real numbers, so a page
 * never shows a calculated price from unknown parts.
 */

function rupee(n: number): string {
  return `\u20b9${formatINR(n)}`;
}

function FeeCell({
  label,
  value,
  note,
  emphasized,
}: {
  label: string;
  value: number | "on-request" | null;
  note?: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        emphasized
          ? "flex flex-col gap-2 rounded-md border border-seal/30 bg-seal/5 p-6"
          : "flex flex-col gap-2 rounded-md border border-rule bg-paper p-6"
      }
    >
      <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </p>
      {typeof value === "number" ? (
        <p className="font-display text-h3 text-ink">{rupee(value)}</p>
      ) : (
        <p className="font-display text-h3 text-ink">
          On request
          <Link
            href="/contact"
            className="ml-3 align-middle font-label text-xs uppercase tracking-[0.14em] text-seal underline decoration-seal/40 underline-offset-4 transition-colors hover:text-seal-deep"
          >
            Ask us
          </Link>
        </p>
      )}
      {note && (
        <p className="font-body text-sm leading-relaxed text-ink-soft">{note}</p>
      )}
    </div>
  );
}

export default function PricingBlock({
  pricing,
}: {
  pricing: Money | undefined;
}) {
  if (!pricing) return null;

  const govt = pricing.govtFee ?? null;
  const professional = pricing.professionalFee ?? null;
  const total =
    typeof govt === "number" && typeof professional === "number"
      ? govt + professional
      : null;

  return (
    <section aria-labelledby="pricing-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 id="pricing-title" className="font-display text-h2 text-ink">
        Pricing
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FeeCell
          label="Government fee"
          value={govt}
          note="Paid directly to the department — we never mark this up."
        />
        <FeeCell
          label="Professional fee"
          value={professional}
          note="Our fee for preparing and filing the application."
          emphasized
        />
      </div>
      {total !== null && (
        <p className="mt-6 border-t border-rule pt-4 font-label text-sm uppercase tracking-[0.14em] text-ink">
          Total · {rupee(total)}
        </p>
      )}
    </section>
  );
}
