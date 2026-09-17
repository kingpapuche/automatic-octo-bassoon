'use client'

import { useState, useEffect } from 'react'
import BeforeAfterSlider from './beforeafterslider'

export interface HeroExample { name: string; before: string; after: string }

// Carrousel van voor/na-voorbeelden (BetterPic-stijl): slider + klikbare thumbnails eronder.
// Schuift automatisch door naar het volgende voorbeeld na één volledige slide-cyclus (~8s).
export default function HeroCarousel({
  examples,
  beforeLabel,
  afterLabel,
}: {
  examples: HeroExample[]
  beforeLabel: string
  afterLabel: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || examples.length <= 1) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % examples.length), 8000)
    return () => clearTimeout(t)
  }, [index, paused, examples.length])

  if (examples.length === 0) return null
  const cur = examples[index]

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* key={index} -> slider herstart z'n animatie netjes bij elk nieuw voorbeeld */}
      <BeforeAfterSlider
        key={index}
        beforeImage={cur.before}
        afterImage={cur.after}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />

      {examples.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          {examples.map((ex, i) => (
            <button
              key={ex.name}
              onClick={() => { setIndex(i); setPaused(true) }}
              aria-label={ex.name}
              className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                i === index ? 'border-[#5B4E9D] scale-110 shadow-md' : 'border-white/70 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={ex.after} alt={ex.name} className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
