import type { MetadataRoute } from "next";

// Update this if/when a custom domain is connected instead of the
// vercel.app one.
const BASE_URL = "https://etsy-saas-tool.vercel.app";

// Only the pages that are actually worth Google indexing - marketing
// pages and the two AI tools themselves. Private/account pages
// (dashboard, billing, my-listings, ...) are excluded here and also
// blocked in robots.ts, since there's nothing for a search engine to
// usefully show for someone else's account.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/generator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/keyword-research", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
