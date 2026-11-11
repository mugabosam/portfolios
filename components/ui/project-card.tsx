import Link from "next/link";

import { cn } from "@/lib/cn";
import { pad3 } from "@/lib/format";

import type { ForcedState } from "./button";
import { ArrowRightIcon } from "./icons";
import { Tag } from "./tag";

export type ProjectCardProps = {
  index: number;
  title: string;
  href: string;
  summary: string;
  year: string;
  category: readonly string[];
  stack: readonly string[];
  headingLevel?: "h2" | "h3";
  className?: string;
  forceState?: ForcedState;
};

/**
 * One row of the project index: counter, large serif title, summary, year,
 * category and stack. The whole row is clickable through a stretched link,
 * and the focus ring outlines the full row.
 */
export function ProjectCard({
  index,
  title,
  href,
  summary,
  year,
  category,
  stack,
  headingLevel: Heading = "h3",
  className,
  forceState,
}: ProjectCardProps) {
  const forcedFocus = forceState === "focus";
  return (
    <article
      data-force={forceState === "hover" ? "hover" : undefined}
      className={cn(
        "group relative grid-site gap-y-4 border-t border-line py-8",
        className,
      )}
    >
      <p
        className="col-span-2 type-label text-fg-muted tabular-nums md:col-span-1"
        aria-hidden="true"
      >
        {pad3(index)}
      </p>

      <div className="col-span-10 md:col-span-7">
        <Heading className="font-display text-h3">
          <Link
            href={href}
            className={cn(
              "inline-block transition-transform duration-(--dur-ui) ease-out outline-none group-hocus:translate-x-2",
              "after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus",
              forcedFocus &&
                "after:outline-2 after:outline-offset-4 after:outline-focus",
            )}
          >
            {title}
            <ArrowRightIcon className="ml-4 inline-block size-5 -translate-x-2 align-middle opacity-0 transition-[translate,opacity] duration-(--dur-ui) ease-out group-hocus:translate-x-0 group-hocus:opacity-100" />
          </Link>
        </Heading>
        <p className="mt-3 max-w-(--measure) text-fg-muted">{summary}</p>
      </div>

      <div className="col-span-12 flex flex-col gap-4 md:col-span-4 md:items-end">
        <p className="type-label text-fg-muted">
          {year} · {category.join(" / ")}
        </p>
        <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Stack">
          {stack.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
