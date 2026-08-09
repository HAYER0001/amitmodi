/*
 * lib/calc/data/gst.ts — GST slab rates (single source of truth).
 *
 * Only data lives here; the arithmetic is in lib/calc/gst.ts and components
 * never hardcode a rate. Changing a slab is a one-line edit in this file,
 * and every consumer — calculator, lookup table, HSN/SAC tool — follows.
 *
 * Rates as notified under the CGST Act, 2017 (current slate).
 */

export type GSTSlab = {
  /** Rate in percent, e.g. 18 for 18%. */
  ratePct: number;
  /** Short label, e.g. "18%". */
  label: string;
  /** Representative items — helps a user pick the right slab. */
  examples: string;
};

/** All slab rates in ascending order. */
export const GST_SLABS: readonly GSTSlab[] = [
  { ratePct: 0, label: "0%", examples: "Unprocessed food, milk, education, healthcare" },
  { ratePct: 0.25, label: "0.25%", examples: "Rough precious and semi-precious stones" },
  { ratePct: 3, label: "3%", examples: "Gold, silver, gold jewellery" },
  { ratePct: 5, label: "5%", examples: "Household essentials, restaurants, transport" },
  { ratePct: 12, label: "12%", examples: "Processed food, computers, business-class airfare" },
  { ratePct: 18, label: "18%", examples: "Most services, FMCG, telecom, construction" },
  { ratePct: 28, label: "28%", examples: "Luxury cars, tobacco, aerated drinks, large motorcycles" },
] as const;

/** The set of valid rates, for validation. */
export const GST_SLAB_RATES: readonly number[] = GST_SLABS.map((s) => s.ratePct);

/** CGST is always exactly half of the total GST on an intra-state supply. */
export const CGST_SHARE = 0.5;
