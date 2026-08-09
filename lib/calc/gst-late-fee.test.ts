/*
 * lib/calc/gst-late-fee.test.ts — late fee + interest tests.
 * Covers: zero, the boundary of each turnover-tier cap, a delay far above
 * any cap, and negative / non-finite input which must throw.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLateFee, lateFeeQueryString, parseLateFeeQuery } from "./gst-late-fee";
import { LATE_FEE_SLABS } from "./data/late-fee";

const base = { returnType: "gstr-3b", filingStatus: "regular", turnoverSlabId: "upto-1.5cr" } as const;

test("zero days late produces zero fee and zero interest", () => {
  const r = calculateLateFee({ ...base, daysLate: 0, taxPayable: 100000 });
  assert.equal(r.lateFee, 0);
  assert.equal(r.interest, 0);
  assert.equal(r.total, 0);
});

test("cap boundary — the ₹2,000 tier is hit at exactly 40 days", () => {
  // 39 days → 1,950 ; 40 days → exactly the cap ; 41 days → still the cap
  assert.equal(calculateLateFee({ ...base, daysLate: 39, taxPayable: 0 }).lateFee, 1950);
  assert.equal(calculateLateFee({ ...base, daysLate: 40, taxPayable: 0 }).lateFee, 2000);
  assert.equal(calculateLateFee({ ...base, daysLate: 41, taxPayable: 0 }).lateFee, 2000);
});

test("cap boundary — nil return caps at ₹500 on day 25", () => {
  const nil = { ...base, filingStatus: "nil", turnoverSlabId: "nil" } as const;
  assert.equal(calculateLateFee({ ...nil, daysLate: 24, taxPayable: 0 }).lateFee, 480);
  assert.equal(calculateLateFee({ ...nil, daysLate: 25, taxPayable: 0 }).lateFee, 500);
  assert.equal(calculateLateFee({ ...nil, daysLate: 26, taxPayable: 0 }).lateFee, 500);
});

test("each turnover-tier boundary applies its own cap", () => {
  for (const slab of LATE_FEE_SLABS) {
    if (slab.id === "nil") continue;
    const r = calculateLateFee({ ...base, turnoverSlabId: slab.id, daysLate: 100000, taxPayable: 0 });
    assert.equal(r.cap, slab.cap, `${slab.id} cap`);
    assert.equal(r.lateFee, slab.cap, `${slab.id} saturates at its cap`);
  }
});

test("interest — a full year at 18% on the net cash liability", () => {
  const r = calculateLateFee({ ...base, daysLate: 365, taxPayable: 100000 });
  assert.equal(r.interestRatePct, 18);
  assert.equal(r.interest, 18000);
});

test("interest — one day is a pro-rata daily fraction, rounded", () => {
  const r = calculateLateFee({ ...base, daysLate: 1, taxPayable: 100000 });
  assert.equal(r.interest, 49.32);
});

test("no interest on a nil return", () => {
  const r = calculateLateFee({ ...base, filingStatus: "nil", turnoverSlabId: "nil", daysLate: 30, taxPayable: 0 });
  assert.equal(r.interest, 0);
});

test("breakdown explains the cap arithmetic", () => {
  const r = calculateLateFee({ ...base, daysLate: 45, taxPayable: 0 });
  const cap = r.breakdown.find((b) => b.label === "Cap per return")!;
  assert.match(cap.detail ?? "", /2,250/);
  const fee = r.breakdown.find((b) => b.label === "Late fee")!;
  assert.match(fee.detail ?? "", /Capped/);
  assert.equal(r.total, 2000);
});

test("negative days or negative tax throws RangeError", () => {
  assert.throws(() => calculateLateFee({ ...base, daysLate: -1, taxPayable: 0 }), RangeError);
  assert.throws(() => calculateLateFee({ ...base, daysLate: 1, taxPayable: -100 }), RangeError);
});

test("non-finite or non-integer days throw TypeError", () => {
  assert.throws(() => calculateLateFee({ ...base, daysLate: NaN, taxPayable: 0 }), TypeError);
  assert.throws(() => calculateLateFee({ ...base, daysLate: 1.5, taxPayable: 0 }), TypeError);
  assert.throws(() => calculateLateFee({ ...base, daysLate: 1, taxPayable: Infinity }), TypeError);
});

test("unknown return type, status, or slab throws", () => {
  // @ts-expect-error runtime guard
  assert.throws(() => calculateLateFee({ ...base, returnType: "gstr-9", daysLate: 1, taxPayable: 0 }), RangeError);
  // @ts-expect-error runtime guard
  assert.throws(() => calculateLateFee({ ...base, filingStatus: "partial", daysLate: 1, taxPayable: 0 }), RangeError);
  // @ts-expect-error runtime guard
  assert.throws(() => calculateLateFee({ ...base, turnoverSlabId: "giant", daysLate: 1, taxPayable: 0 }), RangeError);
});

test("GSTR-1 and GSTR-3B share the same fee schedule", () => {
  const one = calculateLateFee({ ...base, returnType: "gstr-1", daysLate: 10, taxPayable: 0 });
  const three = calculateLateFee({ ...base, returnType: "gstr-3b", daysLate: 10, taxPayable: 0 });
  assert.equal(one.lateFee, three.lateFee);
});

test("query string round-trips through parseLateFeeQuery", () => {
  const input = { returnType: "gstr-1", filingStatus: "regular", turnoverSlabId: "above-5cr", daysLate: 45, taxPayable: 50000 } as const;
  assert.deepEqual(parseLateFeeQuery(lateFeeQueryString(input)), input);
  assert.deepEqual(parseLateFeeQuery("days=-4&return=bad"), {});
});
