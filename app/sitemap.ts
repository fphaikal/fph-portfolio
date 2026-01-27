import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

// Force dynamic rendering to ensure fresh sitemap
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static routes with proper metadata
  const routes = [
    '',
    '/blog',
    '/spotify',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch blog posts with improved error handling
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2026";
    if (!apiUrl.startsWith("http")) {
      apiUrl = `https://${apiUrl}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 second timeout

    const res = await fetch(`${apiUrl}/api/blog`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
      cache: 'no-store', // Ensure fresh data for sitemap
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const posts: any[] = await res.json();

      if (!Array.isArray(posts)) {
        console.warn("[Sitemap] API response is not an array, returning static routes only");
        return [...routes];
      }

      const blogRoutes = posts
        .filter((post) => post.slug && post.created_at) // Filter out invalid posts
        .map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.created_at).toISOString().split('T')[0],
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));

      console.log(`[Sitemap] Generated sitemap with ${routes.length + blogRoutes.length} URLs`);
      return [...routes, ...blogRoutes];
    } else {
      console.warn(`[Sitemap] API returned ${res.status}, returning static routes only`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn("[Sitemap] API request timed out, returning static routes only");
    } else {
      console.error("[Sitemap] Failed to fetch blog posts:", error);
    }
  }

  return [...routes]
}
