export const PROBLEM = {
  headline: "The Cost of Reacting Instead of Planning",
  body: "Most businesses treat compliance as a reaction. A notice arrives in the mail, and everything stops. A deadline passes, and penalties quietly compound. By the time you realize the error, the cost to fix it is triple the cost of doing it right the first time. We replace this cycle with structure.",
  consequences: [
    {
      trigger: "Late GST return filing",
      consequence: "Attracts a late fee under Section 47 along with interest on the delayed payment of tax.",
      figure: "₹50 per day", /* <!-- VERIFY --> */
      statuteRef: "Section 47 of CGST Act",
      verified: false
    },
    {
      trigger: "Missed ITR deadline",
      consequence: "Results in a late filing fee and the permanent loss of the ability to carry forward business losses to offset future profits.",
      figure: "Up to ₹5,000", /* <!-- VERIFY --> */
      statuteRef: "Section 234F of Income Tax Act",
      verified: false
    },
    {
      trigger: "TDS non-deduction",
      consequence: "The specific business expense will be disallowed, artificially inflating your profit and resulting in a higher income tax liability.",
      figure: "30% of expense disallowed", /* <!-- VERIFY --> */
      statuteRef: "Section 40(a)(ia) of Income Tax Act",
      verified: false
    },
    {
      trigger: "Non-response to departmental notice",
      consequence: "The assessing officer may pass an ex parte best judgement assessment order, making the demanded tax final and payable immediately.",
      figure: "100% of tax due", /* <!-- VERIFY --> */
      statuteRef: "Section 144 of Income Tax Act",
      verified: false
    }
  ]
};

export const PROCESS = [
  {
    step: 1,
    title: "The Initial Audit",
    description: "We review your current compliance status, existing filings, and identify any immediate exposure to penalties or notices.",
    durationDays: 1 /* <!-- VERIFY --> */
  },
  {
    step: 2,
    title: "Data Collection & Blueprinting",
    description: "We list exactly what needs to be filed and provide you with a secure portal to upload your raw data.",
    durationDays: 2 /* <!-- VERIFY --> */
  },
  {
    step: 3,
    title: "Calculation & Reconciliation",
    description: "We process your ledgers, reconcile input tax credit mismatches, and calculate your exact statutory liabilities before the deadline.",
    durationDays: 3 /* <!-- VERIFY --> */
  },
  {
    step: 4,
    title: "Filing & Submission",
    description: "We format the required forms and securely submit your tax returns to the government portal.",
    durationDays: 1 /* <!-- VERIFY --> */
  },
  {
    step: 5,
    title: "Archiving & Reporting",
    description: "We deliver the filed acknowledgement receipts and challans to you for your permanent business records.",
    durationDays: 1 /* <!-- VERIFY --> */
  }
];

export const PROOF = {
  headline: "Operating on Precision and History",
  // Structure only: exact numbers are read from BRAND-FACTS at render time
  metrics: [
    { key: 'entitiesRegistered', label: 'Entities Registered' },
    { key: 'returnsFiled', label: 'Returns Filed' },
    { key: 'yearsOfPractice', label: 'Years of Practice' },
    { key: 'appealsRepresented', label: 'Appeals Represented' }
  ]
};

export const CLOSING = {
  headline: "Do not wait for the deadline.",
  body: "Let us review your compliance position today. We map your obligations and keep the authorities satisfied so you can focus on growth.",
  ctaLabel: "Request an Audit",
  responseTimePromise: "We will review your request and call you back within one business day." /* <!-- VERIFY --> */
};

export const HOMEPAGE_FAQS = [
  {
    question: "What does the first consultation cost?",
    answer: "Our initial consultation is purely diagnostic and is offered at no cost. During this 30-minute meeting, we evaluate your current tax compliance status, identify any immediate filing exposures, and provide a clear roadmap of the statutory requirements your specific business entity must fulfill."
  },
  {
    question: "How fast can you register a GST number?",
    answer: "Once you provide the complete set of required KYC and business address documents, we typically file the GST registration application within one business day. The GST department usually processes the application and issues the GST Identification Number (GSTIN) within 7 working days. /* <!-- VERIFY --> */"
  },
  {
    question: "Do you work with clients outside your city?",
    answer: "Yes, we provide end-to-end tax compliance and advisory services to businesses across India. Because the Income Tax and GST portals are entirely digital, we manage all data collection securely online and can represent your tax matters effectively regardless of your physical location."
  },
  {
    question: "What do you need from me to start?",
    answer: "We require your basic business incorporation documents, previous year's filed income tax returns, current GST certificates, and access to your recent accounting ledgers. Once you contact us, we provide a precise, customized checklist of documents needed based on your specific legal entity structure."
  },
  {
    question: "What happens if I have already received a notice?",
    answer: "If you have received a tax notice, time is critical. You must share the complete notice document with us immediately. We will analyze the assessing officer's demands, determine the legal grounds for a defense, and draft a formal, evidence-backed response within the statutory timeline."
  },
  {
    question: "Do you handle both filing and appeals?",
    answer: "Yes, we offer comprehensive tax defense. We manage your regular monthly and annual statutory filings to prevent issues from arising, and we also provide formal representation before the Commissioner of Appeals and tax tribunals if you receive an unjust assessment order or demand."
  },
  {
    question: "How do you charge?",
    answer: "We charge fixed professional fees for standardized compliance tasks like GST registration, entity formation, and periodic return filings. For complex matters such as tax appeals, scrutiny assessments, and retrospective audits, we provide a customized, transparent fee estimate based on the scope of work."
  },
  {
    question: "Who will actually be handling my file?",
    answer: "Your case is managed exclusively by our core team of qualified tax professionals. We do not outsource your confidential financial data to third-party data entry agencies. A dedicated consultant is assigned to your business to ensure continuity and precise adherence to all deadlines."
  }
];
