"use client";

import dynamic from "next/dynamic";

import { artifact } from "@/lib/motion/artifact-state";

const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false });

export function CaptureCanvas() {
  Object.assign(artifact, {
    x: 0,
    y: 0,
    scale: 1.08,
    spin: 0,
    rotY: 0.62,
    orbit: 0,
    collapse: 0,
    inner: 0,
  });
  return (
    <div id="capture" className="fixed top-0 left-0 z-[200] size-[900px]">
      <Scene
        capture
        onReady={() =>
          document.documentElement.setAttribute("data-capture-ready", "")
        }
      />
    </div>
  );
}
