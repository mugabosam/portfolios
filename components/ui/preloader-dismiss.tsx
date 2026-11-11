"use client";

import { useEffect } from "react";

/**
 * Lets the visitor skip the preloader (any click, tap or key) and hides it
 * for the rest of the session once it has played. The CSS animation ends it
 * after 1.5s regardless, so nothing depends on this script running.
 */
export function PreloaderDismiss({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const done = () => el.setAttribute("data-done", "");
    try {
      if (sessionStorage.getItem("preloader-seen")) {
        done();
        return;
      }
      sessionStorage.setItem("preloader-seen", "1");
    } catch {
      // Storage unavailable (private mode): just play once per load.
    }

    const options = { once: true } as const;
    window.addEventListener("pointerdown", done, options);
    window.addEventListener("keydown", done, options);
    el.addEventListener("animationend", (event) => {
      if (event.animationName === "preloader-out") done();
    });
    return () => {
      window.removeEventListener("pointerdown", done);
      window.removeEventListener("keydown", done);
    };
  }, [targetId]);

  return null;
}
