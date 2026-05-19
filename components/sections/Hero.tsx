"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { EmailCapture } from "@/components/ui/EmailCapture";
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
        {/* Subtle top gradient wash (premium, low-sat) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 55% at 50% 0%, rgba(143,176,214,0.14) 0%, rgba(0,0,0,0) 55%)",
          }}
        />
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
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
            <div>
              <CyclingHeadline lines={[...profile.hero.headlines]} />
              <Subline text={profile.audience} />
              <CtaRow />
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-10 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 45%, rgba(143,176,214,0.16) 0%, rgba(0,0,0,0) 65%)",
                  }}
                />
                <div className="relative h-[260px] w-[260px] lg:h-[300px] lg:w-[300px] rounded-full border border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.35)] p-1.5 backdrop-blur-md">
                  <div
                    className="h-full w-full rounded-full"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 34px var(--color-accent-glow)" }}
                  >
                    <Image
                      src="/hero/me.png"
                      alt={`${profile.handle} portrait`}
                      width={512}
                      height={512}
                      priority
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  return (
    <span
      className="relative inline-block transition-colors duration-200 ease-out hover:text-[var(--color-accent-soft)]"
    >
      {text}
    </span>
  );
}

function Subline({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.85 }}
      className="mb-12 max-w-[60ch] text-[16px] font-medium leading-relaxed text-[var(--color-mid)] md:text-[18px]"
    >
      {text}
    </motion.p>
  );
}

function CtaRow() {
  const onBuild = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("build");
    if (!el) return;
    const lenis = (window as Window & { __lenis?: { scrollTo: (el: HTMLElement, opts: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.05 }}
      className="flex max-w-[640px] flex-col items-start gap-6"
    >
      <motion.div
        className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
      >
        <CtaButton
          size="lg"
          href={profile.booking.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {profile.booking.shortLabel}
        </CtaButton>
        <CtaButton
          variant="ghost"
          size="lg"
          href={profile.hero.secondaryHref}
          onClick={onBuild as React.MouseEventHandler}
        >
          {profile.hero.secondaryCta}
        </CtaButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="w-full border border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.35)] p-4 backdrop-blur-sm"
      >
        <p className="mb-3 text-[13px] text-[var(--color-mid)]">
          {profile.leadMagnet.cta}
        </p>
        <EmailCapture
          source="hero-lead-magnet"
          mailingList="lead-magnet"
          submitLabel="Get template"
          compact
          onSuccess={triggerDownload}
        />
      </motion.div>
    </motion.div>
  );
}
