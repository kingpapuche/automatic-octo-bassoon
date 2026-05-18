'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface GenerationStatus {
  id: string
  status: 'processing' | 'completed' | 'failed'
  completed: number
  total: number
  totalStyles: number
  variationsPerStyle: number
  imageUrls: string[]
  styles: string[]
  isComplete: boolean
}

export default function GenerationProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [status, setStatus] = useState<GenerationStatus | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/generation-status/${id}`)
        if (!res.ok) {
          setError('Generation niet gevonden')
          return
        }
        const data = await res.json()
        setStatus(data)

        if (data.isComplete) {
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      }
    }

    fetchStatus()
    interval = setInterval(fetchStatus, 4000)

    return () => clearInterval(interval)
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-3">Oops</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/gallery" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold">
            Naar Gallery
          </Link>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const progressPercent = status.total > 0 ? Math.round((status.completed / status.total) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            {status.isComplete ? '🎉 Your Headshots Are Ready!' : '🎨 Generating Your Headshots'}
          </h1>
          <p className="text-gray-400 text-lg">
            {status.isComplete
              ? `${status.completed} headshots generated (${status.totalStyles} styles × ${status.variationsPerStyle} variations)`
              : `${status.completed} of ${status.total} complete · ${status.totalStyles} styles × ${status.variationsPerStyle} variations`}
          </p>
        </div>

        {/* Progress bar */}
        {!status.isComplete && (
          <div className="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-1">Working on it...</h3>
                <p className="text-gray-400">
                  Each style generates {status.variationsPerStyle} unique variations. Takes 30-60 seconds per style. You can leave this page — we'll keep generating in the background.
                </p>
              </div>
            </div>

            <div className="bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full h-3 transition-all duration-1000"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
            <p className="text-violet-300 text-sm font-semibold">{progressPercent}% complete</p>
          </div>
        )}

        {status.isComplete && (
          <div className="flex justify-center gap-3 mb-8">
            <Link
              href="/gallery"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-violet-500/25"
            >
              🖼️ View All in Gallery
            </Link>
            <Link
              href="/create/styles"
              className="bg-white/10 hover:bg-white/15 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Generate More
            </Link>
          </div>
        )}

        {/* Image grid - 4 columns op desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Geleverde images */}
          {status.imageUrls.map((url, idx) => (
            <a
              key={`done-${idx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-[3/4] bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition group relative"
            >
              <img
                src={url}
                alt={`Headshot ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                ✓
              </div>
            </a>
          ))}

          {/* Pending placeholders */}
          {Array.from({ length: Math.max(0, status.total - status.completed) }).map((_, idx) => (
            <div
              key={`pending-${idx}`}
              className="aspect-[3/4] bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 text-sm">Generating...</p>
            </div>
          ))}
        </div>

        {!status.isComplete && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Images appear in groups of {status.variationsPerStyle} (one batch per style). Feel free to close this page — your headshots will wait in your gallery.
          </p>
        )}
      </div>
    </div>
  )
}