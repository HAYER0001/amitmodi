import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getPublishedTerms } from "@/lib/glossary";
import GlossaryIndex from "./_GlossaryIndex";

/*
 * app/glossary/page.tsx — the A–Z glossary index (Phase 15, Agent A).
 *
 * Every term is rendered on the server in this page's HTML, grouped by
 * letter. The client GlossaryIndex only hides and shows those entries as the
 * visitor types — it never fetches. Terms are crawlable because they are in
 * the markup, not because a search endpoint returns them.
 */

export const metadata: Metadata = {
  title: "Tax & Compliance Glossary, A–Z | Compliance in Check",
  description:
    "A plain-language glossary of the terms Indian businesses hit — ITC, GSTIN, RCM, LUT, TDS, TCS, e-Way Bill, and more. Each entry links to the service that handles it.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/glossary",
    siteName: "Compliance in Check",
    title: "Tax & Compliance Glossary, A–Z",
    description:
      "Every compliance term a business owner will hit, defined in plain language and linked to the practice that handles it.",
  },
  robots: { index: true, follow: true },
};

export default function GlossaryPage() {
  const terms = getPublishedTerms();
  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Glossary
          </p>
          <h1 className="mt-3 font-display text-display text-ink">
            The A–Z of compliance.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            {terms.length > 0
              ? `${terms.length} terms, defined the way a business owner speaks — then mapped to the forms, sections, and deadlines they show up in.`
              : "Every term a confused business owner hits, defined in plain language."}
          </p>
        </header>

        <GlossaryIndex terms={terms} />
      </div>
    </div>
  );
}
