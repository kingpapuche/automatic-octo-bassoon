'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F4] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-[#5B4E9D] to-[#0D9488] bg-clip-text text-transparent">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your credits have been added to your account. Let&apos;s create your headshots!
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">What happens next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold text-gray-800">1. Upload your photos</p>
                  <p className="text-sm text-gray-600">Upload 8–15 selfies so we can build your personal AI model.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-semibold text-gray-800">2. We train your model (~20–30 min)</p>
                  <p className="text-sm text-gray-600">We learn your face from your photos — this runs in the background.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold text-gray-800">3. Choose styles &amp; generate</p>
                  <p className="text-sm text-gray-600">Pick your looks and get your professional headshots.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            From your dashboard you can upload photos to train your model, or jump straight to generating if your model is ready.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-[#5B4E9D] to-[#0D9488] text-white px-8 py-4 rounded-2xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              Go to your dashboard →
            </Link>
            <Link href="/" className="text-[#5B4E9D] hover:text-[#7D6FB8] font-semibold transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
