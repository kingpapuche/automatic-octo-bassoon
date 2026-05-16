'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

interface StyleOption {
  id: string
  label: string
  description: string
  icon: string
}

interface StyleCategory {
  id: string
  name: string
  icon: string
  gender: 'male' | 'female'
  styles: StyleOption[]
}

// ===========================================
// 74 STIJLEN — 100% synced met app/api/generate/route.ts
// MANNEN: 38 stijlen | VROUWEN: 36 stijlen (w- prefix)
// ===========================================
const STYLE_CATEGORIES: StyleCategory[] = [

  // MANNEN-STIJLEN — 7 categorieën
  {
    id: 'formal',
    name: 'Formal / Corporate Power',
    icon: '👔',
    gender: 'male',
    styles: [
      { id: 'corporate-classic',   label: 'Corporate Classic',  description: 'Navy suit, modern office',   icon: '🏢' },
      { id: 'executive-navy',      label: 'Executive Navy',     description: 'Navy suit, city skyline',    icon: '🌆' },
      { id: 'ceo-black',           label: 'CEO Black',          description: 'Black suit, light gray bg',  icon: '⬛' },
      { id: 'boardroom-charcoal',  label: 'Boardroom Charcoal', description: 'Charcoal suit, modern office', icon: '🪟' },
      { id: 'pinstripe-pro',       label: 'Pinstripe Pro',      description: 'Pinstripe suit + tie',       icon: '📐' },
      { id: 'three-piece',         label: 'Three Piece',        description: 'Three piece suit + vest',    icon: '🎩' },
      { id: 'formal-black-drama',  label: 'Formal Black',       description: 'Black suit, dramatic light', icon: '🖤' },
      { id: 'wall-street-power',   label: 'Wall Street Power',  description: 'Dark suit, red tie, street', icon: '📈' },
    ],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual / Business Modern',
    icon: '🧥',
    gender: 'male',
    styles: [
      { id: 'navy-blazer-open',    label: 'Navy Blazer Open',   description: 'Navy blazer, open collar',  icon: '👕' },
      { id: 'gray-blazer-blue',    label: 'Gray Blazer',        description: 'Gray blazer, blue bg',       icon: '🔵' },
      { id: 'beige-elegance',      label: 'Beige Elegance',     description: 'Beige linen suit',           icon: '🟫' },
      { id: 'teal-blazer',         label: 'Teal Blazer',        description: 'Teal blazer, white tee',     icon: '💎' },
      { id: 'light-blue-blazer',   label: 'Light Blue Blazer',  description: 'Light blue blazer, office',  icon: '💙' },
      { id: 'creative-director',   label: 'Creative Director',  description: 'Black blazer + turtleneck',  icon: '🎨' },
      { id: 'consultant-look',     label: 'Consultant',         description: 'Light gray suit, no tie',    icon: '📋' },
    ],
  },
  {
    id: 'tech-founder',
    name: 'Tech Founder / Sweater',
    icon: '⚡',
    gender: 'male',
    styles: [
      { id: 'tech-turtleneck',     label: 'Tech Turtleneck',    description: 'Gray turtleneck, minimal',   icon: '🤍' },
      { id: 'gray-sweater-pro',    label: 'Gray Sweater Pro',   description: 'Crew neck over collar',      icon: '🧶' },
      { id: 'knit-cozy',           label: 'Knit Cozy',          description: 'Chunky knit, warm light',    icon: '🧣' },
      { id: 'v-neck-smart',        label: 'V-Neck Smart',       description: 'Blue V-neck over collar',    icon: '🔻' },
    ],
  },
  {
    id: 'casual',
    name: 'Casual Professional',
    icon: '👕',
    gender: 'male',
    styles: [
      { id: 'white-button-down',   label: 'White Button-Down',  description: 'Clean white shirt',          icon: '🤍' },
      { id: 'light-blue-oxford',   label: 'Light Blue Oxford',  description: 'Light blue oxford, open',    icon: '💙' },
      { id: 'navy-polo',           label: 'Navy Polo',          description: 'Navy polo, clean bg',        icon: '🔷' },
      { id: 'denim-shirt-fresh',   label: 'Denim Shirt',        description: 'Chambray, white bg',         icon: '👖' },
      { id: 'plaid-friendly',      label: 'Plaid Friendly',     description: 'Plaid button-up, neutral',   icon: '🪵' },
      { id: 'white-tee-clean',     label: 'White Tee Clean',    description: 'Plain white tee, casual',    icon: '⚪' },
      { id: 'black-tee-clean',     label: 'Black Tee Clean',    description: 'Plain black tee, casual',    icon: '⚫' },
      { id: 'henley-relaxed',      label: 'Henley Relaxed',     description: 'Henley, warm window light',  icon: '🪟' },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor / Lifestyle',
    icon: '🌿',
    gender: 'male',
    styles: [
      { id: 'golden-hour',         label: 'Golden Hour',        description: 'Warm tones, sunset light',   icon: '🌅' },
      { id: 'park-natural',        label: 'Park Natural',       description: 'Green park, daylight',       icon: '🌳' },
      { id: 'rooftop-city',        label: 'Rooftop City',       description: 'City skyline, rooftop',      icon: '🏙️' },
      { id: 'city-walk',           label: 'City Walk',          description: 'Walking, urban street',      icon: '🚶' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative / Bold',
    icon: '🎸',
    gender: 'male',
    styles: [
      { id: 'leather-jacket-urban', label: 'Leather Jacket',   description: 'Black leather, urban',       icon: '🧥' },
      { id: 'all-black-minimal',   label: 'All Black Minimal', description: 'All black, dramatic',        icon: '🌑' },
      { id: 'bold-colored-blazer', label: 'Bold Colored Blazer', description: 'Red/emerald blazer',       icon: '🌈' },
    ],
  },
  {
    id: 'restaurant-mens',
    name: 'Restaurant / Date Night',
    icon: '🍷',
    gender: 'male',
    styles: [
      { id: 'restaurant-elegant',   label: 'Restaurant Elegant', description: 'Upscale restaurant, candlelit', icon: '🕯️' },
      { id: 'wine-bar-relaxed',     label: 'Wine Bar Relaxed',   description: 'At wine bar, warm light',    icon: '🍷' },
      { id: 'coffee-shop-date',     label: 'Coffee Shop Date',   description: 'Coffee shop, ambient',       icon: '☕' },
      { id: 'rooftop-bar-evening',  label: 'Rooftop Bar Evening', description: 'City lights, evening',      icon: '🌃' },
    ],
  },

  // VROUWEN-STIJLEN — 7 categorieën (w- prefix)
  {
    id: 'w-formal',
    name: 'Formal / Corporate Power',
    icon: '💼',
    gender: 'female',
    styles: [
      { id: 'w-power-blazer-navy',   label: 'Navy Power Blazer', description: 'Navy blazer, white blouse', icon: '🔷' },
      { id: 'w-executive-charcoal',  label: 'Executive Charcoal', description: 'Charcoal suit, modern',    icon: '🪟' },
      { id: 'w-ceo-black',           label: 'CEO Black',         description: 'Black blazer, powerful',     icon: '⬛' },
      { id: 'w-pinstripe-pro',       label: 'Pinstripe Pro',     description: 'Pinstripe blazer, silk',     icon: '📐' },
      { id: 'w-sheath-classic',      label: 'Sheath Dress',      description: 'Black sheath, refined',      icon: '🖤' },
      { id: 'w-pussybow-elegant',    label: 'Pussybow Elegant',  description: 'Silk blouse, tweed',         icon: '🎀' },
    ],
  },
  {
    id: 'w-smart-casual',
    name: 'Smart Casual / Business Modern',
    icon: '🧥',
    gender: 'female',
    styles: [
      { id: 'w-cream-blazer-arms',   label: 'Cream Blazer',      description: 'Cream blazer + tee',         icon: '🟡' },
      { id: 'w-turtleneck-blazer',   label: 'Turtleneck + Blazer', description: 'Black turtleneck + gray',  icon: '🖤' },
      { id: 'w-silk-blouse-modern',  label: 'Silk Blouse',       description: 'Navy silk, modern office',   icon: '💙' },
      { id: 'w-cardigan-soft',       label: 'Cardigan Soft',     description: 'Beige cardigan, warm',       icon: '🧶' },
      { id: 'w-knit-twinset',        label: 'Knit Twinset',      description: 'Matching knit, neutral',     icon: '🌾' },
      { id: 'w-startup-casual',      label: 'Startup Casual',    description: 'Light blue shirt, modern',   icon: '🚀' },
    ],
  },
  {
    id: 'w-creative',
    name: 'Creative / Bold',
    icon: '🌈',
    gender: 'female',
    styles: [
      { id: 'w-red-power-suit',      label: 'Red Power Suit',    description: 'Red blazer, statement',      icon: '🔴' },
      { id: 'w-emerald-blazer',      label: 'Emerald Blazer',    description: 'Green blazer, bold',         icon: '💚' },
      { id: 'w-mustard-creative',    label: 'Mustard Creative',  description: 'Mustard silk, artistic',     icon: '🟡' },
      { id: 'w-statement-coral',     label: 'Statement Coral',   description: 'Coral blazer, vibrant',      icon: '🪸' },
      { id: 'w-jewel-purple',        label: 'Jewel Purple',      description: 'Deep purple, expressive',    icon: '🟣' },
    ],
  },
  {
    id: 'w-casual',
    name: 'Casual / Approachable',
    icon: '👕',
    gender: 'female',
    styles: [
      { id: 'w-white-tee-natural',   label: 'White Tee Nature',  description: 'White tee, green outdoor',   icon: '🌿' },
      { id: 'w-cream-sweater-window', label: 'Cream Sweater',    description: 'Soft knit, window light',    icon: '🤍' },
      { id: 'w-denim-shirt-fresh',   label: 'Denim Shirt',       description: 'Chambray, fresh white bg',   icon: '👖' },
      { id: 'w-coffee-shop-warm',    label: 'Coffee Shop Warm',  description: 'Casual sweater, café',       icon: '☕' },
      { id: 'w-park-outdoor',        label: 'Park Outdoor',      description: 'Light blouse, park bg',      icon: '🌳' },
    ],
  },
  {
    id: 'w-outdoor',
    name: 'Outdoor / Lifestyle',
    icon: '🌿',
    gender: 'female',
    styles: [
      { id: 'w-rooftop-golden',      label: 'Rooftop Golden',    description: 'City panorama, golden hour', icon: '🌅' },
      { id: 'w-architectural',       label: 'Architectural',     description: 'Modern architecture bg',     icon: '🏛️' },
      { id: 'w-city-walk',           label: 'City Walk',         description: 'Walking, urban street',      icon: '🚶‍♀️' },
      { id: 'w-beach-professional',  label: 'Beach Professional', description: 'Linen blouse, coastal',     icon: '🏖️' },
    ],
  },
  {
    id: 'w-restaurant',
    name: 'Restaurant / Date Night',
    icon: '🍷',
    gender: 'female',
    styles: [
      { id: 'w-restaurant-elegant',  label: 'Restaurant Elegant', description: 'Silk blouse, candlelit',    icon: '🕯️' },
      { id: 'w-wine-bar-casual',     label: 'Wine Bar Casual',   description: 'At wine bar, warm light',    icon: '🍷' },
      { id: 'w-cocktail-glamour',    label: 'Cocktail Glamour',  description: 'Cocktail dress, evening',    icon: '✨' },
      { id: 'w-cafe-date',           label: 'Café Date',         description: 'Charming cafe interior',     icon: '☕' },
      { id: 'w-rooftop-bar',         label: 'Rooftop Bar',       description: 'Rooftop bar, city lights',   icon: '🌃' },
      { id: 'w-restaurant-evening',  label: 'Restaurant Evening', description: 'Intimate, candlelight',     icon: '🌙' },
      { id: 'w-bistro-warm',         label: 'Bistro Warm',       description: 'Smart casual, bistro',       icon: '🥂' },
    ],
  },
  {
    id: 'w-evening',
    name: 'Evening / Statement',
    icon: '✨',
    gender: 'female',
    styles: [
      { id: 'w-leather-jacket-edge', label: 'Leather Jacket',    description: 'Black leather, edgy',        icon: '🧥' },
      { id: 'w-evening-rooftop',     label: 'Evening Rooftop',   description: 'Black evening top, lights',  icon: '🌃' },
      { id: 'w-night-city-glamour',  label: 'Night City Glamour', description: 'City nightlife, glamorous', icon: '💫' },
    ],
  },
]

export default function CreateStylesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: userData } = await supabase
          .from('users')
          .select('id, credits, gender')
          .eq('id', session.user.id)
          .single()
        if (userData) {
          setUserCredits(userData.credits || 0)
          // Gender komt automatisch uit users tabel (ingevuld bij /upload stap 1)
          if (userData.gender === 'female') {
            setGender('female')
            setExpandedCategory('w-formal')
          } else {
            setGender('male')
            setExpandedCategory('formal')
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const filteredCategories = STYLE_CATEGORIES.filter(c => c.gender === gender)

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory('')
      return
    }
    setExpandedCategory(categoryId)
    setTimeout(() => {
      const el = categoryRefs.current[categoryId]
      if (el) {
        const headerOffset = 160
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 50)
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    )
  }

  const selectAllInCategory = (categoryId: string) => {
    const category = STYLE_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return
    const ids = category.styles.map(s => s.id)
    const allSelected = ids.every(id => selectedStyles.includes(id))
    if (allSelected) {
      setSelectedStyles(prev => prev.filter(id => !ids.includes(id)))
    } else {
      setSelectedStyles(prev => [...new Set([...prev, ...ids])])
    }
  }

  const handleContinue = () => {
    if (selectedStyles.length === 0) return
    sessionStorage.setItem('bestai_styleIds', JSON.stringify(selectedStyles))
    router.push('/create/generate')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const totalStyles = filteredCategories.reduce((acc, c) => acc + c.styles.length, 0)

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <CreateProgressBar currentStep={2} userCredits={userCredits} />

      <div className="pt-[140px] pb-[160px] max-w-[900px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Choose Your Styles</h1>
          <p className="text-gray-400 text-lg">Select the looks you want. Each style = 1 headshot = 1 credit.</p>
          <p className="text-gray-600 text-sm mt-2">{totalStyles} styles available</p>
        </div>

        {/* Gender switcher VERWIJDERD - gender wordt automatisch bepaald via userData.gender */}

        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategory === category.id
            const selectedCount = category.styles.filter(s => selectedStyles.includes(s.id)).length
            const allSelected = selectedCount === category.styles.length

            return (
              <div
                key={category.id}
                ref={el => { categoryRefs.current[category.id] = el }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden scroll-mt-[160px]"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-500 text-sm">{category.styles.length} styles</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedCount > 0 && (
                      <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {selectedCount} selected
                      </span>
                    )}
                    <span className={`text-gray-400 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => selectAllInCategory(category.id)}
                      className={`mb-3 text-sm font-medium px-4 py-1.5 rounded-lg transition ${
                        allSelected
                          ? 'bg-violet-600/20 text-violet-300 hover:bg-violet-600/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {allSelected ? '✓ Deselect All' : 'Select All'}
                    </button>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {category.styles.map((style) => {
                        const isSelected = selectedStyles.includes(style.id)
                        return (
                          <button
                            key={style.id}
                            onClick={() => toggleStyle(style.id)}
                            className={`relative flex flex-col items-center text-center py-4 px-3 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-violet-600/20 border-2 border-violet-500 shadow-lg shadow-violet-500/10'
                                : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <span className="text-2xl mb-2">{style.icon}</span>
                            <span className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {style.label}
                            </span>
                            <span className="text-gray-500 text-xs leading-tight">{style.description}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">{selectedStyles.length}</span>
            <span className="text-gray-400 ml-2">styles selected</span>
            <span className="text-gray-600 mx-2">•</span>
            <span className="text-violet-400 font-semibold">{selectedStyles.length} credits</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/create')}
              className="py-3 px-6 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedStyles.length === 0}
              className={`py-3 px-8 rounded-xl font-bold transition-all duration-300 ${
                selectedStyles.length > 0
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}