'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const { signInWithMagicLink, signInWithGoogle } = useAuth()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithMagicLink(email)
      setMagicLinkSent(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send magic link'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google'
      setError(errorMessage)
      setLoading(false)
    }
  }

  // Magic link sent confirmation screen
  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check your email to continue</h1>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a magic link to <span className="font-semibold">{email}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Tip: it might be in your spam folder
          </p>
          
          <button
            onClick={() => setMagicLinkSent(false)}
            className="flex items-center gap-2 text-[#5B4E9D] font-semibold hover:text-[#483A7C] mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-8 items-center">
        
        {/* Left side - Hero image with testimonial */}
        <div className="hidden lg:block flex-1">
          <div className="relative">
            <div className="aspect-[9/16] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-headshot.webp"
                alt="AI Generated Professional Headshot"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            
            {/* Floating testimonial */}
            <div className="absolute bottom-8 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-white text-sm italic">
                
              </p>
              <p className="text-white/60 text-sm mt-2"></p>
            </div>
            
            {/* AI badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              AI Generated
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-xl">

            {/* Logo */}
            <div className="flex items-center mb-6">
              <span className="font-serif text-2xl text-[#2D2D2D] tracking-tight">Nova <em>Imago</em></span>
            </div>
            
            <h1 className="text-2xl font-bold mb-1">Transform Selfies into Professional Photos</h1>
            <p className="text-gray-600 mb-6">Sign up to create your photos</p>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition disabled:opacity-50 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5B4E9D] focus:border-transparent outline-none transition"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] hover:from-[#483A7C] hover:to-[#5B4E9D] text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition shadow-lg"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
            
            {/* Trust badges */}
            <div className="mt-8 space-y-3">
              {[
                'Profile-Worthy Guarantee',
                'Your photos in under 30 minutes',
                'We respect your privacy',
                'No subscription, pay once',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}