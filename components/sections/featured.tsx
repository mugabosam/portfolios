import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionCounter } from "@/components/ui/section-counter";

import { DecisionTreeArt } from "./decision-tree-art";

const facts = [
  {
    label: "Problem",
    text: "Malaria’s early symptoms look like flu, and people wait too long to get tested.",
  },
  {
    label: "Approach",
    text: "A depth-limited decision tree on 1,622 lab-confirmed records, with safety rules that outrank the model.",
  },
  {
    label: "Result",
    text: "89.1% sensitivity and 88.3% specificity on a held-out test set.",
  },
];

/** 003 / 008: the one light section. A white card beside a dark render (brief §5.3). */
export function FeaturedSection({ slug }: { slug: string }) {
  return (
    <section
      id="featured"
      aria-labelledby="featured-title"
      data-section="featured"
      className="relative overflow-hidden py-32"
    >
      <div className="container-site">
        <Eyebrow>The spotlight</Eyebrow>
        <div className="mt-12 grid-site items-stretch gap-y-6">
          <div
            data-featured-render
            className="col-span-12 flex items-center justify-center border border-line bg-bg-elevated p-12 md:col-span-5"
          >
            <DecisionTreeArt />
          </div>
          <div
            data-featured-card
            className="col-span-12 surface-light p-8 md:col-span-7 md:p-16"
          >
            <Eyebrow>Featured · AI / ML</Eyebrow>
            <DisplayHeading
              reveal
              id="featured-title"
              roman={["Before the", "blood test"]}
              italic="a first answer"
              className="mt-6"
            />
            <p className="mt-8 max-w-(--measure)">
              MalariaCheck estimates how likely a person’s symptoms are to be
              malaria and says plainly when a test cannot wait. It learned from
              1,622 lab-confirmed hospital records, and two safety rules sit
              above the model.
            </p>
            <dl className="mt-12 grid gap-8 border-t border-line pt-8 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="type-label text-fg-muted">{fact.label}</dt>
                  <dd className="mt-2 text-small">{fact.text}</dd>
                </div>
              ))}
            </dl>
            <Button
              variant="solid"
              href={`/work/${slug}`}
              icon="arrow"
              className="mt-12"
            >
              Read case study
            </Button>
          </div>
        </div>
      </div>
      <SectionCounter
        index={3}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
