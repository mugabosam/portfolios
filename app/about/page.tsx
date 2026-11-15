import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import {
  education,
  experience,
  languages,
  skillGroups,
  training,
  values,
} from "@/content/profile";
import { site } from "@/content/site";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a backend developer in Kigali working in Python and TypeScript, with machine-learning and Flutter projects on the side. Background, skills and values.`,
  alternates: { canonical: "/about" },
};

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="font-display text-h3">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  const titles = Object.fromEntries(
    getProjects().map((project) => [project.slug, project.title]),
  );

  return (
    <>
      <PageHeader
        eyebrow="About"
        roman="Patient"
        italic="by design"
        intro="I am a backend developer and Information Technology student in Kigali. I build APIs in Python and TypeScript, train small machine-learning models, and write Flutter apps for problems I see around me."
      />

      <section
        aria-labelledby="about-story"
        className="container-site grid-site gap-y-8 pb-32"
      >
        <div className="col-span-12 md:col-span-4">
          <SectionTitle id="about-story">The short version</SectionTitle>
        </div>
        <div className="col-span-12 flex flex-col gap-6 text-fg-muted md:col-span-7 md:col-start-6">
          <p>
            I started on the security side: Cisco networking courses, a
            cybersecurity hackathon, and an interest in how systems fail. That
            habit of asking what breaks first is still how I approach a backend.
          </p>
          <p>
            Since September 2026 I have been a software development intern at
            EUCL, Rwanda’s electricity utility, where I set up the backend of an
            internal inventory and device management system and now work across
            its API and its Next.js frontend. Before that, my own projects
            taught me the rest: a malaria screener that puts safety rules above
            its model, a mobile-money app that never touches money, and an
            offline messenger with end-to-end encryption.
          </p>
          <p>
            I am finishing a Bachelor’s degree in Information Technology at the
            University of Rwanda, expected in 2027, and I am looking for
            internships and junior backend roles, in Kigali or remote.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
            <Button href="/work" icon="arrow">
              See the work
            </Button>
            <Button variant="link" href="/resume">
              Résumé
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-values"
        className="container-site grid-site gap-y-8 pb-32"
      >
        <div className="col-span-12 md:col-span-4">
          <SectionTitle id="about-values">How I work</SectionTitle>
        </div>
        <dl className="col-span-12 grid gap-px border border-line bg-line sm:grid-cols-3 md:col-span-7 md:col-start-6">
          {values.map((value) => (
            <div key={value.title} className="bg-bg p-6">
              <dt className="font-display text-h4">{value.title}</dt>
              <dd className="mt-3 text-small text-fg-muted">{value.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="about-skills"
        className="container-site grid-site gap-y-8 pb-32"
      >
        <div className="col-span-12 md:col-span-4">
          <SectionTitle id="about-skills">Skills</SectionTitle>
          <p className="mt-4 max-w-sm text-small text-fg-muted">
            Grouped, with the projects where each one was used. No percentages:
            a skill is shown by work, not a bar.
          </p>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {skillGroups.map((group) => (
            <div key={group.name} className="border-t border-line py-6">
              <h3 className="type-label text-fg">{group.name}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                  >
                    <span>{skill.name}</span>
                    {skill.usedIn && (
                      <span className="text-small text-fg-muted">
                        {skill.usedIn.map((slug, index) => (
                          <Fragment key={slug}>
                            {index > 0 && ", "}
                            <Link
                              href={`/work/${slug}`}
                              className="underline decoration-line-strong underline-offset-4 transition-colors duration-(--dur-ui) hocus:text-fg hocus:decoration-fg"
                            >
                              {titles[slug] ?? slug}
                            </Link>
                          </Fragment>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="about-path"
        className="container-site grid-site gap-y-8 pb-32"
      >
        <div className="col-span-12 md:col-span-4">
          <SectionTitle id="about-path">Path</SectionTitle>
        </div>
        <div className="col-span-12 flex flex-col gap-16 md:col-span-7 md:col-start-6">
          {[
            { label: "Work", entries: experience },
            { label: "Education", entries: education },
            { label: "Training and certificates", entries: training },
          ].map((group) => (
            <div key={group.label}>
              <Eyebrow className="mb-8">{group.label}</Eyebrow>
              <Timeline>
                {group.entries.map((entry) => (
                  <TimelineItem
                    key={entry.title}
                    period={entry.period}
                    title={entry.title}
                    org={entry.org}
                    filled
                  >
                    {entry.detail && <p>{entry.detail}</p>}
                    {entry.href && (
                      <Button
                        variant="link"
                        href={entry.href}
                        icon="arrow"
                        className="mt-2"
                      >
                        Read the case study
                      </Button>
                    )}
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          ))}
          <div>
            <Eyebrow className="mb-4">Languages</Eyebrow>
            <p className="text-fg-muted">{languages.join(" · ")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
