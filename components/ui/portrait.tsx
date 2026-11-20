import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import cutoutPortrait from "@/public/portrait/sam-cutout.webp";
import fullPortrait from "@/public/portrait/sam-full.jpg";

/**
 * Sam's portrait in black and white. `cutout` is the home page hero's
 * head-to-thigh figure with the wall removed (transparent WebP); `full` is
 * the full-length photo on /about. The explicit aspect ratio gives the box a
 * definite size before the file arrives, so nothing below it ever shifts.
 */
const sources = {
  cutout: {
    src: cutoutPortrait,
    alt: "Sam Mugabo in a black double-breasted suit and tie, hands in his pockets.",
  },
  full: {
    src: fullPortrait,
    alt: "Full-length portrait of Sam Mugabo standing in a black double-breasted suit against a white wall.",
  },
} as const;

export function Portrait({
  variant = "full",
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
      placeholder={variant === "cutout" ? "empty" : "blur"}
      draggable={false}
      style={{ aspectRatio: `${src.width} / ${src.height}` }}
      className={cn("block h-auto max-w-full select-none", className)}
      {...rest}
    />
  );
}
