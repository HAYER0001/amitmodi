"use client";

/*
 * ChatLauncher.tsx — the brass knight IS the chat button.
 *
 * One instance of the 3D knight, mounted once on every page, starts in the
 * exact hero position (dead centre, overlapping the headline). The moment the
 * visitor scrolls it detaches: it rotates on all three axes, shrinks, and
 * settles into the bottom-right corner where it stays as the chat stamp.
 * Clicking it — at any size, in the hero or in the corner — opens the tax
 * assistant (ChatPanel → /api/ask).
 *
 * Motion rules: transform/opacity only, the project easing, and the corner
 * stamp (no knight, no travel) under prefers-reduced-motion. The hero no
 * longer renders its own knight — there is exactly one instance.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { ASSETS } from "@/data/assets";
import ChatPanel from "./ChatPanel";

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
     hero to the corner. Past that point it stays put — nothing loops. */
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.12], [0, corner.x]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, corner.y]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.2]);
  const rotateX = useTransform(scrollYProgress, [0, 0.12], [0, -35]);
  const rotateY = useTransform(scrollYProgress, [0, 0.12], [0, 200]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.12], [0, -18]);
  const badgeOpacity = useTransform(scrollYProgress, [0.07, 0.12], [0, 1]);

  if (reduced) {
    /* Reduced motion: no knight, no travel — just the corner stamp. */
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask the tax assistant"
          className="fixed bottom-24 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-seal p-3 text-paper shadow-cut transition-colors hover:bg-seal-deep lg:bottom-5"
        >
          <ChatGlyph />
        </button>
        <ChatPanel open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40">
        <motion.div
          style={{
            x,
            y,
            scale,
            rotateX,
            rotateY,
            rotateZ,
            transformOrigin: "center bottom",
            transformPerspective: 1000,
          }}
          initial={false}
          className="pointer-events-auto absolute left-1/2 top-1/2 aspect-square w-[56vw] max-w-[540px] sm:w-[42vw] lg:w-[34vw]"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask the tax assistant"
            className="block h-full w-full"
            style={{ transform: "translate(-50%, -56%)" }}
          >
            <Knight
              src="/models/knight-brass.glb"
              fallbackImage={ASSETS["cut-brass-seal"].src}
              rotationSpeed={0.12}
              className="relative h-full w-full"
            />
          </button>
        </motion.div>

        {/* Chat badge — visible only once the knight has shrunk to the corner,
        where the small brass figure alone does not read as chat. */}
        <motion.div
          style={{ opacity: badgeOpacity }}
          aria-hidden="true"
          className="pointer-events-none fixed bottom-9 right-8 grid h-12 w-12 place-items-center rounded-full bg-seal text-paper shadow-cut lg:bottom-6"
        >
          <ChatGlyph />
        </motion.div>
      </div>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ChatGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H4l2.3-3.5A8 8 0 1 1 21 12Z" />
      <path d="M8.5 10.5h7" />
      <path d="M8.5 13.5h4.5" />
    </svg>
  );
}