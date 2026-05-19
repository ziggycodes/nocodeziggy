import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nocodeziggy.com";
  const posts = getAllPosts();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
