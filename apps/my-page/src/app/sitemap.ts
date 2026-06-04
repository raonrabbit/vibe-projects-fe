import type { MetadataRoute } from "next";
import { PROJECTS } from "@/entities/project";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.raonrabbit.dev";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
