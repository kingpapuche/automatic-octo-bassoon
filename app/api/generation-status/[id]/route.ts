import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    const stylesUsed: string[] = generation.styles_used || []
    const resultUrls: string[] = generation.result_urls || []
    const variationsPerStyle = 4
    const totalExpected = stylesUsed.length * variationsPerStyle
    const completed = resultUrls.length
    const progressPercent = totalExpected > 0 ? Math.round((completed / totalExpected) * 100) : 0

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      stylesUsed,
      resultUrls,
      totalExpected,
      completed,
      progressPercent,
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