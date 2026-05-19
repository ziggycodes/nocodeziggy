import { ImageResponse } from "next/og";

export const size = { width: 1024, height: 1024 };
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1024,
          height: 1024,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="960" height="960" viewBox="-30 0 420 420" fill="none">
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
