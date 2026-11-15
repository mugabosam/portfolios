"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Artifact } from "./artifact";
import { FrameloopGuard } from "./frameloop-guard";

/** [x, y, z, rotationY, rotationZ, width] of each strip light. */
const STRIPS: [number, number, number, number, number, number][] = [
  [0, 4, 1, 0, 0, 12],
  [0, -3.5, 2, 0, 0.3, 10],
  [-5, 1, 0, Math.PI / 2, 0.6, 8],
  [5, -0.5, 0, -Math.PI / 2, -0.4, 8],
  [-3, 3, 4, 0.5, -0.8, 6],
  [3.5, 2.5, -3, -2.6, 0.9, 6],
  [0, 0.5, -5, Math.PI, 0.2, 10],
  [2, -2.5, 4.5, -0.3, 1.2, 5],
];

/**
 * The single WebGL canvas (brief §6.3). FrameloopGuard runs the loop only
 * while the canvas is visible. Lighting is procedural (Lightformers), so
 * there is no HDRI file to download.
 */
export default function Scene({
  onReady,
  capture = false,
}: {
  onReady?: () => void;
  capture?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="never"
      camera={{ position: [0, 0, 6], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: capture,
      }}
      onCreated={() => onReady?.()}
    >
      <FrameloopGuard always={capture} />
      <Environment resolution={512} frames={1}>
        {/* Thin strips on black: each flat facet catches a strip or none, which
            gives the hard white-and-black facets of a cut stone in photographs. */}
        {STRIPS.map(([x, y, z, ry, rz, w], i) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={7}
            position={[x, y, z]}
            rotation={[0, ry, rz]}
            scale={[w, 0.18, 1]}
          />
        ))}
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[0, 0, 6]}
          scale={[6, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[0, -6, 0]}
          rotation-x={-Math.PI / 2}
          scale={[8, 8, 1]}
        />
        <Lightformer
          form="ring"
          intensity={8}
          position={[2.5, 2, 5]}
          scale={1.2}
        />
        <Lightformer
          form="ring"
          intensity={4}
          position={[-3, -1.5, 4]}
          scale={0.8}
        />
      </Environment>
      <ambientLight intensity={0.12} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <directionalLight position={[-4, -1, 3]} intensity={0.6} />
      <directionalLight position={[0, -5, 2]} intensity={0.45} />
      <Artifact />
    </Canvas>
  );
}
