'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/lib/nav'
import Image from 'next/image'
import HeroCarousel, { type HeroExample } from '@/components/HeroCarousel'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { supabase } from '@/lib/supabase'
import { type Currency, CURRENCY_SYMBOL, TIER_PRICE, TIER_ANCHOR, readCurrencyClient } from '@/lib/currency'
import { useLocale } from '@/lib/useLocale'
import { LANDING } from '@/lib/messages/landing'
import { GUIDES_INDEX } from '@/lib/content/guides'
import {
  Zap, Palette, Gem, Lock, BadgeDollarSign, ShieldCheck,
  Upload, SlidersHorizontal, Download,
  Camera, Star, Sparkles, Check, Menu, X, Play
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [currency, setCurrency] = useState<Currency>('EUR')
  const locale = useLocale()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session))
    return () => subscription.unsubscribe()
  }, [])

  // Munt op basis van cookie (gezet door middleware); taal komt uit de URL-prefix
  useEffect(() => { setCurrency(readCurrencyClient()) }, [])

  const ctaHref = loggedIn ? '/dashboard' : '/login'

  const sym = CURRENCY_SYMBOL[currency]
  const price = TIER_PRICE[currency]
  const anchor = TIER_ANCHOR[currency]
  const anchors = [anchor.starter, anchor.pro, anchor.premium]
  const prices = [price.starter, price.pro, price.premium]

  const t = LANDING[locale]
  const fill = (s: string) => s.replace(/\{sym\}/g, sym).replace(/\{p0\}/g, String(price.starter))

  const stepIcons = [Upload, SlidersHorizontal, Download]
  const featureIcons = [Zap, Palette, Gem, Lock, BadgeDollarSign, ShieldCheck]
  const tierIcons = [Camera, Star, Sparkles]

  const testimonials = [
    { name: 'Leen',   before: '/images/leen-before.jpg',   after: '/images/leen-after.webp' },
    { name: 'Roy',    before: '/images/roy-before.jpg',    after: '/images/roy-after.webp' },
    { name: 'Mims',   before: '/images/mims-before.jpeg',  after: '/images/mims-after.webp' },
    { name: 'Alja',   before: '/images/alja-before.jpg',   after: '/images/alja-after.webp' },
    { name: 'Britt',  before: '/images/britt-before.jpg',  after: '/images/britt-after.webp' },
  ]

  // Hero-carrousel: meerdere voor/na-voorbeelden met thumbnails (BetterPic-stijl)
  const heroExamples: HeroExample[] = [
    { name: 'Nathalie', before: '/images/nathalie-before.jpg', after: '/images/nathalie-after.webp', align: true },
    { name: 'Stijn', before: '/images/stijn-before.jpg', after: '/images/stijn-after.jpg' },
    { name: 'Renata', before: '/images/renata-before.jpg', after: '/images/renata-after.jpg', align: true },
    { name: 'featured', before: '/images/before.jpeg', after: '/images/headshot-42.webp' },
  ]

  const navLinks = [
    { href: '/styles', label: t.nav.browseStyles },
    { href: '#features', label: t.nav.whyUs },
    { href: '#pricing', label: t.nav.plans },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '/blog', label: GUIDES_INDEX[locale].title },
    { href: '#faq', label: t.nav.help },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E8E6E0] z-50">
        <div className="max-w-[1320px] mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-semibold text-[#2D2D2D] tracking-tight">
              Nova Imago
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">{l.label}</Link>
            ))}
            <LanguageSwitcher locale={locale} />
            {loggedIn ? (
              <Link href="/dashboard" className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-105">
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href={ctaHref} className="text-[#5B4E9D] hover:text-[#483A7C] font-semibold transition">{t.nav.login}</Link>
                <Link href={ctaHref} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-105">
                  {t.nav.getStarted}
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F0EEF8] transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#2D2D2D]" /> : <Menu className="w-6 h-6 text-[#2D2D2D]" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAFAF9] border-t border-[#E8E6E0] px-8 py-6 flex flex-col gap-5">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium text-lg transition">{l.label}</Link>
            ))}
            <LanguageSwitcher locale={locale} onChange={() => setMobileMenuOpen(false)} />
            {loggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold text-center transition shadow-md">
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)} className="text-[#5B4E9D] font-semibold text-lg transition">{t.nav.login}</Link>
                <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold text-center transition shadow-md">
                  {t.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="mt-[90px] py-10 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B4A]/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white px-5 py-2.5 rounded-full shadow-lg mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">{t.hero.badge}</span>
              </div>
              <h1 className="font-serif text-[clamp(2rem,4vw,4.5rem)] leading-[1.15] mb-7 text-[#2D2D2D] font-normal tracking-tight">
                {t.hero.title1}<br />
                <span className="italic bg-gradient-to-r from-[#7D6FB8] via-[#3A9B8E] to-[#14B8A6] text-transparent bg-clip-text">{t.hero.title2}</span>
              </h1>
              <p className="text-[1.25rem] text-[#6B6B6B] mb-10 leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href={ctaHref} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
                  {t.hero.ctaPrimary}
                </Link>
                <Link href="#pricing" className="bg-white hover:bg-[#5B4E9D] text-[#5B4E9D] hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition border-2 border-[#5B4E9D] hover:-translate-y-1">
                  {t.hero.ctaSecondary}
                </Link>
              </div>

              {/* Laagdrempelige verken-ingang: gender-first naar de publieke stijlen-showcase (geen login) */}
              <div className="mb-10">
                <p className="text-[#6B6B6B] text-sm mb-3">{t.hero.curious}</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <Link href="/styles?gender=female" className="flex-1 text-center bg-[#F0EEF8] hover:bg-[#5B4E9D] text-[#5B4E9D] hover:text-white px-6 py-3.5 rounded-full font-semibold transition border border-[#5B4E9D]/20">
                    {t.hero.seeWomen}
                  </Link>
                  <Link href="/styles?gender=male" className="flex-1 text-center bg-[#F0EEF8] hover:bg-[#5B4E9D] text-[#5B4E9D] hover:text-white px-6 py-3.5 rounded-full font-semibold transition border border-[#5B4E9D]/20">
                    {t.hero.seeMen}
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                {t.hero.trust.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <span className="text-[#6B6B6B] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center w-full overflow-hidden">
              <div className="w-full max-w-[360px]">
                <HeroCarousel
                  examples={heroExamples}
                  beforeLabel={t.hero.sliderBefore}
                  afterLabel={t.hero.sliderAfter}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Bar */}
      <section className="py-16 px-8 bg-gradient-to-r from-[#5B4E9D] to-[#483A7C] text-white">
        <div className="max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div><h3 className="font-serif text-5xl mb-2">30 min</h3><p className="opacity-90">{t.valueBar.delivery}</p></div>
          <div><h3 className="font-serif text-5xl mb-2">45+</h3><p className="opacity-90">{t.valueBar.styles}</p></div>
          <div><h3 className="font-serif text-5xl mb-2">{sym}{price.starter}</h3><p className="opacity-90">{t.valueBar.startingPrice}</p></div>
          <div><h3 className="font-serif text-5xl mb-2">🛡️</h3><p className="opacity-90">{t.valueBar.guarantee}</p></div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">{t.how.heading}</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">{t.how.sub}</p>
          </div>

          {/* Video — VERVANG dit placeholder-blok door de YouTube-embed zodra de link er is */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D2D2D] to-[#1a1a1a] border border-[#E8E6E0] shadow-xl flex items-center justify-center">
              <div className="text-center text-white/70 px-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-0.5" />
                </div>
                <p className="text-sm font-medium">{t.how.videoTitle}</p>
                <p className="text-xs text-white/40 mt-1">{t.how.videoSoon}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.how.steps.map((item, i) => {
              const Icon = stepIcons[i]
              return (
                <div key={i} className="bg-white p-10 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-3 hover:shadow-xl transition-all duration-300 relative">
                  <div className="absolute top-6 right-8 text-[#E8E6E0] font-serif text-6xl font-bold">{String(i + 1).padStart(2, '0')}</div>
                  <div className="w-14 h-14 bg-[#F0EEF8] rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#5B4E9D]" />
                  </div>
                  <h3 className="text-[1.375rem] font-bold text-[#2D2D2D] mb-4">{item.title}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* REAL RESULTS */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">{t.results.heading}</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">{t.results.sub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((person, i) => (
              <div key={person.name} className="bg-[#FAFAF9] rounded-3xl border border-[#E8E6E0] overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="bg-black/60 text-white text-xs font-semibold px-3 py-2 text-center">{t.results.before}</div>
                  <div className="bg-[#5B4E9D] text-white text-xs font-semibold px-3 py-2 text-center">{t.results.after}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <Image src={person.before} alt={`${person.name} — original selfie before Nova Imago AI headshot`} width={400} height={500} className="w-full h-[280px] object-cover object-top" />
                  </div>
                  <div className="relative">
                    <Image src={person.after} alt={`${person.name} — professional AI headshot generated by Nova Imago`} width={400} height={500} className="w-full h-[280px] object-cover object-top" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                  </div>
                  <p className="text-[#6B6B6B] text-sm italic">&ldquo;{t.results.quotes[i]}&rdquo;</p>
                  <p className="text-[#2D2D2D] font-semibold text-sm mt-2">{person.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={ctaHref} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 inline-block">
              {t.results.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">{t.features.heading}</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">{t.features.sub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, i) => {
              const Icon = featureIcons[i]
              return (
                <div key={i} className="bg-white p-10 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-3 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-[#F0EEF8] rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#5B4E9D]" />
                  </div>
                  <h3 className="text-[1.375rem] font-bold text-[#2D2D2D] mb-4">{fill(feature.title)}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{fill(feature.desc)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-8 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5">{t.pricing.heading}</h2>
            <p className="text-xl text-[#6B6B6B]">{t.pricing.sub}</p>
            <p className="text-base text-[#9B9B9B] mt-2">{t.pricing.note}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.pricing.tiers.map((tier, i) => {
              const Icon = tierIcons[i]
              const highlighted = i === 1
              if (highlighted) {
                return (
                  <div key={i} className="bg-gradient-to-br from-[#5B4E9D] to-[#483A7C] p-8 rounded-[28px] border-2 border-[#D4AF37] text-white relative scale-105 shadow-2xl">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#2D2D2D] px-4 py-1.5 rounded-full text-sm font-bold shadow-md">{t.pricing.bestValue}</div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-[1.5rem] font-bold mb-2">{tier.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{tier.line}</p>
                    <div className="mb-1">
                      <span className="text-white/50 line-through text-lg">{sym}{anchors[i]}</span>
                    </div>
                    <div className="font-serif text-5xl mb-1"><span className="text-2xl font-sans">{sym}</span>{prices[i]}</div>
                    <p className="text-white/60 mb-6 text-sm">{t.pricing.oneTime}</p>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0 stroke-[3]" />
                          <span className="text-white/90 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={ctaHref} className="block w-full bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] text-center py-3.5 rounded-full font-semibold transition">{t.pricing.getStarted}</Link>
                  </div>
                )
              }
              return (
                <div key={i} className="bg-[#FAFAF9] p-8 rounded-[28px] border-2 border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-2 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-[#F0EEF8] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#5B4E9D]" />
                  </div>
                  <h3 className="text-[1.5rem] font-bold mb-2 text-[#2D2D2D]">{tier.name}</h3>
                  <p className="text-[#9B9B9B] text-sm mb-4">{tier.line}</p>
                  <div className="mb-1">
                    <span className="text-[#9B9B9B] line-through text-lg">{sym}{anchors[i]}</span>
                  </div>
                  <div className="font-serif text-5xl mb-1 text-[#2D2D2D]"><span className="text-2xl font-sans">{sym}</span>{prices[i]}</div>
                  <p className="text-[#9B9B9B] mb-6 text-sm">{t.pricing.oneTime}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0 stroke-[3]" />
                        <span className="text-[#6B6B6B] text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={ctaHref} className="block w-full bg-[#5B4E9D] hover:bg-[#483A7C] text-white text-center py-3.5 rounded-full font-semibold transition">{t.pricing.getStarted}</Link>
                </div>
              )
            })}
          </div>

          <div className="mt-12 bg-white border-2 border-[#0D9488]/30 rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-sm">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-3">{t.pricing.guarantee.title}</h3>
            <p className="text-[#6B6B6B] leading-relaxed mb-5">{t.pricing.guarantee.body}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {t.pricing.guarantee.items.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-[#9B9B9B] mt-6 text-sm">{t.pricing.footnote}</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-8 bg-[#FAFAF9]">
        {/* FAQPage structured data (zelfde bron als de zichtbare FAQ -> matcht altijd) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: t.faq.items.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }) }}
        />
        <div className="max-w-[880px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D]">{t.faq.heading}</h2>
          </div>
          <div className="space-y-5">
            {t.faq.items.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-7 border border-[#E8E6E0] hover:border-[#7D6FB8] transition">
                <h3 className="font-semibold text-lg text-[#2D2D2D] mb-3">{faq.q}</h3>
                <p className="text-[#6B6B6B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-gradient-to-br from-[#3A2D63] via-[#5B4E9D] to-[#0D9488] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-[720px] mx-auto relative z-10">
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] mb-7">{t.finalCta.heading}</h2>
          <p className="text-[1.375rem] mb-12 opacity-95">{t.finalCta.sub}</p>
          <Link href={ctaHref} className="inline-block bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] px-10 py-4 rounded-full font-bold text-lg transition shadow-xl hover:scale-105">
            {fill(t.finalCta.cta)}
          </Link>
          <div className="mt-10 inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-7 py-4 rounded-full">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-semibold">{t.finalCta.badge}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-16 px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            <div><h4 className="font-bold mb-5 text-lg">{t.footer.product}</h4><ul className="space-y-3">{['#features', '#pricing', '#how-it-works', '#faq'].map((href, i) => <li key={href}><Link href={href} className="text-white/70 hover:text-white transition">{t.footer.productItems[i]}</Link></li>)}</ul></div>
            <div><h4 className="font-bold mb-5 text-lg">{t.footer.company}</h4><ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-white transition">{t.footer.about}</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-white transition">{GUIDES_INDEX[locale].title}</Link></li>
              <li><a href="mailto:support@novaimago.ai" className="text-white/70 hover:text-white transition">{t.footer.contact}</a></li>
            </ul></div>
            <div><h4 className="font-bold mb-5 text-lg">{t.footer.useCases}</h4><ul className="space-y-3">{t.footer.useCaseItems.map((label) => <li key={label}><Link href="/styles" className="text-white/70 hover:text-white transition">{label}</Link></li>)}</ul></div>
            <div><h4 className="font-bold mb-5 text-lg">{t.footer.legal}</h4><ul className="space-y-3">{['/terms-of-service', '/privacy-policy', '/refund-policy', '/cookie-policy'].map((href, i) => <li key={href}><Link href={href} className="text-white/70 hover:text-white transition">{t.footer.legalItems[i]}</Link></li>)}</ul></div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/60">{t.footer.rights}</div>
        </div>
      </footer>

    </div>
  )
}
