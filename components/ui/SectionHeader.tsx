"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  /** Index code, e.g. SEC-02 */
  code: string;
  /** Short HUD label, e.g. SYSTEMS LAB */
  eyebrow: string;
  /** Section title — large display text. */
  title: React.ReactNode;
  /** Optional one-liner under the title. */
  description?: React.ReactNode;
  /** Right-side meta block (badges, status, etc.) */
  meta?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  code,
  eyebrow,
  title,
  description,
  meta,
  align = "left",
  className,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex w-full flex-col gap-6",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 text-hud-label",
          align === "center" && "justify-center"
        )}
      >
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-cyan)]" />
          <span>{code}</span>
          <span aria-hidden className="text-[var(--color-grid)]">/</span>
          <span className="text-[var(--color-mid)]">{eyebrow}</span>
        </div>
        {meta && (
          <div className="hidden items-center gap-2 md:flex">{meta}</div>
        )}
      </div>

      <div
        className={cn(
          "grid w-full items-end gap-6 md:grid-cols-12",
          align === "center" && "place-items-center"
        )}
      >
        <h2
          className={cn(
            "md:col-span-8 text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight",
            align === "center" && "max-w-3xl"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "md:col-span-4 text-[var(--color-mid)] text-[15px] leading-relaxed",
              align === "center" && "max-w-2xl"
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div className="h-px w-full bg-[var(--color-grid)]" />
    </motion.div>
  );
}
