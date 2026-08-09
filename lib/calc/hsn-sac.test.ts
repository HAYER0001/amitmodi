/*
 * lib/calc/hsn-sac.test.ts — HSN/SAC lookup tests.
 * Covers: zero (empty query → full curated list), boundary lookups at each
 * slab rate, code vs description matching, and non-string input which must
 * throw.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { entryByCode, entryBreakdown, searchHSNSAC } from "./hsn-sac";
import { GST_SLABS } from "./data/gst";
import { HSN_SAC_ENTRIES } from "./data/hsn-sac";

test("empty query returns the whole curated dataset (zero boundary)", () => {
  const r = searchHSNSAC("");
  assert.equal(r.total, HSN_SAC_ENTRIES.length);
  assert.equal(r.matches.length, HSN_SAC_ENTRIES.length);
  assert.ok(r.matches.length > 0);
});

test("every entry carries a valid slab rate; the common rates are present", () => {
  const valid = GST_SLABS.map((s) => s.ratePct);
  for (const entry of HSN_SAC_ENTRIES) {
    assert.ok(valid.includes(entry.ratePct), `${entry.code} has a valid rate`);
  }
  for (const rate of [0, 5, 12, 18, 28]) {
    const count = HSN_SAC_ENTRIES.filter((e) => e.ratePct === rate).length;
    assert.ok(count >= 1, `at least one entry at ${rate}%`);
  }
});

test("digit queries match as code prefixes", () => {
  const r = searchHSNSAC("85");
  assert.ok(r.matches.every((m) => m.code.startsWith("85")));
  assert.ok(r.matches.some((m) => m.code === "8517"));
});

test("word queries match descriptions case-insensitively", () => {
  const r = searchHSNSAC("CONSULT");
  assert.ok(r.matches.some((m) => m.description.toLowerCase().includes("consult")));
  assert.equal(r.matches[0].description, "Business and management consultancy");
});

test("no match returns an empty list, never NaN", () => {
  const r = searchHSNSAC("zzzzzz");
  assert.equal(r.matches.length, 0);
  assert.ok(r.breakdown.some((b) => b.label === "Matches"));
});

test("breakdown reports the match count and subset caveat", () => {
  const r = searchHSNSAC("8703");
  const matches = r.breakdown.find((b) => b.label === "Matches")!;
  assert.match(matches.detail ?? "", /curated subset/i);
  assert.equal(r.matches[0].description, "Motor cars");
});

test("entryByCode resolves exact codes and undefined for misses", () => {
  assert.equal(entryByCode("8517")?.ratePct, 18);
  assert.equal(entryByCode("9993")?.description, "Health and medical services");
  assert.equal(entryByCode("123456"), undefined);
});

test("entryBreakdown produces labelled lines", () => {
  const lines = entryBreakdown(entryByCode("9963")!);
  assert.equal(lines[0].label, "Code");
  assert.equal(lines[0].value, "9963");
  assert.equal(lines[1].label, "GST rate");
});

test("non-string query or code throws TypeError", () => {
  // @ts-expect-error runtime guard
  assert.throws(() => searchHSNSAC(8517), TypeError);
  // @ts-expect-error runtime guard
  assert.throws(() => entryByCode(8517), TypeError);
});
