import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { site } from "@/content/site";
import { MdxContent } from "@/lib/content/mdx";
import {
  getAdjacentProjects,
  getProject,
  getProjects,
} from "@/lib/content/projects";
import { categoryLabels } from "@/lib/content/categories";
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

      <PageHeader
        crumbs={[{ label: "Work", href: "/work" }]}
        title={project.title}
        intro={project.summary}
        tight
      >
        <dl className="mt-10 grid gap-x-8 gap-y-6 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.6fr_1.6fr_1fr]">
          <div>
            <dt className="text-small text-ink-3">Role</dt>
            <dd className="mt-1 font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="text-small text-ink-3">Year</dt>
            <dd className="mt-1 font-medium tabular-nums">{project.year}</dd>
          </div>
          <div>
            <dt className="text-small text-ink-3">Stack</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-small text-ink-3">
              {project.category.map((c) => categoryLabels[c]).join(", ")}
            </dt>
            <dd className="mt-0.5 flex flex-col items-start">
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
                <span className="mt-1 text-ink-2">
                  {project.confidential
                    ? "Internal software, not public"
                    : "No public links"}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <div className="container-site mt-8">
        <Image
          src={project.cover}
          alt=""
          width={1600}
          height={460}
          loading="eager"
          fetchPriority="high"
          unoptimized
          className="h-auto w-full rounded-xl"
        />
      </div>

      <div className="case-body container-site pb-24">
        <div className="max-w-4xl">
          <MdxContent source={project.body} />
        </div>
      </div>

      <nav
        aria-label="More case studies"
        className="border-t border-line bg-surface"
      >
        <div className="container-site grid gap-4 py-10 md:grid-cols-2">
          {[
            { label: "Previous case study", project: previous, align: "start" },
            { label: "Next case study", project: next, align: "end" },
          ].map(({ label, project: target, align }) => (
            <Link
              key={label}
              href={`/work/${target.slug}`}
              className={`card-lift group flex items-center gap-4 rounded-xl border border-line bg-paper p-6 ${align === "end" ? "justify-end text-right" : ""}`}
            >
              {align === "start" && (
                <ArrowLeftIcon className="size-5 shrink-0 text-sky transition-transform duration-(--dur-ui) group-hocus:-translate-x-1" />
              )}
              <span className="flex flex-col gap-1">
                <span className="text-small text-ink-3">{label}</span>
                <span className="type-h3">{target.title}</span>
              </span>
              {align === "end" && (
                <ArrowRightIcon className="size-5 shrink-0 text-sky transition-transform duration-(--dur-ui) group-hocus:translate-x-1" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </article>
  );
}
