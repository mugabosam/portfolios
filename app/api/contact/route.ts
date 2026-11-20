import { NextResponse } from "next/server";
import { z } from "zod";

import { site } from "@/content/site";
import {
  type ContactFieldErrors,
  type ContactResult,
  contactSchema,
} from "@/lib/contact/schema";

/**
 * Contact form handler (brief §8). Runs as a Vercel serverless function, so
 * the Resend key never reaches the browser. In order: honeypot, rate limit,
 * validation, Turnstile (if configured), then email via Resend.
 *
 * Called with JSON by the hero's assistant when it sends a visitor's
 * message.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * Best-effort rate limit, per serverless instance. Enough to blunt a casual
 * script; a global limit would need a store such as Upstash (docs/decisions.md).
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: skip
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

async function sendEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Portfolio message from ${input.name}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}\n`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error(
      `Resend responded ${response.status}: ${await response.text()}`,
    );
  }
}

async function readInput(
  request: Request,
): Promise<{ data: Record<string, unknown>; isForm: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    return {
      data: (await request.json()) as Record<string, unknown>,
      isForm: false,
    };
  }
  const form = await request.formData();
  return { data: Object.fromEntries(form.entries()), isForm: true };
}

function respond(
  result: ContactResult,
  status: number,
  isForm: boolean,
  request: Request,
) {
  if (!isForm) return NextResponse.json(result, { status });
  return NextResponse.redirect(
    new URL(result.ok ? "/contact/sent" : "/contact/error", request.url),
    303,
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  let input: Awaited<ReturnType<typeof readInput>>;
  try {
    input = await readInput(request);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read the request." },
      { status: 400 },
    );
  }
  const { data, isForm } = input;

  // Honeypot: pretend it worked so bots learn nothing.
  if (typeof data.company === "string" && data.company.length > 0) {
    return respond({ ok: true }, 200, isForm, request);
  }

  if (rateLimited(ip)) {
    return respond(
      {
        ok: false,
        error:
          "Too many messages in a short time. Please try again in a few minutes.",
      },
      429,
      isForm,
      request,
    );
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const fields: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message")
        fields[key] ??= issue.message;
    }
    return respond(
      { ok: false, error: "Please check the highlighted fields.", fields },
      400,
      isForm,
      request,
    );
  }

  if (!(await verifyTurnstile(parsed.data["cf-turnstile-response"], ip))) {
    return respond(
      {
        ok: false,
        error:
          "The spam check did not pass. Please reload the page and try again.",
      },
      400,
      isForm,
      request,
    );
  }

  try {
    await sendEmail(parsed.data);
  } catch (error) {
    console.error(
      "[contact] delivery failed:",
      error instanceof Error ? error.message : error,
    );
    return respond(
      {
        ok: false,
        error: `The message could not be sent right now. Please email ${site.email} directly.`,
      },
      502,
      isForm,
      request,
    );
  }

  return respond({ ok: true }, 200, isForm, request);
}

/** Lets uptime checks confirm the function is deployed and configured. */
export function GET() {
  const configured = z
    .string()
    .min(1)
    .safeParse(process.env.RESEND_API_KEY).success;
  return NextResponse.json({ ok: true, configured });
}
