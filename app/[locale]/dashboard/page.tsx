'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from '@/lib/nav'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard, Upload, Sparkles, Play, Wand2, Images } from 'lucide-react'
import TrainingStatus from '@/components/TrainingStatus'
import { Link } from '@/lib/nav'
import { useLocale } from '@/lib/useLocale'
import { DASHBOARD } from '@/lib/messages/dashboard'

// Iconen voor de How it Works-stappen (tekst komt uit de vertalingen)
const STEP_ICONS = [Upload, Wand2, Sparkles, Images]

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [credits, setCredits] = useState(0)
  const [trainedModelId, setTrainedModelId] = useState<string | null>(null)
  const [loadingCredits, setLoadingCredits] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup')
    }

    if (user) {
      const fetchUserData = async () => {
        const { data } = await supabase
          .from('users')
          .select('credits, trained_model_id')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setCredits(data.credits)
          setTrainedModelId(data.trained_model_id)
        }
        setLoadingCredits(false)
      }
      fetchUserData()
    }
  }, [user, loading, router])

  const hasModel = !!trainedModelId
  const t = DASHBOARD[useLocale()].dashboard

  if (loading || loadingCredits) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">{t.loading}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xl font-serif tracking-tight">
              Nova <em>Imago</em>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
            >
              {t.signOut}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <p className="text-white/50 mt-1">{t.subtitle}</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.welcomeBack}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white p-6 rounded-xl">
            <div className="text-sm opacity-90 mb-1">{t.yourCredits}</div>
            <div className="text-5xl font-bold">{credits}</div>
            <div className="text-sm opacity-90 mt-2">
              {t.creditEquals}
            </div>
          </div>
        </div>

        {/* Training Status */}
        {user && <TrainingStatus userId={user.id} />}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          {/* Buy Credits */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.buyTitle}</h3>
            <p className="text-gray-400 mb-4">
              {t.buyDesc}
            </p>
            <button
              onClick={() => router.push('/buy-credits')}
              className="mt-auto w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              {t.buyBtn}
            </button>
          </div>

          {/* Train a Model */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.trainTitle}</h3>
            <p className="text-gray-400 mb-4">
              {t.trainDesc}
            </p>
            <button
              onClick={() => router.push('/upload')}
              className="mt-auto w-full bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] hover:from-[#483A7C] hover:to-[#5B4E9D] text-white py-3 rounded-lg font-semibold transition"
            >
              {hasModel ? t.trainBtnNew : t.trainBtnStart}
            </button>
          </div>

          {/* Generate */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.genTitle}</h3>
            <p className="text-gray-400 mb-4">
              {t.genDesc}
            </p>
            {hasModel ? (
              <button
                onClick={() => router.push('/create/model-select')}
                className="mt-auto w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition"
              >
                {t.genBtn}
              </button>
            ) : (
              <button className="mt-auto w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed">
                {t.genRequired}
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 flex flex-col">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mb-4">
              <Images className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.galTitle}</h3>
            <p className="text-gray-400 mb-4">
              {t.galDesc}
            </p>
            <button
              onClick={() => router.push('/gallery')}
              className="mt-auto w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white py-3 rounded-lg font-semibold transition"
            >
              {t.galBtn}
            </button>
          </div>
        </div>

        {/* How it Works — video inline naast de stappen (best practice: informatieve content, geen klik-barrière, vult de ruimte).
            VERVANG het video-placeholderblok hieronder door de YouTube-embed zodra de link er is:
            <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/VIDEO_ID" title="How it Works" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 border border-white/10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Links: titel + stappen */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t.howTitle}</h3>
              </div>
              <div className="space-y-4">
                {t.steps.map((s, i) => {
                  const Icon = STEP_ICONS[i]
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{s.title}</h4>
                        <p className="text-gray-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rechts: video (placeholder tot de YouTube-link er is) */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 to-black border border-white/10 flex items-center justify-center">
              <div className="text-center text-white/60 px-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-0.5" />
                </div>
                <p className="text-sm font-medium">{t.videoTitle}</p>
                <p className="text-xs text-white/40 mt-1">{t.videoSoon}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}