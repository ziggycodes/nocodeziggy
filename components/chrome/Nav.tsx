"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { id: "lab", label: "Work" },
  { id: "build", label: "Process" },
  { id: "media", label: "Watch" },
  { id: "experimental", label: "Lab" },
];

export function Nav() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sectionIds = ["hero", ...NAV_ITEMS.map((n) => n.id), "contact"];

    const onScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[var(--z-nav)] flex justify-center px-4 pt-4 transition-all duration-300",
        scrolled && "pt-3"
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.6)] backdrop-blur-md transition-all duration-300",
          scrolled ? "px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.7)]" : "px-3 py-2"
        )}
      >
        <a
          href="#hero"
          onClick={onJump("hero")}
          className="flex items-center pl-2 pr-3 py-1 rounded-full transition-opacity hover:opacity-80"
          aria-label="NoCodeZiggy home"
        >
          <Logo size={20} />
        </a>

        <span aria-hidden className="hidden md:block h-5 w-px bg-[var(--color-grid)]" />

        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={onJump(item.id)}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] tracking-wide transition-colors",
                    isActive ? "text-[var(--color-hi)]" : "text-[var(--color-mid)] hover:text-[var(--color-hi)]"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1 w-1 rounded-full transition-colors",
                      isActive ? "bg-[var(--color-cyan)]" : "bg-[var(--color-dim)]"
                    )}
                    style={isActive ? { boxShadow: "0 0 10px var(--color-cyan-glow)" } : undefined}
                  />
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 -z-[1] rounded-full bg-[color:rgb(255_255_255/0.04)]"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <span aria-hidden className="hidden md:block h-5 w-px bg-[var(--color-grid)] ml-1" />

        <a
          href="#contact"
          onClick={onJump("contact")}
          className="group relative inline-flex items-center gap-2 rounded-full bg-[var(--color-cyan)] px-4 py-1.5 text-[12px] font-medium tracking-[0.04em] text-[var(--color-void)] transition-[transform,filter] hover:brightness-110 active:scale-[0.98]"
          style={{ boxShadow: "0 0 24px var(--color-cyan-glow)" }}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
