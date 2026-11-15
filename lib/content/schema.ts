import { z } from "zod";

import { categories } from "./categories";

export {
  categories,
  categoryLabels,
  type Category,
  type ProjectSummary,
} from "./categories";

/**
 * Frontmatter for content/work/*.mdx (brief §5.9). Unknown keys are rejected
 * so a typo fails the build instead of silently doing nothing.
 */
export const projectSchema = z
  .object({
    title: z.string().min(1).max(40),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase words joined by hyphens"),
    summary: z.string().min(40).max(220),
    year: z.number().int().min(2015).max(2100),
    role: z.string().min(3).max(80),
    category: z.array(z.enum(categories)).min(1),
    stack: z.array(z.string().min(1)).min(1).max(8),
    repo: z.url().optional(),
    live: z.url().optional(),
    cover: z
      .string()
      .regex(
        /^\/work\/[a-z0-9-]+\/[\w.-]+\.(svg|png|jpe?g|webp|avif)$/,
        "a file under /public/work/<slug>/",
      ),
    featured: z.boolean(),
    order: z.number().int().min(1),
    /** Internal work: no repository, code or screenshots may be shown. */
    confidential: z.boolean().default(false),
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
