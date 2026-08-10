"use client";

/*
 * ChatLauncher.tsx — the brass knight IS the chat button, in 3D, end to end.
 *
 * One instance of the 3D knight, mounted once on every page, starts in the
 * exact hero position (dead centre, overlapping the headline). The moment the
 * visitor scrolls it detaches: it rotates on all three axes — a full 3D turn,
 * not a 2D slide — shrinks, and settles into the bottom-right corner where it
 * stays, still 3D and still slowly turning, as the chat stamp. Clicking it at
 * any size opens the tax assistant (ChatPanel → /api/ask).
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
     hero to the corner. Repeated rotation on ALL axes — rotateY makes a full
     turn — is the same journey in 3D, never a flattened substitute. Past
     0.12 it stays put; only the idle spin continues inside the canvas. */
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.12], [0, corner.x]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, corner.y]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.2]);
  const rotateX = useTransform(scrollYProgress, [0, 0.12], [0, -35]);
  const rotateY = useTransform(scrollYProgress, [0, 0.12], [0, 360]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.12], [0, -18]);

  /* One render path for everyone. Reduced motion keeps the exact same knight
     and the exact same resting spot — it simply starts there, without the
     travel. Numbers substitute the motion values; hooks stay unconditional. */
  const staticStyle = {
    x: corner.x,
    y: corner.y,
    scale: 0.2,
    rotateX: -35,
    rotateY: 360,
    rotateZ: -18,
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40">
        <motion.div
          style={{
            x: reduced ? staticStyle.x : x,
            y: reduced ? staticStyle.y : y,
            scale: reduced ? staticStyle.scale : scale,
            rotateX: reduced ? staticStyle.rotateX : rotateX,
            rotateY: reduced ? staticStyle.rotateY : rotateY,
            rotateZ: reduced ? staticStyle.rotateZ : rotateZ,
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
            {/* No fallbackImage: Model3D renders its shimmer while the .glb
            loads — the seal never appears here and nothing ever takes the
            knight's place. */}
            <Knight
              src="/models/knight-brass.glb"
              rotationSpeed={0.12}
              className="relative h-full w-full"
            />
          </button>
        </motion.div>
      </div>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}