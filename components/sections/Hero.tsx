"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HERO_VARIANTS, CORNER_LABELS } from "@/data/hero-copy";
import { ASSETS } from "@/data/assets";
import Marginalia from "@/components/ui/Marginalia";
import CutOut from "@/components/ui/CutOut";
import Magnetic from "@/components/ui/Magnetic";

/* three.js is ~150 KB gzipped. It must never be in the first-paint bundle, so
   Model3D is only ever reached through this dynamic, ssr:false import. The
   component itself then gates on device capability and viewport proximity. */
const Model3D = dynamic(() => import("@/components/ui/Model3D"), {
  ssr: false,
  loading: () => null,
});

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
      {/* decorative collage — never part of the LCP.
          Dimensions come from data/assets.ts, which mirrors the real files on
          disk. Hardcoding them here squashes every image the moment an asset is
          regenerated at a different size. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Dense statute marginalia, scattered across the WHOLE frame including
            behind the headline. In the reference the chess notation is the
            texture of the page, not a decoration parked in the margins — there
            are a dozen-plus notes and they read as someone's working notes on
            the position. Sparse marginalia just look like stray debris. */}
        <Marginalia count={18} seed={1} />

        {/* The collage OVERLAPS the type. This is the single biggest difference
            between the reference and a template: the chess piece sits inside the
            word, breaking the letterforms, so the object and the type occupy one
            plane instead of politely sharing a screen. */}
        <div className="cut-out-drift absolute left-[6%] top-[12%] w-24 -rotate-6 sm:w-32 md:w-40">
          <CutOut
            src={ASSETS["cut-file-folder"].src}
            alt=""
            width={ASSETS["cut-file-folder"].width}
            height={ASSETS["cut-file-folder"].height}
          />
        </div>
        <div className="cut-out-drift absolute bottom-[12%] left-[4%] w-20 rotate-6 sm:w-28 md:w-32">
          <CutOut
            src={ASSETS["cut-coin-stack"].src}
            alt=""
            width={ASSETS["cut-coin-stack"].width}
            height={ASSETS["cut-coin-stack"].height}
          />
        </div>
        <div className="cut-out-drift absolute right-[8%] top-[16%] hidden w-24 -rotate-12 lg:block">
          <CutOut
            src={ASSETS["cut-paperclip"].src}
            alt=""
            width={ASSETS["cut-paperclip"].width}
            height={ASSETS["cut-paperclip"].height}
          />
        </div>
      </div>

      {/* The knight sits ABOVE the headline in z-order and overlaps its right
          end, exactly as the chess piece breaks "MONEY" in the reference.

          aspect-square MUST be on this wrapper, not passed down as Model3D's
          className. Passed down, this box collapsed to height 0 — so the
          IntersectionObserver inside Model3D was observing a zero-height
          element, never fired, and the canvas never mounted at all. The model
          was correct the whole time; the box around it had no height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-[44%] z-20 hidden aspect-square w-[30vw] max-w-[440px] -translate-y-1/2 md:block"
      >
        <Model3D
          src="/models/knight-brass.glb"
          fallbackImage={ASSETS["cut-brass-seal"].src}
          rotationSpeed={0.12}
          className="relative h-full w-full"
        />
      </div>

      {/* A single small ink figure standing at the headline's baseline — the
          reference puts a tiny observer against the huge type, and that contrast
          is what gives the composition its scale. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[19%] left-[46%] z-20 hidden w-14 lg:block xl:w-16"
      >
        <CutOut
          src={ASSETS["fig-worried"].src}
          alt=""
          width={ASSETS["fig-worried"].width}
          height={ASSETS["fig-worried"].height}
        />
      </div>

      {/* Corner labels — the top-right is the live clock, client-only.
          gap-4 and min-w-0 so the two never butt into each other: at 320px the
          eyebrow and the timestamp were colliding mid-word ("GST & INDIRECT"
          running straight into "09 AUG 2026"). The clock is secondary texture,
          so it steps aside entirely on the narrowest screens rather than
          squeezing the label that actually says what this practice does. */}
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-6 sm:px-8">
        <p className="min-w-0 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {CORNER_LABELS.topLeft}
        </p>
        <p className="hidden shrink-0 font-label text-xs uppercase tracking-[0.14em] text-ink-soft xs:block">
          {now ?? CORNER_LABELS.topRight}
        </p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-5 sm:px-8">
        {/* max-w in ch, not px — the headline must break to two lines and fill
            the measure at every width. Capping it narrower left the reference's
            defining move (type that fills the screen) on the table. */}
        <h1 className="max-w-[13ch] font-display text-display leading-[0.88] tracking-[-0.03em] text-seal">
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
