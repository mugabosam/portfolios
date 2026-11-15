import { Fragment } from "react";

import { cn } from "@/lib/cn";

type DisplayHeadingProps = {
  as?: "h1" | "h2" | "h3";
  id?: string;
  /** Uppercase roman lines, one entry per line (≤ 4 words each). */
  roman: string | readonly string[];
  /** Sentence-case italic closing line. */
  italic?: string;
  size?: "display" | "h2";
  align?: "start" | "end";
  /** Opt in to the masked line reveal on the home page (Phase 5 motion). */
  reveal?: boolean;
  className?: string;
};

/**
 * The editorial two-voice headline: uppercase roman lines, then an italic
 * line ("BUILT / to last"). Spaces between the block lines keep the
 * accessible name readable ("Built to last", not "Builtto last").
 */
export function DisplayHeading({
  as: Tag = "h2",
  id,
  roman,
  italic,
  size = "h2",
  align = "start",
  reveal = false,
  className,
}: DisplayHeadingProps) {
  const lines = typeof roman === "string" ? [roman] : roman;
  const romanClass = size === "display" ? "type-display" : "type-h2";
  const italicClass = size === "display" ? "text-display" : "text-h2";

  return (
    <Tag
      id={id}
      data-reveal={reveal || undefined}
      className={cn(align === "end" && "text-right", className)}
    >
      {lines.map((line) => (
        <Fragment key={line}>
          <span className={cn("block", romanClass)}>{line}</span>{" "}
        </Fragment>
      ))}
      {italic && (
        <span
          className={cn(
            "block font-display tracking-display italic",
            italicClass,
          )}
        >
          {italic}
        </span>
      )}
    </Tag>
  );
}
