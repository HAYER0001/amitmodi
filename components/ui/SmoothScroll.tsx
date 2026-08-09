"use client";

/*
 * SmoothScroll.tsx — Lenis-powered smooth wheel scrolling.
 *
 * Native scroll stays the foundation; Lenis only intercepts wheel events for a
 * more cinematic easing. Under prefers-reduced-motion Lenis is never started,
 * so the page falls back to the browser's native scroll — no motion at all.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/*
 * Lenis v1 accepts an easing function, not a cubic-bezier tuple. We lift the
 * project curve (EASE) into a parametric bezier so smooth scroll shares the
 * same feel as every other animation.
 */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, c: number, d: number, t: number) =>
    Math.pow(1 - t, 3) * a +
    3 * Math.pow(1 - t, 2) * t * b +
    3 * (1 - t) * t * t * c +
    Math.pow(t, 3) * d;
  return (t: number) => {
    const u = (1 - t) * (1 - t) * (1 - t) * 0 + 3 * (1 - t) * (1 - t) * t * x1 +
      3 * (1 - t) * t * t * x2 + t * t * t * 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 8; i += 1) {
      const mid = (lo + hi) / 2;
      if (at(0, x1, x2, 1, mid) < u) lo = mid;
      else hi = mid;
    }
    const mid = (lo + hi) / 2;
    return at(0, y1, y2, 1, mid);
  };
}

const projectEasing = bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: projectEasing,
      smoothWheel: true,
      /* touch stays native: Lenis v1 leaves touch alone by default */
    });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
