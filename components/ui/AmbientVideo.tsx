"use client";

/*
 * AmbientVideo — a short, silent, looping clip used as texture.
 *
 * Rules this component enforces so a video can never hurt the page:
 *
 *  - It NEVER loads until it is near the viewport. `preload="none"` plus an
 *    IntersectionObserver means a visitor who bounces off the hero pays nothing
 *    for it. An autoplaying hero video is the most reliable way to wreck LCP,
 *    and the hero here is engineered around the headline being the LCP element.
 *  - It pauses when scrolled away. A looping video decoding off-screen burns
 *    battery on a phone for something nobody can see.
 *  - It never plays under prefers-reduced-motion — the poster frame stands in.
 *  - muted + playsInline are REQUIRED for autoplay to work at all on iOS; without
 *    both, Safari silently refuses and the visitor sees a frozen frame.
 *  - A transcript is a required prop, not an optional one. Video is completely
 *    invisible to search engines and to the AI answer engines this build targets,
 *    so an untranscribed video is content you paid for and cannot rank.
 */

import { useEffect, useRef, useState } from "react";

export default function AmbientVideo({
  src,
  poster,
  transcript,
  className = "",
}: {
  src: string;
  poster?: string;
  /** Required. Rendered as real text beneath the clip. */
  transcript: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting) {
          /* play() rejects if the browser blocks autoplay. Swallow it — the
             poster frame is a perfectly good outcome and an unhandled rejection
             in the console is not. */
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={className}>
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="h-full w-full rounded-md object-cover"
      />
      {/* The transcript is the only version of this a crawler, a screen reader
          or an AI answer engine can read. Visually quiet, never hidden. */}
      <figcaption className="mt-3 font-body text-sm italic leading-relaxed text-ink-soft">
        {transcript}
      </figcaption>
    </figure>
  );
}
