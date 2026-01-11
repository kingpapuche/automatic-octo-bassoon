'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [orderStatus, setOrderStatus] = useState<string>('checking')

  useEffect(() => {
    if (!orderId) return

    // Check order status
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/check-order?order_id=${orderId}`)
        const data = await response.json()
        setOrderStatus(data.status || 'unknown')
      } catch (err) {
        console.error('Error checking order:', err)
        setOrderStatus('error')
      }
    }

    checkStatus()
    
    // Poll every 3 seconds to check if status changed to 'paid'
    const interval = setInterval(checkStatus, 3000)
    
    return () => clearInterval(interval)
  }, [orderId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F4] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-[#5B4E9D] to-[#0D9488] bg-clip-text text-transparent">
            Payment Successful! 🎉
          </h1>

          {/* Status */}
          <div className="mb-8">
            {orderStatus === 'checking' && (
              <p className="text-lg text-gray-600">
                Verifying your payment...
              </p>
            )}
            
            {orderStatus === 'pending' && (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Payment is being processed...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B4E9D]"></div>
                </div>
              </div>
            )}

            {orderStatus === 'paid' && (
              <div>
                <p className="text-lg text-gray-600 mb-4">
                  Your payment has been confirmed!
                </p>
                <p className="text-base text-gray-500">
                  We're generating your AI headshots now. This usually takes 5-10 minutes.
                </p>
              </div>
            )}

            {orderStatus === 'processing' && (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  AI is generating your headshots...
                </p>
                <div className="flex justify-center">
                  <div className="animate-pulse text-4xl">🎨</div>
                </div>
              </div>
            )}

            {orderStatus === 'completed' && (
              <div>
                <p className="text-lg text-green-600 font-semibold mb-4">
                  Your headshots are ready! ✨
                </p>
                <Link
                 href={`/results/${orderId}`}
                  className="inline-block bg-gradient-to-r from-[#5B4E9D] to-[#0D9488] text-white px-8 py-4 rounded-2xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  View Your Headshots
                </Link>
              </div>
            )}

            {orderStatus === 'error' && (
              <p className="text-lg text-red-600">
                There was an error checking your order. Please contact support.
              </p>
            )}
          </div>

          {/* Order ID */}
          {orderId && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Order ID</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {orderId}
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              What happens next?
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-800">Email confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email shortly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-semibold text-gray-800">AI generation (5-10 min)</p>
                  <p className="text-sm text-gray-600">
                    Our AI is creating professional headshots from your photos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📥</span>
                <div>
                  <p className="font-semibold text-gray-800">Download ready</p>
                  <p className="text-sm text-gray-600">
                    We'll email you when your headshots are ready to download
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Home Button */}
          <div className="mt-8">
            <Link
              href="/"
              className="text-[#5B4E9D] hover:text-[#7D6FB8] font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}