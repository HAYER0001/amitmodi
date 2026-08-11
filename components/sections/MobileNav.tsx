"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CTA, MAIN_NAV } from "@/data/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

/*
 * MobileNav — a full-screen sheet, not a hamburger dropdown.
 * Slides in from the right, traps focus, closes on Escape and on route change,
 * locks body scroll while open. Every touch target ≥ 44×44px. The CTA is the
 * last item and the largest thing on the screen.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  /* Close on route change. */
  useEffect(() => {
    if (open) closeRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* Lock body scroll while open. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Focus trap + Escape; restore focus to the trigger on close. */
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && active === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [open]);

  const close = useCallback(() => closeRef.current(), []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={panelRef}
          className="fixed inset-0 z-[60] flex flex-col bg-paper/80 backdrop-blur-xl backdrop-saturate-150 lg:hidden"
        >
          <div className="flex h-18 shrink-0 items-center justify-between gap-3 border-b border-rule px-4 sm:px-6">
            <span className="font-display text-2xl leading-none text-ink">
              Compliance <span className="text-seal">in&nbsp;Check</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors hover:border-seal"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ✕
              </span>
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
          >
            <ul className="flex flex-col">
              {MAIN_NAV.map((item) => {
                const hasChildren = "children" in item;
                const current = pathname === item.href;
                const childActive =
                  hasChildren &&
                  item.children.some((c) => pathname === c.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={
                        current || childActive ? "page" : undefined
                      }
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-3 py-3 font-body text-lg text-ink transition-colors hover:text-seal",
                        hasChildren && "mt-4 font-label text-xs uppercase tracking-[0.14em] text-ink-soft hover:text-ink",
                        (current || childActive) && !hasChildren && "text-seal",
                      )}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <ul className="mb-2 flex flex-col border-l border-rule pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={close}
                              aria-current={
                                pathname === child.href ? "page" : undefined
                              }
                              className="flex min-h-11 items-center rounded-md px-3 py-3 text-sm text-ink transition-colors hover:text-seal"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-rule px-4 py-4 sm:px-6">
            <Link
              href={CTA.href}
              onClick={close}
              className="flex w-full items-center justify-center rounded-pill bg-seal py-5 font-label text-base uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
            >
              {CTA.label}
            </Link>
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}