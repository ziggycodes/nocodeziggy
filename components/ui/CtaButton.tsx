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
 * Clean primary / ghost CTA. No HUD chrome — just cyan fill or hairline border,
 * with a subtle hover lift + brightening.
 */
export const CtaButton = forwardRef<HTMLElement, Props>(function CtaButton(
  { variant = "primary", size = "md", children, className, href, ...rest },
  ref
) {
  const Comp = (href ? "a" : "button") as any;
  const padding = size === "lg" ? "px-7 py-4 text-[14px]" : "px-5 py-3 text-[13px]";
  const isPrimary = variant === "primary";

  return (
    <Comp
      ref={ref as any}
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 font-medium tracking-[0.02em] transition-[transform,filter,background,border-color,color] duration-200 active:scale-[0.99] hover:-translate-y-px",
        padding,
        isPrimary
          ? "bg-[var(--color-accent)] text-[var(--color-void)] hover:brightness-110"
          : "bg-transparent text-[var(--color-hi)] border border-[var(--color-grid)] hover:border-[var(--color-hi)]",
        className
      )}
      style={isPrimary ? { boxShadow: "0 0 22px var(--color-accent-glow)" } : undefined}
      {...rest}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className={cn(
          "font-mono transition-transform group-hover:translate-x-0.5",
          isPrimary ? "text-[var(--color-void)]" : "text-[var(--color-accent)]"
        )}
      >
        →
      </span>
    </Comp>
  );
});
