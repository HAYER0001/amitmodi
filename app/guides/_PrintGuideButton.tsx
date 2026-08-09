"use client";

/*
 * app/guides/_PrintGuideButton.tsx — client-only because it calls window.print.
 * This is the browser's built-in "save as PDF" for the page the visitor is
 * already reading. The page content is never gated; the gated, formatted PDF
 * is a separate LeadMagnet.
 */

export function PrintGuideButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-rule bg-paper px-6 font-label text-sm uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
    >
      Save as PDF
    </button>
  );
}
