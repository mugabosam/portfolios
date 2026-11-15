import { getProject, getProjects } from "@/lib/content/projects";
import { categoryLabels } from "@/lib/content/categories";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  return [
    {
      id: "card",
      alt: project ? `${project.title}: ${project.summary}` : "Case study",
      ...ogSize,
      contentType,
    },
  ];
}

/**
 * One card per case study. The italic line is the project's first category,
 * so the card reads "MALARIACHECK / ai / ml" in the site's own voice.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Case study";
  const category = project
    ? categoryLabels[project.category[0]!].toLowerCase()
    : "work";
  return ogImage({
    eyebrow: "Case study",
    roman: title,
    italic: category,
    footer: `${project?.year ?? ""} · ${project?.stack.slice(0, 3).join(" · ") ?? ""}`,
  });
}
