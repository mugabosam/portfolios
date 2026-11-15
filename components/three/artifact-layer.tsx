"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";

import { canRender3D } from "@/lib/motion/artifact-state";

/** The 3D bundle (three.js, React Three Fiber) loads only when this mounts. */
const Scene = dynamic(() => import("./scene"), { ssr: false });

/** Any WebGL failure leaves the static images in place instead of breaking the page. */
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onError();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed, full-viewport layer behind the home page. Loads the 3D scene as the
 * visitor approaches the orbit stage, and only on capable devices; until then (and forever on
 * low-end devices, with reduced motion or without WebGL) the static
 * Artifact images in each section stand in for it.
 */
export function ArtifactLayer() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    // The Artifact first appears at the orbit stage, several viewports down.
    // Load the WebGL bundle when the visitor gets within two screens of it,
    // so the opening of the page carries none of its weight.
    const stage = document.querySelector("[data-orbit-stage]");
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200% 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.artifact = "3d";
    return () => {
      delete root.dataset.artifact;
    };
  }, [ready]);

  if (!load) return null;

  return (
    <div
      aria-hidden="true"
      className="artifact-layer pointer-events-none fixed inset-0 z-0"
    >
      <div data-artifact-canvas className="h-full w-full">
        <SceneBoundary onError={() => setReady(false)}>
          <Scene onReady={() => setReady(true)} />
        </SceneBoundary>
      </div>
    </div>
  );
}
