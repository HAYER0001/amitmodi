/*
 * data/redirects.ts — 301s for internal links that point at a service slug
 * that was never built, or was renamed.
 *
 * WHERE THIS CAME FROM
 * A live-site audit found 27 distinct /services/<slug> hrefs across the
 * glossary and blog content that do not match any of the 12 real slugs in
 * data/services.ts — confirmed 404 on the live deployment, e.g.
 * /services/income-tax-return alone is linked from 17 files. The glossary
 * entries were written assuming a service existed before the service catalog
 * was finalised, or a slug was renamed after the content linked to it.
 *
 * WHY ONLY SOME OF THE 27 ARE HERE
 * Each entry below is a confident synonym of exactly one real service —
 * "gst-returns" is unambiguously "gst-returns-filing" under a shorter name.
 * A GENUINE 404 is more honest than a WRONG redirect: sending someone asking
 * about a GST show-cause notice to an income-tax appeals page is worse than a
 * dead link, because it looks authoritative while being wrong. The remainder
 * — gst-advisory, litigation-support, tax-appeals, tax-audit, tax-litigation,
 * tan-registration, dsc-registration, corporate-compliance, mca-compliance,
 * roc-filings — genuinely cannot be resolved to one of the 12 existing
 * services without a person's judgement (some, like DSC/TAN/MCA/ROC, may not
 * be services the practice offers at all yet). Left as 404s on purpose rather
 * than guessed.
 */
type RedirectEntry = {
  source: string;
  destination: string;
  permanent?: boolean;
};

export const REDIRECTS: RedirectEntry[] = [
  { source: "/services/gst-returns", destination: "/services/gst-returns-filing" },
  { source: "/services/gst-return-filing", destination: "/services/gst-returns-filing" },
  { source: "/services/gst-compliance", destination: "/services/gst-returns-filing" },
  { source: "/services/gst-notice-management", destination: "/services/gst-notice-response" },
  { source: "/services/iec-registration", destination: "/services/import-export-licence" },
  { source: "/services/lut-filing", destination: "/services/import-export-licence" },
  { source: "/services/pan-card", destination: "/services/pan-card-services" },
  { source: "/services/ngo-services", destination: "/services/ngo-trust-compliance" },
  { source: "/services/income-tax-return", destination: "/services/income-tax-tds-returns" },
  { source: "/services/income-tax-returns", destination: "/services/income-tax-tds-returns" },
  { source: "/services/income-tax-filing", destination: "/services/income-tax-tds-returns" },
  { source: "/services/income-tax-advisory", destination: "/services/income-tax-tds-returns" },
  { source: "/services/itr-filing", destination: "/services/income-tax-tds-returns" },
  { source: "/services/tds-returns", destination: "/services/income-tax-tds-returns" },
  { source: "/services/tds-return-filing", destination: "/services/income-tax-tds-returns" },
  { source: "/services/tax-return-filing", destination: "/services/income-tax-tds-returns" },
  { source: "/services/company-incorporation", destination: "/services/entity-formation" },
];
