import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Portrait } from "@/components/ui/portrait";
import { SectionCounter } from "@/components/ui/section-counter";
import { SpecCard } from "@/components/ui/spec-card";
import { pad3 } from "@/lib/format";

const facets = [
  {
    title: "Backend",
    text: "APIs, data models and authentication. NestJS and Django on PostgreSQL and MySQL, with permissions enforced on the server.",
  },
  {
    title: "AI / ML",
    text: "Training and evaluating models with scikit-learn and pandas, judged on the metric that matters, then shipped behind an interface.",
  },
  {
    title: "Frontend & mobile",
    text: "Next.js and React for the web, Flutter for phones. Production interfaces from my internship and my own apps.",
  },
];

/** 002 / 008: the three areas of work appear beside Sam's portrait (brief §5.2, portrait by Sam's request). */
export function CraftSection() {
  return (
    <section
      id="craft"
      aria-labelledby="craft-title"
      data-section="craft"
      className="relative"
    >
      <div className="container-site grid-site min-h-svh content-center gap-y-12 py-32">
        <Eyebrow className="col-span-12">Craft · The stack</Eyebrow>

        <div
          className="col-span-12 self-center md:col-span-5"
          data-craft-portrait
        >
          <Portrait
            variant="passport"
            decorative
            sizes="(min-width: 768px) 24rem, 50vw"
            className="mx-auto h-auto w-full max-w-[50vw] md:max-w-xs"
          />
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <DisplayHeading
            reveal
            id="craft-title"
            roman={["Seen from", "every side"]}
            italic="where the logic lives"
          />
          <ol className="mt-12 flex flex-col gap-8">
            {facets.map((facet, index) => (
              <li
                key={facet.title}
                data-facet
                className="border-t border-line pt-6"
              >
                <p className="type-label text-fg-muted">{pad3(index + 1)}</p>
                <h3 className="mt-2 font-display text-h4">{facet.title}</h3>
                <p className="mt-2 max-w-(--measure) text-fg-muted">
                  {facet.text}
                </p>
              </li>
            ))}
          </ol>
          <div data-spec className="mt-12">
            <SpecCard
              label="The core"
              title="Python & TypeScript"
              items={[
                "Django",
                "NestJS",
                "REST APIs",
                "PostgreSQL",
                "Prisma",
                "scikit-learn",
              ]}
            />
          </div>
        </div>
      </div>
      <SectionCounter
        index={2}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
