/*
 * lib/calc/itr-form.ts — ITR form selector (pure functions, no React).
 *
 * Answers five questions (taxpayer kind, nature of business income, whether
 * presumptive schemes apply, whether any disqualifying income exists, and
 * total income) and returns the applicable ITR form with the reasons.
 *
 * Rules reflect the AY 2026-27 filing position: ITR-1 and ITR-4 are the
 * simple forms capped at ₹50 lakh total income with disqualifying
 * conditions (capital gains beyond the ₹1.25 lakh 112A limit, lottery
 * winnings, foreign income/assets, unlisted shares, directorship).
 */

import type { BreakdownLine } from "./types";
import { assertFiniteNonNegative, assertOneOf, formatMoney } from "./helpers";
import {
  BUSINESS_NATURES,
  ITR_FORMS,
  ITR_SIMPLE_INCOME_LIMIT,
  TAXPAYER_KINDS,
  type BusinessNature,
  type ITRFormCode,
  type TaxpayerKind,
} from "./data/itr";

export type ITRInput = {
  taxpayer: TaxpayerKind;
  businessNature: BusinessNature;
  /**
   * True when the return is "complex" in the disqualifying sense: capital
   * gains beyond the ₹1.25 lakh 112A limit, lottery/race winnings, foreign
   * income or assets, unlisted shareholdings, or directorship of a company.
   */
  complex: boolean;
  /** Total income in ₹ (all heads, before rebate). */
  totalIncome: number;
};

export type ITRResult = {
  form: ITRFormCode;
  formName: string;
  who: string;
  reasons: string[];
  breakdown: BreakdownLine[];
};

function metaFor(code: ITRFormCode) {
  const meta = ITR_FORMS.find((f) => f.code === code)!;
  return { formName: meta.name, who: meta.who };
}

export function selectITRForm(input: ITRInput): ITRResult {
  assertOneOf(input.taxpayer, TAXPAYER_KINDS.map((k) => k.id), "taxpayer");
  assertOneOf(input.businessNature, BUSINESS_NATURES.map((b) => b.id), "businessNature");
  assertFiniteNonNegative(input.totalIncome, "totalIncome");

  const { taxpayer, businessNature, complex, totalIncome } = input;
  const limit = ITR_SIMPLE_INCOME_LIMIT;
  const reasons: string[] = [];
  let form: ITRFormCode;

  const simpleFormAllowed = !complex && totalIncome <= limit;

  switch (taxpayer) {
    case "trust":
      form = "ITR-7";
      reasons.push("Trust / charitable institution / political party — files ITR-7");
      break;

    case "company":
      form = "ITR-6";
      reasons.push("Company (not claiming section 11 exemption) — files ITR-6");
      break;

    case "llp":
    case "aop-boi":
      form = "ITR-5";
      reasons.push("LLP / AOP / BOI — files ITR-5; the presumptive schemes are not available");
      break;

    case "firm": {
      if (businessNature === "presumptive" && simpleFormAllowed) {
        form = "ITR-4";
        reasons.push("Firm (other than LLP) with presumptive business income under 44AD / 44ADA / 44AE");
        if (!complex) reasons.push("No disqualifying income (capital gains, lottery, foreign income)");
        if (totalIncome <= limit) reasons.push(`Total income ${formatMoney(totalIncome)} is within the ₹50 lakh limit`);
      } else {
        form = "ITR-5";
        reasons.push("Firm — files ITR-5");
        if (businessNature !== "presumptive") reasons.push("Business income outside the presumptive scheme");
        if (businessNature === "presumptive" && !simpleFormAllowed) {
          reasons.push(complex ? "Disqualifying income present — not eligible for ITR-4" : `Total income above the ₹50 lakh ITR-4 limit`);
        }
      }
      break;
    }

    case "huf": {
      if (businessNature === "none") {
        form = "ITR-2";
        reasons.push("HUF without business or professional income — files ITR-2");
      } else if (businessNature === "presumptive" && simpleFormAllowed) {
        form = "ITR-4";
        reasons.push("HUF with presumptive business income under 44AD / 44ADA / 44AE");
        if (!complex) reasons.push("No disqualifying income");
        if (totalIncome <= limit) reasons.push(`Total income ${formatMoney(totalIncome)} is within the ₹50 lakh limit`);
      } else {
        form = "ITR-3";
        reasons.push("HUF with business or professional income outside the presumptive scheme — files ITR-3");
      }
      break;
    }

    case "individual-resident": {
      if (businessNature === "none") {
        if (simpleFormAllowed) {
          form = "ITR-1";
          reasons.push("Resident individual with income only from salary, one house property, and other sources");
          if (!complex) reasons.push("No disqualifying income (capital gains, lottery, foreign income)");
          if (totalIncome <= limit) reasons.push(`Total income ${formatMoney(totalIncome)} is within the ₹50 lakh limit`);
        } else {
          form = "ITR-2";
          reasons.push("Individual without business income");
          if (complex) reasons.push("Disqualifying income present — ITR-1 not available");
          if (totalIncome > limit) reasons.push(`Total income above the ₹50 lakh ITR-1 limit`);
        }
      } else if (businessNature === "presumptive" && simpleFormAllowed) {
        form = "ITR-4";
        reasons.push("Resident individual with presumptive business income under 44AD / 44ADA / 44AE");
        if (!complex) reasons.push("No disqualifying income");
        if (totalIncome <= limit) reasons.push(`Total income ${formatMoney(totalIncome)} is within the ₹50 lakh limit`);
      } else {
        form = "ITR-3";
        reasons.push("Individual with business or professional income outside the presumptive scheme — files ITR-3");
      }
      break;
    }

    case "individual-nri": {
      form = businessNature === "none" ? "ITR-2" : "ITR-3";
      reasons.push("NRI or resident-but-not-ordinarily-resident individual");
      reasons.push(
        businessNature === "none"
          ? "No business income — files ITR-2 (ITR-1 is not available to non-residents)"
          : "Has business or professional income — files ITR-3",
      );
      break;
    }
  }

  const { formName, who } = metaFor(form);

  const breakdown: BreakdownLine[] = [
    { label: "Applicable form", value: form, detail: formName ? `${formName} — ${who}` : who },
    { label: "Total income", value: formatMoney(totalIncome), detail: totalIncome > limit ? "Above the ₹50 lakh simple-form limit" : "Within the ₹50 lakh simple-form limit" },
    { label: "Key conditions", value: reasons[0] ?? "", detail: reasons.slice(1).join("; ") || undefined },
  ];

  return { form, formName, who, reasons, breakdown };
}

/** Build a query string from inputs — used for shareable result links. */
export function itrQueryString(input: ITRInput): string {
  const p = new URLSearchParams();
  p.set("who", input.taxpayer);
  p.set("biz", input.businessNature);
  p.set("complex", input.complex ? "1" : "0");
  p.set("income", String(input.totalIncome));
  return p.toString();
}

/** Parse a query string into (possibly partial) inputs. */
export function parseITRQuery(query: string): Partial<ITRInput> {
  const p = new URLSearchParams(query);
  const out: Partial<ITRInput> = {};
  const who = p.get("who");
  if (TAXPAYER_KINDS.some((k) => k.id === who)) out.taxpayer = who as TaxpayerKind;
  const biz = p.get("biz");
  if (BUSINESS_NATURES.some((b) => b.id === biz)) out.businessNature = biz as BusinessNature;
  const complex = p.get("complex");
  if (complex === "1" || complex === "0") out.complex = complex === "1";
  const incomeRaw = p.get("income");
  const income = Number(incomeRaw);
  if (incomeRaw !== null && Number.isFinite(income) && income >= 0) out.totalIncome = income;
  return out;
}
