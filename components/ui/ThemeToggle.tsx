"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/*
 * ThemeToggle — next-themes based.
 *
 * Hydration safety: next-themes injects the theme attribute on <html> before
 * React hydrates, so the first paint is already correct. This component still
 * defers reading `resolvedTheme` until mounted (useEffect) so the server-rendered
 * HTML and the first client render agree — the accessible label never flickers.
 *
 * The label states the ACTION, not the state: "Switch to dark theme" /
 * "Switch to light theme".
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const glyph = isDark ? "☀" : "☾";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors hover:border-seal hover:text-seal"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {glyph}
      </span>
    </button>
  );
}
