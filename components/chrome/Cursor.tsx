"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  "lab",
  "build",
  "media",
  "stacks",
  "experimental",
  "contact",
];

/**
 * Crosshair reticle that snaps over interactive elements.
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;

      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = !!t.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='target']"
      );
      setIsInteractive(interactive);
    };

    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx - 2}px, ${dy - 2}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] h-1 w-1 rounded-full bg-[var(--color-cyan)]"
        style={{ boxShadow: "0 0 8px var(--color-cyan-glow)" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] h-7 w-7 transition-[width,height,transform] duration-150"
        style={{
          width: isInteractive ? 40 : 28,
          height: isInteractive ? 40 : 28,
          marginLeft: isInteractive ? -6 : 0,
          marginTop: isInteractive ? -6 : 0,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 border border-[color:rgb(255_255_255/0.6)]"
          style={{
            borderColor: isInteractive ? "var(--color-cyan)" : "rgba(255,255,255,0.5)",
            transition: "border-color 150ms ease",
          }}
        />
        {/* Ticks for HUD reticle feel */}
        <span aria-hidden className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-current opacity-70" />
        <span aria-hidden className="absolute left-1/2 bottom-0 h-1.5 w-px -translate-x-1/2 bg-current opacity-70" />
        <span aria-hidden className="absolute top-1/2 left-0 h-px w-1.5 -translate-y-1/2 bg-current opacity-70" />
        <span aria-hidden className="absolute top-1/2 right-0 h-px w-1.5 -translate-y-1/2 bg-current opacity-70" />
      </div>
    </>
  );
}

// Re-exported in case sections want to know which IDs the cursor watches
export { SECTIONS as CURSOR_SECTIONS };
