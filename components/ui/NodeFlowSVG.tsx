"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/cn";
import type { SystemEdge, SystemNode } from "@/content/systems";

type Props = {
  nodes: SystemNode[];
  edges: SystemEdge[];
  /** SVG viewBox padding for the 0–100 grid the data uses. */
  pad?: number;
  className?: string;
  /** Particles per edge (defaults to 1). */
  particles?: number;
  /** Visual density: 'compact' (cards) or 'detail' (mission detail). */
  density?: "compact" | "detail";
  /** Force animations off (used in mission detail in addition to reduced motion). */
  paused?: boolean;
  /** Optional onClick hook for nodes (mission detail). */
  onNodeHover?: (id: string | null) => void;
};

const NODE_KIND_FILL: Record<NonNullable<SystemNode["kind"]>, string> = {
  trigger: "#FFFFFF",
  process: "#A3A3A3",
  ai: "#22D3EE",
  store: "#A3A3A3",
  output: "#FFFFFF",
};

export function NodeFlowSVG({
  nodes,
  edges,
  pad = 4,
  className,
  particles = 1,
  density = "compact",
  paused = false,
  onNodeHover,
}: Props) {
  const id = useId().replace(/:/g, "");

  // Pre-compute edge geometry for layout-stable rendering.
  const edgeGeom = useMemo(() => {
    const map = new Map(nodes.map((n) => [n.id, n] as const));
    return edges
      .map((e) => {
        const a = map.get(e.from);
        const b = map.get(e.to);
        if (!a || !b) return null;
        return { id: `${e.from}-${e.to}`, ax: a.x, ay: a.y, bx: b.x, by: b.y };
      })
      .filter(Boolean) as Array<{
      id: string;
      ax: number;
      ay: number;
      bx: number;
      by: number;
    }>;
  }, [nodes, edges]);

  const nodeR = density === "detail" ? 1.6 : 1.4;
  const labelOffset = density === "detail" ? 5.5 : 5.5;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${100 + pad * 2} ${100 + pad * 2}`}
      className={cn("h-full w-full overflow-visible", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={`node-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>

        <linearGradient id={`edge-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.85)" />
        </linearGradient>

        {/* Subtle hairline grid behind the diagram */}
        <pattern
          id={`grid-${id}`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.2"
          />
        </pattern>
      </defs>

      <rect
        x={-pad}
        y={-pad}
        width={100 + pad * 2}
        height={100 + pad * 2}
        fill={`url(#grid-${id})`}
      />

      {/* Edges (drawn BEFORE nodes so dots sit on top) */}
      {edgeGeom.map((e) => (
        <g key={e.id}>
          <line
            x1={e.ax}
            y1={e.ay}
            x2={e.bx}
            y2={e.by}
            stroke={`url(#edge-${id})`}
            strokeWidth={density === "detail" ? 0.4 : 0.35}
            strokeDasharray="1.5 1.2"
            strokeDashoffset="0"
            style={
              paused
                ? undefined
                : { animation: "nocz-edge-flow 1.6s linear infinite" }
            }
          />
          {/* Animated particle along the edge */}
          {!paused &&
            Array.from({ length: particles }).map((_, i) => (
              <circle
                key={i}
                r={density === "detail" ? 0.7 : 0.55}
                fill="#22D3EE"
                style={{
                  filter: "drop-shadow(0 0 1.5px rgba(34,211,238,0.8))",
                }}
              >
                <animateMotion
                  dur={`${2 + (i * 0.6) % 1.4}s`}
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                  path={`M ${e.ax} ${e.ay} L ${e.bx} ${e.by}`}
                />
              </circle>
            ))}
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((n) => {
        const fill = n.kind ? NODE_KIND_FILL[n.kind] : "#FFFFFF";
        const isAi = n.kind === "ai";
        return (
          <g
            key={n.id}
            onMouseEnter={() => onNodeHover?.(n.id)}
            onMouseLeave={() => onNodeHover?.(null)}
          >
            {isAi && (
              <circle
                cx={n.x}
                cy={n.y}
                r={nodeR * 3.2}
                fill={`url(#node-glow-${id})`}
                opacity="0.8"
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={nodeR}
              fill={fill}
              stroke={isAi ? "#22D3EE" : "rgba(255,255,255,0.4)"}
              strokeWidth={isAi ? 0.4 : 0.25}
            />
            {/* HUD ring on important nodes */}
            {(n.kind === "trigger" || n.kind === "output" || isAi) && (
              <circle
                cx={n.x}
                cy={n.y}
                r={nodeR * 2.2}
                fill="none"
                stroke={isAi ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.15)"}
                strokeWidth="0.18"
                strokeDasharray="0.8 0.8"
              />
            )}
            {density !== "compact" || true ? (
              <text
                x={n.x}
                y={n.y + labelOffset}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize={density === "detail" ? 2.6 : 2.2}
                fontFamily="var(--font-mono)"
                style={{ letterSpacing: "0.4px", textTransform: "uppercase" }}
              >
                {n.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
