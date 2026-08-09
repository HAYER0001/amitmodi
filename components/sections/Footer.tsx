import Link from "next/link";
import { cn } from "@/lib/utils";
import { FOOTER_NAV } from "@/data/navigation";
import { ASSETS } from "@/data/assets";
import { brand } from "@/lib/brand";
import CutOut from "@/components/ui/CutOut";

/*
 * Footer — four columns on desktop (stacked on mobile), the fig-walking-row
 * strip running edge to edge as a decorative CutOut above the columns, and
 * below: the permanent legal disclaimer, copyright, and the trust-badge row.
 *
 * Brand facts (address, phone, email) come from lib/brand.ts and render
 * NOTHING while their value is 'TBD' — no empty <p>, no dash.
 */

const DISCLAIMER =
  "The content on this website is provided for general information only and is not intended to be, nor is it a substitute for, professional advice on any specific matter.";

export default function Footer() {
  const walkingRow = ASSETS["fig-walking-row"];

  const street = brand.address;
  const cityLine = [street.city, street.state, street.pin]
    .filter((v) => v !== null)
    .join(" - ");
  const addressLines = [
    street.line1,
    street.line2,
    cityLine || null,
  ].filter((line) => line !== null);
  const addressPresent = addressLines.length > 0;
  /* brand facts are typed null while 'TBD'; widen to string|null for truthy
     use so we never call methods on a guaranteed-null value */
  const phone: string | null = brand.contact.phone as string | null;
  const email: string | null = brand.contact.email as string | null;

  return (
    <footer className="mt-16 border-t border-rule bg-paper-deep">
      {/* decorative strip — edge to edge, a CutOut (screen readers skip it) */}
      <div className="overflow-hidden">
        <CutOut
          src={walkingRow.src}
          alt={walkingRow.alt}
          width={walkingRow.width}
          height={walkingRow.height}
          className="mx-auto w-full max-w-none"
        />
      </div>

      {/* columns — 4 across on desktop, stacked on mobile */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {FOOTER_NAV.map((column) => (
          <div key={column.heading}>
            <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">
              {column.heading}
            </h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-seal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* contact facts — render nothing while 'TBD' */}
      {addressPresent && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <address className="not-italic text-sm leading-relaxed text-ink-soft">
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </div>
      )}
      {phone && (
        <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-seal"
          >
            {phone}
          </a>
        </div>
      )}
      {email && (
        <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-seal"
          >
            {email}
          </a>
        </div>
      )}

      {/* legal disclaimer — permanent, per instrtion.md */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="border-t border-rule pt-6 font-body text-sm leading-relaxed text-ink-soft">
          {DISCLAIMER}
        </p>
      </div>

      {/* copyright + trust-badge row */}
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6",
        )}
      >
        <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          © {new Date().getFullYear()} Amit Modi & Co. All rights reserved.
        </p>
        {/* trust-badge row — only badges with real values render */}
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {brand.gstin && (
            <li className="font-label text-xs text-ink-soft">
              GSTIN · {brand.gstin}
            </li>
          )}
          {brand.pan && (
            <li className="font-label text-xs text-ink-soft">PAN · {brand.pan}</li>
          )}
          {brand.principal?.membershipNo && (
            <li className="font-label text-xs text-ink-soft">
              {brand.principal.designation ?? "Member"} ·{" "}
              {brand.principal.membershipNo}
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}