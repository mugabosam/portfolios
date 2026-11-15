import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Portrait } from "@/components/ui/portrait";
import { SectionCounter } from "@/components/ui/section-counter";

/** 001 / 008: name, role, thesis and Sam's portrait (brief §5.1, portrait by Sam's request). */
export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-section="hero"
      className="relative min-h-svh overflow-hidden"
    >
      <div className="container-site grid-site min-h-svh content-center gap-y-10 pt-(--header-h) pb-32">
        <div
          className="col-span-12 flex justify-center md:col-span-5 md:col-start-8 md:row-start-1 md:justify-end"
          data-hero-portrait
        >
          <Portrait
            preload
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 34vw, 60vw"
            className="w-[60vw] max-w-xs md:w-full md:max-w-[min(100%,calc((100svh-var(--header-h)-9rem)*0.749))]"
          />
        </div>
        <div
          className="relative col-span-12 md:col-span-7 md:col-start-1 md:row-start-1"
          data-hero-copy
        >
          <Eyebrow>Portfolio · Vol. 01</Eyebrow>
          <DisplayHeading
            as="h1"
            id="hero-title"
            size="display"
            roman="Built"
            italic="to last"
            className="mt-6"
          />
          <p className="mt-8 max-w-xl text-lead text-fg-muted">
            Sam Mugabo: backend developer in Python and TypeScript, building
            APIs, interfaces and machine-learning models that keep working long
            after launch.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="#work" icon="arrow">
              View selected work
            </Button>
            <Button variant="link" href="/contact">
              Get in touch
            </Button>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-(--gutter) hidden items-center gap-4 sm:flex"
        aria-hidden="true"
      >
        <span className="scroll-cue" />
        <span className="type-label text-fg-muted">Scroll to explore</span>
      </div>
      <SectionCounter
        index={1}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
