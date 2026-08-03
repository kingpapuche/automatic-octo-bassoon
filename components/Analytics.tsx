'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getVisitorId(): string {
  try {
    let id = localStorage.getItem('nv_vid')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('nv_vid', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

// Registreert elke paginaweergave (first-party, privacy-vriendelijk: geen persoonsdata,
// enkel een willekeurige bezoeker-id in localStorage + pad + verkeersbron).
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      // admin-dashboard niet als bezoek tellen
      if (pathname?.startsWith('/admin')) return
      const params = new URLSearchParams(window.location.search)
      const body = JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
        visitorId: getVisitorId(),
        utmSource: params.get('utm_source'),
      })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      }
    } catch {
      /* nooit de pagina breken */
    }
  }, [pathname])

  return null
}
