"use client";

/*
 * ChatLauncher.tsx — the scroll-driven chat launcher.
 *
 * At the top of the page it hangs as a full paper slip on the right edge,
 * slightly rotated, inviting a question. As the visitor scrolls, the slip
 * rotates upright, shrinks, and settles into the bottom-right corner as a
 * compact stamp — the FAB. Clicking it at any size opens the tax assistant
 * (ChatPanel), which talks to /api/ask.
 *
 * The whole journey is transform/opacity only (INP-safe), uses the one
 * project easing curve, and collapses to the corner stamp immediately under
 * prefers-reduced-motion. The scroll hooks still run unconditionally, mirror
 * ScrollScale: returning the static branch without the motion values would
 * leave Framer's listeners attached to a node that never exists.
 */

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import ChatPanel from "./ChatPanel";

export default function ChatLauncher() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  /* Progress 0 → 0.12 of the page brings the slip home to the corner. Past
     that it stays put — no further motion, nothing loops. */
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.12], ["-44vh", "0vh"]);
  const rotate = useTransform(scrollYProgress, [0, 0.12], [-7, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.6]);
  const labelOpacity = useTransform(scrollYProgress, [0.03, 0.09], [1, 0]);

  if (reduced) {
    /* Reduced motion: the corner stamp, static. */
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the tax assistant"
          className="fixed bottom-24 right-4 z-40 inline-flex h-14 w-14 lg:bottom-5 items-center justify-center rounded-full bg-seal text-paper shadow-cut transition-colors hover:bg-seal-deep"
        >
          <ChatGlyph />
        </button>
        <ChatPanel open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask the tax assistant"
        style={{
          y,
          rotate,
          scale,
          transformOrigin: "bottom right",
        }}
        initial={false}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-3 lg:bottom-5 will-change-transform"
      >
        <motion.span
          style={{ opacity: labelOpacity }}
          className="rounded-md border border-rule bg-paper px-4 py-2.5 text-left shadow-cut"
        >
          <span className="block font-label text-xs uppercase tracking-[0.14em] text-seal">
            Tax question?
          </span>
          <span className="block font-margin text-base text-ink">
            ask me — it answers
          </span>
        </motion.span>
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-seal text-paper shadow-cut transition-colors hover:bg-seal-deep">
          <ChatGlyph />
        </span>
      </motion.button>
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