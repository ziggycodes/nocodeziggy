"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINES = [
  "> initializing nocz-os...",
  "> mounting workflow_engine...",
  "> linking agents [12 / 12]...",
  "> [OK] entering operator view",
];

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("nocz-booted") === "1";
    } catch {
      // private mode etc.
    }
    if (alreadyBooted) return;

    setShow(true);
    document.body.style.overflow = "hidden";

    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStage(i + 1), 220 + i * 220));
    });
    timers.push(
      window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
        try {
          sessionStorage.setItem("nocz-booted", "1");
        } catch {
          // ignore
        }
      }, 220 + LINES.length * 220 + 600)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[var(--z-boot)] flex flex-col items-center justify-center bg-[var(--color-void)]"
          aria-hidden="true"
        >
          {/* Backdrop hairline grid */}
          <div className="pointer-events-none absolute inset-0 grid-floor opacity-40" />

          {/* HUD corners */}
          {[
            "left-6 top-6",
            "right-6 top-6 rotate-90",
            "left-6 bottom-6 -rotate-90",
            "right-6 bottom-6 rotate-180",
          ].map((pos) => (
            <div key={pos} className={`pointer-events-none absolute ${pos}`}>
              <div className="h-3 w-3 border-l border-t border-[var(--color-grid)]" />
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Logo size={36} />
          </motion.div>

          <div className="w-full max-w-md font-mono text-[12px] leading-[1.9] text-[var(--color-mid)] px-6">
            {LINES.slice(0, stage).map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-center"
              >
                <span className={i === LINES.length - 1 ? "text-[var(--color-cyan)]" : undefined}>
                  {line}
                </span>
                {i === stage - 1 && (
                  <span
                    aria-hidden
                    className="ml-1 inline-block h-3 w-1.5 bg-[var(--color-hi)]"
                    style={{ animation: "nocz-blink 0.8s steps(1) infinite" }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.2em] text-[var(--color-dim)]">
            NOCZ-OS · v.1
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.2em] text-[var(--color-dim)]">
            BOOT-SEQ · 0001
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
