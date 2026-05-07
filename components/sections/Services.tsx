"use client";

import { motion } from "motion/react";
import { stacks, type Stack } from "@/content/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { HudPanel } from "@/components/ui/HudPanel";
import { CtaButton } from "@/components/ui/CtaButton";

export function Services() {
  return (
    <section id="stacks" className="relative bg-[var(--color-void)] py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          code="SEC-04"
          eyebrow="STACKS"
          title={
            <>
              Deployable infrastructure.{" "}
              <span className="text-[var(--color-mid)]">Not pricing tables.</span>
            </>
          }
          description="Six modular stacks I install into operations. Each one ships as a working system, not a pitch deck."
          meta={<StatusPill tone="cyan">{stacks.length} STACKS · READY</StatusPill>}
        />

        <div className="mt-12 grid gap-4">
          {stacks.map((s, i) => (
            <StackRow stack={s} index={i} key={s.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackRow({ stack, index }: { stack: Stack; index: number }) {
  const onInitiate = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (!el) return;
    history.replaceState(null, "", `#contact?stack=${stack.id}`);
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <HudPanel
        code={stack.code}
        tag={
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-[var(--color-mid)]">
            <span className="hidden md:inline">DEPLOY · {stack.deploymentTime.toUpperCase()}</span>
            <StatusPill tone="cyan" pulse={false}>READY</StatusPill>
          </div>
        }
        className="overflow-hidden"
        bodyClassName="grid items-stretch gap-6 md:grid-cols-12"
      >
        {/* Left: title + summary + best for */}
        <div className="md:col-span-5 flex flex-col gap-3 border-b border-[var(--color-grid)] pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            {stack.title}
          </h3>
          <p className="text-[14.5px] leading-relaxed text-[var(--color-mid)]">
            {stack.summary}
          </p>
          <div>
            <div className="text-hud-label mb-1">BEST FOR</div>
            <div className="text-[13.5px] text-[var(--color-hi)]">{stack.bestFor}</div>
          </div>
        </div>

        {/* Middle: parts list — server-rack feel */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="text-hud-label">COMPONENTS</div>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {stack.components.map((c, i) => (
              <li
                key={c}
                className="flex items-center gap-2 border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-2 font-mono text-[12px] text-[var(--color-hi)]"
              >
                <span className="text-[var(--color-cyan)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="text-[var(--color-grid)]">·</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: CTA + meta */}
        <div className="md:col-span-2 flex flex-col items-start justify-between gap-3 md:items-end md:text-right">
          <div className="flex w-full flex-col gap-1 md:items-end">
            <div className="text-hud-label">DEPLOY TIME</div>
            <div className="font-mono text-[14px] text-[var(--color-hi)]">
              {stack.deploymentTime}
            </div>
          </div>
          <CtaButton onClick={onInitiate} href={`#contact?stack=${stack.id}`}>
            Initiate Stack
          </CtaButton>
        </div>
      </HudPanel>
    </motion.div>
  );
}
