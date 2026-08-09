// Canonical keyword-to-URL map. Every keyword must map to exactly ONE targetPath.

export type Intent = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type Priority = 1 | 2 | 3;

export interface KeywordEntry {
  keyword: string;
  intent: Intent;
  targetPath: string;
  priority: Priority;
}

export const KEYWORD_MAP: KeywordEntry[] = [
  // — 8 primary service keywords → service pages (transactional, priority 1) —
  { keyword: 'PAN card application', intent: 'transactional', targetPath: '/services/pan-card-services', priority: 1 },
  { keyword: 'GST registration online', intent: 'transactional', targetPath: '/services/gst-registration', priority: 1 },
  { keyword: 'business entity registration', intent: 'transactional', targetPath: '/services/entity-formation', priority: 1 },
  { keyword: 'income tax return filing', intent: 'transactional', targetPath: '/services/income-tax-tds-returns', priority: 1 },
  { keyword: 'GST return filing', intent: 'transactional', targetPath: '/services/gst-returns-filing', priority: 1 },
  { keyword: 'income tax appeal', intent: 'transactional', targetPath: '/services/income-tax-appeals', priority: 1 },
  { keyword: 'GST appeal', intent: 'transactional', targetPath: '/services/gst-appeals', priority: 1 },
  { keyword: 'import export licence', intent: 'transactional', targetPath: '/services/import-export-licence', priority: 1 },

  // — 32 secondary keywords (4 per service) → same service pages (commercial, priority 2) —
  { keyword: 'new PAN card application online', intent: 'commercial', targetPath: '/services/pan-card-services', priority: 2 },
  { keyword: 'PAN correction service', intent: 'commercial', targetPath: '/services/pan-card-services', priority: 2 },
  { keyword: 'link PAN with Aadhaar', intent: 'commercial', targetPath: '/services/pan-card-services', priority: 2 },
  { keyword: 'PAN card lost duplicate', intent: 'commercial', targetPath: '/services/pan-card-services', priority: 2 },
  { keyword: 'GST registration for small business', intent: 'commercial', targetPath: '/services/gst-registration', priority: 2 },
  { keyword: 'GST registration for professionals', intent: 'commercial', targetPath: '/services/gst-registration', priority: 2 },
  { keyword: 'GST registration consultant', intent: 'commercial', targetPath: '/services/gst-registration', priority: 2 },
  { keyword: 'GSTIN application assistance', intent: 'commercial', targetPath: '/services/gst-registration', priority: 2 },
  { keyword: 'partnership firm registration', intent: 'commercial', targetPath: '/services/entity-formation', priority: 2 },
  { keyword: 'society registration India', intent: 'commercial', targetPath: '/services/entity-formation', priority: 2 },
  { keyword: 'trust registration', intent: 'commercial', targetPath: '/services/entity-formation', priority: 2 },
  { keyword: 'joint venture formation', intent: 'commercial', targetPath: '/services/entity-formation', priority: 2 },
  { keyword: 'ITR filing for salaried employees', intent: 'commercial', targetPath: '/services/income-tax-tds-returns', priority: 2 },
  { keyword: 'TDS return filing', intent: 'commercial', targetPath: '/services/income-tax-tds-returns', priority: 2 },
  { keyword: 'income tax e-filing consultant', intent: 'commercial', targetPath: '/services/income-tax-tds-returns', priority: 2 },
  { keyword: 'late ITR filing', intent: 'commercial', targetPath: '/services/income-tax-tds-returns', priority: 2 },
  { keyword: 'GSTR-1 filing online', intent: 'commercial', targetPath: '/services/gst-returns-filing', priority: 2 },
  { keyword: 'GSTR-3B filing', intent: 'commercial', targetPath: '/services/gst-returns-filing', priority: 2 },
  { keyword: 'GST annual return filing', intent: 'commercial', targetPath: '/services/gst-returns-filing', priority: 2 },
  { keyword: 'GST reconciliation', intent: 'commercial', targetPath: '/services/gst-returns-filing', priority: 2 },
  { keyword: 'appeal before CIT(A)', intent: 'commercial', targetPath: '/services/income-tax-appeals', priority: 2 },
  { keyword: 'appeal before ITAT', intent: 'commercial', targetPath: '/services/income-tax-appeals', priority: 2 },
  { keyword: 'income tax rectification application', intent: 'commercial', targetPath: '/services/income-tax-appeals', priority: 2 },
  { keyword: 'income tax demand objection', intent: 'commercial', targetPath: '/services/income-tax-appeals', priority: 2 },
  { keyword: 'appeal under section 107 CGST Act', intent: 'commercial', targetPath: '/services/gst-appeals', priority: 2 },
  { keyword: 'GST DRC-01 reply', intent: 'commercial', targetPath: '/services/gst-appeals', priority: 2 },
  { keyword: 'GST adjudication', intent: 'commercial', targetPath: '/services/gst-appeals', priority: 2 },
  { keyword: 'appeal before GSTAT', intent: 'commercial', targetPath: '/services/gst-appeals', priority: 2 },
  { keyword: 'import export code IEC registration', intent: 'commercial', targetPath: '/services/import-export-licence', priority: 2 },
  { keyword: 'import export licence consultant', intent: 'commercial', targetPath: '/services/import-export-licence', priority: 2 },
  { keyword: 'export compliances India', intent: 'commercial', targetPath: '/services/import-export-licence', priority: 2 },
  { keyword: 'DGFT IEC code', intent: 'commercial', targetPath: '/services/import-export-licence', priority: 2 },

  // — 5 tool keywords → tool pages (transactional, priority 1) —
  { keyword: 'GST calculator', intent: 'transactional', targetPath: '/tools/gst-calculator', priority: 1 },
  { keyword: 'GST late fee calculator', intent: 'transactional', targetPath: '/tools/gst-late-fee-calculator', priority: 1 },
  { keyword: 'HSN SAC lookup', intent: 'transactional', targetPath: '/tools/hsn-sac-lookup', priority: 1 },
  { keyword: 'ITR form selector', intent: 'transactional', targetPath: '/tools/itr-form-selector', priority: 1 },
  { keyword: 'TDS rate finder', intent: 'transactional', targetPath: '/tools/tds-rate-finder', priority: 1 },

  // — 12 article titles → post URLs (informational, priority 2) —
  { keyword: 'The compliance calendar every business with a GSTIN should have on the wall', intent: 'informational', targetPath: '/insights/business-compliance-calendar-gstin', priority: 2 },
  { keyword: 'Choosing a business entity', intent: 'informational', targetPath: '/insights/entity-formation-options', priority: 2 },
  { keyword: 'Filing an appeal before the CIT(A): timelines, fees and what to prepare', intent: 'informational', targetPath: '/insights/filing-appeal-cit-a-timelines-fees', priority: 2 },
  { keyword: 'Form 26AS vs AIS vs your books: reconciling the three before you file', intent: 'informational', targetPath: '/insights/form-26as-ais-books-reconciliation', priority: 2 },
  { keyword: 'GST appeals: APL-01 and after', intent: 'informational', targetPath: '/insights/gst-appeals-overview', priority: 2 },
  { keyword: 'What GST registration actually requires', intent: 'informational', targetPath: '/insights/gst-registration-overview', priority: 2 },
  { keyword: 'GST registration rejected? The eight reasons applications actually get refused', intent: 'informational', targetPath: '/insights/gst-registration-rejected-reasons', priority: 2 },
  { keyword: 'GST returns: the monthly cycle', intent: 'informational', targetPath: '/insights/gst-returns-guide', priority: 2 },
  { keyword: 'GSTR-9 and 9C: who has to file, and the reconciliations that catch people out', intent: 'informational', targetPath: '/insights/gstr-9-9c-filing-reconciliations', priority: 2 },
  { keyword: 'IEC and LUT for first-time exporters', intent: 'informational', targetPath: '/insights/iec-for-exporters', priority: 2 },
  { keyword: 'Getting an IEC and LUT: the first-time exporter\'s actual sequence', intent: 'informational', targetPath: '/insights/iec-lut-first-time-exporter-sequence', priority: 2 },
  { keyword: 'Input Tax Credit reversal under Rule 42/43, explained without the jargon', intent: 'informational', targetPath: '/insights/input-tax-credit-reversal-rule-42-43', priority: 2 },

  // — 14 tags → tag archives (informational, priority 3) —
  { keyword: 'gst', intent: 'informational', targetPath: '/insights/tag/gst', priority: 3 },
  { keyword: 'registration', intent: 'informational', targetPath: '/insights/tag/registration', priority: 3 },
  { keyword: 'appeals', intent: 'informational', targetPath: '/insights/tag/appeals', priority: 3 },
  { keyword: 'returns', intent: 'informational', targetPath: '/insights/tag/returns', priority: 3 },
  { keyword: 'itr', intent: 'informational', targetPath: '/insights/tag/itr', priority: 3 },
  { keyword: 'filing', intent: 'informational', targetPath: '/insights/tag/filing', priority: 3 },
  { keyword: 'pan', intent: 'informational', targetPath: '/insights/tag/pan', priority: 3 },
  { keyword: 'tds', intent: 'informational', targetPath: '/insights/tag/tds', priority: 3 },
  { keyword: 'compliance', intent: 'informational', targetPath: '/insights/tag/compliance', priority: 3 },
  { keyword: 'income-tax', intent: 'informational', targetPath: '/insights/tag/income-tax', priority: 3 },
  { keyword: 'entity', intent: 'informational', targetPath: '/insights/tag/entity', priority: 3 },
  { keyword: 'export', intent: 'informational', targetPath: '/insights/tag/export', priority: 3 },
  { keyword: 'notices', intent: 'informational', targetPath: '/insights/tag/notices', priority: 3 },
  { keyword: 'penalties', intent: 'informational', targetPath: '/insights/tag/penalties', priority: 3 },

  // — 20 "what is X" queries → glossary pages (informational, priority 3) —
  { keyword: 'what is hsn', intent: 'informational', targetPath: '/glossary/hsn', priority: 3 },
  { keyword: 'what is gstin', intent: 'informational', targetPath: '/glossary/gstin', priority: 3 },
  { keyword: 'what is pan', intent: 'informational', targetPath: '/glossary/pan', priority: 3 },
  { keyword: 'what is tan', intent: 'informational', targetPath: '/glossary/tan', priority: 3 },
  { keyword: 'what is tds', intent: 'informational', targetPath: '/glossary/tds', priority: 3 },
  { keyword: 'what is tcs', intent: 'informational', targetPath: '/glossary/tcs', priority: 3 },
  { keyword: 'what is itr', intent: 'informational', targetPath: '/glossary/itr', priority: 3 },
  { keyword: 'what is itc', intent: 'informational', targetPath: '/glossary/itc', priority: 3 },
  { keyword: 'what is rcm', intent: 'informational', targetPath: '/glossary/rcm', priority: 3 },
  { keyword: 'what is igst', intent: 'informational', targetPath: '/glossary/igst', priority: 3 },
  { keyword: 'what is cgst', intent: 'informational', targetPath: '/glossary/cgst', priority: 3 },
  { keyword: 'what is sgst', intent: 'informational', targetPath: '/glossary/sgst', priority: 3 },
  { keyword: 'what is lut', intent: 'informational', targetPath: '/glossary/lut', priority: 3 },
  { keyword: 'what is iec', intent: 'informational', targetPath: '/glossary/iec', priority: 3 },
  { keyword: 'what is dsc', intent: 'informational', targetPath: '/glossary/dsc', priority: 3 },
  { keyword: 'what is arn', intent: 'informational', targetPath: '/glossary/arn', priority: 3 },
  { keyword: 'what is ais', intent: 'informational', targetPath: '/glossary/ais', priority: 3 },
  { keyword: 'what is itat', intent: 'informational', targetPath: '/glossary/itat', priority: 3 },
  { keyword: 'what is form 16', intent: 'informational', targetPath: '/glossary/form-16', priority: 3 },
  { keyword: 'what is gstr 3b', intent: 'informational', targetPath: '/glossary/gstr-3b', priority: 3 },
];

/**
  Returns any keyword that appears more than once in KEYWORD_MAP with a
  different targetPath. Duplicate keywords competing for different URLs is a
  ranking error — the caller must fix these before publishing.
*/
export function findDuplicateTargets(): string[] {
  const seen = new Map<string, string>();
  const hits = new Set<string>();
  for (const entry of KEYWORD_MAP) {
    const existing = seen.get(entry.keyword);
    if (existing === undefined) {
      seen.set(entry.keyword, entry.targetPath);
    } else if (existing !== entry.targetPath) {
      hits.add(entry.keyword);
    }
  }
  return Array.from(hits);
}

export const KEYWORD_COUNT = KEYWORD_MAP.length;
