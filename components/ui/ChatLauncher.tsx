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

/*
 * Docked size and inset.
 *
 * The scroll shrink has to STOP somewhere you can still see the thing. It used
 * to end at 76px on every device, which on a desktop is a smudge in the corner
 * — the object the whole page is built around, reduced to something you would
 * not notice, let alone click. These sizes are the floor of the shrink, and
 * they are chosen to stay unmistakably legible: the knight is still readable as
 * a knight when it lands.
 *
 * The inset is tighter on a phone: 22px of margin on a 390px screen eats a
 * visible slice of the corner and made the knight read as floating loose in the
 * page rather than parked in it.
 */
const DOCK_PX_MOBILE = 116;
const DOCK_PX_DESKTOP = 132;
const DOCK_INSET_MOBILE = 12;
const DOCK_INSET_DESKTOP = 22;

/** Resting opacity of the margin note. Quiet enough to read as an annotation
    rather than a UI chip, strong enough to actually be read. */
const HINT_OPACITY = 0.72;

/*
 * How far the visitor scrolls, IN PIXELS, to carry the knight from the hero to
 * the corner.
 *
 * This used to be a fraction of scroll PROGRESS (0 → 0.18 of the page). That is
 * what made the docked knight change size on its own. Progress is
 * scrollY / (pageHeight - viewport), so it moves whenever the PAGE moves — a
 * lazy image landing, a font settling, the pinned horizontal section resolving,
 * the browser's own scroll anchoring. The knight would be parked in the corner,
 * nobody touching the page, and its scale would be silently re-derived from a
 * denominator that had shifted underneath it: it grew and shrank on its own,
 * which is exactly what "it gets smaller when I hover over it" looked like.
 *
 * Pixels cannot drift. Seven tenths of a viewport is the same distance whether
 * the page is a short contact form or the long home page, so the knight also
 * now docks after the same amount of scrolling on every route.
 */
const TRAVEL_VH = 0.7;
const TRAVEL_MIN_PX = 320;

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
    travel: TRAVEL_MIN_PX,
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
        travel: Math.max(TRAVEL_MIN_PX, window.innerHeight * TRAVEL_VH),
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

  /* The wrapper only translates + scales — the plane stays face-on. The 3D turn
     lives INSIDE the canvas, so the knight is still visibly turning every time
     the visitor scrolls, even docked on the right; scrolling back turns it
     back. While the chat is open the knight steps aside (fades out) and returns
     the moment the chat closes. */
  const { scrollY, scrollYProgress } = useScroll();

  /* WHERE and HOW BIG ride absolute scroll distance (dock.travel, in pixels),
     so nothing the page does to its own height can move or resize the parked
     knight. See the TRAVEL_VH note above — this is the fix for the knight
     changing size on its own while sitting in the corner. */
  const x = useTransform(scrollY, [0, dock.travel], [0, dock.x]);
  const y = useTransform(scrollY, [0, dock.travel], [0, dock.y]);
  const scale = useTransform(scrollY, [0, dock.travel], [1, dock.scale]);

  /* The TURN, by contrast, is deliberately proportional to the page: a long
     page should turn the knight further than a short one. Nothing about the
     rotation affects its size, so page-height drift is harmless here. */
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
   * It is simply THERE, quietly, the whole time the knight is parked, and it is
   * driven by a PLAIN scroll listener rather than by framer.
   *
   * Four framer-based versions of this failed, each differently: a timed nudge
   * that raced the dock measurement, a useTransform range that would not clamp,
   * a `cond ? motionValue : 0` style that bound the element to the static 0 it
   * saw on its first render, and a transform callback that captured
   * `dock.ready === false` in its closure and never saw it flip. The knight
   * needs framer because it animates continuously; a label that is either shown
   * or not does not, and every attempt to route it through the same machinery
   * bought a new bug.
   *
   * A native listener with an immediate first read has none of those problems.
   * It is correct on mount — so someone arriving mid-page from a hash link or a
   * restored scroll position still gets the cue — correct after every scroll,
   * and correct after a resize.
   */
  const [docked, setDocked] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    const read = () => setDocked(window.scrollY >= dock.travel * 0.96);
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [isHome, dock.travel]);

  const showHint = dock.ready && docked && !open;

  return (
    <>
      {/* The note is a SIBLING of the knight, not a child: the knight's wrapper
          is scaled down to a fraction of its hero size, and anything inside it
          would be scaled — and blurred — with it. Positioned off the same
          measured dock box so it always sits beside the knight, at any size. */}
      <div
        aria-hidden="true"
        /* Frosted, like the menus. The note is fixed, so whatever the visitor
           scrolls past ends up behind it — including 60px headlines, where
           plain text on text read as a rendering fault rather than an
           annotation. A soft paper wash lifts it off the page just enough to
           stay legible over anything, without becoming a tooltip. */
        className="pointer-events-none fixed z-40 flex items-center gap-1.5 rounded-full bg-paper/70 py-1 pl-3 pr-2.5 backdrop-blur-sm"
        style={{
          /* Anchored to the HORSE, not to the box. The canvas keeps a margin
             of empty space around the model, so measuring off the box edge left
             the note floating a long way from the thing it points at. */
          right: dock.inset + dock.size - 26,
          bottom: dock.inset + dock.size / 2 - 16,
          opacity: showHint ? HINT_OPACITY : 0,
          transition: reduced ? "none" : "opacity 360ms cubic-bezier(0.16,1,0.3,1)",
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
          className="pointer-events-auto aspect-square w-[40vw] max-w-[380px] sm:w-[30vw] lg:w-[24vw]"
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