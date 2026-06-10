import type { MetadataRoute } from "next";

const SITE_URL = "https://flightrail.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/records`,
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];
}
