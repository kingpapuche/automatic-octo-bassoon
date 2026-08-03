import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Bepaal de verkeersbron uit referrer / utm_source
function sourceFrom(referrer: string, utmSource: string | null): string {
  if (utmSource) return utmSource.toLowerCase()
  if (!referrer) return 'direct'
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    if (host.includes('google')) return 'google'
    if (host.includes('instagram')) return 'instagram'
    if (host.includes('facebook') || host.startsWith('fb.') || host.includes('lm.facebook')) return 'facebook'
    if (host.includes('tiktok')) return 'tiktok'
    if (host.includes('linkedin') || host.includes('lnkd.in')) return 'linkedin'
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'twitter/x'
    if (host.includes('bing')) return 'bing'
    if (host.includes('duckduckgo')) return 'duckduckgo'
    if (host.includes('reddit')) return 'reddit'
    if (host.includes('youtube')) return 'youtube'
    if (host.includes('pinterest')) return 'pinterest'
    return host
  } catch {
    return 'direct'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path, referrer = '', visitorId, utmSource } = await request.json()
    if (!visitorId) return NextResponse.json({ ok: false }, { status: 200 })

    // Eigen host niet als verkeersbron tellen (interne navigatie = direct)
    const self = request.headers.get('host') || ''
    const ref = referrer && self && !referrer.includes(self) ? referrer : ''

    const { error } = await supabaseAdmin.from('page_views').insert({
      visitor_id: String(visitorId).slice(0, 64),
      path: String(path || '/').slice(0, 300),
      referrer: String(ref).slice(0, 300),
      source: sourceFrom(ref, utmSource || null),
    })
    // Tabel bestaat nog niet? Stil negeren zodat de site nooit breekt.
    if (error && !/relation .*page_views.* does not exist/i.test(error.message)) {
      console.error('track insert error:', error.message)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
