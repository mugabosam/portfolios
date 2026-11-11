import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { ForcedState } from "./button";

const base = "inline-flex items-center border px-3 py-1 font-mono text-label";

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
      <span className={cn(base, "border-line text-fg-muted", className)}>
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
        "relative border-line-strong text-fg transition-colors duration-(--dur-ui) ease-out after:absolute after:inset-x-0 after:-inset-y-3 hocus:bg-fg hocus:text-bg",
        className,
      )}
    >
      {children}
    </Link>
  );
}
