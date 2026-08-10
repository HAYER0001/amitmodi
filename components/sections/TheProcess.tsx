"use client";

import AmbientVideo from "@/components/ui/AmbientVideo";
import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ProcessStep } from "@/types/content";
import { EASE, DUR } from "@/lib/motion";

/*
 * TheProcess — the horizontal timeline of what happens after contact.
 *
 * Five steps (consultation → documents → filing → confirmation → ongoing
 * compliance), each carrying a duration and who is responsible, typed with
 * the ProcessStep contract from types/content.ts. The connecting line is a
 * series of small SVG segments that DRAW IN (stroke-dashoffset via framer
 * pathLength) as they enter view — horizontal on desktop, vertical below.
 * Under prefers-reduced-motion the line renders fully, static.
 */

const OWNER_LABEL: Record<ProcessStep["owner"], string> = {
  client: "You",
  firm: "Us",
  government: "The department",
};

const DURATION_LABEL: Record<number, string> = {
  1: "Day one",
  3: "~3 days",
  7: "~7 days",
  21: "~3 weeks",
  365: "Year-round",
};

const PROCESS: readonly ProcessStep[] = [
  {
    order: 1,
    title: "Consultation",
    description:
      "We review your current filings and identify any immediate exposure before anything else moves.",
    owner: "client",
    durationDays: 1,
  },
  {
    order: 2,
    title: "Documents",
    description:
      "You send the raw material — registrations, invoices, ledger extracts. Nothing leaves your hands twice.",
    owner: "client",
    durationDays: 3,
  },
  {
    order: 3,
    title: "Filing",
    description:
      "We do the math, format the files, and submit them before the deadline — reconciled against the department records.",
    owner: "firm",
    durationDays: 7,
  },
  {
    order: 4,
    title: "Confirmation",
    description:
      "The department processes the filing. Acknowledged returns and challans come back, and we match them to your records.",
    owner: "government",
    durationDays: 21,
  },
  {
    order: 5,
    title: "Ongoing compliance",
    description:
      "Every return for the year is mapped, filed, and archived in one place, so the next deadline is already handled.",
    owner: "firm",
    durationDays: 365,
  },
];

function Connector({ horizontal }: { horizontal: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  /* Static, fully-drawn line for reduced motion and no-JS readers. */
  if (reduced) {
    return horizontal ? (
      <div
        ref={ref}
        aria-hidden="true"
        className="hidden lg:block"
      >
        <svg width="64" height="2" className="mx-3">
          <line
            x1="0"
            y1="1"
            x2="64"
            y2="1"
            stroke="var(--seal)"
            strokeWidth="2"
          />
        </svg>
      </div>
    ) : (
      <div ref={ref} aria-hidden="true" className="lg:hidden">
        <svg width="2" height="56" className="ml-5 my-2">
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="56"
            stroke="var(--seal)"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  return horizontal ? (
    /* Pinned to the number circles' centre (36px circle → 18px), not floating
       in a stretched row. Cards differ in height, so an unpinned connector sat
       at a different height in every gap and connected nothing. */
    <div ref={ref} aria-hidden="true" className="hidden shrink-0 pt-[18px] lg:block">
      <svg width="64" height="2" className="mx-3">
        <motion.line
          x1="0"
          y1="1"
          x2="64"
          y2="1"
          stroke="var(--seal)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: DUR.slow, ease: EASE }}
        />
      </svg>
    </div>
  ) : (
    <div ref={ref} aria-hidden="true" className="lg:hidden">
      <svg width="2" height="56" className="ml-5 my-2">
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="56"
          stroke="var(--seal)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: DUR.slow, ease: EASE }}
        />
      </svg>
    </div>
  );
}

export default function TheProcess() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="bg-paper-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
          The process
        </p>
        <h2
          id="process-title"
          className="mt-3 font-display text-h1 text-ink"
        >
          What happens after you contact us.
        </h2>
        <p className="mt-4 max-w-2xl font-body text-body leading-relaxed text-ink-soft">
          A clear sequence, so you always know whose hands the work is in and
          how long each step takes.
        </p>

        <ol className="mt-14 flex flex-col lg:flex-row lg:items-stretch">
          {PROCESS.map((step, index) => (
            <Fragment key={step.order}>
              {index > 0 && <Connector horizontal />}
              {index > 0 && <Connector horizontal={false} />}
              {/* The number circle is absolutely positioned at left-0 top-0, so
                  the content must be pushed clear of it at EVERY breakpoint.
                  Mobile pushes right (pl-14); desktop drops the gutter, so it
                  pushes DOWN instead (lg:pt-12) and the number sits above the
                  title. Previously lg:pl-0 removed the gutter without replacing
                  it, and the circle landed on the title — "Consultation"
                  rendered as "sultation", "Documents" as "uments". */}
              <li className="relative pl-14 lg:flex-1 lg:pl-0 lg:pt-12">
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-seal bg-paper font-label text-xs text-seal">
                  {step.order}
                </span>
                <h3 className="font-body text-xl font-semibold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
                <p className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex min-h-11 items-center rounded-pill border border-rule px-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {DURATION_LABEL[step.durationDays] ?? `${step.durationDays} days`}
                  </span>
                  <span className="inline-flex min-h-11 items-center rounded-pill border border-rule px-4 font-label text-xs uppercase tracking-[0.14em] text-seal">
                    {OWNER_LABEL[step.owner]}
                  </span>
                </p>
              </li>
            </Fragment>
          ))}
        </ol>

        {/* The looping ink-line clip — below the fold, muted, and loaded only
            when it is near the viewport. It sits with the process because that
            is what it draws: a single line finding its way through the steps. */}
        <AmbientVideo
          src="/video/vid-process-loop.mp4"
          transcript="A single ink line draws itself left to right, pausing at five points along the way — the same five steps set out above, from first consultation to ongoing compliance."
          className="mt-16 max-w-3xl lg:mt-20"
        />
      </div>
    </section>
  );
}
