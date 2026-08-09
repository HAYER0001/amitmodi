import { SERVICES } from '@/data/services';
import type { Service, ServiceCategory, Turnaround } from '@/types/content';

/** All eight service lines from the registry. */
export function getAllServices(): Service[] {
  return SERVICES as unknown as Service[];
}

/**
 * One service by slug.
 * DATA-NOTE: C's registry (Phase 3) does not yet carry `whoNeedsIt`;
 * entries are cast via `unknown` until Phase 10 fills them in.
 */
export function getService(slug: string): Service | undefined {
  return getAllServices().find((service) => service.slug === slug);
}

/** Services filtered by category ('registration' | 'filing' | 'litigation' | 'trade'). */
export function getServicesByCategory(category: ServiceCategory): Service[] {
  return getAllServices().filter((service) => service.category === category);
}

/**
 * Indian digit grouping — 1,00,000 (lakh crore grouping), never 1,000,000.
 * Works for negative numbers and up to two decimal places.
 */
export function formatINR(n: number): string {
  const negative = n < 0;
  const abs = Math.abs(n).toFixed(2);
  const [whole, decimals] = abs.split('.');
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = rest ? `${groupedRest},${last3}` : last3;
  const fraction = decimals !== '00' ? `.${decimals}` : '';
  return `${negative ? '-' : ''}${grouped}${fraction}`;
}

/** "7–10 working days" ; a single day renders as "7 working days". */
export function formatTurnaround(t: Turnaround): string {
  if (t.minDays === t.maxDays) return `${t.minDays} working days`;
  return `${t.minDays}–${t.maxDays} working days`;
}

/**
 * Strips unverified entries in production builds; keeps them (for a visible
 * "pending verification" state) in development.
 */
export function verifiedOnly<T extends { verified: boolean }>(items: readonly T[]): T[] {
  if (process.env.NODE_ENV === 'production') {
    return items.filter((item) => item.verified);
  }
  return [...items];
}