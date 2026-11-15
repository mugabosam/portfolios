"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import {
  getArtifactVisible,
  subscribeArtifactVisible,
} from "@/lib/motion/artifact-state";

/**
 * Runs the render loop only while the canvas is actually on screen.
 *
 * It lives inside the Canvas on purpose: React Three Fiber keeps its root
 * alive while Next.js hides a previous page for instant back navigation, and
 * effects in the hidden DOM tree are disconnected then. Effects inside the
 * Fiber root keep running, so this one can still switch the loop off when the
 * canvas is hidden (`display: none` makes it stop intersecting), scrolled
 * away, faded out by a section, or in a background tab.
 */
export function FrameloopGuard({ always = false }: { always?: boolean }) {
  const canvas = useThree((state) => state.gl.domElement);
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    if (always) {
      setFrameloop("always");
      return;
    }

    let intersecting = true;
    const apply = () => {
      const run =
        intersecting &&
        getArtifactVisible() &&
        document.visibilityState === "visible";
      setFrameloop(run ? "always" : "never");
    };

    const observer = new IntersectionObserver(([entry]) => {
      intersecting = Boolean(entry?.isIntersecting);
      apply();
    });
    observer.observe(canvas);

    const unsubscribe = subscribeArtifactVisible(apply);
    document.addEventListener("visibilitychange", apply);
    apply();

    return () => {
      observer.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [always, canvas, setFrameloop]);

  return null;
}
