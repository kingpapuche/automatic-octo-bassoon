'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from '@/lib/useLocale'
import { CREATE } from '@/lib/messages/create'

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
  const t = CREATE[useLocale()].generations
  const { id } = use(params)
  const [status, setStatus] = useState<GenerationStatus | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/generation-status/${id}`)
        if (!res.ok) {
          setError(t.notFound)
          return
        }
        const data = await res.json()
        setStatus(data)

        // Zodra compleet: stop polling en ga automatisch naar gallery
        if (data.isComplete) {
          clearInterval(interval)
          router.push('/gallery')
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      }
    }

    fetchStatus()
    interval = setInterval(fetchStatus, 4000)

    return () => clearInterval(interval)
  }, [id, router, t.notFound])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-3">{t.oops}</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/gallery" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold">
            {t.toGallery}
          </Link>
        </div>
      </div>
    )
  }

  const progressPercent = status && status.total > 0
    ? Math.round((status.completed / status.total) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <div className="w-20 h-20 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>

        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          {t.generating}
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          {status
            ? t.photosReady.replace('{done}', String(status.completed)).replace('{total}', String(status.total))
            : t.startingUp}
        </p>

        <div className="bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full h-3 transition-all duration-1000"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
        <p className="text-violet-300 text-sm font-semibold mb-8">{progressPercent}% {t.complete}</p>

        <p className="text-gray-500 text-sm">
          {t.takesMinutes}
        </p>

      </div>
    </div>
  )
}