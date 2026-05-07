"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { systems, type System } from "@/content/systems";
import { HudPanel } from "@/components/ui/HudPanel";
import { StatusPill } from "@/components/ui/StatusPill";
import { NodeFlowSVG } from "@/components/ui/NodeFlowSVG";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaButton } from "@/components/ui/CtaButton";
import { MetricCounter } from "@/components/ui/MetricCounter";
import { cn } from "@/lib/cn";

const AgentMeshScene = dynamic(
  () =>
    import("@/components/three/AgentMeshScene").then((m) => m.AgentMeshScene),
  { ssr: false, loading: () => null }
);

export function SystemsLab() {
  const [active, setActive] = useState<System | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section
      id="lab"
      className="relative py-24 md:py-36"
    >
      {/* faint grid behind content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          code="SEC-01"
          eyebrow="SYSTEMS LAB"
          title={
            <>
              Live systems.{" "}
              <span className="text-[var(--color-mid)]">
                Running. Observable. Yours, when needed.
              </span>
            </>
          }
          description="Each module below is a real production-grade system I've built and shipped. Tap to open mission detail."
          meta={
            <>
              <StatusPill tone="cyan">{systems.length} ACTIVE</StatusPill>
              <span className="text-hud-label">CLICK TO OPEN MISSION</span>
            </>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {systems.map((s, i) => (
            <SystemCard
              key={s.id}
              system={s}
              index={i}
              onOpen={() => setActive(s)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <MissionDetail system={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function SystemCard({
  system,
  index,
  onOpen,
}: {
  system: System;
  index: number;
  onOpen: () => void;
}) {
  const tone =
    system.status === "DEPLOYED"
      ? "cyan"
      : system.status === "ALPHA"
      ? "amber"
      : "violet";

  return (
    <motion.button
      layoutId={`module-${system.id}`}
      onClick={onOpen}
      type="button"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group relative block w-full text-left"
    >
      <HudPanel
        live={system.status === "DEPLOYED"}
        code={system.code}
        tag={
          <>
            <StatusPill tone={tone as any}>{system.status}</StatusPill>
          </>
        }
        className="hover:border-[color:rgb(34_211_238/0.4)] transition-colors"
        bodyClassName="flex flex-col gap-4"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-hud-label mb-1">{system.category}</div>
            <h3 className="text-[20px] font-medium leading-tight">
              {system.title}
            </h3>
          </div>
          <span
            aria-hidden
            className="font-mono text-[var(--color-mid)] text-[18px] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-cyan)]"
          >
            ↗
          </span>
        </div>

        {/* Mini diagram */}
        <div className="relative aspect-[16/8] w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
          {/* scanline shimmer */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 -translate-y-full bg-gradient-to-b from-transparent via-[color:rgb(34_211_238/0.10)] to-transparent transition-transform duration-700 group-hover:translate-y-[400%]"
          />
          <NodeFlowSVG nodes={system.nodes} edges={system.edges} density="compact" />
        </div>

        {/* Tagline */}
        <p className="text-[13.5px] leading-relaxed text-[var(--color-mid)]">
          {system.tagline}
        </p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1.5">
          {system.stack.map((s) => (
            <span
              key={s}
              className="inline-flex items-center border border-[var(--color-grid)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-mid)]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-grid)] pt-4">
          {system.metrics.slice(0, 4).map((m) => (
            <MetricCounter key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      </HudPanel>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Mission Detail overlay
   ────────────────────────────────────────────────────────────────────────────── */
function MissionDetail({
  system,
  onClose,
}: {
  system: System;
  onClose: () => void;
}) {
  const tone =
    system.status === "DEPLOYED"
      ? "cyan"
      : system.status === "ALPHA"
      ? "amber"
      : "violet";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Mission Detail · ${system.title}`}
      className="fixed inset-0 z-[var(--z-overlay)] flex items-stretch overflow-hidden"
    >
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[color:rgb(0_0_0/0.85)] backdrop-blur-md"
      />

      <motion.div
        layoutId={`module-${system.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] m-0 flex w-full flex-col overflow-y-auto md:m-6 md:rounded-none"
      >
        <HudPanel
          live={system.status === "DEPLOYED"}
          code={`${system.code} // MISSION DETAIL`}
          tag={
            <div className="flex items-center gap-3">
              <StatusPill tone={tone as any}>{system.status}</StatusPill>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 border border-[var(--color-grid)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-mid)] hover:border-[var(--color-hi)] hover:text-[var(--color-hi)]"
              >
                CLOSE · ESC
              </button>
            </div>
          }
          bodyClassName="grid gap-8 md:grid-cols-12"
          className="bg-[var(--color-panel)]"
        >
          {/* Left: title + tagline + diagram or 3D mesh */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <div className="text-hud-label mb-2">{system.category}</div>
              <h3 className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-[1] tracking-[-0.02em]">
                {system.title}
              </h3>
              <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--color-mid)]">
                {system.tagline}
              </p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
              {system.hasMesh ? (
                <AgentMeshScene />
              ) : (
                <NodeFlowSVG
                  nodes={system.nodes}
                  edges={system.edges}
                  density="detail"
                  particles={2}
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 80% at 50% 60%, transparent 30%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              {system.hasMesh && (
                <div className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.18em] text-[var(--color-cyan)]">
                  3D · DRAG TO ORBIT
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-grid)] pt-4 sm:grid-cols-4">
              {system.metrics.map((m) => (
                <MetricCounter key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
          </div>

          {/* Right: stack, outcomes, build log */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <div className="text-hud-label mb-2">STACK</div>
              <div className="flex flex-wrap gap-1.5">
                {system.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center border border-[var(--color-grid)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-hi)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-hud-label mb-2">OUTCOMES</div>
              <ul className="space-y-2">
                {system.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-2 text-[14px] text-[var(--color-hi)]"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-cyan)]"
                      style={{ boxShadow: "0 0 6px var(--color-cyan-glow)" }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-hud-label mb-2">BUILD LOG</div>
              <ul className="space-y-3 border-l border-[var(--color-grid)] pl-4">
                {system.buildLog.map((b) => (
                  <li key={b.stamp}>
                    <div className="font-mono text-[11px] text-[var(--color-cyan)]">
                      {b.stamp}
                    </div>
                    <div className="text-[14px] text-[var(--color-mid)]">
                      {b.entry}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <CtaButton
                href={`#contact?stack=${system.id}`}
                onClick={(e: any) => {
                  e.preventDefault();
                  onClose();
                  setTimeout(() => {
                    const el = document.getElementById("contact");
                    if (!el) return;
                    history.replaceState(null, "", `#contact?stack=${system.id}`);
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 250);
                }}
              >
                Initiate Build
              </CtaButton>
            </div>
          </div>
        </HudPanel>
      </motion.div>
    </motion.div>
  );
}

// quiet down unused-import linting
void cn;
