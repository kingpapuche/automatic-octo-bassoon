import type { Metadata } from 'next'
import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'
import { GUIDES, GUIDE_ORDER, GUIDES_INDEX } from '@/lib/content/guides'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const idx = GUIDES_INDEX[loc]
  return {
    title: idx.heading,
    description: idx.intro,
    alternates: { canonical: `/${loc}/guides`, languages: altLanguages('/guides') },
    openGraph: { title: `${idx.heading} | Nova Imago`, description: idx.intro, url: `/${loc}/guides`, images: [`/og-${loc}.png`] },
  }
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const idx = GUIDES_INDEX[loc]
  const slugs = GUIDE_ORDER.filter((s) => GUIDES[s])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="border-b border-[#E8E6E0] bg-white px-8 py-5">
        <div className="max-w-[900px] mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#2D2D2D]">Nova Imago</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-3">{idx.heading}</h1>
        <p className="text-[#6B6B6B] text-lg mb-12">{idx.intro}</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {slugs.map((slug) => {
            const g = GUIDES[slug][loc]
            return (
              <Link
                key={slug}
                href={`/guides/${slug}`}
                className="block bg-white rounded-2xl p-7 border border-[#E8E6E0] hover:border-[#7D6FB8] hover:shadow-lg transition"
              >
                <h2 className="font-serif text-xl text-[#2D2D2D] mb-2">{g.h1}</h2>
                <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-3">{g.intro}</p>
                <span className="inline-block mt-4 text-[#5B4E9D] font-semibold text-sm">{g.ctaText} →</span>
              </Link>
            )
          })}
        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">← Nova Imago</Link>
      </footer>
    </div>
  )
}
