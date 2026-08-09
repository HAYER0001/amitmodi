"use client";

/*
 * HorizontalScroll.tsx — a pinned horizontal gallery.
 *
 * On desktop (>= 1024px) the section is a tall pin: a sticky viewport shows a
 * row of panels that translate on X as the page scrolls vertically. Below
 * 1024px — and under prefers-reduced-motion — it degrades to a normal
 * horizontal-overflow swipe container: no pinning, no transform animation.
 *
 * The track is focusable and keyboard-accessible (arrow keys + Home/End).
 */

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function HorizontalScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /* Max travel = track width minus one viewport width. */
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const overflow = trackRef.current.scrollWidth - window.innerWidth;
      setDistance(Math.max(0, overflow));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const pinned = isDesktop && !reduced;

  const onTrackKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    /* Pinned mode: the track moves with page scroll, so arrow keys advance
       the pin (each press walks one viewport-width step of the track). */
    const step = window.innerWidth;
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? step
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -step
          : 0;
    if (delta) {
      e.preventDefault();
      window.scrollBy({ top: delta, behavior: "smooth" });
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (e.key === "End") {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  /* Fallback: a plain horizontal-overflow swipe row. Works for touch (native
     swipe), keyboard (focusable + arrow keys), and reduced motion (static). */
  const swipeTrack = (
    <div
      ref={trackRef}
      tabIndex={0}
      role="region"
      aria-label="Horizontal gallery — use arrow keys to scroll"
      onKeyDown={onTrackKeyDown}
      className={cn(
        /*
         * The SCROLLER. It must stay viewport-width and clip its overflow.
         *
         * `w-max` and `overflow-x-auto` cannot live on the same element: an
         * element sized to fit its own content has nothing left to scroll, so
         * the 2200px track pushed the whole page sideways instead of scrolling
         * inside itself. The track below carries w-max; this box stays w-full.
         */
        "w-full overflow-x-auto overscroll-x-contain",
        "scrollbar-thin [scrollbar-width:thin]",
        "outline-none focus-visible:ring-2 focus-visible:ring-seal",
      )}
    >
      <div className={cn("flex w-max gap-4", className)}>{children}</div>
    </div>
  );

  if (!pinned) {
    /*
     * sectionRef MUST be attached in this branch too.
     *
     * `pinned` is `isDesktop && !reduced`, and `isDesktop` starts false because
     * it is only resolved in an effect after mount. So the FIRST render always
     * lands here — on desktop as well as mobile. Returning markup without
     * sectionRef left useScroll({ target: sectionRef }) pointing at a node that
     * never existed, which is exactly the
     *   "Target ref is defined but not hydrated"
     * runtime error, thrown on every single page load.
     */
    return (
      <section ref={sectionRef} className={cn("relative", className)}>
        {swipeTrack}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className={cn("flex w-max gap-4 will-change-transform", className)}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
