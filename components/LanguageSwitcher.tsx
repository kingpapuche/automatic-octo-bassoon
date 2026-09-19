'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { LOCALES, LOCALE_NAMES, writeLocaleClient, localizedPath, type Locale } from '@/lib/i18n'

interface Props {
  locale: Locale
  onChange?: (l: Locale) => void
  className?: string
}

export default function LanguageSwitcher({ locale, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Navigeer naar dezelfde pagina in de gekozen taal (wisselt de URL-prefix).
  const select = (l: Locale) => {
    writeLocaleClient(l)
    onChange?.(l)
    setOpen(false)
    router.push(localizedPath(pathname || '/', l))
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-sm">{locale}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E8E6E0] rounded-xl shadow-lg py-1.5 z-50">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => select(l)}
              className={`w-full text-left px-4 py-2 text-sm transition hover:bg-[#F0EEF8] ${
                l === locale ? 'text-[#5B4E9D] font-semibold' : 'text-[#4B4B4B]'
              }`}
            >
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
