import type { Metadata } from 'next'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'

const DESC = 'Browse 45+ professional AI headshot styles — from corporate and formal to smart-casual, outdoor and creative. Pick your favourites and get studio-quality headshots from a few selfies.'
const PATH = '/styles'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  return {
    title: 'Browse Every AI Headshot Style',
    description: DESC,
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
    openGraph: { title: 'Browse Every AI Headshot Style | Nova Imago', description: DESC, url: `/${loc}${PATH}`, images: ['/og.png'] },
  }
}

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children
}
