import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { TERMS } from '@/lib/messages/legal'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms of service for using Nova Imago’s AI headshot service.',
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsOfServicePage() {
  return <LegalLayout page={TERMS} />
}
