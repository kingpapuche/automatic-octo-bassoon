import { redirect } from 'next/navigation'
import { isLocale } from '@/lib/i18n'

// Legacy-URL: leidt door naar de canonieke, vertaalde voorwaarden (met locale-prefix).
export default async function TermsRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${isLocale(locale) ? locale : 'en'}/terms-of-service`)
}
