'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface PricingTier {
  id: string
  name: string
  price: number
  credits: number
  headshots: number
  features: string[]
  popular?: boolean
  icon: string
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 29,
    credits: 40,
    headshots: 40,
    icon: '📸',
    features: [
      'Create 1 AI Model',
      '40 headshots',
      'Choose Outfits & Styles',
      'High Resolution 2K Images',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: 39,
    credits: 80,
    headshots: 80,
    icon: '⭐',
    popular: true,
    features: [
      'Create 1 AI Model',
      '80 headshots',
      'High Resolution 4K Images',
      'Choose Outfits & Styles',
      'Premium Styles',
      'Priority Generation',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    price: 49,
    credits: 120,
    headshots: 120,
    icon: '✨',
    features: [
      'Create 2 AI Models',
      '120 headshots',
      'High Resolution 4K Images',
      'Choose Outfits & Styles',
      'Premium Styles',
      'Priority Support',
      'Early Access to New Features',
    ],
  },
]

export default function BuyCreditsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(userData)
      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handlePurchase = async (tier: PricingTier) => {
    if (!user) return
    
    setPurchasing(tier.id)
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          priceId: tier.id,
          credits: tier.credits,
          amount: tier.price,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setPurchasing(null)
    }
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0f1a]/90 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/25">
              AI
            </div>
            <span className="font-semibold text-xl text-white tracking-tight">
              Nova Imago
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/create" className="text-gray-400 hover:text-white transition font-medium">
              Create
            </Link>
            <Link href="/gallery" className="text-gray-400 hover:text-white transition font-medium">
              Gallery
            </Link>
            {user && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <span className="text-violet-400 text-sm">✦</span>
                <span className="text-white font-semibold">{user.credits}</span>
                <span className="text-gray-400 text-sm">credits</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Choose Your Pack
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              One-time payment. No subscription. Generate professional AI headshots in minutes.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-b from-violet-600/20 to-transparent border-2 border-violet-500/50 scale-105 shadow-2xl shadow-violet-500/20'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-4xl mb-4">{tier.icon}</div>
                <h2 className="text-xl font-bold text-white mb-1">{tier.name}</h2>
                <p className="text-gray-400 text-sm mb-6">{tier.credits} credits</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${tier.price}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-sm ${tier.popular ? 'text-white' : 'text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier)}
                  disabled={purchasing === tier.id}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  {purchasing === tier.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Purchase'
                  )}
                </button>

                <p className="text-center text-gray-500 text-xs mt-4">
                  One-time payment • No subscription
                </p>
              </div>
            ))}
          </div>

          {/* GUARANTEE BANNER */}
          <div className="mt-10 bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-white font-bold text-xl mb-3">Profile-Worthy Guarantee</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              Not every photo will be perfect — that&apos;s the nature of AI. But we guarantee you&apos;ll get at least <span className="text-white font-semibold">1 profile-worthy headshot</span> in every order. If not, we refund you in full within 7 days. No forms, no hassle.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {['Full refund within 7 days', 'No questions asked', 'No forms or hassle'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm mb-6">Secure payment powered by Stripe</p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="text-sm">Profile-Worthy Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Instant Delivery</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">How does it work?</h3>
                <p className="text-gray-400 text-sm">
                  Upload 10-15 selfies, our AI trains a model of your face, then generate unlimited professional headshots in any style you choose.
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">How long does it take?</h3>
                <p className="text-gray-400 text-sm">
                  Training takes about 15-20 minutes. After that, generating each headshot takes just a few seconds.
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Can I get a refund?</h3>
                <p className="text-gray-400 text-sm">
                  Yes! We guarantee at least 1 profile-worthy headshot in every order. If not, contact us within 7 days for a full refund. No forms, no hassle.
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">What resolution are the images?</h3>
                <p className="text-gray-400 text-sm">
                  Starter pack includes 2K resolution. Pro and Premium packs include 4K high-resolution images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}