/*
 * lib/calc/gst.ts — GST amount calculator (pure functions, no React).
 *
 * Works from an amount that is either exclusive of GST (the taxable value is
 * the amount) or inclusive (the amount already contains GST and the taxable
 * value is derived). Splits the tax into CGST + SGST for an intra-state
 * supply, or a single IGST for an inter-state supply. Every step lands in
 * `breakdown` so the user sees the arithmetic.
 *
 * Money rules:
 *  - round2 is applied at each derived step
 *  - cgst/sgst are derived from the SAME rounded tax, so cgst + sgst always
 *    equals the displayed tax exactly (the second half absorbs the rounding)
 *  - zero is a valid input (renders an all-zero result); negatives and
 *    non-finite values throw.
 */

import type { BreakdownLine } from "./types";
import {
  assertAllowedRate,
  assertFiniteNonNegative,
  assertOneOf,
  formatMoney,
  formatPct,
  round2,
} from "./helpers";
import { CGST_SHARE, GST_SLAB_RATES, GST_SLABS } from "./data/gst";

export type GSTMode = "exclusive" | "inclusive";
export type GSTPlace = "intra-state" | "inter-state";

export type GSTInput = {
  /** The amount, exclusive or inclusive of GST depending on `mode`. */
  amount: number;
  mode: GSTMode;
  /** One of the slab rates from data/gst.ts, e.g. 18. */
  ratePct: number;
  place: GSTPlace;
};

export type GSTResult = {
  /** The value GST is charged on. */
  taxableValue: number;
  /** Total GST (CGST + SGST, or IGST). */
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  /** taxableValue + tax. */
  total: number;
  mode: GSTMode;
  place: GSTPlace;
  ratePct: number;
  breakdown: BreakdownLine[];
};

/** Slab label + examples for the chosen rate. */
function slabLabel(ratePct: number): string {
  const slab = GST_SLABS.find((s) => s.ratePct === ratePct);
  return slab ? `${slab.label} — ${slab.examples}` : formatPct(ratePct);
}

export function calculateGST(input: GSTInput): GSTResult {
  assertFiniteNonNegative(input.amount, "amount");
  assertOneOf(input.mode, ["exclusive", "inclusive"] as const, "mode");
  assertAllowedRate(input.ratePct, GST_SLAB_RATES, "ratePct");
  assertOneOf(input.place, ["intra-state", "inter-state"] as const, "place");

  const fraction = input.ratePct / 100;
  const breakdown: BreakdownLine[] = [];

  let taxableValue: number;
  let tax: number;

  if (input.mode === "exclusive") {
    taxableValue = round2(input.amount);
    tax = round2(taxableValue * fraction);
    breakdown.push(
      { label: "Input", value: formatMoney(input.amount), detail: "Exclusive of GST — this is the taxable value" },
      { label: "GST", value: formatMoney(tax), detail: `${formatMoney(taxableValue)} × ${formatPct(input.ratePct)}` },
    );
  } else {
    taxableValue = round2(input.amount / (1 + fraction));
    tax = round2(input.amount - taxableValue);
    breakdown.push(
      { label: "Input", value: formatMoney(input.amount), detail: "Inclusive of GST — the GST is inside this amount" },
      { label: "GST-inclusive split", value: `${formatMoney(taxableValue)} + ${formatMoney(tax)}`, detail: `${formatMoney(input.amount)} ÷ ${1 + fraction}` },
    );
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (input.place === "intra-state") {
    cgst = round2(tax * CGST_SHARE);
    sgst = round2(tax - cgst);
    breakdown.push({
      label: "CGST / SGST",
      value: `${formatMoney(cgst)} + ${formatMoney(sgst)}`,
      detail: `Intra-state — each is half of ${formatMoney(tax)}`,
    });
  } else {
    igst = tax;
    breakdown.push({ label: "IGST", value: formatMoney(igst), detail: "Inter-state — the whole tax is IGST" });
  }

  const total = round2(taxableValue + tax);
  breakdown.push({ label: "Total payable", value: formatMoney(total), detail: `${formatMoney(taxableValue)} + ${formatMoney(tax)}` });

  return {
    taxableValue,
    tax,
    cgst,
    sgst,
    igst,
    total,
    mode: input.mode,
    place: input.place,
    ratePct: input.ratePct,
    breakdown: [
      { label: "Rate", value: formatPct(input.ratePct), detail: slabLabel(input.ratePct) },
      ...breakdown,
    ],
  };
}

/** Build a query string from inputs — used for shareable result links. */
export function gstQueryString(input: GSTInput): string {
  const p = new URLSearchParams();
  p.set("amount", String(input.amount));
  p.set("mode", input.mode);
  p.set("rate", String(input.ratePct));
  p.set("place", input.place);
  return p.toString();
}

/** Parse a query string (as read from window.location or page params). */
export function parseGSTQuery(query: string): Partial<GSTInput> {
  const p = new URLSearchParams(query);
  const out: Partial<GSTInput> = {};
  const amountRaw = p.get("amount");
  const amount = Number(amountRaw);
  if (amountRaw !== null && Number.isFinite(amount)) out.amount = amount;
  const mode = p.get("mode");
  if (mode === "exclusive" || mode === "inclusive") out.mode = mode;
  const rateRaw = p.get("rate");
  const rate = Number(rateRaw);
  if (rateRaw !== null && GST_SLAB_RATES.includes(rate)) out.ratePct = rate;
  const place = p.get("place");
  if (place === "intra-state" || place === "inter-state") out.place = place;
  return out;
}
