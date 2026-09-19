import type { Metadata } from 'next'

const DESC = 'Simple one-time pricing for AI headshots — no subscription. Pick a pack, upload a few selfies and get studio-quality headshots in about 30 minutes, backed by a money-back guarantee.'

export const metadata: Metadata = {
  title: 'Pricing & Packages',
  description: DESC,
  alternates: { canonical: '/buy-credits' },
  openGraph: {
    title: 'Pricing & Packages | Nova Imago',
    description: DESC,
    url: '/buy-credits',
    images: ['/og.png'],
  },
}

export default function BuyCreditsLayout({ children }: { children: React.ReactNode }) {
  return children
}
