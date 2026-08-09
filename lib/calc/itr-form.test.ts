/*
 * lib/calc/itr-form.test.ts — ITR form selector tests.
 * Covers: zero income, the ₹50 lakh simple-form boundary, the decision
 * matrix across taxpayer kinds, and negative / non-finite input which must
 * throw.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { itrQueryString, parseITRQuery, selectITRForm } from "./itr-form";
import type { BusinessNature, ITRFormCode, TaxpayerKind } from "./data/itr";

const base = { taxpayer: "individual-resident", businessNature: "none", complex: false, totalIncome: 30_00_000 } as const;

test("zero income still resolves to a form (ITR-1)", () => {
  const r = selectITRForm({ ...base, totalIncome: 0 });
  assert.equal(r.form, "ITR-1");
  assert.ok(r.reasons.length >= 2);
});

test("₹50 lakh boundary — ITR-1 allowed at exactly the cap, not above it", () => {
  assert.equal(selectITRForm({ ...base, totalIncome: 50_00_000 }).form, "ITR-1");
  assert.equal(selectITRForm({ ...base, totalIncome: 50_00_000.01 }).form, "ITR-2");
});

test("disqualifying complexity pushes an individual out of ITR-1", () => {
  assert.equal(selectITRForm({ ...base, complex: true }).form, "ITR-2");
});

test("business income — regular books → ITR-3, presumptive within limits → ITR-4", () => {
  assert.equal(selectITRForm({ ...base, businessNature: "regular" }).form, "ITR-3");
  assert.equal(selectITRForm({ ...base, businessNature: "presumptive" }).form, "ITR-4");
  // presumptive but above the income cap → ITR-3
  assert.equal(selectITRForm({ ...base, businessNature: "presumptive", totalIncome: 60_00_000 }).form, "ITR-3");
});

test("each taxpayer kind resolves to the correct form", () => {
  const cases: ReadonlyArray<{
    taxpayer: TaxpayerKind;
    biz: BusinessNature;
    complex?: boolean;
    expected: ITRFormCode;
  }> = [
    { taxpayer: "trust", biz: "none", expected: "ITR-7" },
    { taxpayer: "company", biz: "none", expected: "ITR-6" },
    { taxpayer: "llp", biz: "none", expected: "ITR-5" },
    { taxpayer: "aop-boi", biz: "none", expected: "ITR-5" },
    { taxpayer: "firm", biz: "none", expected: "ITR-5" },
    { taxpayer: "firm", biz: "presumptive", expected: "ITR-4" },
    { taxpayer: "firm", biz: "presumptive", complex: true, expected: "ITR-5" },
    { taxpayer: "huf", biz: "none", expected: "ITR-2" },
    { taxpayer: "huf", biz: "regular", expected: "ITR-3" },
    { taxpayer: "huf", biz: "presumptive", expected: "ITR-4" },
    { taxpayer: "individual-resident", biz: "none", expected: "ITR-1" },
    { taxpayer: "individual-resident", biz: "regular", expected: "ITR-3" },
    { taxpayer: "individual-resident", biz: "presumptive", expected: "ITR-4" },
    { taxpayer: "individual-nri", biz: "none", expected: "ITR-2" },
    { taxpayer: "individual-nri", biz: "regular", expected: "ITR-3" },
  ];

  for (const c of cases) {
    const r = selectITRForm({
      taxpayer: c.taxpayer,
      businessNature: c.biz,
      complex: c.complex ?? false,
      totalIncome: 30_00_000,
    });
    assert.equal(r.form, c.expected, `${c.taxpayer} / ${c.biz}${c.complex ? " / complex" : ""}`);
    assert.ok(r.reasons.length >= 1, "reasons should be present");
  }
});

test("result carries the form name and explanation", () => {
  const r = selectITRForm({ ...base, taxpayer: "individual-resident", businessNature: "presumptive" });
  assert.equal(r.formName, "Sugam");
  assert.match(r.who, /presumptive/i);
  assert.ok(r.breakdown.some((b) => b.label === "Applicable form"));
});

test("negative income throws RangeError", () => {
  assert.throws(() => selectITRForm({ ...base, totalIncome: -1 }), RangeError);
});

test("non-finite income throws TypeError", () => {
  assert.throws(() => selectITRForm({ ...base, totalIncome: NaN }), TypeError);
});

test("unknown taxpayer or business kind throws", () => {
  // @ts-expect-error runtime guard
  assert.throws(() => selectITRForm({ ...base, taxpayer: "alien" }), RangeError);
  // @ts-expect-error runtime guard
  assert.throws(() => selectITRForm({ ...base, businessNature: "sometimes" }), RangeError);
});

test("query string round-trips through parseITRQuery", () => {
  const input = { taxpayer: "firm", businessNature: "presumptive", complex: true, totalIncome: 20_00_000 } as const;
  assert.deepEqual(parseITRQuery(itrQueryString(input)), input);
  assert.deepEqual(parseITRQuery("who=alien&complex=maybe"), {});
});
