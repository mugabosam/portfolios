/**
 * Project categories and the list-view shape of a project. This module has
 * no dependencies on purpose: client components import it, and it must not
 * drag the Zod schema (and Zod itself) into the browser bundle.
 */

export const categories = [
  "backend",
  "ai-ml",
  "web",
  "mobile",
  "blockchain",
] as const;
export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  backend: "Backend",
  "ai-ml": "AI / ML",
  web: "Web",
  mobile: "Mobile",
  blockchain: "Blockchain",
};

/** The serializable subset of a project that list views and client components need. */
export type ProjectSummary = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  category: readonly Category[];
  stack: readonly string[];
  cover: string;
  featured: boolean;
  order: number;
  confidential: boolean;
};
