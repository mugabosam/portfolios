import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { ForcedState } from "./button";

const base =
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-caption font-medium";

/**
 * Technology chip. Static by default; with `href` it becomes a link whose
 * hit area is extended to 44px tall without changing its visual size.
 */
export function Tag({
  children,
  href,
  className,
  forceState,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  forceState?: ForcedState;
}) {
  if (!href) {
    return (
      <span
        className={cn(base, "border-line bg-surface text-ink-2", className)}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      data-force={forceState}
      className={cn(
        base,
        "relative border-line bg-surface text-accent-ink transition-colors duration-(--dur-ui) ease-out after:absolute after:inset-x-0 after:-inset-y-3 hocus:border-accent-ink hocus:bg-accent-tint",
        className,
      )}
    >
      {children}
    </Link>
  );
}
