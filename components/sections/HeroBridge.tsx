"use client";

import { useRef } from "react";
import ScrollText from "@/components/ui/ScrollText";
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

  return (
    <section
      ref={ref}
      aria-label="How the practice works"
      className="border-t border-rule"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        {/* Word-by-word opacity scrubbing rather than one block fading as a
            unit. Fading a whole paragraph is a transition; resolving it word by
            word is the reader's own pace made visible, and it is the single
            move that separates the reference from an ordinary landing page. */}
        <motion.div style={{ scale }} className="origin-left">
          <ScrollText className="max-w-5xl font-display text-h2 text-ink sm:text-h1">
            {BRIDGE_COPY}
          </ScrollText>
        </motion.div>

        <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[30%] hidden w-28 rotate-6 md:block">
          <CutOut src="/images/cut-paperclip.png" alt="" width={112} height={149} />
        </div>
      </div>
    </section>
  );
}
