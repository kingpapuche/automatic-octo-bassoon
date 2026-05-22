'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

const VARIATIONS_PER_STYLE = 4
const ONBOARDING_KEY = 'novaimago_styles_onboarded'

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

const STYLE_CATEGORIES: StyleCategory[] = [

  // MANNEN-STIJLEN
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
    id: 'specialty-poses',
    name: 'Specialty Poses',
    icon: '🧍',
    gender: 'male',
    styles: [
      { id: 'arms-crossed-power',  label: 'Arms Crossed',       description: 'Arms crossed, dark suit',    icon: '💪' },
      { id: 'sitting-confident',   label: 'Sitting Confident',  description: 'Sitting in chair, blazer',   icon: '🪑' },
      { id: 'leaning-elegant',     label: 'Leaning Elegant',    description: 'Leaning casually, modern',   icon: '🚪' },
      { id: 'hands-in-pockets',    label: 'Hands in Pockets',   description: 'Relaxed, urban background',  icon: '🧍' },
      { id: 'thoughtful-pose',     label: 'Thoughtful',         description: 'Hand near chin, intellectual', icon: '🤔' },
      { id: 'holding-tablet',      label: 'Holding Tablet',     description: 'Tablet, modern office',      icon: '📱' },
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

  // VROUWEN-STIJLEN
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
    id: 'w-specialty-poses',
    name: 'Specialty Poses',
    icon: '🧍‍♀️',
    gender: 'female',
    styles: [
      { id: 'w-arms-crossed-power', label: 'Arms Crossed',      description: 'Arms crossed, blazer',       icon: '💪' },
      { id: 'w-sitting-confident',  label: 'Sitting Confident', description: 'Sitting in chair, blazer',   icon: '🪑' },
      { id: 'w-leaning-elegant',    label: 'Leaning Elegant',   description: 'Leaning casually, modern',   icon: '🚪' },
      { id: 'w-hands-relaxed',      label: 'Hands Relaxed',     description: 'Relaxed pose, urban',        icon: '🧍‍♀️' },
      { id: 'w-thoughtful-pose',    label: 'Thoughtful',        description: 'Hand near chin, elegant',    icon: '🤔' },
      { id: 'w-holding-tablet',     label: 'Holding Tablet',    description: 'Tablet, modern office',      icon: '📱' },
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

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'add' | 'remove' }>({
    visible: false,
    message: '',
    type: 'add',
  })

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const maxStyles = Math.floor(userCredits / VARIATIONS_PER_STYLE)
  const totalHeadshots = selectedStyles.length * VARIATIONS_PER_STYLE
  const isOverLimit = selectedStyles.length > maxStyles

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
        const hasOnboarded = localStorage.getItem(ONBOARDING_KEY)
        if (!hasOnboarded) {
          setShowOnboarding(true)
        }
      }
    }
    fetchUser()
  }, [router])

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
  }

  const showToast = (message: string, type: 'add' | 'remove') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ visible: true, message, type })
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 2200)
  }

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

  const toggleStyle = (styleId: string, styleLabel: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        showToast(`Removed ${styleLabel} — −${VARIATIONS_PER_STYLE} photos`, 'remove')
        return prev.filter(id => id !== styleId)
      }
      if (prev.length >= maxStyles) {
        return prev
      }
      showToast(`Added ${styleLabel} — +${VARIATIONS_PER_STYLE} photos`, 'add')
      return [...prev, styleId]
    })
  }

  const selectAllInCategory = (categoryId: string) => {
    const category = STYLE_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return
    const ids = category.styles.map(s => s.id)
    const allSelected = ids.every(id => selectedStyles.includes(id))
    if (allSelected) {
      setSelectedStyles(prev => prev.filter(id => !ids.includes(id)))
      showToast(`Removed ${ids.length} styles — −${ids.length * VARIATIONS_PER_STYLE} photos`, 'remove')
    } else {
      setSelectedStyles(prev => {
        const merged = [...new Set([...prev, ...ids])]
        return merged.slice(0, maxStyles)
      })
      const added = Math.min(ids.length, maxStyles - selectedStyles.length)
      if (added > 0) {
        showToast(`Added ${added} styles — +${added * VARIATIONS_PER_STYLE} photos`, 'add')
      }
    }
  }

  const handleContinue = () => {
    if (selectedStyles.length === 0 || isOverLimit) return
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

  return (
    <div className="min-h-screen bg-[#0a0f1a]">

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0a0f1a] rounded-3xl p-8 max-w-md w-full border border-violet-500/30 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-3">How It Works</h2>
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              Pick the looks you want. Each style gives you <span className="text-violet-300 font-semibold">{VARIATIONS_PER_STYLE} unique photos</span> with different poses, angles &amp; lighting.
            </p>
            <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1</div>
                  <div className="text-xs text-violet-300 uppercase tracking-wider">Style</div>
                </div>
                <span className="text-violet-400 text-2xl font-bold">=</span>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fuchsia-300">{VARIATIONS_PER_STYLE}</div>
                  <div className="text-xs text-fuchsia-300 uppercase tracking-wider">Photos</div>
                </div>
              </div>
              <p className="text-center text-gray-400 text-sm">
                You have <span className="text-white font-semibold">{userCredits} credits</span> = up to <span className="text-violet-300 font-semibold">{maxStyles} styles</span> = <span className="text-fuchsia-300 font-semibold">{maxStyles * VARIATIONS_PER_STYLE} total headshots</span>
              </p>
            </div>
            <button
              onClick={dismissOnboarding}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition shadow-lg shadow-violet-500/25"
            >
              Got it, let's go →
            </button>
          </div>
        </div>
      )}

      <div
        className={`fixed top-24 right-6 z-[90] transition-all duration-300 ${
          toast.visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
          toast.type === 'add'
            ? 'bg-violet-600/90 border-violet-400/50 shadow-violet-500/30'
            : 'bg-gray-700/90 border-gray-500/50'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
            toast.type === 'add' ? 'bg-emerald-500' : 'bg-gray-500'
          }`}>
            {toast.type === 'add' ? '✓' : '−'}
          </div>
          <p className="text-white font-semibold text-sm whitespace-nowrap">{toast.message}</p>
        </div>
      </div>

      <CreateProgressBar currentStep={2} userCredits={userCredits} />

      <div className="pt-[140px] pb-[180px] max-w-[900px] mx-auto px-6">

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Choose Your Styles</h1>
          <p className="text-gray-300 text-lg">
            Pick the looks you want for your headshots
          </p>
        </div>

        <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-2 border-violet-500/40 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                1
              </div>
              <span className="text-white font-bold text-lg">style</span>
            </div>
            <span className="text-violet-300 text-3xl font-bold">=</span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-fuchsia-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                {VARIATIONS_PER_STYLE}
              </div>
              <span className="text-white font-bold text-lg">unique photos</span>
            </div>
          </div>
          <p className="text-center text-violet-200 text-sm mt-3">
            Each style you pick generates {VARIATIONS_PER_STYLE} different variations with unique poses, angles &amp; lighting
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-gray-400 text-sm mb-1">Your plan</p>
            <p className="text-white font-semibold">
              <span className="text-2xl">{userCredits}</span> credits = up to <span className="text-violet-400">{maxStyles} styles</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">You'll receive</p>
            <p className="text-white font-semibold">
              <span className="text-2xl text-violet-400">{maxStyles * VARIATIONS_PER_STYLE}</span> total headshots
            </p>
          </div>
        </div>

        {maxStyles === 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center">
            <p className="text-amber-300 font-semibold mb-2">⚠️ You need credits to generate headshots</p>
            <button
              onClick={() => router.push('/buy-credits')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2 rounded-lg transition"
            >
              Buy Credits →
            </button>
          </div>
        )}

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
                        const isLimitReached = !isSelected && selectedStyles.length >= maxStyles

                        return (
                          <button
                            key={style.id}
                            onClick={() => toggleStyle(style.id, style.label)}
                            disabled={isLimitReached}
                            className={`relative flex flex-col items-center text-center py-4 px-3 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-violet-600/20 border-2 border-violet-500 shadow-lg shadow-violet-500/20'
                                : isLimitReached
                                ? 'bg-white/[0.02] border border-white/5 opacity-40 cursor-not-allowed'
                                : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                          >
                            <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-fuchsia-600 text-white'
                                : 'bg-white/10 text-gray-400'
                            }`}>
                              ×{VARIATIONS_PER_STYLE}
                            </div>

                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}

                            <span className="text-2xl mb-2 mt-2">{style.icon}</span>
                            <span className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {style.label}
                            </span>
                            <span className="text-gray-500 text-xs leading-tight mb-2">{style.description}</span>

                            <div className={`text-[10px] font-semibold uppercase tracking-wider mt-auto px-2 py-1 rounded ${
                              isSelected
                                ? 'bg-violet-500/30 text-violet-200'
                                : 'bg-white/5 text-gray-500'
                            }`}>
                              {VARIATIONS_PER_STYLE} photos
                            </div>
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

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-t-2 border-white/10 z-50 shadow-2xl">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">

            <div className="flex items-center gap-3">
              <div className="bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-2">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Styles</p>
                <p className="text-white font-bold text-2xl leading-none">{selectedStyles.length}<span className="text-gray-500 text-base">/{maxStyles}</span></p>
              </div>

              <span className="text-violet-400 text-2xl font-bold">×</span>

              <div className="bg-fuchsia-600/20 border border-fuchsia-500/40 rounded-xl px-4 py-2">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Per style</p>
                <p className="text-white font-bold text-2xl leading-none">{VARIATIONS_PER_STYLE}</p>
              </div>

              <span className="text-violet-400 text-2xl font-bold">=</span>

              <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl px-5 py-2 shadow-lg shadow-violet-500/25">
                <p className="text-violet-100 text-[10px] uppercase tracking-wider mb-0.5">Total headshots</p>
                <p className="text-white font-bold text-2xl leading-none">{totalHeadshots}</p>
              </div>
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
                disabled={selectedStyles.length === 0 || isOverLimit}
                className={`py-3 px-8 rounded-xl font-bold transition-all duration-300 ${
                  selectedStyles.length > 0 && !isOverLimit
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
    </div>
  )
}