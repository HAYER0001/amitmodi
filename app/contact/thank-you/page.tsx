import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

/*
 * app/contact/thank-you/page.tsx — the conversion page.
 *
 * A distinct URL on purpose: /contact/thank-you is the GA4 conversion
 * destination (instrtion.md §VII) and the target of the no-JavaScript form
 * redirect. It states what happens next and by when, and nothing more — the
 * visitor already answered the questions.
 */

export const metadata: Metadata = buildMetadata({
  title: "Request Received",
  description: "Your consultation request is in. We will get back to you within one business day.",
  path: "/contact/thank-you",
  noIndex: true,
});

const NEXT_STEPS = [
  {
    title: "We review your request",
    detail: "A member of the team reads what you told us — the service, the situation, and your message.",
  },
  {
    title: "We get back to you",
    detail: "Expect a reply by email or phone within one business day. If you marked it urgent, we will reach out as soon as we can during office hours.",
  },
  {
    title: "You get a clear answer",
    detail: "No obligation. First, an honest read of your position and what should happen next.",
  },
] as const;

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <section className="rounded-md border border-rule bg-paper p-7 shadow-cut sm:p-10">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">Request received</p>
        <h1 className="mt-3 font-display text-h2 text-ink">
          Thank you — your consultation request is in.
        </h1>
        <p className="mt-4 font-body text-base leading-relaxed text-ink-soft">
          You will hear from us within one business day. Here is what happens
          between now and then:
        </p>

        <ol className="mt-8 space-y-6">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-seal font-label text-sm text-paper"
              >
                {index + 1}
              </span>
              <div>
                <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">
                  {step.title}
                </h2>
                <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center justify-center rounded-pill bg-seal px-6 font-label text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
          >
            Explore our services
          </Link>
          <Link
            href="/tools"
            className="inline-flex min-h-11 items-center justify-center rounded-pill border border-rule px-6 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
          >
            Free compliance tools
          </Link>
        </div>
      </section>
    </div>
  );
}
