/*
 * lib/calc/data/tds.ts — TDS payment types: sections, rates, thresholds.
 *
 * Rates are the standard TDS rates for FY 2025-26 / AY 2026-27 as amended by
 * the Finance Act, 2025. The classic section numbers are used because those
 * are the numbers practitioners and software still quote; note that the
 * Income-tax Act, 2025 (in force from 1 April 2026) renumbers the TDS
 * provisions. TDS is deducted on the gross payment, before surcharge and
 * health & education cess on the deductee.
 *
 * Only data lives here; the decision logic is in lib/calc/tds-rate.ts.
 */

export type TDSPayerKind = "individual" | "other";

export type TDSPaymentType = {
  /** Stable id for URLs and selects, e.g. "194c". */
  id: string;
  /** Classic section number, e.g. "194C". */
  section: string;
  /** What the payment is for — shown in the picker. */
  label: string;
  /** Base rate percent, or a payer-kind split for entries that vary. */
  ratePct?: number;
  payerSplit?: Record<TDSPayerKind, number>;
  /** Annual or per-transaction threshold. TDS applies only above it. */
  threshold?: number;
  /** Human explanation of the threshold, e.g. "₹30,000 on a single contract…". */
  thresholdLabel?: string;
  /** Reads like "10%" or "1% for individual/HUF payers, 2% for others". */
  rateLabel: string;
  /** Notes, e.g. who is liable to deduct. */
  note?: string;
};

export const TDS_PAYMENT_TYPES: readonly TDSPaymentType[] = [
  {
    id: "194a-bank",
    section: "194A",
    label: "Interest on bank/post-office deposits or savings account",
    ratePct: 10,
    threshold: 50000,
    thresholdLabel: "₹50,000 in a financial year (₹1,00,000 for senior citizens)",
    rateLabel: "10%",
    note: "Deducted by the bank or post office on the excess over the threshold.",
  },
  {
    id: "194a-other",
    section: "194A",
    label: "Interest other than on securities — company deposits, loans",
    ratePct: 10,
    threshold: 10000,
    thresholdLabel: "₹10,000 in a financial year",
    rateLabel: "10%",
  },
  {
    id: "194b",
    section: "194B",
    label: "Winnings from lottery, crossword puzzles, or games",
    ratePct: 30,
    threshold: 10000,
    thresholdLabel: "₹10,000 on a single winning",
    rateLabel: "30%",
    note: "No exemption below the slab — once the threshold is crossed the whole winning is subject to TDS.",
  },
  {
    id: "194c",
    section: "194C",
    label: "Payment to a contractor or sub-contractor",
    payerSplit: { individual: 1, other: 2 },
    threshold: 30000,
    thresholdLabel: "₹30,000 on a single contract or ₹1,00,000 aggregate in a year",
    rateLabel: "1% for individual/HUF payers, 2% for others",
    note: "Rate depends on who is paying: individual/HUF 1%, everyone else 2%.",
  },
  {
    id: "194d",
    section: "194D",
    label: "Insurance commission",
    ratePct: 2,
    threshold: 20000,
    thresholdLabel: "₹20,000 in a financial year",
    rateLabel: "2%",
    note: "Reduced from 5% to 2% with effect from 1 April 2025 (Finance Act, 2025).",
  },
  {
    id: "194h",
    section: "194H",
    label: "Commission or brokerage",
    ratePct: 2,
    threshold: 20000,
    thresholdLabel: "₹20,000 in a financial year",
    rateLabel: "2%",
  },
  {
    id: "194i-plant",
    section: "194I(a)",
    label: "Rent for plant, machinery, or equipment",
    ratePct: 2,
    threshold: 50000,
    thresholdLabel: "₹50,000 per month or part of a month",
    rateLabel: "2%",
  },
  {
    id: "194i-land",
    section: "194I(b)",
    label: "Rent for land, building, or furniture",
    ratePct: 10,
    threshold: 50000,
    thresholdLabel: "₹50,000 per month or part of a month",
    rateLabel: "10%",
  },
  {
    id: "194j-professional",
    section: "194J",
    label: "Fees for professional services — doctors, lawyers, engineers, consultants",
    ratePct: 10,
    threshold: 50000,
    thresholdLabel: "₹50,000 in a financial year",
    rateLabel: "10%",
  },
  {
    id: "194j-technical",
    section: "194J",
    label: "Fees for technical services or royalties",
    ratePct: 2,
    threshold: 50000,
    thresholdLabel: "₹50,000 in a financial year",
    rateLabel: "2%",
  },
  {
    id: "194ia",
    section: "194IA",
    label: "Purchase of immovable property (other than rural agricultural land)",
    ratePct: 1,
    threshold: 5000000,
    thresholdLabel: "Consideration of ₹50,00,000 or more",
    rateLabel: "1%",
    note: "Deducted by the buyer of the property, not the seller.",
  },
  {
    id: "194ib",
    section: "194IB",
    label: "Rent paid by an individual or HUF not covered under 194I",
    ratePct: 2,
    threshold: 50000,
    thresholdLabel: "₹50,000 per month or part of a month",
    rateLabel: "2%",
    note: "Applies to individuals/HUFs not liable to tax audit.",
  },
  {
    id: "194q",
    section: "194Q",
    label: "Purchase of goods by a buyer whose turnover exceeded ₹10 crore",
    ratePct: 0.1,
    threshold: 5000000,
    thresholdLabel: "₹50,00,000 in value in a financial year",
    rateLabel: "0.1%",
  },
  {
    id: "194r",
    section: "194R",
    label: "Benefits or perquisites in kind provided to a resident",
    ratePct: 10,
    threshold: 20000,
    thresholdLabel: "₹20,000 in a financial year",
    rateLabel: "10%",
  },
  {
    id: "194s",
    section: "194S",
    label: "Transfer of virtual digital assets (crypto, NFTs)",
    ratePct: 1,
    threshold: 50000,
    thresholdLabel: "₹50,000 in a financial year (₹10,000 for specified persons)",
    rateLabel: "1%",
  },
  {
    id: "194t",
    section: "194T",
    label: "Salary, interest, or remuneration paid by a firm to its partner",
    ratePct: 10,
    threshold: 20000,
    thresholdLabel: "₹20,000 in a financial year",
    rateLabel: "10%",
    note: "New provision with effect from 1 April 2025 (Finance Act, 2025).",
  },
] as const;

/** The set of valid payment ids, for validation and URL parsing. */
export const TDS_PAYMENT_IDS: readonly string[] = TDS_PAYMENT_TYPES.map((t) => t.id);
