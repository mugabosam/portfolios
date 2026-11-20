import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { education, experience, training } from "@/content/profile";

/** Work, education and training as one commit-graph timeline. */
export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="container-site grid-site gap-y-12 py-24 md:py-32"
    >
      <div className="col-span-12 md:col-span-4">
        <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)]">
          <h2 id="experience-title" className="type-h2">
            Experience
          </h2>
          <p className="mt-4 text-lead text-ink-2">
            Where I work and what I studied, most recent first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/resume.pdf" download icon="download">
              Download CV
            </Button>
            <Button variant="link" href="/resume">
              Read the résumé
            </Button>
          </div>
        </div>
      </div>
      <Timeline
        className="col-span-12 md:col-span-7 md:col-start-6"
        groups={[
          { label: "Work", entries: experience },
          { label: "Education", entries: education },
          { label: "Training and certificates", entries: training },
        ]}
      />
    </section>
  );
}
