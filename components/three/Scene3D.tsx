"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export interface Palette {
  accent: string;
  accent2: string;
  bg: string;
}

export type Quality = "high" | "low";

const EDGE_DIST = 3.2;

const TUNING = {
  high: { nodes: 64, packets: 24, sparkles: 44, dpr: [1, 1.75] as [number, number], bloom: 0.85 },
  low: { nodes: 34, packets: 12, sparkles: 22, dpr: [1, 1.3] as [number, number], bloom: 0.7 },
};

function NodeGraph({
  palette,
  paused,
  quality,
}: {
  palette: Palette;
  paused: boolean;
  quality: Quality;
}) {
  const NODE_COUNT = TUNING[quality].nodes;
  const PACKET_COUNT = TUNING[quality].packets;
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // global pointer (the canvas sits behind the hero content)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { nodes, edgeGeo, edgePairs, phases } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 8.5,
          (Math.random() - 0.5) * 8 - 1
        )
      );
    }
    const phases = nodes.map(() => Math.random() * Math.PI * 2);
    const edgePairs: [number, number][] = [];
    const positions: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].distanceTo(nodes[j]) < EDGE_DIST) {
          edgePairs.push([i, j]);
          positions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    return { nodes, edgeGeo, edgePairs, phases };
  }, [NODE_COUNT]);

  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, () => ({
        edge: Math.floor(Math.random() * Math.max(1, edgePairs.length)),
        t: Math.random(),
        speed: 0.12 + Math.random() * 0.22,
      })),
    [edgePairs.length, PACKET_COUNT]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // initial node placement
  useLayoutEffect(() => {
    const m = nodesRef.current;
    if (!m) return;
    nodes.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(0.075);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;

    // seed packet positions so the static (reduced-motion) frame isn't empty
    const pm = packetsRef.current;
    if (pm) {
      packets.forEach((pk, i) => {
        const [a, b] = edgePairs[pk.edge] ?? [0, 1];
        dummy.position.lerpVectors(nodes[a], nodes[b], pk.t);
        dummy.scale.setScalar(0.05);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      });
      pm.instanceMatrix.needsUpdate = true;
    }
  }, [nodes, dummy, packets, edgePairs]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // parallax + slow auto-rotation
    if (group.current) {
      const targetY = pointer.current.x * 0.45 + (paused ? 0 : t * 0.025);
      const targetX = -pointer.current.y * 0.28;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    }

    if (paused) return;

    // node twinkle (scale in place, so edges stay attached)
    const m = nodesRef.current;
    if (m) {
      for (let i = 0; i < nodes.length; i++) {
        const s = 0.06 * (1 + 0.55 * Math.sin(t * 1.6 + phases[i]));
        dummy.position.copy(nodes[i]);
        dummy.scale.setScalar(Math.max(0.025, s));
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }

    // packets travelling along edges
    const pm = packetsRef.current;
    if (pm && edgePairs.length > 0) {
      packets.forEach((pk, i) => {
        pk.t += pk.speed * delta;
        if (pk.t >= 1) {
          pk.t = 0;
          pk.edge = Math.floor(Math.random() * edgePairs.length);
        }
        const [a, b] = edgePairs[pk.edge] ?? [0, 1];
        dummy.position.lerpVectors(nodes[a], nodes[b], pk.t);
        dummy.scale.setScalar(0.05);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      });
      pm.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          color={palette.accent}
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </instancedMesh>

      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={palette.accent2} toneMapped={false} />
      </instancedMesh>

      <Sparkles
        count={TUNING[quality].sparkles}
        scale={[17, 10, 8]}
        size={2.2}
        speed={paused ? 0 : 0.3}
        opacity={0.5}
        color={palette.accent2}
      />
    </group>
  );
}

export default function Scene3D({
  palette,
  paused = false,
  active = true,
  quality = "high",
}: {
  palette: Palette;
  paused?: boolean;
  active?: boolean;
  quality?: Quality;
}) {
  return (
    <Canvas
      dpr={TUNING[quality].dpr}
      camera={{ position: [0, 0, 10], fov: 55 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <fog attach="fog" args={[palette.bg, 9, 24]} />
      <NodeGraph palette={palette} paused={paused} quality={quality} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          intensity={TUNING[quality].bloom}
          mipmapBlur
          radius={0.75}
        />
      </EffectComposer>
    </Canvas>
  );
}
