import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

// Next.js auto-detects this file and serves it as the site's favicon -
// no manual <link> tag or extra config needed anywhere else.
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 22,
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
