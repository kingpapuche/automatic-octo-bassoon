import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { COOKIE } from '@/lib/messages/legal'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Nova Imago uses only essential cookies — no advertising or tracking cookies.',
  alternates: { canonical: '/cookie-policy' },
}

export default function CookiePolicyPage() {
  return <LegalLayout page={COOKIE} />
}
