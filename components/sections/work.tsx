import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ArtifactStill } from "@/components/three/artifact-still";
import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionCounter } from "@/components/ui/section-counter";
import { categoryLabels, type ProjectSummary } from "@/lib/content/categories";
import { pad3 } from "@/lib/format";

import { ProjectIndex } from "./project-index";

/**
 * 005 / 008: six facets orbit the Artifact, then collapse into it and give way
 * to the project index (brief §5.5). On small screens the orbit becomes a
 * swipeable carousel with snap points (brief §6.4).
 */
export function WorkSection({ projects }: { projects: ProjectSummary[] }) {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-section="work"
      className="relative"
    >
      {/* Orbit stage (desktop). The 3D canvas draws the orbit when it runs;
          otherwise these images orbit with CSS. */}
      <div data-orbit-stage className="relative hidden min-h-svh md:block">
        <p className="absolute top-32 left-(--gutter) type-label text-fg-muted">
          Shaped by patient hands
        </p>
        <p className="absolute right-(--gutter) bottom-24 type-label text-fg-muted">
          One developer, six problems
        </p>
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="orbit relative size-[min(64vh,36rem)]">
            <div className="absolute inset-[28%]">
              <ArtifactStill sizes="16rem" />
            </div>
            <div className="orbit-ring absolute inset-0" data-orbit-ring>
              {projects.slice(0, 6).map((project, index) => (
                <span
                  key={project.slug}
                  className="orbit-facet absolute top-1/2 left-1/2 block size-16"
                  style={{ "--i": index } as CSSProperties}
                >
                  <ArtifactStill
                    sizes="4rem"
                    className="artifact-still-satellite"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="work-index" className="container-site pt-16 pb-32 md:pt-32">
        <Eyebrow className="md:hidden">Shaped by patient hands</Eyebrow>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8 md:mt-0">
          <DisplayHeading
            reveal
            id="work-title"
            roman="Selected"
            italic="work"
          />
          <Button
            variant="link"
            href="/work"
            icon="arrow"
            className="hidden md:inline-flex"
          >
            All work
          </Button>
        </div>

        {/* Desktop: index rows with a cursor-following preview. */}
        <div className="mt-16 hidden md:block">
          <ProjectIndex projects={projects} />
        </div>

        {/* Mobile: a swipeable carousel with inline thumbnails. */}
        <ul
          aria-label="Selected projects"
          className="carousel -mx-(--gutter) mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-6 md:hidden"
        >
          {projects.map((project) => (
            <li
              key={project.slug}
              className="w-[78vw] max-w-sm shrink-0 snap-start"
            >
              <Link
                href={`/work/${project.slug}`}
                className="group block h-full border border-line"
              >
                <Image
                  src={project.cover}
                  alt=""
                  width={1600}
                  height={1000}
                  unoptimized
                  className="h-auto w-full border-b border-line"
                />
                <div className="flex flex-col gap-2 p-5">
                  <span className="type-label text-fg-muted tabular-nums">
                    {pad3(project.order)} ·{" "}
                    {project.category.map((c) => categoryLabels[c]).join(" / ")}
                  </span>
                  <span className="font-display text-h4">{project.title}</span>
                  <span className="text-small text-fg-muted">
                    {project.summary}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Button
          variant="link"
          href="/work"
          icon="arrow"
          className="mt-8 md:hidden"
        >
          All work
        </Button>
      </div>
      <SectionCounter
        index={5}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
