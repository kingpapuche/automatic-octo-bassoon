import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const VARIATIONS_PER_STYLE = 4

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !generation) {
      console.error('Generation not found:', id, error)
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const styles: string[] = generation.styles_used || []
    const imageUrls: string[] = generation.result_urls || []
    const totalStyles = styles.length
    const total = totalStyles * VARIATIONS_PER_STYLE
    const completed = imageUrls.length

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      styles,
      imageUrls,
      totalStyles,
      variationsPerStyle: VARIATIONS_PER_STYLE,
      total,
      completed,
      isComplete: generation.status === 'completed',
      createdAt: generation.created_at,
    })
  } catch (error) {
    console.error('Generation status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch status' },
      { status: 500 }
    )
  }
}