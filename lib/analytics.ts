/*
 * lib/analytics.ts — GA4 event helper (Phase 15, Agent A).
 *
 * The site's analytics script is wired in by environment (NEXT_PUBLIC_GA_ID /
 * NEXT_PUBLIC_GTM_ID, see .env.example and DEPLOYMENT.md). When it loads it
 * installs `window.gtag`; this helper fires through it, or pushes to the
 * dataLayer when only Google Tag Manager is present, and is a safe no-op
 * otherwise. Call it from client components only.
 */

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Fire a GA4 event. No-op (never throws) when analytics is not installed.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
    return;
  }
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...params });
  }
}
