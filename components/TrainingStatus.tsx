'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TrainingStatusProps {
  userId: string
}

export default function TrainingStatus({ userId }: TrainingStatusProps) {
  const [status, setStatus] = useState<string>('checking')
  const [message, setMessage] = useState<string>('Checking status...')
  const [minutes, setMinutes] = useState<number>(0)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/training-status?userId=${userId}`)
        const data = await res.json()
        
        setStatus(data.status)
        setMessage(data.message)
        setMinutes(data.estimatedMinutesRemaining || 0)

        if (data.status === 'succeeded' || data.status === 'failed') {
          return
        }
      } catch (error) {
        console.error('Failed to check status:', error)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [userId])

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

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-4">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-1000"
            style={{ width: `${Math.max(10, 100 - (minutes * 4))}%` }}
          ></div>
        </div>

        {/* Tips Section */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">💡 While you wait:</h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Training takes about 15-25 minutes</li>
            <li>• You&apos;ll get better results with diverse photos</li>
            <li>• Once ready, you can generate unlimited styles!</li>
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