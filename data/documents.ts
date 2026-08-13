// Document lists are indicative and must be confirmed against the current
// departmental requirements before publication. See Phase 20 VERIFY sweep.

export interface DocumentRequirement {
  id: string;
  label: string;
  appliesTo: string[];
  mandatory: boolean;
  note?: string;
}

export const DOCUMENTS_BY_SERVICE: Record<
  string,
  DocumentRequirement[]
> = {
  'pan-card-services': [
    {
      id: 'doc-identity',
      label: 'Proof of identity',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-address',
      label: 'Proof of address',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-date-of-birth',
      label: 'Proof of date of birth',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-photographs',
      label: 'Passport-size photographs',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-signature',
      label: 'Signature specimen',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-company',
      label: 'Certificate of incorporation or partnership deed',
      appliesTo: ['Company', 'Partnership Firm'],
      mandatory: false,
      note: 'Required only for company or firm applicants — not for individuals.',
    },
  ],

  'gst-registration': [
    {
      id: 'doc-pan',
      label: 'PAN of applicant',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-aadhaar',
      label: 'Aadhaar of authorised signatory',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-business-registration',
      label: 'Proof of business registration or incorporation certificate',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-id-proof',
      label: 'Identity and address proof of promoters/directors with photographs',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-business-address',
      label: 'Address proof of place of business',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-bank-statement',
      label: 'Bank account statement or cancelled cheque',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-dsc',
      label: 'Digital signature (DSC) where applicable',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required only when the applicant opts for DSC.',
    },
    {
      id: 'doc-authorisation',
      label: 'Letter of authorisation / board resolution for authorised signatory',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'entity-formation': [
    {
      id: 'doc-pan',
      label: 'PAN and identity proof of each partner/trustee/member',
      appliesTo: ['Individual', 'Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-address',
      label: 'Address proof of each',
      appliesTo: ['Individual', 'Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-photographs',
      label: 'Passport-size photographs',
      appliesTo: ['Individual', 'Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-registered-office',
      label: 'Proof of registered office address',
      appliesTo: ['Individual', 'Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-noc',
      label: 'NOC from the property owner',
      appliesTo: ['Company', 'Partnership Firm'],
      mandatory: false,
      note: 'Required only for property-related registration.',
    },
    {
      id: 'doc-draft-deed',
      label: 'Draft deed (partnership deed / trust deed / society memorandum and rules)',
      appliesTo: ['Partnership Firm', 'Trust', 'Society'],
      mandatory: true,
    },
    {
      id: 'doc-subscriber-sig',
      label: 'Subscriber signatures page',
      appliesTo: ['Partnership Firm', 'Trust', 'Society'],
      mandatory: true,
    },
  ],

  'income-tax-tds-returns': [
    {
      id: 'doc-pan',
      label: 'PAN',
      appliesTo: ['Individual', 'Hindu Undivided Family'],
      mandatory: true,
    },
    {
      id: 'doc-form16',
      label: 'Form 16 / Form 16A',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-bank-statements',
      label: 'Bank statements for the year',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-form26as',
      label: 'Form 26AS and AIS download',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-investment',
      label: 'Investment and deduction proofs',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required for long-term capital gain scenarios.',
    },
    {
      id: 'doc-capital-gains',
      label: 'Capital gains statements',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required for short-term/long-term capital gain declarations.',
    },
    {
      id: 'doc-rental-income',
      label: 'Rental income details',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required for rental income tax declarations.',
    },
    {
      id: 'doc-previous-return',
      label: 'Previous year\'s return copy',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required to verify consistency with prior-year filings.',
    },
    {
      id: 'doc-tan',
      label: 'TAN (for TDS returns)',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-challan',
      label: 'Challan details of tax paid',
      appliesTo: ['Individual'],
      mandatory: false,
      note: 'Required where tax has been paid under the advance tax or self-assessment.',
    },
  ],

  'gst-returns-filing': [
    {
      id: 'doc-sales-register',
      label: 'Sales register / outward supply invoices',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-purchase-register',
      label: 'Purchase register / inward supply invoices',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-debit-credit',
      label: 'Debit and credit notes',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-e-way-bill',
      label: 'e-way bill data',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-hsn',
      label: 'HSN summary',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-previous-returns',
      label: 'Previous period\'s returns',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-icr',
      label: 'ITC reconciliation with GSTR-2B',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-portal-credentials',
      label: 'GST portal credentials',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'income-tax-appeals': [
    {
      id: 'doc-assessment-order',
      label: 'Copy of the assessment order',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-notice-demand',
      label: 'Notice of demand',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-return',
      label: 'The return filed for that year',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-submissions',
      label: 'Submissions and evidence filed during assessment',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-grounds',
      label: 'Grounds of appeal',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-statement-of-facts',
      label: 'Statement of facts',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-fee-payment',
      label: 'Proof of payment of the appeal fee',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-authorisation',
      label: 'The authorisation in favour of the representative',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'gst-appeals': [
    {
      id: 'doc-order-appealed',
      label: 'Copy of the order appealed against',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-show-cause',
      label: 'The show cause notice and reply',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-grounds',
      label: 'Grounds of appeal',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-statement-of-facts',
      label: 'Statement of facts',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-pre-deposit',
      label: 'Proof of pre-deposit',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-returns',
      label: 'Relevant returns and reconciliations',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-authorisation',
      label: 'The authorisation',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'import-export-licence': [
    {
      id: 'doc-pan',
      label: 'PAN',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-aadhaar',
      label: 'Aadhaar',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-incorporation',
      label: 'Certificate of incorporation or partnership deed',
      appliesTo: ['Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-bank-certificate',
      label: 'Bank certificate or cancelled cheque bearing the entity name',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-address',
      label: 'Address proof of the business premises',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-dsc',
      label: 'Digital signature',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-products',
      label: 'The list of products intended to be imported or exported',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'gst-notice-response': [
    {
      id: 'doc-notice',
      label: 'Copy of the GST notice (DRC-01 or query)',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-returns',
      label: 'Relevant GST returns for the period in question',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-invoices',
      label: 'Invoices and registers covering the disputed supplies',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-reconciliation',
      label: 'ITC and sales reconciliations for the period',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-authorisation',
      label: 'Authorisation in favour of the representative',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'global-trader-onboarding': [
    {
      id: 'doc-pan',
      label: 'PAN of the applicant entity',
      appliesTo: ['Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-aadhaar',
      label: 'Aadhaar of the signatory',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-incorporation',
      label: 'Certificate of incorporation or partnership deed',
      appliesTo: ['Company', 'Partnership Firm'],
      mandatory: true,
    },
    {
      id: 'doc-bank-certificate',
      label: 'Bank certificate or cancelled cheque bearing the entity name',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-address',
      label: 'Address proof of the business premises',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-products',
      label: 'The list of products or services to be exported',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-dsc',
      label: 'Digital signature certificate of the signatory',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],

  'ngo-trust-compliance': [
    {
      id: 'doc-deed',
      label: 'Trust deed or society memorandum, rules and regulations',
      appliesTo: ['Trust', 'Society'],
      mandatory: true,
    },
    {
      id: 'doc-registration',
      label: 'Registration certificate of the trust or society',
      appliesTo: ['Trust', 'Society'],
      mandatory: true,
    },
    {
      id: 'doc-pan',
      label: 'PAN of the trust and of the trustees',
      appliesTo: ['Trust', 'Society'],
      mandatory: true,
    },
    {
      id: 'doc-accounts',
      label: 'Audited accounts where available',
      appliesTo: ['Trust', 'Society'],
      mandatory: false,
      note: 'Required where the trust has already commenced activities.',
    },
    {
      id: 'doc-objects',
      label: 'Statement of objects and activities',
      appliesTo: ['Trust', 'Society'],
      mandatory: true,
    },
    {
      id: 'doc-authorisation',
      label: 'Authorisation from the trustees for the application',
      appliesTo: ['Trust', 'Society'],
      mandatory: true,
    },
  ],

  'pre-notice-health-check': [
    {
      id: 'doc-returns',
      label: 'Filed GST and income tax returns for the review period',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-gstr2b',
      label: 'GSTR-2B statements for the review period',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-26as',
      label: 'Form 26AS and AIS downloads',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-registers',
      label: 'Sales and purchase registers',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-tds',
      label: 'TDS ledger and challan records',
      appliesTo: ['Individual'],
      mandatory: true,
    },
    {
      id: 'doc-portal',
      label: 'GST and income tax portal access or exports',
      appliesTo: ['Individual'],
      mandatory: true,
    },
  ],
};
