/**
 * Shared state between the scroll choreography (GSAP, components/motion) and
 * the 3D Artifact (React Three Fiber, components/three). Scroll triggers
 * write targets; the render loop eases towards them every frame. A plain
 * mutable object keeps React out of the 60fps path.
 */
export const artifact = {
  /** Horizontal offset as a fraction of half the viewport width (-1 left, 1 right). */
  x: 0.45,
  /** Vertical offset as a fraction of half the viewport height. */
  y: 0,
  scale: 1,
  /** Extra rotation around Y, in radians, added to the idle spin. */
  rotY: 0,
  /** Idle spin multiplier: 1 = slow idle rotation, 0 = perfectly still. */
  spin: 1,
  /** 0 to 1: six small facets appear and orbit the Artifact. */
  orbit: 0,
  /** 0 to 1: the orbiting facets are drawn into the centre. */
  collapse: 0,
  /** 0 to 1: six facets glimpsed inside the Artifact. */
  inner: 0,
};

export type ArtifactState = typeof artifact;

/* Whether the canvas should render at all. Kept outside the animated object
   so the canvas can stop its render loop when nothing is visible. */
let visible = true;
const listeners = new Set<() => void>();

export function setArtifactVisible(next: boolean) {
  if (next === visible) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

export function subscribeArtifactVisible(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getArtifactVisible() {
  return visible;
}

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/**
 * Whether this device should get the real-time 3D Artifact. Everything else
 * gets the static image (brief §6.3). Four logical cores is the floor, not
 * the ceiling: many mid-range laptops have exactly four (docs/decisions.md).
 */
export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  // The Artifact only appears in desktop-width sections (orbit, experience).
  if (!window.matchMedia("(min-width: 48rem)").matches) return false;
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}
