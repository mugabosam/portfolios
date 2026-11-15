import type Lenis from "lenis";

/** The page's Lenis instance, shared so ScrollTrigger can follow it. */
let instance: Lenis | null = null;
const listeners = new Set<(lenis: Lenis | null) => void>();

export function setLenis(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener(next));
}

export function getLenis() {
  return instance;
}

export function onLenis(listener: (lenis: Lenis | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
