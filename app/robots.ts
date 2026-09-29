import type { MetadataRoute } from "next";

const BASE_URL = "https://etsy-saas-tool.vercel.app";

// Keep marketing + the two tool pages crawlable, keep everything that
// only makes sense inside a logged-in account out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/billing",
        "/settings",
        "/my-listings",
        "/listings",
        "/keyword-history",
        "/welcome",
        "/reset-password",
        "/forgot-password",
        "/analytics",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
