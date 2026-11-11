import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { site } from "@/content/site";
import { MdxContent } from "@/lib/content/mdx";
import {
  getAdjacentProjects,
  getProject,
  getProjects,
} from "@/lib/content/projects";
import { categoryLabels } from "@/lib/content/schema";
import { pad3 } from "@/lib/format";
import { JsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} · ${site.name}`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const total = getProjects().length;
  const { previous, next } = getAdjacentProjects(slug);
  const url = new URL(`/work/${slug}`, getSiteUrl()).toString();

  const structuredData: Record<string, unknown> = project.repo
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary,
        url,
        codeRepository: project.repo,
        programmingLanguage: project.stack,
        dateCreated: String(project.year),
        author: {
          "@type": "Person",
          name: site.name,
          url: getSiteUrl().toString(),
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url,
        dateCreated: String(project.year),
        author: {
          "@type": "Person",
          name: site.name,
          url: getSiteUrl().toString(),
        },
      };

  return (
    <article>
      <JsonLd data={structuredData} />

      <header className="container-site pt-[calc(var(--header-h)+6rem)]">
        <Eyebrow>
          Case study · {pad3(project.order)} / {pad3(total)} ·{" "}
          {project.category.map((c) => categoryLabels[c]).join(" / ")}
        </Eyebrow>
        <h1 className="mt-6 font-display text-h2 tracking-display">
          {project.title}
        </h1>
        <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
          {project.summary}
        </p>

        <dl className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="type-label text-fg-muted">Role</dt>
            <dd className="mt-2">{project.role}</dd>
          </div>
          <div>
            <dt className="type-label text-fg-muted">Year</dt>
            <dd className="mt-2">{project.year}</dd>
          </div>
          <div>
            <dt className="type-label text-fg-muted">Stack</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="type-label text-fg-muted">Links</dt>
            <dd className="mt-1 flex flex-col items-start">
              {project.repo && (
                <Button variant="link" icon="external" href={project.repo}>
                  Code on GitHub
                </Button>
              )}
              {project.live && (
                <Button variant="link" icon="external" href={project.live}>
                  Live site
                </Button>
              )}
              {!project.repo && !project.live && (
                <span className="mt-1 text-fg-muted">
                  {project.confidential
                    ? "Internal software, not public"
                    : "No public links"}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </header>

      <div className="container-site mt-16">
        <Image
          src={project.cover}
          alt=""
          width={1600}
          height={1000}
          priority
          unoptimized
          className="h-auto w-full border border-line"
        />
      </div>

      <div className="case-body container-site pb-24">
        <div className="max-w-4xl">
          <MdxContent source={project.body} />
        </div>
      </div>

      <nav aria-label="More case studies" className="border-t border-line">
        <div className="container-site grid md:grid-cols-2">
          {[
            { label: "Previous", project: previous, align: "start" },
            { label: "Next", project: next, align: "end" },
          ].map(({ label, project: target, align }) => (
            <Link
              key={label}
              href={`/work/${target.slug}`}
              className={`group flex flex-col gap-3 py-16 ${align === "end" ? "md:items-end md:border-l md:border-line md:pl-12 md:text-right" : "md:pr-12"}`}
            >
              <span className="type-label text-fg-muted">
                {label} case study
              </span>
              <span
                className={`inline-flex items-center gap-4 font-display text-h2 tracking-display transition-transform duration-(--dur-ui) ease-out ${align === "end" ? "group-hocus:translate-x-2" : "group-hocus:-translate-x-2"}`}
              >
                {align === "start" && (
                  <ArrowRightIcon className="size-6 shrink-0 rotate-180" />
                )}
                {target.title}
                {align === "end" && (
                  <ArrowRightIcon className="size-6 shrink-0" />
                )}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </article>
  );
}
