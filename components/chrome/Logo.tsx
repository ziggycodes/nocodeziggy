import { cn } from "@/lib/cn";

type LogoProps = {
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean;
  /** Pixel height of the lockup. Width follows aspect. */
  size?: number;
  className?: string;
  /** Tint override; defaults to currentColor for theming flexibility. */
  color?: string;
};

/**
 * Re-implements public/brand/logo-dark.svg as inline SVG so it can take
 * currentColor and be safely animated. Geometry mirrors the source 1:1.
 */
export function Logo({
  withWordmark = true,
  size = 28,
  className,
  color = "currentColor",
}: LogoProps) {
  if (!withWordmark) {
    return (
      <svg
        height={size}
        viewBox="0 0 360 420"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <polygon
          points="180,35 340,125 340,305 180,395 20,305 20,125"
          stroke={color}
          strokeWidth="18"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M95 120V310" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <path d="M95 120L255 280" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <path d="M255 120V310" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <line x1="145" y1="165" x2="225" y2="165" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="170" y1="225" x2="245" y2="225" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="145" y1="285" x2="210" y2="285" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx="42" cy="140" r="10" fill={color} />
        <circle cx="318" cy="140" r="10" fill={color} />
        <circle cx="42" cy="290" r="10" fill={color} />
        <circle cx="318" cy="290" r="10" fill={color} />
      </svg>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-label="NoCodeZiggy"
    >
      <svg
        height={size}
        viewBox="0 0 360 420"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <polygon
          points="180,35 340,125 340,305 180,395 20,305 20,125"
          stroke={color}
          strokeWidth="18"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M95 120V310" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <path d="M95 120L255 280" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <path d="M255 120V310" stroke={color} strokeWidth="28" strokeLinecap="round" />
        <line x1="145" y1="165" x2="225" y2="165" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="170" y1="225" x2="245" y2="225" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="145" y1="285" x2="210" y2="285" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx="42" cy="140" r="10" fill={color} />
        <circle cx="318" cy="140" r="10" fill={color} />
        <circle cx="42" cy="290" r="10" fill={color} />
        <circle cx="318" cy="290" r="10" fill={color} />
      </svg>
      <span
        className="font-sans tracking-tight leading-none select-none"
        style={{ fontSize: size * 0.68 }}
      >
        <span className="font-normal text-[var(--color-mid)]">NoCode</span>
        <span className="font-medium text-[var(--color-hi)]">Ziggy</span>
      </span>
    </div>
  );
}
