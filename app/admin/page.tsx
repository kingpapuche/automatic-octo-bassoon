'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'novaimagosupport@gmail.com'

const PERIODS = [
  { id: 'day',   label: 'Dag' },
  { id: 'week',  label: 'Week' },
  { id: 'month', label: 'Maand' },
  { id: 'year',  label: 'Jaar' },
  { id: 'all',   label: 'Alles' },
]

const USE_CASE_LABELS: Record<string, string> = {
  website: 'Website / About Us',
  'social-media': 'Social media',
  cv: 'CV / Resume',
  dating: 'Dating',
  portfolio: 'Portfolio',
  'business-cards': 'Visitekaartjes',
  'online-platforms': 'Online platforms',
  other: 'Anders',
}

const eur = (n: number) => new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(n || 0)
const num = (n: number) => new Intl.NumberFormat('nl-BE').format(n || 0)

interface Analytics {
  stripeConnected: boolean
  kpis: { revenue: number; orders: number; avgOrder: number; signups: number; generations: number; completed: number; activeUsers: number; conversion: number }
  deltas: Record<string, number | null>
  topStyles: { id: string; label: string; category: string; count: number }[]
  categories: { name: string; count: number }[]
  useCases: { name: string; count: number }[]
  planBreakdown: { plan: string; revenue: number; orders: number }[]
  audience: { gender: Record<string, number>; ageRanges: Record<string, number> }
  styleGender: Record<string, number>
  timeline: { label: string; generations: number; revenue: number }[]
  traffic: { available: boolean; visits: number; uniqueVisitors: number; visitsDelta: number | null; visitorsDelta: number | null; sources: { name: string; count: number }[]; topPages: { name: string; count: number }[] }
  funnel: { visitors: number; signups: number; orders: number; visitorToSignup: number | null; signupToOrder: number | null }
}

function Delta({ v }: { v: number | null }) {
  if (v === null || !isFinite(v)) return <span className="text-white/30 text-xs">—</span>
  const up = v >= 0
  return (
    <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? '▲' : '▼'} {Math.abs(v).toFixed(0)}%
    </span>
  )
}

function Kpi({ label, value, delta, hint }: { label: string; value: string; delta?: number | null; hint?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="text-white/50 text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-1 flex items-end gap-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {delta !== undefined && <div className="mb-1"><Delta v={delta} /></div>}
      </div>
      {hint && <div className="text-white/40 text-xs mt-1">{hint}</div>}
    </div>
  )
}

function BarList({ title, items, max, fmt }: { title: string; items: { label: string; sub?: string; count: number }[]; max: number; fmt?: (n: number) => string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      {items.length === 0 && <div className="text-white/40 text-sm">Nog geen data in deze periode.</div>}
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80 truncate pr-2">{it.label}{it.sub && <span className="text-white/40"> · {it.sub}</span>}</span>
              <span className="text-white/60 font-medium tabular-nums">{fmt ? fmt(it.count) : num(it.count)}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${max ? (it.count / max) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [period, setPeriod] = useState('month')
  const [data, setData] = useState<Analytics | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  const load = useCallback(async () => {
    setBusy(true); setErr(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ period }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Fout ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Fout bij laden')
    } finally {
      setBusy(false)
    }
  }, [period])

  useEffect(() => { if (isAdmin) load() }, [isAdmin, load])

  if (loading) return <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-white/60">Laden…</div>
  if (!user || !isAdmin) return (
    <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-center px-6">
      <div>
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="text-white text-xl font-bold mb-1">Geen toegang</h1>
        <p className="text-white/50 text-sm">Deze pagina is alleen voor de beheerder.</p>
      </div>
    </div>
  )

  const k = data?.kpis
  const d = data?.deltas || {}
  const maxStyle = Math.max(1, ...(data?.topStyles || []).map(s => s.count))
  const maxCat = Math.max(1, ...(data?.categories || []).map(s => s.count))
  const maxUse = Math.max(1, ...(data?.useCases || []).map(s => s.count))
  const maxTl = Math.max(1, ...(data?.timeline || []).map(t => t.generations))
  const maxRev = Math.max(1, ...(data?.timeline || []).map(t => t.revenue))

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Nova Imago — Dashboard</h1>
            <p className="text-white/40 text-sm">Business & gebruiksstatistieken</p>
          </div>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${period === p.id ? 'bg-indigo-500 text-white' : 'text-white/60 hover:text-white'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {err && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 mb-4 text-sm">{err}</div>}
        {busy && !data && <div className="text-white/40">Statistieken laden…</div>}

        {data && k && (
          <>
            {!data.stripeConnected && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-3 mb-4 text-sm">
                Stripe niet verbonden — omzetcijfers zijn €0 tot <code>STRIPE_SECRET_KEY</code> is ingesteld.
              </div>
            )}

            {/* KPI's */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <Kpi label="Omzet" value={eur(k.revenue)} delta={d.revenue} />
              <Kpi label="Orders" value={num(k.orders)} delta={d.orders} />
              <Kpi label="Gem. orderwaarde" value={eur(k.avgOrder)} delta={d.avgOrder} />
              <Kpi label="Nieuwe signups" value={num(k.signups)} delta={d.signups} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Kpi label="Conversie" value={`${k.conversion.toFixed(1)}%`} delta={d.conversion} hint="orders ÷ signups" />
              <Kpi label="Generaties" value={num(k.generations)} delta={d.generations} hint={`${num(k.completed)} voltooid`} />
              <Kpi label="Actieve klanten" value={num(k.activeUsers)} delta={d.activeUsers} hint="genereerden deze periode" />
              <Kpi label="Betaald / plan" value={num(data.planBreakdown.reduce((s, p) => s + p.orders, 0))} hint={`${data.planBreakdown.length} plannen`} />
            </div>

            {/* Timeline */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <h3 className="text-white font-semibold mb-4">Verloop (generaties & omzet)</h3>
              {data.timeline.length === 0 ? (
                <div className="text-white/40 text-sm">Nog geen data in deze periode.</div>
              ) : (
                <div className="flex items-end gap-1 h-40 overflow-x-auto">
                  {data.timeline.map((t, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 min-w-[26px] flex-1" title={`${t.label} · ${t.generations} gen · ${eur(t.revenue)}`}>
                      <div className="w-full flex items-end justify-center gap-0.5 h-32">
                        <div className="w-1/2 bg-indigo-500 rounded-t" style={{ height: `${(t.generations / maxTl) * 100}%` }} />
                        <div className="w-1/2 bg-emerald-500 rounded-t" style={{ height: `${(t.revenue / maxRev) * 100}%` }} />
                      </div>
                      <div className="text-[9px] text-white/40 rotate-0 truncate w-full text-center">{t.label.slice(5)}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-4 mt-3 text-xs text-white/50">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-sm inline-block" /> Generaties</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Omzet</span>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <BarList title="Top stijlen" max={maxStyle} items={data.topStyles.slice(0, 15).map(s => ({ label: s.label, sub: s.category, count: s.count }))} />
              <BarList title="Categorieën" max={maxCat} items={data.categories.map(c => ({ label: c.name, count: c.count }))} />
              <BarList title="Waarvoor (klantdoel)" max={maxUse} items={data.useCases.map(u => ({ label: USE_CASE_LABELS[u.name] || u.name, count: u.count }))} />
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Omzet per plan</h3>
                {data.planBreakdown.length === 0 && <div className="text-white/40 text-sm">Nog geen betaalde orders.</div>}
                <div className="space-y-2">
                  {data.planBreakdown.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
                      <span className="text-white/80 capitalize">{p.plan}</span>
                      <span className="text-white/60">{num(p.orders)} orders · <span className="text-emerald-400 font-medium">{eur(p.revenue)}</span></span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <h4 className="text-white/70 text-sm font-semibold mb-2">Publiek</h4>
                  <div className="text-sm text-white/60 space-y-1">
                    <div>Geslacht: {Object.entries(data.audience.gender).map(([g, n]) => `${g} ${n}`).join(' · ') || '—'}</div>
                    <div>Leeftijd: {Object.entries(data.audience.ageRanges).map(([a, n]) => `${a}: ${n}`).join(' · ') || '—'}</div>
                    <div>Stijl-keuze m/v: man {data.styleGender.male || 0} · vrouw {data.styleGender.female || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verkeer & funnel */}
            {!data.traffic.available ? (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl p-5 text-sm">
                <span className="font-semibold">Verkeer-tracking nog niet actief.</span> Maak eenmalig de <code>page_views</code>-tabel aan in Supabase (SQL staat klaar), daarna verschijnen hier automatisch bezoeken, unieke bezoekers, verkeersbron en de funnel.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <Kpi label="Bezoeken" value={num(data.traffic.visits)} delta={data.traffic.visitsDelta} />
                  <Kpi label="Unieke bezoekers" value={num(data.traffic.uniqueVisitors)} delta={data.traffic.visitorsDelta} />
                  <Kpi label="Bezoek → signup" value={data.funnel.visitorToSignup !== null ? `${data.funnel.visitorToSignup.toFixed(1)}%` : '—'} />
                  <Kpi label="Signup → koop" value={data.funnel.signupToOrder !== null ? `${data.funnel.signupToOrder.toFixed(1)}%` : '—'} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <BarList title="Verkeersbron" max={Math.max(1, ...data.traffic.sources.map(s => s.count))}
                    items={data.traffic.sources.map(s => ({ label: s.name.charAt(0).toUpperCase() + s.name.slice(1), count: s.count }))} />
                  <BarList title="Populairste pagina's" max={Math.max(1, ...data.traffic.topPages.map(s => s.count))}
                    items={data.traffic.topPages.map(s => ({ label: s.name, count: s.count }))} />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-4">
                  <h3 className="text-white font-semibold mb-3">Funnel</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 bg-indigo-500/20 border border-indigo-500/40 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">{num(data.funnel.visitors)}</div><div className="text-white/50 text-xs">bezoekers</div>
                    </div>
                    <span className="text-white/30">→</span>
                    <div className="flex-1 bg-indigo-500/30 border border-indigo-500/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">{num(data.funnel.signups)}</div><div className="text-white/50 text-xs">signups</div>
                    </div>
                    <span className="text-white/30">→</span>
                    <div className="flex-1 bg-emerald-500/30 border border-emerald-500/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">{num(data.funnel.orders)}</div><div className="text-white/50 text-xs">betaald</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
