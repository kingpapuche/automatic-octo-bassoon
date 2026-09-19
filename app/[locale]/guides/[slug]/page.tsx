import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { SITE, altLanguages } from '@/lib/seo'
import { GUIDES, GUIDE_SLUGS, type GuideBlock } from '@/lib/content/guides'

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => GUIDE_SLUGS.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const guide = GUIDES[slug]?.[loc]
  if (!guide) return {}
  const path = `/guides/${slug}`
  return {
    title: guide.h1,
    description: guide.metaDescription,
    alternates: { canonical: `/${loc}${path}`, languages: altLanguages(path) },
    openGraph: {
      type: 'article',
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `/${loc}${path}`,
      images: [`/og-${loc}.png`],
    },
  }
}

function renderBlock(b: GuideBlock, i: number) {
  switch (b.t) {
    case 'h2':
      return <h2 key={i} className="font-serif text-2xl text-[#2D2D2D] mt-10 mb-4">{b.text}</h2>
    case 'p':
      return <p key={i} className="mb-4">{b.text}</p>
    case 'ul':
      return <ul key={i} className="list-disc pl-6 space-y-2 mb-4">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
    case 'ol':
      return <ol key={i} className="list-decimal pl-6 space-y-2 mb-4">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ol>
  }
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const guide = GUIDES[slug]?.[loc]
  if (!guide) notFound()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    inLanguage: loc,
    image: `${SITE}/og-${loc}.png`,
    mainEntityOfPage: `${SITE}/${loc}/guides/${slug}`,
    publisher: { '@type': 'Organization', name: 'Nova Imago', logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <nav className="border-b border-[#E8E6E0] bg-white px-8 py-5">
        <div className="max-w-[820px] mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#2D2D2D]">Nova Imago</span>
          </Link>
        </div>
      </nav>

      <article className="max-w-[820px] mx-auto px-8 py-16 text-[#4B4B4B] leading-relaxed">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#2D2D2D] mb-6">{guide.h1}</h1>
        <p className="text-lg text-[#2D2D2D] mb-2">{guide.intro}</p>
        {guide.blocks.map((b, i) => renderBlock(b, i))}

        <div className="mt-12 bg-[#F0EEF8] border border-[#5B4E9D]/20 rounded-2xl p-8 text-center">
          <Link href="/buy-credits" className="inline-block bg-[#5B4E9D] hover:bg-[#483A7C] text-white px-8 py-3.5 rounded-full font-semibold transition">
            {guide.ctaText} →
          </Link>
          <p className="text-[#6B6B6B] text-sm mt-3">{guide.ctaSub}</p>
        </div>
      </article>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">← Nova Imago</Link>
      </footer>
    </div>
  )
}
