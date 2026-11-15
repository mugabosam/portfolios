"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ProjectCard } from "@/components/ui/project-card";
import { cn } from "@/lib/cn";
import { categoryLabels, type ProjectSummary } from "@/lib/content/categories";

/**
 * Desktop project index. On devices with a fine pointer (and without reduced
 * motion) a preview of the hovered project follows the cursor; it is
 * decorative, so the rows themselves carry every piece of information.
 */
export function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ProjectSummary | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    const frame = requestAnimationFrame(update);
    query.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener("change", update);
    };
  }, []);

  // The follower runs only while a row is hovered; no idle frame loop.
  const following = enabled && active !== null;
  useEffect(() => {
    if (!following) return;
    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const tick = () => {
      position.x += (target.x - position.x) * 0.18;
      position.y += (target.y - position.y) * 0.18;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${position.x + 24}px, ${position.y - 120}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [following]);

  return (
    <>
      <ol
        className="border-b border-line"
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((project) => (
          <li key={project.slug} onPointerEnter={() => setActive(project)}>
            <ProjectCard
              index={project.order}
              title={project.title}
              href={`/work/${project.slug}`}
              summary={project.summary}
              year={String(project.year)}
              category={project.category.map((c) => categoryLabels[c])}
              stack={project.stack}
            />
          </li>
        ))}
      </ol>
      {enabled && (
        <div
          ref={preview}
          aria-hidden="true"
          className={cn(
            "pointer-events-none fixed top-0 left-0 z-40 w-80 border border-line-strong bg-bg transition-opacity duration-(--dur-ui) ease-out",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          {active && (
            <Image
              src={active.cover}
              alt=""
              width={1600}
              height={1000}
              unoptimized
              className="h-auto w-full"
            />
          )}
        </div>
      )}
    </>
  );
}
