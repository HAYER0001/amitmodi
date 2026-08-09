/*
 * lib/motion.ts — the single source of truth for motion.
 *
 * Every animation in the project pulls its easing, durations, and variants
 * from here — components NEVER invent their own numbers. The one rule above
 * all: when prefers-reduced-motion is active, nothing animates. Content is
 * always fully visible and static; we degrade to a faster result, not a
 * stripped-down one.
 */
import {
  useReducedMotion,
  type Transition,
  type Variant,
  type Variants,
} from "framer-motion";

export { useReducedMotion };

/** The only easing curve in the project. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** The only durations in the project. */
export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  epic: 1.6,
} as const;

const t = (duration: number, delay = 0): Transition => ({
  duration,
  ease: EASE,
  delay,
});

/** Fade up with a 24px drift. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: t(DUR.base) },
};

/** Pure opacity. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t(DUR.base) },
};

/** Scale in from 0.96 with a soft fade. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: t(DUR.slow) },
};

/** Parent container for staggered children. */
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

/** One child inside a staggerParent. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: t(DUR.fast) },
};

/** Line-mask reveal for section headlines. */
export const maskReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: t(DUR.slow, 0.1) },
};

/**
 * Returns instant, zero-duration variants when reduced motion is requested —
 * content lands in its final, fully-visible state with no animation. Pass the
 * result of `useReducedMotion()` so callers keep the hook at their own level.
 */
export function motionSafe(variants: Variants, reduced: boolean): Variants {
  if (!reduced) return variants;
  const instant: Variants = {};
  for (const [name, variant] of Object.entries(variants)) {
    instant[name] = {
      ...(variant as Variant),
      transition: { duration: 0 },
    };
  }
  return instant;
}
