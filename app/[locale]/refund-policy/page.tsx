import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { REFUND } from '@/lib/messages/legal'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'

const PATH = '/refund-policy'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  return {
    title: 'Refund Policy',
    description: 'Our profile-worthy guarantee: at least one usable headshot in every order, or your money back.',
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
  }
}

export default async function RefundPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalLayout page={REFUND} locale={isLocale(locale) ? locale : 'en'} />
}
