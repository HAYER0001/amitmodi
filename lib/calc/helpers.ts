/*
 * lib/calc/helpers.ts — shared, dependency-free math for the calculator
 * library.
 *
 * These functions are deliberately self-contained: lib/calc is run by
 * Node's built-in test runner (`node --test`), bundled by Next.js, and
 * never touches React. `formatINR` lives here so the breakdown strings
 * produced by pure functions use the same Indian lakh/crore grouping as the
 * rest of the site without importing any app code.
 */

/**
 * Round a money amount to two decimal places without float drift
 * (Number.EPSILON pushes x.xx5 up, matching how a human rounds).
 */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Guard used by every calculator entry point. Throws instead of ever
 * propagating NaN or a negative number into a result:
 *  - non-number / NaN / ±Infinity  → TypeError
 *  - negative                       → RangeError
 * Both are distinct and testable.
 */
export function assertFiniteNonNegative(value: unknown, name: string): asserts value is number {
  if (!isFiniteNumber(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
  if (value < 0) {
    throw new RangeError(`${name} must be zero or positive`);
  }
}

/** Variant for integer counts such as days. */
export function assertNonNegativeInteger(value: unknown, name: string): asserts value is number {
  assertFiniteNonNegative(value, name);
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be a whole number of days`);
  }
}

/** A rate must be one of the finite non-negative rates a calculator knows. */
export function assertAllowedRate(
  value: unknown,
  allowed: readonly number[],
  name: string,
): asserts value is number {
  assertFiniteNonNegative(value, name);
  if (!allowed.includes(value)) {
    throw new RangeError(`${name} must be one of: ${allowed.join(", ")}`);
  }
}

/** Member of a fixed set of string options; throws on anything else. */
export function assertOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  name: string,
): asserts value is T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new RangeError(`${name} must be one of: ${allowed.join(", ")}`);
  }
}

/**
 * Indian digit grouping — 1,00,000 (lakh/crore grouping), never 1,000,000.
 * Omits a trailing `.00`; keeps up to two decimals. NaN-safe.
 */
export function formatINR(n: number): string {
  if (!isFiniteNumber(n)) return "—";
  const negative = n < 0;
  const abs = Math.abs(n).toFixed(2);
  const [whole, decimals] = abs.split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = rest ? `${groupedRest},${last3}` : last3;
  const fraction = decimals !== "00" ? `.${decimals}` : "";
  return `${negative ? "-" : ""}${grouped}${fraction}`;
}

/** "18%" for 18, "0.25%" for 0.25, "0.1%" for 0.1. */
export function formatPct(ratePct: number): string {
  return `${ratePct}%`;
}

/** "₹1,180" for 1180; used by breakdown lines. */
export function formatMoney(n: number): string {
  return `₹${formatINR(n)}`;
}
