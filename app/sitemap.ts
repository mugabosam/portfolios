import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();
  const lastModified = new Date(process.env.BUILD_DATE ?? Date.now());

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: url("/resume"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
