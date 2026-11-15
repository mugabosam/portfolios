"use client";

import { useSyncExternalStore } from "react";

import { ProjectCard } from "@/components/ui/project-card";
import {
  type Category,
  categories,
  categoryLabels,
  type ProjectSummary,
} from "@/lib/content/categories";
import { cn } from "@/lib/cn";

type Filter = Category | "all";

const FILTER_EVENT = "work-filter-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

function isCategory(value: string | null): value is Category {
  return value !== null && (categories as readonly string[]).includes(value);
}

/** The active filter lives in the URL (?category=backend) so it can be shared. */
function useActiveFilter(): Filter {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const value = new URLSearchParams(search).get("category");
  return isCategory(value) ? value : "all";
}

function setFilter(filter: Filter) {
  const url = new URL(window.location.href);
  if (filter === "all") url.searchParams.delete("category");
  else url.searchParams.set("category", filter);
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(FILTER_EVENT));
}

const noopSubscribe = () => () => {};

/**
 * Project list with category filters. Without JavaScript every project is
 * listed and the filter buttons stay invisible (but keep their space, so the
 * list never shifts), so nothing on screen is dead.
 */
export function WorkIndex({ projects }: { projects: ProjectSummary[] }) {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const active = useActiveFilter();
  const available = categories.filter((category) =>
    projects.some((p) => p.category.includes(category)),
  );
  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.category.includes(active));
  const filters: Filter[] = ["all", ...available];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        aria-hidden={!hydrated}
        className={cn("mb-12 flex flex-wrap gap-2", !hydrated && "invisible")}
      >
        {filters.map((filter) => {
          const count =
            filter === "all"
              ? projects.length
              : projects.filter((p) => p.category.includes(filter)).length;
          const pressed = active === filter;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(filter)}
              className={cn(
                "inline-flex min-h-tap items-center gap-3 border px-4 type-label transition-colors duration-(--dur-ui) ease-out",
                pressed
                  ? "border-fg bg-fg text-bg"
                  : "border-line-strong text-fg hocus:border-fg",
              )}
            >
              {filter === "all" ? "All" : categoryLabels[filter]}
              <span
                className={cn(
                  "tabular-nums",
                  pressed ? "text-bg" : "text-fg-muted",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {hydrated
          ? `Showing ${visible.length} of ${projects.length} projects`
          : ""}
      </p>

      <ol className="border-b border-line">
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard
              index={project.order}
              title={project.title}
              href={`/work/${project.slug}`}
              summary={project.summary}
              year={String(project.year)}
              category={project.category.map((c) => categoryLabels[c])}
              stack={project.stack}
              headingLevel="h3"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
