'use client'

import { usePathname } from 'next/navigation'
import { localeFromPath, type Locale } from './i18n'

// De actieve taal komt uit de URL-prefix (/fr/…). Synchroon -> geen hydration-flikkering.
export function useLocale(): Locale {
  return localeFromPath(usePathname())
}
