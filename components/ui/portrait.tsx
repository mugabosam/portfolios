import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import heroPortrait from "@/public/portrait/sam-hero.jpg";
import passportPortrait from "@/public/portrait/sam-passport.jpg";

/**
 * Sam's portrait, in black and white to sit inside the site's palette. The
 * `hero` image opens and closes the home page; `passport` is the smaller
 * head-and-shoulders crop in "Seen from every side". The explicit aspect
 * ratio gives the box a definite size before the file arrives, so nothing
 * below it ever shifts.
 */
const sources = {
  hero: {
    src: heroPortrait,
    alt: "Sam Mugabo standing in a black double-breasted suit, photographed against a white wall.",
  },
  passport: {
    src: passportPortrait,
    alt: "Head-and-shoulders portrait of Sam Mugabo in a black suit and tie.",
  },
} as const;

export function Portrait({
  variant = "hero",
  className,
  sizes = "(min-width: 768px) 36vw, 70vw",
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
      className={cn(
        "portrait block h-auto max-w-full border border-line select-none",
        className,
      )}
      {...rest}
    />
  );
}
