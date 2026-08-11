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

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
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

/*
 * Docked size and inset.
 *
 * Bigger and tighter into the corner on a phone, deliberately. On mobile this
 * knight is the ONLY way to reach the assistant — there is no hover, no
 * secondary affordance — so it has to be an obvious, comfortable tap target.
 * On a desktop it can afford to be a quieter mark, because the whole header is
 * also available.
 *
 * The inset is smaller on a phone too: 22px of margin on a 390px screen eats a
 * visible slice of the corner and made the knight read as floating loose in the
 * page rather than parked in it.
 */
const DOCK_PX_MOBILE = 104;
const DOCK_PX_DESKTOP = 84;
const DOCK_INSET_MOBILE = 12;
const DOCK_INSET_DESKTOP = 22;

/** How long the "ask me anything" note holds after the knight parks. Long
    enough to read on a phone, short enough that it is never furniture. */
const NUDGE_MS = 5200;

/*
 * Where the knight rests when docked, and how far it must shrink to get there.
 *
 * Both are MEASURED, never guessed. The previous version seeded the offset with
 * a hardcoded {x:320,y:320}: the first render aimed the knight at that invented
 * point and the effect then snapped it to the real corner — the visible glitch
 * on load and on every resize.
 *
 * `ready` gates the travel entirely, so nothing moves until real numbers exist.
 *
 * The scale is derived from the live wrapper width so the docked knight is
 * DOCK_PX across everywhere. Scaling a vw-sized box by a constant gave ~98px on
 * a desktop and ~44px on a phone — the same code producing a comfortable button
 * on one device and an unhittable speck on another.
 */
function useDock(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  const [dock, setDock] = useState({
    x: 0,
    y: 0,
    scale: 0.2,
    size: DOCK_PX_DESKTOP,
    inset: DOCK_INSET_DESKTOP,
    ready: false,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const w = wrapperRef.current?.offsetWidth ?? 0;
      if (w === 0) return;
      const mobile = window.innerWidth < 640;
      const size = mobile ? DOCK_PX_MOBILE : DOCK_PX_DESKTOP;
      const inset = mobile ? DOCK_INSET_MOBILE : DOCK_INSET_DESKTOP;
      const half = size / 2;
      setDock({
        x: window.innerWidth / 2 - inset - half,
        y: window.innerHeight / 2 - inset - half,
        scale: size / w,
        size,
        inset,
        ready: true,
      });
    };
    measure();
    /* ResizeObserver catches the wrapper's own vw-driven resize, which a window
       resize listener alone misses during font/layout settling. */
    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [wrapperRef]);

  return dock;
}

export default function ChatLauncher() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dock = useDock(wrapperRef);

  /*
   * The knight only takes the centre of the screen on the HOME page — that is
   * the one place the hero is built around it. Everywhere else those pages
   * open with their own headline and the knight would simply be a 3D object
   * sitting on top of the copy, so it starts parked in the corner and stays
   * there: same object, same click, same scroll-driven turn, no travel.
   */
  const pathname = usePathname();
  const isHome = pathname === "/";

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
  /* 0 → 0.18 of the page carries the knight from the hero centre to the corner.
     Widened from 0.12: over 12% the shrink was abrupt enough to read as a snap,
     and mid-journey the knight sat squarely on the body copy. */
  const x = useTransform(scrollYProgress, [0, 0.18], [0, dock.x]);
  const y = useTransform(scrollYProgress, [0, 0.18], [0, dock.y]);
  const scale = useTransform(scrollYProgress, [0, 0.18], [1, dock.scale]);
  /* Docked from the first frame on inner pages, so the turn is spread across
     the whole page instead of being crammed into the first 18%. */
  const spin = useTransform(
    scrollYProgress,
    isHome ? [0, 0.18, 1] : [0, 1],
    isHome ? [0, 1, 5] : [0, 4],
  );

  /* One render path for everyone. An inner page — or reduced motion anywhere —
     keeps the exact same knight and the exact same resting spot; it simply
     starts there, without the travel. Numbers substitute the motion values;
     hooks stay unconditional. */
  const staticStyle = { x: dock.x, y: dock.y, scale: dock.scale };

  /* Until the dock is measured, the knight simply stays where it starts. Moving
     it toward invented coordinates and correcting afterwards is exactly the
     glitch this replaces. */
  const travelling = isHome && dock.ready && !reduced;
  /* Parked = already in the corner and not going anywhere: every inner page,
     plus reduced-motion on the home page. */
  const parked = dock.ready && !travelling;

  /*
   * THE AFFORDANCE.
   *
   * A 3D chess knight in a corner does not announce that it is a chat button,
   * and a floating pill with a speech bubble would undo the whole cover. So the
   * cue is written in the language this site already speaks everywhere else:
   * marginalia — a handwritten note in the margin, with a rule pointing at the
   * thing it annotates.
   *
   * It shows itself once the knight reaches the corner, holds long enough to
   * read, then gets out of the way. On a desktop it comes back on hover, so the
   * answer is always one gesture away; on a phone (no hover) the opening
   * appearance is the whole cue, which is why it holds longer than a tooltip
   * would.
   */
  const [docked, setDocked] = useState(!isHome);
  const [nudge, setNudge] = useState(false);
  const [hovered, setHovered] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isHome) setDocked(v >= 0.17);
  });

  useEffect(() => {
    if (!docked || !dock.ready) return;
    setNudge(true);
    const t = setTimeout(() => setNudge(false), NUDGE_MS);
    return () => clearTimeout(t);
  }, [docked, dock.ready]);

  const showHint = dock.ready && docked && !open && (nudge || hovered);

  return (
    <>
      {/* The note is a SIBLING of the knight, not a child: the knight's wrapper
          is scaled down to a fraction of its hero size, and anything inside it
          would be scaled — and blurred — with it. Positioned off the same
          measured dock box so it always sits beside the knight, at any size. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-40 flex items-center gap-1.5"
        style={{
          right: dock.inset + dock.size + 6,
          bottom: dock.inset + dock.size / 2 - 14,
          opacity: showHint ? 1 : 0,
          transform: showHint ? "translateX(0)" : "translateX(6px)",
          transition: reduced
            ? "none"
            : "opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span className="whitespace-nowrap font-margin text-[1.05rem] leading-none text-ink-soft">
          ask me anything
        </span>
        {/* a drawn rule into the knight, the way a margin note points at a line */}
        <svg viewBox="0 0 26 8" className="h-2 w-6 shrink-0 text-seal" fill="none">
          <path
            d="M0 4h21M17.5 1l3.5 3-3.5 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
        <motion.div
          ref={wrapperRef}
          style={{
            x: travelling ? x : parked ? staticStyle.x : 0,
            y: travelling ? y : parked ? staticStyle.y : 0,
            scale: travelling ? scale : parked ? staticStyle.scale : 1,
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
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
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