"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";

type HudPanelProps = {
  /** Reduce padding for compact use */
  compact?: boolean;
  /** Hide the four corner-dot motif (rarely needed; default is to show). */
  noDots?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * A panel with the four-corner-dot motif lifted from the lockup.
 * Used for cards, overlays, and any surface that wants the brand identity tie.
 */
export function HudPanel({
  compact,
  noDots,
  className,
  bodyClassName,
  children,
  ...rest
}: HudPanelProps) {
  return (
    <motion.div
      {...rest}
      className={cn(
        "relative border border-[var(--color-grid)] bg-[var(--color-panel)]",
        className
      )}
    >
      {!noDots && (
        <>
          <Dot className="-left-[3px] -top-[3px]" />
          <Dot className="-right-[3px] -top-[3px]" />
          <Dot className="-left-[3px] -bottom-[3px]" />
          <Dot className="-right-[3px] -bottom-[3px]" />
        </>
      )}

      <div className={cn(compact ? "p-4" : "p-5 md:p-6", bodyClassName)}>
        {children}
      </div>
    </motion.div>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute h-1.5 w-1.5 bg-[var(--color-hi)]",
        className
      )}
    />
  );
}
