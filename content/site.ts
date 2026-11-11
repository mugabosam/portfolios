/**
 * Global copy and links. Edit this file to change what appears in the
 * navigation, footer and metadata; no component changes needed.
 *
 * Anything still missing is listed in CONTENT_TODO.md.
 */

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string };

export const site = {
  name: "Sam Mugabo",
  monogram: "SM.",
  role: "Backend developer (Python & TypeScript)",
  /** Used for the default <title> and search snippets. */
  title: "Sam Mugabo: Backend Developer (Python & TypeScript)",
  /** ≤ 155 characters. */
  description:
    "Backend developer in Kigali, Rwanda, building Python and TypeScript APIs, the frontends on top of them, and machine-learning models that last.",
  location: "Kigali, Rwanda",
  email: "popesir112@gmail.com",
  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  /** Sam has no LinkedIn yet; add it here if that changes. */
  socials: [
    { label: "GitHub", href: "https://github.com/mugabosam" },
  ] satisfies SocialLink[],
} as const;
