import type { MetadataRoute } from "next";

const SITE_URL = "https://flightrail.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/records"],
      disallow: ["/timer", "/boarding", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
