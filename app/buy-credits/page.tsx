'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    credits: 40,
    price: 39,
    priceId: 'price_starter', // Update with real Stripe price ID later
    features: [
      '40 credits',
      '40 headshots (10 styles × 4)',
      'HD quality (1024×1024)',
      'Ready in under 30 minutes',
      'Download within 30 days',
    ],
  },
  {
    name: 'Pro',
    credits: 100,
    price: 49,
    priceId: 'price_pro', // Update with real Stripe price ID later
    popular: true,
    features: [
      '100 credits',
      '100 headshots (25 styles × 4)',
      '4K quality (2048×2048)',
      'Ready in under 30 minutes',
      'ALL premium styles unlocked',
      'Download within 30 days',
    ],
  },
]

export default function BuyCreditsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (plan: typeof plans[0]) => {
    if (!user) {
      router.push('/signup')
      return
    }

    setLoading(plan.name)
    
    // TODO: Implement Stripe checkout
    alert(`Coming soon! ${plan.name} pack - $${plan.price} for ${plan.credits} credits`)
    
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Buy Credits</h1>
          <p className="text-gray-400 text-lg">
            Choose your pack and start generating professional headshots
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border ${
                plan.popular ? 'border-yellow-500' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    🔥 Most Popular
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">one-time</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={loading === plan.name}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-slate-900'
                } disabled:opacity-50`}
              >
                {loading === plan.name ? 'Processing...' : `Get ${plan.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}