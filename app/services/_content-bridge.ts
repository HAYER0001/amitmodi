import { SERVICES as SERVICE_CONTENT } from "@/data/service-content";

/*
 * app/services/_content-bridge.ts — canonical slug → long-form content.
 *
 * Agent B's data/service-content.ts keys diverge from the canonical
 * data/services.ts slugs (e.g. 'pan-card' vs 'pan-card-services', and B
 * splits ITR/TDS while the registry combines them). This bridge resolves a
 * canonical slug to its content entry, preferring a direct key hit first so
 * it keeps working the moment B reconciles the keys to the registry.
 */

export type PenaltyNote = {
  text: string;
  figure?: string;
  statuteRef?: string;
  verified?: boolean;
};

export type ServiceContent = {
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  directAnswer?: string;
  whoNeedsIt?: string[];
  whatsIncluded?: string[];
  bodyHtml?: string;
  penaltyNote?: PenaltyNote;
  intro?: string;
};

export const CONTENT_ALIAS: Record<string, string> = {
  "pan-card-services": "pan-card",
  "gst-registration": "gst-registration",
  "entity-formation": "entity-formation",
  "income-tax-tds-returns": "income-tax-returns",
  "gst-returns-filing": "gst-returns",
  "income-tax-appeals": "tax-appeals",
  "gst-appeals": "tax-appeals",
  "import-export-licence": "import-export-licence",
};

export const CATEGORY_LABEL: Record<string, string> = {
  registration: "Registration",
  filing: "Filing & Returns",
  litigation: "Litigation & Appeals",
  trade: "Trade & Cross-Border",
};

export function getContent(slug: string): ServiceContent | null {
  const all = SERVICE_CONTENT as unknown as Record<string, ServiceContent>;
  return all[slug] ?? all[CONTENT_ALIAS[slug] ?? ""] ?? null;
}
