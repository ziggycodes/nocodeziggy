"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { profile } from "@/content/profile";

const HeroLabScene = dynamic(
  () => import("@/components/three/HeroLabScene").then((m) => m.HeroLabScene),
  { ssr: false, loading: () => null }
);

/**
 * Hero — "Boot the Lab"
 *
 * Layered architecture:
 *  - bg layer: 3D R3F scene (or static fallback when reduced motion)
 *  - chrome layer: HUD corners, top status block, side metas, bottom ticker
 *  - foreground: cycling glitch headline + CTAs
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    setReducedMotion(rm);
    setLowPower(small);

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* 3D BG */}
      <div aria-hidden className="absolute inset-0 z-0">
        {!reducedMotion && visible && <HeroLabScene lowPower={lowPower} />}
        {/* Vignette + grid wash */}
        <div className="pointer-events-none absolute inset-0 grid-floor opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 60%, transparent 0%, rgba(0,0,0,0.7) 80%, #000 100%)",
          }}
        />
        {/* Vertical scan tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(34,211,238,0.15) 0 1px, transparent 1px 3px)",
          }}
        />
      </div>

      {/* HUD corner brackets */}
      <Corners />

      {/* TOP HUD STRIP */}
      <div className="absolute left-0 right-0 top-20 z-10 flex justify-between gap-6 px-6 md:top-24 md:px-12">
        <div className="hidden flex-col gap-1 md:flex">
          <div className="text-hud-label">CH_01 // OPERATOR</div>
          <div className="font-mono text-[12px] text-[var(--color-hi)]">{profile.handle}</div>
          <div className="font-mono text-[11px] text-[var(--color-mid)]">{profile.role}</div>
        </div>
        <div className="hidden flex-col gap-1 text-right md:flex">
          <div className="text-hud-label">SYS // STATUS</div>
          <div className="flex justify-end">
            <StatusPill tone="cyan">OPERATIONAL</StatusPill>
          </div>
          <div className="font-mono text-[11px] text-[var(--color-mid)]">
            {profile.hero.statusLine}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 pt-32 pb-32 md:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <Eyebrow />
          <CyclingHeadline lines={[...profile.hero.headlines]} />
          <Subline text={profile.hero.sub} />
          <CtaRow />
        </div>
      </div>

      {/* BOTTOM TICKER */}
      <Ticker items={[...profile.hero.ticker]} />
    </section>
  );
}

function Corners() {
  const positions = [
    { className: "left-6 top-6 md:left-10 md:top-10", rot: "" },
    { className: "right-6 top-6 md:right-10 md:top-10", rot: "rotate-90" },
    { className: "left-6 bottom-6 md:left-10 md:bottom-10", rot: "-rotate-90" },
    { className: "right-6 bottom-6 md:right-10 md:bottom-10", rot: "rotate-180" },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute z-10 ${p.className}`}
        >
          <div className={`relative h-4 w-4 ${p.rot}`}>
            <span className="absolute left-0 top-0 h-px w-full bg-[var(--color-mid)]" />
            <span className="absolute left-0 top-0 h-full w-px bg-[var(--color-mid)]" />
            <span className="absolute -left-[1px] -top-[1px] h-1 w-1 bg-[var(--color-cyan)]" />
          </div>
        </div>
      ))}
    </>
  );
}

function Eyebrow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-6 flex items-center gap-3 text-hud-label"
    >
      <span aria-hidden className="h-1 w-6 bg-[var(--color-cyan)]" style={{ boxShadow: "0 0 6px var(--color-cyan-glow)" }} />
      <span>NOCZ // OPERATOR LAB</span>
      <span aria-hidden className="text-[var(--color-grid)]">/</span>
      <span className="text-[var(--color-mid)]">v.1 · 2026</span>
    </motion.div>
  );
}

function CyclingHeadline({ lines }: { lines: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % lines.length), 4400);
    return () => window.clearInterval(id);
  }, [lines.length]);

  return (
    <h1 className="mb-8 max-w-[18ch] font-bold tracking-[-0.04em] leading-[0.95]">
      <span className="block text-[clamp(2.6rem,7.5vw,6.5rem)]">
        <AnimatePresence mode="wait">
          <motion.span
            key={lines[idx]}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              y: -10,
              filter: "blur(4px)",
              transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
            }}
            className="inline-block bg-clip-text"
          >
            {lines[idx].split(" ").map((word, w) => (
              <motion.span
                key={w + word + idx}
                initial={{ opacity: 0, y: 18 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.05 + w * 0.04 },
                }}
                className="mr-[0.25em] inline-block"
              >
                {/* Glitch-on-hover word */}
                <GlitchWord text={word} />
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}

function GlitchWord({ text }: { text: string }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative inline-block"
    >
      <span className="relative z-[1]">{text}</span>
      {hover && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 text-[var(--color-cyan)] mix-blend-screen pointer-events-none"
            style={{ transform: "translate(-1px, 0)", opacity: 0.85 }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 text-[#A78BFA] mix-blend-screen pointer-events-none"
            style={{ transform: "translate(1px, 0)", opacity: 0.6 }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

function Subline({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.85 }}
      className="mb-12 max-w-[60ch] text-[16px] leading-relaxed text-[var(--color-mid)] md:text-[18px]"
    >
      {text}
    </motion.p>
  );
}

function CtaRow() {
  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.05 }}
      className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
    >
      <CtaButton size="lg" href="#lab" onClick={onJump("lab") as any}>
        Enter The Lab
      </CtaButton>
      <CtaButton variant="ghost" size="lg" href="#media" onClick={onJump("media") as any}>
        Watch Builds
      </CtaButton>
    </motion.div>
  );
}

function Ticker({ items }: { items: string[] }) {
  const all = useMemo(() => [...items, ...items, ...items], [items]);
  return (
    <div
      aria-hidden
      className="absolute bottom-0 left-0 right-0 z-10 border-t border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.6)] backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono tracking-[0.2em] text-[var(--color-mid)] md:px-8">
        <span className="flex shrink-0 items-center gap-2 text-[var(--color-cyan)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          LIVE FEED
        </span>
        <span className="h-3 w-px bg-[var(--color-grid)]" />
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex w-max gap-12 whitespace-nowrap"
            style={{ animation: "nocz-marquee 38s linear infinite" }}
          >
            {all.map((t, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-[var(--color-dim)]">//</span>
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
