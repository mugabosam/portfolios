import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import still from "@/public/artifact/still.webp";

/**
 * Static image of the Artifact, rendered from the real 3D scene
 * (`pnpm artifact:still`). It is the hero's LCP image, and the stand-in
 * wherever the 3D canvas is not running: no JavaScript, no WebGL, reduced
 * motion or a low-end device. Decorative, so alt is empty.
 */
export function ArtifactStill({
  className,
  sizes = "(min-width: 768px) 40vw, 70vw",
  ...rest
}: Omit<ImageProps, "src" | "alt">) {
  return (
    <Image
      src={still}
      alt=""
      sizes={sizes}
      draggable={false}
      className={cn(
        "artifact-still pointer-events-none h-auto w-full select-none",
        className,
      )}
      {...rest}
    />
  );
}
