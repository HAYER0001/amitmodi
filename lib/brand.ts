/*
 * lib/brand.ts — single source of truth for business facts.
 *
 * CONTRACT (lock this into every consumer that renders brand facts):
 *  - A fact whose value is 'TBD' or null IS NOT a fact yet.
 *  - The exported `brand` object swaps every 'TBD' string for null at load.
 *  - `hasFact(key)` is the guard: components MUST render nothing, not a
 *    placeholder, when it returns false. Never fall back to a guessed
 *    name, address, or number.
 *  - Real values come from ../../BRAND-FACTS.md only (see data/brand.ts).
 */
import { BRAND } from '@/data/brand';

export type BrandField = keyof typeof BRAND;

/** Maps 'TBD' strings to null at every depth of the brand object. */
export type Normalized<T> = T extends 'TBD'
  ? null
  : T extends readonly (infer U)[]
    ? readonly Normalized<U>[]
    : T extends object
      ? { [K in keyof T]: Normalized<T[K]> }
      : T;

function normalize<T>(value: T): Normalized<T> {
  if (typeof value === 'string') return (value === 'TBD' ? null : value) as Normalized<T>;
  if (Array.isArray(value)) return value.map((v) => normalize(v)) as Normalized<T>;
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = normalize(v);
    }
    return out as Normalized<T>;
  }
  return value as Normalized<T>;
}

/** Business facts with every 'TBD' resolved to null. Inspect via hasFact. */
export const brand: Normalized<typeof BRAND> = normalize(BRAND);

/** True when the fact exists — consumers must render nothing when false. */
export function hasFact(key: BrandField): boolean {
  return brand[key] !== null && brand[key] !== undefined;
}

/** Read one fact; null when TBD — never a guess. */
export function fact(key: BrandField): Normalized<typeof BRAND>[BrandField] | null {
  const value = brand[key];
  return hasFact(key) ? value : null;
}