'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from '@/lib/nav'
import { useRouter } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import { useLocale } from '@/lib/useLocale'
import { GALLERY } from '@/lib/messages/gallery'

interface Generation {
  id: string
  result_urls: string[]
  styles_used: string[]
  created_at: string
}

export default function GalleryPage() {
  const router = useRouter()
  const t = GALLERY[useLocale()].gallery
  const [user, setUser] = useState<any>(null)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          router.push('/login')
          return
        }

        setUser(session.user)

        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching generations:', error.message, error.code, error.details, error.hint)
        } else if (data) {
          console.log('Generations gevonden:', data.length)
          setGenerations(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      if (user?.id) {
        await supabase.from('downloads').insert({
          user_id: user.id,
          image_url: url,
        })
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-white">{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-white">{t.redirecting}</p>
      </div>
    )
  }

  const allImages = generations.flatMap((gen) =>
    gen.result_urls.map((url, index) => ({
      url,
      generationId: gen.id,
      createdAt: gen.created_at,
      index,
    }))
  )

  return (
    <div className="min-h-screen bg-[#0f172a]">

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xl font-serif tracking-tight">
              Nova <em>Imago</em>
            </span>
          </Link>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/10 transition text-sm"
            >
              {t.dashboard}
            </Link>
            <Link
              href="/create/styles"
              className="bg-[#FF6B4A] text-white px-6 py-2 rounded-lg hover:bg-[#e55a3a] transition text-sm font-semibold"
            >
              {t.generateMore}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-10 px-4">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <p className="text-white/50 mt-1">{allImages.length} {t.photosGenerated}</p>

          {/* Download-aanmoediging (geen verwijder-belofte die niet afgedwongen wordt -> GDPR-veilig) */}
          <div className="mt-4 flex items-start gap-2.5 bg-violet-500/10 border border-violet-500/30 text-violet-200 text-sm rounded-xl px-4 py-3">
            <span className="text-base leading-none mt-0.5">💾</span>
            <span>
              {t.downloadTip} <strong className="font-semibold">{t.downloadTipStrong}</strong>
            </span>
          </div>
        </div>

        {/* Review-kaartje op het piekmoment: klant heeft net z'n headshots gezien */}
        {allImages.length > 0 && user?.id && <ReviewCard userId={user.id} />}

        {/* Gallery Grid */}
        {allImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#94a3b8] text-lg mb-4">{t.none}</p>
            <Link
              href="/upload"
              className="bg-[#FF6B4A] text-white px-6 py-3 rounded-lg hover:bg-[#e55a3a] transition"
            >
              {t.generateFirst}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((image, idx) => (
              <div
                key={`${image.generationId}-${image.index}`}
                className="bg-[#1e293b] rounded-lg overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={`Headshot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() =>
                        downloadImage(image.url, `novaimago-headshot-${idx + 1}.webp`)
                      }
                      className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      {t.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}