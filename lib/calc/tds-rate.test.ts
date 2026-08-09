/*
 * lib/calc/tds-rate.test.ts — TDS rate finder tests.
 * Covers: zero, the threshold boundary of each tier (at / above), a value
 * far above the highest threshold, payer-kind splits, and negative /
 * non-finite input which must throw.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTDS, findTDSRate, parseTDSQuery, tdsQueryString } from "./tds-rate";
import { round2 } from "./helpers";
import { TDS_PAYMENT_TYPES } from "./data/tds";

test("findTDSRate resolves every known id and rejects unknown ones", () => {
  for (const t of TDS_PAYMENT_TYPES) {
    assert.equal(findTDSRate(t.id).section, t.section);
  }
  assert.throws(() => findTDSRate("199x"), RangeError);
  assert.throws(() => findTDSRate(""), RangeError);
});

test("zero amount never triggers a deduction", () => {
  for (const t of TDS_PAYMENT_TYPES) {
    const r = calculateTDS({ paymentTypeId: t.id, amount: 0, payerKind: "other" });
    assert.equal(r.tdsAmount, 0);
    assert.equal(r.applies, t.threshold === null ? true : false);
  }
});

test("threshold boundary — exactly at the threshold triggers nothing, above it does", () => {
  const cases: ReadonlyArray<{
    id: string;
    threshold: number;
    rate: number;
    payer?: "individual" | "other";
  }> = [
    { id: "194a-bank", threshold: 50000, rate: 10 },
    { id: "194b", threshold: 10000, rate: 30 },
    { id: "194c", threshold: 30000, rate: 1, payer: "individual" },
    { id: "194c", threshold: 30000, rate: 2, payer: "other" },
    { id: "194ia", threshold: 5000000, rate: 1 },
    { id: "194q", threshold: 5000000, rate: 0.1 },
    { id: "194s", threshold: 50000, rate: 1 },
  ];

  for (const c of cases) {
    const at = calculateTDS({ paymentTypeId: c.id, amount: c.threshold, payerKind: c.payer });
    assert.equal(at.applies, false, `${c.id} at threshold should not apply`);
    assert.equal(at.tdsAmount, 0, `${c.id} at threshold → zero`);

    const above = calculateTDS({ paymentTypeId: c.id, amount: c.threshold + 1, payerKind: c.payer });
    assert.equal(above.applies, true, `${c.id} just above threshold should apply`);
    assert.equal(above.ratePct, c.rate, `${c.id} rate`);
    assert.equal(above.tdsAmount, round2(((c.threshold + 1) * c.rate) / 100), `${c.id} amount just above`);
  }
});

test("a value far above the highest threshold computes the full deduction", () => {
  const r = calculateTDS({ paymentTypeId: "194b", amount: 100_000_000 });
  assert.equal(r.ratePct, 30);
  assert.equal(r.tdsAmount, 30_000_000);
});

test("payer-kind split applies the right rate per payer", () => {
  const individual = calculateTDS({ paymentTypeId: "194c", payerKind: "individual", amount: 100000 });
  assert.equal(individual.ratePct, 1);
  assert.equal(individual.tdsAmount, 1000);

  const other = calculateTDS({ paymentTypeId: "194c", payerKind: "other", amount: 100000 });
  assert.equal(other.ratePct, 2);
  assert.equal(other.tdsAmount, 2000);
});

test("breakdown explains the arithmetic", () => {
  const r = calculateTDS({ paymentTypeId: "194q", amount: 60_000_000 });
  assert.equal(r.section, "194Q");
  const amount = r.breakdown.find((b) => b.label === "TDS to deduct")!;
  assert.match(amount.detail ?? "", /6,00,00,000/);
  assert.equal(amount.value, "₹60,000");
});

test("negative amount throws RangeError", () => {
  assert.throws(() => calculateTDS({ paymentTypeId: "194a-bank", amount: -10 }), RangeError);
});

test("non-finite amount throws TypeError", () => {
  assert.throws(() => calculateTDS({ paymentTypeId: "194a-bank", amount: NaN }), TypeError);
  assert.throws(() => calculateTDS({ paymentTypeId: "194a-bank", amount: Infinity }), TypeError);
});

test("split-rate payment without a payer kind throws", () => {
  // payerKind is optional at the type level (guarded at runtime) — this
  // call type-checks but must throw for 194C's payer-split rate.
  assert.throws(() => calculateTDS({ paymentTypeId: "194c", amount: 100000 }), RangeError);
});

test("query string round-trips through parseTDSQuery", () => {
  const input = { paymentTypeId: "194c", amount: 100000, payerKind: "other" } as const;
  assert.deepEqual(parseTDSQuery(tdsQueryString(input)), input);
  assert.deepEqual(parseTDSQuery("type=zzz&amount=abc"), {});
});
