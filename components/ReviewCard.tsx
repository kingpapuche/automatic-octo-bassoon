'use client'

import { useEffect, useState } from 'react'

interface ReviewCardProps {
  userId: string
}

// Privé review-kaartje. Verschijnt op het piekmoment (gallerij, net na het genereren).
// Wordt na indienen een bedankje; toont zich niet opnieuw als de klant al een review gaf.
export default function ReviewCard({ userId }: ReviewCardProps) {
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [allowPublic, setAllowPublic] = useState(true) // standaard aan (opt-out), net als foto-toestemming
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch(`/api/reviews?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => { if (active && d?.submitted) setSubmitted(true) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [userId])

  const submit = async () => {
    if (rating === 0) { setError('Please select a star rating'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rating, review: text, allowPublic }),
      })
      if (!res.ok) { setError('Something went wrong. Please try again.'); setSending(false); return }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
      setSending(false)
    }
  }

  if (loading) return null

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-6 mb-8 text-center">
        <p className="text-2xl mb-1">🙏</p>
        <p className="text-white font-semibold">Thanks for your feedback!</p>
        <p className="text-white/50 text-sm mt-1">It really helps us improve Nova Imago.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 mb-8">
      <h3 className="text-white font-bold text-lg">How was your experience?</h3>
      <p className="text-white/50 text-sm mb-4">Your feedback is private — only the Nova Imago team sees it.</p>

      {/* Sterren */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl leading-none transition-transform hover:scale-110"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <span className={(hover || rating) >= n ? 'text-yellow-400' : 'text-white/20'}>★</span>
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us what you think... (optional)"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 resize-none"
      />

      {/* Toestemming -> standaard aan; klant vinkt zelf uit als hij niet akkoord gaat */}
      <label className="flex items-start gap-3 cursor-pointer mt-4" onClick={() => setAllowPublic(!allowPublic)}>
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          allowPublic ? 'bg-violet-600 border-violet-600' : 'bg-white/5 border-white/20'
        }`}>
          {allowPublic && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="text-white/70 text-sm">You may use my review as an example</span>
      </label>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <button
        onClick={submit}
        disabled={sending}
        className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Submit review'}
      </button>
    </div>
  )
}
