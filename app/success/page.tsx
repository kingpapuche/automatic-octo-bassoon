'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/useLocale'
import { DASHBOARD } from '@/lib/messages/dashboard'

export default function SuccessPage() {
  const t = DASHBOARD[useLocale()].success
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
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t.subtitle}
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.whatNext}</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold text-gray-800">{t.s1t}</p>
                  <p className="text-sm text-gray-600">{t.s1d}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-semibold text-gray-800">{t.s2t}</p>
                  <p className="text-sm text-gray-600">{t.s2d}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold text-gray-800">{t.s3t}</p>
                  <p className="text-sm text-gray-600">{t.s3d}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            {t.note}
          </p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-[#5B4E9D] to-[#0D9488] text-white px-8 py-4 rounded-2xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {t.goDashboard}
            </Link>
            <Link href="/" className="text-[#5B4E9D] hover:text-[#7D6FB8] font-semibold transition-colors">
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
