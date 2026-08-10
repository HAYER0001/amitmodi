/*
 * LoadingScreen.tsx — the boot overlay.
 *
 * There is no loading screen, no gauge, no percent, no second knight. The chat
 * launcher's one 3D knight sits dead-centre and the boot overlay is a
 * translucent frosted pane over the whole page (z-35 — BELOW the knight at
 * z-40, so the knight itself is never blurred). As the page loads, the knight
 * fills itself with brass from the feet up: this screen drives `bootFill`
 * (lib/boot.ts) through the boot milestones, waits until the knight's model
 * has really rendered (Model3D.onReady), holds the pane for a minimum beat,
 * then fades the frosted veil away — revealing the page already under it.
 *
 * The pane never sits between the visitor and the content; it sits over it,
 * translucent, so the page is present from the first frame and the load reads
 * as the knight filling and the veil lifting — not as waiting on a spinner.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { DUR, EASE, useReducedMotion } from "@/lib/motion";
import { bootFill, setBootReadyHandler } from "@/lib/boot";

/** Shortest acceptable boot, even when everything resolves instantly. */
const MIN_BOOT_MS = 1200;

/** Give up and clear the pane if nothing has been reported after this long —
    a broken model or a hang must never leave the page veiled forever. */
const SAFETY_MS = 6000;

export default function LoadingScreen() {
  const reduced = useReducedMotion();
  /* 0..100 here; converted to 0..1 for the knight's fill. */
  const [target, setTarget] = useState(8);
  const [knightReady, setKnightReady] = useState(false);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const bootStart = useRef(0);

  /* Keep bootFill pointed at the current milestone, eased. `animate` drives a
     MotionValue directly, so the knight never triggers React renders. */
  useEffect(() => {
    const controls = animate(bootFill, target / 100, {
      duration: reduced ? 0 : DUR.base,
      ease: EASE,
    });
    return controls.stop;
  }, [target, reduced]);

  /* Boot milestones. The fill is a story of the page coming up: a little at
     first paint, more at DOM-ready, more once the knight's .glb is in the
     resource timeline, and 100 when the window load event fires. */
  useEffect(() => {
    bootStart.current = performance.now();
    /* Hot-reload safety: this screen may remount without the page remounting. */
    bootFill.set(0);

    const raf = requestAnimationFrame(() =>
      setTarget((t) => Math.max(t, 12)),
    );

    const onReady = () => setTarget((t) => Math.max(t, 42));
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      onReady();
    } else {
      document.addEventListener("readystatechange", onReady);
    }

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
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

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

  /* The knight is the only thing left to wait on — the overlay holds until
     Model3D's first rendered frame (via ChatLauncher → notifyKnightReady). */
  useEffect(() => {
    setBootReadyHandler(() => {
      setKnightReady(true);
      setTarget((t) => Math.max(t, 100));
    });
    return () => setBootReadyHandler(null);
  }, []);

  /* The reveal: fill complete AND the knight real, then hold for the minimum
     beat and lift the veil. */
  useEffect(() => {
    if (target < 100 || !knightReady) return;
    const hold = Math.max(0, MIN_BOOT_MS - (performance.now() - bootStart.current));
    const t = setTimeout(() => setDone(true), hold);
    return () => clearTimeout(t);
  }, [target, knightReady]);

  /* While booting, the page sits still behind the veil — lock the scroll. */
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
          aria-hidden="true"
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : DUR.slow, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-[35] bg-paper/40 backdrop-blur-md"
        />
      )}
    </AnimatePresence>
  );
}
