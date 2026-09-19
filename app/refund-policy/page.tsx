import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import { REFUND } from '@/lib/messages/legal'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Our profile-worthy guarantee: at least one usable headshot in every order, or your money back.',
  alternates: { canonical: '/refund-policy' },
}

export default function RefundPolicyPage() {
  return <LegalLayout page={REFUND} />
}
