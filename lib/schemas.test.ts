/*
 * lib/schemas.test.ts — consultation schema tests.
 *
 * The phone-regex behaviours are a deliberate contract. Intent for each case
 * from the phase-12(A) brief (9876543210, +919876543210, 919876543210,
 * 09876543210, 1234567890, 98765 43210):
 *
 *   PASS  9876543210   plain 10-digit mobile starting with 9
 *   PASS  +919876543210  +91 prefix + 10 digits
 *   FAIL  919876543210  bare "91" is NOT a +91 prefix; a 12-digit number is
 *                       never a valid Indian mobile, so we do not guess
 *   FAIL  09876543210  leading 0 (old STD style) — mobiles are 10 digits
 *   FAIL  1234567890   ten digits but starts with 1 — Indian mobile numbers
 *                       begin with 6–9 (TRAI numbering)
 *   PASS  98765 43210  internal whitespace is stripped before matching
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { consultationSchema, stepSchemas } from "./schemas";

const valid = {
  name: "Amit Modi",
  phone: "9876543210",
  email: "you@example.com",
  service: "gst-registration",
  situation: "received a notice",
  urgency: "this week",
  message: "",
  consent: true,
  company: "",
} as const;

test("phone — the six brief cases pass or fail as intended", () => {
  const cases = [
    { phone: "9876543210", pass: true },
    { phone: "+919876543210", pass: true },
    { phone: "919876543210", pass: false },
    { phone: "09876543210", pass: false },
    { phone: "1234567890", pass: false },
    { phone: "98765 43210", pass: true },
  ];
  for (const { phone, pass } of cases) {
    const result = consultationSchema.safeParse({ ...valid, phone });
    assert.equal(result.success, pass, `expected phone "${phone}" to ${pass ? "pass" : "fail"}`);
  }
});

test("phone — whitespace is normalised and the output keeps the +91 prefix", () => {
  const r = consultationSchema.parse({ ...valid, phone: " +91 98765 43210 " });
  assert.equal(r.phone, "+919876543210");
});

test("name — 2–80 characters after trimming", () => {
  assert.equal(consultationSchema.safeParse({ ...valid, name: "A" }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, name: "  A  " }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, name: "Am" }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, name: "A".repeat(80) }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, name: "A".repeat(81) }).success, false);
});

test("email — optional, but validated when present", () => {
  assert.equal(consultationSchema.safeParse({ ...valid, email: undefined }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, email: "" }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, email: "nope" }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, email: " a@B.COM " }).success, true);
  const r = consultationSchema.parse({ ...valid, email: "  You@Example.com " });
  assert.equal(r.email, "you@example.com");
});

test("service — the eight slugs plus 'other'", () => {
  const slugs = [
    "pan-card-services",
    "gst-registration",
    "entity-formation",
    "income-tax-tds-returns",
    "gst-returns-filing",
    "income-tax-appeals",
    "gst-appeals",
    "import-export-licence",
    "other",
  ];
  for (const service of slugs) {
    assert.equal(consultationSchema.safeParse({ ...valid, service }).success, true, service);
  }
  assert.equal(consultationSchema.safeParse({ ...valid, service: "money-laundering" }).success, false);
});

test("situation and urgency enums", () => {
  for (const situation of ["starting out", "ongoing compliance", "received a notice", "appeal or dispute", "not sure"]) {
    assert.equal(consultationSchema.safeParse({ ...valid, situation }).success, true, situation);
  }
  for (const urgency of ["this week", "this month", "planning ahead"]) {
    assert.equal(consultationSchema.safeParse({ ...valid, urgency }).success, true, urgency);
  }
  assert.equal(consultationSchema.safeParse({ ...valid, situation: "nope" }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, urgency: "nope" }).success, false);
});

test("message — optional, max 1500 characters", () => {
  assert.equal(consultationSchema.safeParse({ ...valid, message: undefined }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, message: "A".repeat(1500) }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, message: "A".repeat(1501) }).success, false);
});

test("consent must be the literal value true", () => {
  assert.equal(consultationSchema.safeParse({ ...valid, consent: true }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, consent: false }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, consent: "true" }).success, false);
  assert.equal(consultationSchema.safeParse({ ...valid, consent: undefined }).success, false);
});

test("honeypot company must be empty", () => {
  assert.equal(consultationSchema.safeParse({ ...valid, company: "" }).success, true);
  assert.equal(consultationSchema.safeParse({ ...valid, company: "Acme Ltd" }).success, false);
});

test("step schemas validate only their own fields", () => {
  assert.equal(stepSchemas[1].safeParse({ service: "other", situation: "not sure" }).success, true);
  assert.equal(stepSchemas[1].safeParse({ service: "", situation: "not sure" }).success, false);
  assert.equal(stepSchemas[2].safeParse({ urgency: "this month" }).success, true);
  assert.equal(stepSchemas[2].safeParse({ urgency: "" }).success, false);
  assert.equal(
    stepSchemas[3].safeParse({ name: "Amit", phone: "9876543210", email: "" }).success,
    true,
  );
  assert.equal(
    stepSchemas[3].safeParse({ name: "Amit", phone: "1234567890", email: "" }).success,
    false,
  );
  assert.equal(
    stepSchemas[4].safeParse({ message: "", consent: true }).success,
    true,
  );
  assert.equal(
    stepSchemas[4].safeParse({ message: "", consent: false }).success,
    false,
  );
});

test("a full valid payload parses to a clean output", () => {
  const r = consultationSchema.parse(valid);
  assert.deepEqual(r, {
    name: "Amit Modi",
    phone: "9876543210",
    email: "you@example.com",
    service: "gst-registration",
    situation: "received a notice",
    urgency: "this week",
    message: "",
    consent: true,
    company: "",
  });
});
