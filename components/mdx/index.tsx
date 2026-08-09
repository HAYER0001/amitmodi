import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils";
import { getImageDimensions } from "@/lib/mdx";

/*
 * components/mdx/index.tsx — the MDX component map (Phase 14, Agent A).
 *
 * Server-only: the article template renders via compileMDX (RSC), and the
 * <img> override reads image dimensions from disk. Every heading gets an
 * auto-generated id (slugified, matching the TOC in lib/mdx.ts) plus an
 * anchor link. Internal <a> become next/link with prefetch; outbound links
 * get rel="noopener noreferrer" and an external indicator. Custom components
 * usable from inside MDX: Callout, StatBox, ComparisonTable, StatuteRef,
 * Verify.
 */

/* ---- inline text / heading helpers ------------------------------------ */

function childrenToText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return childrenToText((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  const size =
    level === 2
      ? "mt-12 mb-4 font-display text-h2"
      : level === 3
        ? "mt-8 mb-3 font-display text-h3"
        : "mt-6 mb-2 font-body text-lg font-semibold";
  return function HeadingNode({ children }: { children?: ReactNode }) {
    const text = childrenToText(children);
    const id = slugify(text);
    return (
      <Tag
        id={id}
        className={cn("group relative scroll-mt-24 text-ink", size)}
      >
        {children}
        <a
          href={`#${id}`}
          aria-label={`Permalink to ${text}`}
          className="ml-2 text-brass opacity-0 transition-opacity hover:text-seal focus-visible:opacity-100 group-hover:opacity-100"
        >
          #
        </a>
      </Tag>
    );
  };
}

/* ---- link override ----------------------------------------------------- */

function isExternal(href: string): boolean {
  if (/^https?:\/\//.test(href)) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl && href.startsWith(siteUrl)) return false;
    return true;
  }
  return false;
}

function MdxLink({
  href,
  node: _node,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) {
  if (!href) return <a {...rest}>{children}</a>;

  /* in-page anchors stay plain */
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span aria-hidden="true" className="ml-0.5 align-super text-[0.6em] text-brass">
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={href} prefetch className={cn("text-seal underline underline-offset-2 hover:text-seal-deep", rest.className)}>
      {children}
    </Link>
  );
}

/* ---- image override ---------------------------------------------------- */

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement> & { node?: unknown }) {
  const { src, alt, node: _node, ...rest } = props;
  if (typeof src === "string" && src.startsWith("/")) {
    const dims = getImageDimensions(src);
    if (dims) {
      return (
        <Image
          src={src}
          alt={alt ?? ""}
          width={dims.width}
          height={dims.height}
          sizes="(min-width: 768px) 48rem, 100vw"
          className="my-6 h-auto w-full rounded-md border border-rule shadow-cut"
        />
      );
    }
  }
  return <img {...props} />;
}

/* ---- custom components usable from inside MDX -------------------------- */

type CalloutTone = "note" | "warning" | "success";

const CALLOUT_ACCENT: Record<CalloutTone, string> = {
  note: "border-brass",
  warning: "border-stamp",
  success: "border-seal",
};

const CALLOUT_LABEL: Record<CalloutTone, string> = {
  note: "Note",
  warning: "Warning",
  success: "Cleared",
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <aside
      className={cn(
        "my-6 border-l-4 bg-paper-deep p-5 sm:p-6",
        CALLOUT_ACCENT[tone],
      )}
    >
      <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {title ?? CALLOUT_LABEL[tone]}
      </p>
      <div className="mt-2 font-body text-body leading-relaxed text-ink">
        {children}
      </div>
    </aside>
  );
}

export function StatBox({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source?: string;
}) {
  return (
    <figure className="my-6 rounded-md border border-rule bg-paper p-6 shadow-cut">
      <p className="font-display text-h2 text-seal">{value}</p>
      <figcaption className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
        {label}
        {source && (
          <span className="mt-1 block font-label text-xs uppercase tracking-[0.14em] text-brass">
            {source}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-md border border-rule">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-paper-deep">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b border-rule px-4 py-3 font-label text-xs uppercase tracking-[0.14em] text-ink"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="odd:bg-paper">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-rule px-4 py-3 font-body text-sm leading-relaxed text-ink"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatuteRef({ children }: { children?: ReactNode }) {
  return (
    <span
      className="marginalia mx-1 inline-block whitespace-nowrap font-margin text-base"
      style={{ "--rot": "-2deg" } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

/** Visible warning in development; nothing in production. */
export function Verify({ children }: { children?: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p
      role="note"
      className="my-4 border-l-4 border-stamp bg-paper-deep p-3 font-label text-xs uppercase leading-relaxed tracking-[0.14em] text-stamp"
    >
      Unverified — replace before publishing: {children}
    </p>
  );
}

/* ---- the map ----------------------------------------------------------- */

export const mdxComponents: MDXComponents = {
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  a: MdxLink,
  img: MdxImage,
  p: ({ node: _node, children, ...rest }) => (
    <p className="my-5 font-body text-body leading-relaxed text-ink" {...rest}>
      {children}
    </p>
  ),
  ul: ({ node: _node, children, ...rest }) => (
    <ul className="my-5 space-y-2 pl-1" {...rest}>
      {children}
    </ul>
  ),
  ol: ({ node: _node, children, ...rest }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-seal" {...rest}>
      {children}
    </ol>
  ),
  li: ({ node: _node, children, ...rest }) => (
    <li className="flex items-start gap-3 font-body text-body leading-relaxed text-ink" {...rest}>
      <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-seal" />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ node: _node, children, ...rest }) => (
    <blockquote className="my-6 border-l-4 border-brass bg-paper-deep p-5 font-body text-body italic leading-relaxed text-ink" {...rest}>
      {children}
    </blockquote>
  ),
  code: ({ node: _node, children, ...rest }) => (
    <code
      className="rounded-sm bg-paper-deep px-1.5 py-0.5 font-label text-[0.85em] text-seal-deep"
      {...rest}
    >
      {children}
    </code>
  ),
  pre: ({ node: _node, children, ...rest }) => (
    <pre className="my-6 overflow-x-auto rounded-md border border-rule bg-night p-5 font-label text-sm leading-relaxed text-[#EDEAE3]" {...rest}>
      {children}
    </pre>
  ),
  table: ({ node: _node, children, ...rest }) => (
    <div className="my-6 overflow-x-auto rounded-md border border-rule">
      <table className="w-full border-collapse text-left" {...rest}>
        {children}
      </table>
    </div>
  ),
  thead: ({ node: _node, ...props }) => <thead className="bg-paper-deep" {...props} />,
  th: ({ node: _node, children, ...rest }) => (
    <th
      scope="col"
      className="border-b border-rule px-4 py-3 font-label text-xs uppercase tracking-[0.14em] text-ink"
      {...rest}
    >
      {children}
    </th>
  ),
  td: ({ node: _node, children, ...rest }) => (
    <td className="border-b border-rule px-4 py-3 font-body text-sm leading-relaxed text-ink" {...rest}>
      {children}
    </td>
  ),
  hr: () => <hr className="my-10 border-rule" />,
  Callout,
  StatBox,
  ComparisonTable,
  StatuteRef,
  Verify,
};
