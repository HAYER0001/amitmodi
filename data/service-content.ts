export const SERVICES = {
  'pan-card': {
    h1: 'PAN Card Services',
    metaTitle: 'PAN Card Services | Application & Correction',
    metaDescription: 'Complete Permanent Account Number services including new applications, error corrections, structural changes, and mandatory Aadhaar linking for compliance.',
    directAnswer: 'Permanent Account Number (PAN) is a mandatory ten-character alphanumeric identifier issued by the Indian Income Tax Department. It is legally required for individuals, corporate entities, and partnerships to file income tax returns, open bank accounts, receive taxable income, and conduct high-value financial transactions exceeding statutory limits within India.',
    whoNeedsIt: [
      'Individuals opening their first business bank account',
      'Firms needing to link PAN with Aadhaar before the deadline',
      'Trusts and NGOs establishing their legal identity',
      'Companies needing PAN data correction after a name change'
    ],
    whatsIncluded: [
      'New PAN card application processing',
      'Correction of names, dates, or structural details',
      'Aadhaar and PAN statutory linking',
      'Resolution of duplicate PAN issuance issues',
      'Delivery tracking and department follow-up'
    ],
    bodyHtml: `
      <p>Your Permanent Account Number is the foundational identifier for every financial and tax-related transaction your business undertakes. Without an active, correctly formatted PAN, your ability to operate commercially is severely restricted.</p>
      <p>We handle the precise documentation required to secure a new PAN, correct existing errors, or update structural changes for corporate entities. Our process ensures that your application is submitted without discrepancies that typically lead to departmental rejection.</p>
      <p>Furthermore, we manage the mandatory linking of PAN with Aadhaar, ensuring your PAN does not become inoperative, which would instantly trigger higher TDS rates and block your ability to file tax returns.</p>
    `,
    penaltyNote: {
      text: 'Conducting specified financial transactions without a valid PAN or failing to link PAN with Aadhaar attracts a penalty under Section 272B.',
      figure: '₹10,000 per default',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 272B of Income Tax Act',
      verified: false
    },
    intro: 'Your foundational financial identity.'
  },
  'gst-registration': {
    h1: 'GST Registration',
    metaTitle: 'GST Registration | Compliance in Check',
    metaDescription: 'Secure your Goods and Services Tax Identification Number (GSTIN). We structure your application to prevent rejections and establish your indirect tax identity.',
    directAnswer: 'Goods and Services Tax (GST) registration is a mandatory statutory requirement for Indian businesses whose annual aggregate turnover exceeds the prescribed threshold limit for their state and supply type. Registration legally authorizes a business to collect tax from customers and claim input tax credit on business purchases.',
    whoNeedsIt: [
      'Retailers crossing the annual turnover threshold', /* <!-- VERIFY --> */
      'E-commerce sellers requiring mandatory registration',
      'Service providers expanding across state borders',
      'Exporters needing to claim zero-rated supply benefits'
    ],
    whatsIncluded: [
      'Entity structure analysis for GST applicability',
      'Preparation of principal place of business documents',
      'Filing of Form GST REG-01',
      'Handling departmental queries and notices during registration',
      'Issuance of final GSTIN and Form GST REG-06'
    ],
    bodyHtml: `
      <p>Securing a Goods and Services Tax Identification Number (GSTIN) is not merely a form-filling exercise; it is the establishment of your indirect tax identity. An incorrectly structured application can lead to immediate departmental queries, physical verification demands, or outright rejection.</p>
      <p>We analyze your specific business model, state jurisdiction, and supply type to determine your exact legal requirements. We then compile, format, and submit the necessary documentation to ensure a seamless registration process.</p>
      <p>Once registered, your business gains the legal authority to collect tax, issue valid tax invoices, and most importantly, claim input tax credit on your commercial purchases, effectively protecting your operating margins.</p>
    `,
    penaltyNote: {
      text: 'Operating without a mandatory GST registration attracts a penalty equal to the tax amount evaded or the statutory minimum, whichever is higher.',
      figure: '₹10,000 or 100% of tax due',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 122 of CGST Act',
      verified: false
    },
    intro: 'Establishing your indirect tax identity.'
  },
  'entity-formation': {
    h1: 'Entity Formation & Incorporation',
    metaTitle: 'Entity Formation | Company & LLP Registration',
    metaDescription: 'Strategic entity formation services. Register your Private Limited Company, LLP, or Partnership with complete legal compliance and structural protection.',
    directAnswer: 'Entity formation is the legal process of structuring a business as a Private Limited Company, Limited Liability Partnership, or traditional Partnership. Proper incorporation limits personal liability, defines ownership rights, ensures statutory compliance with the Ministry of Corporate Affairs, and provides a formal structure for raising capital.',
    whoNeedsIt: [
      'Founders structuring a new startup for venture capital',
      'Family businesses transitioning to a formal corporate structure',
      'Partners requiring a legally binding and stamped deed',
      'Professionals establishing a Limited Liability Partnership'
    ],
    whatsIncluded: [
      'Name availability search and reservation',
      'Drafting of Memorandum and Articles of Association (MOA/AOA)',
      'Digital Signature Certificate (DSC) issuance',
      'Filing of SPICe+ forms with the Ministry of Corporate Affairs',
      'Issuance of Certificate of Incorporation, PAN, and TAN'
    ],
    bodyHtml: `
      <p>The legal structure you choose at the inception of your business determines your tax liabilities, compliance burden, and personal risk for years to come. Transitioning structures later is costly and disruptive.</p>
      <p>We guide you through the strategic selection between a Private Limited Company, a Limited Liability Partnership, or a traditional Partnership based on your specific capital requirements and operational goals. We then handle the entire incorporation process with the Ministry of Corporate Affairs or the Registrar of Firms.</p>
      <p>Our entity formation service ensures that your foundational documents—such as the MOA, AOA, or Partnership Deed—are drafted to protect your interests, prevent future disputes, and withstand rigorous due diligence by investors or auditors.</p>
    `,
    penaltyNote: {
      text: 'Failure to comply with statutory incorporation requirements or operating an unregistered entity can lead to unlimited personal liability for the founders.',
      figure: 'Unlimited personal liability',
      /* <!-- VERIFY --> */
      statuteRef: 'Companies Act / Partnership Act',
      verified: false
    },
    intro: 'Structuring your business for growth and protection.'
  },
  'income-tax-returns': {
    h1: 'Income Tax Returns (ITR)',
    metaTitle: 'Income Tax Return Filing | ITR Services',
    metaDescription: 'Accurate and timely Income Tax Return (ITR) filing for businesses and individuals. We calculate liabilities, claim deductions, and ensure compliance.',
    directAnswer: 'Filing an Income Tax Return (ITR) is a mandatory annual statutory obligation where individuals and businesses declare their income, deductions, and tax liabilities to the Income Tax Department. Filing within the prescribed statutory deadlines allows businesses to carry forward losses and claim refunds for excess tax paid.',
    whoNeedsIt: [
      'Corporate entities requiring mandatory annual filing',
      'Partnership firms declaring their yearly business income',
      'Individuals with complex capital gains or multiple income sources',
      'Businesses needing to carry forward operational losses'
    ],
    whatsIncluded: [
      'Analysis of Form 26AS and Annual Information Statement (AIS)',
      'Calculation of business income, depreciation, and capital gains',
      'Optimization of statutory deductions under Chapter VI-A',
      'Filing of the appropriate ITR form (ITR-3, ITR-4, ITR-5, ITR-6)',
      'E-verification and delivery of the ITR-V acknowledgement'
    ],
    bodyHtml: `
      <p>Filing your Income Tax Return is the final reconciliation of your financial year. It is a strict statutory requirement that demands absolute precision, as the Income Tax Department increasingly relies on automated matching of your declared income against data provided by banks and financial institutions.</p>
      <p>We manage the complete ITR filing process. We analyze your financial statements, reconcile your Annual Information Statement (AIS), and apply all eligible statutory deductions. Our objective is to calculate your exact liability without triggering algorithmic scrutiny flags.</p>
      <p>Timely filing is critical. Beyond avoiding penalties, filing your ITR before the statutory deadline is the only way your business can legally carry forward operational losses to offset profits in subsequent financial years.</p>
    `,
    penaltyNote: {
      text: 'Filing the Income Tax Return after the statutory due date attracts a mandatory late filing fee and interest on unpaid tax.',
      figure: 'Up to ₹5,000 late fee',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 234F of Income Tax Act',
      verified: false
    },
    intro: 'Reconciling your financial year with precision.'
  },
  'tds-returns': {
    h1: 'TDS Returns',
    metaTitle: 'TDS Return Filing | Tax Deducted at Source',
    metaDescription: 'Quarterly Tax Deducted at Source (TDS) return filing. We reconcile deductions, issue Form 16/16A, and prevent disallowance of your business expenses.',
    directAnswer: 'Tax Deducted at Source (TDS) returns are mandatory quarterly filings required from entities that deduct tax while making specified payments like salary, rent, or professional fees. These filings reconcile the deducted amounts with the government portal, ensuring the payee successfully receives tax credit in their Form 26AS.',
    whoNeedsIt: [
      'Companies deducting tax on employee salaries',
      'Businesses paying professional fees or contractor charges',
      'Tenants paying commercial rent above the statutory threshold', /* <!-- VERIFY --> */
      'Entities required to issue Form 16 or Form 16A to payees'
    ],
    whatsIncluded: [
      'Calculation of applicable TDS rates for various payment categories',
      'Generation of monthly TDS payment challans',
      'Preparation and filing of quarterly returns (Form 24Q, 26Q)',
      'Generation and issuance of TDS certificates (Form 16/16A)',
      'Correction of default notices and mismatch errors'
    ],
    bodyHtml: `
      <p>Tax Deducted at Source (TDS) represents a critical compliance burden for businesses. You are legally acting as a tax collection agent for the government. Failing to deduct TDS, or failing to deposit it and file the return, has severe cascading effects on your own tax liabilities.</p>
      <p>We manage your entire TDS compliance cycle. We calculate the correct deduction rates, generate the monthly deposit challans, and meticulously file the quarterly returns. We ensure that every PAN is validated so that your vendors and employees receive their rightful tax credits.</p>
      <p>Crucially, accurate TDS compliance protects your business. If you fail to deduct or remit TDS, the Income Tax Department will disallow the underlying business expense, artificially inflating your taxable profit and resulting in a massive, unexpected tax demand.</p>
    `,
    penaltyNote: {
      text: 'Failure to file TDS returns on time attracts a daily late fee until the failure continues, up to the maximum TDS amount.',
      figure: '₹200 per day',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 234E of Income Tax Act',
      verified: false
    },
    intro: 'Managing your statutory deduction obligations.'
  },
  'gst-returns': {
    h1: 'GST Returns',
    metaTitle: 'GST Return Filing | GSTR-1, GSTR-3B & GSTR-9',
    metaDescription: 'Monthly and annual Goods and Services Tax (GST) return filing. We reconcile your sales and purchases to safeguard your input tax credit.',
    directAnswer: 'GST returns are mandatory periodic filings that document a registered business\'s sales, purchases, and tax liabilities. Accurate filing of forms like GSTR-1 and GSTR-3B ensures compliance with the Goods and Services Tax Act, prevents the blocking of e-way bills, and safeguards the seamless flow of input tax credit.',
    whoNeedsIt: [
      'Registered businesses required to file monthly GSTR-1 and GSTR-3B',
      'Taxpayers needing to reconcile GSTR-2B to claim input tax credit',
      'Entities required to file the GSTR-9 Annual Return',
      'Composition scheme dealers filing quarterly statements'
    ],
    whatsIncluded: [
      'Reconciliation of sales invoices for GSTR-1',
      'Matching of purchase data with GSTR-2B for ITC claims',
      'Calculation of net tax liability and filing of GSTR-3B',
      'Preparation and filing of the GSTR-9 Annual Return',
      'Resolution of ITC mismatch notices'
    ],
    bodyHtml: `
      <p>The GST framework operates on a continuous, data-heavy cycle. Your outward supplies must perfectly match the input tax credit claims of your buyers, and your own ITC claims depend entirely on the compliance of your vendors. Any mismatch triggers automated notices.</p>
      <p>We execute your GST compliance with precision. We process your sales registers, rigorously reconcile your purchase data against GSTR-2B, and file your GSTR-1 and GSTR-3B returns before the statutory deadlines. Our process is designed to maximize your eligible input tax credit while eliminating the risk of erroneous claims.</p>
      <p>Consistent, accurate GST filing is not just about avoiding penalties; it is about maintaining your operational liquidity. Late filings can lead to the freezing of your e-way bill generation, effectively halting your ability to transport goods and conduct business.</p>
    `,
    penaltyNote: {
      text: 'Late filing of standard GST returns attracts a daily late fee, alongside penal interest on any delayed payment of tax liabilities.',
      figure: '₹50 per day (₹20 for Nil returns)',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 47 of CGST Act',
      verified: false
    },
    intro: 'Safeguarding your input tax credit through precise filing.'
  },
  'tax-appeals': {
    h1: 'Tax Appeals & Litigation',
    metaTitle: 'Tax Appeals | Dispute Resolution & Litigation',
    metaDescription: 'Formal representation and strategic defense against unjust tax assessments. We draft grounds of appeal and represent you before appellate authorities.',
    directAnswer: 'A tax appeal is a formal statutory procedure to contest an unjust or erroneous assessment order issued by the Income Tax Department. By filing a structured appeal before the Commissioner of Income Tax (Appeals), taxpayers can legally challenge arbitrary tax demands, secure a stay of demand, and defend their revenue.',
    whoNeedsIt: [
      'Businesses facing a massive demand following a scrutiny assessment',
      'Taxpayers whose legitimate exemptions or deductions were disallowed',
      'Entities receiving an ex parte best judgement assessment order',
      'Individuals needing to file an appeal before the 30-day deadline expires' /* <!-- VERIFY --> */
    ],
    whatsIncluded: [
      'Detailed analysis of the assessment order and statutory notices',
      'Drafting of the Statement of Facts and Grounds of Appeal',
      'Filing of the appeal electronically in Form 35',
      'Application for stay of demand during the pendency of the appeal',
      'Representation before the CIT(A) and Tax Tribunals'
    ],
    bodyHtml: `
      <p>Receiving an adverse assessment order with a massive tax demand is a critical threat to your business. Often, these orders are the result of algorithmic mismatches, disallowed expenses, or a failure to respond to initial notices. You have the statutory right to challenge these demands, but the window to act is strictly limited.</p>
      <p>We provide strategic, evidence-backed tax litigation services. We analyze the assessing officer's order, identify legal and factual errors, and draft a robust Statement of Facts and Grounds of Appeal. We then file the appeal before the Commissioner of Income Tax (Appeals) within the mandatory 30-day timeframe.</p>
      <p>Our objective is to secure a stay of the tax demand and systematically dismantle the unjust assessment during appellate hearings, relying on statutory provisions, judicial precedents, and immaculate documentation to defend your financial position.</p>
    `,
    penaltyNote: {
      text: 'Failing to file an appeal within the statutory 30-day window makes the assessment order final, allowing the department to initiate coercive recovery proceedings.',
      figure: '100% of demanded tax becomes payable',
      /* <!-- VERIFY --> */
      statuteRef: 'Section 249 of Income Tax Act',
      verified: false
    },
    intro: 'Strategic defense against unjust tax assessments.'
  },
  'import-export-licence': {
    h1: 'Import/Export Licence (IEC)',
    metaTitle: 'Import Export Code (IEC) Registration',
    metaDescription: 'Obtain your Import Exporter Code (IEC) from the DGFT. We handle the documentation and registration required to trade internationally and clear customs.',
    directAnswer: 'An Importer Exporter Code (IEC) is a mandatory ten-digit business identification number issued by the Directorate General of Foreign Trade (DGFT). It is legally required for any commercial entity in India to import goods, export products, clear customs, or receive benefits under the Foreign Trade Policy.',
    whoNeedsIt: [
      'Manufacturers expanding their sales to international markets',
      'Traders importing commercial goods for domestic resale',
      'Service providers exporting software or consultancy services',
      'Businesses seeking benefits under government export schemes'
    ],
    whatsIncluded: [
      'Preparation of required KYC and bank documentation',
      'Filing of the IEC application on the DGFT portal',
      'Coordination for digital signature and fee payment',
      'Issuance of the final electronic IEC certificate',
      'Guidance on linking the IEC with ICEGATE for customs clearance'
    ],
    bodyHtml: `
      <p>International trade requires strict adherence to customs and foreign trade regulations. Your Importer Exporter Code (IEC) is the fundamental license that permits your business to engage in cross-border commerce. Without it, your shipments will be permanently halted at customs.</p>
      <p>We streamline the process of obtaining your IEC from the Directorate General of Foreign Trade (DGFT). We ensure your application is supported by the correct banking and identity documents, preventing unnecessary delays or rejections by the authorities.</p>
      <p>Once your IEC is issued, it serves as a lifetime registration. We also provide initial guidance on how to integrate this code with the customs ICEGATE portal, ensuring your business is fully prepared to execute its first international transaction smoothly.</p>
    `,
    penaltyNote: {
      text: 'Attempting to import or export commercial goods without a valid IEC results in the immediate confiscation of the shipment by customs authorities.',
      figure: 'Confiscation of goods',
      /* <!-- VERIFY --> */
      statuteRef: 'Foreign Trade (Development and Regulation) Act',
      verified: false
    },
    intro: 'Your legal gateway to international commerce.'
  }
};
