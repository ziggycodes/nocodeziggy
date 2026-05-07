import { cn } from "@/lib/cn";

export function Reticle({
  size = 18,
  pulse = true,
  className,
}: {
  size?: number;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 border border-[var(--color-cyan)]"
        style={{ boxShadow: "0 0 8px var(--color-cyan-glow)" }}
      />
      <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-[var(--color-cyan)]" />
      <span className="absolute left-1/2 bottom-0 h-1.5 w-px -translate-x-1/2 bg-[var(--color-cyan)]" />
      <span className="absolute top-1/2 left-0 h-px w-1.5 -translate-y-1/2 bg-[var(--color-cyan)]" />
      <span className="absolute top-1/2 right-0 h-px w-1.5 -translate-y-1/2 bg-[var(--color-cyan)]" />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-cyan)]",
          pulse && "animate-pulse"
        )}
      />
    </span>
  );
}
