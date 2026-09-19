'use client'

import { useState, useEffect, useRef } from 'react'

// Animatie-timing (sneller dan voorheen)
const PAUSE_MS = 900        // pauze aan elke kant
const END_PAUSE_MS = 600    // korte rust op "voor" voordat we naar het volgende voorbeeld gaan
const MOVE_INTERVAL_MS = 16 // ~60fps
const STEP = 2              // % per tick

type Phase = 'pause-left' | 'moving-right' | 'pause-right' | 'moving-left' | 'cycle-end'

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  onCycleEnd,
}: {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  onCycleEnd?: () => void
}) {
  const [sliderPosition, setSliderPosition] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationPhase, setAnimationPhase] = useState<Phase>('pause-left')

  // Bij een nieuw voorbeeld: netjes herstarten aan de linkerkant.
  useEffect(() => {
    setSliderPosition(5)
    setAnimationPhase('pause-left')
    setIsAutoAnimating(true)
  }, [beforeImage])

  // Animatie: pauze links → naar rechts → pauze rechts → naar links → korte rust → volgend voorbeeld.
  // De wissel naar het volgende voorbeeld gebeurt PAS bij 'cycle-end' (na de volledige terugweg),
  // dus nooit meer midden in de terugweg.
  useEffect(() => {
    if (!isAutoAnimating) return

    let interval: ReturnType<typeof setInterval> | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined

    if (animationPhase === 'pause-left') {
      timeout = setTimeout(() => setAnimationPhase('moving-right'), PAUSE_MS)
    } else if (animationPhase === 'pause-right') {
      timeout = setTimeout(() => setAnimationPhase('moving-left'), PAUSE_MS)
    } else if (animationPhase === 'moving-right') {
      interval = setInterval(() => {
        setSliderPosition((prev) => {
          if (prev >= 95) { setAnimationPhase('pause-right'); return 95 }
          return Math.min(prev + STEP, 95)
        })
      }, MOVE_INTERVAL_MS)
    } else if (animationPhase === 'moving-left') {
      interval = setInterval(() => {
        setSliderPosition((prev) => {
          if (prev <= 5) { setAnimationPhase('cycle-end'); return 5 }
          return Math.max(prev - STEP, 5)
        })
      }, MOVE_INTERVAL_MS)
    } else if (animationPhase === 'cycle-end') {
      // Volledige cyclus klaar: korte rust, dan (indien gewenst) door naar het volgende voorbeeld.
      timeout = setTimeout(() => {
        onCycleEnd?.()
        setAnimationPhase('pause-left')
      }, END_PAUSE_MS)
    }

    return () => { if (interval) clearInterval(interval); if (timeout) clearTimeout(timeout) }
  }, [isAutoAnimating, animationPhase, onCycleEnd])

  const handleInteractionStart = () => {
    setIsAutoAnimating(false)
    setIsDragging(true)
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
    setTimeout(() => {
      setIsAutoAnimating(true)
      setAnimationPhase('pause-left')
    }, 3000)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl border-2 border-white/30"
        style={{ aspectRatio: '9.5 / 14' }}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* After Image (achtergrond) */}
        <div className="absolute inset-0">
          <img src={afterImage} alt="After" className="w-full h-full object-cover" style={{ transform: 'scale(1.1) translateY(15px)' }} draggable={false} />
          <div className="absolute top-3 right-3 bg-[#0D9488] text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (overlay) — geklipt via clip-path zodat de foto ALTIJD op volle grootte
            blijft en alleen het zichtbare deel wordt afgesneden (geen sprong van klein naar groot). */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 18%' }}
            draggable={false}
          />
          <div className="absolute top-3 left-3 bg-[#6B6B6B] text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-[#5B4E9D]">
            <span className="text-[#5B4E9D] font-bold text-xs">↔</span>
          </div>
        </div>
      </div>
      <p className="text-center text-[#9B9B9B] text-xs mt-3">← Drag to compare →</p>
    </div>
  )
}