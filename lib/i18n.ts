// Centrale i18n-helpers (client + edge veilig).
// URL-routing: elke taal heeft een eigen prefix (/en/…, /fr/…) voor SEO (hreflang).

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

// Client: bewaar de taalkeuze (blijft handig als hint voor de root-redirect)
export function writeLocaleClient(locale: Locale) {
  try {
    document.cookie = `nova_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  } catch {}
}

// Haal de locale uit het eerste pad-segment (bv. /fr/styles -> 'fr'); fallback = default.
export function localeFromPath(pathname: string | null | undefined): Locale {
  const seg = (pathname || '/').split('/')[1]
  return isLocale(seg) ? seg : DEFAULT_LOCALE
}

// Zet een locale-prefix op een intern pad (verwijdert eerst een bestaande prefix).
// Externe links, mailto en pure #-ankers blijven ongewijzigd.
export function localizedPath(href: string, locale: Locale): string {
  if (!href || href[0] !== '/') return href
  const parts = href.split('/')
  if (isLocale(parts[1])) parts.splice(1, 1)
  const rest = parts.join('/')
  return rest === '/' || rest === '' ? `/${locale}` : `/${locale}${rest}`
}
