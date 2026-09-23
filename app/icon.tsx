import { ImageResponse } from "next/og";

// Next.js auto-detects this file and serves it as the site's favicon -
// no manual <link> tag or extra config needed anywhere else.
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <div style={{ width: 18, height: 3.4, borderRadius: 2, background: "white" }} />
          <div style={{ width: 12, height: 3.4, borderRadius: 2, background: "white" }} />
          <div style={{ width: 18, height: 3.4, borderRadius: 2, background: "white" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
