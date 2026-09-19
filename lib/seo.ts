import { LOCALES, type Locale } from './i18n'

export const SITE = 'https://novaimago.ai'

// hreflang-map voor een pad (zonder locale-prefix), bv. '' (home), '/styles', '/about'.
export function altLanguages(path: string): Record<string, string> {
  const langs: Record<string, string> = {}
  for (const l of LOCALES) langs[l] = `/${l}${path}`
  langs['x-default'] = `/en${path}`
  return langs
}

// Open Graph locale-codes per taal.
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US', nl: 'nl_NL', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT', pt: 'pt_PT',
}
