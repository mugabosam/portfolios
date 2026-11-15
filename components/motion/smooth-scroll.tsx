"use client";

import { useEffect } from "react";

import { setLenis } from "@/lib/motion/lenis";

/**
 * Lenis smooth scrolling (brief §6.1), loaded after hydration so it never
 * weighs on first paint. Skipped under reduced motion and on touch devices.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch scrolling stays native under Lenis by default, so on phones and
    // tablets it would only add a frame loop.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let destroyed = false;
    let lenis: import("lenis").default | null = null;
    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({ autoRaf: true, anchors: { offset: 0 }, lerp: 0.11 });
      setLenis(lenis);
    });
    return () => {
      destroyed = true;
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
