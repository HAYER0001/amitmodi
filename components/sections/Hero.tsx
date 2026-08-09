"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HERO_VARIANTS, CORNER_LABELS } from "@/data/hero-copy";
import Marginalia from "@/components/ui/Marginalia";
import CutOut from "@/components/ui/CutOut";
import Magnetic from "@/components/ui/Magnetic";

/*
 * Hero.tsx — the full-viewport opening section.
 *
 * LCP discipline (the hard requirement this section lives or dies by):
 *  - The headline is server-rendered text in font-display at --t-display. It
 *    is the LCP element and sits in NO opacity-0 / initial-hidden wrapper.
 *  - The only things that animate in are decorative (marginalia, scroll cue,
 *    the 3D-collage substitutes) — never the headline or the CTAs.
 *  - The live date/time renders only after mount; a server-rendered clock
 *    would hydrate differently for every timezone.
 *  - No image becomes the LCP element: the cut-outs are absolutely positioned
 *    and hidden from the accessibility tree.
 *
 * The phase-7 plan calls for the 3D brass knight (knight-brass.glb) to
 * overlap the type. The model ships in public/models but has no static PNG
 * fallback, so this build leans on the cut-out collage instead; swapping
 * Model3D back in is a one-component change guarded by its IntersectionObserver
 * gate and dynamic ssr:false import.
 */

const SELECTED = HERO_VARIANTS.find((v) => v.selected) ?? HERO_VARIANTS[0];

function formatIndianDate(d: Date): string {
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

export default function Hero() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    setNow(formatIndianDate(new Date()));
    const id = setInterval(() => setNow(formatIndianDate(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Introduction"
      className="paper ledger-grid relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* decorative collage — never part of the LCP */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[6%] top-[16%] w-28 rotate-6 sm:w-40">
          <CutOut src="/images/cut-file-folder.png" alt="" width={160} height={213} />
        </div>
        <div className="absolute bottom-[20%] left-[4%] w-24 -rotate-6 sm:w-32">
          <CutOut src="/images/cut-coin-stack.png" alt="" width={128} height={170} />
        </div>
        <div className="absolute right-[38%] top-[62%] hidden w-20 rotate-12 lg:block">
          <CutOut src="/images/cut-brass-seal.png" alt="" width={80} height={80} />
        </div>
        <Marginalia count={10} seed={1} />
      </div>

      {/* corner labels — the top-right is the live clock, client-only */}
      <div className="relative z-10 flex items-start justify-between px-5 pt-6 sm:px-8">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">{CORNER_LABELS.topLeft}</p>
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {now ?? CORNER_LABELS.topRight}
        </p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-5 sm:px-8">
        <h1 className="max-w-[11ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
          {SELECTED.headline}
        </h1>
        <p className="mt-6 max-w-md font-body text-body leading-relaxed text-ink">
          {SELECTED.subhead}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full bg-seal px-6 font-label text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-seal-deep"
            >
              {SELECTED.ctaPrimary}
            </Link>
          </Magnetic>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center font-label text-xs uppercase tracking-[0.1em] text-ink underline decoration-seal/40 underline-offset-8 transition-colors hover:text-seal"
          >
            {SELECTED.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* lower band: scroll cue + bottom corner labels */}
      <div className="relative z-10 flex items-end justify-between px-5 pb-6 sm:px-8">
        <div className="flex flex-col gap-1">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">{CORNER_LABELS.bottomLeft}</p>
          <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">{CORNER_LABELS.bottomRight}</p>
        </div>
        <motion.p
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="font-label text-xs uppercase tracking-[0.3em] text-ink-soft"
        >
          scroll
        </motion.p>
      </div>
    </section>
  );
}
