"use client";

import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, DUR } from "@/lib/motion";
import type { ProcessStep } from "@/types/content";

/*
 * ProcessTimeline — the visual roadmap for a service engagement.
 *
 * Mobile: a vertical timeline running down the left gutter. Desktop (lg+):
 * the steps sit in a horizontal row joined by short SVG connector segments
 * that DRAW IN (pathLength) as they scroll into view. Each step carries its
 * order number, title, description, a duration chip, and a colour-coded
 * owner badge (You / Us / The department). The total elapsed working days
 * is shown as a capstone at the end — derived from the steps, or overridden
 * with `totalDays`.
 *
 * The steps render as a real <ol> — with CSS disabled the sequence is still
 * a readable numbered list. Under prefers-reduced-motion the connectors
 * render fully, without animation.
 */

const OWNER: Record<
  ProcessStep["owner"],
  { label: string; className: string }
> = {
  client: { label: "You", className: "border-rule text-ink-soft" },
  firm: { label: "Us", className: "border-seal text-seal" },
  government: { label: "The department", className: "border-brass text-brass" },
};

const DURATION_LABEL: Record<number, string> = {
  1: "Day one",
  3: "~3 days",
  7: "~7 days",
  21: "~3 weeks",
  365: "Year-round",
};

function formatDuration(days: number): string {
  return DURATION_LABEL[days] ?? `${days} days`;
}

function Connector({ horizontal }: { horizontal: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  if (reduced) {
    return horizontal ? (
      <div ref={ref} aria-hidden="true" className="hidden w-10 shrink-0 lg:block">
        <svg
          width="40"
          height="2"
          viewBox="0 0 40 2"
          className="mx-auto block h-0.5 w-10 overflow-visible"
        >
          <line x1="0" y1="1" x2="40" y2="1" stroke="var(--rule)" strokeWidth="2" />
        </svg>
      </div>
    ) : (
      <div ref={ref} aria-hidden="true" className="pl-[1.125rem] lg:hidden">
        <svg
          width="2"
          height="40"
          viewBox="0 0 2 40"
          className="block h-10 w-0.5 overflow-visible"
        >
          <line x1="1" y1="0" x2="1" y2="40" stroke="var(--rule)" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  const lineProps = {
    stroke: "var(--rule)",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    initial: { pathLength: 0 },
    animate: { pathLength: inView ? 1 : 0 },
    transition: { duration: DUR.slow, ease: EASE },
  };

  return horizontal ? (
    <div ref={ref} aria-hidden="true" className="hidden w-10 shrink-0 items-center lg:flex">
      <svg
        width="40"
        height="2"
        viewBox="0 0 40 2"
        className="block h-0.5 w-10 overflow-visible"
      >
        <motion.line x1="0" y1="1" x2="40" y2="1" {...lineProps} />
      </svg>
    </div>
  ) : (
    <div ref={ref} aria-hidden="true" className="pl-[1.125rem] lg:hidden">
      <svg
        width="2"
        height="40"
        viewBox="0 0 2 40"
        className="block h-10 w-0.5 overflow-visible"
      >
        <motion.line x1="1" y1="0" x2="1" y2="40" {...lineProps} />
      </svg>
    </div>
  );
}

type ProcessTimelineProps = {
  steps: ProcessStep[];
  /** Override the derived sum of step durations (e.g. to exclude an ongoing step). */
  totalDays?: number;
};

export default function ProcessTimeline({
  steps,
  totalDays,
}: ProcessTimelineProps) {
  if (!steps || steps.length === 0) return null;

  const total =
    totalDays ?? steps.reduce((sum, step) => sum + step.durationDays, 0);

  return (
    <section aria-labelledby="process-timeline-title" className="border-t border-rule py-10">
      <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">How it happens</p>
      <h2 id="process-timeline-title" className="mt-2 font-display text-h2 text-ink">
        The timeline
      </h2>

      <div className="mt-8 lg:flex lg:items-stretch">
        <ol className="flex flex-col lg:min-w-0 lg:flex-1 lg:flex-row lg:items-stretch">
          {steps.map((step, index) => (
            <Fragment key={step.order}>
              {index > 0 && <Connector horizontal />}
              {index > 0 && <Connector horizontal={false} />}
              <li className="relative pl-14 lg:pl-0">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-seal bg-paper font-label text-xs text-seal"
                >
                  {step.order}
                </span>
                <h3 className="font-body text-xl font-semibold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-h-11 items-center rounded-pill border border-rule px-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {formatDuration(step.durationDays)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-pill border px-4 font-label text-xs uppercase tracking-[0.14em]",
                      OWNER[step.owner].className,
                    )}
                  >
                    {OWNER[step.owner].label}
                  </span>
                </div>
              </li>
            </Fragment>
          ))}
        </ol>

        <div className="mt-8 border-t border-rule pt-6 lg:mt-0 lg:w-56 lg:shrink-0 lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
            Total elapsed
          </p>
          <p className="mt-2 font-display text-h2 text-ink">~{total} days</p>
          <p className="mt-2 max-w-[15rem] font-body text-sm leading-relaxed text-ink-soft">
            Estimated working days across every step.
          </p>
        </div>
      </div>
    </section>
  );
}
