"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, DUR, useReducedMotion } from "@/lib/motion";

/*
 * Toast.tsx — non-intrusive, stacked feedback (instrtion.md §V: Toast
 * Notifications). A tiny module-level store keeps the API dependency-free:
 * any code (e.g. ConsultationForm) calls pushToast() and the <Toaster /> —
 * rendered once by the page — shows the stack.
 *
 * Accessibility: the viewport carries role="status" + aria-live="polite", so
 * each toast is announced when it appears; every toast is dismissible and
 * auto-dismisses after 6 seconds.
 */

export type ToastTone = "success" | "error";

export type ToastOptions = {
  message: string;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms (default 6000). */
  duration?: number;
};

type ToastEntry = {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
};

let nextId = 0;
let toasts: ToastEntry[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function pushToast({ message, tone = "success", duration = 6000 }: ToastOptions) {
  const entry: ToastEntry = { id: ++nextId, message, tone, duration };
  toasts = [...toasts, entry];
  emit();
  window.setTimeout(() => dismissToast(entry.id), duration);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function useToasts(): ToastEntry[] {
  const [items, setItems] = useState<ToastEntry[]>(toasts);
  useEffect(() => {
    const listener = () => setItems([...toasts]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return items;
}

/** Renders the toast stack. Place once per page, near the root. */
export function Toaster() {
  const items = useToasts();
  const reduced = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2"
    >
      <AnimatePresence>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: reduced ? 0 : 24, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : 24 }}
            transition={{ duration: reduced ? 0 : DUR.fast, ease: EASE }}
            className={cn(
              "pointer-events-auto flex items-start justify-between gap-3 rounded-md border bg-paper px-4 py-3 shadow-cut",
              toast.tone === "success" ? "border-seal" : "border-stamp",
            )}
          >
            <p className="font-body text-sm leading-relaxed text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 inline-flex min-h-11 min-w-11 items-center justify-center font-label text-base text-ink-soft transition-colors hover:text-ink"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
