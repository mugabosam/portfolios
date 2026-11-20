import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

import { ContributionGraph } from "./contribution-graph";

/** A year of GitHub activity: four numbers that count up, then the graph. */
export function ActivitySection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  return (
    <section
      id="activity"
      aria-labelledby="activity-title"
      className="container-site py-24 md:py-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="max-w-2xl">
          <h2
            id="activity-title"
            data-split
            className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-[820] tracking-[-0.035em] [font-stretch:80%]"
          >
            Shipping in public
          </h2>
          <p className="mt-5 text-lead text-ink-2" data-fade>
            A year of contributions, straight from GitHub.
          </p>
        </div>
        {github && (
          <Button href={github.href} icon="github" data-fade>
            github.com/mugabosam
          </Button>
        )}
      </div>
      <ContributionGraph className="mt-12" />
    </section>
  );
}
