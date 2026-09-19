import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { SITE, altLanguages } from '@/lib/seo'
import { Fragment } from 'react'
import { GUIDES, GUIDE_META, GUIDE_TAGS, GUIDE_INLINE, BLOG_AUTHOR, isPublished, publishedSlugs, type GuideBlock } from '@/lib/content/guides'

// ISR: geplande artikels worden live zodra hun datum bereikt is.
export const revalidate = 43200

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => publishedSlugs().map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const guide = GUIDES[slug]?.[loc]
  const meta = GUIDE_META[slug]
  if (!guide) return {}
  const path = `/blog/${slug}`
  return {
    title: guide.h1,
    description: guide.metaDescription,
    alternates: { canonical: `/${loc}${path}`, languages: altLanguages(path) },
    openGraph: {
      type: 'article',
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `/${loc}${path}`,
      images: [meta?.image ?? `/og-${loc}.png`],
      publishedTime: meta?.date,
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

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc: Locale = isLocale(locale) ? locale : 'en'
  const guide = GUIDES[slug]?.[loc]
  const meta = GUIDE_META[slug]
  if (!guide || !isPublished(slug)) notFound()
  const tags = GUIDE_TAGS[slug]?.[loc] ?? []
  const inlineImg = GUIDE_INLINE[slug]
  const insertAt = Math.min(2, guide.blocks.length - 1) // inline-foto na het 3e blok
  const fmtDate = (iso: string) => new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    inLanguage: loc,
    image: meta ? `${SITE}${meta.image}` : `${SITE}/og-${loc}.png`,
    datePublished: meta?.date,
    dateModified: meta?.date,
    author: { '@type': 'Organization', name: BLOG_AUTHOR },
    mainEntityOfPage: `${SITE}/${loc}/blog/${slug}`,
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

      <article className="max-w-[820px] mx-auto px-8 py-12 text-[#4B4B4B] leading-relaxed">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#2D2D2D] mb-4">{guide.h1}</h1>
        <div className="flex items-center gap-2 text-[#9B9B9B] text-sm mb-8">
          <span className="font-medium text-[#6B6B6B]">{BLOG_AUTHOR}</span>
          <span>·</span>
          {meta && <span>{fmtDate(meta.date)}</span>}
        </div>

        {meta && (
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-[#EDEBE6] mb-10 shadow-sm">
            <Image src={meta.image} alt={guide.h1} width={900} height={600} className="w-full h-full object-cover object-top" priority />
          </div>
        )}

        <p className="text-lg text-[#2D2D2D] mb-2">{guide.intro}</p>
        {guide.blocks.map((b, i) => (
          <Fragment key={i}>
            {renderBlock(b, i)}
            {inlineImg && i === insertAt && (
              <figure className="my-9">
                <Image src={inlineImg} alt={`${guide.h1} — Nova Imago`} width={760} height={950} className="w-full max-w-[500px] mx-auto rounded-2xl shadow-sm" />
              </figure>
            )}
          </Fragment>
        ))}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-[#5B4E9D] bg-[#F0EEF8] px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        <div className="mt-10 bg-[#F0EEF8] border border-[#5B4E9D]/20 rounded-2xl p-8 text-center">
          <Link href="/buy-credits" className="inline-block bg-[#5B4E9D] hover:bg-[#483A7C] text-white px-8 py-3.5 rounded-full font-semibold transition">
            {guide.ctaText} →
          </Link>
          <p className="text-[#6B6B6B] text-sm mt-3">{guide.ctaSub}</p>
        </div>
      </article>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/blog" className="hover:text-[#5B4E9D] transition">← Nova Imago Blog</Link>
      </footer>
    </div>
  )
}
