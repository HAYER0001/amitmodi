"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
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
  /* A soft paper-toned shimmer at the model's exact size, so the knight fades
     into a reserved box instead of popping into an empty one. Sized by the
     parent's aspect-square, so it can never cause layout shift. */
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--rule),transparent_62%)] opacity-50"
    />
  ),
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

/* The small centred caption above the headline — the reference's "The Invisible
   Rules of Wealth". It states the subject before the headline states the claim,
   which is what lets the headline be short enough to fill the screen. */
const HERO_EYEBROW = "The invisible rules of Indian tax compliance";

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
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* Parallax: three depth planes moving at different rates as the hero leaves.
     The collage drifts fastest (it is "nearest"), the knight slower, the
     headline slowest of all — the same cue the eye uses to read depth out of a
     moving scene. Transform only, so this costs nothing on the main thread.
     Reduced motion collapses every plane to 0. */
  const collageY = useTransform(scrollYProgress, [0, 0.25], [0, reduced ? 0 : -90]);
  const knightY = useTransform(scrollYProgress, [0, 0.25], [0, reduced ? 0 : -50]);
  const headlineY = useTransform(scrollYProgress, [0, 0.25], [0, reduced ? 0 : -22]);

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
      <motion.div style={{ y: collageY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Dense statute marginalia, scattered across the WHOLE frame including
            behind the headline. In the reference the chess notation is the
            texture of the page, not a decoration parked in the margins — there
            are a dozen-plus notes and they read as someone's working notes on
            the position. Sparse marginalia just look like stray debris. */}
        <Marginalia count={18} seed={1} exclude={{ top: 20, left: 12, right: 88, bottom: 82 }} />

        {/* The collage OVERLAPS the type. This is the single biggest difference
            between the reference and a template: the chess piece sits inside the
            word, breaking the letterforms, so the object and the type occupy one
            plane instead of politely sharing a screen. */}
        <div className="cut-out-drift absolute left-[3%] top-[14%] w-20 -rotate-6 sm:w-28 md:w-36">
          <CutOut
            src={ASSETS["cut-file-folder"].src}
            alt=""
            width={ASSETS["cut-file-folder"].width}
            height={ASSETS["cut-file-folder"].height}
          />
        </div>
        <div className="cut-out-drift absolute bottom-[10%] left-[6%] w-20 rotate-6 sm:w-28 md:w-32">
          <CutOut
            src={ASSETS["cut-coin-stack"].src}
            alt=""
            width={ASSETS["cut-coin-stack"].width}
            height={ASSETS["cut-coin-stack"].height}
          />
        </div>
        <div className="cut-out-drift absolute right-[5%] top-[18%] hidden w-24 -rotate-12 lg:block">
          <CutOut
            src={ASSETS["cut-paperclip"].src}
            alt=""
            width={ASSETS["cut-paperclip"].width}
            height={ASSETS["cut-paperclip"].height}
          />
        </div>
      </motion.div>

      {/* The knight sits ABOVE the headline in z-order and overlaps its right
          end, exactly as the chess piece breaks "MONEY" in the reference.

          aspect-square MUST be on this wrapper, not passed down as Model3D's
          className. Passed down, this box collapsed to height 0 — so the
          IntersectionObserver inside Model3D was observing a zero-height
          element, never fired, and the canvas never mounted at all. The model
          was correct the whole time; the box around it had no height. */}
      <motion.div
        style={{ y: knightY }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-square w-[56vw] max-w-[540px] -translate-x-1/2 -translate-y-[56%] sm:w-[42vw] lg:w-[34vw]"
      >
        <Model3D
          src="/models/knight-brass.glb"
          fallbackImage={ASSETS["cut-brass-seal"].src}
          rotationSpeed={0.12}
          className="relative h-full w-full"
        />
      </motion.div>

      {/* A single small ink figure standing at the headline's baseline — the
          reference puts a tiny observer against the huge type, and that contrast
          is what gives the composition its scale. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[24%] left-[22%] z-30 hidden w-12 lg:block xl:w-14"
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

      {/*
        POSTER COMPOSITION — not a landing page.

        The reference is centred and symmetrical: a small caption, then type
        filling 95% of the width, then a small italic byline. The object sits
        dead centre and cuts THROUGH the letterforms. Left-aligning the headline
        and parking the object beside it is what made this read as a template
        while the reference reads as a cover.

        Order matters here: caption → headline → byline, all centred, with the
        knight absolutely positioned over the middle so it splits the two lines.
      */}
      <motion.div
        style={{ y: headlineY }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center sm:px-8"
      >
        <p className="font-body text-sm italic text-ink-soft sm:text-base">
          {HERO_EYEBROW}
        </p>

        {/* The LCP element. Server-rendered text, never inside an opacity-0
            wrapper. leading-[0.82] pulls the two lines tight enough that the
            knight can straddle them the way the piece straddles MONEY/CHECK. */}
        <h1 className="mt-3 max-w-[14ch] font-display text-display leading-[0.82] tracking-[-0.035em] text-seal sm:mt-4">
          {SELECTED.headline}
        </h1>

        <p className="relative z-30 mt-10 max-w-[46ch] font-body text-sm italic text-ink sm:mt-14 sm:text-base">
          {SELECTED.subhead}
        </p>

        {/* Understated, like the reference's underlined "Buy it now!". A filled
            pill here would drag the eye off the type and reads as SaaS. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:mt-10">
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center font-label text-xs uppercase tracking-[0.14em] text-ink underline decoration-seal decoration-2 underline-offset-[6px] transition-colors hover:text-seal"
            >
              {SELECTED.ctaPrimary}
            </Link>
          </Magnetic>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center font-label text-xs uppercase tracking-[0.14em] text-ink-soft underline decoration-rule underline-offset-[6px] transition-colors hover:text-seal"
          >
            {SELECTED.ctaSecondary}
          </Link>
        </div>
      </motion.div>

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
