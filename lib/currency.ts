// Centrale bron voor munt + prijzen (client + server veilig, geen secrets).
// EU/Europa -> EUR, rest van de wereld -> USD. Zelfde ronde ankers per markt (geen live FX).

export type Currency = 'EUR' | 'USD'
export type TierId = 'starter' | 'pro' | 'premium'

// Europese landen -> EUR. Rest (incl. VS) -> USD.
const EUR_COUNTRIES = new Set([
  // EU27
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  // EEA + overig Europa
  'IS','LI','NO','CH','GB','MC','AD','SM','VA',
])

export function currencyForCountry(country?: string | null): Currency {
  if (!country) return 'EUR' // onbekend/lokaal -> thuismarkt
  return EUR_COUNTRIES.has(country.toUpperCase()) ? 'EUR' : 'USD'
}

export const CURRENCY_SYMBOL: Record<Currency, string> = { EUR: '€', USD: '$' }

// Actuele prijs per pakket
export const TIER_PRICE: Record<Currency, Record<TierId, number>> = {
  EUR: { starter: 29, pro: 39, premium: 59 },
  USD: { starter: 35, pro: 45, premium: 69 },
}

// Doorgestreepte "was"-ankers (marketing), per markt
export const TIER_ANCHOR: Record<Currency, Record<TierId, number>> = {
  EUR: { starter: 39, pro: 55, premium: 79 },
  USD: { starter: 49, pro: 65, premium: 89 },
}

// Client: lees de currency-cookie die de middleware zet (default EUR)
export function readCurrencyClient(): Currency {
  if (typeof document === 'undefined') return 'EUR'
  const m = document.cookie.match(/(?:^|;\s*)nova_currency=(EUR|USD)/)
  return (m?.[1] as Currency) || 'EUR'
}
