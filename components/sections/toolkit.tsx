import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups } from "@/content/profile";

import { ContributionGraph } from "./contribution-graph";
import { GitHubStrip } from "./github-strip";

/**
 * Grouped skills, each linked to the projects that use it, then live
 * GitHub activity and repositories. No percentage bars.
 */
export function ToolkitSection({ titles }: { titles: Record<string, string> }) {
  return (
    <section
      id="toolkit"
      aria-labelledby="toolkit-title"
      className="border-t border-line bg-surface"
    >
      <div className="container-site py-24 md:py-32">
        <SectionHeading
          id="toolkit-title"
          title="Stack, and where it’s used"
          intro="Every tool links to the projects where I used it. My GitHub activity is below, straight from GitHub."
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.name}>
              <h3 className="border-b border-line pb-3 text-small font-semibold">
                {group.name}
              </h3>
              <ul>
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line/70 py-2.5"
                  >
                    <span className="font-medium">{skill.name}</span>
                    {skill.usedIn && (
                      <span className="flex flex-wrap gap-x-3 text-small">
                        {skill.usedIn.map((slug) => (
                          <Link
                            key={slug}
                            href={`/work/${slug}`}
                            className="inline-flex min-h-6 items-center rounded-sm text-sky underline decoration-sky/30 underline-offset-4 transition-colors duration-(--dur-ui) hocus:decoration-sky"
                          >
                            {titles[slug] ?? slug}
                          </Link>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ContributionGraph />
        <GitHubStrip />
      </div>
    </section>
  );
}
