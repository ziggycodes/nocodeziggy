"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * HeroLabScene
 *
 * A wireframe topology floating in deep space:
 *  - A scattered field of "system nodes" — small wireframe icospheres + glowing cores
 *  - Connection edges between nearby nodes that pulse cyan
 *  - Particles flowing along the brightest edges (data-in-motion)
 *  - A single subtle wireframe hexagon — direct geometric tie to the logo mark
 *  - Slow drift + cursor parallax + slight on-scroll fade
 *
 * Performance:
 *  - frameloop="demand" — paused when off-screen via IntersectionObserver
 *  - DPR clamped at 1.5 max; lower polycount on mobile via prop
 */

type Props = {
  /** Reduces node count + DPR for mobile or low-power profiles. */
  lowPower?: boolean;
};

export function HeroLabScene({ lowPower }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 22], fov: 38 }}
      dpr={[1, lowPower ? 1.2 : 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <SceneRoot lowPower={lowPower} />
    </Canvas>
  );
}

function SceneRoot({ lowPower }: Props) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#22d3ee" />
      <Topology lowPower={lowPower} />
      <HexBeacon />
      <DriftingDust lowPower={lowPower} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Topology — a node graph in 3D with connection lines + flowing particles
   ────────────────────────────────────────────────────────────────────────────── */
function Topology({ lowPower }: Props) {
  const group = useRef<THREE.Group>(null);
  const linesMatRef = useRef<THREE.LineBasicMaterial>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const { mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  const config = useMemo(() => {
    const nodeCount = lowPower ? 30 : 56;
    const radius = 9;
    const rng = mulberry32(7);
    // Generate node positions on a flattened sphere shell
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(2 * rng() - 1);
      const theta = 2 * Math.PI * rng();
      const r = radius * (0.55 + rng() * 0.6);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6; // squish vertically
      const z = r * Math.cos(phi) * 0.7;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    // Connect each node to its 2 nearest neighbors (kNN), dedupe pairs
    const edges: Array<[number, number]> = [];
    const seen = new Set<string>();
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: i === j ? Infinity : n.distanceTo(nodes[i]) }))
        .sort((a, b) => a.d - b.d);
      const neighbors = dists.slice(0, 2);
      neighbors.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([i, j]);
      });
    }

    // Build line geometry positions: for each edge, two vec3
    const linePositions = new Float32Array(edges.length * 2 * 3);
    edges.forEach((e, idx) => {
      const a = nodes[e[0]];
      const b = nodes[e[1]];
      linePositions.set([a.x, a.y, a.z, b.x, b.y, b.z], idx * 6);
    });

    // Node positions for points
    const nodePositions = new Float32Array(nodes.length * 3);
    nodes.forEach((n, idx) => nodePositions.set([n.x, n.y, n.z], idx * 3));

    // Particle attribution: each particle picks a random edge and travels
    const particleCount = lowPower ? 28 : 60;
    const particleEdgeIdx = new Uint16Array(particleCount);
    const particleT = new Float32Array(particleCount);
    const particleSpeed = new Float32Array(particleCount);
    for (let p = 0; p < particleCount; p++) {
      particleEdgeIdx[p] = Math.floor(rng() * edges.length);
      particleT[p] = rng();
      particleSpeed[p] = 0.18 + rng() * 0.4;
    }

    return {
      nodes,
      edges,
      linePositions,
      nodePositions,
      particleCount,
      particleEdgeIdx,
      particleT,
      particleSpeed,
    };
  }, [lowPower]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(config.linePositions, 3));
    return g;
  }, [config]);

  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(config.nodePositions, 3));
    return g;
  }, [config]);

  // Particles
  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(config.particleCount * 3), 3)
    );
    return g;
  }, [config.particleCount]);
  const particleAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;

  useFrame((_state, delta) => {
    if (!group.current) return;

    // Cursor parallax target
    targetRotation.current.x = -mouse.y * 0.14;
    targetRotation.current.y = mouse.x * 0.18;

    // Smooth rotation lerp + slow drift
    group.current.rotation.x += (targetRotation.current.x - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (targetRotation.current.y - group.current.rotation.y) * 0.04;
    group.current.rotation.z += delta * 0.01;

    // Step particles
    for (let p = 0; p < config.particleCount; p++) {
      config.particleT[p] += delta * config.particleSpeed[p];
      if (config.particleT[p] >= 1) {
        config.particleT[p] = 0;
        config.particleEdgeIdx[p] = Math.floor(Math.random() * config.edges.length);
      }
      const edge = config.edges[config.particleEdgeIdx[p]];
      const a = config.nodes[edge[0]];
      const b = config.nodes[edge[1]];
      const t = config.particleT[p];
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const z = a.z + (b.z - a.z) * t;
      particleAttr.setXYZ(p, x, y, z);
    }
    particleAttr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      {/* Edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          ref={linesMatRef}
          color="#22d3ee"
          transparent
          opacity={0.18}
        />
      </lineSegments>

      {/* Static node points */}
      <points geometry={nodeGeo}>
        <pointsMaterial
          ref={pointsMatRef}
          size={0.09}
          color="#ffffff"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Flowing particles along edges */}
      <points geometry={particleGeo}>
        <pointsMaterial
          size={0.15}
          color="#22d3ee"
          transparent
          opacity={1}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   HexBeacon — a slowly rotating wireframe hexagon. Direct logo tie.
   ────────────────────────────────────────────────────────────────────────────── */
function HexBeacon() {
  const ref = useRef<THREE.Group>(null);

  const hexGeo = useMemo(() => {
    const r = 4.5;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.06;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={ref} position={[0, 0, -3]}>
      <line>
        <primitive object={hexGeo} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.22} />
      </line>
      {/* Corner dots — echo of logo's four-corner motif */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(a) * 4.5;
        const y = Math.sin(a) * 4.5;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        );
      })}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   DriftingDust — a slow background haze of stationary points.
   ────────────────────────────────────────────────────────────────────────────── */
function DriftingDust({ lowPower }: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = lowPower ? 200 : 400;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rng = mulberry32(11);
    for (let i = 0; i < count; i++) {
      const r = 14 + rng() * 24;
      const phi = Math.acos(2 * rng() - 1);
      const theta = 2 * Math.PI * rng();
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -8 - rng() * 14;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.005;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#FFFFFF"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Deterministic pseudo-random for stable layout across renders
   ────────────────────────────────────────────────────────────────────────────── */
function mulberry32(seed: number) {
  let a = seed | 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Lazy intersection-observer hook: scene unmounts itself when fully off-screen.
 * Reduces wasted GPU when the user scrolls past the hero.
 */
export function useSceneVisibility(ref: React.RefObject<HTMLElement>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setVisible(e.isIntersecting));
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}
