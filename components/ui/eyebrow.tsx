import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Small, widely tracked uppercase label above a heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("type-label text-fg-muted", className)}>{children}</p>
  );
}
