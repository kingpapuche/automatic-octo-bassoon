import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { POPULAR_FALLBACK } from '@/lib/createStyleCategories'

const THRESHOLD = 10   // minimaal aantal selecties voor "Populair"
const TOP_N = 10       // hoeveel stijlen maximaal een badge krijgen
const MIN_REAL = 4     // te weinig echte populaire? -> startlijst gebruiken

export async function GET() {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 90) // laatste 90 dagen
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('styles_used')
      .gte('created_at', since.toISOString())
    if (error) throw error

    const counts: Record<string, number> = {}
    for (const g of data || []) {
      const styles: string[] = Array.isArray(g.styles_used) ? g.styles_used : []
      for (const s of styles) counts[s] = (counts[s] || 0) + 1
    }
    const popular = Object.entries(counts)
      .filter(([, c]) => c >= THRESHOLD)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N)
      .map(([id]) => id)

    const result = popular.length >= MIN_REAL ? popular : POPULAR_FALLBACK

    return NextResponse.json(
      { popular: result },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch {
    return NextResponse.json({ popular: POPULAR_FALLBACK })
  }
}
