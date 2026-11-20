import { HomeMotion } from "@/components/motion/home-motion";
import { Intro } from "@/components/motion/intro";
import { ActivitySection } from "@/components/sections/activity";
import { ContactSection } from "@/components/sections/contact";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { site } from "@/content/site";
import { getProjects, toSummary } from "@/lib/content/projects";
import { JsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

/**
 * The home page, kept to four scenes: the hero, selected work, a year on
 * GitHub, and contact. Everything is static, server-rendered HTML. The intro
 * and the hero's scroll scene are CSS; HomeMotion adds the GSAP layer
 * (stacked work cards, line reveals, counters, magnetic buttons) after the
 * first paint, and nothing in it is needed to read the page.
 */
export default function HomePage() {
  const projects = getProjects();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Software Developer",
    url: getSiteUrl().toString(),
    email: `mailto:${site.email}`,
    sameAs: site.socials.map((social) => social.href),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    knowsAbout: [
      "TypeScript",
      "Python",
      "React",
      "Next.js",
      "NestJS",
      "Django",
      "PostgreSQL",
      "Flutter",
      "Machine learning",
    ],
  };

  return (
    <>
      <JsonLd data={person} />
      <Intro />
      <HomeMotion />
      <HeroSection />
      <WorkSection projects={projects.map(toSummary)} />
      <ActivitySection />
      <ContactSection />
    </>
  );
}
