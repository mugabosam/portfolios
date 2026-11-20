"use client";

import Script from "next/script";
import { type FormEvent, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type ContactFieldErrors,
  type ContactResult,
  contactSchema,
} from "@/lib/contact/schema";
import { cn } from "@/lib/cn";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-line-strong bg-paper px-3.5 py-2.5 text-body text-ink transition-[border-color,box-shadow] duration-(--dur-ui) placeholder:text-ink-3 focus:border-sky focus:shadow-[0_0_0_3px_rgb(0_112_168/0.18)] focus:outline-none aria-[invalid=true]:border-[#b42318]";

/**
 * Works three ways: with JavaScript it posts JSON and shows inline errors;
 * without it, the browser posts the form to the same route and lands on
 * /contact/sent or /contact/error; with Turnstile keys set, the widget is required.
 */
export function ContactForm({
  turnstileSiteKey,
}: {
  turnstileSiteKey?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fields, setFields] = useState<ContactFieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const next: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "message")
          next[key] ??= issue.message;
      }
      setFields(next);
      setStatus({
        kind: "error",
        message: "Please check the highlighted fields.",
      });
      const first = Object.keys(next)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setFields({});
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ContactResult;
      if (result.ok) {
        form.reset();
        setStatus({ kind: "sent" });
      } else {
        setFields(result.fields ?? {});
        setStatus({ kind: "error", message: result.error });
      }
    } catch {
      setStatus({
        kind: "error",
        message:
          "The message could not be sent. Please check your connection and try again.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" aria-live="polite">
        <p className="inline-flex items-center gap-2 rounded-sm bg-leaf-tint px-2 py-0.5 text-small font-semibold text-leaf-ink">
          Message sent
        </p>
        <p className="mt-4 type-h3">
          Thank you. I read every message and reply within a few days.
        </p>
        <Button className="mt-8" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </Button>
      </div>
    );
  }

  const field = (name: keyof ContactFieldErrors) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": fields[name] ? true : undefined,
    "aria-describedby": fields[name] ? `${id}-${name}-error` : undefined,
  });

  return (
    <form
      action="/api/contact"
      method="post"
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-6"
    >
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <div>
        <label htmlFor={`${id}-name`} className="text-small font-semibold">
          Name
        </label>
        <input
          {...field("name")}
          type="text"
          autoComplete="name"
          required
          className={cn(inputClass, "mt-2")}
        />
        {fields.name && (
          <p
            id={`${id}-name-error`}
            className="mt-2 text-small font-medium text-[#b42318]"
          >
            {fields.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="text-small font-semibold">
          Email
        </label>
        <input
          {...field("email")}
          type="email"
          autoComplete="email"
          required
          className={cn(inputClass, "mt-2")}
        />
        {fields.email && (
          <p
            id={`${id}-email-error`}
            className="mt-2 text-small font-medium text-[#b42318]"
          >
            {fields.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="text-small font-semibold">
          Message
        </label>
        <textarea
          {...field("message")}
          rows={6}
          required
          minLength={20}
          className={cn(inputClass, "mt-2 resize-y")}
          placeholder="What are you building, and where could I help?"
        />
        {fields.message && (
          <p
            id={`${id}-message-error`}
            className="mt-2 text-small font-medium text-[#b42318]"
          >
            {fields.message}
          </p>
        )}
      </div>

      {/* Honeypot: off-screen and hidden from assistive technology. */}
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {turnstileSiteKey && (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="light"
        />
      )}

      <div className="flex flex-wrap items-center gap-6">
        <Button
          type="submit"
          variant="primary"
          disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending" : "Send message"}
        </Button>
        <p aria-live="polite" className="text-small text-ink-2">
          {status.kind === "error" ? status.message : ""}
        </p>
      </div>
    </form>
  );
}
