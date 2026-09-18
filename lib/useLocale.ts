'use client'

import { useState, useEffect } from 'react'
import { readLocaleClient, type Locale } from './i18n'

// Client-hook: geeft de gekozen taal (cookie), default EN tot na mount.
export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>('en')
  useEffect(() => { setLocale(readLocaleClient()) }, [])
  return locale
}
