import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  education,
  experience,
  languages,
  skillGroups,
  training,
} from "@/content/profile";
import { site } from "@/content/site";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}: backend developer (Python and TypeScript) in Kigali, Rwanda. Experience, projects, skills and education, with a PDF to download.`,
  alternates: { canonical: "/resume" },
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="resume-block grid gap-4 border-t border-line py-8 md:grid-cols-12"
    >
      <h2 className="type-label text-fg md:col-span-3">{title}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Entry({
  period,
  title,
  org,
  children,
}: {
  period?: string;
  title: string;
  org: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="resume-entry grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <p className="text-small text-fg-muted">{period}</p>
      <div>
        <h3 className="font-display text-h4">{title}</h3>
        <p className="text-fg-muted">{org}</p>
        {children && (
          <div className="mt-2 text-small text-fg-muted">{children}</div>
        )}
      </div>
    </article>
  );
}

/**
 * The public résumé. It deliberately leaves out the phone number and street
 * address; those belong in the version Sam sends directly. `pnpm resume:pdf`
 * prints this page to public/resume.pdf, so the two never drift apart.
 */
export default function ResumePage() {
  const projects = getProjects().filter((project) => !project.confidential);

  return (
    <article className="resume container-site pt-[calc(var(--header-h)+6rem)] pb-32">
      <header className="flex flex-wrap items-end justify-between gap-8 pb-12">
        <div>
          <p className="type-label text-fg-muted">Résumé</p>
          <h1 className="mt-4 font-display text-h2 tracking-display">
            {site.name}
          </h1>
          <p className="mt-3 text-lead text-fg-muted">{site.role}</p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-small text-fg-muted">
            <span>{site.location}</span>
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-line-strong underline-offset-4"
            >
              {site.email}
            </a>
            <a
              href="https://github.com/mugabosam"
              className="underline decoration-line-strong underline-offset-4"
            >
              github.com/mugabosam
            </a>
          </p>
        </div>
        <Button
          href="/resume.pdf"
          download
          icon="download"
          className="print:hidden"
        >
          Download PDF
        </Button>
      </header>

      <Block title="Profile">
        <p className="max-w-(--measure) text-fg-muted">
          Backend developer and Information Technology student at the University
          of Rwanda, interning at EUCL, where I set up and maintain the backend
          of an internal inventory and device management system. I build
          backends in Python (Django) and TypeScript (NestJS) with React
          frontends, train small machine-learning models, and write Flutter apps
          for local problems.
        </p>
      </Block>

      <Block title="Experience">
        {experience.map((entry) => (
          <Entry
            key={entry.title}
            period={entry.period}
            title={entry.title}
            org={entry.org}
          >
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>
                Set up the backend of DAMS, an internal inventory and device
                management system, and remain its most active contributor: a
                NestJS, Prisma and PostgreSQL REST API with JWT auth, CASL
                permissions and Swagger docs.
              </li>
              <li>
                Built spreadsheet imports that validate every row, let staff
                review devices before registering them, and retry safely without
                duplicates; added device custody reports and a readable audit
                trail.
              </li>
              <li>
                Hardened security across the API and frontend (token revocation,
                session handling, HSTS, dependency advisories) and maintained CI
                on GitHub Actions with Docker builds and Jest and Supertest
                suites.
              </li>
              <li>
                Built Next.js, React and TypeScript frontend features, including
                PDF receipts, Excel templates and plain-language errors, through
                pull requests and code review in a small team.
              </li>
            </ul>
          </Entry>
        ))}
      </Block>

      <Block title="Selected projects">
        <div className="flex flex-col divide-y divide-line">
          {projects.map((project) => (
            <Entry
              key={project.slug}
              period={String(project.year)}
              title={project.title}
              org={project.stack.join(", ")}
            >
              <p>{project.summary}</p>
              <p className="mt-1">
                <a
                  href={`/work/${project.slug}`}
                  className="underline decoration-line-strong underline-offset-4"
                >
                  Case study
                </a>
                {project.repo && (
                  <>
                    {" · "}
                    <a
                      href={project.repo}
                      className="underline decoration-line-strong underline-offset-4"
                    >
                      {project.repo.replace("https://", "")}
                    </a>
                  </>
                )}
              </p>
            </Entry>
          ))}
        </div>
      </Block>

      <Block title="Skills">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
          {skillGroups.map((group) => (
            <div key={group.name} className="contents">
              <dt className="text-small text-fg">{group.name}</dt>
              <dd className="text-small text-fg-muted">
                {group.skills.map((skill) => skill.name).join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="Education">
        {education.map((entry) => (
          <Entry
            key={entry.title}
            period={entry.period}
            title={entry.title}
            org={entry.org}
          />
        ))}
      </Block>

      <Block title="Training and certificates">
        {training.map((entry) => (
          <Entry
            key={entry.title}
            period={entry.period}
            title={entry.title}
            org={entry.org}
          />
        ))}
      </Block>

      <Block title="Languages">
        <p className="text-fg-muted">{languages.join(" · ")}</p>
      </Block>
    </article>
  );
}
