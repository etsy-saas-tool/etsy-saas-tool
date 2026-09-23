import { ImageResponse } from "next/og";

// Next.js auto-detects this file and serves it as the "add to home
// screen" icon on iOS/Safari - no manual config needed.
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #c084fc 0%, #9333ea 55%, #6d28d9 100%)",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
