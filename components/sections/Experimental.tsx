"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { experiments, type Experiment } from "@/content/experiments";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HudPanel } from "@/components/ui/HudPanel";

const STATUS_LABEL: Record<Experiment["status"], string> = {
  PROTOTYPING: "Prototyping",
  ALPHA: "Alpha",
  TESTING: "Testing",
};

const STATUS_DOT: Record<Experiment["status"], string> = {
  PROTOTYPING: "bg-[#A78BFA]",
  ALPHA: "bg-[#F59E0B]",
  TESTING: "bg-[var(--color-accent)]",
};

export function Experimental() {
  return (
    <section id="experimental" className="relative bg-[var(--color-void)] py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="In the lab"
          title={
            <>
              Currently building.{" "}
              <span className="text-[var(--color-mid)]">In the open.</span>
            </>
          }
          description="Half-formed prototypes that earn their way into the work above."
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <HudPanel className="relative">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[20px] font-medium leading-tight">{exp.title}</h3>
            <div className="flex shrink-0 items-center gap-2 text-[12px] text-[var(--color-mid)]">
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[exp.status]} animate-pulse`} />
              {STATUS_LABEL[exp.status]}
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-[var(--color-mid)]">
            {exp.blurb}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {exp.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center border border-[var(--color-grid)] px-2 py-0.5 text-[11px] tracking-[0.02em] text-[var(--color-mid)]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[12px] tracking-[0.02em] text-[var(--color-mid)]">
              <span>Progress</span>
              <span className="font-mono text-[var(--color-accent)]">
                {exp.progress.toString().padStart(2, "0")}%
              </span>
            </div>
            <div className="mt-2 h-1 w-full bg-[var(--color-grid)] relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[var(--color-accent)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ boxShadow: "0 0 8px var(--color-accent-glow)" }}
              />
            </div>
            <div className="mt-2 text-[11px] text-[var(--color-dim)]">
              Last updated {exp.lastUpdate}
            </div>
          </div>
        </div>
      </HudPanel>
    </motion.div>
  );
}
