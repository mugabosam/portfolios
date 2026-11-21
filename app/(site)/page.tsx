import { HomeMotion } from "@/components/motion/home-motion";
import { Intro } from "@/components/motion/intro";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { site } from "@/content/site";
import { JsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

/**
 * The whole portfolio on one page: the hero (with the assistant), selected
 * work, about, experience and contact. The header links scroll to these
 * sections and follow the one in view. Everything is static,
 * server-rendered HTML; the intro and the hero's scroll scene are CSS, and
 * HomeMotion adds the GSAP layer after the first paint.
 */
export default function HomePage() {
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

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: getSiteUrl().toString(),
  };

  return (
    <>
      <JsonLd data={person} />
      <JsonLd data={website} />
      <Intro />
      <HomeMotion />
      <HeroSection />
      <WorkSection />
      <AboutSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
