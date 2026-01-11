// app/styles/[orderId]/page.tsx
// Style Selector Page - Core Feature (like AISelfie.es step 2)

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  STYLE_LIBRARY, 
  STYLE_CATEGORIES, 
  getStylesByCategory,
  StyleDefinition 
} from '@/lib/styles/STYLE_LIBRARY'


interface StyleSelectorProps {
  params: { orderId: string }
}

export default function StyleSelector({ params }: StyleSelectorProps) {
  const router = useRouter()
 const { orderId } = use(params) 
  
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [planType, setPlanType] = useState<'starter' | 'pro'>('starter')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  
  // Fetch order details to determine plan
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      setPlanType('pro')
    }
    fetchOrderDetails()
 }, [orderId])
  
  // Calculate limits based on plan
  const maxStyles = planType === 'starter' ? 10 : 25
  const totalPhotos = selectedStyles.length * 4
  
  // Toggle style selection
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter(id => id !== styleId))
    } else {
      if (selectedStyles.length < maxStyles) {
        setSelectedStyles([...selectedStyles, styleId])
      } else {
        alert(`You can select up to ${maxStyles} styles with the ${planType} plan`)
      }
    }
  }
  
  // Select all popular styles
  const selectPopular = () => {
    const popularStyles = STYLE_LIBRARY
      .filter(style => style.popular)
      .slice(0, maxStyles)
      .map(style => style.id)
    setSelectedStyles(popularStyles)
  }
  
  // Clear selections
  const clearSelections = () => {
    setSelectedStyles([])
  }
  
  // Generate photos
  const handleGenerate = async () => {
    if (selectedStyles.length === 0) {
      alert('Please select at least one style')
      return
    }
    
    setIsGenerating(true)
    
    try {
      // Save selected styles
      await fetch('/api/save-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId,
          selectedStyles 
        })
      })
      
      // Trigger generation
      await fetch('/api/generate-selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      
      // Redirect to processing page
      router.push(`/processing/${orderId}`)
      
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to start generation. Please try again.')
      setIsGenerating(false)
    }
  }
  
  // Filter styles by category
  const getFilteredStyles = () => {
    if (activeCategory === 'all') {
      return STYLE_LIBRARY
    }
    return getStylesByCategory(activeCategory)
  }
  
  const filteredStyles = getFilteredStyles()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* HEADER */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Headshot Styles
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Explore over {STYLE_LIBRARY.length}+ professional headshot styles
          </p>
          <p className="text-lg text-purple-300">
            Select {maxStyles} styles • Each generates 4 variations
          </p>
        </div>
        
        {/* SELECTION COUNTER */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">
                {selectedStyles.length} / {maxStyles} styles selected
              </p>
              <p className="text-gray-300">
                = {totalPhotos} professional headshots
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={selectPopular}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
              >
                ⭐ Popular
              </button>
              <button
                onClick={clearSelections}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(selectedStyles.length / maxStyles) * 100}%` }}
            />
          </div>
        </div>
        
        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              activeCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All Styles ({STYLE_LIBRARY.length})
          </button>
          
          {Object.entries(STYLE_CATEGORIES).map(([key, label]) => {
            const count = getStylesByCategory(label).length
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(label)}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  activeCategory === label
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
        
        {/* STYLE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyles.includes(style.id)
            const isDisabled = !isSelected && selectedStyles.length >= maxStyles
            
            return (
              <div
                key={style.id}
                onClick={() => !isDisabled && toggleStyle(style.id)}
                className={`
                  relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/50 scale-105' 
                    : isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:ring-2 hover:ring-purple-400 hover:scale-102'
                  }
                `}
              >
                {/* TIER BADGE */}
                {style.tier === 'pro' && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    PRO
                  </div>
                )}
                
                {/* POPULAR BADGE */}
                {style.popular && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ POPULAR
                  </div>
                )}
                
                {/* PREVIEW IMAGE */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  <img
                    src={style.preview}
                    alt={style.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if preview image doesn't exist
                      e.currentTarget.src = '/placeholder-preview.jpg'
                    }}
                  />
                  
                  {/* SELECTION OVERLAY */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-600/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-white rounded-full p-4">
                        <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* STYLE INFO */}
                <div className="bg-white/10 backdrop-blur-lg p-4 border-t border-white/10">
                  <h3 className="font-bold text-lg mb-1">{style.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{style.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300 font-medium">
                      {style.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      4 variations
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 shadow-2xl z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <p className="text-xl font-bold mb-1">
                {selectedStyles.length} styles selected
              </p>
              <p className="text-gray-300">
                = {totalPhotos} professional headshots
              </p>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={selectedStyles.length === 0 || isGenerating}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${selectedStyles.length > 0 && !isGenerating
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/50 cursor-pointer'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Starting Generation...
                </span>
              ) : selectedStyles.length === 0 ? (
                'Select Styles to Continue'
              ) : (
                `Generate ${totalPhotos} Headshots →`
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* UPGRADE PROMPT (if starter and wants more) */}
      {planType === 'starter' && selectedStyles.length === 10 && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl max-w-sm z-50">
          <p className="font-bold mb-2">Want more styles?</p>
          <p className="text-sm mb-3">
            Upgrade to Pro to select up to 25 styles (100 photos)
          </p>
          <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition">
            Upgrade to Pro ($20)
          </button>
        </div>
      )}
    </div>
  )
}