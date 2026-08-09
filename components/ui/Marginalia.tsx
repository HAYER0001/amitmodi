/*
 * Marginalia.tsx — decorative handwritten captions scattered around a figure.
 *
 * Deterministic on server AND client: placement is derived from the same seed
 * via a tiny seeded PRNG, so SSR markup matches the client and there is no
 * hydration mismatch or layout shift.
 */

import type { CSSProperties } from "react";
import { pickMarginalia } from "@/data/marginalia";

type MarginaliaProps = {
  /** Number of marginalia items to scatter. */
  count: number;
  /** Seed — same seed ⇒ same positions. */
  seed: number;
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

export default function Marginalia({ count, seed, className = "" }: MarginaliaProps) {
  const items = pickMarginalia(count, seed);

  const scattered = items.map((_, index) => {
    const rand = mulberry32(itemSeed(seed, index));
    return {
      top: 6 + Math.floor(rand() * 78), // 6–84%
      left: 4 + Math.floor(rand() * 80), // 4–84%
      rotate: Math.round((rand() * 14 - 7) * 10) / 10, // ±7°
    };
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