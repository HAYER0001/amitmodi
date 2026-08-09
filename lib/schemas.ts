/*
 * lib/schemas.ts — Zod schemas shared by the client form and the API route.
 *
 * One schema, validated twice: the client form validates each step before it
 * lets a visitor advance, and app/api/consultation/route.ts re-validates the
 * entire payload with the same consultationSchema on every POST. Never trust
 * the client — this file is the single source of truth for what a valid
 * consultation request looks like.
 *
 * The phone field normalises input (whitespace stripped) before validating
 * against the Indian-mobile pattern. The exact test cases live in
 * lib/schemas.test.ts; the behaviour decisions are documented there too.
 */
import { z } from "zod";

/** The eight service slugs plus 'other'. Derive labels from data/services. */
export const SERVICE_SLUGS = [
  "pan-card-services",
  "gst-registration",
  "entity-formation",
  "income-tax-tds-returns",
  "gst-returns-filing",
  "income-tax-appeals",
  "gst-appeals",
  "import-export-licence",
  "other",
] as const;

export const SITUATIONS = [
  "starting out",
  "ongoing compliance",
  "received a notice",
  "appeal or dispute",
  "not sure",
] as const;

export const URGENCIES = ["this week", "this month", "planning ahead"] as const;

/**
 * Indian mobile: 10 digits, first digit 6–9, optionally +91 prefixed.
 * Internal whitespace (spaces, tabs) is stripped before matching, so
 * "98765 43210" is accepted as 9876543210. A bare "91" prefix is NOT treated
 * as a country code — it must be written "+91", because a 12-digit number is
 * never a valid Indian mobile and accepting it would be guessing.
 */
const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\s+/g, ""))
  .pipe(
    z.string().regex(
      /^(\+91)?[6-9]\d{9}$/,
      "Enter a valid 10-digit Indian mobile number (starting with 6–9), like 9876543210",
    ),
  );

export const consultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name — at least 2 characters")
    .max(80, "Keep your name under 80 characters"),
  phone: phoneSchema,
  email: z
    .union([
      z.literal(""),
      z.string().trim().toLowerCase().email("Enter a valid email address, like you@example.com"),
    ])
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  service: z.enum(SERVICE_SLUGS, { error: "Choose the service you need help with" }),
  situation: z.enum(SITUATIONS, { error: "Choose the option closest to your situation" }),
  urgency: z.enum(URGENCIES, { error: "Choose how soon you need help" }),
  message: z
    .string()
    .trim()
    .max(1500, "Please keep your message under 1,500 characters")
    .optional(),
  consent: z.literal(true, { error: "Tick the box so we can use your details to respond" }),
  /** Honeypot: must stay empty. The API short-circuits on it BEFORE validating. */
  company: z.literal("", { error: "Leave this field empty" }),
});

/** Raw input shape — what the form holds (email may be "" before clearing). */
export type ConsultationValues = z.input<typeof consultationSchema>;

/** Cleaned output shape — what the API sends to Resend. */
export type ConsultationOutput = z.output<typeof consultationSchema>;

/** Per-step validation: pick the fields a step must satisfy before advancing. */
export const stepSchemas = {
  1: consultationSchema.pick({ service: true, situation: true }),
  2: consultationSchema.pick({ urgency: true }),
  3: consultationSchema.pick({ name: true, phone: true, email: true }),
  4: consultationSchema.pick({ message: true, consent: true }),
} as const;

/** Typed JSON contract for the API response, shared by the client fetch. */
export type ConsultationApiResponse =
  | { ok: true; message: string }
  | { ok: false; error: string };
