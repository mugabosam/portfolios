import Link from "next/link";

import { peeks } from "@/content/showcase";
import { categoryLabels, type ProjectSummary } from "@/lib/content/categories";
import { cn } from "@/lib/cn";

import type { ForcedState } from "./button";
import { CodePeek } from "./code-peek";
import { Tag } from "./tag";

/**
 * One project: a peek at its code, then the title, summary and stack. The
 * whole card is clickable through a stretched link, and the focus ring
 * outlines the full card.
 */
export function ProjectCard({
  project,
  headingLevel: Heading = "h3",
  className,
  forceState,
}: {
  project: ProjectSummary;
  headingLevel?: "h2" | "h3";
  className?: string;
  forceState?: ForcedState;
}) {
  const peek = peeks[project.slug];
  const forcedFocus = forceState === "focus";
  return (
    <article
      data-force={forceState === "hover" ? "hover" : undefined}
      className={cn(
        "card-lift relative flex min-w-0 flex-col rounded-xl border border-line bg-surface",
        className,
      )}
    >
      {peek && (
        <CodePeek
          peek={peek}
          className="m-2 mb-0"
          bodyClassName="h-44 overflow-hidden"
        />
      )}
      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <Heading className="type-h3">
            <Link
              href={`/work/${project.slug}`}
              className={cn(
                "outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus",
                forcedFocus &&
                  "after:outline-2 after:outline-offset-2 after:outline-focus",
              )}
            >
              {project.title}
            </Link>
          </Heading>
          <span className="text-small text-ink-3 tabular-nums">
            {project.year}
          </span>
        </div>
        <p className="mt-1 text-small font-medium text-sky">
          {project.category.map((c) => categoryLabels[c]).join(", ")}
        </p>
        <p className="mt-3 text-ink-2">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Stack">
          {project.stack.slice(0, 5).map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
