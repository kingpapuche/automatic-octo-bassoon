import type { Metadata } from 'next'

const DESC = 'Browse 45+ professional AI headshot styles — from corporate and formal to smart-casual, outdoor and creative. Pick your favourites and get studio-quality headshots from a few selfies.'

export const metadata: Metadata = {
  title: 'Browse Every AI Headshot Style',
  description: DESC,
  alternates: { canonical: '/styles' },
  openGraph: {
    title: 'Browse Every AI Headshot Style | Nova Imago',
    description: DESC,
    url: '/styles',
    images: ['/og.png'],
  },
}

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children
}
