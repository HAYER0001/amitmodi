// Indian tax compliance deadlines. All dates pending human verification.
// A wrong due date on a tax practice's website is worse than no date.
// verified: false on every entry — this function returns an empty array
// until a human confirms each deadline. The check is intentional; every
// entry starts unverified, so the caller always gets [] until a human
// manually confirms the dates.

export const COMPLIANCE_CALENDAR = [
  {
    id: 'gstr-1',
    formName: 'GSTR-1',
    description: 'outward supplies return',
    dueDay: 0,
    frequency: 'monthly',
    appliesTo: ['registered taxable persons'],
    statuteRef: 'Sec 119(2) CGST Act',
    verified: false,
  },
  {
    id: 'gstr-3b',
    formName: 'GSTR-3B',
    description: 'summary return and tax payment',
    dueDay: 0,
    frequency: 'monthly',
    appliesTo: ['registered taxable persons'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'gstr-9',
    formName: 'GSTR-9',
    description: 'annual return',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['registered taxable persons'],
    statuteRef: 'Sec 129(1) CGST Act',
    verified: false,
  },
  {
    id: 'gstr-9c',
    formName: 'GSTR-9C',
    description: 'reconciliation statement',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['registered taxable persons'],
    statuteRef: 'Sec 130(6) CGST Act',
    verified: false,
  },
  {
    id: 'cmp-08',
    formName: 'CMP-08',
    description: 'composition scheme statement',
    dueDay: 0,
    frequency: 'quarterly',
    appliesTo: ['composers of composition schemes'],
    statuteRef: 'Sec 7(1) Compensatory Schemes Act',
    verified: false,
  },
  {
    id: 'itr-individual',
    formName: 'ITR (individual, non-audit)',
    description: 'annual individual return for non-audit taxpayers',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['individual taxpayers', 'non-audit cases'],
    statuteRef: 'Sec 139(1) Income-tax Act',
    verified: false,
  },
  {
    id: 'itr-audit',
    formName: 'ITR (audit cases)',
    description: 'annual individual return for audit cases',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['individual taxpayers', 'audit cases'],
    statuteRef: 'Sec 139(1) Income-tax Act',
    verified: false,
  },
  {
    id: 'tax-audit-report',
    formName: 'Tax audit report (3CA/3CB-3CD)',
    description: 'annual audit report for 3CA/3CB-3CD categories',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['3CA/3CB-3CD category taxpayers'],
    statuteRef: 'Sec 107 Income-tax Act',
    verified: false,
  },
  {
    id: 'tds-payment',
    formName: 'TDS payment',
    description: 'monthly TDS payment',
    dueDay: 0,
    frequency: 'monthly',
    appliesTo: ['deductor entities'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'form-24q',
    formName: 'Form 24Q',
    description: 'TDS on salary',
    dueDay: 0,
    frequency: 'quarterly',
    appliesTo: ['deductor entities'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'form-26q',
    formName: 'Form 26Q',
    description: 'TDS on non-salary payments',
    dueDay: 0,
    frequency: 'quarterly',
    appliesTo: ['deductor entities'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'form-27q',
    formName: 'Form 27Q',
    description: 'TDS on payments to non-residents',
    dueDay: 0,
    frequency: 'quarterly',
    appliesTo: ['deductor entities', 'non-residents'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'form-16',
    formName: 'Form 16',
    description: 'salary TDS certificate to employees',
    dueDay: 0,
    frequency: 'annual',
    appliesTo: ['employers', 'employees'],
    statuteRef: 'Sec 206(4) CGST Act',
    verified: false,
  },
  {
    id: 'advance-tax-inst',
    formName: 'Advance tax instalments',
    description: 'quarterly advance tax instalments',
    dueDay: 0,
    frequency: 'quarterly',
    appliesTo: ['assessment-year taxpayers'],
    statuteRef: 'Sec 115(4) Income-tax Act',
    verified: false,
  },
] as const

/**
  Returns the next N deadlines sorted by date, skipping any entry
  where `verified` is false. Since every entry starts as unverified,
  the function returns an empty array until a human confirms the dates.

  This behaviour is intentional — unverified deadlines are never shown
  to the caller. Once a deadline has been manually verified, it will
  appear in the result.
*/
export function getUpcoming(fromDate: Date, count: number) {
  const upcoming = COMPLIANCE_CALENDAR.filter(
    (e) => (e.verified as boolean) === true
  ).sort(
    (a, b) => new Date(a.dueDay).getTime() - new Date(b.dueDay).getTime()
  );
  return upcoming.slice(0, count);
}
