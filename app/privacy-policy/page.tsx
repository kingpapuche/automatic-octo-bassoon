import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { PRIVACY } from '@/lib/messages/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Nova Imago collects, uses and protects your personal data and photos (GDPR-compliant).',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return <LegalLayout page={PRIVACY} />
}
