import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 360 420" fill="none">
          <polygon
            points="180,35 340,125 340,305 180,395 20,305 20,125"
            stroke="#FFFFFF"
            strokeWidth="22"
            fill="none"
            strokeLinejoin="round"
          />
          <path d="M95 120V310" stroke="#FFFFFF" strokeWidth="32" strokeLinecap="round" />
          <path d="M95 120L255 280" stroke="#FFFFFF" strokeWidth="32" strokeLinecap="round" />
          <path d="M255 120V310" stroke="#FFFFFF" strokeWidth="32" strokeLinecap="round" />
          <circle cx="42" cy="140" r="14" fill="#FFFFFF" />
          <circle cx="318" cy="140" r="14" fill="#FFFFFF" />
          <circle cx="42" cy="290" r="14" fill="#FFFFFF" />
          <circle cx="318" cy="290" r="14" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
