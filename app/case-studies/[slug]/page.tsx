import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import CaseStudyCard from "@/components/sections/CaseStudyCard";
import ClosingCTA from "@/components/sections/ClosingCTA";
import {
  getConsentedCaseStudies,
  getCaseStudy,
} from "@/lib/case-studies";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/case-studies/[slug]/page.tsx — one STAR case study.
 *
 * Statically generated from getConsentedCaseStudies(); dynamicParams=false so
 * a slug whose study is still a template (consentObtained: false) — or does
 * not exist at all — is a true 404. Consent is the filter, and it lives in
 * exactly one place.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getConsentedCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata({
    title: withSiteName(study.title),
    description: "A matter handled by the practice, in our own words.",
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <div className="bg-paper-deep">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Breadcrumbs />
          <header className="pb-10 pt-4">
            <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
              Case study · {study.status}
            </p>
            <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
              {study.title}
            </h1>
          </header>

          <CaseStudyCard study={study} />
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}
