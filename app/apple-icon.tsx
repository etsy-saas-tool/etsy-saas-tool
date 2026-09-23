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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div style={{ width: 100, height: 18, borderRadius: 9, background: "white" }} />
          <div style={{ width: 66, height: 18, borderRadius: 9, background: "white" }} />
          <div style={{ width: 100, height: 18, borderRadius: 9, background: "white" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
