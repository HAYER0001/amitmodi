"use client";

import { motion, useScroll } from "framer-motion";

/*
 * ScrollRail — right-edge progress indicator.
 *
 * Decorative only: the page already has real landmarks (header nav, main,
 * footer), so this is aria-hidden. N (north) at the top, S (south) at the
 * bottom — a compass read on the 60vh track, 24px off the right edge.
 * Hidden below 1024px (lg breakpoint).
 */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden h-[60vh] -translate-y-1/2 flex-col items-center lg:flex"
    >
      <span className="font-label text-[10px] leading-none text-ink-soft">N</span>
      <div className="relative my-2 flex-1">
        {/* 1px --rule track, full height */}
        <div className="absolute inset-0 w-px bg-rule" />
        {/* --seal fill, grows top→bottom with scroll */}
        <motion.div
          className="absolute left-0 top-0 w-px origin-top bg-seal"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <span className="font-label text-[10px] leading-none text-ink-soft">S</span>
    </div>
  );
}