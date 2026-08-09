"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, type FieldPath } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, DUR, useReducedMotion } from "@/lib/motion";
import { inputClass, selectClass } from "@/components/tools/fields";
import { pushToast } from "@/components/ui/Toast";
import {
  consultationSchema,
  stepSchemas,
  SITUATIONS,
  URGENCIES,
  type ConsultationApiResponse,
  type ConsultationValues,
} from "@/lib/schemas";
import { SERVICES } from "@/data/services";

/*
 * ConsultationForm — the four-step consultation request (instrtion.md §V:
 * Multi-Step Form UX). One schema (lib/schemas.ts) validates each step before
 * the visitor can advance, and the API re-validates the whole payload.
 *
 * Progressive enhancement — the whole form works without JavaScript:
 *  - SSR renders ALL four steps visible inside a native <form method="post"
 *    action="/api/consultation">, with a single visible submit button. No JS,
 *    no React state: the browser POSTs the fields straight to the API, which
 *    303-redirects to /contact/thank-you on success.
 *  - After hydration the same markup swaps to the one-step-at-a-time view.
 *    Because the server render and the first client render are identical
 *    (mounted === false), there is no hydration mismatch; a useEffect then
 *    flips to the stepped UI.
 *  - Back never loses data: every field stays in the form's state the whole
 *    time, so going back is just a step-index change.
 *
 * Copy: Agent B owns the final wording (data/form-copy.ts). Strings are
 * inline here so this build stands alone; they are the defaults that Agent B
 * will take over.
 */

/* Display labels for the enum values (see lib/schemas.ts). */
const SITUATION_OPTIONS: { value: (typeof SITUATIONS)[number]; label: string }[] = [
  { value: "starting out", label: "I'm starting out" },
  { value: "ongoing compliance", label: "I need ongoing compliance" },
  { value: "received a notice", label: "I've received a notice" },
  { value: "appeal or dispute", label: "I'm in an appeal or dispute" },
  { value: "not sure", label: "I'm not sure" },
];

const URGENCY_OPTIONS: { value: (typeof URGENCIES)[number]; label: string }[] = [
  { value: "this week", label: "This week — it's urgent" },
  { value: "this month", label: "This month" },
  { value: "planning ahead", label: "I'm planning ahead" },
];

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.slug, label: s.shortName })),
  { value: "other", label: "Something else" },
];

const COPY = {
  progress: (step: number) => `Step ${step + 1} of 4`,
  stepHeadings: [
    "What do you need help with?",
    "How soon do you need help?",
    "Your details",
    "Anything else?",
  ] as const,
  stepSubs: [
    "Pick the service that fits and the situation you are in — both help the team prepare before they call you.",
    "This is triage, not a sales question. Urgent situations get an earlier slot.",
    "So we know who to reply to. We only use this to contact you about your request.",
    "Optional, but the more you share the better the reply — deadlines, documents, or the notice you received.",
  ] as const,
  serviceLabel: "Which service do you need?",
  servicePlaceholder: "Choose a service",
  situationLabel: "What best describes your situation?",
  urgencyLabel: "When do you need this?",
  nameLabel: "Your name",
  namePlaceholder: "e.g. Amit Modi",
  phoneLabel: "Mobile number",
  phonePlaceholder: "e.g. 9876543210",
  emailLabel: "Email address (optional)",
  emailPlaceholder: "you@example.com",
  messageLabel: "Your message (optional)",
  messagePlaceholder: "Tell us about your situation — what happened, the deadline you are facing, or the documents involved.",
  consentLabel:
    "I understand that Amit Modi & Co. will use the details I share only to respond to my request, and will not share them with anyone else.",
  backLabel: "Back",
  continueLabel: "Continue",
  submitLabel: "Request a consultation",
  sendingLabel: "Sending…",
  successToast: "Request sent. We will get back to you within one business day.",
  failureToast: "Something went wrong. Please try again in a moment.",
  requiredNote: "Required fields are marked with an asterisk (*).",
};

/** Widened form shape: enum fields start empty, consent starts unchecked. */
type FormValues = {
  name: string;
  phone: string;
  email: string;
  service: ConsultationValues["service"] | "";
  situation: ConsultationValues["situation"] | "";
  urgency: ConsultationValues["urgency"] | "";
  message: string;
  consent: boolean;
  company: string;
};

const DEFAULTS: FormValues = {
  name: "",
  phone: "",
  email: "",
  service: "",
  situation: "",
  urgency: "",
  message: "",
  consent: false,
  company: "",
};

export default function ConsultationForm() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULTS });

  const serviceRef = useRef<HTMLSelectElement>(null);
  const urgencyFirstRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  /* index by step: 0 service, 1 urgency, 2 name, 3 message */
  const focusRefs = [serviceRef, urgencyFirstRef, nameRef, messageRef];

  useEffect(() => {
    setMounted(true);
  }, []);

  /* The first step mounts with initial={false} (no animation), so
     onAnimationComplete never fires for it — focus it here instead, once the
     stepped view has painted. Later steps are focused by onAnimationComplete. */
  useEffect(() => {
    if (mounted) focusFirstField(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function focusFirstField(activeStep: number) {
    focusRefs[activeStep]?.current?.focus();
  }

  /** Validate only the current step with the shared schema before advancing. */
  function validateStep(activeStep: number): boolean {
    clearErrors();
    /* getValues() returns the widened FormValues; the runtime values are
       whatever the visitor typed and safeParse validates them against the
       strict enum — the cast only widens for TypeScript. */
    const result = stepSchemas[(activeStep + 1) as 1 | 2 | 3 | 4].safeParse(
      getValues() as ConsultationValues,
    );
    if (result.success) return true;
    for (const issue of result.error.issues) {
      const path = String(issue.path[0]) as FieldPath<FormValues>;
      setError(path, { type: "manual", message: issue.message });
    }
    return false;
  }

  function advance() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: FormValues) {
    /* Every field was validated step-by-step already; this full check is
       defence in depth before the payload leaves the client. */
    const parsed = consultationSchema.safeParse(values as ConsultationValues);
    if (!parsed.success) return;
    setSubmitting(true);
    try {
      const resp = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await resp.json().catch(() => null)) as ConsultationApiResponse | null;
      if (resp.ok && body?.ok) {
        pushToast({ message: COPY.successToast, tone: "success" });
        window.setTimeout(() => router.push("/contact/thank-you"), 1200);
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

  function aria(field: keyof FormValues) {
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    } as const;
  }

  const { ref: serviceFieldRef, ...serviceFieldProps } = register("service", {
    onChange: () => clearErrors("service"),
  });
  const { ref: situationFieldRef, ...situationFieldProps } = register("situation", {
    onChange: () => clearErrors("situation"),
  });
  const { ref: urgencyFieldRef, ...urgencyFieldProps } = register("urgency", {
    onChange: () => clearErrors("urgency"),
  });
  const { ref: nameFieldRef, ...nameFieldProps } = register("name", {
    onChange: () => clearErrors("name"),
  });
  const phoneField = register("phone", { onChange: () => clearErrors("phone") });
  const emailField = register("email", { onChange: () => clearErrors("email") });
  const { ref: messageFieldRef, ...messageFieldProps } = register("message", {
    onChange: () => clearErrors("message"),
  });
  const consentField = register("consent", { onChange: () => clearErrors("consent") });

  function ErrorText({ id, message }: { id: string; message: string | undefined }) {
    if (!message) return null;
    return (
      <p id={id} className="mt-1.5 font-body text-sm leading-relaxed text-stamp">
        {message}
      </p>
    );
  }

  const stepOne = (
    <fieldset className="space-y-7">
      <div>
        <label htmlFor="service" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.serviceLabel} <span aria-hidden="true">*</span>
        </label>
        <div className="mt-2">
          <select
            id="service"
            ref={(el) => {
              serviceFieldRef(el);
              serviceRef.current = el;
            }}
            {...serviceFieldProps}
            {...aria("service")}
            className={selectClass}
          >
            <option value="">{COPY.servicePlaceholder}</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ErrorText id="service-error" message={errors.service?.message} />
        </div>
      </div>

      <div role="group" aria-labelledby="situation-label">
        <span id="situation-label" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.situationLabel} <span aria-hidden="true">*</span>
        </span>
        <div className="mt-2 space-y-3">
          {SITUATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-md border border-rule bg-paper px-4 py-3 has-[:checked]:border-seal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-seal/30"
            >
              <input
                type="radio"
                value={opt.value}
                ref={situationFieldRef}
                {...situationFieldProps}
                {...aria("situation")}
                className="h-4 w-4 accent-seal"
              />
              <span className="font-body text-sm leading-relaxed text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
        <ErrorText id="situation-error" message={errors.situation?.message} />
      </div>
    </fieldset>
  );

  const stepTwo = (
    <fieldset role="group" aria-labelledby="urgency-label">
      <span id="urgency-label" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
        {COPY.urgencyLabel} <span aria-hidden="true">*</span>
      </span>
      <div className="mt-2 space-y-3">
        {URGENCY_OPTIONS.map((opt, index) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 rounded-md border border-rule bg-paper px-4 py-3 has-[:checked]:border-seal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-seal/30"
          >
            <input
              type="radio"
              value={opt.value}
              ref={(el) => {
                urgencyFieldRef(el);
                if (index === 0) urgencyFirstRef.current = el;
              }}
              {...urgencyFieldProps}
              {...aria("urgency")}
              className="h-4 w-4 accent-seal"
            />
            <span className="font-body text-sm leading-relaxed text-ink">{opt.label}</span>
          </label>
        ))}
      </div>
      <ErrorText id="urgency-error" message={errors.urgency?.message} />
    </fieldset>
  );

  const stepThree = (
    <fieldset className="space-y-7">
      <div>
        <label htmlFor="name" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.nameLabel} <span aria-hidden="true">*</span>
        </label>
        <div className="mt-2">
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={COPY.namePlaceholder}
            ref={(el) => {
              nameFieldRef(el);
              nameRef.current = el;
            }}
            {...nameFieldProps}
            {...aria("name")}
            className={inputClass}
          />
          <ErrorText id="name-error" message={errors.name?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.phoneLabel} <span aria-hidden="true">*</span>
        </label>
        <div className="mt-2">
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={COPY.phonePlaceholder}
            {...phoneField}
            {...aria("phone")}
            className={inputClass}
          />
          <ErrorText id="phone-error" message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.emailLabel}
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={COPY.emailPlaceholder}
            {...emailField}
            {...aria("email")}
            className={inputClass}
          />
          <ErrorText id="email-error" message={errors.email?.message} />
        </div>
      </div>
    </fieldset>
  );

  const stepFour = (
    <fieldset className="space-y-7">
      <div>
        <label htmlFor="message" className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
          {COPY.messageLabel}
        </label>
        <div className="mt-2">
          <textarea
            id="message"
            rows={5}
            placeholder={COPY.messagePlaceholder}
            ref={(el) => {
              messageFieldRef(el);
              messageRef.current = el;
            }}
            {...messageFieldProps}
            {...aria("message")}
            className={cn(inputClass, "resize-y")}
          />
          <ErrorText id="message-error" message={errors.message?.message} />
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            value="true"
            {...consentField}
            {...aria("consent")}
            className="mt-1 h-4 w-4 accent-seal"
          />
          <span className="font-body text-sm leading-relaxed text-ink">{COPY.consentLabel}</span>
        </label>
        <ErrorText id="consent-error" message={errors.consent?.message} />
      </div>

      <p className="border-t border-rule pt-4 font-body text-sm leading-relaxed text-ink-soft">
        Your details are used only to respond to your request and are never shared. See our{" "}
        <Link href="/privacy" className="underline decoration-seal/50 underline-offset-2 hover:text-seal">
          privacy policy
        </Link>
        .
      </p>
    </fieldset>
  );

  const steps = [stepOne, stepTwo, stepThree, stepFour];

  return (
    <div className="rounded-md border border-rule bg-paper p-5 shadow-cut sm:p-7">
      {/* progress indicator — only meaningful in the stepped (JS) view */}
      {mounted && (
        <div aria-hidden="true" className="mb-6">
          <div className="flex items-center justify-between">
            <p className="font-label text-xs uppercase tracking-[0.14em] text-ink-soft">
              {COPY.progress(step)}
            </p>
            <span className="font-label text-xs uppercase tracking-[0.14em] text-stamp">
              {COPY.stepHeadings[step]}
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-paper-deep">
            <div
              className="h-full rounded-full bg-seal transition-all duration-300"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      <form method="post" action="/api/consultation" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* honeypot — visually hidden, tabIndex -1, aria-hidden; bots fill it,
            humans never do. The API short-circuits on it before validating. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="company">Company</label>
          <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </div>

        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -16 }}
              transition={{ duration: reduced ? 0 : DUR.fast, ease: EASE }}
              onAnimationComplete={() => focusFirstField(step)}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* no-JS fallback: the whole form on one page */
          <>
            {steps.map((s, i) => (
              <div key={i} className="mb-8">
                <h3 className="font-display text-h3 text-ink">{COPY.stepHeadings[i]}</h3>
                <div className="mt-4">{s}</div>
              </div>
            ))}
          </>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-6">
          <div className="min-w-0">
            {mounted && step > 0 && (
              <button
                type="button"
                onClick={back}
                className="inline-flex min-h-11 items-center rounded-pill border border-rule px-6 font-label text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-seal hover:text-seal"
              >
                {COPY.backLabel}
              </button>
            )}
          </div>

          {mounted && step < 3 ? (
            <button
              type="button"
              onClick={advance}
              className="inline-flex min-h-11 items-center rounded-pill bg-seal px-8 font-label text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep"
            >
              {COPY.continueLabel}
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "inline-flex min-h-11 items-center rounded-pill bg-seal px-8 font-label text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-seal-deep disabled:opacity-60",
                mounted && step !== 3 && "hidden",
              )}
            >
              {submitting ? COPY.sendingLabel : COPY.submitLabel}
            </button>
          )}
        </div>

        <p className="mt-4 font-label text-xs text-ink-soft">{COPY.requiredNote}</p>
      </form>
    </div>
  );
}
