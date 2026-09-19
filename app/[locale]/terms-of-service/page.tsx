import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { TERMS } from '@/lib/messages/legal'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'
import { SEO_META } from '@/lib/messages/seoMeta'

const PATH = '/terms-of-service'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  const m = SEO_META[loc].terms
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
  }
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalLayout page={TERMS} locale={isLocale(locale) ? locale : 'en'} />
}
