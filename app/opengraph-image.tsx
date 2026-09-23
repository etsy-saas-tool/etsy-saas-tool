import { ImageResponse } from "next/og";

// Next.js auto-detects this file and uses it as the preview image when
// your link is shared on WhatsApp, Facebook, LinkedIn, iMessage, etc.
// No manual meta tag needed anywhere else.
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070711",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, #c084fc 0%, #9333ea 55%, #6d28d9 100%)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 9,
            }}
          >
            <div style={{ width: 34, height: 6, borderRadius: 3, background: "white" }} />
            <div style={{ width: 22, height: 6, borderRadius: 3, background: "white" }} />
            <div style={{ width: 34, height: 6, borderRadius: 3, background: "white" }} />
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
          Etsy<span style={{ color: "#c084fc" }}>AI</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 16,
          }}
        >
          AI-Powered Etsy SEO &amp; Listing Generator
        </div>
      </div>
    ),
    { ...size }
  );
}
