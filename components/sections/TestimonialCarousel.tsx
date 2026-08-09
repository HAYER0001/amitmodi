"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADVERTISING_MODE } from "@/data/credentials";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { getAllServices } from "@/lib/content";

/*
 * TestimonialCarousel — the horizontal card scroll (instrtion.md §V: Toast
 * Notifications / Client Carousel, but as testimonials).
 *
 * STANDARD MODE ONLY. In conservative mode this component returns null —
 * not an empty state, nothing — so there is no dangling heading or empty
 * section. In standard mode it still renders nothing until a real testimonial
 * exists with consentObtained: true (data/testimonials.ts is EMPTY BY DESIGN).
 *
 * Interaction contract:
 *  - smooth horizontal scroll, one card at a time
 *  - real drag/swipe: mouse-drag and touch scroll on the native scrollport
 *  - arrow buttons, keyboard ArrowLeft/ArrowRight on the region
 *  - auto-advance pauses on hover and on focus
 *  - prefers-reduced-motion → a static grid, all cards visible, no animation
 *  - every card is real text in the DOM (name, role, service used)
 */

function serviceName(serviceSlug: string): string {
  const service = getAllServices().find((s) => s.slug === serviceSlug);
  return service?.shortName ?? serviceSlug;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure
      data-testimonial
      className="flex h-full flex-col rounded-md border border-rule bg-paper p-6 shadow-cut"
    >
      <blockquote className="font-body text-body leading-relaxed text-ink">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 border-t border-rule pt-4">
        <p className="font-label text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          {testimonial.name}
        </p>
        <p className="mt-0.5 font-body text-sm leading-relaxed text-ink-soft">
          {testimonial.role}
        </p>
        <p className="mt-1 font-label text-xs uppercase tracking-[0.14em] text-seal">
          {serviceName(testimonial.serviceSlug)}
        </p>
      </figcaption>
    </figure>
  );
}

const CARD_GAP = 16; /* matches the Tailwind gap-4 between cards */

function Header({ actions }: { actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
          From our clients
        </p>
        <h2
          id="testimonials-title"
          className="mt-3 max-w-2xl font-display text-h2 text-ink"
        >
          What clients say after the work is done.
        </h2>
      </div>
      {actions}
    </div>
  );
}

/* ---- reduced motion: plain responsive grid, nothing animates ---- */

function StaticGrid({ items }: { items: Testimonial[] }) {
  return (
    <section aria-labelledby="testimonials-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Header />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- full interaction: drag, arrows, keyboard, auto-advance ---- */

function Carousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);
  const dragState = useRef<{ startX: number; startScroll: number } | null>(null);

  const cardStep = useCallback(() => {
    const firstCard = firstCardRef.current;
    const width = firstCard ? firstCard.offsetWidth : 0;
    return width + CARD_GAP;
  }, []);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = cardStep();
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (direction === 1) {
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    } else {
      if (el.scrollLeft <= 8) {
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -step, behavior: "smooth" });
      }
    }
  }, [cardStep]);

  /* auto-advance, paused while hovered or focused */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      scrollByCard(1);
    }, 6000);
    return () => window.clearInterval(id);
  }, [scrollByCard]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  /* mouse drag on the native scrollport */
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { startX: event.clientX, startScroll: el.scrollLeft };
    setDragging(true);
    pause();
    el.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    const el = trackRef.current;
    if (!state || !el) return;
    el.scrollLeft = state.startScroll - (event.clientX - state.startX);
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (el && el.hasPointerCapture?.(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    setDragging(false);
    resume();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    }
  }

  const arrowClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border border-rule bg-paper font-label text-base text-ink transition-colors hover:border-seal hover:text-seal";

  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-paper"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Header
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => scrollByCard(-1)}
                className={arrowClass}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => scrollByCard(1)}
                className={arrowClass}
              >
                →
              </button>
            </div>
          }
        />

        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials, one at a time"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={cn(
            "mt-10 flex gap-4 overflow-x-auto pb-2 outline-none select-none",
            "snap-x snap-mandatory",
            dragging && "snap-none cursor-grabbing",
            !dragging && "cursor-grab",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {items.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={index === 0 ? firstCardRef : undefined}
              className="w-[85%] max-w-sm shrink-0 snap-start sm:w-[26rem]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TestimonialCarousel() {
  const reduced = useReducedMotion();
  const items = TESTIMONIALS.filter((testimonial) => testimonial.consentObtained);

  /* conservative mode: nothing at all — not an empty state, nothing */
  if (ADVERTISING_MODE !== "standard") return null;
  if (items.length === 0) return null;
  if (reduced) return <StaticGrid items={items} />;
  return <Carousel items={items} />;
}
