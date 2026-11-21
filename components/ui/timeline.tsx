import Link from "next/link";

import type { TimelineEntry } from "@/content/profile";
import { cn } from "@/lib/cn";

export type TimelineGroup = { label: string; entries: TimelineEntry[] };

/**
 * Experience drawn like a commit graph: one branch line, a ref label for
 * each group (work, education, training) and a commit dot per entry. The
 * current role gets a live dot and a "Now" label. Where the browser supports
 * scroll-driven animation, the line draws itself as the list scrolls by.
 */
export function Timeline({
  groups,
  className,
}: {
  groups: TimelineGroup[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="commit-line absolute top-2 bottom-2 left-[0.6875rem] w-0.5 rounded-full bg-line-strong/50"
      />
      {groups.map((group, groupIndex) => (
        <div key={group.label} className={cn(groupIndex > 0 && "mt-12")}>
          <h3 className="relative flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-6 items-center justify-center rounded-full border-2 border-accent-ink bg-paper"
            >
              <span className="size-2 rounded-full bg-accent" />
            </span>
            <span className="rounded-sm border border-accent-ink/30 bg-accent-tint px-2 py-0.5 text-small font-semibold text-accent-ink">
              {group.label}
            </span>
          </h3>
          <ol className="mt-6 flex flex-col gap-8">
            {group.entries.map((entry) => (
              <TimelineItem key={entry.title} entry={entry} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const current = entry.period?.includes("Present") ?? false;
  return (
    <li className="relative pl-12">
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-[0.375rem] flex size-3 items-center justify-center rounded-full border-2 border-line-strong bg-paper"
      >
        {current && <span className="live-dot size-1.5!" />}
      </span>
      <p className="flex flex-wrap items-center gap-2 text-small text-ink-3 tabular-nums">
        {current && (
          <span className="rounded-sm bg-leaf-tint px-1.5 font-semibold text-leaf-ink">
            Now
          </span>
        )}
        {entry.period}
      </p>
      <h4 className="mt-1 text-h4 font-semibold [font-stretch:104%]">
        {entry.title}
      </h4>
      <p className="mt-0.5 text-ink-2">{entry.org}</p>
      {entry.detail && (
        <p className="mt-3 max-w-(--measure) text-small text-ink-2">
          {entry.detail}
        </p>
      )}
      {entry.href && (
        <Link
          href={entry.href}
          className="mt-2 inline-flex min-h-tap items-center rounded-sm text-small font-semibold text-accent-ink underline decoration-accent-ink/35 underline-offset-4 hocus:decoration-accent-ink"
        >
          Read the case study
        </Link>
      )}
    </li>
  );
}
