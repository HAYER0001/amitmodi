"use client";

/*
 * ScrollScale.tsx — huge display text that scales and fades as it passes
 * through the viewport.
 *
 * Tracks the section's progress through the viewport (["start end", "end
 * start"]) and maps it to scale + opacity. Animates transform and opacity
 * ONLY — never layout properties. Under prefers-reduced-motion it renders the
 * text at full size and opacity, static.
 */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export default function ScrollScale({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.4, 1, 1, 0.4],
  );

  if (reduced) {
    /* The ref MUST still be attached here. useScroll({ target: ref }) runs
       unconditionally above, so returning an element without the ref leaves
       Framer Motion tracking a node that never exists — it throws
       "Target ref is defined but not hydrated" and the scroll listener is
       left in a broken state for the rest of the page. */
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity }} className="origin-center will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
