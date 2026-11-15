"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  type Group,
  MathUtils,
  type Mesh,
  OctahedronGeometry,
  TorusGeometry,
} from "three";

import { artifact } from "@/lib/motion/artifact-state";

import { createGemGeometry } from "./geometry";

const SATELLITES = 6;
const DAMPING = 4;

/**
 * The Artifact: a faceted crystal inside a thin metal armature. It eases
 * every frame towards the targets the scroll choreography writes into
 * `artifact`, so scroll input never causes a jump.
 */
export function Artifact() {
  const group = useRef<Group>(null);
  const gem = useRef<Mesh>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const satellites = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const idle = useRef(0);
  const current = useRef({ ...artifact });
  const viewport = useThree((state) => state.viewport);

  const gemGeometry = useMemo(() => createGemGeometry(10), []);
  const satelliteGeometry = useMemo(() => createGemGeometry(8), []);
  const innerGeometry = useMemo(() => new OctahedronGeometry(0.14, 0), []);
  const ringGeometry = useMemo(
    () => new TorusGeometry(1.18, 0.008, 8, 192),
    [],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const c = current.current;
    for (const key of Object.keys(c) as (keyof typeof c)[]) {
      c[key] = MathUtils.damp(c[key], artifact[key], DAMPING, delta);
    }
    idle.current += delta * 0.22 * c.spin;
    const t = idle.current;

    // Fit the object to narrow viewports instead of letting it overflow.
    const fit = Math.min(1, viewport.width / 5.2);
    const root = group.current;
    if (!root) return;
    root.position.set(
      (c.x * viewport.width) / 2,
      (c.y * viewport.height) / 2,
      0,
    );
    root.scale.setScalar(Math.max(c.scale * fit, 0.0001));

    if (gem.current) {
      gem.current.rotation.y = t + c.rotY;
      gem.current.rotation.x = 0.44 + Math.sin(t * 0.7) * 0.06 * c.spin;
    }
    if (ringA.current)
      ringA.current.rotation.set(Math.PI / 2 + 0.25, 0, t * 0.6);
    if (ringB.current) ringB.current.rotation.set(0.2, -t * 0.45, 0);

    const orbitScale = 0.2 * c.orbit * (1 - c.collapse);
    const radius = 2.3 * (1 - c.collapse);
    satellites.current?.children.forEach((child, i) => {
      const angle = (i / SATELLITES) * Math.PI * 2 + t * 1.4;
      child.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.18,
        Math.sin(angle) * radius * 0.55,
      );
      child.scale.setScalar(Math.max(orbitScale, 0.0001));
      child.rotation.y = t * 2 + i;
    });

    inner.current?.children.forEach((child, i) => {
      const angle = (i / SATELLITES) * Math.PI * 2 - t;
      child.position.set(Math.cos(angle) * 0.42, -0.08, Math.sin(angle) * 0.42);
      child.scale.setScalar(Math.max(c.inner, 0.0001));
    });
  });

  return (
    <group ref={group}>
      <mesh ref={gem} geometry={gemGeometry}>
        <meshPhysicalMaterial
          color="#e9e9e9"
          metalness={0.68}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.03}
          ior={2.4}
          specularIntensity={1}
          envMapIntensity={2.4}
          flatShading
        />
      </mesh>

      <mesh ref={ringA} geometry={ringGeometry}>
        <meshStandardMaterial color="#d8d8d8" metalness={1} roughness={0.28} />
      </mesh>
      <mesh ref={ringB} geometry={ringGeometry}>
        <meshStandardMaterial color="#bdbdbd" metalness={1} roughness={0.34} />
      </mesh>

      <group ref={satellites}>
        {Array.from({ length: SATELLITES }, (_, i) => (
          <mesh key={i} geometry={satelliteGeometry}>
            <meshStandardMaterial
              color="#e6e6e6"
              metalness={0.9}
              roughness={0.12}
              flatShading
            />
          </mesh>
        ))}
      </group>

      <group ref={inner}>
        {Array.from({ length: SATELLITES }, (_, i) => (
          <mesh key={i} geometry={innerGeometry}>
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.6}
              roughness={0.2}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
