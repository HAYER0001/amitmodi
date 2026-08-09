/*
 * lib/calc/data/hsn-sac.ts — curated HSN (goods) and SAC (services) codes.
 *
 * This is a STARTING SUBSET of the most-searched codes, NOT the full
 * schedule — the full HSN/SAC schedule runs to tens of thousands of lines.
 * Every code here carries the GST slab rate that is the common, most-quoted
 * position. The tool is honest about this: the page says the list is
 * indicative and not exhaustive, and the rate on any specific supply can
 * hinge on fine print (exemptions, abatements, cess, retail-price splits).
 *
 * Expand the dataset in this file only; components never hardcode codes.
 */

export type HSNSACEntry = {
  /** The code as searched, e.g. "8517" (HSN) or "9963" (SAC). */
  code: string;
  type: "HSN" | "SAC";
  description: string;
  /** GST slab rate percent. */
  ratePct: number;
  /** Short qualification, e.g. "no input tax credit" or "plus cess". */
  note?: string;
};

export const HSN_SAC_ENTRIES: readonly HSNSACEntry[] = [
  // ── Goods (HSN) ──────────────────────────────────────────────────────────
  { code: "0401", type: "HSN", description: "Fresh or pasteurised milk (unbranded)", ratePct: 0 },
  { code: "0701", type: "HSN", description: "Fresh potatoes and other fresh vegetables", ratePct: 0 },
  { code: "1001", type: "HSN", description: "Wheat — unprocessed grain", ratePct: 0 },
  { code: "1101", type: "HSN", description: "Wheat flour (atta) — unbranded", ratePct: 0 },
  { code: "1701", type: "HSN", description: "Sugar", ratePct: 5 },
  { code: "1902", type: "HSN", description: "Pasta — uncooked, not stuffed", ratePct: 18 },
  { code: "1905", type: "HSN", description: "Biscuits and bakery products", ratePct: 18 },
  { code: "2201", type: "HSN", description: "Packaged drinking water (bottled)", ratePct: 18 },
  { code: "2309", type: "HSN", description: "Processed animal / poultry feed", ratePct: 0, note: "Exempt" },
  { code: "3004", type: "HSN", description: "Medicaments — patent/proprietary allopathic", ratePct: 12 },
  { code: "3304", type: "HSN", description: "Cosmetics and beauty preparations", ratePct: 18 },
  { code: "3401", type: "HSN", description: "Soap — branded", ratePct: 18 },
  { code: "3924", type: "HSN", description: "Plastic household articles", ratePct: 18 },
  { code: "4011", type: "HSN", description: "Pneumatic tyres for vehicles", ratePct: 28 },
  { code: "4202", type: "HSN", description: "Handbags, luggage, vanity cases", ratePct: 18 },
  { code: "4802", type: "HSN", description: "Writing and printing paper", ratePct: 12 },
  { code: "5208", type: "HSN", description: "Cotton fabrics", ratePct: 5 },
  { code: "6109", type: "HSN", description: "Knitted garments — retail price up to ₹1,000", ratePct: 5 },
  { code: "6109", type: "HSN", description: "Knitted garments — retail price above ₹1,000", ratePct: 12 },
  { code: "6907", type: "HSN", description: "Ceramic tiles and flags", ratePct: 28 },
  { code: "6910", type: "HSN", description: "Ceramic sinks, wash-basins, sanitary fixtures", ratePct: 18 },
  { code: "7208", type: "HSN", description: "Iron & steel — flat-rolled products", ratePct: 18 },
  { code: "7321", type: "HSN", description: "Cooking stoves and grills", ratePct: 18 },
  { code: "8517", type: "HSN", description: "Mobile phones and telephone equipment", ratePct: 18 },
  { code: "8703", type: "HSN", description: "Motor cars", ratePct: 28, note: "Plus compensation cess (1–22%) by engine size/value" },
  { code: "9403", type: "HSN", description: "Furniture — wooden and other", ratePct: 18 },
  { code: "9405", type: "HSN", description: "Lamps and lighting fittings", ratePct: 18 },
  // ── Services (SAC) ───────────────────────────────────────────────────────
  { code: "9954", type: "SAC", description: "Construction of buildings and civil works", ratePct: 18 },
  { code: "9963", type: "SAC", description: "Restaurants (all, without input tax credit)", ratePct: 5 },
  { code: "9963", type: "SAC", description: "Hotel rooms — declared tariff ₹1,000–₹7,500", ratePct: 12 },
  { code: "9963", type: "SAC", description: "Hotel rooms — declared tariff above ₹7,500", ratePct: 18 },
  { code: "9964", type: "SAC", description: "Goods transport by road (GTA)", ratePct: 5, note: "Often under reverse charge" },
  { code: "9965", type: "SAC", description: "Passenger transport by bus or train", ratePct: 5 },
  { code: "9966", type: "SAC", description: "Air travel — economy class", ratePct: 5, note: "Business class is 12%" },
  { code: "9971", type: "SAC", description: "Banking and financial services", ratePct: 18 },
  { code: "9973", type: "SAC", description: "Telecommunication services", ratePct: 18 },
  { code: "9975", type: "SAC", description: "Insurance services", ratePct: 18 },
  { code: "9977", type: "SAC", description: "Education — schooling and exempt courses", ratePct: 0, note: "Exempt" },
  { code: "9981", type: "SAC", description: "Legal services", ratePct: 18 },
  { code: "9982", type: "SAC", description: "Accounting and bookkeeping services", ratePct: 18 },
  { code: "9983", type: "SAC", description: "Business and management consultancy", ratePct: 18 },
  { code: "9983", type: "SAC", description: "Software development and IT services", ratePct: 18 },
  { code: "9985", type: "SAC", description: "Beauty and wellness services", ratePct: 18 },
  { code: "9993", type: "SAC", description: "Health and medical services", ratePct: 0, note: "Exempt" },
] as const;
