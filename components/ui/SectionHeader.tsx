"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  /** Soft, lowercase or sentence-case eyebrow above the title (e.g. "Work"). */
  eyebrow: string;
  /** Section title — large display text. */
  title: React.ReactNode;
  /** Optional one-liner under the title. */
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
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
          "flex items-center gap-3 text-[12px] tracking-[0.04em] text-[var(--color-mid)]",
          align === "center" && "justify-center"
        )}
      >
        <span
          aria-hidden
          className="h-px w-8 bg-[var(--color-cyan)]"
          style={{ boxShadow: "0 0 6px var(--color-cyan-glow)" }}
        />
        <span>{eyebrow}</span>
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
