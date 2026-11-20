import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** h2 for a home-page section, with an optional intro and a trailing action. */
export function SectionHeading({
  id,
  title,
  intro,
  action,
  className,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-12 gap-y-6",
        className,
      )}
    >
      <div className="max-w-2xl">
        <h2 id={id} className="type-h2">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lead text-ink-2">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
