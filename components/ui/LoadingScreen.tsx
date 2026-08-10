"use client";

/*
 * LoadingScreen.tsx — the site's boot screen.
 *
 * The brass knight is the centrepiece, and the progress IS the scene: a
 * seal-green gauge rises toward the knight as the page actually loads, and
 * when the fill completes the overlay dissolves to reveal the same knight
 * already centred in the hero — the fill literally becomes the centre of the
 * website. It is a moment of transition (MOTION-RULES §5.4), built only from
 * locked tokens: the paper + ledger surface, --seal fill, mono labels,
 * Caveat marginalia, and the project easing and durations.
 *
 * Progress is real, not decorative: it steps on document readiness, the
 * knight model's own load, and window load — with a safety cap so the boot
 * never outlasts a broken request. Under prefers-reduced-motion the fill
 * jumps to completion instantly and the knight stands still.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { DUR, EASE, useReducedMotion } from "@/lib/motion";

const Knight = dynamic(() => import("@/components/ui/Model3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--rule),transparent_62%)] opacity-50"
    />
  ),
});

/* Long enough to read the mark, short enough to feel instant. */
const MIN_BOOT = 1200;
/* Never let a hung request hold the page hostage. */
const SAFETY_MS = 6000;

export default function LoadingScreen() {
  const reduced = useReducedMotion();

  const progress = useMotionValue(0);
  const fill = useTransform(progress, (v) => v / 100);
  const [percent, setPercent] = useState("0");
  useMotionValueEvent(progress, "change", (v) => setPercent(String(Math.round(v))));

  const [target, setTarget] = useState(8);
  const [knightReady, setKnightReady] = useState(false);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const bootStart = useRef(0);

  /* Ease the fill toward each milestone with the project's one curve. */
  useEffect(() => {
    const controls = animate(progress, target, {
      duration: reduced ? 0 : DUR.base,
      ease: EASE,
    });
    return controls.stop;
  }, [progress, target, reduced]);

  /* The boot knight IS the preload: the moment it mounts it pulls the model
     into drei's shared useGLTF cache, so the hero knight resolves from that
     cache the instant the overlay clears. `knightReady` holds the dismissal
     until the knight has genuinely rendered its first frame — the reveal can
     never catch a shimmer or a pop-in. (On a gated or broken device Model3D
     reports ready for its fallback instead, so the boot still ends.) */
  const onKnightReady = () => {
    setKnightReady(true);
    setTarget((t) => Math.max(t, 100));
  };

  /* Real milestones, in order of likelihood. */
  useEffect(() => {
    bootStart.current = performance.now();
    const raf = requestAnimationFrame(() => setTarget((t) => Math.max(t, 12)));

    const onReady = () => setTarget((t) => Math.max(t, 42));
    const onLoad = () => setTarget(100);

    if (document.readyState === "interactive" || document.readyState === "complete") {
      onReady();
    } else {
      document.addEventListener("readystatechange", onReady);
    }

    /* The knight model's own network fetch — the one thing this screen is
       built around. performance resource timing is read-only and cheap. */
    const glb = setInterval(() => {
      const hit = performance
        .getEntriesByType("resource")
        .some((r) => r.name.includes("knight-brass.glb"));
      if (hit) {
        setTarget((t) => Math.max(t, 68));
        clearInterval(glb);
      }
    }, 150);

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    /* Never hold the page hostage: if the knight never reports ready (broken
       model), the safety forces both the fill and the readiness gate. */
    const safety = setTimeout(() => {
      setKnightReady(true);
      setTarget((t) => Math.max(t, 100));
    }, SAFETY_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(glb);
      clearTimeout(safety);
      document.removeEventListener("readystatechange", onReady);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  /* Hold the finished state long enough to read, then dismiss — only once the
     fill has completed AND the knight has actually rendered. */
  useEffect(() => {
    if (target < 100 || !knightReady) return;
    const hold = Math.max(0, MIN_BOOT - (performance.now() - bootStart.current));
    const t = setTimeout(() => setDone(true), hold);
    return () => clearTimeout(t);
  }, [target, knightReady]);

  /* Lock the page — and the scroll-driven knight — while booting, so the
     reveal always finds the knight centred. */
  useEffect(() => {
    if (done) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [done]);

  if (gone) return null;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {!done && (
        <motion.div
          key="boot"
          role="status"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: reduced ? 0 : DUR.slow, ease: EASE }}
          className="paper ledger-grid fixed inset-0 z-[80] flex flex-col items-center justify-center"
        >
          <div className="pointer-events-none aspect-square w-[46vw] max-w-[340px] sm:w-[32vw] sm:max-w-[280px]">
            {/* The knight's turn is driven by the fill itself: two full turns
               across the boot, so the moment the fill completes it lands
               exactly front-facing — the pose the hero knight holds behind the
               overlay. The reveal therefore hands off seamlessly instead of
               catching the knight mid-spin (which read as it shrinking). The
               float yields while it turns, so the spin reads as a spin, never
               as a change in size. */}
            <Knight
              src="/models/knight-brass.glb"
              spinDriver={fill}
              driverTurns={2}
              rotationSpeed={0.12}
              onReady={onKnightReady}
              className="relative h-full w-full"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8">
            {/* The fill: rises toward the knight as the page loads. */}
            <div
              aria-hidden="true"
              className="relative h-36 w-2 overflow-hidden rounded-pill border border-rule shadow-cut"
            >
              <motion.div
                style={{ scaleY: fill }}
                className="absolute inset-x-0 bottom-0 h-full origin-bottom rounded-pill bg-seal"
              />
            </div>

            <motion.span className="font-label text-xs uppercase tracking-[0.14em] text-ink">
              {percent}
              <span className="text-ink-soft">%</span>
            </motion.span>

            <p className="font-label text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Amit Modi &amp; Co.
            </p>
            <p
              className="marginalia"
              style={{ "--rot": "-3deg" } as CSSProperties}
            >
              the books are balancing…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
