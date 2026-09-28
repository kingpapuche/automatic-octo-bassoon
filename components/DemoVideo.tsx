'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { LOCALES, type Locale } from '@/lib/i18n'
import { useLocale } from '@/lib/useLocale'

// Zet op `true` zodra de video ZONDER ingebrande ondertitels live staat.
// Zolang dit `false` is, zijn de meertalige ondertitels wel beschikbaar in de
// spelermenu's, maar staat er GEEN standaard aan (zo geen dubbele ondertitels).
const SUBTITLES_DEFAULT_ON = false

const LANG_LABEL: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
}

/**
 * Self-hosted "how it works" demo video.
 * Shows a poster with a play overlay; on first click the native controls appear.
 * Files live in /public/videos (mp4 + poster + per-taal ondertitels .vtt).
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
  const locale = useLocale()

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
        <source src="/videos/how-it-works.mp4" type="video/mp4" />
        {/* Meertalige ondertitels — de taal van de bezoeker staat standaard aan
            (pas nadat de ingebrande ondertitels uit de video zijn; zie vlag hierboven). */}
        {LOCALES.map((loc) => (
          <track
            key={loc}
            kind="subtitles"
            src={`/videos/how-it-works.${loc}.vtt`}
            srcLang={loc}
            label={LANG_LABEL[loc]}
            default={SUBTITLES_DEFAULT_ON && loc === locale}
          />
        ))}
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
