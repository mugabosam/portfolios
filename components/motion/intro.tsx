"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { site } from "@/content/site";

/** Set once the intro has played (or was skipped) in this tab. */
let played = false;
const noopSubscribe = () => () => {};

/**
 * The opening screen on the home page: a 0 to 100 count on navy that lifts
 * away to reveal the hero, about 1.8s in all. Pure CSS (.intro in
 * globals.css), so it also plays without JavaScript; the script only lets a
 * visitor skip it and makes sure it plays once per visit:
 * - a reload in the same tab skips it (the inline script in the root layout
 *   sets html[data-intro="seen"] before the first paint);
 * - a client-side navigation back to the home page never renders it again.
 * Decorative, so hidden from assistive tech; never shown under reduced motion.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  // Server and hydration render it; later client renders only if not played.
  const show = useSyncExternalStore(
    noopSubscribe,
    () => !played,
    () => true,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    if (root.dataset.intro === "seen") played = true;
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // Storage unavailable: it simply plays on each full load.
    }

    const finish = () => {
      played = true;
      el.dataset.done = "";
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === "intro-out") finish();
    };
    el.addEventListener("animationend", onEnd);
    const options = { once: true } as const;
    window.addEventListener("pointerdown", finish, options);
    window.addEventListener("keydown", finish, options);
    return () => {
      el.removeEventListener("animationend", onEnd);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      // Leaving the home page: later visits start the hero without waiting.
      played = true;
      root.dataset.intro = "seen";
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <div className="intro-name">
        <span className="intro-line">
          <span>{site.name}</span>
        </span>
        <span className="intro-line text-white/75">
          <span>Software developer, {site.location}</span>
        </span>
      </div>
      <span className="intro-count" />
      <span className="intro-bar" />
    </div>
  );
}
