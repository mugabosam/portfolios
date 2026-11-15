import { z } from "zod";

// No eval-based fast paths: this schema also runs in the browser, under a
// Content Security Policy without 'unsafe-eval'.
z.config({ jitless: true });

/** Shared by the form (client) and the route handler (server). */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(120),
  message: z
    .string()
    .trim()
    .min(20, "Please say a little more: at least 20 characters.")
    .max(4000, "Please keep it under 4,000 characters."),
  /** Honeypot. Humans never see it, so it must stay empty. */
  company: z.string().max(0).optional().default(""),
  /** Cloudflare Turnstile token, present only when the widget is configured. */
  "cf-turnstile-response": z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "message", string>
>;

export type ContactResult =
  { ok: true } | { ok: false; error: string; fields?: ContactFieldErrors };
