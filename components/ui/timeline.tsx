import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Vertical timeline: a thin line with one dot per entry. */
export function Timeline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ol className={cn("relative border-l border-line", className)}>
      {children}
    </ol>
  );
}

/** One entry. `filled` marks the dot as reached (filled on scroll in Phase 5). */
export function TimelineItem({
  period,
  title,
  org,
  children,
  filled = false,
}: {
  period: string;
  title: string;
  org: string;
  children?: ReactNode;
  filled?: boolean;
}) {
  return (
    <li className="relative pb-12 pl-8 last:pb-0 md:pl-12">
      <span
        aria-hidden="true"
        data-filled={filled}
        className="absolute top-1.5 left-0 size-3 -translate-x-1/2 rounded-full border border-fg bg-bg transition-colors duration-(--dur-ui) data-[filled=true]:bg-fg"
      />
      <p className="type-label text-fg-muted">{period}</p>
      <h3 className="mt-2 font-display text-h4">{title}</h3>
      <p className="mt-1 text-fg-muted">{org}</p>
      {children && (
        <div className="mt-4 max-w-(--measure) text-fg-muted">{children}</div>
      )}
    </li>
  );
}
