"use client";

import { useMemo, useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { Field, Select, TextInput } from "./fields";
import { calculateTDS, tdsQueryString, type TDSInput } from "@/lib/calc/tds-rate";
import { TDS_PAYMENT_TYPES } from "@/lib/calc/data/tds";
import { formatMoney } from "@/lib/calc/helpers";

/*
 * TDSRateFinder — pick a payment type, get the section, rate, threshold
 * check and the exact amount to deduct. The payer-kind selector appears only
 * for payment types whose rate varies by payer (currently 194C).
 */

export type TDSInitial = {
  paymentTypeId: string;
  amount: number;
  payerKind?: "individual" | "other";
};

export default function TDSRateFinder({ initial }: { initial: TDSInitial }) {
  const [paymentTypeId, setPaymentTypeId] = useState(initial.paymentTypeId);
  const [amount, setAmount] = useState(String(initial.amount));
  const [payerKind, setPayerKind] = useState<"individual" | "other">(initial.payerKind ?? "individual");

  const payment = TDS_PAYMENT_TYPES.find((t) => t.id === paymentTypeId) ?? TDS_PAYMENT_TYPES[0];
  const needsPayerKind = Boolean(payment.payerSplit);

  const state = useMemo((): { input: TDSInput | null; invalid: string | null } => {
    const trimmed = amount.trim().replace(/,/g, "");
    if (trimmed === "") return { input: null, invalid: "Enter the payment amount." };
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return { input: null, invalid: "Enter a valid number — the deduction cannot be computed from that input." };
    if (n < 0) return { input: null, invalid: "Payment amount cannot be negative." };
    return {
      input: { paymentTypeId: payment.id, amount: n, payerKind: needsPayerKind ? payerKind : undefined },
      invalid: null,
    };
  }, [payment.id, amount, payerKind, needsPayerKind]);

  const result = useMemo(() => (state.input ? calculateTDS(state.input) : null), [state.input]);

  return (
    <CalculatorShell
      eyebrow="Income tax"
      title="TDS Rate Finder"
      description="Answer one question — what are you paying, and to whom? — and this tool returns the section, the exact rate, whether the threshold applies, and the precise amount to deduct before you release the payment."
      resultLabel="TDS to deduct"
      summary={result ? formatMoney(result.tdsAmount) : null}
      breakdown={result?.breakdown ?? null}
      invalid={state.invalid}
      shareQuery={state.input ? tdsQueryString(state.input) : ""}
    >
      <div className="space-y-6 rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-6">
        <Field label="What are you paying for?">
          <Select value={payment.id} onChange={(e) => setPaymentTypeId(e.target.value)} aria-label="Payment type">
            {TDS_PAYMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.section} — {t.label}
              </option>
            ))}
          </Select>
        </Field>

        {needsPayerKind && (
          <Field label="Who is paying?" hint="For contract payments the rate depends on who the payer is — individual/HUF or everyone else.">
            <Select value={payerKind} onChange={(e) => setPayerKind(e.target.value as "individual" | "other")} aria-label="Payer kind">
              <option value="individual">Individual / HUF payer</option>
              <option value="other">Company / firm / LLP / other payer</option>
            </Select>
          </Field>
        )}

        <Field label="Payment amount" hint="TDS is deducted on the gross payment, before adding surcharge and cess on the deductee.">
          <TextInput
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
            aria-label="Payment amount"
          />
        </Field>

        <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
          Thresholds in the Act are &ldquo;exceeding&rdquo; thresholds: a payment exactly at
          the limit attracts no deduction, and the first rupee above it makes
          the whole payment subject to TDS. Sections follow the classic
          numbering (Finance Act 2025 rates); the Income-tax Act 2025 renumbers
          these provisions from 1 April 2026.
        </p>
      </div>
    </CalculatorShell>
  );
}
