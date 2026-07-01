'use client'

import { useState } from 'react'

// Toont per stijl een voorbeeldfoto uit Supabase Storage:
//   headshots/style-examples/<styleId>.webp
// Bestaat het bestand niet (nog niet geüpload)? -> emoji-fallback.
// Het "voorbeeld"-labeltje maakt duidelijk dat het illustratief is (jouw foto's variëren).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export default function StyleThumb({
  styleId,
  icon,
  label,
}: {
  styleId: string
  icon: string
  label: string
}) {
  const [ok, setOk] = useState(true)
  const url = `${SUPABASE_URL}/storage/v1/object/public/headshots/style-examples/${styleId}.webp`

  return (
    <div className="relative w-full aspect-[3/4] mb-2 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
      {ok ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            loading="lazy"
            onError={() => setOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute bottom-1 right-1 bg-black/55 text-white/80 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider">
            voorbeeld
          </span>
        </>
      ) : (
        <span className="text-3xl">{icon}</span>
      )}
    </div>
  )
}
