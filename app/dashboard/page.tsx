'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard, Upload, Sparkles, Play, Wand2, Images } from 'lucide-react'
import TrainingStatus from '@/components/TrainingStatus'
import Link from 'next/link'

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

  if (loading || loadingCredits) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
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
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 mt-1">Manage your AI headshots</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white p-6 rounded-xl">
            <div className="text-sm opacity-90 mb-1">Your Credits</div>
            <div className="text-5xl font-bold">{credits}</div>
            <div className="text-sm opacity-90 mt-2">
              Each credit = 1 generated photo
            </div>
          </div>
        </div>

        {/* Training Status */}
        {user && <TrainingStatus userId={user.id} />}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          {/* Buy Credits */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Buy Credits</h3>
            <p className="text-gray-400 mb-4">
              Purchase credit packs to generate AI headshots
            </p>
            <button 
              onClick={() => router.push('/buy-credits')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Buy Now →
            </button>
          </div>

          {/* Train a Model */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Train a Model</h3>
            <p className="text-gray-400 mb-4">
              Upload 10-20 selfies to create your custom AI
            </p>
            <button 
              onClick={() => router.push('/upload')}
              className="w-full bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] hover:from-[#483A7C] hover:to-[#5B4E9D] text-white py-3 rounded-lg font-semibold transition"
            >
              {hasModel ? 'Retrain Model →' : 'Start Training →'}
            </button>
          </div>

          {/* Generate */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generate</h3>
            <p className="text-gray-400 mb-4">
              Choose styles and create your headshots
            </p>
            {hasModel ? (
              <button 
                onClick={() => router.push('/create/styles')}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Generate Headshots →
              </button>
            ) : (
              <button className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed">
                Model Required
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mb-4">
              <Images className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">My Gallery</h3>
            <p className="text-gray-400 mb-4">
              View and download your generated headshots
            </p>
            <button 
              onClick={() => router.push('/gallery')}
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white py-3 rounded-lg font-semibold transition"
            >
              View Gallery →
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">How it Works</h3>
              <p className="text-gray-400 mb-4">
                Learn how to create professional AI headshots in under 60 seconds
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition">
                Watch Tutorial →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}