"use client";

/*
 * Marginalia.tsx — pencil statute references, scattered as page texture.
 *
 * Deterministic on server AND client: placement comes from the same seed via a
 * tiny seeded PRNG, so SSR markup matches the client and there is no hydration
 * mismatch or layout shift.
 *
 * THE NOTES REACT TO THE CURSOR.
 * Each note drifts on its own slow sine, and pushes away from the pointer with
 * a distance falloff — near the cursor they scatter, far from it they settle.
 * That is what makes the page feel like a physical surface rather than a
 * screenshot: the texture acknowledges you.
 *
 * Everything is done in ONE requestAnimationFrame loop writing transforms
 * directly, for three reasons:
 *   1. React state per pointer move would re-render 18 nodes at 60fps.
 *   2. A CSS keyframe animation on transform would fight the JS transform —
 *      last writer wins and the result stutters. So the drift moved into the
 *      same loop rather than living in CSS.
 *   3. transform and opacity are the only compositor-only properties; nothing
 *      here can trigger layout, so it cannot show up in INP.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { pickMarginalia } from "@/data/marginalia";

/** A rectangle, in viewport percentages, that marginalia must stay clear of. */
export type ExcludeZone = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

/* Covers the left-aligned headline, subhead and CTA block of a typical hero.
   Callers with a different layout pass their own. */
const DEFAULT_EXCLUDE: ExcludeZone = { top: 24, left: 2, right: 62, bottom: 84 };

type MarginaliaProps = {
  /** Number of marginalia items to scatter. */
  count: number;
  /** Seed — same seed ⇒ same positions. */
  seed: number;
  /** Rectangle the copy occupies; nothing is placed inside it. */
  exclude?: ExcludeZone;
  className?: string;
};

/* mulberry32 — small, seedable, good enough scatter. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Per-item seeds stay fixed as long as count doesn't change, and items keep
 * their position even when siblings are added. */
function itemSeed(base: number, index: number) {
  return (Math.imul(base, 0x9e3779b1) ^ Math.imul(index + 1, 0x85ebca6b)) >>> 0;
}


/*
 * The cursor field.
 *
 * One rAF loop drives every note in this field: a slow personal sine (so the
 * page breathes when nobody is touching it) plus a repulsion from the pointer
 * that falls off with distance.
 */
function useCursorField(count: number) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    /* Touch devices have no hovering pointer, so repulsion would never fire and
       the loop would burn frames for nothing. Drift-only there via CSS is
       cheaper; skip the loop entirely. */
    const fine = window.matchMedia?.("(pointer: fine)").matches ?? true;
    if (!fine) return;

    const notes = Array.from(
      field.querySelectorAll<HTMLElement>(".marginalia"),
    );
    if (notes.length === 0) return;

    const pointer = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    /* Current offset per note, eased toward the target each frame so notes
       glide back rather than snapping when the cursor leaves. */
    const cur = notes.map(() => ({ x: 0, y: 0 }));

    const RADIUS = 260;   // px within which a note notices the cursor
    const STRENGTH = 46;  // px of maximum displacement

    let raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const time = t / 1000;

      for (let i = 0; i < notes.length; i += 1) {
        const el = notes[i];
        const r = el.getBoundingClientRect();

        /* Skip anything off-screen. On a long page most notes are, and
           measuring them is the only per-frame cost worth avoiding. */
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const dist = Math.hypot(dx, dy);

        let tx = 0;
        let ty = 0;
        if (dist < RADIUS) {
          /* Squared falloff: a note right under the cursor moves a lot, one at
             the edge of the radius barely twitches. Linear falloff reads as a
             mechanical push; squared reads as a field. */
          const force = (1 - dist / RADIUS) ** 2 * STRENGTH;

          /*
           * Direction breaks down at the centre.
           *
           * With the cursor exactly on a note, dx and dy are ~0 and dx/dist is
           * meaningless — so the note that should be shoved hardest instead sat
           * still. Below a few pixels, fall back to a fixed per-note angle so it
           * always escapes, and always in the same direction (a random angle
           * would make it jitter as the cursor crossed the centre).
           */
          if (dist < 4) {
            const angle = i * 2.399963; // golden angle — spreads neighbours apart
            tx = Math.cos(angle) * force;
            ty = Math.sin(angle) * force;
          } else {
            tx = (dx / dist) * force;
            ty = (dy / dist) * force;
          }
        }

        /* Personal drift — mismatched periods so no two notes ever sync. */
        const phase = i * 1.7;
        tx += Math.sin(time * 0.35 + phase) * 4;
        ty += Math.cos(time * 0.27 + phase) * 5;

        /* Ease toward the target. Frame-rate independent, so this behaves the
           same on a 60Hz and a 120Hz display. */
        const k = 0.12;
        cur[i].x += (tx - cur[i].x) * k;
        cur[i].y += (ty - cur[i].y) * k;

        el.style.transform = `translate3d(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px, 0)`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      notes.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, [count]);

  return fieldRef;
}

export default function Marginalia({ count, seed, exclude, className = "" }: MarginaliaProps) {
  const items = pickMarginalia(count, seed);
  const fieldRef = useCursorField(count);

  /*
   * Keep-out zone.
   *
   * Marginalia are page texture, not obstruction. Scattered blind, they land on
   * top of the headline and the result reads as a rendering fault rather than as
   * annotation — the reference always keeps its chess notation clear of the
   * display type. `exclude` marks the rectangle the main copy occupies; any
   * point landing inside it is pushed out to the nearest side rather than
   * resampled, so placement stays deterministic (server and client must agree
   * or React throws a hydration mismatch).
   */
  const zone = exclude ?? DEFAULT_EXCLUDE;

  const scattered = items.map((_, index) => {
    const rand = mulberry32(itemSeed(seed, index));
    let top = 6 + Math.floor(rand() * 78); // 6–84%
    let left = 4 + Math.floor(rand() * 80); // 4–84%
    const rotate = Math.round((rand() * 14 - 7) * 10) / 10; // ±7°

    const insideX = left > zone.left && left < zone.right;
    const insideY = top > zone.top && top < zone.bottom;
    if (insideX && insideY) {
      // Push out along whichever axis needs the smaller move.
      const dxLeft = left - zone.left;
      const dxRight = zone.right - left;
      const dyTop = top - zone.top;
      const dyBottom = zone.bottom - top;
      const minDx = Math.min(dxLeft, dxRight);
      const minDy = Math.min(dyTop, dyBottom);
      /*
       * If the keep-out zone reaches the left edge there IS no room on that
       * side — pushing "out" to the left just drops the note back on top of the
       * copy, which is exactly what was happening on the service pages. When
       * the zone starts within 8% of the edge, always push right.
       */
      const leftHasRoom = zone.left > 8;
      if (minDx <= minDy) {
        left =
          leftHasRoom && dxLeft < dxRight
            ? Math.max(2, zone.left - 3)
            : Math.min(94, zone.right + 3);
      } else {
        top = dyTop < dyBottom ? Math.max(3, zone.top - 4) : Math.min(94, zone.bottom + 4);
      }
    }

    return { top, left, rotate };
  });

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className={`pointer-events-none select-none font-margin ${className}`}
    >
      {items.map((text, index) => {
        const s = scattered[index];
        const style = {
          top: `${s.top}%`,
          left: `${s.left}%`,
          "--rot": `${s.rotate}deg`,
        } as CSSProperties;
        return (
          <span
            key={`${seed}-${index}`}
            className="marginalia absolute will-change-transform"
            style={style}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}