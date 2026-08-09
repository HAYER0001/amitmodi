"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CutOut from "@/components/ui/CutOut";

/*
 * HeroBridge.tsx — the transition directly beneath the hero.
 *
 * The reference move: a single long sentence starts in huge grey type below
 * the fold and, as it enters the viewport, scroll-scales upward and
 * colour-shifts from --ink-soft to --ink, with a cut-out drifting across it.
 *
 * The sentence is server-rendered text (good for SEO and no-JS); only its
 * scale and colour are animated, and only while it is on screen.
 */

const BRIDGE_COPY =
  "We map your obligations, file the returns, and keep the authorities satisfied before the notices arrive.";

export default function HeroBridge() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.55"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const color = useTransform(scrollYProgress, [0, 1], ["var(--ink-soft)", "var(--ink)"]);

  return (
    <section
      ref={ref}
      aria-label="How the practice works"
      className="border-t border-rule"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <motion.p
          style={{ scale, color }}
          className="max-w-5xl font-display text-h2 text-ink-soft sm:text-h1"
        >
          {BRIDGE_COPY}
        </motion.p>

        <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[30%] hidden w-28 rotate-6 md:block">
          <CutOut src="/images/cut-paperclip.png" alt="" width={112} height={149} />
        </div>
      </div>
    </section>
  );
}
