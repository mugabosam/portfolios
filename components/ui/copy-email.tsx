"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

import { CheckIcon, CopyIcon } from "./icons";

const noopSubscribe = () => () => {};

/**
 * The email address as a mailto link, plus a button that copies it. The
 * button confirms in place ("Copied") and announces it politely. Without
 * JavaScript, or where the Clipboard API is blocked, only the link shows.
 */
export function CopyEmail({
  email,
  tone = "light",
  className,
}: {
  email: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  // Feature detection has to wait for the browser; the server renders the link only.
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.clipboard?.writeText === "function",
    () => false,
  );
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  };

  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-stretch overflow-hidden rounded-md border",
        dark ? "border-white/30 bg-white/10" : "border-line-strong bg-surface",
        className,
      )}
    >
      <a
        href={`mailto:${email}`}
        className={cn(
          "inline-flex min-h-tap min-w-0 items-center truncate px-4 font-mono text-small transition-colors duration-(--dur-ui)",
          dark ? "text-white hocus:text-sun" : "text-ink hocus:text-sky",
        )}
      >
        {email}
      </a>
      {supported && (
        <button
          type="button"
          onClick={copy}
          className={cn(
            "relative inline-flex min-h-tap shrink-0 items-center gap-2 border-l px-4 text-small font-semibold transition-colors duration-(--dur-ui)",
            dark
              ? "border-code-line text-code-fg hocus:bg-white/10"
              : "border-line-strong text-ink hocus:bg-sky-tint",
          )}
        >
          <span className="relative size-4">
            <CopyIcon
              className={cn(
                "absolute inset-0 size-4 transition-[opacity,scale] duration-(--dur-move) ease-(--ease-out)",
                state === "copied" ? "scale-50 opacity-0" : "opacity-100",
              )}
            />
            <CheckIcon
              className={cn(
                "absolute inset-0 size-4 transition-[opacity,scale] duration-(--dur-move) ease-(--ease-out)",
                dark ? "text-white" : "text-leaf-ink",
                state === "copied" ? "opacity-100" : "scale-50 opacity-0",
              )}
            />
          </span>
          <span className="w-[3.9em] text-left">
            {state === "copied"
              ? "Copied"
              : state === "failed"
                ? "Blocked"
                : "Copy"}
          </span>
          <span className="sr-only" role="status" aria-live="polite">
            {state === "copied"
              ? "Email address copied"
              : state === "failed"
                ? "Copying is blocked in this browser"
                : ""}
          </span>
        </button>
      )}
    </div>
  );
}
