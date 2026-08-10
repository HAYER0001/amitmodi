"use client";

/*
 * template.tsx — page transition wrapper.
 *
 * MUST be template.tsx, not layout.tsx. A layout does not remount between
 * routes, so an entrance animation placed there fires once on first load and
 * never again. A template remounts on every navigation, which is exactly the
 * lifecycle an entrance needs.
 *
 * The transition is 240ms and opacity-only-plus-8px. Anything longer reads as
 * the site being slow rather than the site being considered — a page transition
 * is a cost the visitor pays on every click, so it has to stay under the
 * threshold where they notice waiting.
 *
 * Deliberately NOT using AnimatePresence with an exit animation: an exit
 * animation delays the next page's first paint by its own duration, which
 * directly inflates LCP on every navigation after the first. Entrance only.
 */

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { EASE } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const isFirst = useRef(true);

  /*
   * App Router restores scroll on its own, but focus is not moved — a keyboard
   * or screen-reader user stays parked where the previous page's focus was and
   * has to tab back through the whole header. Move focus to <main> on every
   * navigation except the first (moving it on load would steal focus from a
   * deep link).
   */
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      main.removeAttribute("tabindex");
    }
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
