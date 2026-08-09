// A credential renders ONLY when verified is true AND registrationNo is present.
// Displaying an accreditation logo the practice is not entitled to display is a
// legal exposure, not a design decision.

export type Credential = {
  id: string;
  body: string;
  abbreviation: string;
  registrationNo: string | null;
  logoAsset: string | null;
  verified: boolean;
};

export const CREDENTIALS: Credential[] = [
  {
    id: 'icai',
    body: 'Institute of Chartered Accountants of India',
    abbreviation: 'ICAI',
    registrationNo: null,
    logoAsset: null,
    verified: false,
  },
  {
    id: 'gstn',
    body: 'Goods and Services Tax Network',
    abbreviation: 'GSTN',
    registrationNo: null,
    logoAsset: null,
    verified: false,
  },
  {
    id: 'msme',
    body: 'Ministry of Micro, Small and Medium Enterprises',
    abbreviation: 'MSME / Udyam',
    registrationNo: null,
    logoAsset: null,
    verified: false,
  },
  {
    id: 'dgft',
    body: 'Directorate General of Foreign Trade',
    abbreviation: 'DGFT',
    registrationNo: null,
    logoAsset: null,
    verified: false,
  },
  {
    id: 'itr-intermediary',
    body: 'Income Tax Department e-Return Intermediary',
    abbreviation: 'e-Return Intermediary',
    registrationNo: null,
    logoAsset: null,
    verified: false,
  },
] as const;

// Change this to 'standard' only after the guardrail checkbox in
// BRAND-FACTS.md has been ticked by a human.
export const ADVERTISING_MODE: 'conservative' | 'standard' = 'conservative';
