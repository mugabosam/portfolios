import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { PrinciplesSection } from "@/components/sections/principles";
import { ToolkitSection } from "@/components/sections/toolkit";
import { WorkSection } from "@/components/sections/work";
import { site } from "@/content/site";
import { getProjects, toSummary } from "@/lib/content/projects";
import { JsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

/**
 * The home page: who Sam is, the work, how he works, experience, stack and
 * GitHub activity, then how to reach him. Everything is static,
 * server-rendered HTML; the few client pieces (API card tabs, copy button,
 * graph sweep) only add to it.
 */
export default function HomePage() {
  const projects = getProjects();
  const titles = Object.fromEntries(
    projects.map((project) => [project.slug, project.title]),
  );

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Backend Developer",
    url: getSiteUrl().toString(),
    email: `mailto:${site.email}`,
    sameAs: site.socials.map((social) => social.href),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    knowsAbout: [
      "Python",
      "TypeScript",
      "Django",
      "NestJS",
      "PostgreSQL",
      "Machine learning",
      "Flutter",
    ],
  };

  return (
    <>
      <JsonLd data={person} />
      <HeroSection />
      <WorkSection projects={projects.map(toSummary)} />
      <PrinciplesSection />
      <ExperienceSection />
      <ToolkitSection titles={titles} />
      <ContactSection />
    </>
  );
}
