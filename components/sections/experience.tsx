import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { education, experience, training } from "@/content/profile";

import { ContributionGraph } from "./contribution-graph";

/** Work, education and training, then a year of activity on GitHub. */
export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      data-tone="blue"
      className="bg-canvas pb-4 md:pb-6"
    >
      <div className="container-site">
        <div className="grid-site gap-y-12 rounded-[2rem] bg-surface px-6 py-16 sm:px-10 md:py-24 lg:px-16">
          <div className="col-span-12 md:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)]">
              <h2
                id="experience-title"
                data-split
                className="text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-[820] tracking-[-0.035em] [font-stretch:80%]"
              >
                Experience
              </h2>
              <p className="mt-6 max-w-sm text-lead text-ink-2" data-fade>
                Where I work, what I studied, and the training along the way.
              </p>
              <div className="mt-8 flex flex-wrap gap-3" data-fade>
                <Button
                  variant="primary"
                  href="/resume.pdf"
                  download
                  icon="download"
                >
                  Download CV
                </Button>
                <Button href="/resume">Read it online</Button>
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

          <div className="col-span-12 mt-8">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
              <h3
                data-split
                className="text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-[820] tracking-[-0.035em] [font-stretch:80%]"
              >
                Shipping in public
              </h3>
              <p className="max-w-md text-ink-2" data-fade>
                A year of contributions on GitHub: how often I build, not just
                what.
              </p>
            </div>
            <ContributionGraph className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
