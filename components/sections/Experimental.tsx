"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { experiments, type Experiment } from "@/content/experiments";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { HudPanel } from "@/components/ui/HudPanel";

export function Experimental() {
  return (
    <section id="experimental" className="relative bg-[var(--color-void)] py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      {/* Marquee header */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-12 overflow-hidden border-y border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.4)]"
      >
        <div
          className="flex w-max gap-12 whitespace-nowrap py-2 font-mono text-[11px] tracking-[0.3em] text-[var(--color-mid)]"
          style={{ animation: "nocz-marquee 32s linear infinite" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="text-[var(--color-cyan)]">// CURRENTLY BUILDING</span>
              <span>// LAB FEED</span>
              <span className="text-[#A78BFA]">// EXPERIMENTAL</span>
              <span>// CAUTION : MOVING PARTS</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-16 md:px-10">
        <SectionHeader
          code="SEC-05"
          eyebrow="LAB · EXPERIMENTAL"
          title={
            <>
              Currently building.{" "}
              <span className="text-[var(--color-mid)]">In the open.</span>
            </>
          }
          description="Experiments in motion — half-broken prototypes that earn the right to graduate to a system."
          meta={<StatusPill tone="violet">{experiments.length} ACTIVE</StatusPill>}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {experiments.map((exp, i) => (
            <ExperimentCard exp={exp} key={exp.id} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setProgress(exp.progress), 200 + index * 120);
    return () => clearTimeout(t);
  }, [exp.progress, index]);

  const tone =
    exp.status === "PROTOTYPING"
      ? "amber"
      : exp.status === "ALPHA"
      ? "violet"
      : "cyan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <HudPanel
        code={exp.code}
        tag={
          <div className="flex items-center gap-2">
            <StatusPill tone={tone as any}>{exp.status}</StatusPill>
            <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--color-mid)]">
              {exp.lastUpdate}
            </span>
          </div>
        }
        className="relative"
      >
        {/* WIP stamp diagonal */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-3 top-12 select-none rotate-[8deg] border-2 border-[#A78BFA] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A78BFA] opacity-50"
        >
          WIP
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-[20px] font-medium leading-tight">{exp.title}</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-mid)]">
              {exp.blurb}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {exp.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center border border-[var(--color-grid)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-mid)]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[var(--color-mid)]">
              <span>PROGRESS</span>
              <span className="text-[var(--color-cyan)]">{exp.progress.toString().padStart(2, "0")}%</span>
            </div>
            <div className="mt-2 h-1 w-full bg-[var(--color-grid)] relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[var(--color-cyan)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ boxShadow: "0 0 8px var(--color-cyan-glow)" }}
              />
              {/* Track ticks */}
              <div className="absolute inset-0 flex justify-between px-0.5">
                {Array.from({ length: 11 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-px h-full bg-[color:rgb(255_255_255/0.06)]"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Redacted line for personality */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-mid)]">
            <span className="text-[var(--color-dim)]">NOTE:</span>
            <span className="bg-[color:rgb(255_255_255/0.08)] px-2 py-0.5 line-through opacity-70">
              ████████████████████
            </span>
            <span className="text-[var(--color-mid)]">— internal</span>
          </div>
        </div>
      </HudPanel>
    </motion.div>
  );
}
