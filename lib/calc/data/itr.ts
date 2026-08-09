/*
 * lib/calc/data/itr.ts — ITR form metadata and eligibility constants.
 *
 * The selector answers a fixed set of questions and maps the answers to a
 * form using the criteria here. Rules reflect the AY 2026-27 (FY 2025-26)
 * filing position. Only data lives here; the decision tree is in
 * lib/calc/itr-form.ts.
 */

/** Total-income cap for the simplified forms ITR-1 and ITR-4. */
export const ITR_SIMPLE_INCOME_LIMIT = 50_00_000;

export type ITRFormCode =
  | "ITR-1"
  | "ITR-2"
  | "ITR-3"
  | "ITR-4"
  | "ITR-5"
  | "ITR-6"
  | "ITR-7";

export type ITRFormMeta = {
  code: ITRFormCode;
  /** Short name: "Sahaj" / "Sugam" / "" for the rest. */
  name: string;
  /** One-line description of who files this form. */
  who: string;
};

export const ITR_FORMS: readonly ITRFormMeta[] = [
  { code: "ITR-1", name: "Sahaj", who: "Resident individuals with income up to ₹50 lakh from salary, one house property, and other sources." },
  { code: "ITR-2", name: "", who: "Individuals and HUFs without business income — capital gains, foreign assets, multiple house properties." },
  { code: "ITR-3", name: "", who: "Individuals and HUFs with income from business or profession." },
  { code: "ITR-4", name: "Sugam", who: "Resident individuals, HUFs, and firms (other than LLPs) with presumptive income under 44AD/44ADA/44AE, up to ₹50 lakh." },
  { code: "ITR-5", name: "", who: "Firms, LLPs, AOPs, BOIs, and other non-company taxable entities." },
  { code: "ITR-6", name: "", who: "Companies other than those claiming exemption under section 11." },
  { code: "ITR-7", name: "", who: "Trusts, political parties, charitable institutions, and section 139(4A)/(4B)/(4C)/(4D) filers." },
] as const;

/** The picker options for "who is the taxpayer". */
export type TaxpayerKind =
  | "individual-resident"
  | "individual-nri"
  | "huf"
  | "firm"
  | "llp"
  | "aop-boi"
  | "company"
  | "trust";

export const TAXPAYER_KINDS: readonly { id: TaxpayerKind; label: string }[] = [
  { id: "individual-resident", label: "Individual — resident & ordinarily resident" },
  { id: "individual-nri", label: "Individual — NRI or resident but not ordinarily resident" },
  { id: "huf", label: "Hindu Undivided Family (HUF)" },
  { id: "firm", label: "Firm (not an LLP)" },
  { id: "llp", label: "Limited Liability Partnership (LLP)" },
  { id: "aop-boi", label: "AOP / BOI" },
  { id: "company", label: "Company" },
  { id: "trust", label: "Trust / charitable institution / political party" },
] as const;

/** Nature of business income: none, maintained books, or presumptive. */
export type BusinessNature = "none" | "regular" | "presumptive";

export const BUSINESS_NATURES: readonly { id: BusinessNature; label: string }[] = [
  { id: "none", label: "No business or professional income" },
  { id: "regular", label: "Yes — books of account maintained" },
  { id: "presumptive", label: "Yes — presumptive taxation (44AD / 44ADA / 44AE)" },
] as const;
