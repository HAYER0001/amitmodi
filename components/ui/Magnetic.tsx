"use client";

/*
 * Magnetic.tsx — a subtle magnetic pull for primary CTAs.
 *
 * The inner content drifts toward the cursor with a hard cap of 8px of
 * displacement, then springs back on leave. Uses spring transforms only (no
 * layout). Disabled entirely on touch devices (no hover) and under
 * prefers-reduced-motion.
 */

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

const MAX_SHIFT = 8;

export default function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 20, mass: 0.4 });
  /* Touch / coarse pointers never hover; skip the effect entirely. */
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const update = () => setCanHover(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced || !canHover) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    /* Soft falloff, hard-capped at MAX_SHIFT so a cursor across the page
       never yanks the button off its anchor. */
    const travel = Math.min(1, Math.hypot(dx, dy) / 200);
    const clamp = (v: number) =>
      Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, v));
    x.set(clamp(dx * travel));
    y.set(clamp(dy * travel));
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
