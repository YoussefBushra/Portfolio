"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export interface CorePalette {
  accent: string;
  accent2: string;
}

export type Quality = "high" | "low";

const TUNING = {
  high: { rings: [8, 10, 6], dpr: [1, 1.75] as [number, number], bloom: 1.1, distort: 0.36 },
  low: { rings: [6, 7], dpr: [1, 1.3] as [number, number], bloom: 0.85, distort: 0.28 },
};

function OrbitRing({
  count,
  radius,
  tilt,
  speed,
  color,
}: {
  count: number;
  radius: number;
  tilt: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }),
    [count, radius]
  );

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.4]}>
      {/* faint orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.012, radius + 0.012, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <group ref={ref}>
        {positions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Core({
  palette,
  quality,
  paused,
}: {
  palette: CorePalette;
  quality: Quality;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const cfg = TUNING[quality];

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;
    if (!paused) g.rotation.y += delta * 0.18;
    g.rotation.x += (pointer.current.y * 0.35 - g.rotation.x) * 0.05;
    const targetY = pointer.current.x * 0.5;
    g.rotation.z += (targetY * 0.15 - g.rotation.z) * 0.05;
  });

  return (
    <group ref={group}>
      {/* wireframe shell */}
      <Icosahedron args={[1.55, 1]}>
        <meshBasicMaterial
          color={palette.accent}
          wireframe
          transparent
          opacity={0.28}
          toneMapped={false}
        />
      </Icosahedron>

      {/* morphing crystal */}
      <Icosahedron args={[1.15, 5]}>
        <MeshDistortMaterial
          color={palette.accent}
          emissive={palette.accent}
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.7}
          distort={paused ? 0 : cfg.distort}
          speed={1.6}
        />
      </Icosahedron>

      {/* glowing core */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={palette.accent2} toneMapped={false} />
      </mesh>

      {cfg.rings.map((count, i) => (
        <OrbitRing
          key={i}
          count={count}
          radius={2.1 + i * 0.55}
          tilt={0.5 + i * 0.6}
          speed={(paused ? 0 : 0.25) * (i % 2 ? -1 : 1) * (1 + i * 0.3)}
          color={i % 2 ? palette.accent2 : palette.accent}
        />
      ))}

      <Sparkles
        count={quality === "low" ? 20 : 40}
        scale={7}
        size={2}
        speed={paused ? 0 : 0.4}
        opacity={0.6}
        color={palette.accent2}
      />
    </group>
  );
}

export default function DataCore({
  palette,
  quality = "high",
  active = true,
  paused = false,
}: {
  palette: CorePalette;
  quality?: Quality;
  active?: boolean;
  paused?: boolean;
}) {
  const cfg = TUNING[quality];
  return (
    <Canvas
      dpr={cfg.dpr}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={2.2} color={palette.accent} />
      <pointLight position={[-4, -2, 2]} intensity={1.6} color={palette.accent2} />
      <Core palette={palette} quality={quality} paused={paused} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.25}
          intensity={cfg.bloom}
          mipmapBlur
          radius={0.8}
        />
      </EffectComposer>
    </Canvas>
  );
}
