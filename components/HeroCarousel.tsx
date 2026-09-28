'use client'

import { useState, useCallback, useEffect } from 'react'
import BeforeAfterSlider from './beforeafterslider'

// align: true = voor/na zijn al bijgesneden op dezelfde ooghoogte -> toon zonder extra zoom/verschuiving
export interface HeroExample { name: string; before: string; after: string; align?: boolean }

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

  // Laad alle voor/na-foto's vooraf in (en decodeer ze), zodat het wisselen naar het volgende
  // voorbeeld naadloos is en er geen half-geladen foto even doorschijnt.
  useEffect(() => {
    examples.forEach((ex) => {
      ;[ex.before, ex.after].forEach((src) => {
        const img = new Image()
        img.src = src
        if (img.decode) img.decode().catch(() => {})
      })
    })
  }, [examples])

  // Ga pas naar het volgende voorbeeld wanneer de slider zijn volledige cyclus heeft afgerond
  // (dus nooit midden in de terugweg). Klikken op een thumbnail springt naar dat voorbeeld
  // en laat de carrousel gewoon verder automatisch doorlopen.
  const advance = useCallback(() => {
    if (examples.length > 1) setIndex((i) => (i + 1) % examples.length)
  }, [examples.length])

  if (examples.length === 0) return null
  const cur = examples[index]

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <BeforeAfterSlider
        key={index}
        beforeImage={cur.before}
        afterImage={cur.after}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        onCycleEnd={advance}
        cyclesPerExample={2}
        align={cur.align}
      />

      {examples.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          {examples.map((ex, i) => (
            <button
              key={ex.name}
              onClick={() => setIndex(i)}
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
