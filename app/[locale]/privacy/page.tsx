import { redirect } from 'next/navigation'
import { isLocale } from '@/lib/i18n'

// Legacy-URL: leidt door naar het canonieke, vertaalde privacybeleid (met locale-prefix).
export default async function PrivacyRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${isLocale(locale) ? locale : 'en'}/privacy-policy`)
}
