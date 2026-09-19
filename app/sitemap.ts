import type { MetadataRoute } from 'next'

const SITE = 'https://novaimago.ai'

// Publieke, indexeerbare pagina's. (App-/privé-routes staan bewust niet in de sitemap.)
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/styles', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/buy-credits', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
  ]
  return routes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
