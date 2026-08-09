import CutOut from "@/components/ui/CutOut";
import { ASSETS } from "@/data/assets";
import { brand } from "@/lib/brand";

/*
 * TheProof — proof without fabrication.
 *
 * Renders exactly the numbers that exist in data/brand.ts. A null proof
 * value means the element does NOT exist: no "0", no "500+", no placeholder
 * dash. Right now BRAND-FACTS.md is all TBD, so the stat grid and credential
 * line stay empty until the principal supplies the real figures — the
 * structure below lights up automatically once they land.
 *
 * The credential line and trust badge row follow BRAND-FACTS.md §2/§6 and
 * mirror the same guards as the footer.
 */

type ProofKey = "clientsServed" | "returnsFiled" | "appealsHandled";

const STATS: readonly { key: ProofKey; label: string }[] = [
  { key: "clientsServed", label: "businesses on the books" },
  { key: "returnsFiled", label: "returns filed to date" },
  { key: "appealsHandled", label: "appeals represented before tribunals" },
];

export default function TheProof() {
  const handshake = ASSETS["fig-handshake"];
  const proof = brand.proof;
  const principal = brand.principal;

  const presentStats = STATS.map((stat) => ({
    label: stat.label,
    value: proof[stat.key] as number | null,
  })).filter(
    (stat): stat is { label: string; value: number } => stat.value !== null,
  );

  /* Credential line from BRAND-FACTS §2 — every part must exist to render. */
  const credentials = [
    principal.membershipNo
      ? `${principal.designation ?? "Member"} · ${principal.membershipNo}`
      : null,
    principal.yearsPractice
      ? `${principal.yearsPractice} years of practice`
      : null,
  ].filter((v): v is string => v !== null);

  /* Trust badge row from BRAND-FACTS §1/§2 — same guards as the footer. */
  const badges = [
    brand.gstin ? `GSTIN · ${brand.gstin}` : null,
    brand.pan ? `PAN · ${brand.pan}` : null,
    principal.membershipNo
      ? `${principal.designation ?? "Member"} · ${principal.membershipNo}`
      : null,
  ].filter((v): v is string => v !== null);

  return (
    <section id="proof" aria-labelledby="proof-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
              The record
            </p>
            <h2
              id="proof-title"
              className="mt-3 font-display text-h1 text-ink"
            >
              We operate on facts, precision, and history.
            </h2>
            <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
              No claims here that cannot be checked. The account below is the
              running total of the work actually done for clients like you.
            </p>

            {presentStats.length > 0 && (
              <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
                {presentStats.map((stat) => (
                  <div key={stat.label} className="bg-paper p-6">
                    <dt className="font-body text-sm leading-relaxed text-ink-soft">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 font-display text-h2 text-ink">
                      {stat.value.toLocaleString("en-IN")}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {credentials.length > 0 && (
              <p className="mt-8 border-l-2 border-brass pl-4 font-body text-base leading-relaxed text-ink">
                {credentials.join(" — ")}
              </p>
            )}

            {badges.length > 0 && (
              <ul className="mt-8 flex flex-wrap items-center gap-3">
                {badges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-pill border border-rule px-4 py-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CutOut
            src={handshake.src}
            alt={handshake.alt}
            width={handshake.width}
            height={handshake.height}
            rotate={2}
            className="mx-auto w-full max-w-xs lg:max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
