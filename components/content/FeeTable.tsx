import { formatINR } from "@/lib/content";
import type { Money } from "@/types/content";

/*
 * FeeTable — what the government charges vs what the practice charges.
 *
 * Two clearly separated columns. Government fees are set by the department
 * and are never practice revenue — that separation is the whole point of the
 * table, and the trust note under it restates it.
 *
 * A null fee (or the literal "on-request" marker) renders as "On request",
 * never ₹0 — ₹0 would falsely claim the government charges nothing.
 *
 * On small screens the table scrolls inside its own overflow container, so
 * the page itself never scrolls horizontally.
 */

function formatFee(value: number | "on-request" | null): string {
  if (typeof value !== "number") return "On request";
  return `₹${formatINR(value)}`;
}

type FeeTableProps = {
  pricing: Money;
};

export default function FeeTable({ pricing }: FeeTableProps) {
  return (
    <section aria-labelledby="fee-table-title" className="border-t border-rule py-10">
      <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">Pricing</p>
      <h2 id="fee-table-title" className="mt-2 font-display text-h2 text-ink">
        Who gets paid, and how much
      </h2>

      <div className="mt-6 overflow-x-auto rounded-md border border-rule">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">
            Government charges and practice charges for this service
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th
                scope="col"
                className="px-6 py-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft"
              >
                Government charges
              </th>
              <th
                scope="col"
                className="border-l border-rule px-6 py-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft"
              >
                The practice charges
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              <td className="px-6 py-6">
                <p className="font-display text-h3 text-ink">
                  {formatFee(pricing.govtFee ?? null)}
                </p>
                <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
                  Set by the department and paid directly to it.
                </p>
              </td>
              <td className="border-l border-rule px-6 py-6">
                <p className="font-display text-h3 text-seal">
                  {formatFee(pricing.professionalFee ?? null)}
                </p>
                <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
                  Our fee for preparing and filing this service.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
        Government charges are not our revenue — you pay them directly. The
        only amount that pays for this engagement is the practice fee in the
        second column.
      </p>
    </section>
  );
}
