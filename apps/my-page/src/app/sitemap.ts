import type { MetadataRoute } from "next";

import { PROJECTS } from "@/entities/project";
import { getAllPosts } from "@/shared/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.raonrabbit.dev";
  const posts = getAllPosts();

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...PROJECTS.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
