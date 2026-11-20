"use client";

import { useEffect, useRef, useState } from "react";

import { OPEN_PROJECT_EVENT } from "@/components/assistant/assistant";
import { GitHubIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import { getLenis } from "@/lib/motion/lenis";

/**
 * One modal sheet for every project: the problem, what was built and the
 * result, in plain words, plus the role, the tools and the public code when
 * there is some. It opens from a card's "See the details" button or from
 * the assistant, and returns focus to whatever opened it.
 */
export function ProjectSheet() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const project = projects.find((item) => item.slug === slug);

  useEffect(() => {
    const open = (next: string) => {
      opener.current = document.activeElement as HTMLElement | null;
      setSlug(next);
      dialogRef.current?.showModal();
      getLenis()?.stop();
    };
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-open-project]",
      );
      if (button?.dataset.openProject) open(button.dataset.openProject);
    };
    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) open(detail);
    };
    document.addEventListener("click", onClick);
    window.addEventListener(OPEN_PROJECT_EVENT, onEvent);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(OPEN_PROJECT_EVENT, onEvent);
    };
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-sheet-title"
      data-lenis-prevent
      onClose={() => {
        getLenis()?.start();
        opener.current?.focus();
      }}
      onClick={(event) => {
        // A click on the backdrop (outside the sheet) closes it.
        if (event.target === dialogRef.current) close();
      }}
      className="project-sheet m-auto max-h-[min(46rem,calc(100dvh-2rem))] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[1.75rem] border-0 bg-surface p-0 text-ink"
    >
      {project && (
        <div>
          <div className="relative overflow-hidden bg-linear-to-br from-sky to-sky-deep px-6 pt-6 pb-7 text-white sm:px-8">
            <div className="flex items-start justify-between gap-6">
              <p className="text-small font-semibold text-white">
                {project.kind}, {project.year}
              </p>
              <button
                type="button"
                onClick={close}
                className="-mt-1 -mr-2 inline-flex min-h-tap items-center rounded-full px-3 text-small font-semibold text-white hocus:text-sun"
              >
                Close
              </button>
            </div>
            <h2
              id="project-sheet-title"
              className="mt-3 text-[clamp(2.25rem,6vw,3.5rem)] leading-[0.95] font-[820] tracking-[-0.03em] [font-stretch:82%]"
            >
              {project.title}
            </h2>
            <p className="mt-3 text-white">{project.summary}</p>
            <p className="mt-6 flex items-baseline gap-3 border-t border-white/25 pt-5">
              <span className="shrink-0 text-[2rem] leading-none font-[820] whitespace-nowrap text-sun [font-stretch:80%]">
                {project.highlight.value}
              </span>
              <span className="text-small text-white">
                {project.highlight.label}
              </span>
            </p>
          </div>

          <dl className="grid gap-6 px-6 py-7 sm:px-8">
            {[
              ["The problem", project.problem],
              ["What I built", project.built],
              ["The result", project.result],
            ].map(([term, text]) => (
              <div
                key={term}
                className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
              >
                <dt className="text-small font-semibold text-sky">{term}</dt>
                <dd className="text-ink-2">{text}</dd>
              </div>
            ))}
            <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
              <dt className="text-small font-semibold text-sky">My role</dt>
              <dd className="text-ink-2">{project.role}</dd>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
              <dt className="text-small font-semibold text-sky">Built with</dt>
              <dd className="text-ink-2">{project.tools.join(", ")}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-3 border-t border-line px-6 py-5 sm:px-8">
            {project.repo ? (
              <a
                href={project.repo}
                className="inline-flex min-h-tap items-center gap-2.5 rounded-full bg-sky-deep px-5 text-small font-semibold text-white hocus:bg-sky"
              >
                <GitHubIcon className="size-4" />
                See it on GitHub
              </a>
            ) : (
              <p className="text-small text-ink-3">
                Internal software: no code, data or screenshots are shared.
              </p>
            )}
            <button
              type="button"
              onClick={close}
              className="ml-auto inline-flex min-h-tap items-center rounded-full border border-line-strong px-5 text-small font-semibold text-ink hocus:border-ink"
            >
              Back to the projects
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
