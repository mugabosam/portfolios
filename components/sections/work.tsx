import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CodePeek } from "@/components/ui/code-peek";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { metrics, peeks } from "@/content/showcase";
import { categoryLabels, type ProjectSummary } from "@/lib/content/categories";

/** How many projects the home page shows; the rest live on /work. */
const SHOWN = 4;

function DeckCard({
  project,
  index,
  total,
}: {
  project: ProjectSummary;
  index: number;
  total: number;
}) {
  const peek = peeks[project.slug];
  const numbers = metrics[project.slug] ?? [];
  return (
    <article
      data-spotlight
      className="deck-card group/card relative grid grid-cols-1 overflow-hidden rounded-[1.75rem] bg-surface text-ink lg:grid-cols-12"
    >
      <div className="relative z-10 flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
          <span className="font-semibold text-sky">
            {project.category.map((c) => categoryLabels[c]).join(", ")}
          </span>
          <span className="text-ink-3 tabular-nums">{project.year}</span>
          <span className="ml-auto text-ink-3 tabular-nums" aria-hidden="true">
            {index + 1}/{total}
          </span>
        </p>
        <h3 className="mt-5 text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[0.95] font-[820] tracking-[-0.03em] [font-stretch:82%]">
          <Link
            href={`/work/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-20 after:rounded-[1.75rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 text-ink-2 lg:text-lead">{project.summary}</p>

        {numbers.length > 0 && (
          <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-5">
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

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
            {project.stack.slice(0, 4).map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="group-hocus/card:rotate-45 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sun text-ink transition-transform duration-(--dur-move) ease-(--ease-out)"
          >
            <ArrowUpRightIcon className="size-5" />
          </span>
        </div>
      </div>
      {peek && (
        <div className="relative z-10 min-w-0 p-2 pt-0 lg:col-span-7 lg:py-2 lg:pr-2 lg:pl-0">
          <CodePeek
            peek={peek}
            className="h-full rounded-[1.25rem]"
            bodyClassName="max-h-60 overflow-hidden lg:max-h-none"
          />
        </div>
      )}
      <div aria-hidden="true" className="deck-shade" data-deck-shade />
    </article>
  );
}

/**
 * Selected work on navy, continuing the hero's night sky. On large screens
 * the cards pin one over another as the page scrolls (GSAP, see
 * home-motion.tsx); everywhere else, and without JavaScript, they are a
 * plain list.
 */
export function WorkSection({ projects }: { projects: ProjectSummary[] }) {
  const featured = projects.filter((project) => project.featured);
  const shown = [
    ...featured,
    ...projects.filter((project) => !project.featured),
  ].slice(0, SHOWN);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative scroll-mt-0 bg-ink pt-24 pb-24 text-white [--focus:var(--code-key)] md:pt-32 md:pb-32"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <div className="max-w-3xl">
            <h2
              id="work-title"
              data-split
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-[820] tracking-[-0.035em] [font-stretch:80%]"
            >
              Selected work
            </h2>
            <p className="mt-6 max-w-xl text-lead text-code-fg" data-fade>
              Interfaces, APIs and models, each with real code and only the
              results that were measured.
            </p>
          </div>
          <Button variant="inverse" href="/work" icon="arrow" data-fade>
            All {projects.length} projects
          </Button>
        </div>

        <ul className="deck mt-14 flex flex-col gap-6 md:mt-20">
          {shown.map((project, index) => (
            <li key={project.slug}>
              <div data-deck-item>
                <DeckCard
                  project={project}
                  index={index}
                  total={shown.length}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
