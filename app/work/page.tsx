import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Tag } from "@/components/ui/tag";
import { WorkIndex } from "@/components/work/work-index";
import { experiments } from "@/content/experiments";
import { getProjects, toSummary } from "@/lib/content/projects";
import { pad3 } from "@/lib/format";

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
        eyebrow={`Index · ${pad3(projects.length)} case studies`}
        roman="Selected"
        italic="work"
        intro="Each project is written up the same way: the problem, my part in it, the decisions and trade-offs, and only the results that were actually measured."
      />

      <section
        aria-labelledby="case-studies-title"
        className="container-site pb-32"
      >
        <h2 id="case-studies-title" className="sr-only">
          Case studies
        </h2>
        <WorkIndex projects={projects} />
      </section>

      <section
        aria-labelledby="experiments-title"
        className="container-site pb-32"
      >
        <Eyebrow>Experiments</Eyebrow>
        <h2 id="experiments-title" className="mt-6 type-h2">
          Smaller things
        </h2>
        <ul className="mt-12 border-b border-line">
          {experiments.map((experiment) => (
            <li
              key={experiment.repo}
              className="grid-site gap-y-4 border-t border-line py-8"
            >
              <div className="col-span-12 md:col-span-8">
                <h3 className="font-display text-h3">{experiment.title}</h3>
                <p className="mt-3 max-w-(--measure) text-fg-muted">
                  {experiment.summary}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
                  {experiment.stack.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 flex flex-col gap-2 md:col-span-4 md:items-end">
                <p className="type-label text-fg-muted">{experiment.year}</p>
                <Button variant="link" icon="external" href={experiment.repo}>
                  Code on GitHub
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
