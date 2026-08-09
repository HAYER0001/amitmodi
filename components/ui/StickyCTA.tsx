"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { brand } from "@/lib/brand";
import { CTA } from "@/data/navigation";

/*
 * StickyCTA — a consultation prompt that follows the reader.
 *
 * Two surfaces, one component:
 *  - Desktop (lg+): a sidebar card that sticks below the compressed header
 *    as the page scrolls.
 *  - Mobile: a bottom bar that slides up only after the reader has scrolled
 *    past 40% of the page, so it does not cover the opening.
 *
 * Both are dismissible; the dismissal persists in sessionStorage for the
 * session. Contact facts come from the brand object — if phone or WhatsApp
 * is still 'TBD' (null), the corresponding link is omitted entirely, never
 * replaced with a guess.
 */

const DISMISS_KEY = "sticky-cta-dismissed";

function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function waHref(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export default function StickyCTA() {
  const [showMobile, setShowMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      /* sessionStorage unavailable (sandboxed frame etc.) — keep showing */
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setShowMobile(max > 0 && window.scrollY / max > 0.4);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    setShowMobile(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* non-fatal */
    }
  };

  const phone = brand.contact.phone;
  const whatsapp = brand.contact.whatsapp;

  return (
    <>
      {!dismissed && (
        <div className="hidden lg:block">
          <div className="rounded-md border border-rule bg-paper p-5 shadow-cut lg:sticky lg:top-20">
            <div className="flex items-start justify-between gap-3">
              <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                Start here
              </p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss consultation prompt"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors hover:border-stamp hover:text-stamp"
              >
                ✕
              </button>
            </div>

            <Link
              href={CTA.href}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-seal px-5 font-label text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-seal-deep"
            >
              {CTA.label}
            </Link>

            {(phone || whatsapp) && (
              <div className="mt-4 flex flex-col gap-1">
                {phone && (
                  <a
                    href={telHref(phone)}
                    className="inline-flex min-h-11 items-center font-label text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:text-seal"
                  >
                    {phone}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={waHref(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-label text-xs uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-deep"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!dismissed && (
        <motion.div
          initial={false}
          animate={{ y: showMobile ? 0 : "120%" }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        >
          <div className="border-t border-rule bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center gap-2">
              <Link
                href={CTA.href}
                className="inline-flex min-h-11 flex-1 items-center justify-center truncate rounded-full bg-seal px-4 font-label text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-seal-deep"
              >
                {CTA.label}
              </Link>
              {whatsapp && (
                <a
                  href={waHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 shrink-0 items-center rounded-full border border-rule px-3 font-label text-[11px] uppercase tracking-[0.08em] text-seal transition-colors hover:border-seal"
                >
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss consultation prompt"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors hover:border-stamp hover:text-stamp"
              >
                ✕
              </button>
            </div>
            {phone && (
              <div className="mt-1 text-center">
                <a
                  href={telHref(phone)}
                  className="font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-seal"
                >
                  Call {phone}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
