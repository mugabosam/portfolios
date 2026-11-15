import { SectionCounter } from "@/components/ui/section-counter";
import { manifesto } from "@/content/profile";

/** 004 / 008: a progress line fills, then the manifesto reveals line by line (brief §5.4). */
export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      data-section="philosophy"
      className="relative"
    >
      <div className="container-site flex min-h-svh flex-col justify-center py-32">
        <h2 id="philosophy-title" className="type-label text-fg-muted">
          The philosophy
        </h2>
        <div className="mt-12 h-px w-full bg-line" aria-hidden="true">
          <div data-progress className="h-px w-full origin-left bg-fg" />
        </div>
        <p
          data-manifesto
          className="mt-16 max-w-5xl font-display text-manifesto"
        >
          {manifesto}
        </p>
      </div>
      <SectionCounter
        index={4}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
