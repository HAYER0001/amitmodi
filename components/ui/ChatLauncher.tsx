"use client";

/*
 * ChatLauncher.tsx — the brass knight IS the chat button, in 3D, end to end.
 *
 * One instance of the 3D knight, mounted once on every page, starts in the
 * exact hero position (dead centre, overlapping the headline). The moment the
 * visitor scrolls it detaches and travels to the bottom-right corner while
 * TURNING: the turn is driven 1:1 by scroll progress — one full rotation on
 * the way to the corner, then it keeps advancing as the visitor keeps
 * scrolling, so the knight is still visibly turning while docked on the right.
 * Scrolling back turns it back. It is the chat button at any size: clicking
 * it opens the tax assistant (ChatPanel → /api/ask), the knight steps aside
 * while the chat is open, and returns the moment it closes.
 *
 * The canvas never unmounts and nothing replaces the knight: no fallback
 * image, no 2D stamp, no badge button. Under prefers-reduced-motion the same
 * knight sits static in the corner — motion degrades, the object does not.
 * The hero no longer renders its own knight — there is exactly one instance.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import ChatPanel from "./ChatPanel";
import { bootFill, notifyKnightReady } from "@/lib/boot";

/* three.js stays out of the first-paint bundle: this is the one dynamic,
   ssr:false entry point, exactly as the hero used it. */
const Knight = dynamic(() => import("@/components/ui/Model3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--rule),transparent_62%)] opacity-50"
    />
  ),
});

/* Distance from the viewport centre to where the corner stamp rests, in px.
   Measured, not guessed in CSS units, so the knight lands inside the corner
   on every screen shape. Recomputed on resize. */
function useCornerOffset() {
  const [offset, setOffset] = useState({ x: 320, y: 320 });
  useEffect(() => {
    const measure = () =>
      setOffset({
        x: window.innerWidth / 2 - 96,
        y: window.innerHeight / 2 - 88,
      });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return offset;
}

export default function ChatLauncher() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const corner = useCornerOffset();

  /* Progress 0 → 0.12 of the page carries the knight from the centre of the
     hero to the corner. The wrapper only translates + scales — the plane stays
     face-on. The 3D turn lives INSIDE the canvas: `spin` starts at one full
     turn for the hero→corner journey and then KEEPS advancing with the scroll
     for the rest of the page (one turn by the corner, up to five by the
     bottom), so the knight is still visibly turning every time the visitor
     scrolls — even docked on the right. Scrolling back reverses it.
     While the chat is open the knight steps aside (fades out) and returns the
     moment the chat closes. */
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.12], [0, corner.x]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, corner.y]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.2]);
  const spin = useTransform(scrollYProgress, [0, 0.12, 1], [0, 1, 5]);

  /* One render path for everyone. Reduced motion keeps the exact same knight
     and the exact same resting spot — it simply starts there, without the
     travel. Numbers substitute the motion values; hooks stay unconditional. */
  const staticStyle = {
    x: corner.x,
    y: corner.y,
    scale: 0.2,
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
        <motion.div
          style={{
            x: reduced ? staticStyle.x : x,
            y: reduced ? staticStyle.y : y,
            scale: reduced ? staticStyle.scale : scale,
            transformOrigin: "center center",
            /* While the chat is open the knight steps aside so it never
               overlaps the dialog; it fades back in the moment the chat
               closes. The canvas stays mounted underneath — no reload, no
               shimmer, the same object returns. */
            pointerEvents: open ? "none" : "auto",
          }}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          initial={false}
          className="pointer-events-auto aspect-square w-[56vw] max-w-[540px] sm:w-[42vw] lg:w-[34vw]"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask the tax assistant"
            className="block h-full w-full"
            /* The wrapper is already centred by flex, so no horizontal
               re-centring — that old -50% pushed the knight a half-width
               left. A gentle lift keeps it overlapping the headline while
               reading as dead-centre. */
            style={{ transform: "translateY(-4%)" }}
          >
            {/* No fallbackImage: Model3D renders its shimmer while the .glb
            loads — the seal never appears here and nothing ever takes the
            knight's place.

            fill: this is the ONE knight, and during boot it fills itself with
            brass from the feet up (see lib/boot.ts). onReady: the boot screen
            holds until this knight's first rendered frame so the reveal never
            catches a shimmer. */}
            <Knight
              src="/models/knight-brass.glb"
              rotationSpeed={0.12}
              spinDriver={spin}
              driverTurns={1}
              fill={bootFill}
              onReady={notifyKnightReady}
              className="relative h-full w-full"
            />
          </button>
        </motion.div>
      </div>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}