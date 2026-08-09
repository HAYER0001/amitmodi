export type TagSlug = (typeof TAGS)[number]['slug'];

export interface Tag {
  slug: string;
  label: string;
  description: string;
  relatedServiceSlug: string | null;
}

export const TAGS: Tag[] = [
  {
    slug: 'gst',
    label: 'GST',
    description: 'News, explanations and updates about the Goods and Services Tax regime.',
    relatedServiceSlug: null,
  },
  {
    slug: 'gst-registration',
    label: 'GST Registration',
    description: 'How to register for GST, who must register and what to do after enrolling.',
    relatedServiceSlug: 'gst-registration',
  },
  {
    slug: 'gst-returns',
    label: 'GST Returns',
    description: 'Filing GSTR-1, GSTR-3B and annual returns, including due dates and checklists.',
    relatedServiceSlug: 'gst-returns-filing',
  },
  {
    slug: 'gst-notices',
    label: 'GST Notices',
    description: 'Responses to GSTR-1, GSTR-3B and payment-related notices.',
    relatedServiceSlug: null,
  },
  {
    slug: 'income-tax',
    label: 'Income Tax',
    description: 'General income-tax rules, slabs and legislative updates.',
    relatedServiceSlug: null,
  },
  {
    slug: 'itr-filing',
    label: 'ITR Filing',
    description: 'Which ITR form to file, how to file it and common errors to avoid.',
    relatedServiceSlug: 'income-tax-tds-returns',
  },
  {
    slug: 'tds',
    label: 'TDS',
    description: 'Tax Deducted at Source: rates, thresholds and TDS return filing.',
    relatedServiceSlug: 'income-tax-tds-returns',
  },
  {
    slug: 'tax-notices',
    label: 'Tax Notices',
    description: 'How to read and respond to income-tax department notices.',
    relatedServiceSlug: null,
  },
  {
    slug: 'appeals',
    label: 'Appeals',
    description: 'Challenging an assessment order before the CIT(A), ITAT or CESTAT.',
    relatedServiceSlug: null,
  },
  {
    slug: 'entity-formation',
    label: 'Entity Formation',
    description: 'Choosing and registering a partnership, LLP, trust or company.',
    relatedServiceSlug: 'entity-formation',
  },
  {
    slug: 'trusts-societies',
    label: 'Trusts & Societies',
    description: 'Registering and complying as a charitable trust or society.',
    relatedServiceSlug: null,
  },
  {
    slug: 'import-export',
    label: 'Import & Export',
    description: 'IEC, RCMC, DGFT licensing and export-compliance basics.',
    relatedServiceSlug: 'import-export-licence',
  },
  {
    slug: 'compliance-calendar',
    label: 'Compliance Calendar',
    description: 'A year-round view of filing due dates, thresholds and advance-tax dates.',
    relatedServiceSlug: null,
  },
  {
    slug: 'pan-tan',
    label: 'PAN & TAN',
    description: 'Applying for, linking and managing your PAN and TAN.',
    relatedServiceSlug: 'pan-card-services',
  },
];

export function getTag(slug: string): Tag | undefined {
  return TAGS.find((t) => t.slug === slug);
}

export const TAG_COUNT = TAGS.length;
