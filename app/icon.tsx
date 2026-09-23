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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
