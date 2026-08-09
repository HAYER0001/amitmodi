// Per-service FAQ skeleton.
// One entry per service. Answers are taken verbatim from the service
// one-liners / names in data/services.ts.

export interface FAQEntry {
  id: string;
  serviceSlug: string;
  question: string;
  answer: string;
  order: number;
}

export const FAQS: FAQEntry[] = [
  {
    id: 'pan-card-services-faqs',
    serviceSlug: 'pan-card-services',
    question: 'What documents do I need to get a PAN card?',
    answer: 'Assistance with application, correction, and linking of Permanent Account Number (PAN).',
    order: 0,
  },
  {
    id: 'gst-registration-faqs',
    serviceSlug: 'gst-registration',
    question: 'How do I register for GST?',
    answer: 'Guidance and filing for Goods and Services Tax (GST) registration for businesses and professionals.',
    order: 1,
  },
  {
    id: 'entity-formation-faqs',
    serviceSlug: 'entity-formation',
    question: 'How do I form a business entity?',
    answer: 'Formation & Registration of Entities',
    order: 2,
  },
  {
    id: 'income-tax-tds-returns-faqs',
    serviceSlug: 'income-tax-tds-returns',
    question: 'What income tax forms do I need to file?',
    answer: 'Preparation and submission of Income Tax Returns (ITR) and Tax Deducted at Source (TDS) returns.',
    order: 3,
  },
  {
    id: 'gst-returns-filing-faqs',
    serviceSlug: 'gst-returns-filing',
    question: 'When are GST returns due?',
    answer: 'Monthly, quarterly, and annual GST return preparation and filing, including reconciliation support.',
    order: 4,
  },
  {
    id: 'income-tax-appeals-faqs',
    serviceSlug: 'income-tax-appeals',
    question: 'How do I file an income tax appeal?',
    answer: 'Appeals under the Income Tax Act',
    order: 5,
  },
  {
    id: 'gst-appeals-faqs',
    serviceSlug: 'gst-appeals',
    question: 'How do I file a GST appeal?',
    answer: 'Appeals under the GST Act',
    order: 6,
  },
  {
    id: 'import-export-licence-faqs',
    serviceSlug: 'import-export-licence',
    question: 'What licence do I need to export?',
    answer: 'Import & Export Licence and Compliances',
    order: 7,
  },
] as const;
