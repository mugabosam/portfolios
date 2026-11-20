import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CodePeek } from "@/components/ui/code-peek";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { metrics, peeks } from "@/content/showcase";
import { categoryLabels, type ProjectSummary } from "@/lib/content/categories";

function FeaturedProject({ project }: { project: ProjectSummary }) {
  const peek = peeks[project.slug];
  const numbers = metrics[project.slug] ?? [];
  return (
    <article className="card-lift relative grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-surface lg:grid-cols-12">
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="flex flex-wrap items-center gap-2 text-small">
          <span className="rounded-sm bg-sun px-2 py-0.5 font-semibold text-ink">
            Featured
          </span>
          <span className="font-medium text-sky">
            {project.category.map((c) => categoryLabels[c]).join(", ")}
          </span>
          <span className="text-ink-3 tabular-nums">{project.year}</span>
        </p>
        <h3 className="mt-5 type-h2">
          <Link
            href={`/work/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 text-lead text-ink-2">{project.summary}</p>

        {numbers.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {numbers.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-caption text-ink-3">{item.label}</dt>
                <dd className="order-first text-h3 font-bold [font-stretch:108%] tabular-nums">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-8" aria-label="Stack">
          {project.stack.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </div>
      {peek && (
        <div className="min-w-0 p-2 lg:col-span-7 lg:py-2 lg:pr-2 lg:pl-0">
          <CodePeek
            peek={peek}
            className="h-full"
            bodyClassName="max-h-[26rem] overflow-hidden"
          />
        </div>
      )}
    </article>
  );
}

/**
 * The featured case study, then four more as cards with a peek at their
 * code. The full list, with filters, lives on /work.
 */
export function WorkSection({ projects }: { projects: ProjectSummary[] }) {
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => !project.featured).slice(0, 4);
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="container-site scroll-mt-(--header-h) pt-16 pb-24 md:pt-20 md:pb-32"
    >
      <SectionHeading
        id="work-title"
        title="Selected work"
        intro="Real projects with real code. Each case study covers the problem, my part in it, the trade-offs and only the results that were measured."
        action={<Button href="/work">All {projects.length} projects</Button>}
      />

      <div className="mt-12 flex flex-col gap-5 md:mt-16">
        {featured && <FeaturedProject project={featured} />}
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {rest.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
