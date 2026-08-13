"use client";

import { useMemo, useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { Field, Select, TextInput } from "./fields";
import {
  calculateLateFee,
  lateFeeQueryString,
  type FilingStatus,
  type GSTReturnType,
  type LateFeeInput,
} from "@/lib/calc/gst-late-fee";
import { LATE_FEE_SLABS, type LateFeeSlabId } from "@/lib/calc/data/late-fee";
import { formatMoney } from "@/lib/calc/helpers";

/*
 * LateFeeCalculator — late fee + interest for a delayed GSTR-1 or GSTR-3B.
 *
 * Days of delay are entered directly (the 11th/20th due date is shown for
 * reference in the hint). A nil return pays the smaller daily fee and is
 * capped at ₹500; regular returns are capped by the turnover tier.
 */

export type LateFeeInitial = {
  returnType: GSTReturnType;
  filingStatus: FilingStatus;
  turnoverSlabId: LateFeeSlabId;
  daysLate: number;
  taxPayable: number;
};

export default function LateFeeCalculator({ initial }: { initial: LateFeeInitial }) {
  const [returnType, setReturnType] = useState<GSTReturnType>(initial.returnType);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(initial.filingStatus);
  const [turnoverSlabId, setTurnoverSlabId] = useState<LateFeeSlabId>(initial.turnoverSlabId);
  const [daysLate, setDaysLate] = useState(String(initial.daysLate));
  const [taxPayable, setTaxPayable] = useState(String(initial.taxPayable));

  const isNil = filingStatus === "nil";

  const state = useMemo((): { input: LateFeeInput | null; invalid: string | null } => {
    const daysRaw = daysLate.trim().replace(/,/g, "");
    const days = Number(daysRaw);
    if (daysRaw === "" || !Number.isInteger(days)) {
      return { input: null, invalid: "Enter a whole number of days of delay." };
    }
    if (days < 0) return { input: null, invalid: "Days of delay cannot be negative." };

    const taxRaw = taxPayable.trim().replace(/,/g, "");
    const tax = Number(taxRaw);
    if (taxRaw === "" || !Number.isFinite(tax)) {
      return { input: null, invalid: "Enter the net cash tax liability as a number." };
    }
    if (tax < 0) return { input: null, invalid: "Tax liability cannot be negative." };

    return {
      input: { returnType, filingStatus, turnoverSlabId: isNil ? "nil" : turnoverSlabId, daysLate: days, taxPayable: tax },
      invalid: null,
    };
  }, [returnType, filingStatus, turnoverSlabId, daysLate, taxPayable, isNil]);

  const result = useMemo(() => (state.input ? calculateLateFee(state.input) : null), [state.input]);

  return (
    <CalculatorShell
      eyebrow="GST"
      title="Late Fee & Interest Calculator"
      description="A missed GST due date costs you twice: a flat late fee per day of delay, and interest at 18% a year on the net cash tax you paid late. This tool works out both, capped at your turnover tier."
      resultLabel="Late fee + interest"
      summary={result ? formatMoney(result.total) : null}
      breakdown={result?.breakdown ?? null}
      invalid={state.invalid}
      shareQuery={state.input ? lateFeeQueryString(state.input) : ""}
      ctaHeadline="This penalty is still contestable in many cases. Have it reviewed."
    >
      <div className="space-y-6 rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Return">
            <Select value={returnType} onChange={(e) => setReturnType(e.target.value as GSTReturnType)} aria-label="Return type">
              <option value="gstr-1">GSTR-1 (outward supplies)</option>
              <option value="gstr-3b">GSTR-3B (monthly return)</option>
            </Select>
          </Field>

          <Field label="Filing status">
            <Select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value as FilingStatus)} aria-label="Filing status">
              <option value="regular">Regular — has outward supply</option>
              <option value="nil">Nil — no outward supply</option>
            </Select>
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Turnover tier"
            hint="Your aggregate turnover in the previous financial year — it sets the per-return late-fee cap."
          >
            <Select
              value={turnoverSlabId}
              onChange={(e) => setTurnoverSlabId(e.target.value as LateFeeSlabId)}
              disabled={isNil}
              aria-label="Turnover tier"
            >
              {LATE_FEE_SLABS.map((slab) =>
                slab.id === "nil" ? null : (
                  <option key={slab.id} value={slab.id}>
                    {slab.label}
                  </option>
                ),
              )}
            </Select>
          </Field>

          <Field
            label="Days of delay"
            hint={`Due dates: GSTR-1 by the ${11}th and GSTR-3B by the ${20}th of the following month.`}
          >
            <TextInput
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={daysLate}
              onChange={(e) => setDaysLate(e.target.value)}
              placeholder="e.g. 40"
              aria-label="Days of delay"
            />
          </Field>
        </div>

        <Field
          label="Net cash tax paid late"
          hint="The GST you actually paid late in cash (net of input tax credit). Interest only runs on this amount — leave at 0 for a nil return."
        >
          <TextInput
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={taxPayable}
            onChange={(e) => setTaxPayable(e.target.value)}
            placeholder="e.g. 0"
            aria-label="Net cash tax paid late"
          />
        </Field>

        <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
          Late fees run at ₹50 per day for a regular return (₹25 CGST + ₹25
          SGST) and ₹20 per day for a nil return. Interest is 18% a year from
          the due date on the net cash liability — and 24% if input tax credit
          was wrongly availed.
        </p>
      </div>
    </CalculatorShell>
  );
}
