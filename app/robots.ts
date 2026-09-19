import type { MetadataRoute } from 'next'

const SITE = 'https://novaimago.ai'

// Crawl-regels: publieke marketingpagina's toestaan, privé/app-routes blokkeren.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/gallery',
          '/admin',
          '/create',
          '/upload',
          '/success',
          '/results',
          '/generations',
          '/api',
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
