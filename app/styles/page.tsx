'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { STYLE_CATEGORIES } from '@/lib/createStyleCategories'
import StyleThumb from '@/components/StyleThumb'
import { Sparkles, X } from 'lucide-react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

type Gender = 'male' | 'female'

export default function StylesPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [gender, setGender] = useState<Gender>('female')
  const [lightbox, setLightbox] = useState<{ styleId: string; label: string; description: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Ingelogd -> direct naar de create-flow; anders login (die leidt na signup naar de flow + credits).
  const ctaHref = loggedIn ? '/create' : '/login'
  const categories = STYLE_CATEGORIES.filter((c) => c.gender === gender)
  const totalStyles = categories.reduce((n, c) => n + c.styles.length, 0)

  return (
    <div className="min-h-screen bg-[#FAFAF9] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E8E6E0] z-40">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-semibold text-[#2D2D2D] tracking-tight">Nova Imago</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#how-it-works" className="hidden sm:inline text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">How It Works</Link>
            <Link href="/#pricing" className="hidden sm:inline text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">Plans</Link>
            <Link href={ctaHref} className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-6 py-2.5 rounded-full font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5">
              {loggedIn ? 'Create →' : 'Get Started →'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 sm:px-8 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] text-[#2D2D2D] font-normal tracking-tight mb-4">
          Browse every style
        </h1>
        <p className="text-[#6B6B6B] text-lg mb-2">
          {totalStyles}+ professional looks — from boardroom to gala, studio to outdoor.
          Pick your favourites and get a full set of AI headshots from a single photo shoot.
        </p>
        <p className="text-[#9B9B9B] text-sm">Tap any style to see it up close.</p>
      </section>

      {/* Gender toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-white border border-[#E8E6E0] rounded-full p-1 shadow-sm">
          {(['female', 'male'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-7 py-2.5 rounded-full font-semibold text-sm transition ${
                gender === g ? 'bg-[#5B4E9D] text-white shadow' : 'text-[#6B6B6B] hover:text-[#5B4E9D]'
              }`}
            >
              {g === 'female' ? 'For Women' : 'For Men'}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 pb-20">
        {categories.map((cat) => (
          <section key={cat.id} className="mb-14">
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2D2D] font-normal tracking-tight">
                {cat.icon} {cat.name}
              </h2>
              <span className="text-[#9B9B9B] text-sm">{cat.styles.length} styles</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cat.styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setLightbox({ styleId: style.id, label: style.label, description: style.description })}
                  className="group text-left bg-white border border-[#E8E6E0] rounded-2xl p-2.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-[#5B4E9D]/30"
                >
                  <StyleThumb styleId={style.id} icon={style.icon} label={style.label} />
                  <span className="block text-[#2D2D2D] text-sm font-semibold px-1">{style.label}</span>
                  <span className="block text-[#9B9B9B] text-xs px-1 leading-tight">{style.description}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="bg-white border-t border-[#E8E6E0] py-16 px-6 sm:px-8 text-center">
        <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] text-[#2D2D2D] font-normal tracking-tight mb-4">
          Ready to get your headshots?
        </h2>
        <p className="text-[#6B6B6B] mb-8 max-w-xl mx-auto">
          Upload a few photos, pick your styles, and get studio-quality headshots in ~30 minutes.
        </p>
        <Link href={ctaHref} className="inline-block bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-9 py-4 rounded-full font-semibold text-lg transition shadow-md hover:shadow-lg hover:-translate-y-0.5">
          Create your headshots →
        </Link>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-11 right-0 text-white/80 hover:text-white flex items-center gap-1 text-sm"
            >
              Close <X className="w-5 h-5" />
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${SUPABASE_URL}/storage/v1/object/public/headshots/style-examples/${lightbox.styleId}.webp`}
                alt={lightbox.label}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-5">
                <h3 className="font-serif text-xl text-[#2D2D2D] mb-1">{lightbox.label}</h3>
                <p className="text-[#6B6B6B] text-sm mb-4">{lightbox.description}</p>
                <Link href={ctaHref} className="block text-center bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-6 py-3 rounded-full font-semibold transition">
                  Create your headshots →
                </Link>
                <p className="text-[#9B9B9B] text-[11px] text-center mt-2">Example — your photos will feature your own face.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
