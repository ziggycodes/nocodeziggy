"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";

type Station = {
  code: string;
  title: string;
  blurb: string;
  detail: string[];
  glyph: "idea" | "blueprint" | "graph" | "scale";
};

const STATIONS: Station[] = [
  {
    code: "01",
    title: "IDEA",
    blurb: "Capture the messy real-world problem before optimizing anything.",
    detail: [
      "Frame the operator's job to be done",
      "Sketch the smallest end-to-end path",
      "Pick the killer constraint that defines done",
    ],
    glyph: "idea",
  },
  {
    code: "02",
    title: "ARCHITECTURE",
    blurb: "Draft the map. Choose primitives that won't betray you at scale.",
    detail: [
      "Pick orchestration engine (n8n / Make / custom)",
      "Decide datastore + memory + queues",
      "Define observability + retry budgets",
    ],
    glyph: "blueprint",
  },
  {
    code: "03",
    title: "AUTOMATION",
    blurb: "Wire the nodes. Push events. Watch the system come alive.",
    detail: [
      "Build node graph from triggers → outputs",
      "Bake in idempotency + replay safety",
      "Ship the smallest live cut, then iterate",
    ],
    glyph: "graph",
  },
  {
    code: "04",
    title: "SCALE",
    blurb: "Tune for cost, latency, and resilience. Watch the dashboard flatten.",
    detail: [
      "Profile bottlenecks, parallelize hot paths",
      "Cache the expensive thinking",
      "Hand off to the operator with a runbook",
    ],
    glyph: "scale",
  },
];

export function HowIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (reduced || isMobile) return;

    let ctx: any;
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      ctx = gsap.context(() => {
        const totalScroll = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      cleanup = () => {
        ctx?.revert();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section
      id="build"
      ref={sectionRef}
      className="relative bg-[var(--color-void)] py-24 md:py-32 lg:py-0 lg:h-screen lg:overflow-hidden"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:absolute lg:left-0 lg:right-0 lg:top-0 lg:z-10 lg:h-full lg:flex lg:flex-col lg:px-10 lg:py-10">
        <SectionHeader
          code="SEC-02"
          eyebrow="HOW I BUILD"
          title={
            <>
              From idea to running system —{" "}
              <span className="text-[var(--color-mid)]">in four moves.</span>
            </>
          }
          description="Every system I ship goes through the same four-stage pipeline. No mystery, no agency theatrics."
          meta={<StatusPill tone="cyan">PROCESS</StatusPill>}
        />

        <div className="mt-10 hidden lg:flex lg:flex-1 lg:items-center lg:justify-start lg:overflow-hidden">
          <div ref={trackRef} className="relative flex w-max items-stretch gap-10 pr-[20vw]">
            <ConnectorLine />
            {STATIONS.map((s, i) => (
              <StationCard key={s.code} station={s} index={i} pinned />
            ))}
          </div>
        </div>

        {/* Mobile / no-scroll fallback: vertical stack */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:hidden">
          {STATIONS.map((s, i) => (
            <StationCard key={s.code} station={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StationCard({
  station,
  index,
  pinned,
}: {
  station: Station;
  index: number;
  pinned?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={
        pinned
          ? "relative w-[78vw] min-w-[78vw] max-w-[640px] flex-shrink-0 lg:w-[42vw] lg:min-w-[42vw]"
          : "relative w-full"
      }
    >
      <div className="relative border border-[var(--color-grid)] bg-[var(--color-panel)] p-6 md:p-8">
        {/* corner dots */}
        <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 bg-[var(--color-hi)]" />
        <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 bg-[var(--color-hi)]" />
        <span className="absolute -left-[3px] -bottom-[3px] h-1.5 w-1.5 bg-[var(--color-hi)]" />
        <span className="absolute -right-[3px] -bottom-[3px] h-1.5 w-1.5 bg-[var(--color-hi)]" />

        <div className="flex items-center justify-between text-hud-label">
          <span className="text-[var(--color-cyan)]">PHASE {station.code}</span>
          <span className="text-[var(--color-mid)]">PIPE-NOCZ</span>
        </div>

        <h3 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[0.95]">
          {station.title}
        </h3>

        <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--color-mid)]">
          {station.blurb}
        </p>

        {/* Diagram canvas */}
        <div className="mt-6 aspect-[16/10] w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
          <StationGlyph kind={station.glyph} />
        </div>

        <ul className="mt-6 space-y-2">
          {station.detail.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2 font-mono text-[12px] text-[var(--color-hi)]"
            >
              <span
                aria-hidden
                className="mt-1.5 h-px w-3 shrink-0 bg-[var(--color-cyan)]"
              />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ConnectorLine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[color:rgb(34_211_238/0.4)] to-transparent lg:block"
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Station glyphs — bespoke SVG visualizations per phase
   ────────────────────────────────────────────────────────────────────────────── */
function StationGlyph({ kind }: { kind: Station["glyph"] }) {
  if (kind === "idea") return <IdeaGlyph />;
  if (kind === "blueprint") return <BlueprintGlyph />;
  if (kind === "graph") return <GraphGlyph />;
  return <ScaleGlyph />;
}

function IdeaGlyph() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <motion.rect
        x="20"
        y="20"
        width="60"
        height="60"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.7"
        strokeDasharray="2 2"
        initial={{ rotate: -8, x: 20 }}
        animate={{ rotate: -2, x: 22 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="6"
        fontFamily="var(--font-mono)"
        fill="rgba(255,255,255,0.6)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        IDEA-001
      </motion.text>

      {/* Arrow morph */}
      <motion.path
        d="M 90 50 L 130 50"
        stroke="#22d3ee"
        strokeWidth="0.8"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.path
        d="M 130 50 L 124 46 M 130 50 L 124 54"
        stroke="#22d3ee"
        strokeWidth="0.8"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      />

      {/* Flowchart bud */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={150 + i * 12}
          cy={50 + (i % 2 ? 14 : -14)}
          r="3"
          fill="#FFFFFF"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 + i * 0.12 }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={`l${i}`}
          x1={148}
          y1={50}
          x2={150 + i * 12}
          y2={50 + (i % 2 ? 14 : -14)}
          stroke="rgba(34,211,238,0.6)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ delay: 1.4 + i * 0.1 }}
        />
      ))}
    </svg>
  );
}

function BlueprintGlyph() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <defs>
        <pattern id="bp-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#bp-grid)" />

      {/* Outer hex (logo nod) */}
      <motion.polygon
        points="100,18 150,46 150,94 100,122 50,94 50,46"
        fill="none"
        stroke="rgba(34,211,238,0.5)"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      {/* Dimension lines */}
      <motion.line
        x1="40"
        y1="46"
        x2="40"
        y2="94"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.line
        x1="38"
        y1="46"
        x2="42"
        y2="46"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 0.9 }}
      />
      <motion.line
        x1="38"
        y1="94"
        x2="42"
        y2="94"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 1.0 }}
      />
      <motion.text
        x="32"
        y="73"
        fontSize="4"
        fontFamily="var(--font-mono)"
        fill="rgba(255,255,255,0.5)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        H=48
      </motion.text>

      {/* Annotations */}
      <motion.text x="100" y="74" textAnchor="middle" fontSize="5" fontFamily="var(--font-mono)" fill="rgba(34,211,238,0.8)"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        SYS-CORE
      </motion.text>
    </svg>
  );
}

function GraphGlyph() {
  // 6 nodes, edges, particles
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      {[
        { id: "n1", x: 18, y: 60 },
        { id: "n2", x: 60, y: 30 },
        { id: "n3", x: 60, y: 90 },
        { id: "n4", x: 110, y: 60 },
        { id: "n5", x: 160, y: 30 },
        { id: "n6", x: 160, y: 90 },
      ].map((n, i) => (
        <g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="2.6"
            fill={i === 3 ? "#22d3ee" : "#FFFFFF"}
            stroke={i === 3 ? "#22d3ee" : "rgba(255,255,255,0.4)"}
            strokeWidth="0.4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
          <motion.text
            x={n.x}
            y={n.y + 8}
            textAnchor="middle"
            fontSize="3.4"
            fontFamily="var(--font-mono)"
            fill="rgba(255,255,255,0.55)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.4 }}
          >
            N0{i + 1}
          </motion.text>
        </g>
      ))}

      {/* edges */}
      {[
        ["18,60", "60,30"],
        ["18,60", "60,90"],
        ["60,30", "110,60"],
        ["60,90", "110,60"],
        ["110,60", "160,30"],
        ["110,60", "160,90"],
      ].map(([a, b], i) => (
        <motion.line
          key={i}
          x1={a.split(",")[0]}
          y1={a.split(",")[1]}
          x2={b.split(",")[0]}
          y2={b.split(",")[1]}
          stroke="rgba(34,211,238,0.6)"
          strokeWidth="0.45"
          strokeDasharray="1.5 1.2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ delay: 0.8 + i * 0.08 }}
          style={{ animation: "nocz-edge-flow 2s linear infinite" }}
        />
      ))}

      {/* particles */}
      {[0, 1, 2].map((i) => (
        <circle key={i} r="0.9" fill="#22d3ee">
          <animateMotion
            dur="2.2s"
            begin={`${i * 0.6}s`}
            repeatCount="indefinite"
            path={`M 18 60 L 60 ${i % 2 ? 30 : 90} L 110 60 L 160 ${i % 2 ? 30 : 90}`}
          />
        </circle>
      ))}
    </svg>
  );
}

function ScaleGlyph() {
  // Counters + multipliers fanning out
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      {/* Dashboard box */}
      <motion.rect
        x="20"
        y="40"
        width="60"
        height="40"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.line
        x1="20"
        y1="50"
        x2="80"
        y2="50"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.3"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 0.6 }}
      />
      <motion.text
        x="24"
        y="48"
        fontSize="3"
        fontFamily="var(--font-mono)"
        fill="rgba(255,255,255,0.6)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        OUTPUTS
      </motion.text>
      {/* counters */}
      {[
        { x: 28, y: 64, t: "8.4K" },
        { x: 50, y: 64, t: "94%" },
        { x: 72, y: 64, t: "1.8s" },
      ].map((m, i) => (
        <motion.text
          key={i}
          x={m.x}
          y={m.y}
          fontSize="6"
          fontFamily="var(--font-mono)"
          fill="#22d3ee"
          initial={{ opacity: 0, y: m.y + 4 }}
          whileInView={{ opacity: 1, y: m.y }}
          transition={{ delay: 1 + i * 0.15 }}
        >
          {m.t}
        </motion.text>
      ))}

      {/* Fan-out edges */}
      {[20, 36, 52, 68, 84, 100].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = 110 + Math.cos(rad) * 70;
        const y2 = 60 + Math.sin(rad) * 50 - 10;
        return (
          <motion.line
            key={i}
            x1={110}
            y1={60}
            x2={x2}
            y2={y2}
            stroke="rgba(34,211,238,0.5)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ delay: 1.2 + i * 0.06 }}
          />
        );
      })}

      {[20, 36, 52, 68, 84, 100].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 110 + Math.cos(rad) * 70;
        const cy = 60 + Math.sin(rad) * 50 - 10;
        return (
          <motion.circle
            key={`d${i}`}
            cx={cx}
            cy={cy}
            r="2.2"
            fill="#FFFFFF"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 1.6 + i * 0.06 }}
          />
        );
      })}
      <motion.circle
        cx="110"
        cy="60"
        r="3.2"
        fill="#22d3ee"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 1.0 }}
      />
    </svg>
  );
}
