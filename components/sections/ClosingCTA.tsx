"use client";

import CutOut from "@/components/ui/CutOut";
import { ASSETS } from "@/data/assets";
import Link from "next/link";
import Magnetic from "@/components/ui/Magnetic";
import { CTA } from "@/data/navigation";
import { brand } from "@/lib/brand";

/*
 * ClosingCTA — the final ask.
 *
 * Full-bleed --seal surface, reversed (paper) type, one magnetic CTA.
 * Phone and email sit beside the button but render NOTHING while TBD, per
 * the lib/brand.ts contract. The response-time promise is the success toast
 * line from COPY-DECK.md §5.
 */

export default function ClosingCTA() {
  const phone: string | null = brand.contact.phone as string | null;
  const email: string | null = brand.contact.email as string | null;

  return (
    <section
      id="contact-cta"
      aria-labelledby="closing-title"
      className="relative overflow-hidden bg-seal text-paper"
    >
      {/* Low opacity: this sits on the seal fill, so it reads as texture
          rather than as an object competing with the closing line. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25">
        <div className="cut-out-drift absolute bottom-[8%] right-[6%] hidden w-40 rotate-6 lg:block">
          <CutOut
            src={ASSETS["cut-rupee-crumpled"].src}
            alt=""
            width={ASSETS["cut-rupee-crumpled"].width}
            height={ASSETS["cut-rupee-crumpled"].height}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-paper/70">
          The ask
        </p>
        <h2
          id="closing-title"
          className="mt-4 font-display text-display text-paper"
        >
          Do not wait for the deadline.
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-body leading-relaxed text-paper/85">
          Let us review your compliance position today. One conversation, and
          your obligations are mapped, filed, and defended.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <Link
              href={CTA.href}
              className="inline-flex min-h-11 items-center rounded-pill bg-paper px-8 font-label text-xs uppercase tracking-[0.14em] text-seal transition-colors hover:bg-paper-deep"
            >
              Request an Audit
            </Link>
          </Magnetic>
          {(phone || email) && (
            <div className="flex flex-wrap items-center justify-center gap-4 font-label text-xs uppercase tracking-[0.14em] text-paper/80">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-paper"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-paper"
                >
                  {email}
                </a>
              )}
            </div>
          )}
        </div>

        <p className="mt-10 font-margin text-xl text-paper/80">
          We respond within one business day.
        </p>
      </div>
    </section>
  );
}
