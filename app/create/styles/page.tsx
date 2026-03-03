'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

// ===========================================
// STYLE DATA — Matcht met generate-route.ts
// ===========================================

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
  styles: StyleOption[]
}

const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: 'formal',
    name: 'Formal / Corporate',
    icon: '👔',
    styles: [
      { id: 'corporate-classic', label: 'Corporate Classic', description: 'Navy suit, gray studio', icon: '🏢' },
      { id: 'executive-navy', label: 'Executive Navy', description: 'Arms crossed, city skyline', icon: '🌆' },
      { id: 'ceo-black', label: 'CEO Black', description: 'Black suit, white studio', icon: '⬛' },
      { id: 'boardroom-gray', label: 'Boardroom Gray', description: 'Gray suit, office windows', icon: '🪟' },
      { id: 'power-suit', label: 'Power Suit', description: 'Navy suit, library', icon: '📚' },
      { id: 'light-blue-exec', label: 'Light Blue Exec', description: 'Blue blazer, tablet', icon: '📱' },
      { id: 'pinstripe-pro', label: 'Pinstripe Pro', description: 'Pinstripe suit, gray bg', icon: '📐' },
      { id: 'three-piece', label: 'Three Piece', description: 'Three piece suit, dramatic', icon: '🎩' },
      { id: 'wall-street', label: 'Wall Street', description: 'Dark suit, red tie', icon: '📈' },
      { id: 'corner-office', label: 'Corner Office', description: 'Sitting at desk, city view', icon: '🏙️' },
      { id: 'conference-ready', label: 'Conference Ready', description: 'Navy blazer, standing', icon: '🎤' },
      { id: 'investor-meeting', label: 'Investor Meeting', description: 'Charcoal suit, white bg', icon: '🤝' },
      { id: 'formal-black', label: 'Formal Black', description: 'Black suit, dark studio', icon: '🖤' },
    ],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    icon: '🧥',
    styles: [
      { id: 'teal-blazer', label: 'Teal Blazer', description: 'Teal blazer, white tee', icon: '💎' },
      { id: 'beige-elegance', label: 'Beige Elegance', description: 'Beige suit, watch', icon: '⌚' },
      { id: 'gray-blazer-blue', label: 'Gray Blazer', description: 'Gray blazer, blue bg', icon: '🔵' },
      { id: 'open-collar-navy', label: 'Open Collar', description: 'Navy blazer, open collar', icon: '👕' },
      { id: 'blazer-white-tee', label: 'Blazer + White Tee', description: 'Black blazer, city lights', icon: '✨' },
      { id: 'v-neck-sweater', label: 'V-Neck Sweater', description: 'Blue sweater, white bg', icon: '🧶' },
      { id: 'office-casual-plants', label: 'Office Casual', description: 'Oxford shirt, plants', icon: '🌿' },
      { id: 'weekend-blazer', label: 'Weekend Blazer', description: 'Tan blazer, café', icon: '☕' },
      { id: 'creative-director', label: 'Creative Director', description: 'Black blazer + turtleneck', icon: '🎨' },
      { id: 'startup-ceo', label: 'Startup CEO', description: 'Navy blazer, coworking', icon: '🚀' },
      { id: 'tech-lead', label: 'Tech Lead', description: 'Gray sport coat', icon: '💻' },
      { id: 'consultant-look', label: 'Consultant', description: 'Light gray suit, no tie', icon: '📋' },
    ],
  },
  {
    id: 'casual',
    name: 'Casual Professional',
    icon: '👕',
    styles: [
      { id: 'white-tee-orange', label: 'White Tee Orange', description: 'White tee, orange bg', icon: '🟠' },
      { id: 'black-tee-urban', label: 'Black Tee Urban', description: 'Black tee, urban street', icon: '🏘️' },
      { id: 'navy-polo-clean', label: 'Navy Polo', description: 'Navy polo, white bg', icon: '🔷' },
      { id: 'gray-tee-crossed', label: 'Gray Tee Crossed', description: 'Gray tee, arms crossed', icon: '💪' },
      { id: 'white-tee-nature', label: 'White Tee Nature', description: 'White tee, green nature', icon: '🌳' },
      { id: 'plaid-casual', label: 'Plaid Casual', description: 'Plaid shirt, studio', icon: '🪵' },
      { id: 'henley-relaxed', label: 'Henley Relaxed', description: 'Henley, window light', icon: '🪟' },
      { id: 'denim-shirt', label: 'Denim Shirt', description: 'Chambray, white bg', icon: '👖' },
      { id: 'knit-sweater', label: 'Knit Sweater', description: 'Chunky knit, cozy', icon: '🧣' },
      { id: 'linen-summer', label: 'Linen Summer', description: 'White linen, outdoor', icon: '☀️' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative / Edgy',
    icon: '🎸',
    styles: [
      { id: 'leather-jacket-city', label: 'Leather Jacket', description: 'Leather jacket, bokeh', icon: '🧥' },
      { id: 'night-life', label: 'Night Life', description: 'Black outfit, nightlife', icon: '🌃' },
      { id: 'turtleneck-modern', label: 'Turtleneck Modern', description: 'Gray turtleneck', icon: '🤍' },
      { id: 'black-turtleneck-drama', label: 'Black Turtleneck', description: 'Dramatic side light', icon: '🖤' },
      { id: 'tech-founder', label: 'Tech Founder', description: 'Gray tee, tech office', icon: '⚡' },
      { id: 'all-black-minimal', label: 'All Black', description: 'All black, dramatic', icon: '🌑' },
      { id: 'creative-colorful', label: 'Creative Colorful', description: 'Colorful shirt', icon: '🌈' },
      { id: 'rebel-professional', label: 'Rebel Pro', description: 'Blazer + band tee', icon: '🎵' },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor / Natural',
    icon: '🌿',
    styles: [
      { id: 'park-portrait', label: 'Park Portrait', description: 'Green park, daylight', icon: '🌲' },
      { id: 'rooftop-view', label: 'Rooftop View', description: 'City panorama, golden hr', icon: '🏙️' },
      { id: 'golden-hour', label: 'Golden Hour', description: 'White shirt, warm tones', icon: '🌅' },
      { id: 'nature-fresh', label: 'Nature Fresh', description: 'Trees, natural light', icon: '🍃' },
      { id: 'city-walk', label: 'City Walk', description: 'Walking, city street', icon: '🚶' },
      { id: 'coffee-shop', label: 'Coffee Shop', description: 'Sitting, café', icon: '☕' },
      { id: 'beach-professional', label: 'Beach Pro', description: 'Linen shirt, coastal', icon: '🏖️' },
      { id: 'architectural', label: 'Architectural', description: 'Modern architecture', icon: '🏛️' },
    ],
  },
  {
    id: 'poses',
    name: 'Specialty Poses',
    icon: '🧍',
    styles: [
      { id: 'arms-crossed-power', label: 'Arms Crossed', description: 'Power pose, dark suit', icon: '💪' },
      { id: 'holding-tablet', label: 'Holding Tablet', description: 'Tablet, office', icon: '📱' },
      { id: 'sitting-confident', label: 'Sitting Confident', description: 'Chair, legs crossed', icon: '🪑' },
      { id: 'leaning-casual', label: 'Leaning Casual', description: 'Against wall', icon: '🚪' },
      { id: 'hands-in-pockets', label: 'Hands in Pockets', description: 'Blazer + jeans', icon: '🤙' },
      { id: 'thoughtful-pose', label: 'Thoughtful', description: 'Hand near chin', icon: '🤔' },
      { id: 'profile-angle', label: 'Profile Angle', description: 'Three quarter view', icon: '📷' },
      { id: 'looking-up', label: 'Looking Up', description: 'From below', icon: '⬆️' },
    ],
  },
  {
    id: 'colored',
    name: 'Colored Backgrounds',
    icon: '🎨',
    styles: [
      { id: 'blue-studio', label: 'Blue Studio', description: 'Business, blue bg', icon: '🔵' },
      { id: 'green-studio', label: 'Green Studio', description: 'Smart casual, green', icon: '🟢' },
      { id: 'purple-creative', label: 'Purple Creative', description: 'Dark outfit, purple', icon: '🟣' },
      { id: 'yellow-energetic', label: 'Yellow Energetic', description: 'Casual, yellow', icon: '🟡' },
      { id: 'red-bold', label: 'Red Bold', description: 'Professional, red', icon: '🔴' },
      { id: 'gradient-modern', label: 'Gradient Modern', description: 'Blue to purple', icon: '🌀' },
    ],
  },
  // ===== NIEUWE CATEGORIEËN =====
  {
    id: 'fullbody',
    name: 'Full Body',
    icon: '🧍',
    styles: [
      { id: 'fullbody-navy-suit', label: 'Full Body Navy Suit', description: 'Head to toe, navy suit', icon: '👔' },
      { id: 'fullbody-black-outfit', label: 'Full Body Black', description: 'All black, full length', icon: '🖤' },
      { id: 'fullbody-casual-white', label: 'Full Body Casual', description: 'White tee, jeans, studio', icon: '👕' },
      { id: 'fullbody-blazer-jeans', label: 'Blazer + Jeans', description: 'Blazer, jeans, modern interior', icon: '🧥' },
      { id: 'fullbody-city-street', label: 'City Street', description: 'Urban, smart casual, full body', icon: '🏙️' },
      { id: 'fullbody-outdoor', label: 'Outdoor Full Body', description: 'Park, casual, full length', icon: '🌿' },
    ],
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    icon: '🕶️',
    styles: [
      { id: 'sunglasses-city', label: 'Sunglasses City', description: 'Dark blazer, city street', icon: '🏙️' },
      { id: 'sunglasses-outdoor', label: 'Sunglasses Outdoor', description: 'Casual jacket, outdoor', icon: '☀️' },
      { id: 'sunglasses-black-suit', label: 'Sunglasses Black Suit', description: 'Black suit, mysterious', icon: '🖤' },
      { id: 'sunglasses-casual', label: 'Sunglasses Casual', description: 'White tee, outdoor', icon: '😎' },
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury / Watch',
    icon: '⌚',
    styles: [
      { id: 'watch-showcase', label: 'Watch Showcase', description: 'Luxury watch, beige blazer', icon: '✨' },
      { id: 'watch-luxury-outdoor', label: 'Watch Outdoor', description: 'Watch visible, nature bg', icon: '🌿' },
      { id: 'watch-dark-elegant', label: 'Watch Dark Elegant', description: 'Watch, dark suit, dramatic', icon: '🖤' },
    ],
  },
  {
    id: 'bold-colors',
    name: 'Bold Colored Suits',
    icon: '🌈',
    styles: [
      { id: 'teal-suit', label: 'Teal Suit', description: 'Teal suit, arms crossed', icon: '💎' },
      { id: 'green-suit', label: 'Green Suit', description: 'Green blazer, white bg', icon: '🟢' },
      { id: 'pink-blazer', label: 'Pink Blazer', description: 'Pink blazer, modern', icon: '🌸' },
      { id: 'orange-suit', label: 'Orange Suit', description: 'Orange blazer, vibrant', icon: '🟠' },
      { id: 'brown-suit-elegant', label: 'Brown Suit', description: 'Warm brown, dark bg', icon: '🤎' },
    ],
  },
  {
    id: 'blacktie',
    name: 'Black Tie / Tuxedo',
    icon: '🎩',
    styles: [
      { id: 'tuxedo-classic', label: 'Classic Tuxedo', description: 'Black tux, bow tie, gala', icon: '🥂' },
      { id: 'tuxedo-modern', label: 'Modern Tuxedo', description: 'Slim tux, open collar', icon: '✨' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle / Motor',
    icon: '🏍️',
    styles: [
      { id: 'moto-leather', label: 'Moto Leather', description: 'Brown leather jacket, moto', icon: '🤎' },
      { id: 'moto-city', label: 'Moto City', description: 'Black leather, city street', icon: '🖤' },
    ],
  },
  {
    id: 'sitting-casual',
    name: 'Sitting Casual',
    icon: '🪑',
    styles: [
      { id: 'sitting-ground', label: 'Sitting on Ground', description: 'Casual, knees up, studio', icon: '🧘' },
      { id: 'sitting-steps', label: 'Sitting on Steps', description: 'Outdoor steps, urban', icon: '🏙️' },
      { id: 'sitting-chair-casual', label: 'Chair Sideways', description: 'Sideways in chair, relaxed', icon: '🪑' },
    ],
  },
  {
    id: 'closeup',
    name: 'Close-Up Headshots',
    icon: '🎯',
    styles: [
      { id: 'closeup-dramatic', label: 'Dramatic Close-Up', description: 'Cinematic, dark bg', icon: '🎬' },
      { id: 'closeup-warm', label: 'Warm Close-Up', description: 'Warm light, genuine smile', icon: '☀️' },
      { id: 'closeup-outdoor', label: 'Outdoor Close-Up', description: 'Natural light, green bg', icon: '🌿' },
    ],
  },
]

export default function CreateStylesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string>('formal')

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: userData } = await supabase
          .from('users')
          .select('id, credits')
          .eq('id', session.user.id)
          .single()
        if (userData) setUserCredits(userData.credits || 0)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

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

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <CreateProgressBar currentStep={2} userCredits={userCredits} />

      <div className="pt-[140px] pb-[160px] max-w-[900px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Choose Your Styles</h1>
          <p className="text-gray-400 text-lg">Select the looks you want. Each style = 1 headshot = 1 credit.</p>
          <p className="text-gray-600 text-sm mt-2">{STYLE_CATEGORIES.reduce((acc, c) => acc + c.styles.length, 0)} styles available</p>
        </div>

        <div className="space-y-4">
          {STYLE_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.id
            const selectedCount = category.styles.filter(s => selectedStyles.includes(s.id)).length
            const allSelected = selectedCount === category.styles.length

            return (
              <div key={category.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
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