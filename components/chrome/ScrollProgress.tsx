"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const MARKERS = [
  { id: "hero", label: "00" },
  { id: "lab", label: "01" },
  { id: "build", label: "02" },
  { id: "media", label: "03" },
  { id: "experimental", label: "04" },
  { id: "contact", label: "05" },
];

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.5, 1] }
    );
    MARKERS.forEach((m) => {
      const el = document.getElementById(m.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-[var(--z-nav)] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <div className="relative h-[60vh] w-px bg-[var(--color-grid)]">
        <span
          className="absolute left-0 top-0 w-px bg-[var(--color-cyan)] transition-[height] duration-150"
          style={{
            height: `${progress * 100}%`,
            boxShadow: "0 0 8px var(--color-cyan-glow)",
          }}
        />
        {MARKERS.map((m, i) => {
          const top = (i / (MARKERS.length - 1)) * 100;
          const isActive = active === m.id;
          return (
            <div
              key={m.id}
              className="absolute -translate-y-1/2"
              style={{ top: `${top}%`, left: -12 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--color-dim)]">
                  {m.label}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    isActive ? "bg-[var(--color-cyan)]" : "bg-[var(--color-dim)]"
                  )}
                  style={isActive ? { boxShadow: "0 0 8px var(--color-cyan-glow)" } : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--color-dim)]">
        {(progress * 100).toFixed(0).padStart(2, "0")}%
      </div>
    </aside>
  );
}
