import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

// Next.js auto-detects this file and serves it as the "add to home
// screen" icon on iOS/Safari - no manual config needed.
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await loadGoogleFont("Fraunces:ital,wght@1,600", "E");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
        }}
      >
        <span
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 120,
            color: "#fdf4ff",
            lineHeight: 1,
          }}
        >
          E
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fontData,
          style: "italic",
          weight: 600,
        },
      ],
    }
  );
}
