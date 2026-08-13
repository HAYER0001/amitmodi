"use client";

import { useMemo, useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { Field, Select, TextInput } from "./fields";
import { calculateGST, gstQueryString, type GSTInput, type GSTMode, type GSTPlace } from "@/lib/calc/gst";
import { GST_SLABS } from "@/lib/calc/data/gst";
import { formatMoney } from "@/lib/calc/helpers";

/*
 * GSTCalculator — GST amount calculator (exclusive/inclusive, CGST+SGST/IGST).
 *
 * The `amount` field keeps the raw string so users can type freely; the
 * parsed number is computed from it only when it is finite and non-negative.
 * Every failure path produces a message for the shell — never NaN on screen.
 * The initial props come from the server page, which parsed the URL query
 * through parseGSTQuery (tested in lib/calc/gst.test.ts).
 */

export type GSTInitial = {
  amount: number;
  mode: GSTMode;
  ratePct: number;
  place: GSTPlace;
};

export default function GSTCalculator({ initial }: { initial: GSTInitial }) {
  const [amount, setAmount] = useState(String(initial.amount));
  const [mode, setMode] = useState<GSTMode>(initial.mode);
  const [ratePct, setRatePct] = useState(initial.ratePct);
  const [place, setPlace] = useState<GSTPlace>(initial.place);

  const state = useMemo((): { input: GSTInput | null; invalid: string | null } => {
    const trimmed = amount.trim().replace(/,/g, "");
    if (trimmed === "") return { input: null, invalid: "Enter an amount to see the GST." };
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return { input: null, invalid: "Enter a valid number — GST cannot be computed from that input." };
    if (n < 0) return { input: null, invalid: "Amount cannot be negative." };
    return { input: { amount: n, mode, ratePct, place }, invalid: null };
  }, [amount, mode, ratePct, place]);

  const result = useMemo(() => (state.input ? calculateGST(state.input) : null), [state.input]);

  return (
    <CalculatorShell
      eyebrow="GST"
      title="GST Amount Calculator"
      description="Work out the GST on a supply in seconds — from a price that already includes GST or one that doesn't, split into CGST and SGST for an intra-state supply or IGST for an inter-state one."
      resultLabel="Your total"
      summary={result ? formatMoney(result.total) : null}
      breakdown={result?.breakdown ?? null}
      invalid={state.invalid}
      shareQuery={state.input ? gstQueryString(state.input) : ""}
      ctaHeadline="Check whether this liability is correct before you file."    >
      <div className="space-y-6 rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-6">
        <Field label="Amount" hint="The price of the supply — enter it with or without commas, e.g. 1,00,000.">
          <TextInput
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            aria-label="Amount"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Does it include GST?">
            <Select value={mode} onChange={(e) => setMode(e.target.value as GSTMode)} aria-label="GST mode">
              <option value="exclusive">No — exclusive of GST</option>
              <option value="inclusive">Yes — inclusive of GST</option>
            </Select>
          </Field>

          <Field label="GST rate">
            <Select value={String(ratePct)} onChange={(e) => setRatePct(Number(e.target.value))} aria-label="GST rate">
              {GST_SLABS.map((slab) => (
                <option key={slab.ratePct} value={slab.ratePct}>
                  {slab.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Supply type">
            <Select value={place} onChange={(e) => setPlace(e.target.value as GSTPlace)} aria-label="Supply type">
              <option value="intra-state">Intra-state (CGST + SGST)</option>
              <option value="inter-state">Inter-state (IGST)</option>
            </Select>
          </Field>
        </div>

        <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
          Intra-state supplies split the tax evenly into Central GST and State
          GST; inter-state supplies are taxed as a single Integrated GST. The
          slab you pick must match the HSN/SAC of your goods or service — use
          the HSN/SAC lookup if unsure.
        </p>
      </div>
    </CalculatorShell>
  );
}
