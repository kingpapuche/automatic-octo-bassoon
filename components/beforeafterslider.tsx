'use client'

import { useState, useRef } from 'react'

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
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInteractionStart = () => setIsDragging(true)
  const handleInteractionEnd = () => setIsDragging(false)

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

        {/* Before Image — zelfde zoom en positie, beweegt niet */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={beforeImage}
            alt="Before"
            className="h-full object-cover object-top"
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