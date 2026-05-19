"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { systems, type System } from "@/content/systems";
import { HudPanel } from "@/components/ui/HudPanel";
import { NodeFlowSVG } from "@/components/ui/NodeFlowSVG";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaButton } from "@/components/ui/CtaButton";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { MetricCounter } from "@/components/ui/MetricCounter";
import { profile } from "@/content/profile";
import { contactHref, scrollToContact } from "@/lib/contact-link";
import { getRelatedVideoUrl } from "@/lib/media-link";

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
    <section id="lab" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Work"
          title={
            <>
              Live systems.{" "}
              <span className="text-[var(--color-mid)]">Built, deployed, running.</span>
            </>
          }
          description="A selection of production systems I've designed and shipped. Tap any to open the case study."
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
        className="hover:border-[color:rgb(143_176_214/0.40)] transition-colors"
        bodyClassName="flex flex-col gap-4"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
              {system.category}
            </div>
            <h3 className="text-[20px] font-medium leading-tight">
              {system.title}
            </h3>
          </div>
          <span
            aria-hidden
            className="font-mono text-[var(--color-mid)] text-[18px] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
          >
            ↗
          </span>
        </div>

        {/* Mini diagram */}
        <div className="relative aspect-[16/8] w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 -translate-y-full bg-gradient-to-b from-transparent via-[color:rgb(143_176_214/0.09)] to-transparent transition-transform duration-700 group-hover:translate-y-[400%]"
          />
          <NodeFlowSVG nodes={system.nodes} edges={system.edges} density="compact" />
        </div>

        {/* Tagline */}
        <p className="text-[13.5px] leading-relaxed text-[var(--color-mid)]">
          {system.tagline}
        </p>

        {/* Stack chips (lighter) */}
        <div className="flex flex-wrap gap-1.5">
          {system.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-2 py-0.5 text-[11px] tracking-[0.02em] text-[var(--color-mid)] border border-[var(--color-grid)]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Just the two most impactful metrics */}
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-grid)] pt-4">
          {system.metrics.slice(0, 2).map((m) => (
            <MetricCounter key={m.label} value={m.value} label={m.label} />
          ))}
        </div>

        <a
          href={contactHref(system.contactInterest)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            scrollToContact(system.contactInterest);
          }}
          className="mt-1 text-[13px] text-[var(--color-accent)] hover:underline"
        >
          Want this built for your business? →
        </a>
      </HudPanel>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Case Study overlay (formerly Mission Detail)
   ────────────────────────────────────────────────────────────────────────────── */
function MissionDetail({
  system,
  onClose,
}: {
  system: System;
  onClose: () => void;
}) {
  const videoUrl = getRelatedVideoUrl(system);

  const onJumpContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => scrollToContact(system.contactInterest), 250);
  };

  const triggerDownload = () => {
    const a = document.createElement("a");
    a.href = profile.leadMagnet.filePath;
    a.download = "n8n-lead-gen-template.json";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Case study · ${system.title}`}
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
          bodyClassName="grid gap-6 md:grid-cols-12"
          className="bg-[var(--color-panel)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="absolute right-4 top-4 z-[2] flex h-9 w-9 items-center justify-center text-[var(--color-mid)] transition-colors hover:text-[var(--color-hi)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Left: title + tagline + diagram or 3D mesh */}
          <div className="md:col-span-7 flex flex-col gap-6 pt-2">
            <div>
              <div className="mb-2 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                {system.category}
              </div>
              <h3 className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-[1] tracking-[-0.02em]">
                {system.title}
              </h3>
              <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--color-mid)]">
                {system.tagline}
              </p>
            </div>

            <div className="relative aspect-[16/10] max-h-[46vh] w-full overflow-hidden border border-[var(--color-grid)] bg-[var(--color-void)]">
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
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-grid)] pt-4 sm:grid-cols-4">
              {system.metrics.map((m) => (
                <MetricCounter key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
          </div>

          {/* Right: stack + outcomes */}
          <div className="md:col-span-5 flex flex-col gap-6 pt-2">
            <div>
              <div className="mb-2 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {system.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center border border-[var(--color-grid)] px-2 py-0.5 text-[12px] tracking-[0.02em] text-[var(--color-hi)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                Outcomes
              </div>
              <ul className="space-y-2">
                {system.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-2 text-[14px] text-[var(--color-hi)]"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]"
                      style={{ boxShadow: "0 0 6px var(--color-accent-glow)" }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 flex flex-col gap-4 border-t border-[var(--color-grid)] pt-4">
              <CtaButton
                href={contactHref(system.contactInterest)}
                onClick={onJumpContact as React.MouseEventHandler}
              >
                Want this built for your business?
              </CtaButton>

              {system.leadMagnet && (
                <div>
                  <p className="mb-2 text-[12px] text-[var(--color-mid)]">
                    Download the workflow template
                  </p>
                  <EmailCapture
                    source={`case-study-${system.id}`}
                    mailingList="lead-magnet"
                    submitLabel="Get template"
                    compact
                    onSuccess={triggerDownload}
                  />
                </div>
              )}

              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[var(--color-mid)] hover:text-[var(--color-accent)] transition-colors"
                >
                  See how I built this →
                </a>
              )}
            </div>
          </div>
        </HudPanel>
        <div
          aria-hidden
          className="pointer-events-none sticky bottom-0 -mt-12 h-12 w-full bg-gradient-to-t from-[var(--color-panel)] to-transparent"
        />
      </motion.div>
    </motion.div>
  );
}
