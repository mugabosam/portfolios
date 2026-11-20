import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/ui/portrait";
import { Timeline } from "@/components/ui/timeline";
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
  description: `${site.name} is a software developer in Kigali who works across the stack: React and Flutter interfaces, NestJS and Django APIs, PostgreSQL and machine learning. Background, skills and values.`,
  alternates: { canonical: "/about" },
};

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="type-h2">
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
        title="About me"
        intro="I’m a software developer in Kigali. I build the whole product: interfaces in React and Flutter, APIs in NestJS and Django, and the data and machine-learning models underneath."
      />

      <div className="container-site grid-site gap-y-12 pb-24 md:pb-32">
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <figure className="mx-auto max-w-xs overflow-hidden rounded-xl border border-line bg-surface md:sticky md:top-[calc(var(--header-h)+2rem)] md:max-w-none">
            <Portrait
              variant="full"
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 80vw"
              className="w-full"
            />
            <figcaption className="border-t border-line px-4 py-3 text-small text-ink-2">
              {site.name}, {site.location}
            </figcaption>
          </figure>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <section aria-labelledby="about-story">
            <SectionTitle id="about-story">The short version</SectionTitle>
            <div className="mt-6 flex max-w-(--measure) flex-col gap-5 text-ink-2">
              <p>
                I started on the security side: Cisco networking courses, a
                cybersecurity hackathon, and an interest in how systems fail.
                That habit of asking what breaks first is still how I approach
                every layer of a system.
              </p>
              <p>
                Since September 2026 I have been a software development intern
                at EUCL, Rwanda’s electricity utility, where I set up the
                backend of an internal inventory and device management system
                and now work across its API and its Next.js frontend. Before
                that, my own projects taught me the rest: a malaria screener
                that puts safety rules above its model, a mobile-money app that
                never touches money, and an offline messenger with end-to-end
                encryption.
              </p>
              <p>
                I am finishing a Bachelor’s degree in Information Technology at
                the University of Rwanda, expected in 2027. I am open to
                software development roles, frontend, backend or full-stack, in
                Kigali or remote.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" href="/work">
                See the work
              </Button>
              <Button href="/resume">Read the résumé</Button>
            </div>
          </section>

          <section aria-labelledby="about-values" className="mt-20">
            <SectionTitle id="about-values">How I work</SectionTitle>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="border-t-2 border-sky pt-4">
                  <dt className="text-h4 font-semibold [font-stretch:104%]">
                    {value.title}
                  </dt>
                  <dd className="mt-2 text-small text-ink-2">{value.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="about-skills" className="mt-20">
            <SectionTitle id="about-skills">Skills</SectionTitle>
            <p className="mt-4 max-w-(--measure) text-ink-2">
              Grouped, with the projects where each one was used. No
              percentages: a skill is shown by work, not a bar.
            </p>
            <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="border-b border-line pb-3 text-small font-semibold">
                    {group.name}
                  </h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li
                        key={skill.name}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line/70 py-2.5"
                      >
                        <span className="font-medium">{skill.name}</span>
                        {skill.usedIn && (
                          <span className="flex flex-wrap gap-x-3 text-small">
                            {skill.usedIn.map((slug) => (
                              <Link
                                key={slug}
                                href={`/work/${slug}`}
                                className="inline-flex min-h-6 items-center rounded-sm text-sky underline decoration-sky/30 underline-offset-4 hocus:decoration-sky"
                              >
                                {titles[slug] ?? slug}
                              </Link>
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

          <section aria-labelledby="about-path" className="mt-20">
            <SectionTitle id="about-path">Path</SectionTitle>
            <Timeline
              className="mt-8"
              groups={[
                { label: "Work", entries: experience },
                { label: "Education", entries: education },
                { label: "Training and certificates", entries: training },
              ]}
            />
            <h3 className="mt-14 text-small font-semibold">Languages</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => (
                <li
                  key={language}
                  className="rounded-sm border border-line bg-surface px-2.5 py-1 text-small text-ink-2"
                >
                  {language}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
