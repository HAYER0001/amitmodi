import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/content/AnswerBlock";
import { DocumentChecklist } from "@/components/content/DocumentChecklist";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { RelatedServices } from "@/components/content/RelatedServices";
import { ServiceSchema, FAQPageSchema, HowToSchema, WebPageSchema } from "@/components/seo/SchemaEmitters";
import ClosingCTA from "@/components/sections/ClosingCTA";
import ServiceHero from "@/components/sections/ServiceHero";
import PricingBlock from "@/components/sections/PricingBlock";
import { getContent, type PenaltyNote } from "../_content-bridge";
import { getAllServices, verifiedOnly } from "@/lib/content";
import { DOCUMENTS_BY_SERVICE } from "@/data/documents";
import type { ProcessStep } from "@/types/content";
import { buildMetadata, withSiteName, fitDescription, SITE_URL } from "@/lib/seo";

/*
 * app/services/[slug]/page.tsx — the dynamic service template.
 *
 * Every slug from data/services.ts is statically generated at build time
 * (generateStaticParams + dynamicParams = false → every route shows as ●
 * SSG, never ƒ). Metadata comes from the service registry plus Agent B's
 * long-form content (data/service-content.ts), bridged by CONTENT_ALIAS in
 * _content-bridge.ts where B's keys diverge from the canonical slugs.
 *
 * Composition order is an SEO decision — the direct answer comes before the
 * marketing:
 *   Breadcrumbs · H1 · AnswerBlock · Who needs this · What's included ·
 *   Documents · Process · Pricing · Penalties · FAQ · Related · CTA
 */

export const dynamicParams = false;

const ANSWER_QUESTION: Record<string, string> = {
  "pan-card-services": "What is a PAN and why does my business need one?",
  "gst-registration": "What is GST registration and when is it mandatory?",
  "entity-formation": "What does forming a business entity involve?",
  "income-tax-tds-returns": "How do income tax and TDS returns filings work?",
  "gst-returns-filing": "How do GST return filings work?",
  "income-tax-appeals": "How does an income tax appeal work?",
  "gst-appeals": "How does a GST appeal work?",
  "import-export-licence": "What is an Importer Exporter Code (IEC)?",
  "gst-notice-response": "What is a GST notice and do I really have to respond?",
  "global-trader-onboarding": "What does exporting from India require before the first shipment?",
  "ngo-trust-compliance": "What registrations and filings does a trust or NGO need?",
  "pre-notice-health-check": "What is a pre-notice compliance health check?",
};

export function generateStaticParams() {
  return getAllServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getAllServices().find((s) => s.slug === slug);
  if (!service) return {};
  const content = getContent(slug);
  return buildMetadata({
    image: "/images/og-service.jpg",
    title: withSiteName(content?.metaTitle ?? service.name),
    description: fitDescription(content?.metaDescription ?? service.oneLiner),
    path: `/services/${slug}`,
    alternateTypes: { "text/markdown": `/services/${slug}.md` },
  });
}

/* ---- Page-local structural sections ---------------------------------- */

function SectionHeader({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <h2 id={id} className="font-display text-h2 text-ink">
        {title}
      </h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-seal"
          />
          <span className="font-body text-body leading-relaxed text-ink">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WhoNeedsThis({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="who-needs-title" className="border-t border-rule py-10">
      <SectionHeader id="who-needs-title" title="Who needs this" />
      <BulletList items={items} />
    </section>
  );
}

function WhatsIncluded({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="included-title" className="border-t border-rule py-10">
      <SectionHeader id="included-title" title="What's included" />
      <BulletList items={items} />
    </section>
  );
}

function DocumentsSection({ slug }: { slug: string }) {
  const documents = DOCUMENTS_BY_SERVICE[slug] ?? [];
  if (documents.length === 0) return null;
  return (
    <section aria-labelledby="documents-title" className="border-t border-rule py-10">
      <SectionHeader id="documents-title" title="Documents required" />
      <DocumentChecklist serviceSlug={slug} documents={documents} />
    </section>
  );
}

function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section aria-labelledby="process-title" className="border-t border-rule py-10">
      <SectionHeader id="process-title" title="How it happens" />
      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.order} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-seal bg-paper font-label text-xs text-seal">
              {step.order}
            </span>
            <div>
              <h3 className="font-body text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
              <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                {step.owner} · {step.durationDays} days
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PenaltiesSection({
  penalty,
  isProd,
}: {
  penalty: PenaltyNote;
  isProd: boolean;
}) {
  const showFigure = penalty.figure && (penalty.verified || !isProd);
  const style = { "--rot": "2deg" } as CSSProperties;
  return (
    <section
      aria-labelledby="penalties-title"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6"
    >
      <div className="border-l-4 border-stamp bg-paper-deep p-6 sm:p-8">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
          Risk of inaction
        </p>
        <h2 id="penalties-title" className="mt-2 font-display text-h2 text-ink">
          Penalties and the cost of delay
        </h2>
        <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink">
          {penalty.text}
        </p>
        {showFigure && (
          <p className="mt-4 font-label text-sm uppercase tracking-[0.14em] text-stamp">
            {penalty.figure}
            {!penalty.verified && (
              <span className="ml-1 lowercase text-ink-soft">· verify</span>
            )}
          </p>
        )}
        {penalty.statuteRef && (
          <span className="marginalia font-margin text-base" style={style}>
            {penalty.statuteRef}
          </span>
        )}
      </div>
    </section>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getAllServices().find((s) => s.slug === slug);
  if (!service) notFound();

  const content = getContent(slug);
  const isProd = process.env.NODE_ENV === "production";
  const penalty = content?.penaltyNote;
  const documents = DOCUMENTS_BY_SERVICE[slug] ?? [];
  const related = service.relatedSlugs
    .map((relatedSlug) =>
      getAllServices().find((s) => s.slug === relatedSlug),
    )
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      slug: s.slug,
      title: s.name,
      description: s.oneLiner,
    }));

  return (
    <>
      <ServiceSchema service={service} content={content} domain={SITE_URL} />
      {service.faqs && <FAQPageSchema faqs={service.faqs} />}
      {service.process.length > 0 && <HowToSchema steps={service.process} title={`How ${service.name} works`} description={`The process for ${service.name}`} />}
      <WebPageSchema domain={SITE_URL} url={`/services/${slug}`} speakableSelector="#direct-answer" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumbs />
        <ServiceHero service={service} />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {content?.directAnswer && (
          <AnswerBlock
            question={ANSWER_QUESTION[slug] ?? `What is ${service.shortName}?`}
            answer={content.directAnswer}
          />
        )}

        {content?.whoNeedsIt && content.whoNeedsIt.length > 0 && (
          <WhoNeedsThis items={content.whoNeedsIt} />
        )}

        {content?.whatsIncluded && content.whatsIncluded.length > 0 && (
          <WhatsIncluded items={content.whatsIncluded} />
        )}

        {documents.length > 0 && <DocumentsSection slug={slug} />}

        {service.process.length > 0 && <ProcessSection steps={service.process} />}
      </div>

      <PricingBlock pricing={service.pricing} />

      {penalty?.text && <PenaltiesSection penalty={penalty} isProd={isProd} />}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FAQAccordion
          items={verifiedOnly(service.faqs).map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))}
        />

        {related.length > 0 && <RelatedServices services={related} />}
      </div>

      <ClosingCTA />
    </>
  );
}
