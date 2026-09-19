import type { Metadata } from 'next'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'
import { SEO_META } from '@/lib/messages/seoMeta'

const PATH = '/styles'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  const m = SEO_META[loc].styles
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
    openGraph: { title: `${m.title} | Nova Imago`, description: m.description, url: `/${loc}${PATH}`, images: [`/og-${loc}.png`] },
  }
}

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children
}
