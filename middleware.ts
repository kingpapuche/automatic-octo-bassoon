import { NextResponse, type NextRequest } from 'next/server'
import { currencyForCountry } from '@/lib/currency'

// Zet een 'nova_currency' cookie op basis van het land van de bezoeker (Vercel geo-header).
// De client leest die cookie om de juiste munt te tonen; geen externe geo-API nodig.
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const country = req.headers.get('x-vercel-ip-country')
  res.cookies.set('nova_currency', currencyForCountry(country), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  return res
}

// Alleen op de pagina's waar prijzen getoond/gekozen worden
export const config = {
  matcher: ['/', '/buy-credits', '/pricing', '/styles'],
}
