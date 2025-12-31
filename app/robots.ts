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
          '/_next/',
          '/private/',
          '/*.json$',
        ],
      },
      // Block AI training bots (optional but good practice as seen in lab repo)
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot'],
        disallow: '/',
      },
      // Explicitly allow major search engines
      {
        userAgent: ['Googlebot', 'Bingbot', 'YandexBot', 'facebookexternalhit'],
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
