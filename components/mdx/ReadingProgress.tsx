"use client";

import { useEffect, useRef } from "react";

/*
 * ReadingProgress — the reading progress bar (instrtion.md §V).
 *
 * Transform-only: the bar's width never changes, only its scaleX, so nothing
 * reflows. It is a scroll SYNC, not an animation, which is what makes it safe
 * under prefers-reduced-motion — there is no motion to disable, just a
 * position updated inside requestAnimationFrame. aria-hidden: purely decorative.
 */

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(1, doc.scrollTop / scrollable) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-seal"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
