import Link from "next/link";
import { Fragment } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionCounter } from "@/components/ui/section-counter";
import { skillGroups } from "@/content/profile";

import { ContributionGraph } from "./contribution-graph";
import { GitHubStrip } from "./github-strip";

/**
 * 007 / 008: grouped skills, each linked to the projects that use it, plus
 * live GitHub stats (brief §5.7). No percentage bars.
 */
export function ToolkitSection({ titles }: { titles: Record<string, string> }) {
  return (
    <section
      id="toolkit"
      aria-labelledby="toolkit-title"
      data-section="toolkit"
      className="relative"
    >
      <div className="container-site py-32">
        <Eyebrow>Toolkit &amp; proof</Eyebrow>
        <DisplayHeading
          reveal
          id="toolkit-title"
          roman="The toolkit"
          italic="and where it was used"
          className="mt-6"
        />
        <div className="mt-16 grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.name} className="border-r border-b border-line p-8">
              <h3 className="type-label text-fg">{group.name}</h3>
              <ul className="mt-6">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line py-3"
                  >
                    <span>{skill.name}</span>
                    {skill.usedIn && (
                      <span className="text-small text-fg-muted">
                        {skill.usedIn.map((slug, index) => (
                          <Fragment key={slug}>
                            {index > 0 && ", "}
                            <Link
                              href={`/work/${slug}`}
                              className="underline decoration-line-strong underline-offset-4 transition-colors duration-(--dur-ui) hocus:text-fg hocus:decoration-fg"
                            >
                              {titles[slug] ?? slug}
                            </Link>
                          </Fragment>
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
      <SectionCounter
        index={7}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
