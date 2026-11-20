import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The navy frame every piece of code sits in: a title bar with the file
 * name, then the code. Used by code peeks, case-study snippets and the hero
 * API card.
 */
export function CodePanel({
  title,
  meta,
  children,
  className,
  as: Tag = "div",
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "div" | "figure";
}) {
  const Caption = Tag === "figure" ? "figcaption" : "div";
  return (
    <Tag className={cn("overflow-hidden code-panel", className)}>
      <Caption className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-code-line px-4 py-2 text-caption">
        <span className="font-mono text-code-fg">{title}</span>
        {meta && <span className="font-sans text-code-muted">{meta}</span>}
      </Caption>
      {children}
    </Tag>
  );
}
