import Link from "next/link";
import { brand } from "@/lib/brand";

/*
 * ToolCta — the result-contextual conversion card beneath every calculator
 * output (SEO-GEO-AEO plan, 1.1).
 *
 * The plan asks for copy that references the computed situation, not a generic
 * "Contact us", so each tool passes its own `headline`. The /contact link
 * always renders; the WhatsApp deep link renders ONLY once the whatsapp fact
 * is confirmed — the brand contract resolves 'TBD' to null, so a null here
 * renders nothing, and the prefill reuses the exact summary string the
 * calculator produced rather than inventing a figure. ClosingCTA still covers
 * the page-level ask; this card is what sits beneath the output itself.
 */

type ToolCtaProps = {
  /** The tool's headline result, e.g. "₹1,180" — prefilled into the wa.me text. */
  resultText?: string | null;
  /** The plan's tool-specific contextual line, shown as the card's lead. */
  headline?: string | null;
  /** Short name for the prefill message, e.g. "GST calculator". */
  toolName?: string | null;
};

export default function ToolCta({ resultText, headline, toolName }: ToolCtaProps) {
  const whatsapp: string | null = brand.contact.whatsapp as string | null;

  const message = [
    `Hi, I used the ${toolName ?? "calculator"} on your site.`,
    resultText ? `It returned ${resultText}.` : "",
    "Can you help me review it?",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-md border border-rule bg-paper p-5 shadow-cut">
      <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">
        Get a professional check
      </h2>
      {headline && (
        <p className="mt-2 font-body text-base leading-relaxed text-ink">
          {headline}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center rounded-full bg-seal px-5 font-label text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-seal-deep"
        >
          Book a consultation
        </Link>
        {whatsapp && resultText && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-rule px-5 font-label text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-seal hover:text-seal"
          >
            Ask on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
