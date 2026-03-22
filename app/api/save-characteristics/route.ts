import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      full_name,
      gender,
      ethnicity,
      eye_color,
      hair_color,
      is_bald,
      has_glasses,
      use_cases,
      age_range,
      allow_photo_usage,
    } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        full_name,
        gender,
        ethnicity,
        eye_color,
        hair_color: is_bald ? null : hair_color,
        is_bald,
        has_glasses,
        use_cases,
        age_range,
        allow_photo_usage,
      })
      .eq('id', userId)

    if (error) {
      console.error('Failed to save characteristics:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Characteristics saved for user: ${userId}`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save characteristics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    )
  }
}