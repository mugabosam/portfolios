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
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}: software developer in Kigali, Rwanda, working across frontend and backend. Experience, projects, skills and education, with a PDF to download.`,
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
      <h2 className="text-small font-semibold text-accent-ink md:col-span-3">
        {title}
      </h2>
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
      <p className="text-small text-ink-3 tabular-nums">{period}</p>
      <div>
        <h3 className="text-h4 font-semibold [font-stretch:104%]">{title}</h3>
        <p className="text-ink-2">{org}</p>
        {children && (
          <div className="mt-2 text-small text-ink-2">{children}</div>
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
  return (
    <article className="resume container-site pt-[calc(var(--header-h)+3.5rem)] pb-24 md:pt-[calc(var(--header-h)+5rem)]">
      <header className="flex flex-wrap items-end justify-between gap-8 pb-12">
        <div>
          <p className="text-small font-semibold text-accent-ink">Résumé</p>
          <h1 className="mt-3 type-h1">{site.name}</h1>
          <p className="mt-3 text-lead text-ink-2">{site.role}</p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-small text-ink-2">
            <span>{site.location}</span>
            <a
              href={`mailto:${site.email}`}
              className="text-accent-ink underline decoration-accent-ink/35 underline-offset-4"
            >
              {site.email}
            </a>
            <a
              href="https://mugabosam.me"
              className="text-accent-ink underline decoration-accent-ink/35 underline-offset-4"
            >
              mugabosam.me
            </a>
            <a
              href="https://github.com/mugabosam"
              className="text-accent-ink underline decoration-accent-ink/35 underline-offset-4"
            >
              github.com/mugabosam
            </a>
          </p>
        </div>
        <Button
          variant="primary"
          href="/resume.pdf"
          download
          icon="download"
          className="print:hidden"
        >
          Download PDF
        </Button>
      </header>

      <Block title="Profile">
        <p className="max-w-(--measure) text-ink-2">
          Software developer working across the stack, and Information
          Technology student at the University of Rwanda. At EUCL I set up the
          backend of an internal inventory and device management system and
          build features across its NestJS API and Next.js frontend. I build
          interfaces in React and Flutter, APIs in TypeScript (NestJS) and
          Python (Django), and small machine-learning models.
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
              org={project.tools.join(", ")}
            >
              <p>{project.summary}</p>
              {project.repo && (
                <p className="mt-1">
                  <a
                    href={project.repo}
                    className="text-accent-ink underline decoration-accent-ink/35 underline-offset-4"
                  >
                    {project.repo.replace("https://", "")}
                  </a>
                </p>
              )}
            </Entry>
          ))}
        </div>
      </Block>

      <Block title="Skills">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
          {skillGroups.map((group) => (
            <div key={group.name} className="contents">
              <dt className="text-small font-semibold">{group.name}</dt>
              <dd className="text-small text-ink-2">
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
        <p className="text-ink-2">{languages.join(", ")}</p>
      </Block>
    </article>
  );
}
