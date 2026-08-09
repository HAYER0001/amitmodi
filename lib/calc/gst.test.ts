/*
 * lib/calc/gst.test.ts — GST calculator tests.
 * Covers: zero, every slab rate boundary, a value above the highest slab,
 * and negative / non-finite input which must throw.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateGST, gstQueryString, parseGSTQuery } from "./gst";
import { GST_SLABS } from "./data/gst";

const base = { mode: "exclusive", place: "intra-state" } as const;

test("zero amount produces an all-zero result", () => {
  const r = calculateGST({ amount: 0, ratePct: 18, ...base });
  assert.equal(r.taxableValue, 0);
  assert.equal(r.tax, 0);
  assert.equal(r.total, 0);
  assert.equal(r.cgst, 0);
  assert.equal(r.sgst, 0);
  assert.equal(r.igst, 0);
  assert.equal(r.breakdown.length, 5);
});

test("every slab boundary computes the correct tax", () => {
  for (const slab of GST_SLABS) {
    const r = calculateGST({ amount: 1000, ratePct: slab.ratePct, ...base });
    assert.equal(r.tax, (1000 * slab.ratePct) / 100, `tax at ${slab.ratePct}%`);
    assert.equal(r.total, 1000 + r.tax, `total at ${slab.ratePct}%`);
  }
});

test("a value above the highest slab (large amount) computes correctly", () => {
  const r = calculateGST({ amount: 1_000_000_000, ratePct: 28, ...base });
  assert.equal(r.tax, 280_000_000);
  assert.equal(r.total, 1_280_000_000);
});

test("intra-state splits CGST/SGST evenly; inter-state puts it all in IGST", () => {
  const intra = calculateGST({ amount: 1000, ratePct: 18, ...base });
  assert.equal(intra.cgst, 90);
  assert.equal(intra.sgst, 90);
  assert.equal(intra.igst, 0);
  assert.equal(intra.cgst + intra.sgst, intra.tax);

  const inter = calculateGST({ amount: 1000, ratePct: 18, mode: "exclusive", place: "inter-state" });
  assert.equal(inter.igst, 180);
  assert.equal(inter.cgst, 0);
  assert.equal(inter.sgst, 0);
});

test("odd centavos still reconcile: cgst + sgst equals the tax exactly", () => {
  const r = calculateGST({ amount: 100, ratePct: 0.25, ...base });
  assert.equal(r.tax, 0.25);
  assert.equal(r.cgst + r.sgst, r.tax);
});

test("inclusive mode derives the taxable value (round-trips with exclusive)", () => {
  const exclusive = calculateGST({ amount: 1000, ratePct: 18, ...base });
  const inclusive = calculateGST({ amount: exclusive.total, ratePct: 18, mode: "inclusive", place: "intra-state" });
  assert.equal(inclusive.taxableValue, 1000);
  assert.equal(inclusive.tax, 180);
  assert.equal(inclusive.total, 1180);
});

test("breakdown explains the arithmetic", () => {
  const r = calculateGST({ amount: 1000, ratePct: 18, ...base });
  const labels = r.breakdown.map((b) => b.label);
  assert.ok(labels.includes("Rate"));
  assert.ok(labels.includes("Total payable"));
  const total = r.breakdown.find((b) => b.label === "Total payable")!;
  assert.equal(total.value, "₹1,180");
});

test("negative amount throws RangeError", () => {
  assert.throws(() => calculateGST({ amount: -1, ratePct: 18, ...base }), RangeError);
});

test("non-finite amount throws TypeError", () => {
  assert.throws(() => calculateGST({ amount: NaN, ratePct: 18, ...base }), TypeError);
  assert.throws(() => calculateGST({ amount: Infinity, ratePct: 18, ...base }), TypeError);
});

test("invalid rate, mode, or place throws", () => {
  assert.throws(() => calculateGST({ amount: 100, ratePct: 99, ...base }), RangeError);
  assert.throws(() => calculateGST({ amount: 100, ratePct: -18, ...base }), RangeError);
  // @ts-expect-error runtime guard
  assert.throws(() => calculateGST({ amount: 100, ratePct: 18, mode: "nope", place: "intra-state" }), RangeError);
  // @ts-expect-error runtime guard
  assert.throws(() => calculateGST({ amount: 100, ratePct: 18, mode: "exclusive", place: "sea" }), RangeError);
});

test("query string round-trips through parseGSTQuery", () => {
  const input = { amount: 1180, mode: "inclusive", ratePct: 18, place: "inter-state" } as const;
  const parsed = parseGSTQuery(gstQueryString(input));
  assert.deepEqual(parsed, input);
  assert.deepEqual(parseGSTQuery("amount=notanumber&rate=99"), {});
});

test("missing rate parameter is not silently parsed as 0%", () => {
  assert.deepEqual(parseGSTQuery(""), {});
  assert.deepEqual(parseGSTQuery("amount=1000"), { amount: 1000 });
  assert.deepEqual(parseGSTQuery("mode=exclusive&place=intra-state"), { mode: "exclusive", place: "intra-state" });
});
