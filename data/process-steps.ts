// Process steps are indicative and must be confirmed against the current
// departmental requirements before publication. See Phase 20 VERIFY sweep.
// durationDays: 0 with a // VERIFY comment is used wherever the exact
// timeline is not yet confirmed.

export const PROCESS_BY_SERVICE = {
  'pan-card-services': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of PAN card services with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the PAN application.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the PAN application.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the relevant portal', description: 'You will submit the completed PAN application on the relevant portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the PAN application.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the PAN card or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Ongoing compliance handover', description: 'You will retain a firm for ongoing compliance monitoring.', owner: 'firm', durationDays: 0 },
  ],

  'gst-registration': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of GST registration with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the GST registration.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the GST application.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the GST portal', description: 'You will submit the completed GST registration on the GST portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the GST registration application.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the GST registration certificate or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Ongoing compliance handover', description: 'You will retain a firm for ongoing GST compliance monitoring.', owner: 'firm', durationDays: 0 },
  ],

  'entity-formation': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of entity formation with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for entity formation.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the entity formation application.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the relevant portal', description: 'You will submit the completed entity formation application on the relevant portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the entity formation application.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the entity registration certificate or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Ongoing compliance handover', description: 'You will retain a firm for ongoing entity compliance monitoring.', owner: 'firm', durationDays: 0 },
  ],

  'income-tax-tds-returns': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of income tax and TDS returns filing with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the income tax and TDS returns filing.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the income tax return.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the relevant portal', description: 'You will submit the completed income tax return on the relevant portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the income tax return filing.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the income tax return certificate or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Ongoing compliance handover', description: 'You will retain a firm for ongoing income tax and TDS compliance monitoring.', owner: 'firm', durationDays: 0 },
  ],

  'gst-returns-filing': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of GST returns filing with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the GST returns filing.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the GST returns filing.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the GST portal', description: 'You will submit the completed GST returns filing on the GST portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the GST returns filing.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the GST returns filing certificate or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Ongoing compliance handover', description: 'You will retain a firm for ongoing GST returns filing compliance monitoring.', owner: 'firm', durationDays: 0 },
  ],

  'income-tax-appeals': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of income tax appeals with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the income tax appeal.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Grounds of appeal drafting', description: 'Your team will draft the grounds of appeal for the assessment order.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Statement of facts preparation', description: 'Your team will prepare the statement of facts for the appeal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Appeal filing with fee payment', description: 'You will file the appeal with the required fee payment.', owner: 'firm', durationDays: 0 },
    { order: 6, title: 'Hearing representation', description: 'You will represent the case before the tax authority.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the outcome of the appeal or an acknowledgement from the authority.', owner: 'firm', durationDays: 0 },
  ],

  'gst-appeals': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of GST appeals with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the GST appeal.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Grounds of appeal drafting', description: 'Your team will draft the grounds of appeal for the order appealed against.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Statement of facts preparation', description: 'Your team will prepare the statement of facts for the appeal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Appeal filing with fee payment', description: 'You will file the appeal with the required fee payment.', owner: 'firm', durationDays: 0 },
    { order: 6, title: 'Hearing representation', description: 'You will represent the case before the GST authority.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the outcome of the appeal or an acknowledgement from the authority.', owner: 'firm', durationDays: 0 },
  ],

  'import-export-licence': [
    { order: 1, title: 'Initial consultation and scope confirmation', description: 'You will discuss the scope of import/export licence with your consultant.', owner: 'firm', durationDays: 0 },
    { order: 2, title: 'Document collection from the client', description: 'You will gather all required documents for the import/export licence.', owner: 'client', durationDays: 0 },
    { order: 3, title: 'Verification and preparation of the application', description: 'Your team will verify the collected documents and prepare the import/export licence application.', owner: 'firm', durationDays: 0 },
    { order: 4, title: 'Filing / submission on the relevant portal', description: 'You will submit the completed import/export licence on the relevant portal.', owner: 'firm', durationDays: 0 },
    { order: 5, title: 'Departmental processing, queries or verification', description: 'The department will process and verify the import/export licence application.', owner: 'government', durationDays: 0 },
    { order: 6, title: 'Bank certificate / cancelled cheque validation', description: 'Your team will validate the bank certificate or cancelled cheque bearing the entity name.', owner: 'firm', durationDays: 0 },
    { order: 7, title: 'Certificate / acknowledgement delivered to the client', description: 'You will receive the import/export licence certificate or an acknowledgement from the department.', owner: 'firm', durationDays: 0 },
  ],
};
