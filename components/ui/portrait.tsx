import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import fullPortrait from "@/public/portrait/sam-full.jpg";
import heroPortrait from "@/public/portrait/sam-hero.jpg";

/**
 * Sam's portrait in black and white. `hero` is the head-to-waist crop on the
 * home page; `full` is the full-length photo on /about. The explicit aspect
 * ratio gives the box a definite size before the file arrives, so nothing
 * below it ever shifts.
 */
const sources = {
  hero: {
    src: heroPortrait,
    alt: "Sam Mugabo in a black double-breasted suit and tie, photographed against a white wall.",
  },
  full: {
    src: fullPortrait,
    alt: "Full-length portrait of Sam Mugabo standing in a black double-breasted suit against a white wall.",
  },
} as const;

export function Portrait({
  variant = "hero",
  className,
  sizes = "(min-width: 768px) 36vw, 80vw",
  decorative = false,
  ...rest
}: Omit<ImageProps, "src" | "alt"> & {
  variant?: keyof typeof sources;
  decorative?: boolean;
}) {
  const { src, alt } = sources[variant];
  return (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      sizes={sizes}
      placeholder="blur"
      draggable={false}
      style={{ aspectRatio: `${src.width} / ${src.height}` }}
      className={cn("block h-auto max-w-full select-none", className)}
      {...rest}
    />
  );
}
