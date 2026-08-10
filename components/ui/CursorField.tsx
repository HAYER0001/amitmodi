"use client";

/*
 * CursorField — ONE animation loop for every reactive element on the page.
 *
 * In the reference, the objects are not decoration sitting on a page: the notes
 * and the cut-outs drift on their own and give way as the pointer moves through
 * them. That reads as depth — as things resting ON a surface rather than
 * printed into it.
 *
 * WHY ONE CONTROLLER AND NOT PER-COMPONENT
 * Each Marginalia instance used to run its own requestAnimationFrame loop. The
 * homepage mounts several, so the page was running several independent loops,
 * each doing its own layout reads. One controller, mounted once in the layout,
 * drives everything and reads each element at most once per frame.
 *
 * MASS
 * Notes are scraps of pencil — light, they scatter easily and settle fast.
 * Cut-outs are objects — heavier, they shift less and lag behind. Giving them
 * identical physics is what makes this kind of effect feel like a CSS trick;
 * different mass is what makes it feel like a desk.
 *
 * Only `transform` is written. It is compositor-only, so nothing here can force
 * layout or show up in INP.
 */

import { useEffect } from "react";

type Tuned = {
  el: HTMLElement;
  /** px within which the pointer is felt */
  radius: number;
  /** max displacement in px */
  strength: number;
  /** easing per frame — lower is heavier */
  ease: number;
  /** idle drift amplitude in px */
  drift: number;
  /** idle drift speed */
  speed: number;
  x: number;
  y: number;
};

export default function CursorField() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia?.("(pointer: fine)").matches ?? true;
    /* No hovering pointer means repulsion can never fire, so the loop would burn
       frames for nothing. Touch keeps the CSS-only drift instead. */
    if (reduced || !fine) return;

    let items: Tuned[] = [];

    const collect = () => {
      const notes = Array.from(document.querySelectorAll<HTMLElement>(".marginalia"));
      const objects = Array.from(document.querySelectorAll<HTMLElement>(".cut-out-drift"));

      items = [
        ...notes.map((el) => ({
          el,
          radius: 260,
          strength: 46,
          ease: 0.12,
          drift: 4,
          speed: 0.35,
          x: 0,
          y: 0,
        })),
        ...objects.map((el) => ({
          el,
          /* Bigger targets need a wider field or the pointer passes them before
             they respond; but they move less and settle slower — they have mass. */
          radius: 340,
          strength: 22,
          ease: 0.055,
          drift: 9,
          speed: 0.16,
          x: 0,
          y: 0,
        })),
      ];

      /* The CSS keyframe drift on .cut-out-drift would fight the transform we
         are about to write, and last-writer-wins produces a visible stutter.
         This controller now owns their motion, so switch the animation off. */
      objects.forEach((el) => {
        el.style.animation = "none";
        el.style.willChange = "transform";
      });
    };

    collect();

    /* Routes swap content without a reload, so re-collect when the DOM changes.
       Debounced to a frame: a MutationObserver firing per node would otherwise
       rebuild the list dozens of times during hydration. */
    let recollect = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(recollect);
      recollect = requestAnimationFrame(collect);
    });
    mo.observe(document.body, { childList: true, subtree: true });

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

    let raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const time = t / 1000;
      const vh = window.innerHeight;

      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        const r = it.el.getBoundingClientRect();

        /* Skip anything off-screen. On a long page most elements are, and this
           is the only per-frame cost worth avoiding. */
        if (r.bottom < -240 || r.top > vh + 240) continue;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const dist = Math.hypot(dx, dy);

        let tx = 0;
        let ty = 0;
        if (dist < it.radius) {
          /* Squared falloff. Linear reads as a mechanical shove; squared reads
             as a field the object is sitting in. */
          const force = (1 - dist / it.radius) ** 2 * it.strength;
          if (dist < 4) {
            /* Direction collapses at the centre — dx/dist is meaningless there,
               so the element that should move most would sit still. Fixed
               per-element angle (golden angle spreads neighbours apart), so it
               always escapes and never jitters as the pointer crosses. */
            const a = i * 2.399963;
            tx = Math.cos(a) * force;
            ty = Math.sin(a) * force;
          } else {
            tx = (dx / dist) * force;
            ty = (dy / dist) * force;
          }
        }

        /* Idle drift — mismatched periods so nothing ever syncs up. */
        const phase = i * 1.7;
        tx += Math.sin(time * it.speed + phase) * it.drift;
        ty += Math.cos(time * it.speed * 0.78 + phase) * it.drift * 1.1;

        it.x += (tx - it.x) * it.ease;
        it.y += (ty - it.y) * it.ease;

        it.el.style.transform = `translate3d(${it.x.toFixed(2)}px, ${it.y.toFixed(2)}px, 0)`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(recollect);
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      items.forEach((it) => {
        it.el.style.transform = "";
        it.el.style.animation = "";
      });
    };
  }, []);

  return null;
}
