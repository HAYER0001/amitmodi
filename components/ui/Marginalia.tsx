/*
 * Marginalia.tsx — decorative handwritten captions scattered around a figure.
 *
 * Deterministic on server AND client: placement is derived from the same seed
 * via a tiny seeded PRNG, so SSR markup matches the client and there is no
 * hydration mismatch or layout shift.
 */

import type { CSSProperties } from "react";
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

export default function Marginalia({ count, seed, exclude, className = "" }: MarginaliaProps) {
  const items = pickMarginalia(count, seed);

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
          <span key={`${seed}-${index}`} className="marginalia absolute" style={style}>
            {text}
          </span>
        );
      })}
    </div>
  );
}