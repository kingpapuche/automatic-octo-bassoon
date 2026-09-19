import type { Metadata } from 'next'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'

const DESC = 'Simple one-time pricing for AI headshots — no subscription. Pick a pack, upload a few selfies and get studio-quality headshots in about 30 minutes, backed by a money-back guarantee.'
const PATH = '/buy-credits'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  return {
    title: 'Pricing & Packages',
    description: DESC,
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
    openGraph: { title: 'Pricing & Packages | Nova Imago', description: DESC, url: `/${loc}${PATH}`, images: ['/og.png'] },
  }
}

export default function BuyCreditsLayout({ children }: { children: React.ReactNode }) {
  return children
}
