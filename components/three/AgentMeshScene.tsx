"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * AgentMeshScene
 *
 * The Mission Detail signature 3D moment for the AI Agent Mesh module:
 *  - 12 agent nodes arranged on a non-trivial graph (not just a circle)
 *  - Edges between communicating agents
 *  - Pulses of light travel between active pairs every few seconds
 *  - User can orbit the camera with drag
 */
export function AgentMeshScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.4, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[6, 6, 6]} intensity={0.7} color="#22d3ee" />
      <Mesh />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}

const AGENT_COUNT = 13;

function Mesh() {
  const groupRef = useRef<THREE.Group>(null);

  const config = useMemo(() => {
    const rng = mulberry32(13);
    // 1 router center + 12 agents distributed on a layered shell
    const positions: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i < AGENT_COUNT - 1; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / (AGENT_COUNT - 1));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.2 + (i % 3) * 0.4;
      positions.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * r,
          Math.cos(phi) * r * 0.8,
          Math.sin(phi) * Math.sin(theta) * r
        )
      );
    }

    // Edges: every agent connects to router (0) + 1-2 nearby siblings
    const edges: Array<[number, number]> = [];
    const seen = new Set<string>();
    const addEdge = (a: number, b: number) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(k)) return;
      seen.add(k);
      edges.push([a, b]);
    };
    for (let i = 1; i < AGENT_COUNT; i++) {
      addEdge(0, i);
      // Connect to 1-2 nearest agents (excluding router)
      const dists = positions
        .map((p, j) => ({ j, d: j === 0 || j === i ? Infinity : p.distanceTo(positions[i]) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      dists.forEach(({ j }) => addEdge(i, j));
    }

    // Pulses: short-lived light beads that travel from a→b along an edge
    const pulseCount = 14;
    const pulses = Array.from({ length: pulseCount }).map(() => ({
      edgeIdx: Math.floor(rng() * edges.length),
      t: rng(),
      dir: rng() > 0.5 ? 1 : -1,
      speed: 0.6 + rng() * 0.6,
    }));

    return { positions, edges, pulses };
  }, []);

  // Edges geometry
  const lineGeo = useMemo(() => {
    const arr = new Float32Array(config.edges.length * 6);
    config.edges.forEach((e, i) => {
      const a = config.positions[e[0]];
      const b = config.positions[e[1]];
      arr.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [config]);

  // Pulses geometry — points buffer that we update per frame
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(config.pulses.length * 3), 3)
    );
    return g;
  }, [config.pulses.length]);

  const pulseAttr = pulseGeo.getAttribute("position") as THREE.BufferAttribute;

  useFrame((_, delta) => {
    // step pulses
    for (let i = 0; i < config.pulses.length; i++) {
      const p = config.pulses[i];
      p.t += delta * p.speed * p.dir;
      if (p.t > 1) {
        p.t = 0;
        p.edgeIdx = Math.floor(Math.random() * config.edges.length);
      } else if (p.t < 0) {
        p.t = 1;
        p.edgeIdx = Math.floor(Math.random() * config.edges.length);
      }
      const e = config.edges[p.edgeIdx];
      const a = config.positions[e[0]];
      const b = config.positions[e[1]];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      const z = a.z + (b.z - a.z) * p.t;
      pulseAttr.setXYZ(i, x, y, z);
    }
    pulseAttr.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </lineSegments>

      {/* Agent nodes */}
      {config.positions.map((p, i) => {
        const isRouter = i === 0;
        return (
          <group key={i} position={[p.x, p.y, p.z]}>
            <mesh>
              <sphereGeometry args={[isRouter ? 0.18 : 0.1, 16, 16]} />
              <meshBasicMaterial
                color={isRouter ? "#FFFFFF" : "#22d3ee"}
              />
            </mesh>
            {/* Halo */}
            <mesh>
              <ringGeometry args={[isRouter ? 0.28 : 0.18, isRouter ? 0.32 : 0.21, 32]} />
              <meshBasicMaterial
                color={isRouter ? "#FFFFFF" : "#22d3ee"}
                transparent
                opacity={isRouter ? 0.5 : 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Pulses traveling between nodes */}
      <points geometry={pulseGeo}>
        <pointsMaterial
          size={0.16}
          color="#67E8F9"
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
