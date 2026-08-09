// DO NOT INVENT VALUES. Fill from ../../BRAND-FACTS.md only.
// 'TBD' and null are meaningful: consumers must render nothing, not a placeholder.

export const BRAND = {
  tradingName: 'TBD',
  legalName: 'TBD',
  entityType: 'TBD',
  foundedYear: 'TBD',
  gstin: 'TBD',
  pan: 'TBD',
  domain: 'TBD',
  principal: {
    name: 'TBD',
    designation: 'TBD',
    membershipNo: 'TBD',
    yearsPractice: 'TBD',
    qualifications: 'TBD',
    linkedin: 'TBD',
  },
  address: {
    line1: 'TBD',
    line2: 'TBD',
    city: 'TBD',
    state: 'TBD',
    pin: 'TBD',
    country: 'India',
    lat: null,
    lng: null,
  },
  contact: {
    phone: 'TBD',
    whatsapp: 'TBD',
    email: 'TBD',
    gbpUrl: 'TBD',
  },
  hours: [
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
    { day: 'TBD', opens: 'TBD', closes: 'TBD' },
  ],
  serviceArea: {
    primaryCity: 'TBD',
    cities: [],
    states: [],
  },
  proof: {
    clientsServed: null,
    returnsFiled: null,
    appealsHandled: null,
  },
} as const;
