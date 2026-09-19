import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'
import { GUIDES, GUIDE_ORDER, GUIDES_INDEX, GUIDE_META, GUIDE_TAGS, BLOG_AUTHOR } from '@/lib/content/guides'

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
    alternates: { canonical: `/${loc}/blog`, languages: altLanguages('/blog') },
    openGraph: { title: `${idx.heading} | Nova Imago`, description: idx.intro, url: `/${loc}/blog`, images: [`/og-${loc}.png`] },
  }
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const idx = GUIDES_INDEX[loc]
  const slugs = GUIDE_ORDER.filter((s) => GUIDES[s])
  const fmtDate = (iso: string) => new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="border-b border-[#E8E6E0] bg-white px-8 py-5">
        <div className="max-w-[1100px] mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#2D2D2D]">Nova Imago</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-3">{idx.heading}</h1>
        <p className="text-[#6B6B6B] text-lg mb-12 max-w-[640px]">{idx.intro}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {slugs.map((slug) => {
            const g = GUIDES[slug][loc]
            const meta = GUIDE_META[slug]
            const tags = GUIDE_TAGS[slug]?.[loc] ?? []
            return (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-[#E8E6E0] hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[3/2] bg-[#EDEBE6] overflow-hidden">
                  <Image src={meta.image} alt={g.h1} width={600} height={400} className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-xl text-[#2D2D2D] mb-2 leading-snug">{g.h1}</h2>
                  <div className="flex items-center gap-2 text-[#9B9B9B] text-xs mb-3">
                    <span className="font-medium text-[#6B6B6B]">{BLOG_AUTHOR}</span>
                    <span>·</span>
                    <span>{fmtDate(meta.date)}</span>
                  </div>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-3">{g.intro}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                      <span key={tag} className="text-[11px] text-[#5B4E9D] bg-[#F0EEF8] px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
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
