// Centrale i18n-helpers (client + edge veilig). Cookie-gebaseerd (geen URL-routing);
// SEO-URLs (/fr/…) zijn een latere groei-stap.

export const LOCALES = ['en', 'nl', 'fr', 'de', 'es', 'it', 'pt'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v)
}

// Kies een ondersteunde taal uit een Accept-Language header (edge-safe)
export function pickLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const parts = acceptLanguage.split(',').map((p) => p.trim().split(';')[0].slice(0, 2).toLowerCase())
  for (const p of parts) if (isLocale(p)) return p
  return DEFAULT_LOCALE
}

// Client: lees de locale-cookie (gezet door middleware of taalkiezer)
export function readLocaleClient(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const m = document.cookie.match(/(?:^|;\s*)nova_locale=([a-z]{2})/)
  return isLocale(m?.[1]) ? (m![1] as Locale) : DEFAULT_LOCALE
}

// Client: bewaar de taalkeuze
export function writeLocaleClient(locale: Locale) {
  try {
    document.cookie = `nova_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  } catch {}
}
