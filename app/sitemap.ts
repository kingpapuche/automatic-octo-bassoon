import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n'
import { SITE } from '@/lib/seo'
import { GUIDE_SLUGS } from '@/lib/content/guides'

// Publieke pagina's, per taal, met hreflang-alternates.
const PATHS: { path: string; priority: number; cf: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, cf: 'weekly' },
  { path: '/styles', priority: 0.9, cf: 'weekly' },
  { path: '/buy-credits', priority: 0.8, cf: 'monthly' },
  { path: '/about', priority: 0.6, cf: 'monthly' },
  { path: '/guides', priority: 0.7, cf: 'weekly' },
  ...GUIDE_SLUGS.map((slug) => ({ path: `/guides/${slug}`, priority: 0.7, cf: 'monthly' as const })),
  { path: '/refund-policy', priority: 0.3, cf: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, cf: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, cf: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, cf: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []
  for (const { path, priority, cf } of PATHS) {
    const languages: Record<string, string> = {}
    for (const l of LOCALES) languages[l] = `${SITE}/${l}${path}`
    languages['x-default'] = `${SITE}/en${path}`
    for (const l of LOCALES) {
      entries.push({
        url: `${SITE}/${l}${path}`,
        lastModified: now,
        changeFrequency: cf,
        priority,
        alternates: { languages },
      })
    }
  }
  return entries
}
