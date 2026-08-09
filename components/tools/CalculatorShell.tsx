"use client";

import { useState, type ReactNode } from "react";
import type { BreakdownLine } from "@/lib/calc/types";

/*
 * CalculatorShell — shared chrome for every tool in /tools.
 *
 * Owns nothing about the calculation itself: the parent calculator component
 * owns the input state and passes up the derived summary, the working
 * (breakdown), and the query string that encodes the current inputs. The
 * shell provides the header, the "indicative, not tax advice" disclaimer,
 * the result panel (wrapped in aria-live="polite" so assistive tech hears it
 * update), and Copy / Print / Share actions — where Share encodes the current
 * inputs in the URL so a result is linkable and reproducible.
 *
 * There is no HTML state to desync here: the result panel renders exactly
 * what the pure functions in lib/calc returned, so SSR markup matches the
 * client (the values are deterministic).
 */

type CalculatorShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  /** Headline result, e.g. "₹1,180". Null while inputs are incomplete. */
  summary: string | null;
  /** The "how we got here" working. Null when there is no result. */
  breakdown: BreakdownLine[] | null;
  /** Input error message, shown instead of a result (never NaN on screen). */
  invalid: string | null;
  /** Current inputs encoded as a query string, or "" when invalid. */
  shareQuery: string;
  /** Override the result-panel heading, e.g. "Your total". */
  resultLabel?: string;
  /** The calculator's form controls. */
  children: ReactNode;
};

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the execCommand path */
    }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function CalculatorShell({
  eyebrow = "Calculator",
  title,
  description,
  summary,
  breakdown,
  invalid,
  shareQuery,
  resultLabel = "Result",
  children,
}: CalculatorShellProps) {
  const [copied, setCopied] = useState<"result" | "link" | null>(null);

  const copyResult = async () => {
    if (!summary || !breakdown) return;
    const text = [
      `${title}: ${summary}`,
      ...breakdown.map((line) => `${line.label}: ${line.value}${line.detail ? ` (${line.detail})` : ""}`),
    ].join("\n");
    const ok = await copyText(text);
    if (ok) {
      setCopied("result");
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const share = async () => {
    if (!shareQuery) return;
    const url = `${window.location.origin}${window.location.pathname}?${shareQuery}`;
    const ok = await copyText(url);
    if (ok) {
      setCopied("link");
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">{eyebrow}</p>
        <h1 className="mt-2 font-display text-h2 text-ink">{title}</h1>
        <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">{description}</p>
      </header>

      <div className="mt-6 border-l-4 border-stamp bg-paper-deep p-4 sm:p-5">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
          Indicative only — not tax advice
        </p>
        <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">
          This tool is a guide, not a filing. Figures change with every Finance
          Act and notification; verify the applicable rate and threshold with a
          professional before relying on them.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="min-w-0">{children}</div>

        <aside className="min-w-0">
          <div className="rounded-md border border-rule bg-paper p-5 shadow-cut" aria-live="polite">
            <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">{resultLabel}</h2>

            {invalid ? (
              <p className="mt-3 font-body text-base leading-relaxed text-stamp" role="alert">
                {invalid}
              </p>
            ) : summary && breakdown ? (
              <>
                <p className="mt-2 font-display text-h3 text-ink">{summary}</p>
                <dl className="mt-4 space-y-3 border-t border-rule pt-4">
                  {breakdown.map((line) => (
                    <div key={line.label}>
                      <dt className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                        {line.label}
                      </dt>
                      <dd className="mt-0.5 font-body text-base font-medium text-ink">{line.value}</dd>
                      {line.detail && (
                        <dd className="mt-0.5 font-body text-sm leading-relaxed text-ink-soft">{line.detail}</dd>
                      )}
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">
                Adjust the inputs — the result appears here.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
              <button
                type="button"
                onClick={copyResult}
                disabled={!summary}
                className="inline-flex min-h-11 items-center rounded-full border border-rule px-4 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-seal hover:text-seal disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied === "result" ? "Copied" : "Copy result"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-11 items-center rounded-full border border-rule px-4 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-seal hover:text-seal"
              >
                Print
              </button>
              <button
                type="button"
                onClick={share}
                disabled={!shareQuery}
                className="inline-flex min-h-11 items-center rounded-full bg-seal px-4 font-label text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-seal-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied === "link" ? "Link copied" : "Share result"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
