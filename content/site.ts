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
  role: "Software developer (frontend and backend)",
  /** Used for the default <title> and search snippets. */
  title: "Sam Mugabo: Software Developer",
  /** ≤ 155 characters. */
  description:
    "Software developer in Kigali, Rwanda. I build products end to end: React and Flutter interfaces, NestJS and Django APIs, and the data underneath.",
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
