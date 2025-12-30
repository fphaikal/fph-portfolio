import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/blog',
    '/spotify',
    '/projects',
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";
    if (!apiUrl.startsWith("http")) {
      apiUrl = `https://${apiUrl}`;
    }

    const res = await fetch(`${apiUrl}/api/blog`, { cache: "no-store" });
    if (res.ok) {
      const posts: any[] = await res.json();
      const blogRoutes = posts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.created_at).toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
      return [...routes, ...blogRoutes];
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  return [...routes]
}
