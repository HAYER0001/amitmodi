import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { PRACTICE_CONTENT } from "@/data/practice-content";
import { brand } from "@/lib/brand";
import { PersonSchema } from "@/components/seo/SchemaEmitters";
import { buildMetadata, withSiteName } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: withSiteName("The Principal"),
  description:
    "The named professional behind the practice — credentials, specialisation, and professional history.",
  path: "/practice/principal",
});

/*
 * app/practice/principal/page.tsx — the E-E-A-T page (Phase 13, §V).
 *
 * This is one of the most important pages on the site: a named, credentialed
 * human is what separates this practice from an anonymous form. Every factual
 * field comes from brand.ts and omits itself while 'TBD' — nothing invents a
 * membership number, a year of practice, or a title. The photograph is a real
 * photograph of the real person, never a generated portrait.
 */

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-rule py-4">
      <dt className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 font-body text-body text-ink">{value}</dd>
    </div>
  );
}

export default function PrincipalPage() {
  const principal = brand.principal;
  const bio = PRACTICE_CONTENT.principal.bio;

  const name: string | null = principal.name as string | null;
  const designation: string | null = principal.designation as string | null;
  const membershipNo: string | null = principal.membershipNo as string | null;
  const yearsPractice: string | null = principal.yearsPractice as string | null;
  const qualifications: string | null = principal.qualifications as string | null;
  const barAdmissions: string | null = principal.barAdmissions as string | null;
  const photo: string | null = principal.photo as string | null;
  const specialisations: readonly string[] = (principal.specialisations ??
    []) as readonly string[];
  const history: readonly string[] = (principal.history ?? []) as readonly string[];

  const hasFacts =
    name || designation || membershipNo || yearsPractice || qualifications ||
    barAdmissions || photo || specialisations.length > 0 || history.length > 0;

  return (
    <div className="bg-paper-deep">
      <PersonSchema domain={process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi.com"} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
              The principal
            </p>
            <h1 className="mt-3 font-display text-display text-ink">
              {name ?? "The Principal"}
            </h1>
            {designation && (
              <p className="mt-3 font-label text-sm uppercase tracking-[0.14em] text-ink-soft">
                {designation}
              </p>
            )}

            <p className="mt-8 max-w-2xl font-body text-body leading-relaxed text-ink">
              {bio}
            </p>

            {hasFacts && (
              <dl className="mt-10 max-w-2xl">
                {membershipNo && (
                  <FactItem label="Membership / registration" value={membershipNo} />
                )}
                {qualifications && (
                  <FactItem label="Qualifications" value={qualifications} />
                )}
                {barAdmissions && (
                  <FactItem label="Admissions" value={barAdmissions} />
                )}
                {yearsPractice && (
                  <FactItem label="Years in practice" value={yearsPractice} />
                )}
              </dl>
            )}

            {specialisations.length > 0 && (
              <section
                aria-labelledby="specialisations-title"
                className="mt-10"
              >
                <h2
                  id="specialisations-title"
                  className="font-display text-h2 text-ink"
                >
                  Areas of specialisation
                </h2>
                <ul className="mt-4 space-y-2">
                  {specialisations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-seal"
                      />
                      <span className="font-body text-body leading-relaxed text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {history.length > 0 && (
              <section aria-labelledby="history-title" className="mt-10">
                <h2
                  id="history-title"
                  className="font-display text-h2 text-ink"
                >
                  Professional history
                </h2>
                <ol className="mt-4 space-y-4">
                  {history.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-brass pl-4 font-body text-body leading-relaxed text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {photo && (
            <aside className="lg:pt-16">
              <div className="relative overflow-hidden rounded-md border border-rule shadow-cut">
                <Image
                  src={photo}
                  alt={`Photograph of ${name ?? "the principal"}`}
                  width={320}
                  height={400}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </aside>
          )}
        </div>
      </div>

      <ClosingCTA />
    </div>
  );
}
