import Image from "next/image";
import { CREDENTIALS } from "@/data/credentials";

/*
 * CredentialBar — the trust badges (instrtion.md §IV: Trust Badges).
 *
 * Renders ONLY credentials the practice may legally display, straight from
 * data/credentials.ts, and only when the practice is entitled to the mark:
 * `verified: true` AND a real `registrationNo`. A badge with no number is
 * weaker than no badge — it is omitted, per the file's own comment. Renders in
 * BOTH advertising modes: registrations and memberships are facts, not
 * solicitation.
 *
 * Returns nothing at all (not an empty state) when there is nothing to show.
 */

export default function CredentialBar() {
  const badges = CREDENTIALS.filter(
    (credential) => credential.verified && credential.registrationNo,
  );
  if (badges.length === 0) return null;

  return (
    <section aria-labelledby="credentials-title" className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          Registrations &amp; memberships
        </p>
        <h2
          id="credentials-title"
          className="mt-3 max-w-2xl font-display text-h2 text-ink"
        >
          Credentials you can verify against the register.
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((credential) => (
            <li
              key={credential.id}
              className="flex items-start gap-4 rounded-md border border-rule bg-paper p-5 shadow-cut"
            >
              {credential.logoAsset ? (
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-rule bg-paper">
                  <Image
                    src={credential.logoAsset}
                    alt=""
                    fill
                    sizes="2.5rem"
                    className="object-contain"
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-rule bg-paper-deep font-label text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-seal"
                >
                  {credential.abbreviation.slice(0, 4)}
                </span>
              )}
              <div>
                <p className="font-label text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                  {credential.abbreviation}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
                  {credential.body}
                </p>
                <p className="mt-1.5 font-label text-xs uppercase tracking-[0.14em] text-seal">
                  {credential.registrationNo}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
