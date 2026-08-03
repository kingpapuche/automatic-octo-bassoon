import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { STYLE_CATEGORIES } from '@/lib/createStyleCategories'

const ADMIN_EMAIL = 'novaimagosupport@gmail.com'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : null

// styleId -> { label, category, gender } opzoektabel
const STYLE_LOOKUP: Record<string, { label: string; category: string; gender: string }> = {}
for (const cat of STYLE_CATEGORIES) {
  for (const s of cat.styles) {
    STYLE_LOOKUP[s.id] = { label: s.label, category: cat.name, gender: cat.gender }
  }
}

type Sess = { amount: number; created: number; plan: string }

function startDateFor(period: string, now: Date): Date | null {
  const d = new Date(now)
  switch (period) {
    case 'day':   d.setDate(now.getDate() - 1); return d
    case 'week':  d.setDate(now.getDate() - 7); return d
    case 'month': d.setMonth(now.getMonth() - 1); return d
    case 'year':  d.setFullYear(now.getFullYear() - 1); return d
    case 'all':   return null
    default:      d.setMonth(now.getMonth() - 1); return d
  }
}

// Haal betaalde Stripe checkout-sessies op sinds een tijdstip (seconden).
async function fetchStripeSessions(sinceSec: number | null): Promise<Sess[]> {
  if (!stripe) return []
  const out: Sess[] = []
  let starting_after: string | undefined
  for (let i = 0; i < 25; i++) {
    const page: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
      limit: 100,
      ...(sinceSec ? { created: { gte: sinceSec } } : {}),
      ...(starting_after ? { starting_after } : {}),
    })
    for (const s of page.data) {
      const paid = s.payment_status === 'paid' || s.status === 'complete'
      if (paid && s.amount_total) {
        out.push({ amount: s.amount_total / 100, created: s.created, plan: s.metadata?.plan || 'onbekend' })
      }
    }
    if (!page.has_more || page.data.length === 0) break
    starting_after = page.data[page.data.length - 1].id
  }
  return out
}

interface Gen { styles_used: unknown; credits_used: number | null; status: string | null; created_at: string; user_id: string }
interface Usr { use_cases: unknown; gender: string | null; age_range: string | null; created_at: string }

// KPI's voor een venster (voor huidige + vorige periode -> vergelijking)
function kpis(gens: Gen[], users: Usr[], sessions: Sess[]) {
  const revenue = sessions.reduce((s, x) => s + x.amount, 0)
  const orders = sessions.length
  const signups = users.length
  const generations = gens.length
  const completed = gens.filter(g => g.status === 'completed').length
  const activeUsers = new Set(gens.map(g => g.user_id)).size
  return {
    revenue,
    orders,
    avgOrder: orders ? revenue / orders : 0,
    signups,
    generations,
    completed,
    activeUsers,
    // conversie signups -> betalende orders (ruwe indicatie)
    conversion: signups ? (orders / signups) * 100 : 0,
  }
}

function pct(cur: number, prev: number): number | null {
  if (!prev) return null
  return ((cur - prev) / prev) * 100
}

export async function POST(request: NextRequest) {
  try {
    // 1) Beveiliging: valideer Supabase sessie-token + admin-email
    const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token)
    if (authErr || userData?.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { period = 'month' } = await request.json().catch(() => ({}))
    const now = new Date()
    const start = startDateFor(period, now)
    // Vorige periode van gelijke lengte (voor vergelijking); niet bij 'all'
    const prevStart = start ? new Date(start.getTime() - (now.getTime() - start.getTime())) : null
    const fetchSince = prevStart || start // vanaf hier alles ophalen, daarna splitsen
    const fetchIso = fetchSince ? fetchSince.toISOString() : null
    const startMs = start ? start.getTime() : -Infinity

    // 2) Data ophalen (DB + Stripe)
    let genQ = supabaseAdmin.from('generations').select('styles_used, credits_used, status, created_at, user_id')
    if (fetchIso) genQ = genQ.gte('created_at', fetchIso)
    let usrQ = supabaseAdmin.from('users').select('use_cases, gender, age_range, created_at')
    if (fetchIso) usrQ = usrQ.gte('created_at', fetchIso)

    const [{ data: gensRaw, error: gErr }, { data: usrRaw, error: uErr }, allSessions] = await Promise.all([
      genQ,
      usrQ,
      fetchStripeSessions(fetchSince ? Math.floor(fetchSince.getTime() / 1000) : null),
    ])
    if (gErr) return NextResponse.json({ error: gErr.message }, { status: 500 })
    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 })

    const allGens = (gensRaw || []) as Gen[]
    const allUsers = (usrRaw || []) as Usr[]

    // 3) Splitsen in huidige vs vorige periode
    const curGens = allGens.filter(g => new Date(g.created_at).getTime() >= startMs)
    const prevGens = allGens.filter(g => new Date(g.created_at).getTime() < startMs)
    const curUsers = allUsers.filter(u => new Date(u.created_at).getTime() >= startMs)
    const prevUsers = allUsers.filter(u => new Date(u.created_at).getTime() < startMs)
    const curSess = allSessions.filter(s => s.created * 1000 >= startMs)
    const prevSess = allSessions.filter(s => s.created * 1000 < startMs)

    const cur = kpis(curGens, curUsers, curSess)
    const prev = kpis(prevGens, prevUsers, prevSess)
    const deltas: Record<string, number | null> = {}
    for (const k of Object.keys(cur) as (keyof typeof cur)[]) deltas[k] = pct(cur[k], prev[k])

    // 4) Breakdowns (huidige periode)
    const styleCounts: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}
    const styleGender: Record<string, number> = { male: 0, female: 0 }
    for (const g of curGens) {
      const styles: string[] = Array.isArray(g.styles_used) ? g.styles_used as string[] : []
      for (const sid of styles) {
        styleCounts[sid] = (styleCounts[sid] || 0) + 1
        const meta = STYLE_LOOKUP[sid]
        if (meta) {
          categoryCounts[meta.category] = (categoryCounts[meta.category] || 0) + 1
          if (meta.gender === 'male' || meta.gender === 'female') styleGender[meta.gender]++
        }
      }
    }
    const topStyles = Object.entries(styleCounts)
      .map(([id, count]) => ({ id, label: STYLE_LOOKUP[id]?.label || id, category: STYLE_LOOKUP[id]?.category || '—', count }))
      .sort((a, b) => b.count - a.count)
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

    const useCaseCounts: Record<string, number> = {}
    const audienceGender: Record<string, number> = {}
    const ageRanges: Record<string, number> = {}
    for (const u of curUsers) {
      const ucs: string[] = Array.isArray(u.use_cases) ? u.use_cases as string[] : []
      for (const uc of ucs) useCaseCounts[uc] = (useCaseCounts[uc] || 0) + 1
      if (u.gender) audienceGender[u.gender] = (audienceGender[u.gender] || 0) + 1
      if (u.age_range) ageRanges[u.age_range] = (ageRanges[u.age_range] || 0) + 1
    }
    const useCases = Object.entries(useCaseCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

    const revenueByPlan: Record<string, { revenue: number; orders: number }> = {}
    for (const s of curSess) {
      const p = revenueByPlan[s.plan] || { revenue: 0, orders: 0 }
      p.revenue += s.amount; p.orders += 1; revenueByPlan[s.plan] = p
    }
    const planBreakdown = Object.entries(revenueByPlan)
      .map(([plan, v]) => ({ plan, revenue: v.revenue, orders: v.orders }))
      .sort((a, b) => b.revenue - a.revenue)

    // 5) Volume + omzet over tijd (dag-buckets, of maand voor jaar/alles)
    const byMonth = period === 'year' || period === 'all'
    const keyOf = (ms: number) => {
      const dt = new Date(ms)
      return byMonth
        ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
        : `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    }
    const genBuckets: Record<string, number> = {}
    const revBuckets: Record<string, number> = {}
    for (const g of curGens) { const k = keyOf(new Date(g.created_at).getTime()); genBuckets[k] = (genBuckets[k] || 0) + 1 }
    for (const s of curSess) { const k = keyOf(s.created * 1000); revBuckets[k] = (revBuckets[k] || 0) + s.amount }
    const allKeys = Array.from(new Set([...Object.keys(genBuckets), ...Object.keys(revBuckets)])).sort()
    const timeline = allKeys.map(label => ({ label, generations: genBuckets[label] || 0, revenue: revBuckets[label] || 0 }))

    return NextResponse.json({
      period,
      stripeConnected: !!stripe,
      currency: 'EUR',
      kpis: cur,
      deltas,
      previous: prev,
      topStyles,
      categories,
      useCases,
      planBreakdown,
      audience: { gender: audienceGender, ageRanges },
      styleGender,
      timeline,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 })
  }
}
