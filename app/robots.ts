import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['GPTBot', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
