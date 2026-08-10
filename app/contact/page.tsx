import PageAtmosphere from "@/components/ui/PageAtmosphere";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { Toaster } from "@/components/ui/Toast";
import { brand } from "@/lib/brand";
import { buildMetadata, withSiteName } from "@/lib/seo";

/*
 * app/contact/page.tsx — the consultation funnel.
 *
 * The multi-step form is the primary path. Beside it: direct contact details
 * and office hours, rendered ONLY when the value exists (brand facts are null
 * while 'TBD' — see lib/brand.ts, nothing is shown rather than a guessed
 * placeholder), and the map placeholder that Phase 18 will replace with a real
 * embed. `?error=1` / `?error=rate` arrive from the no-JavaScript native POST
 * fallback when the API had to reject the submission.
 */

export const metadata: Metadata = buildMetadata({
  title: withSiteName("Request a Consultation"),
  description:
    "Tell us what you need help with and when. A member of the team will get back to you within one business day about GST, income tax, and compliance.",
  path: "/contact",
});

function ErrorBanner({ error }: { error: string | undefined }) {
  if (error !== "1" && error !== "rate") return null;
  const message =
    error === "rate"
      ? "You have sent too many requests. Please try again in a little while."
      : "There was a problem with one or more fields. Please review your answers and try again.";
  return (
    <div
      role="alert"
      className="relative mb-8 rounded-md border border-stamp bg-paper-deep px-4 py-3 font-body text-sm leading-relaxed text-ink"
    >

      {message}
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;

  const street = brand.address;
  const cityLine = [street.city, street.state, street.pin].filter((v) => v !== null).join(" - ");
  const addressLines = [street.line1, street.line2, cityLine || null].filter((line) => line !== null);
  const addressPresent = addressLines.length > 0;
  const phone: string | null = brand.contact.phone as string | null;
  const whatsapp: string | null = brand.contact.whatsapp as string | null;
  const email: string | null = brand.contact.email as string | null;
  const hoursPresent = brand.hours.some((h) => h.day !== null && h.opens !== null && h.closes !== null);

  return (
    <>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <PageAtmosphere density="utility" seed={29} object="cut-rubber-stamp" objectClassName="right-[6%] top-[8%] hidden w-24 -rotate-6 lg:block xl:w-36" />
        <Breadcrumbs />
        <section className="py-10">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">Contact</p>
          <h1 className="mt-2 max-w-2xl font-display text-h2 text-ink">
            Request a consultation
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-ink-soft">
            Four short questions. We will review your situation and get back to
            you within one business day — sooner if you are up against a
            deadline.
          </p>
        </section>

        <ErrorBanner error={error} />

        <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <ConsultationForm />

          <aside className="space-y-8" aria-label="Contact details">
            {/* direct contact facts — render nothing while 'TBD' */}
            {(phone || whatsapp || email || addressPresent) && (
              <section className="rounded-md border border-rule bg-paper p-5 shadow-cut">
                <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">Direct</h2>
                <ul className="mt-4 space-y-3">
                  {phone && (
                    <li>
                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex min-h-11 items-center font-body text-base text-ink-soft transition-colors hover:text-seal"
                      >
                        {phone}
                      </a>
                    </li>
                  )}
                  {whatsapp && (
                    <li>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center font-body text-base text-ink-soft transition-colors hover:text-seal"
                      >
                        WhatsApp
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex min-h-11 items-center font-body text-base text-ink-soft transition-colors hover:text-seal"
                      >
                        {email}
                      </a>
                    </li>
                  )}
                </ul>
                {addressPresent && (
                  <address className="mt-4 border-t border-rule pt-4 not-italic text-sm leading-relaxed text-ink-soft">
                    {addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                )}
              </section>
            )}

            {hoursPresent && (
              <section className="rounded-md border border-rule bg-paper p-5 shadow-cut">
                <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">Office hours</h2>
                <dl className="mt-4 space-y-2">
                  {brand.hours.map(
                    (h) =>
                      h.day &&
                      h.opens &&
                      h.closes && (
                        <div key={h.day} className="flex items-center justify-between gap-4 font-body text-sm text-ink-soft">
                          <dt>{h.day}</dt>
                          <dd>
                            {h.opens} – {h.closes}
                          </dd>
                        </div>
                      ),
                  )}
                </dl>
              </section>
            )}

            {/* map placeholder — Phase 18 replaces this with the real embed */}
            <section className="rounded-md border border-rule bg-paper p-5 shadow-cut">
              <h2 className="font-label text-xs uppercase tracking-[0.14em] text-ink">Visit us</h2>
              <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-rule bg-paper-deep">
                <div className="text-center">
                  <svg
                    aria-hidden="true"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mx-auto text-seal"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
                    Office location map
                  </p>
                </div>
              </div>
            </section>

            <p className="font-margin text-xl text-ink-soft">
              We respond within one business day.
            </p>
          </aside>
        </div>
      </div>

      <Toaster />
    </>
  );
}
