import { HomeMotion } from "@/components/motion/home-motion";
import { ContactSection } from "@/components/sections/contact";
import { CraftSection } from "@/components/sections/craft";
import { ExperienceSection } from "@/components/sections/experience";
import { FeaturedSection } from "@/components/sections/featured";
import { HeroSection } from "@/components/sections/hero";
import { PhilosophySection } from "@/components/sections/philosophy";
import { ToolkitSection } from "@/components/sections/toolkit";
import { WorkSection } from "@/components/sections/work";
import { ArtifactLayer } from "@/components/three/artifact-layer";
import { site } from "@/content/site";
import {
  getFeaturedProject,
  getProjects,
  toSummary,
} from "@/lib/content/projects";
import { JsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

/**
 * The home page: eight sections (brief §5.1–5.8). Every section is static,
 * server-rendered HTML; motion (HomeMotion) and the 3D Artifact
 * (ArtifactLayer) are progressive enhancements loaded after first paint.
 */
export default function HomePage() {
  const projects = getProjects();
  const featured = getFeaturedProject();
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
      <ArtifactLayer />
      <HomeMotion />
      <div className="relative z-10">
        <HeroSection />
        <CraftSection />
        <FeaturedSection slug={featured.slug} />
        <PhilosophySection />
        <WorkSection projects={projects.map(toSummary)} />
        <ExperienceSection />
        <ToolkitSection titles={titles} />
        <ContactSection />
      </div>
    </>
  );
}
