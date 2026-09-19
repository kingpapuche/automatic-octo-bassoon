import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from '@/lib/auth-context'
import Analytics from '@/components/Analytics'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { SITE, altLanguages, OG_LOCALE } from '@/lib/seo'
import { SEO_META } from '@/lib/messages/seoMeta'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const DESCRIPTION = 'Turn a few selfies into studio-quality professional headshots with AI. 45+ styles for LinkedIn, your CV and social profiles — ready in about 30 minutes, with a money-back guarantee.'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const m = SEO_META[loc].home
  return {
    metadataBase: new URL(SITE),
    title: { default: m.title, template: '%s | Nova Imago' },
    description: m.description,
    applicationName: 'Nova Imago',
    keywords: [
      'AI headshots', 'professional headshots', 'AI headshot generator', 'LinkedIn photo',
      'AI portrait', 'AI profile picture', 'business headshots', 'corporate headshots',
      'headshots from selfies', 'AI photoshoot',
    ],
    authors: [{ name: 'Nova Imago' }],
    creator: 'Nova Imago',
    publisher: 'Nova Imago',
    alternates: { canonical: `/${loc}`, languages: altLanguages('') },
    openGraph: {
      type: 'website',
      url: `/${loc}`,
      siteName: 'Nova Imago',
      title: m.title,
      description: m.description,
      images: [{ url: `/og-${loc}.png`, width: 1200, height: 630, alt: m.title }],
      locale: OG_LOCALE[loc],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [`/og-${loc}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  }
}

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`,
    name: 'Nova Imago', url: SITE, logo: `${SITE}/logo.png`, image: `${SITE}/og.png`,
    email: 'support@novaimago.ai', description: DESCRIPTION,
  },
  {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`,
    url: SITE, name: 'Nova Imago', description: DESCRIPTION,
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: ['en', 'nl', 'fr', 'de', 'es', 'it', 'pt'],
  },
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Nova Imago',
    applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', url: SITE, description: DESCRIPTION,
    offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR', url: `${SITE}/buy-credits`, availability: 'https://schema.org/InStock' },
  },
]

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
