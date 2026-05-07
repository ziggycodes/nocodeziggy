"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";

type HudPanelProps = {
  /** Optional small monospace label rendered top-left, e.g. SYS-04 */
  code?: string;
  /** Optional tag rendered top-right (status / kind) */
  tag?: React.ReactNode;
  /** Visually emphasize as 'live' (cyan corner dots) */
  live?: boolean;
  /** Reduce padding for compact use */
  compact?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * A panel with the four-corner-dot motif lifted from the logo.
 * Used for every system module, section header, and overlay.
 */
export function HudPanel({
  code,
  tag,
  live,
  compact,
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
      {/* Corner dots — direct echo of the lockup */}
      <Dot live={live} className="-left-[3px] -top-[3px]" />
      <Dot live={live} className="-right-[3px] -top-[3px]" />
      <Dot live={live} className="-left-[3px] -bottom-[3px]" />
      <Dot live={live} className="-right-[3px] -bottom-[3px]" />

      {(code || tag) && (
        <div
          className={cn(
            "flex items-center justify-between border-b border-[var(--color-grid)] px-4 py-2",
            compact && "px-3 py-1.5"
          )}
        >
          {code ? (
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-mid)]">
              {code}
            </span>
          ) : (
            <span aria-hidden />
          )}
          {tag ? <div className="flex items-center gap-2">{tag}</div> : null}
        </div>
      )}

      <div
        className={cn(
          compact ? "p-4" : "p-5 md:p-6",
          bodyClassName
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

function Dot({ live, className }: { live?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute h-1.5 w-1.5",
        live ? "bg-[var(--color-cyan)]" : "bg-[var(--color-hi)]",
        className
      )}
      style={live ? { boxShadow: "0 0 8px var(--color-cyan-glow)" } : undefined}
    />
  );
}
