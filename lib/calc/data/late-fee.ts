/*
 * lib/calc/data/late-fee.ts — GST late-fee and interest parameters.
 *
 * Sources:
 *  - Late fee per day and caps: rationalised with effect from the June 2021
 *    return period (Notifications 19/2021-CT and 20/2021-CT). GSTR-1 and
 *    GSTR-3B share the same daily fee and per-return cap tiers.
 *  - Interest: 18% p.a. under section 50(1) on net cash liability paid late;
 *    24% p.a. under section 50(3) where input tax credit is wrongly availed.
 */

/** Late fee per day of delay — regular return (₹25 CGST + ₹25 SGST). */
export const LATE_FEE_PER_DAY_REGULAR = 50;

/** Late fee per day of delay — nil return (₹10 CGST + ₹10 SGST). */
export const LATE_FEE_PER_DAY_NIL = 20;

/** Interest rate on delayed payment of tax, percent per annum (s. 50(1)). */
export const GST_INTEREST_RATE_PCT = 18;

/** Interest rate where input tax credit is wrongly availed/utilised (s. 50(3)). */
export const GST_INTEREST_ITC_RATE_PCT = 24;

export type LateFeeSlabId = "nil" | "upto-1.5cr" | "1.5cr-to-5cr" | "above-5cr";

export type LateFeeSlab = {
  id: LateFeeSlabId;
  label: string;
  /** Maximum late fee per return (CGST + SGST combined), in ₹. */
  cap: number;
};

/** Per-return late-fee caps by previous-year aggregate turnover. */
export const LATE_FEE_SLABS: readonly LateFeeSlab[] = [
  { id: "nil", label: "Nil return — no outward supply", cap: 500 },
  { id: "upto-1.5cr", label: "Aggregate turnover up to ₹1.5 crore", cap: 2000 },
  { id: "1.5cr-to-5cr", label: "Aggregate turnover ₹1.5 crore to ₹5 crore", cap: 5000 },
  { id: "above-5cr", label: "Aggregate turnover above ₹5 crore", cap: 10000 },
] as const;

/** Due dates: the 11th (GSTR-1) and 20th (GSTR-3B) of the following month. */
export const GSTR_DUE_DAY: Record<"gstr-1" | "gstr-3b", number> = {
  "gstr-1": 11,
  "gstr-3b": 20,
} as const;
