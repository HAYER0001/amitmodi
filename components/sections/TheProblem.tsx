"use client";

import type { CSSProperties } from "react";
import ScrollScale from "@/components/ui/ScrollScale";
import Reveal from "@/components/ui/Reveal";
import CutOut from "@/components/ui/CutOut";
import { ASSETS } from "@/data/assets";

/*
 * TheProblem — the emotional core of the narrative.
 *
 * A display statement that scroll-scales, then four --stamp consequence
 * cards. --stamp is the one token reserved for deadlines, penalties, and
 * warnings — this section is exactly that case.
 *
 * The monetary FIGURES carry a verified flag (see lib/content.ts). The
 * figures in this file trace to penalty clauses in COPY-DECK.md that are
 * still marked `<!-- VERIFY -->`, so verified: false — they render only in
 * development (with a visible "verify" note) and are omitted entirely in
 * production until the principal confirms them. The trigger and consequence
 * copy is qualitative and always renders.
 */

type Consequence = {
  id: string;
  trigger: string;
  consequence: string;
  statute: string;
  figure: { text: string; verified: boolean } | null;
};

const CONSEQUENCES: readonly Consequence[] = [
  {
    id: "late-fee",
    statute: "Sec 234E",
    trigger: "A TDS return is filed a day late.",
    consequence:
      "The daily late fee starts at once and keeps compounding until the return is accepted.",
    figure: { text: "200 per day", verified: false },
  },
  {
    id: "interest",
    statute: "Sec 234A",
    trigger: "Tax is paid after the due date.",
    consequence:
      "Interest accrues on the unpaid amount every month — on top of the tax itself.",
    figure: { text: "1% per month", verified: false },
  },
  {
    id: "notice",
    statute: "GSTR-2B",
    trigger: "Your GSTR-1 and GSTR-3B do not match.",
    consequence:
      "Automated matching flags the difference, and a show-cause notice arrives in the mail.",
    figure: null,
  },
  {
    id: "evasion",
    statute: "Sec 22 CGST",
    trigger: "A business crosses the GST threshold without registering.",
    consequence:
      "The department treats the gap as deliberate evasion, and the penalty climbs well past the standard rate.",
    figure: { text: "100% of the tax due", verified: false },
  },
];

export default function TheProblem() {
  const worried = ASSETS["fig-worried"];
  const isProd = process.env.NODE_ENV === "production";

  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="relative overflow-hidden bg-paper-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <ScrollScale className="max-w-4xl">
          <h2
            id="problem-title"
            className="font-display text-display text-ink"
          >
            A notice arrives.
            <br />
            Everything stops.
          </h2>
        </ScrollScale>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
          <Reveal className="max-w-2xl">
            <p className="font-body text-body leading-relaxed text-ink">
              Most businesses treat compliance as a reaction. A deadline
              passes, and penalties quietly compound. By the time the error is
              found, the cost to fix it is triple the cost of doing it right
              the first time. We replace that cycle with structure — the
              obligations mapped, the returns filed, the authorities satisfied.
            </p>
          </Reveal>
          <CutOut
            src={worried.src}
            alt={worried.alt}
            width={worried.width}
            height={worried.height}
            rotate={-3}
            className="mx-auto w-32 lg:w-44"
          />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONSEQUENCES.map((card) => {
            const showFigure =
              card.figure !== null &&
              (card.figure.verified || !isProd);
            const marginal = {
              "--rot": "2deg",
            } as CSSProperties;
            return (
              <article
                key={card.id}
                className="flex flex-col gap-3 rounded-md border border-rule bg-paper p-6 shadow-cut"
              >
                <span
                  className="marginalia font-margin text-base"
                  style={marginal}
                >
                  {card.statute}
                </span>
                <h3 className="font-body text-lg font-semibold leading-snug text-ink">
                  {card.trigger}
                </h3>
                <p className="font-body text-sm leading-relaxed text-ink-soft">
                  {card.consequence}
                </p>
                {card.figure !== null && showFigure && (
                  <p className="mt-auto pt-4 font-label text-sm uppercase tracking-[0.14em] text-stamp">
                    {card.figure.text}
                    {!card.figure.verified && (
                      <span className="ml-1 lowercase text-ink-soft">
                        · verify
                      </span>
                    )}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
