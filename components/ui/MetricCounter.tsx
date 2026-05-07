"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Final value rendered when the count finishes. Strings pass through. */
  value: string;
  label?: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
  /** Animate when entering viewport (default true) */
  whileInView?: boolean;
};

/**
 * Counter that ticks numeric prefixes up. Non-numeric content (e.g. "%", "K", "/mo")
 * is preserved during animation so badges stay visually stable.
 */
export function MetricCounter({
  value,
  label,
  duration = 900,
  className,
  labelClassName,
  whileInView = true,
}: Props) {
  const [out, setOut] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const numericMatch = value.match(/^([\$]?)(\d[\d,.]*)(.*)$/);
    if (!numericMatch) {
      setOut(value);
      return;
    }
    const [, prefix, numericStr, suffix] = numericMatch;
    const target = parseFloat(numericStr.replace(/,/g, ""));
    const decimals = (numericStr.split(".")[1] || "").length;

    const animate = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        const formatted = decimals
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString();
        setOut(`${prefix}${formatted}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
        else setOut(value);
      };
      requestAnimationFrame(tick);
    };

    if (!whileInView) {
      animate();
      return;
    }

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration, whileInView]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <div className="font-mono text-[16px] md:text-[20px] tabular-nums text-[var(--color-hi)]">
        {out}
      </div>
      {label && (
        <div className={cn("text-hud-label", labelClassName)}>{label}</div>
      )}
    </div>
  );
}
