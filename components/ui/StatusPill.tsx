import { cn } from "@/lib/cn";

const TONES = {
  cyan: {
    text: "text-[var(--color-accent)]",
    bg: "bg-[color:rgb(143_176_214/0.10)]",
    border: "border-[color:rgb(143_176_214/0.40)]",
    dot: "bg-[var(--color-accent)]",
    glow: { boxShadow: "0 0 8px var(--color-accent-glow)" },
  },
  violet: {
    text: "text-[#A78BFA]",
    bg: "bg-[color:rgb(167_139_250/0.08)]",
    border: "border-[color:rgb(167_139_250/0.4)]",
    dot: "bg-[#A78BFA]",
    glow: { boxShadow: "0 0 8px rgba(167,139,250,0.3)" },
  },
  amber: {
    text: "text-[#F59E0B]",
    bg: "bg-[color:rgb(245_158_11/0.08)]",
    border: "border-[color:rgb(245_158_11/0.4)]",
    dot: "bg-[#F59E0B]",
    glow: { boxShadow: "0 0 8px rgba(245,158,11,0.3)" },
  },
  neutral: {
    text: "text-[var(--color-mid)]",
    bg: "bg-transparent",
    border: "border-[var(--color-grid)]",
    dot: "bg-[var(--color-mid)]",
    glow: undefined,
  },
} as const;

type Tone = keyof typeof TONES;

export function StatusPill({
  tone = "cyan",
  pulse = true,
  children,
  className,
}: {
  tone?: Tone;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        t.text,
        t.bg,
        t.border,
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          t.dot,
          pulse && "animate-pulse"
        )}
        style={t.glow}
      />
      {children}
    </span>
  );
}
