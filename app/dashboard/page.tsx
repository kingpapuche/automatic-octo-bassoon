'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard, Upload, Sparkles, Play, Wand2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [credits, setCredits] = useState(0)
  const [loadingCredits, setLoadingCredits] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup')
    }

    if (user) {
      const fetchCredits = async () => {
        const { data } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setCredits(data.credits)
        }
        setLoadingCredits(false)
      }
      fetchCredits()
    }
  }, [user, loading, router])

  if (loading || loadingCredits) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
            <div className="text-sm opacity-90 mb-1">Your Credits</div>
            <div className="text-5xl font-bold">{credits}</div>
            <div className="text-sm opacity-90 mt-2">
              Each credit = 1 style (4 photo variations)
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
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

          {/* Upload Photos */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Train a Model</h3>
            <p className="text-gray-400 mb-4">
              Upload 10-20 selfies to create your custom AI
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition">
              Start Training →
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
            <button className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed">
              Model Required
            </button>
          </div>
        </div>

        {/* How it Works Video Card */}
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