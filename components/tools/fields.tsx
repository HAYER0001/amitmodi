import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from "react";

/*
 * fields.tsx — shared form field scaffolding for the /tools calculators.
 *
 * Every calculator uses the same labelled-input pattern so the five tools
 * read as one family: an uppercase font-label caption, a full-width native
 * control, and an optional helper caption. The class strings are exported so
 * raw inputs/selects in tool bodies stay visually identical to Field rows.
 */

export const inputClass =
  "w-full rounded-md border border-rule bg-paper px-4 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-seal focus:ring-2 focus:ring-seal/30";

export const selectClass = `${inputClass} appearance-none pr-10`;

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  );
}

/** Full-width select with the shared token styling. */
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={selectClass} />;
}

/** Full-width text/number input with the shared token styling. */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}
