"use client";

/*
 * Reveal.tsx — the one entrance animation primitive.
 *
 * Contract:
 *  - The default state in server-rendered HTML is VISIBLE at opacity 1. No
 *    content is ever shipped invisible to a crawler or a no-JS reader.
 *  - Uses useInView (the hook behind whileInView) so animations start when the
 *    element actually enters the viewport, not on page load.
 *  - Under prefers-reduced-motion it renders a plain element — fully visible,
 *    zero animation.
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

type Direction = "up" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the entrance starts. */
  delay?: number;
  /** Which way the content drifts in from. Default "up". */
  direction?: Direction;
  /** Play once, or on every enter. Default true (play once). */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger. Default 0.25. */
  amount?: number;
};

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
  none: {},
};

function buildVariants(direction: Direction, delay: number): Variants {
  const from = offsets[direction];
  return {
    hidden: { opacity: 0, ...from },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: DUR.base, ease: EASE, delay },
    },
  };
}

export default function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const controls = useAnimationControls();
  /* Server render (and the first client render, so hydration matches) shows
     content fully visible. Only after mount do we snap out-of-view elements
     to the hidden state so the entrance can play — invisible content never
     ships in the HTML. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Once an element has been revealed it must never be hidden again.
     This is the fail-safe: hiding content is a one-way door we refuse to
     walk back through. If in-view detection misfires — a stale
     IntersectionObserver after a smooth-scroll library resyncs, a resize, a
     bfcache restore — the worst outcome is a missed animation, never a
     permanently invisible section. */
  const revealed = useRef(false);

  useEffect(() => {
    if (reduced || !mounted) return;
    if (inView) {
      revealed.current = true;
      controls.start("visible");
    } else if (!revealed.current) {
      controls.set("hidden");
    }
  }, [reduced, mounted, inView, controls, once]);

  /* Belt and braces. If nothing has revealed this element within 2.5s of
     mount — observer never fired, element sized 0 at observe time, tab
     restored from bfcache — force it visible. A missed animation is a
     cosmetic loss; unreadable content is a broken page. */
  useEffect(() => {
    if (reduced || !mounted) return;
    const t = window.setTimeout(() => {
      if (!revealed.current) {
        revealed.current = true;
        controls.start("visible");
      }
    }, 2500);
    return () => window.clearTimeout(t);
  }, [reduced, mounted, controls]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={buildVariants(direction, delay)}
      initial={false}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
