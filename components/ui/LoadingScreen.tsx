/*
 * LoadingScreen.tsx — the boot overlay.
 *
 * THE THREE LAYERS, in the order the visitor perceives them:
 *
 *   1. THE KNIGHT   One 3D model, dead centre (owned by ChatLauncher). During
 *                   boot it fills with brass from the feet up. The part not yet
 *                   loaded is a faint empty ghost. Model3D renders this as two
 *                   copies of the same geometry — a frosted ghost and a solid
 *                   brass copy clipped at a plane that rises with `bootFill`.
 *   2. THE VEIL     A frosted pane over the whole page at z-35 — BELOW the
 *                   knight at z-40, so the knight is never blurred. Everything
 *                   else is.
 *   3. THE PAGE     Already rendered underneath, present from the first frame.
 *
 * When the fill completes, the veil lifts and the page is simply there.
 *
 * ─── WHY THIS IS NOT AnimatePresence ─────────────────────────────────────────
 * It was, and the veil got STUCK at opacity 0.576 — frozen mid-exit, forever,
 * with the scroll already unlocked. The page sat permanently behind a half-lifted
 * blur. An exit animation that can be interrupted is fine for a card; for a boot
 * overlay it is catastrophic, because the failure mode is "the whole site looks
 * broken" and the visitor has no way out.
 *
 * So the reveal is now a plain CSS opacity transition on a mounted element, with
 * THREE independent paths to removal: transitionend, a timer matched to the
 * transition, and a hard safety timer from mount. Any one of them clears it.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { DUR, EASE, useReducedMotion } from "@/lib/motion";
import { bootFill, setBootReadyHandler } from "@/lib/boot";

/** Shortest acceptable boot, so a warm cache still reads as a deliberate beat. */
const MIN_BOOT_MS = 1100;

/** Nothing reported? Clear the veil anyway. A broken model must never leave the
    page veiled. */
const SAFETY_MS = 5000;

/** Must match the CSS transition duration below. */
const FADE_MS = 700;

export default function LoadingScreen() {
  const reduced = useReducedMotion();
  const [target, setTarget] = useState(8);
  const [knightReady, setKnightReady] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const bootStart = useRef(0);

  /* Drive the knight's fill. `animate` writes the MotionValue directly, so the
     model never causes a React render. */
  useEffect(() => {
    const controls = animate(bootFill, target / 100, {
      duration: reduced ? 0 : DUR.base,
      ease: EASE,
    });
    return controls.stop;
  }, [target, reduced]);

  /* Boot milestones — the fill is the story of the page coming up. */
  useEffect(() => {
    bootStart.current = performance.now();
    bootFill.set(0);

    const raf = requestAnimationFrame(() => setTarget((t) => Math.max(t, 12)));

    const onReady = () => setTarget((t) => Math.max(t, 42));
    if (document.readyState !== "loading") onReady();
    else document.addEventListener("readystatechange", onReady);

    const glb = setInterval(() => {
      const hit = performance
        .getEntriesByType("resource")
        .some((r) => r.name.includes("knight-brass.glb"));
      if (hit) {
        setTarget((t) => Math.max(t, 68));
        clearInterval(glb);
      }
    }, 150);

    const onLoad = () => setTarget(100);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    const safety = setTimeout(() => {
      setKnightReady(true);
      setTarget(100);
    }, SAFETY_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(glb);
      clearTimeout(safety);
      document.removeEventListener("readystatechange", onReady);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  /* The knight's first rendered frame is the last thing worth waiting on. */
  useEffect(() => {
    setBootReadyHandler(() => {
      setKnightReady(true);
      setTarget(100);
    });
    return () => setBootReadyHandler(null);
  }, []);

  /* Fill complete AND knight real → hold the minimum beat → start the fade. */
  useEffect(() => {
    if (target < 100 || !knightReady || fading) return;
    const hold = Math.max(0, MIN_BOOT_MS - (performance.now() - bootStart.current));
    const t = setTimeout(() => setFading(true), hold);
    return () => clearTimeout(t);
  }, [target, knightReady, fading]);

  /* Removal, belt and braces. Whichever fires first wins; the others no-op. */
  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setGone(true), reduced ? 0 : FADE_MS + 120);
    return () => clearTimeout(t);
  }, [fading, reduced]);

  /* Hard floor: no matter what the state machine does, the veil is gone by
     SAFETY_MS + the fade. This is the guarantee the previous version lacked. */
  useEffect(() => {
    const t = setTimeout(() => setGone(true), SAFETY_MS + FADE_MS + 400);
    return () => clearTimeout(t);
  }, []);

  /* Hold the page still behind the veil, and release the moment it lifts. */
  useEffect(() => {
    if (gone) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={() => setGone(true)}
      style={{
        opacity: fading ? 0 : 1,
        transition: reduced ? "none" : `opacity ${FADE_MS}ms cubic-bezier(0.16,1,0.3,1)`,
      }}
      className="pointer-events-none fixed inset-0 z-[35] bg-paper/40 backdrop-blur-md"
    />
  );
}
