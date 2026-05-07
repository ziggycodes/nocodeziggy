import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 360 420" fill="none">
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
      </div>
    ),
    { ...size }
  );
}
