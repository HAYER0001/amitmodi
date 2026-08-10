"use client";

/*
 * ChatPanel.tsx — the tax assistant dialog.
 *
 * Plain text only, by design: the input is a single-line field and replies
 * render as prose — no markdown, no links, no code blocks. Off-topic
 * questions are refused on the SERVER (/api/ask), never here — this panel is
 * only a window into that route.
 *
 * Motion rules: transform/opacity only, the project easing from lib/motion,
 * and nothing animates under prefers-reduced-motion.
 */

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DUR, EASE, useReducedMotion } from "@/lib/motion";

type Message = { role: "user" | "assistant"; content: string };

const SEED: Message = {
  role: "assistant",
  content:
    "Hello — I'm the practice's assistant. I only cover Indian tax and compliance: how a filing works, what a form is for, who needs to register, what a notice involves. Ask me one of those.",
};

const MAX_LEN = 600;

export default function ChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([SEED]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (open) {
      setError(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError(null);

    const history = next
      .slice(-7, -1)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        refused?: boolean;
        unconfigured?: boolean;
      };

      if (res.ok && typeof data.reply === "string") {
        const reply = data.reply;
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } else {
        setError(
          data.error ??
            "The assistant is unavailable right now. The contact form still works.",
        );
      }
    } catch {
      setError("The assistant is unavailable right now. The contact form still works.");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Tax assistant chat"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: reduced ? 0 : DUR.fast, ease: EASE }}
          className="fixed bottom-0 right-0 z-50 flex h-[min(72dvh,34rem)] w-full flex-col rounded-t-2xl border border-rule bg-paper/70 shadow-cut backdrop-blur-xl sm:bottom-5 sm:right-4 sm:w-[24rem] sm:rounded-xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
            <div className="min-w-0">
              <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
                Ask the assistant
              </p>
              <p className="truncate font-margin text-base text-ink-soft">
                Indian tax &amp; compliance only
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors hover:border-seal hover:text-seal"
            >
              ✕
            </button>
          </header>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] whitespace-pre-wrap rounded-md bg-seal px-4 py-2.5 text-sm text-paper"
                    : "max-w-[90%] border-l-2 border-seal pl-3 text-sm leading-relaxed text-ink"
                }
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="border-l-2 border-seal pl-3 text-sm text-ink-soft">
                Thinking…
              </div>
            )}
          </div>

          {error && (
            <p className="mx-4 mb-2 rounded-sm border border-stamp bg-stamp/10 px-3 py-2 text-xs text-ink">
              {error}
            </p>
          )}

          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t border-rule px-3 py-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX_LEN}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a tax question… (Enter to send)"
              aria-label="Your tax question"
              className="max-h-28 min-h-11 flex-1 resize-none rounded-md border border-rule bg-paper-deep/80 px-3 py-2.5 text-sm text-ink backdrop-blur-sm placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-seal"
            />
            <button
              type="submit"
              disabled={busy || draft.trim().length === 0}
              aria-label="Send question"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-seal text-paper transition-colors hover:bg-seal-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </form>

          <p className="border-t border-rule px-4 py-2 text-center font-label text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            for an actual answer,{" "}
            <a
              href="/contact"
              className="text-seal underline-offset-2 hover:underline"
            >
              contact the practice
            </a>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}