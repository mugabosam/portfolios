import { cn } from "@/lib/cn";

import { PreloaderDismiss } from "./preloader-dismiss";

/**
 * Brief opening screen: a 0 to 100 counter, at most 1.5s. Decorative, so it
 * is hidden from assistive tech. Skipped entirely under reduced motion.
 * `inline` renders it inside its container (styleguide demo) instead of
 * covering the viewport, and does not remember that it has played.
 */
export function Preloader({
  id = "preloader",
  inline = false,
}: {
  id?: string;
  inline?: boolean;
}) {
  return (
    <div
      id={id}
      aria-hidden="true"
      className={cn(
        "preloader flex items-end justify-between gap-8 bg-bg p-(--gutter) text-fg",
        inline ? "relative h-80 border border-line" : "fixed inset-0 z-[90]",
      )}
    >
      <span className="type-label text-fg-muted">Sam Mugabo · Portfolio</span>
      <span className="preloader-count font-display text-display leading-none tabular-nums" />
      {!inline && <PreloaderDismiss targetId={id} />}
    </div>
  );
}
