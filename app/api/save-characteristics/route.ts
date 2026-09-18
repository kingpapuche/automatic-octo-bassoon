import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isLocale } from '@/lib/i18n'

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
      has_beard,
      use_cases,
      age_range,
      allow_photo_usage,
      locale,
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
        has_beard,
        use_cases,
        age_range,
        allow_photo_usage,
        // Taal opslaan zodat transactionele e-mails in de juiste taal worden verstuurd
        ...(isLocale(locale) ? { locale } : {}),
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