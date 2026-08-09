"use client";

import { useMemo, useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { Field, Select, TextInput } from "./fields";
import { itrQueryString, selectITRForm, type ITRInput } from "@/lib/calc/itr-form";
import { BUSINESS_NATURES, TAXPAYER_KINDS, type BusinessNature, type TaxpayerKind } from "@/lib/calc/data/itr";

/*
 * ITRFormSelector — five questions, one ITR form.
 *
 * Picks between ITR-1 through ITR-7 and explains why. The simple forms
 * (ITR-1, ITR-4) are capped at ₹50 lakh total income and disqualifying
 * conditions; the selector encodes those rules from data/itr.ts.
 */

export type ITRInitial = {
  taxpayer: TaxpayerKind;
  businessNature: BusinessNature;
  complex: boolean;
  totalIncome: number;
};

export default function ITRFormSelector({ initial }: { initial: ITRInitial }) {
  const [taxpayer, setTaxpayer] = useState<TaxpayerKind>(initial.taxpayer);
  const [businessNature, setBusinessNature] = useState<BusinessNature>(initial.businessNature);
  const [complex, setComplex] = useState<"yes" | "no">(initial.complex ? "yes" : "no");
  const [totalIncome, setTotalIncome] = useState(String(initial.totalIncome));

  const state = useMemo((): { input: ITRInput | null; invalid: string | null } => {
    const trimmed = totalIncome.trim().replace(/,/g, "");
    if (trimmed === "") return { input: null, invalid: "Enter your total income." };
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return { input: null, invalid: "Enter total income as a valid number." };
    if (n < 0) return { input: null, invalid: "Total income cannot be negative." };
    return {
      input: { taxpayer, businessNature, complex: complex === "yes", totalIncome: n },
      invalid: null,
    };
  }, [taxpayer, businessNature, complex, totalIncome]);

  const result = useMemo(() => (state.input ? selectITRForm(state.input) : null), [state.input]);

  return (
    <CalculatorShell
      eyebrow="Income tax"
      title="Which ITR Should I File?"
      description="Five short questions — who you are, where your income comes from, and how much it is — and this tool tells you the right ITR form to file, with the reasons."
      resultLabel="Your form"
      summary={result ? (result.formName ? `${result.form} (${result.formName})` : result.form) : null}
      breakdown={result?.breakdown ?? null}
      invalid={state.invalid}
      shareQuery={state.input ? itrQueryString(state.input) : ""}
    >
      <div className="space-y-6 rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-6">
        <Field label="1. Who is filing?">
          <Select value={taxpayer} onChange={(e) => setTaxpayer(e.target.value as TaxpayerKind)} aria-label="Taxpayer kind">
            {TAXPAYER_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="2. Any business or professional income?">
          <Select value={businessNature} onChange={(e) => setBusinessNature(e.target.value as BusinessNature)} aria-label="Business income">
            {BUSINESS_NATURES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="3. Any disqualifying income or assets?"
          hint="Capital gains beyond the ₹1.25 lakh long-term equity limit, lottery or race winnings, foreign income or assets, unlisted shares, or directorship of a company."
        >
          <Select value={complex} onChange={(e) => setComplex(e.target.value as "yes" | "no")} aria-label="Disqualifying income">
            <option value="no">No — none of these</option>
            <option value="yes">Yes — at least one applies</option>
          </Select>
        </Field>

        <Field label="4. Total income" hint="Income from all heads in the previous financial year, before rebate.">
          <TextInput
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={totalIncome}
            onChange={(e) => setTotalIncome(e.target.value)}
            placeholder="e.g. 3000000"
            aria-label="Total income"
          />
        </Field>

        <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
          ITR-1 (Sahaj) and ITR-4 (Sugam) are the fast forms — but only up to
          ₹50 lakh total income and with no disqualifying conditions. Beyond
          that, the form is ITR-2 or ITR-3. This is a selector, not a
          preparer: cross-check the form&apos;s instructions before you file.
        </p>
      </div>
    </CalculatorShell>
  );
}
