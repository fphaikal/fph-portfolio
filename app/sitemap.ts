import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

interface SitemapPost {
  slug: string;
  created_at?: string;
  updated_at?: string;
}

async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  const baseUrl = apiUrl.startsWith("http") ? apiUrl : `https://${apiUrl}`;

  try {
    const response = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const posts: SitemapPost[] = result.data || result || [];

    return posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${siteConfig.url}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: post.updated_at || post.created_at,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries = await getBlogEntries();

  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/spotify`,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    ...blogEntries,
  ];
}
