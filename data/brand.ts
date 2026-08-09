// Business facts. Fill ONLY from BRAND-FACTS.md — never guess a value.
// 'TBD' and null are meaningful: consumers must render nothing, not a placeholder.
//
// Confirmed 2026-08-09: trading name, address, phone.
// Everything still marked 'TBD' below is genuinely unknown and stays invisible
// on the site until someone confirms it.

export const BRAND = {
  tradingName: 'Amit Modi & Co.',
  legalName: 'TBD',
  entityType: 'TBD',
  foundedYear: 'TBD',
  gstin: 'TBD',
  pan: 'TBD',
  domain: 'TBD',

  // Short factual descriptor for the site. Deliberately NOT the Google Business
  // Profile title ("The Best Tax & GST Advisor Advocate") — see the advertising
  // note in BRAND-FACTS.md. "Best" is an unverifiable superlative and is exactly
  // the kind of claim advocate advertising rules restrict.
  descriptor: 'Tax, GST and compliance practice',

  principal: {
    name: 'Amit Modi',            // inferred from the firm name — confirm spelling
    designation: 'Advocate',      // CONFIRM: "Advocate" appears in the GBP title
    membershipNo: 'TBD',          // Bar Council enrolment number
    yearsPractice: 'TBD',
    qualifications: 'TBD',
    barAdmissions: 'TBD',
    photo: null,
    linkedin: 'TBD',
    specialisations: [],
    history: [],
  },

  address: {
    line1: 'Modi Complex, Near Mosque',
    line2: 'Ward No. 40',
    city: 'Suratgarh',
    state: 'Rajasthan',
    pin: '335804',
    country: 'India',
    lat: null,                    // needed before LocalBusiness schema will validate
    lng: null,
  },

  contact: {
    // E.164 for tel: links and schema. The leading 0 in "094145 04617" is a
    // domestic trunk prefix and must not appear in an international number.
    phone: '+919414504617',
    phoneDisplay: '+91 94145 04617',
    whatsapp: 'TBD',              // confirm whether this number takes WhatsApp
    email: 'TBD',
    gbpUrl: 'TBD',
  },

  hours: [
    { day: 'Monday',    opens: 'TBD', closes: 'TBD' },
    { day: 'Tuesday',   opens: 'TBD', closes: 'TBD' },
    { day: 'Wednesday', opens: 'TBD', closes: 'TBD' },
    { day: 'Thursday',  opens: 'TBD', closes: 'TBD' },
    { day: 'Friday',    opens: 'TBD', closes: 'TBD' },
    { day: 'Saturday',  opens: 'TBD', closes: 'TBD' },
    { day: 'Sunday',    opens: 'TBD', closes: 'TBD' },
  ],

  serviceArea: {
    primaryCity: 'Suratgarh',
    cities: [],                   // add only cities you can genuinely service
    states: ['Rajasthan'],
  },

  proof: {
    clientsServed: null,
    returnsFiled: null,
    appealsHandled: null,
  },
} as const;

/** True when a field carries a real value rather than the 'TBD' sentinel. */
export function hasFact(value: string | number | null | undefined): boolean {
  return value !== null && value !== undefined && value !== '' && value !== 'TBD';
}
