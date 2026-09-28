'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

/**
 * Self-hosted "how it works" demo video.
 * Shows a poster with a play overlay; on first click the native controls appear.
 * Files live in /public/videos (mp4 + poster + English captions).
 */
export default function DemoVideo({
  title,
  rounded = 'rounded-3xl',
  className = '',
}: {
  title: string
  rounded?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const start = () => {
    ref.current?.play()
    setStarted(true)
  }

  return (
    <div className={`relative aspect-video overflow-hidden ${rounded} shadow-xl bg-black ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        poster="/videos/how-it-works-poster.jpg"
        controls={started}
        preload="none"
        playsInline
        onEnded={() => {
          const v = ref.current
          if (v) {
            v.pause()
            v.currentTime = 0
          }
          setStarted(false)
        }}
      >
        {/* Geen <track>: de video bevat al ingebrande ondertitels. */}
        <source src="/videos/how-it-works.mp4" type="video/mp4" />
      </video>

      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={title}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 hover:bg-black/40 transition group cursor-pointer"
        >
          <span className="w-20 h-20 rounded-full bg-white/95 group-hover:scale-105 transition flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-[#5B4E9D] ml-1" fill="currentColor" />
          </span>
          <span className="mt-4 text-white text-sm font-medium drop-shadow px-4 text-center">{title}</span>
        </button>
      )}
    </div>
  )
}
