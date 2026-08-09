import { ADVERTISING_MODE } from "@/data/credentials";
import { CLIENTS, type Client } from "@/data/clients";

/*
 * ClientMarquee — the infinite logo scroll (instrtion.md §V: Client Carousel).
 *
 * STANDARD MODE ONLY. In conservative mode — and while data/clients.ts is
 * EMPTY BY DESIGN — this component returns null, not an empty state, nothing.
 * Client logos come only from clients who have given written consent
 * (consentObtained: true); a logo with no consent is a fabricated endorsement.
 *
 * When it does render:
 *  - the motion is pure CSS (.marquee-track in globals.css): a duplicated
 *    track translating -50% loops seamlessly, no JavaScript timer;
 *  - it pauses on hover / keyboard focus;
 *  - prefers-reduced-motion keeps it a static row (CSS media query);
 *  - the animated track is aria-hidden; a visually-hidden real list sits
 *    beside it so screen readers and crawlers see plain, ordered text.
 */

function LogoMark({ client }: { client: Client }) {
  return (
    <li className="flex h-16 shrink-0 items-center gap-3 rounded-md border border-rule bg-paper px-8">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-sm bg-paper-deep font-label text-xs font-semibold uppercase text-seal"
      >
        {client.name.slice(0, 2)}
      </span>
      <span className="whitespace-nowrap font-label text-sm uppercase tracking-[0.14em] text-ink-soft">
        {client.name}
      </span>
    </li>
  );
}

export default function ClientMarquee() {
  if (ADVERTISING_MODE !== "standard") return null;
  const clients = CLIENTS.filter((client) => client.consentObtained);
  if (clients.length === 0) return null;

  return (
    <section aria-labelledby="clients-title" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          On the books
        </p>
        <h2 id="clients-title" className="mt-3 font-display text-h2 text-ink">
          Businesses we work with.
        </h2>

        {/* visually-hidden real list — screen readers and crawlers only */}
        <ul className="sr-only">
          {clients.map((client) => (
            <li key={client.id}>{client.name}</li>
          ))}
        </ul>

        {/* the animation — duplicated track, aria-hidden */}
        <div
          aria-hidden="true"
          className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <ul className="marquee-track flex w-max items-center gap-4 pr-4">
            {[...clients, ...clients].map((client, index) => (
              <LogoMark key={`${client.id}-${index}`} client={client} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
