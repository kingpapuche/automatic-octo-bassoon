import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { PRIVACY } from '@/lib/messages/legal'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'

const PATH = '/privacy-policy'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  return {
    title: 'Privacy Policy',
    description: 'How Nova Imago collects, uses and protects your personal data and photos (GDPR-compliant).',
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalLayout page={PRIVACY} locale={isLocale(locale) ? locale : 'en'} />
}
