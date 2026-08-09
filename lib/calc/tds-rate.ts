/*
 * lib/calc/tds-rate.ts — TDS rate finder (pure functions, no React).
 *
 * Select a payment type (data/tds.ts) and an amount; the function returns
 * the applicable section, the rate, whether the payment crosses the
 * threshold, and the TDS amount. Thresholds in the Act are "exceeding"
 * thresholds, so a payment exactly at the threshold triggers nothing; the
 * first rupee above it makes the whole payment subject to deduction.
 */

import type { BreakdownLine } from "./types";
import { assertFiniteNonNegative, assertOneOf, formatMoney, formatPct, round2 } from "./helpers";
import { TDS_PAYMENT_IDS, TDS_PAYMENT_TYPES, type TDSPaymentType } from "./data/tds";

export type TDSInput = {
  /** Payment type id from data/tds.ts, e.g. "194c". */
  paymentTypeId: string;
  /** Payment amount in ₹ (the consideration / gross payment). */
  amount: number;
  /** Payer kind — only consulted for entries with a payerSplit. */
  payerKind?: "individual" | "other";
};

export type TDSResult = {
  payment: TDSPaymentType;
  section: string;
  /** The effective rate applied to this payer. */
  ratePct: number;
  /** Threshold from the data, or null when the payment has none. */
  threshold: number | null;
  /** True when TDS is actually deducted (amount exceeds the threshold). */
  applies: boolean;
  /** round2(amount × ratePct / 100) when it applies, otherwise 0. */
  tdsAmount: number;
  breakdown: BreakdownLine[];
};

export function findTDSRate(paymentTypeId: string): TDSPaymentType {
  const payment = TDS_PAYMENT_TYPES.find((t) => t.id === paymentTypeId);
  if (!payment) {
    throw new RangeError(`paymentTypeId must be one of: ${TDS_PAYMENT_IDS.join(", ")}`);
  }
  return payment;
}

export function calculateTDS(input: TDSInput): TDSResult {
  assertFiniteNonNegative(input.amount, "amount");
  const payment = findTDSRate(input.paymentTypeId);

  let ratePct: number;
  if (payment.payerSplit) {
    assertOneOf(input.payerKind, ["individual", "other"] as const, "payerKind");
    ratePct = payment.payerSplit[input.payerKind];
  } else {
    ratePct = payment.ratePct ?? 0;
  }

  const threshold = payment.threshold ?? null;
  const applies = threshold === null || input.amount > threshold;
  const tdsAmount = applies ? round2((input.amount * ratePct) / 100) : 0;

  const breakdown: BreakdownLine[] = [
    { label: "Section", value: payment.section, detail: payment.label },
    {
      label: "Rate",
      value: formatPct(ratePct),
      detail: payment.payerSplit ? `Payer is ${input.payerKind === "individual" ? "individual/HUF" : "other"}: ${formatPct(ratePct)}` : payment.rateLabel,
    },
    {
      label: "Threshold",
      value: threshold === null ? "None" : `₹${threshold}`,
      detail: payment.thresholdLabel ?? (threshold === null ? "TDS applies on the full amount" : ""),
    },
    {
      label: "Deduction",
      value: applies ? "Yes" : "No",
      detail:
        threshold === null
          ? "No threshold for this payment"
          : applies
            ? `${formatMoney(input.amount)} exceeds ${formatMoney(threshold)} — the whole payment is liable`
            : `${formatMoney(input.amount)} is at or below ${formatMoney(threshold)} — nothing to deduct`,
    },
    {
      label: "TDS to deduct",
      value: formatMoney(tdsAmount),
      detail: applies ? `${formatMoney(input.amount)} × ${formatPct(ratePct)}` : "No deduction",
    },
  ];

  return { payment, section: payment.section, ratePct, threshold, applies, tdsAmount, breakdown };
}

/** Build a query string from inputs — used for shareable result links. */
export function tdsQueryString(input: TDSInput): string {
  const p = new URLSearchParams();
  p.set("type", input.paymentTypeId);
  p.set("amount", String(input.amount));
  if (input.payerKind) p.set("payer", input.payerKind);
  return p.toString();
}

/** Parse a query string into (possibly partial) inputs. */
export function parseTDSQuery(query: string): Partial<TDSInput> {
  const p = new URLSearchParams(query);
  const out: Partial<TDSInput> = {};
  const type = p.get("type");
  if (TDS_PAYMENT_IDS.includes(type ?? "")) out.paymentTypeId = type!;
  const amountRaw = p.get("amount");
  const amount = Number(amountRaw);
  if (amountRaw !== null && Number.isFinite(amount) && amount >= 0) out.amount = amount;
  const payer = p.get("payer");
  if (payer === "individual" || payer === "other") out.payerKind = payer;
  return out;
}
