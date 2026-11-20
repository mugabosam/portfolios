"use client";

import { useEffect } from "react";

import { setLenis } from "@/lib/motion/lenis";

/**
 * Lenis smooth scrolling, loaded after hydration so it never weighs on first
 * paint. Skipped under reduced motion and on touch devices.
 *
 * Lenis' own anchor handling is off because it ignores clicks that were
 * already handled (the assistant's suggestions are links underneath).
 * Instead, a same-page "#section" link nobody else handled scrolls through
 * Lenis here.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch scrolling stays native under Lenis by default, so on phones and
    // tablets it would only add a frame loop.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let destroyed = false;
    let lenis: import("lenis").default | null = null;

    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link?.hash || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname)
        return;
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
      history.replaceState(null, "", url.hash);
      // Like a native jump, move keyboard focus to targets that accept it
      // (the skip link's <main tabindex="-1">).
      if (target.hasAttribute("tabindex"))
        target.focus({ preventScroll: true });
    };

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
      setLenis(lenis);
      document.addEventListener("click", onClick);
    });
    return () => {
      destroyed = true;
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
