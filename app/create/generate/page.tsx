'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

const VARIATIONS_PER_STYLE = 4

const ASPECT_RATIO_OPTIONS = [
  { id: '3:4', label: 'Portrait', dimensions: '3:4', description: 'LinkedIn, CV & dating apps', boxW: 60, boxH: 80 },
  { id: '1:1', label: 'Square', dimensions: '1:1', description: 'Instagram, X & WhatsApp', boxW: 80, boxH: 80 },
  { id: '4:3', label: 'Landscape', dimensions: '4:3', description: 'Website & iPad', boxW: 80, boxH: 60 },
]

export default function CreateGeneratePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [userCredits, setUserCredits] = useState(0)
  const [hasModel, setHasModel] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('3:4')

  const [styleIds, setStyleIds] = useState<string[]>([])

  const [showCreditsPopup, setShowCreditsPopup] = useState(false)
  const [showModelPopup, setShowModelPopup] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('bestai_styleIds')
    if (!stored) { router.push('/create/styles'); return }

    try {
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        router.push('/create/styles'); return
      }
      setStyleIds(parsed)
    } catch {
      router.push('/create/styles'); return
    }

    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        const { data: userData } = await supabase
          .from('users')
          .select('id, credits, trained_model_id')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          setUserId(userData.id)
          setUserCredits(userData.credits || 0)
          setHasModel(!!userData.trained_model_id)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const totalHeadshots = styleIds.length * VARIATIONS_PER_STYLE
  const creditsNeeded = totalHeadshots
  const hasEnoughCredits = userCredits >= creditsNeeded

  const handleGenerateClick = () => {
    if (!hasModel) { setShowModelPopup(true); return }
    if (!hasEnoughCredits) { setShowCreditsPopup(true); return }
    handleGenerate()
  }

  const handleGenerate = async () => {
    if (!userId) return
    setGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, styleIds, aspectRatio }),
      })

      const data = await response.json()
      if (data.error) {
        alert(`Error: ${data.error}`)
        setGenerating(false)
        return
      }

      sessionStorage.removeItem('bestai_styleIds')

      if (data.generationId) {
        router.push(`/generations/${data.generationId}`)
      } else {
        router.push('/gallery')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Generation failed. Please try again.')
      setGenerating(false)
    }
  }

  const formatStyleName = (id: string) => {
    return id.replace(/^w-/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
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

      {/* CREDITS POPUP */}
      {showCreditsPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💳</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">You Need More Credits</h2>
            <p className="text-gray-400 text-center mb-6">
              You selected <span className="text-white font-semibold">{styleIds.length} styles × {VARIATIONS_PER_STYLE} = {totalHeadshots} headshots</span> but only have <span className="text-amber-400 font-semibold">{userCredits} credits</span>.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm">Starter Pack</span>
                <span className="text-white font-semibold">40 headshots — $29</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm">Pro Pack <span className="text-amber-400 text-xs">POPULAR</span></span>
                <span className="text-white font-semibold">80 headshots — $39</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Premium Pack</span>
                <span className="text-white font-semibold">120 headshots — $49</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreditsPopup(false)} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition">Cancel</button>
              <button onClick={() => router.push('/buy-credits')} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition shadow-lg">Buy Credits →</button>
            </div>
          </div>
        </div>
      )}

      {showModelPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Train Your AI Model First</h2>
            <p className="text-gray-400 text-center mb-6">Before generating headshots, you need to train an AI model with your photos.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowModelPopup(false)} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition">Cancel</button>
              <button onClick={() => router.push('/upload')} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-500 text-white transition shadow-lg">Upload Photos →</button>
            </div>
          </div>
        </div>
      )}

      <CreateProgressBar currentStep={3} userCredits={userCredits} />

      <div className="pt-[140px] pb-[100px] max-w-[700px] mx-auto px-6">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Review & Generate</h1>
          <p className="text-gray-400 text-lg">Everything looks good? Let&apos;s create your headshots.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Your Selected Styles</h3>
            <button
              onClick={() => router.push('/create/styles')}
              className="text-violet-400 text-sm hover:text-violet-300 transition"
            >
              Change
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {styleIds.map((id) => (
              <span
                key={id}
                className="text-xs bg-violet-500/15 text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20"
              >
                {formatStyleName(id)}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Each style generates <span className="text-violet-300 font-semibold">{VARIATIONS_PER_STYLE} unique variations</span> with different poses and expressions.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Photo Format</h3>
          <div className="flex gap-4 justify-center">
            {ASPECT_RATIO_OPTIONS.map((option) => {
              const isSelected = aspectRatio === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setAspectRatio(option.id)}
                  className={`flex flex-col items-center gap-4 py-6 px-4 rounded-2xl transition-all duration-200 flex-1 ${
                    isSelected
                      ? 'bg-violet-600/25 border-2 border-violet-500 shadow-lg shadow-violet-500/20'
                      : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center" style={{ height: 100 }}>
                    <div
                      className={`rounded-xl border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-violet-400 bg-violet-600/20'
                          : 'border-gray-600 bg-white/5'
                      }`}
                      style={{ width: option.boxW, height: option.boxH }}
                    >
                      <span className={`text-xs font-bold ${isSelected ? 'text-violet-300' : 'text-gray-500'}`}>
                        {option.dimensions}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-violet-300' : 'text-gray-500'}`}>
                      {option.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Generation Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Aspect Ratio</span>
              <span className="text-white font-semibold">{aspectRatio} ({ASPECT_RATIO_OPTIONS.find(o => o.id === aspectRatio)?.label})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Variations per style</span>
              <span className="text-white font-semibold">{VARIATIONS_PER_STYLE}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Quality</span>
              <span className="text-white font-semibold">High (35 steps)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Format</span>
              <span className="text-white font-semibold">WebP</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 border border-violet-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Styles selected</span>
            <span className="text-white font-semibold">{styleIds.length}×</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Variations per style</span>
            <span className="text-white font-semibold">{VARIATIONS_PER_STYLE}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Total headshots</span>
            <span className="text-white font-semibold">{totalHeadshots} photos</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg">Credits needed</span>
              <span className="text-violet-400 font-bold text-2xl">{creditsNeeded}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-500 text-sm">Your balance</span>
              <span className={`font-semibold ${hasEnoughCredits ? 'text-emerald-400' : 'text-amber-400'}`}>
                {userCredits} credits
                {hasEnoughCredits && ' ✓'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/create/styles')}
            className="py-4 px-8 rounded-2xl font-semibold bg-white/10 text-white hover:bg-white/15 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleGenerateClick}
            disabled={generating}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              !generating
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Starting generation...
              </>
            ) : (
              <><span className="text-xl">✨</span> Generate {totalHeadshots} Headshots</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}