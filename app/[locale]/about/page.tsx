import type { Metadata } from 'next'
import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import { isLocale } from '@/lib/i18n'
import { altLanguages } from '@/lib/seo'
import { SEO_META } from '@/lib/messages/seoMeta'
import { ABOUT } from '@/lib/messages/about'

const PATH = '/about'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'en'
  const m = SEO_META[loc].about
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${loc}${PATH}`, languages: altLanguages(PATH) },
    openGraph: { title: `${m.title} | Nova Imago`, description: m.description, url: `/${loc}${PATH}`, images: [`/og-${loc}.png`] },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = ABOUT[isLocale(locale) ? locale : 'en']
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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">{t.title}</h1>
        <p className="text-xl text-[#6B6B6B] mb-12">{t.subtitle}</p>

        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">{t.whatTitle}</h2>
            <p>{t.whatBody}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">{t.whyTitle}</h2>
            <p>{t.whyBody}</p>
          </section>

          <section className="bg-[#F0EEF8] rounded-2xl p-8 border border-[#5B4E9D]/20">
            <h2 className="font-serif text-2xl text-[#5B4E9D] mb-4">{t.promiseTitle}</h2>
            <ul className="list-disc pl-6 space-y-3 text-[#2D2D2D]">
              {t.promise.map((p, i) => (
                <li key={i}><strong>{p.b}</strong> {p.t}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">{t.contactTitle}</h2>
            <p>
              {t.contactPre}
              <a href="mailto:support@novaimago.ai" className="text-[#5B4E9D] underline">support@novaimago.ai</a>{t.contactPost}
            </p>
          </section>

          <div className="pt-4">
            <Link href="/" className="inline-block bg-[#5B4E9D] hover:bg-[#483A7C] text-white px-8 py-3.5 rounded-full font-semibold transition">
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">{t.backLink}</Link>
      </footer>
    </div>
  )
}
