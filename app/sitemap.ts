import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Blog Index
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Spotify Page
    {
      url: `${baseUrl}/spotify`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Projects Page 
    // Note: Project page route removed as per previous fix, re-enable if page exists
    // {
    //   url: `${baseUrl}/projects`,
    //   lastModified: currentDate, 
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}
