import CutOut from "@/components/ui/CutOut";
import { ASSETS } from "@/data/assets";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import CredentialBar from "@/components/sections/CredentialBar";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { PRACTICE_CONTENT } from "@/data/practice-content";
import { brand } from "@/lib/brand";
import { buildMetadata, withSiteName } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: withSiteName("About the Practice"),
  description:
    "Structured, uncompromising regulatory compliance and tax defense for Indian businesses.",
  path: "/practice",
});

/*
 * app/practice/page.tsx — the practice's own page (Phase 13, §V).
 *
 * Narrative connective tissue lives in data/practice-content.ts (Agent B);
 * every factual field reads from brand.ts and omits itself while 'TBD'.
 * The PRINCIPLES are commitments, not boasts — they render always.
 */

export default function PracticePage() {
  const about = PRACTICE_CONTENT.about;
  const principalName: string | null = brand.principal?.name as string | null;

  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-12 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            The practice
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
            {about.heading}
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            {about.narrative}
          </p>
        </header>
      </div>

      <CredentialBar />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="cut-out-drift absolute right-[5%] top-[8%] hidden w-28 -rotate-6 lg:block xl:w-36">
          <CutOut
            src={ASSETS["cut-ledger-book"].src}
            alt=""
            width={ASSETS["cut-ledger-book"].width}
            height={ASSETS["cut-ledger-book"].height}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section aria-labelledby="approach-title">
            <h2
              id="approach-title"
              className="font-display text-h2 text-ink"
            >
              How we work with you
            </h2>
            <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
              {about.approach}
            </p>
          </section>

          <section aria-labelledby="principles-title">
            <h2
              id="principles-title"
              className="font-display text-h2 text-ink"
            >
              Principles of the practice
            </h2>
            <ul className="mt-4 space-y-6">
              {PRACTICE_CONTENT.principles.map((principle) => (
                <li
                  key={principle.title}
                  className="flex gap-4 border-t border-rule pt-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-seal"
                  />
                  <div>
                    <h3 className="font-body text-lg font-semibold text-ink">
                      {principle.title}
                    </h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
                      {principle.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {principalName && (
          <section
            aria-labelledby="principal-link-title"
            className="mt-16 border-t border-rule pt-10"
          >
            <h2
              id="principal-link-title"
              className="font-display text-h2 text-ink"
            >
              The person behind the practice
            </h2>
            <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
              A named, credentialed professional — not an anonymous form.
            </p>
            <Link
              href="/practice/principal"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-label text-sm uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
            >
              {principalName}
              <span aria-hidden="true" className="text-base leading-none">
                →
              </span>
            </Link>
          </section>
        )}
      </div>

      <ClosingCTA />
    </div>
  );
}
