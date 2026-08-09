"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type FieldPath } from "react-hook-form";
import { inputClass } from "@/components/tools/fields";
import { pushToast } from "@/components/ui/Toast";
import {
  downloadSchema,
  type DownloadApiResponse,
  type LeadMagnetAsset,
} from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";

/*
 * components/content/LeadMagnet.tsx — the gated download (Phase 15, Agent A).
 *
 * Gates the artefact, never the answer: the page around it is fully readable
 * and crawlable; this component only exchanges an email + consent for the
 * formatted PDF. The API emails the download link (so the address is real
 * before a file goes out) instead of streaming the file back.
 *
 * The same downloadSchema is validated here, on the client, and re-validated
 * by app/api/download/route.ts. A hidden `company` field is the honeypot; the
 * API short-circuits on it before validating. On success a GA4 event fires
 * (via lib/analytics, a safe no-op until analytics is wired in).
 */

type FormValues = {
  email: string;
  consent: boolean;
  company: string;
};

const DEFAULTS: FormValues = { email: "", consent: false, company: "" };

const COPY = {
  heading: "Get it as a PDF",
  blurbDefault:
    "A formatted, print-ready copy — the same guidance, organised so it is easy to keep and easy to share.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  emailHint: "We email the download link. We never sell or share this address.",
  consentLabel:
    "I understand that Amit Modi & Co. will email me the download link and may follow up about the practice's services.",
  submitLabel: "Email me the download",
  sendingLabel: "Sending…",
  successTitle: "Check your inbox",
  successBody:
    "The download link is on its way to the address you gave. It may take a minute to arrive — check spam if it does not show up.",
  failureToast: "Something went wrong. Please try again in a moment.",
  requiredNote: "Required fields are marked with an asterisk (*).",
};

export function LeadMagnet({
  pdfSlug,
  title,
  blurb = COPY.blurbDefault,
  gaEvent = "lead_magnet_requested",
}: {
  pdfSlug: LeadMagnetAsset;
  title: string;
  blurb?: string;
  gaEvent?: string;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULTS });

  function aria(field: keyof FormValues) {
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    } as const;
  }

  async function onSubmit(values: FormValues) {
    const parsed = downloadSchema.safeParse({
      email: values.email,
      consent: values.consent === true,
      asset: pdfSlug,
      company: values.company,
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0]) as FieldPath<FormValues>;
        setError(path, { type: "manual", message: issue.message });
      }
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await resp.json().catch(() => null)) as DownloadApiResponse | null;
      if (resp.ok && body?.ok) {
        setSent(true);
        trackEvent(gaEvent, { asset: pdfSlug });
      } else {
        pushToast({
          message: body && "error" in body ? body.error : COPY.failureToast,
          tone: "error",
        });
        setSubmitting(false);
      }
    } catch {
      pushToast({ message: COPY.failureToast, tone: "error" });
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-md border border-seal bg-paper p-6 shadow-cut sm:p-8">
        <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
          {COPY.successTitle}
        </p>
        <h3 className="mt-2 font-display text-h3 text-ink">{title}</h3>
        <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
          {COPY.successBody}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-rule bg-paper p-6 shadow-cut sm:p-8">
      <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
        {COPY.heading}
      </p>
      <h3 className="mt-2 font-display text-h3 text-ink">{title}</h3>
      <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
        {blurb}
      </p>

      <form
        method="post"
        action="/api/download"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
      >
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="magnet-company">Company</label>
          <input
            id="magnet-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company")}
          />
        </div>

        <div>
          <label htmlFor="magnet-email" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
            {COPY.emailLabel} <span aria-hidden="true">*</span>
          </label>
          <div className="mt-2">
            <input
              id="magnet-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={COPY.emailPlaceholder}
              {...register("email", { onChange: () => clearErrors("email") })}
              {...aria("email")}
              className={inputClass}
            />
          </div>
          {errors.email ? (
            <p id="email-error" className="mt-1.5 font-body text-sm leading-relaxed text-stamp">
              {errors.email.message}
            </p>
          ) : (
            <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-soft">
              {COPY.emailHint}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register("consent", { onChange: () => clearErrors("consent") })}
              {...aria("consent")}
              className="mt-1 h-4 w-4 accent-seal"
            />
            <span className="font-body text-sm leading-relaxed text-ink">
              {COPY.consentLabel}
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="mt-1.5 font-body text-sm leading-relaxed text-stamp">
              {errors.consent.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-pill bg-seal px-6 font-label text-sm uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep disabled:opacity-60"
        >
          {submitting ? COPY.sendingLabel : COPY.submitLabel}
        </button>

        <p className="font-label text-xs text-ink-soft">
          {COPY.requiredNote} Your details are used only to send the download
          and are never shared. See our{" "}
          <Link
            href="/privacy"
            className="underline decoration-seal/50 underline-offset-2 hover:text-seal"
          >
            privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
