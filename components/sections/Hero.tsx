"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { profile } from "@/content/profile";

const HeroLabScene = dynamic(
  () => import("@/components/three/HeroLabScene").then((m) => m.HeroLabScene),
  { ssr: false, loading: () => null }
);

/**
 * Hero — minimalist, cinematic.
 *
 * Layered architecture:
 *  - bg layer: 3D R3F scene (or static fallback when reduced motion) + soft vignette
 *  - foreground: cycling glitch headline + subline + two CTAs
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
        {/* Soft grid wash + vignette */}
        <div className="pointer-events-none absolute inset-0 grid-floor opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 60%, transparent 0%, rgba(0,0,0,0.7) 80%, #000 100%)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto w-full max-w-[1400px]">
          <CyclingHeadline lines={[...profile.hero.headlines]} />
          <Subline text={profile.hero.sub} />
          <CtaRow />
        </div>
      </div>
    </section>
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
    <h1 className="mb-8 max-w-[22ch] font-bold tracking-[-0.04em] leading-[0.96] md:max-w-[30ch] lg:max-w-[40ch] xl:max-w-[48ch]">
      <span className="block text-[clamp(2.4rem,7vw,6.5rem)]">
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
        See the Work
      </CtaButton>
      <CtaButton variant="ghost" size="lg" href="#media" onClick={onJump("media") as any}>
        Watch
      </CtaButton>
    </motion.div>
  );
}
