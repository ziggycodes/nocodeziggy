import { ImageResponse } from "next/og";

export const alt = "NoCodeZiggy — AI Systems & Automation Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000000",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Subtle hairline grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* HUD top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#A3A3A3",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>SYS // OPERATIONAL</span>
          <span>NOCZ-OS · v.1</span>
        </div>

        {/* Lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: 90,
          }}
        >
          <svg width="160" height="190" viewBox="0 0 360 420" fill="none">
            <polygon
              points="180,35 340,125 340,305 180,395 20,305 20,125"
              stroke="#FFFFFF"
              strokeWidth="18"
              fill="none"
              strokeLinejoin="round"
            />
            <path d="M95 120V310" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" />
            <path d="M95 120L255 280" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" />
            <path d="M255 120V310" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" />
            <line x1="145" y1="165" x2="225" y2="165" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="170" y1="225" x2="245" y2="225" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="145" y1="285" x2="210" y2="285" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx="42" cy="140" r="10" fill="#FFFFFF" />
            <circle cx="318" cy="140" r="10" fill="#FFFFFF" />
            <circle cx="42" cy="290" r="10" fill="#FFFFFF" />
            <circle cx="318" cy="290" r="10" fill="#FFFFFF" />
          </svg>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
            <span style={{ color: "#A3A3A3", fontWeight: 400 }}>NoCode</span>
            <span style={{ color: "#FFFFFF" }}>Ziggy</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            marginTop: 60,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            maxWidth: 980,
          }}
        >
          AI systems that work while you sleep.
        </div>

        {/* Cyan accent line */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            alignItems: "center",
            gap: 16,
            color: "#22D3EE",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 80, height: 2, background: "#22D3EE" }} />
          ENTER THE LAB
        </div>

        {/* Bottom corner dots — mirror the logo motif */}
        <div style={{ position: "absolute", left: 32, top: 32, width: 8, height: 8, background: "#FFFFFF", borderRadius: 4 }} />
        <div style={{ position: "absolute", right: 32, top: 32, width: 8, height: 8, background: "#FFFFFF", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 32, bottom: 32, width: 8, height: 8, background: "#FFFFFF", borderRadius: 4 }} />
        <div style={{ position: "absolute", right: 32, bottom: 32, width: 8, height: 8, background: "#FFFFFF", borderRadius: 4 }} />
      </div>
    ),
    { ...size }
  );
}
