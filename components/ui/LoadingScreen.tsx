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

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { EASE, useReducedMotion } from "@/lib/motion";
import { bootFill, setBootReadyHandler } from "@/lib/boot";

/** How long the brass takes to climb the knight. Long enough to watch, short
    enough that nobody waits for it. This is the whole point of the boot. */
const FILL_MS = 1500;

/** A beat on the completed knight before the veil lifts. */
const SETTLE_MS = 380;

/** Nothing reported? Clear the veil anyway. A broken model must never leave the
    page veiled. */
const SAFETY_MS = 6000;

/** Must match the CSS transition duration below. */
const FADE_MS = 700;

export default function LoadingScreen() {
  const reduced = useReducedMotion();
  const [knightReady, setKnightReady] = useState(false);
  const [filled, setFilled] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  /*
   * THE ORDER MATTERS, and it was wrong before.
   *
   * The fill used to be driven by loading milestones (first paint, DOM ready,
   * .glb seen, window load). On any warm load those all fire within a few
   * hundred milliseconds — while the knight's canvas has not mounted yet. So
   * the fill animated a model that did not exist, finished before it appeared,
   * and the visitor saw exactly what you described: a blurred page, then a
   * fully-formed knight popping in, then the blur leaving. No filling.
   *
   * Now the sequence is explicit:
   *   1. veil up, page blurred, fill pinned at 0
   *   2. wait for the knight's first REAL rendered frame
   *   3. only then animate the fill 0 → 1 over FILL_MS, so it is always seen
   *   4. fill complete → lift the veil
   *
   * The fill is no longer a progress bar. It is the boot.
   */
  useEffect(() => {
    bootFill.set(0);
    setBootReadyHandler(() => setKnightReady(true));
    return () => setBootReadyHandler(null);
  }, []);

  /* The knight is real — now fill it, at a pace a person can watch. */
  useEffect(() => {
    if (!knightReady) return;
    if (reduced) {
      bootFill.set(1);
      setFilled(true);
      return;
    }
    const controls = animate(bootFill, 1, {
      duration: FILL_MS / 1000,
      ease: EASE,
      onComplete: () => setFilled(true),
    });
    return controls.stop;
  }, [knightReady, reduced]);

  /* Filled → hold a beat so the completed knight registers → lift the veil. */
  useEffect(() => {
    if (!filled) return;
    const t = setTimeout(() => setFading(true), reduced ? 0 : SETTLE_MS);
    return () => clearTimeout(t);
  }, [filled, reduced]);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setGone(true), reduced ? 0 : FADE_MS + 120);
    return () => clearTimeout(t);
  }, [fading, reduced]);

  /* Hard floor. A .glb that never loads must never leave the page veiled —
     fill it anyway and get out of the way. */
  useEffect(() => {
    const t = setTimeout(() => {
      bootFill.set(1);
      setFading(true);
    }, SAFETY_MS);
    const hard = setTimeout(() => setGone(true), SAFETY_MS + FADE_MS + 400);
    return () => {
      clearTimeout(t);
      clearTimeout(hard);
    };
  }, []);

  /* Hold the page still behind the veil; release the moment it lifts. */
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
