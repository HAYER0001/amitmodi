/*
 * lib/calc/gst-late-fee.ts — late fee and interest for delayed GSTR-1 / GSTR-3B.
 * Pure functions, no React.
 *
 * Late fee is a per-day amount (₹50 regular / ₹20 nil) capped per return by
 * the previous year's aggregate turnover; interest runs at 18% p.a. on the
 * net cash tax liability paid late. Every step lands in `breakdown`.
 *
 * The calculator takes days-of-delay directly (the user picks the return and
 * computes the delay from the 11th/20th due date if they like).
 */

import type { BreakdownLine } from "./types";
import {
  assertFiniteNonNegative,
  assertNonNegativeInteger,
  assertOneOf,
  formatMoney,
  formatPct,
  round2,
} from "./helpers";
import {
  GST_INTEREST_RATE_PCT,
  LATE_FEE_PER_DAY_NIL,
  LATE_FEE_PER_DAY_REGULAR,
  LATE_FEE_SLABS,
  type LateFeeSlabId,
} from "./data/late-fee";

export type GSTReturnType = "gstr-1" | "gstr-3b";
export type FilingStatus = "regular" | "nil";

export type LateFeeInput = {
  returnType: GSTReturnType;
  filingStatus: FilingStatus;
  /** Slab id from data/late-fee.ts (ignored when filing a nil return). */
  turnoverSlabId: LateFeeSlabId;
  /** Full days of delay after the due date. */
  daysLate: number;
  /** Net cash tax liability paid late, in ₹ (0 for a nil return). */
  taxPayable: number;
};

export type LateFeeResult = {
  dailyRate: number;
  cap: number;
  lateFee: number;
  interestRatePct: number;
  interest: number;
  /** lateFee + interest. */
  total: number;
  daysLate: number;
  breakdown: BreakdownLine[];
};

function slabById(id: LateFeeSlabId) {
  const slab = LATE_FEE_SLABS.find((s) => s.id === id);
  if (!slab) {
    throw new RangeError(`turnoverSlabId must be one of: ${LATE_FEE_SLABS.map((s) => s.id).join(", ")}`);
  }
  return slab;
}

export function calculateLateFee(input: LateFeeInput): LateFeeResult {
  assertOneOf(input.returnType, ["gstr-1", "gstr-3b"] as const, "returnType");
  assertOneOf(input.filingStatus, ["regular", "nil"] as const, "filingStatus");
  const slab = slabById(input.turnoverSlabId);
  assertNonNegativeInteger(input.daysLate, "daysLate");
  assertFiniteNonNegative(input.taxPayable, "taxPayable");

  const nilReturn = input.filingStatus === "nil";
  const dailyRate = nilReturn ? LATE_FEE_PER_DAY_NIL : LATE_FEE_PER_DAY_REGULAR;
  const cap = nilReturn ? LATE_FEE_SLABS[0].cap : slab.cap;

  const uncapped = round2(input.daysLate * dailyRate);
  const lateFee = Math.min(uncapped, cap);

  const interestRatePct = GST_INTEREST_RATE_PCT;
  const interest = round2((input.taxPayable * input.daysLate * interestRatePct) / 36500);

  const total = round2(lateFee + interest);

  const breakdown: BreakdownLine[] = [
    {
      label: "Return",
      value: input.returnType === "gstr-1" ? "GSTR-1 (outward supplies)" : "GSTR-3B (monthly return)",
      detail: nilReturn ? "Nil return — no tax payable" : `Late fee tier: ${slab.label}`,
    },
    {
      label: "Late fee per day",
      value: `₹${dailyRate}`,
      detail: nilReturn ? "₹10 CGST + ₹10 SGST" : "₹25 CGST + ₹25 SGST",
    },
    {
      label: "Cap per return",
      value: `₹${cap}`,
      detail: `${input.daysLate} days × ₹${dailyRate} = ${formatMoney(uncapped)}${
        uncapped > cap ? `, capped at ${formatMoney(cap)}` : ""
      }`,
    },
    {
      label: "Late fee",
      value: formatMoney(lateFee),
      detail: uncapped > cap ? "Capped at the per-return maximum" : `${input.daysLate} × ₹${dailyRate}`,
    },
    {
      label: "Interest",
      value: formatMoney(interest),
      detail:
        input.taxPayable === 0
          ? "No interest — no tax paid late"
          : `${formatMoney(input.taxPayable)} × ${input.daysLate}/365 × ${formatPct(interestRatePct)}`,
    },
    { label: "Total due", value: formatMoney(total), detail: `${formatMoney(lateFee)} + ${formatMoney(interest)}` },
  ];

  return {
    dailyRate,
    cap,
    lateFee,
    interestRatePct,
    interest,
    total,
    daysLate: input.daysLate,
    breakdown,
  };
}

/** Build a query string from inputs — used for shareable result links. */
export function lateFeeQueryString(input: LateFeeInput): string {
  const p = new URLSearchParams();
  p.set("return", input.returnType);
  p.set("status", input.filingStatus);
  p.set("slab", input.turnoverSlabId);
  p.set("days", String(input.daysLate));
  p.set("tax", String(input.taxPayable));
  return p.toString();
}

/** Parse a query string into (possibly partial) inputs. */
export function parseLateFeeQuery(query: string): Partial<LateFeeInput> {
  const p = new URLSearchParams(query);
  const out: Partial<LateFeeInput> = {};
  const rt = p.get("return");
  if (rt === "gstr-1" || rt === "gstr-3b") out.returnType = rt;
  const st = p.get("status");
  if (st === "regular" || st === "nil") out.filingStatus = st;
  const slab = p.get("slab");
  if (LATE_FEE_SLABS.some((s) => s.id === slab)) out.turnoverSlabId = slab as LateFeeSlabId;
  const daysRaw = p.get("days");
  const days = Number(daysRaw);
  if (daysRaw !== null && Number.isInteger(days) && days >= 0) out.daysLate = days;
  const taxRaw = p.get("tax");
  const tax = Number(taxRaw);
  if (taxRaw !== null && Number.isFinite(tax) && tax >= 0) out.taxPayable = tax;
  return out;
}
