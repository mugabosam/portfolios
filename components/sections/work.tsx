import Image from "next/image";

import { ProjectSheet } from "@/components/sections/project-sheet";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { type Project, projects } from "@/content/projects";

function DeckCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <article
      id={`project-${project.slug}`}
      data-spotlight
      className="deck-card group/card relative grid grid-cols-1 overflow-hidden rounded-[1.75rem] bg-surface text-ink lg:grid-cols-12"
    >
      <div className="relative z-10 flex flex-col p-6 sm:p-8 lg:col-span-6 lg:p-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
          <span className="font-semibold text-accent-ink">{project.kind}</span>
          <span className="text-ink-3 tabular-nums">{project.year}</span>
          <span className="ml-auto text-ink-3 tabular-nums" aria-hidden="true">
            {index + 1}/{total}
          </span>
        </p>
        <h3 className="mt-5 text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[0.95] font-[820] tracking-[-0.03em] [font-stretch:82%]">
          {project.title}
        </h3>
        <p className="mt-4 max-w-xl text-ink-2 lg:text-lead">
          {project.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {project.tools.map((tool) => (
              <li key={tool}>
                <Tag>{tool}</Tag>
              </li>
            ))}
          </ul>
          <button
            type="button"
            data-open-project={project.slug}
            aria-label={`See the details: ${project.title}`}
            className="project-open inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-small font-semibold text-white outline-none after:absolute after:inset-0 after:z-20 after:rounded-[1.75rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            See the details
            <span
              aria-hidden="true"
              className="group-hocus/card:rotate-45 inline-flex size-9 items-center justify-center rounded-full bg-accent-ink text-white transition-transform duration-(--dur-move) ease-(--ease-out)"
            >
              <ArrowUpRightIcon className="size-4" />
            </span>
          </button>
        </div>
      </div>

      {/* The one result to remember, over the project's artwork. */}
      <div className="relative z-10 min-w-0 p-2 pt-0 lg:col-span-6 lg:py-2 lg:pr-2 lg:pl-0">
        <div className="relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-[1.25rem] bg-linear-to-br from-accent-ink to-accent-deep p-6 text-white sm:p-8">
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover opacity-45 mix-blend-luminosity"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-accent-deep via-accent-deep/50 to-transparent"
          />
          <p className="relative flex flex-col gap-2">
            <span className="text-[clamp(2.75rem,6vw,5rem)] leading-[0.9] font-[820] tracking-[-0.035em] whitespace-nowrap text-white [font-stretch:80%]">
              {project.highlight.value}
            </span>
            <span className="max-w-xs text-small text-white">
              {project.highlight.label}
            </span>
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="deck-shade" data-deck-shade />
    </article>
  );
}

/**
 * Selected work on warm white. Each card is a
 * short, plain summary with one result to remember; "See the details" opens
 * a sheet with the problem, what was built and the result. On large
 * screens the cards pin one over another as the page scrolls (GSAP, see
 * home-motion.tsx); everywhere else, and without JavaScript, they are a
 * plain list.
 */
export function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-tone="light"
      className="relative bg-paper pt-24 pb-24 text-ink md:pt-32 md:pb-32"
    >
      <div className="container-site">
        <div className="max-w-3xl">
          <h2
            id="work-title"
            data-split
            className="text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-[820] tracking-[-0.035em] [font-stretch:80%]"
          >
            Selected work
          </h2>
          <p className="mt-6 max-w-xl text-lead text-ink-2" data-fade>
            Six projects, from health tools to mobile money, each in a few plain
            words. Open any card for the story behind it.
          </p>
        </div>

        <ul className="deck mt-14 flex flex-col gap-6 md:mt-20">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <div data-deck-item>
                <DeckCard
                  project={project}
                  index={index}
                  total={projects.length}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ProjectSheet />
    </section>
  );
}
