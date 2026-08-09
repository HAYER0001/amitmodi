import type { CSSProperties } from "react";

/*
 * PenaltyCallout — the "risk of inaction" block.
 *
 * This is the piece of content most likely to be wrong, because it asserts
 * statutory consequence. So the component refuses to show an unverified
 * callout in production: set `verified` only when the penalty figure and
 * consequence have been checked against the primary source (the Act or an
 * official notification) by a person qualified to do so.
 *
 * Behaviour by environment:
 *  - Production + unverified  → renders nothing (the claim cannot leak).
 *  - Development + unverified → renders the content behind a loud yellow
 *    "UNVERIFIED — do not publish" alert so editors still see what is in
 *    the data and know it is blocked.
 *  - verified → renders normally in both environments.
 */

type PenaltyCalloutProps = {
  /** The action (or inaction) that attracts the penalty. */
  trigger: string;
  /** The statutory consequence. */
  consequence: string;
  /** Short cite of the provision, e.g. "Sec 122 CGST Act". */
  statuteRef?: string;
  /** The headline amount/rate, in --stamp colour, e.g. "₹200 per day of delay". */
  figure?: string;
  /** False by default: the callout is withheld from production until true. */
  verified?: boolean;
};

export default function PenaltyCallout({
  trigger,
  consequence,
  statuteRef,
  figure,
  verified = false,
}: PenaltyCalloutProps) {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !verified) return null;

  const marginalia = { "--rot": "2deg" } as CSSProperties;

  return (
    <aside aria-labelledby="penalty-callout-title" className="border-t border-rule py-10">
      {!isProd && !verified && (
        <p
          role="alert"
          className="mb-4 rounded-md bg-amber-300 px-4 py-3 font-label text-xs font-bold uppercase tracking-[0.14em] text-ink"
        >
          UNVERIFIED — do not publish
        </p>
      )}

      <div className="border-l-4 border-stamp bg-paper p-6 sm:p-8">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
          Risk of inaction
        </p>
        <h2 id="penalty-callout-title" className="mt-2 font-display text-h2 text-ink">
          Penalties and the cost of delay
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
              The trigger
            </dt>
            <dd className="mt-1 font-body text-base leading-relaxed text-ink">{trigger}</dd>
          </div>
          <div>
            <dt className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
              The consequence
            </dt>
            <dd className="mt-1 font-body text-base leading-relaxed text-ink">{consequence}</dd>
          </div>
        </dl>

        {figure && (
          <p className="mt-6 font-label text-base uppercase tracking-[0.14em] text-stamp">
            {figure}
          </p>
        )}

        {statuteRef && (
          <span className="marginalia font-margin text-base" style={marginalia}>
            {statuteRef}
          </span>
        )}
      </div>
    </aside>
  );
}
