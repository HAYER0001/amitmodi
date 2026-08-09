"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * TableOfContents — the "On this page" rail for long-form content.
 *
 * Collects the h2 headings inside a scope (default: <main>), gives any that
 * lack an id a stable one, and lists them as anchor links. A scroll-spy
 * (IntersectionObserver) highlights the heading currently in view; a scroll
 * listener picks up the edge case where the page ends before the last
 * heading clears the window. Targets get scroll-margin so they land below
 * the fixed header.
 *
 * Shown at xl+ only, sticky below the header. Before hydration it renders
 * nothing — headings live client-side.
 */

type TableOfContentsProps = {
  /** CSS selector or element to collect h2s from. Defaults to "main". */
  scope?: string | HTMLElement;
};

type Item = { id: string; label: string };

function isHeading(target: Element): target is HTMLHeadingElement {
  return target.tagName === "H2";
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TableOfContents({ scope = "main" }: TableOfContentsProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root =
      typeof scope === "string" ? document.querySelector(scope) : scope;
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2"));
    const collected: Item[] = [];

    headings.forEach((heading, index) => {
      if (!isHeading(heading)) return;
      let id = heading.id;
      if (!id) {
        const label = heading.textContent?.trim() ?? "";
        id = slugify(label) || `section-${index + 1}`;
        heading.id = id;
      }
      heading.style.scrollMarginTop = "6rem";
      collected.push({ id, label: heading.textContent?.trim() ?? heading.id });
    });

    setItems(collected);
  }, [scope]);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (visible.size > 0) setActiveId(headings.find((h) => visible.has(h.id))?.id ?? null);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max > 0 && window.scrollY >= max - 4) {
        setActiveId(items[items.length - 1].id);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-20">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          On this page
        </p>
        <ul className="mt-3 space-y-1 border-l border-rule">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-4 font-body text-sm leading-relaxed text-ink-soft transition-colors hover:text-ink",
                  activeId === item.id
                    ? "border-seal text-seal"
                    : "border-transparent",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
