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
  role: "Software developer",
  /** Used for the default <title> and search snippets. */
  title: "Sam Mugabo: Python Backend & ML Developer",
  description:
    "Sam Mugabo builds Python backends and machine-learning systems in Kigali, Rwanda, engineered with patience and finished with care.",
  location: "Kigali, Rwanda",
  email: "popesir112@gmail.com",
  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  /** LinkedIn is added once Sam confirms the profile URL (CONTENT_TODO.md). */
  socials: [
    { label: "GitHub", href: "https://github.com/mugabosam" },
  ] satisfies SocialLink[],
} as const;
