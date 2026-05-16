import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ===========================================
// GENERATION STATUS — Frontend polleert dit
// Returns: status, completed count, total, image URLs
// ===========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const completed = generation.result_urls?.length || 0
    const total = generation.styles_used?.length || 0

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      completed,
      total,
      imageUrls: generation.result_urls || [],
      styles: generation.styles_used || [],
      isComplete: generation.status === 'completed',
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}