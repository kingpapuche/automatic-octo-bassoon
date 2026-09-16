import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/reviews?userId=... -> heeft deze klant al een review achtergelaten?
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('rating, review, allow_public')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    // Tabel bestaat mogelijk nog niet -> behandel als 'nog geen review' (kaartje toont gewoon het formulier)
    console.warn('reviews GET:', error.message)
    return NextResponse.json({ submitted: false })
  }
  return NextResponse.json({ submitted: !!data, review: data || null })
}

// POST /api/reviews -> review opslaan (1 per klant, upsert). Review is PRIVÉ: enkel de admin ziet 'm.
export async function POST(request: NextRequest) {
  try {
    const { userId, rating, review, allowPublic } = await request.json()
    if (!userId || !rating) {
      return NextResponse.json({ error: 'Missing userId or rating' }, { status: 400 })
    }

    // Naam + e-mail gedenormaliseerd opslaan zodat de admin ze altijd naast de review ziet
    const { data: u } = await supabaseAdmin
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .maybeSingle()

    const { error } = await supabaseAdmin
      .from('reviews')
      .upsert(
        {
          user_id: userId,
          email: u?.email ?? null,
          name: u?.full_name ?? null,
          rating,
          review: review ?? null,
          allow_public: allowPublic ?? true,
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('reviews POST:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save review' },
      { status: 500 }
    )
  }
}
