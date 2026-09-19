import { NextResponse, type NextRequest } from 'next/server'
import { currencyForCountry } from '@/lib/currency'
import { pickLocale, isLocale, type Locale } from '@/lib/i18n'

const YEAR = 60 * 60 * 24 * 365
const MONTH = 60 * 60 * 24 * 30

function setCookies(req: NextRequest, res: NextResponse, locale: Locale) {
  res.cookies.set('nova_currency', currencyForCountry(req.headers.get('x-vercel-ip-country')), {
    path: '/', maxAge: MONTH, sameSite: 'lax',
  })
  res.cookies.set('nova_locale', locale, { path: '/', maxAge: YEAR, sameSite: 'lax' })
}

// URL-routing per taal: elk pad krijgt een locale-prefix (/en/…, /fr/…).
// Zonder prefix -> redirect naar de taal uit de cookie, anders browsertaal, anders default.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const seg = pathname.split('/')[1]

  if (isLocale(seg)) {
    const res = NextResponse.next()
    setCookies(req, res, seg)
    return res
  }

  const cookieLoc = req.cookies.get('nova_locale')?.value
  const locale: Locale = isLocale(cookieLoc) ? cookieLoc : pickLocale(req.headers.get('accept-language'))
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  const res = NextResponse.redirect(url)
  setCookies(req, res, locale)
  return res
}

// Sla API, auth-callback, Next-assets en bestanden (met punt, bv. .png/.xml/.txt) over.
export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|.*\\..*).*)'],
}
