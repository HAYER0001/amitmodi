import PageAtmosphere from "@/components/ui/PageAtmosphere";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getPublishedTerms } from "@/lib/glossary";
import GlossaryIndex from "./_GlossaryIndex";
import { buildMetadata } from "@/lib/seo";

/*
 * app/glossary/page.tsx — the A–Z glossary index (Phase 15, Agent A).
 *
 * Every term is rendered on the server in this page's HTML, grouped by
 * letter. The client GlossaryIndex only hides and shows those entries as the
 * visitor types — it never fetches. Terms are crawlable because they are in
 * the markup, not because a search endpoint returns them.
 */

export const metadata: Metadata = buildMetadata({
  title: "Tax & Compliance Glossary, A–Z",
  description:
    "A plain-language glossary of Indian tax and compliance terms — ITC, GSTIN, RCM, LUT, TDS, TCS, e-Way Bill, and more.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const terms = getPublishedTerms();
  return (
    <div className="relative bg-paper-deep">
      <PageAtmosphere density="utility" seed={19} object="tex-ink-blot" objectClassName="right-[7%] top-[8%] hidden w-24 -rotate-3 lg:block xl:w-28" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Glossary
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
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
