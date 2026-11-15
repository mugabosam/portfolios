import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/content/projects";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();
  const lastModified = new Date(process.env.BUILD_DATE ?? Date.now());

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: url("/work"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...getProjects().map((project) => ({
      url: url(`/work/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.9 : 0.8,
    })),
    {
      url: url("/about"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: url("/resume"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: url("/contact"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
