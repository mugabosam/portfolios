import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Small, widely tracked uppercase label above a heading. */
export function Eyebrow({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** Lets a section use the eyebrow as part of its accessible name. */
  id?: string;
}) {
  return (
    <p id={id} className={cn("type-label text-fg-muted", className)}>
      {children}
    </p>
  );
}
