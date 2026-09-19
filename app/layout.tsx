import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth-context'
import Analytics from '@/components/Analytics'
import { cookies } from 'next/headers'
import { isLocale, DEFAULT_LOCALE } from '@/lib/i18n'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = 'https://novaimago.ai'
const DESCRIPTION = 'Turn a few selfies into studio-quality professional headshots with AI. 45+ styles for LinkedIn, your CV and social profiles — ready in about 30 minutes, with a money-back guarantee.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Nova Imago — Professional AI Headshots in Minutes',
    template: '%s | Nova Imago',
  },
  description: DESCRIPTION,
  applicationName: 'Nova Imago',
  keywords: [
    'AI headshots', 'professional headshots', 'AI headshot generator', 'LinkedIn photo',
    'AI portrait', 'AI profile picture', 'business headshots', 'corporate headshots',
    'headshots from selfies', 'AI photoshoot',
  ],
  authors: [{ name: 'Nova Imago' }],
  creator: 'Nova Imago',
  publisher: 'Nova Imago',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Nova Imago',
    title: 'Nova Imago — Professional AI Headshots in Minutes',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Nova Imago — Professional AI headshots in minutes' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nova Imago — Professional AI Headshots in Minutes',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

// Site-brede structured data (Organization + WebSite + SoftwareApplication).
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'Nova Imago',
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/og.png`,
    email: 'support@novaimago.ai',
    description: DESCRIPTION,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Nova Imago',
    description: DESCRIPTION,
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: ['en', 'nl', 'fr', 'de', 'es', 'it', 'pt'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nova Imago',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: SITE,
    description: DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'EUR',
      url: `${SITE}/buy-credits`,
      availability: 'https://schema.org/InStock',
    },
  },
]

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const raw = (await cookies()).get('nova_locale')?.value
  const lang = isLocale(raw) ? raw : DEFAULT_LOCALE

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
