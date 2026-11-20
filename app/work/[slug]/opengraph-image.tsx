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

/** Cuts at a word boundary so long summaries fit the card. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:]$/, "")}…`;
}

/** One card per case study: title, summary, and the project as a response. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project)
    return ogImage({
      title: "Case study",
      subtitle: "Work by Sam Mugabo",
      request: "/work",
      lines: [],
    });
  return ogImage({
    title: project.title,
    subtitle: clip(project.summary, 120),
    request: `/work/${project.slug}`,
    lines: [
      { key: "year", value: String(project.year) },
      {
        key: "type",
        value: project.category.map((c) => categoryLabels[c]).join(", "),
      },
      { key: "stack", value: project.stack.slice(0, 2).join(", ") },
    ],
  });
}
