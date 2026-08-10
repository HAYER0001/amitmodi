"use client";

/*
 * ScrollText.tsx — word-by-word opacity scrubbing tied to scroll position.
 *
 * The signature move of the reference site: a long sentence sits muted, and each
 * word resolves to full ink as it passes through the viewport. It forces the
 * reader to read at the pace of the scroll instead of skimming, which is why it
 * reads as editorial rather than as a marketing page.
 *
 * Implementation notes that matter:
 *  - Only `opacity` is animated. No layout properties, so this never triggers
 *    reflow and never shows up in INP.
 *  - Words are real text nodes inside a real <p>. Crawlers, screen readers and
 *    AI answer engines see an ordinary paragraph — the effect is presentational
 *    only, and the sentence is fully readable with JavaScript disabled.
 *  - Whitespace is preserved with a trailing space inside each span, so
 *    copy-paste of the paragraph still produces normal prose.
 *  - Under prefers-reduced-motion every word renders at full opacity with no
 *    scroll listener attached at all.
 */

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ASSETS } from "@/data/assets";

/**
 * Inline ink figure — the reference's signature move.
 *
 * Small drawn figures sit BETWEEN words, treated as characters in the sentence
 * rather than as illustrations placed beside it. That is most of why the
 * reference reads as a printed page instead of a web layout.
 *
 * Written into copy as [[fig-worried]]. Sized in `em` so it scales with the
 * type it sits in, and nudged onto the baseline so it never pushes line height
 * around. Always aria-hidden — a screen reader announcing "image" mid-sentence
 * would wreck the reading.
 */
function InlineFigure({
  name,
  progress,
  range,
}: {
  name: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const asset = (ASSETS as Record<string, { src: string } | undefined>)[name];
  if (!asset) return null;
  return (
    <motion.span
      style={{ opacity }}
      aria-hidden="true"
      className="mx-[0.18em] inline-block h-[1.1em] w-[0.75em] translate-y-[0.14em]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.src} alt="" className="h-full w-full object-contain object-bottom" />
    </motion.span>
  );
}

/** One word. Its own transform maps a slice of the parent's scroll progress. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {" "}
    </motion.span>
  );
}

export default function ScrollText({
  children,
  className = "",
  as: Tag = "p",
}: {
  /** Plain text. Rendered as words; markup children are not supported. */
  children: string;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* The ref is attached in EVERY branch below. useScroll runs unconditionally,
     and returning an element without it throws
     "Target ref is defined but not hydrated". */
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Starts resolving when the block's top reaches 85% down the viewport and
       finishes when its bottom passes 45% — the whole sentence lands before it
       leaves the comfortable reading band, rather than finishing off-screen. */
    offset: ["start 0.85", "end 0.45"],
  });

  const words = children.split(" ").filter(Boolean);

  if (reduced) {
    return (
      <div ref={ref}>
        <Tag className={className}>{children}</Tag>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          const fig = word.match(/^\[\[([\w-]+)\]\]$/);
          if (fig) {
            return (
              <InlineFigure
                key={`${word}-${i}`}
                name={fig[1]}
                progress={scrollYProgress}
                range={[start, end]}
              />
            );
          }
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </Tag>
    </div>
  );
}
