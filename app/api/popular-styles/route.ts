import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { STYLE_CATEGORIES, POPULAR_FALLBACK } from '@/lib/createStyleCategories'

const THRESHOLD = 10   // minimaal aantal selecties voor "Populair"
const TOP_N = 10       // hoeveel stijlen maximaal een badge krijgen per geslacht
const MIN_REAL = 4     // te weinig echte populaire? -> startlijst gebruiken

// styleId -> geslacht
const GENDER_OF: Record<string, 'male' | 'female'> = {}
for (const cat of STYLE_CATEGORIES) {
  for (const s of cat.styles) GENDER_OF[s.id] = cat.gender
}

function topFor(counts: Record<string, number>, fallback: string[]): string[] {
  const popular = Object.entries(counts)
    .filter(([, c]) => c >= THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([id]) => id)
  return popular.length >= MIN_REAL ? popular : fallback
}

export async function GET() {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 90) // laatste 90 dagen
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('styles_used')
      .gte('created_at', since.toISOString())
    if (error) throw error

    const counts: { male: Record<string, number>; female: Record<string, number> } = { male: {}, female: {} }
    for (const g of data || []) {
      const styles: string[] = Array.isArray(g.styles_used) ? g.styles_used : []
      for (const s of styles) {
        const gen = GENDER_OF[s]
        if (gen) counts[gen][s] = (counts[gen][s] || 0) + 1
      }
    }

    const popular = {
      male: topFor(counts.male, POPULAR_FALLBACK.male),
      female: topFor(counts.female, POPULAR_FALLBACK.female),
    }

    return NextResponse.json(
      { popular },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch {
    return NextResponse.json({ popular: POPULAR_FALLBACK })
  }
}
