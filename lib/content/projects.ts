import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { type ParsedProject, parseProjectFile } from "./parse";

export type Project = ParsedProject;

const WORK_DIR = path.join(process.cwd(), "content", "work");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let cache: Project[] | null = null;

/** Every case study, validated and sorted by `order`. Throws on invalid content. */
export function getProjects(): Project[] {
  if (cache) return cache;

  const projects = readdirSync(WORK_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) =>
      parseProjectFile(file, readFileSync(path.join(WORK_DIR, file), "utf8")),
    );

  for (const project of projects) {
    if (!existsSync(path.join(PUBLIC_DIR, project.cover))) {
      throw new Error(
        `content/work/${project.slug}.mdx: cover ${project.cover} does not exist in /public`,
      );
    }
  }

  const orders = new Set(projects.map((p) => p.order));
  if (orders.size !== projects.length)
    throw new Error("content/work: two projects share the same `order`");
  if (!projects.some((p) => p.featured))
    throw new Error("content/work: one project must be `featured: true`");

  cache = projects.sort((a, b) => a.order - b.order);
  return cache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

/** The featured project shown on the home page's light card. */
export function getFeaturedProject(): Project {
  const featured = getProjects().find((project) => project.featured);
  if (!featured) throw new Error("content/work: no featured project");
  return featured;
}

/** Previous and next case studies, wrapping around the ends. */
export function getAdjacentProjects(slug: string): {
  previous: Project;
  next: Project;
} {
  const projects = getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) throw new Error(`Unknown project: ${slug}`);
  const at = (i: number) => projects[(i + projects.length) % projects.length]!;
  return { previous: at(index - 1), next: at(index + 1) };
}

export function toSummary(project: Project): import("./schema").ProjectSummary {
  const {
    slug,
    title,
    summary,
    year,
    category,
    stack,
    order,
    cover,
    role,
    confidential,
    featured,
  } = project;
  return {
    slug,
    title,
    summary,
    year,
    category,
    stack,
    order,
    cover,
    role,
    confidential,
    featured,
  };
}
