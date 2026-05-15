'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TrainingStatusProps {
  userId: string
}

// ===========================================
// PROGRESS LOGIC
// Verwachte training tijd: 30 min (FLUX LoRA met 800 steps)
// Bar vult geleidelijk op basis van elapsed time
// ===========================================
const EXPECTED_TOTAL_MINUTES = 30

export default function TrainingStatus({ userId }: TrainingStatusProps) {
  const [status, setStatus] = useState<string>('checking')
  const [message, setMessage] = useState<string>('Checking status...')
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(EXPECTED_TOTAL_MINUTES)
  const [progress, setProgress] = useState<number>(2)

  // Status ophalen elke 30 sec
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/training-status?userId=${userId}`)
        const data = await res.json()

        setStatus(data.status)
        setMessage(data.message)
        // FIX: correcte field name (was 'estimatedMinutesRemaining' wat niet bestond in API)
        if (typeof data.estimatedMinutes === 'number') {
          setEstimatedMinutes(data.estimatedMinutes)
        }
        if (data.startedAt) {
          setStartedAt(data.startedAt)
        }
      } catch (error) {
        console.error('Failed to check status:', error)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [userId])

  // Progress bar elke seconde updaten op basis van startedAt
  useEffect(() => {
    const updateProgress = () => {
      if (status === 'succeeded') {
        setProgress(100)
        return
      }

      if (status === 'failed' || status === 'canceled') {
        return
      }

      if (status === 'starting') {
        setProgress(2)
        return
      }

      if (status === 'processing' && startedAt) {
        const elapsedMs = Date.now() - new Date(startedAt).getTime()
        const elapsedMin = elapsedMs / 60000
        // Progress = elapsed / total * 100, capped tussen 5% en 95%
        // (95% max zodat we niet visueel "klaar" lijken voor het echt klaar is)
        const pct = Math.min(95, Math.max(5, (elapsedMin / EXPECTED_TOTAL_MINUTES) * 100))
        setProgress(pct)
      } else if (status === 'processing') {
        // Fallback als startedAt niet beschikbaar
        const elapsedEstimate = Math.max(0, EXPECTED_TOTAL_MINUTES - estimatedMinutes)
        const pct = Math.min(95, Math.max(5, (elapsedEstimate / EXPECTED_TOTAL_MINUTES) * 100))
        setProgress(pct)
      }
    }

    updateProgress()
    // Updaten elke seconde voor vloeiende ervaring
    const tick = setInterval(updateProgress, 1000)
    return () => clearInterval(tick)
  }, [status, startedAt, estimatedMinutes])

  if (status === 'no_model') return null

  if (status === 'starting' || status === 'processing') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 mb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-white font-bold text-xl">🚀 Training Your AI Model</h3>
            <p className="text-white/80">{message}</p>
          </div>
        </div>

        {/* Progress Bar — vult geleidelijk vanaf 5% tot 95% over 30 min */}
        <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-white rounded-full h-3 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white/60 text-xs mb-4">{Math.round(progress)}% complete</p>

        {/* Tips Section */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">💡 While you wait:</h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Training takes about 25-35 minutes</li>
            <li>• You&apos;ll get better results with diverse photos</li>
            <li>• Once ready, you can generate your styles!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/buy-credits"
            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            💳 Buy More Credits
          </Link>
          <Link
            href="/gallery"
            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            🖼️ View Gallery
          </Link>
        </div>

        <p className="text-white/50 text-xs mt-4">
          You can leave this page - we&apos;ll notify you when it&apos;s ready!
        </p>
      </div>
    )
  }

  if (status === 'succeeded') {
    return (
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">✅</div>
          <div>
            <h3 className="text-white font-bold text-lg">Model Ready!</h3>
            <p className="text-white/80">Your AI model is trained and ready to generate headshots.</p>
          </div>
        </div>
        <Link
          href="/create"
          className="inline-block mt-4 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          Generate Headshots Now →
        </Link>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">❌</div>
          <div>
            <h3 className="text-red-400 font-bold text-lg">Training Failed</h3>
            <p className="text-red-300">Something went wrong. Please try uploading your photos again.</p>
          </div>
        </div>
        <Link
          href="/upload"
          className="inline-block mt-4 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Try Again →
        </Link>
      </div>
    )
  }

  return null
}