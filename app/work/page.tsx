import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { Tag } from "@/components/ui/tag";
import { WorkIndex } from "@/components/work/work-index";
import { experiments } from "@/content/experiments";
import { getProjects, toSummary } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from Sam Mugabo: backend systems, machine learning, mobile apps and smart contracts, each with the context, decisions and real results.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const projects = getProjects().map(toSummary);

  return (
    <>
      <PageHeader
        title="Selected work"
        intro="Six case studies, each written up the same way: the problem, my part in it, the decisions and trade-offs, and only the results that were actually measured."
      />

      <section
        aria-labelledby="case-studies-title"
        className="container-site pb-24"
      >
        <h2 id="case-studies-title" className="sr-only">
          Case studies
        </h2>
        <WorkIndex
          projects={projects.map((project) => ({
            slug: project.slug,
            category: project.category,
            card: <ProjectCard project={project} className="w-full" />,
          }))}
        />
      </section>

      <section
        aria-labelledby="experiments-title"
        className="border-t border-line bg-surface"
      >
        <div className="container-site py-20 md:py-24">
          <h2 id="experiments-title" className="type-h2">
            Experiments
          </h2>
          <p className="mt-4 max-w-(--measure) text-lead text-ink-2">
            Smaller things built to learn something. They link straight to the
            code.
          </p>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {experiments.map((experiment) => (
              <li
                key={experiment.repo}
                className="flex flex-col rounded-xl border border-line bg-paper p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-h3">{experiment.title}</h3>
                  <span className="text-small text-ink-3 tabular-nums">
                    {experiment.year}
                  </span>
                </div>
                <p className="mt-3 text-ink-2">{experiment.summary}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                  <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                    {experiment.stack.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                  <Button variant="link" icon="external" href={experiment.repo}>
                    Code on GitHub
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
