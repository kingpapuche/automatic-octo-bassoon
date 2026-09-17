import { NextResponse, type NextRequest } from 'next/server'
import { currencyForCountry } from '@/lib/currency'
import { pickLocale } from '@/lib/i18n'

// Zet cookies op basis van de bezoeker:
// - nova_currency: munt op basis van land (Vercel geo-header)
// - nova_locale: taal op basis van de browsertaal (Accept-Language), enkel als de bezoeker nog niet zelf koos
export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const country = req.headers.get('x-vercel-ip-country')
  res.cookies.set('nova_currency', currencyForCountry(country), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  // Taal alleen auto-zetten als er nog geen keuze is (respecteer de taalkiezer van de klant)
  if (!req.cookies.get('nova_locale')) {
    res.cookies.set('nova_locale', pickLocale(req.headers.get('accept-language')), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return res
}

// Alleen op de pagina's waar prijzen getoond/gekozen worden
export const config = {
  matcher: ['/', '/buy-credits', '/pricing', '/styles'],
}
