"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type Props = {
  variant?: Variant;
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"a"> &
  React.ComponentPropsWithoutRef<"button">;

/**
 * Tactical CTA. Renders an <a> when href is provided, else <button>.
 * Corner ticks expand outward on hover (echo of HudPanel motif).
 */
export const CtaButton = forwardRef<HTMLElement, Props>(function CtaButton(
  { variant = "primary", size = "md", children, className, href, ...rest },
  ref
) {
  const Comp = (href ? "a" : "button") as any;
  const padding = size === "lg" ? "px-7 py-4 text-[13px]" : "px-5 py-3 text-[12px]";
  const isPrimary = variant === "primary";

  return (
    <Comp
      ref={ref as any}
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-3 font-medium uppercase tracking-[0.18em] transition-[transform,filter,background] active:scale-[0.99]",
        padding,
        isPrimary
          ? "bg-[var(--color-cyan)] text-[var(--color-void)] hover:brightness-110"
          : "bg-transparent text-[var(--color-hi)] border border-[var(--color-grid)] hover:border-[var(--color-hi)]",
        className
      )}
      style={isPrimary ? { boxShadow: "0 0 32px var(--color-cyan-glow)" } : undefined}
      {...rest}
    >
      {/* Corner ticks */}
      <Tick className="-left-[1px] -top-[1px] border-l border-t" primary={isPrimary} />
      <Tick className="-right-[1px] -top-[1px] border-r border-t" primary={isPrimary} />
      <Tick className="-left-[1px] -bottom-[1px] border-l border-b" primary={isPrimary} />
      <Tick className="-right-[1px] -bottom-[1px] border-r border-b" primary={isPrimary} />

      {isPrimary && (
        <span
          aria-hidden
          className="h-1 w-1 rounded-full bg-[var(--color-void)] group-hover:scale-125 transition-transform"
        />
      )}
      <span>{children}</span>
      {!isPrimary && (
        <span
          aria-hidden
          className="font-mono text-[var(--color-cyan)] transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </Comp>
  );
});

function Tick({ className, primary }: { className?: string; primary?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute h-2 w-2 transition-transform duration-200 group-hover:scale-150",
        primary
          ? "border-[color:rgb(0_0_0/0.5)]"
          : "border-[var(--color-cyan)] opacity-0 group-hover:opacity-100",
        className
      )}
    />
  );
}
