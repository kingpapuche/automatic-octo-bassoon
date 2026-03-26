'use client'

import { useState, useEffect, useRef } from 'react'

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}) {
  const [sliderPosition, setSliderPosition] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationPhase, setAnimationPhase] = useState<'pause-left' | 'moving-right' | 'pause-right' | 'moving-left'>('pause-left')

  useEffect(() => {
    if (!isAutoAnimating) return

    let interval: NodeJS.Timeout

    if (animationPhase === 'pause-left') {
      interval = setTimeout(() => setAnimationPhase('moving-right'), 2000)
    } else if (animationPhase === 'pause-right') {
      interval = setTimeout(() => setAnimationPhase('moving-left'), 2000)
    } else if (animationPhase === 'moving-right') {
      interval = setInterval(() => {
        setSliderPosition((prev) => {
          if (prev >= 95) { setAnimationPhase('pause-right'); return 95 }
          return prev + 1
        })
      }, 20)
    } else if (animationPhase === 'moving-left') {
      interval = setInterval(() => {
        setSliderPosition((prev) => {
          if (prev <= 5) { setAnimationPhase('pause-left'); return 5 }
          return prev - 1
        })
      }, 20)
    }

    return () => clearInterval(interval)
  }, [isAutoAnimating, animationPhase])

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
    <div className="w-full max-w-[380px] mx-auto">
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
        {/* After Image (achtergrond) — ongewijzigd */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.1) translateY(15px)' }}
            draggable={false}
          />
          <div className="absolute top-3 right-3 bg-[#0D9488] text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image — zelfde zoom als after */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={beforeImage}
            alt="Before"
            className="h-full object-cover"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '285px',
              transform: 'scale(1.1) translateY(15px)',
            }}
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