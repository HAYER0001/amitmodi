"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { CTA, MAIN_NAV } from "@/data/navigation";
import { BRAND } from "@/data/brand";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileNav from "@/components/sections/MobileNav";

/*
 * Header — sticky, backdrop-blurred, 1px --rule bottom border.
 *
 * Scroll states:
 *   1. "at top"  — scrollY ≤ 80: full height, always visible.
 *   2. "compressed" — scrollY > 80: height eases 72px → 56px.
 *   3. "hidden"    — scrolling DOWN past 80px slides the header up out of
 *      view; the moment scroll reverses it slides back. Never hidden at the
 *      top of the page, never hidden while the Services dropdown or the
 *      mobile sheet is open.
 */
export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compressed, setCompressed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const servicesOpenRef = useRef(servicesOpen);
  servicesOpenRef.current = servicesOpen;
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const prevY = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - prevY.current;
    prevY.current = y;
    setCompressed(y > 80);
    const keepVisible =
      y <= 80 || servicesOpenRef.current || menuOpenRef.current;
    if (y <= 80) setHidden(false);
    else if (!keepVisible) setHidden(delta > 2);
  });

  // Escape anywhere closes the dropdown and returns focus to the trigger.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  // Click outside the dropdown closes it.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [servicesOpen]);

  // Close the sheet whenever the route changes (App Router: menu is client-side).
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Focus management for the Services menu (roving focus).
  const focusItem = useCallback((index: number) => {
    itemRefs.current[index]?.focus();
  }, []);

  const openMenuKeyboard = useCallback(
    (moveTo: number) => {
      setServicesOpen(true);
      setActiveIndex(moveTo);
      // focus after the render that opens the menu
      requestAnimationFrame(() => focusItem(moveTo));
    },
    [focusItem],
  );

  const services = MAIN_NAV.find((i) => i.label === "Services");

  /*  a11y:  aria-expanded on the trigger, aria-current everywhere it applies,
      Enter/Space open, Escape closes, arrows move, focus returns to trigger.  */
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (servicesOpen) {
          setServicesOpen(false);
          triggerRef.current?.focus();
        } else {
          setServicesOpen(true);
          setActiveIndex(0);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        openMenuKeyboard(0);
        break;
      case "ArrowUp":
        e.preventDefault();
        openMenuKeyboard((services?.children?.length ?? 1) - 1);
        break;
      case "Escape":
        setServicesOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const count = services?.children?.length ?? 0;
    const step =
      e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : null;
    if (step === null) return;
    e.preventDefault();
    const nextIndex = (activeIndex + step + count) % count;
    setActiveIndex(nextIndex);
    focusItem(nextIndex);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md",
          "transition-[height] duration-300 ease-out",
          compressed ? "h-14" : "h-18",
        )}
      >
        <div className="mx-auto flex h-full max-w-none items-center justify-between gap-3 px-4 sm:px-6">
          {/* wordmark — the practice's own name, never a campaign line.
              The design-system codename must never surface to a visitor: the
              client is hiring Amit Modi, so his name goes above the door. */}
          <Link
            href="/"
            aria-label={`${BRAND.tradingName} — home`}
            className="flex min-h-11 shrink-0 items-center gap-[0.22em] font-display text-2xl leading-none text-ink"
          >
            Amit&nbsp;Modi <span className="text-seal">&amp;&nbsp;Co.</span>
          </Link>

          {/* centre: primary nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {MAIN_NAV.map((item) => {
                const isServices = "children" in item;
                if (isServices) {
                  const currentChild = item.children.find(
                    (c) => pathname === c.href,
                  );
                  return (
                    <li key={item.label} className="relative">
                      <button
                        ref={triggerRef}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={servicesOpen}
                        aria-current={currentChild ? "page" : undefined}
                        onClick={() => {
                          if (servicesOpen) {
                            setServicesOpen(false);
                            triggerRef.current?.focus();
                          } else {
                            setServicesOpen(true);
                          }
                        }}
                        onKeyDown={onTriggerKeyDown}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:text-seal",
                          servicesOpen && "bg-paper-deep text-seal",
                        )}
                      >
                        {item.label}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className={cn(
                            "h-3 w-3 text-ink-soft transition-transform",
                            servicesOpen && "rotate-180",
                          )}
                        >
                          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>

                      {servicesOpen && (
                        <ul
                          role="menu"
                          aria-label="Services"
                          onKeyDown={onMenuKeyDown}
                          onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                              setServicesOpen(false);
                            }
                          }}
                          className="absolute left-0 top-full z-50 mt-1 w-80 rounded-md border border-rule bg-paper p-1.5 shadow-cut"
                        >
                          {item.children.map((child, index) => (
                            <li key={child.href} role="none">
                              <Link
                                ref={(el) => {
                                  itemRefs.current[index] = el;
                                }}
                                href={child.href}
                                role="menuitem"
                                aria-current={
                                  pathname === child.href ? "page" : undefined
                                }
                                onMouseEnter={() => setActiveIndex(index)}
                                className={cn(
                                  "block min-h-11 rounded-md px-3 py-2.5 text-sm text-ink transition-colors hover:bg-paper-deep hover:text-seal",
                                  pathname === child.href &&
                                    "border-l-2 border-seal text-seal",
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                const current = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-4 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:text-seal",
                        current && "text-seal",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* right: CTA + theme toggle. Underlined text, not a filled pill — the pill
              was the single element most responsible for this reading as a SaaS
              template rather than an editorial cover. */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={CTA.href}
              className="inline-flex min-h-11 items-center border-b-2 border-seal px-1 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:text-seal"
            >
              {CTA.label}
            </Link>
            <ThemeToggle />
          </div>

          {/* mobile: theme toggle + menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors hover:border-seal"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav open={menuOpen} onClose={closeMenu} />
    </>
  );
}