/*
 * types/content.ts — strict content types, Phase 3 (Agent A)
 *
 * The `verified: boolean` field is load-bearing:
 *  - in development, unverified FAQs/figures render with a visible
 *    "pending verification" state;
 *  - in production builds they are omitted entirely (see lib/content.ts
 *    `verifiedOnly`).
 * Never make these fields optional — a fact you have not checked is
 * either marked unverified or absent, never silently assumed.
 */

/** Government vs agency fees, in INR. 'on-request' is a real, quotable value. */
export type Money = {
  govtFee: number | "on-request" | null;
  professionalFee: number | "on-request" | null;
  currency: "INR";
};

/** Working-day turnaround. `note` carries verification status when TBD. */
export type Turnaround = {
  minDays: number;
  maxDays: number;
  note?: string;
};

/** A KYC / registration document a client must supply. */
export type DocumentRequirement = {
  id: string;
  label: string;
  appliesTo: string[];
  mandatory: boolean;
  note?: string;
};

/** A Q&A entry. `verified: false` = hidden from production, flagged in dev. */
export type FAQ = {
  id: string;
  question: string;
  answer: string;
  verified: boolean;
};

/** One step in the client journey of a service. */
export type ProcessStep = {
  order: number;
  title: string;
  description: string;
  owner: "client" | "firm" | "government";
  durationDays: number;
};

export type ServiceCategory = "registration" | "filing" | "litigation" | "trade";

export type IntentStage = "problem-aware" | "solution-aware" | "ready-to-hire";

/** The eight service lines from buisness.md. */
export type Service = {
  slug: string;
  name: string;
  shortName: string;
  category: ServiceCategory;
  oneLiner: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intentStage: IntentStage;
  whoNeedsIt: string[];
  pricing: Money;
  turnaround: Turnaround;
  documents: DocumentRequirement[];
  process: ProcessStep[];
  faqs: FAQ[];
  /** The "what happens if they do nothing" risk paragraph. */
  penalties?: string;
  relatedSlugs: string[];
  statuteRefs: string[];
};