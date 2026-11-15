import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionCounter } from "@/components/ui/section-counter";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import {
  education,
  experience,
  type TimelineEntry,
  training,
} from "@/content/profile";

function Group({
  label,
  entries,
}: {
  label: string;
  entries: TimelineEntry[];
}) {
  return (
    <div>
      <Eyebrow className="mb-8">{label}</Eyebrow>
      <Timeline>
        {entries.map((entry) => (
          <TimelineItem
            key={entry.title}
            period={entry.period}
            title={entry.title}
            org={entry.org}
          >
            {entry.detail && <p>{entry.detail}</p>}
            {entry.href && (
              <Button
                variant="link"
                href={entry.href}
                icon="arrow"
                className="mt-2"
              >
                Read the case study
              </Button>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

/** 006 / 008: experience timeline; dots fill as the visitor scrolls (brief §5.6). */
export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      data-section="experience"
      className="relative"
    >
      <div className="container-site grid-site gap-y-16 py-32">
        <Eyebrow className="col-span-12">Experience</Eyebrow>
        <div className="col-span-12 md:col-span-6 md:col-start-7 md:text-right">
          <DisplayHeading
            reveal
            id="experience-title"
            roman="Let’s make it"
            italic="your next build"
          />
          <Button href="/resume.pdf" download icon="download" className="mt-10">
            Download CV
          </Button>
        </div>
        <div
          className="col-span-12 flex flex-col gap-16 md:col-span-7"
          data-timeline
        >
          <Group label="Work" entries={experience} />
          <Group label="Education" entries={education} />
          <Group label="Training and certificates" entries={training} />
        </div>
      </div>
      <SectionCounter
        index={6}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
