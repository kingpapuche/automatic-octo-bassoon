import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const VARIATIONS_PER_STYLE = 4

// Veilig parsen: styles_used / result_urls kunnen als string OF array opgeslagen zijn.
// De kolom is type 'text', dus arrays worden als JSON-string bewaard.
// .length op een string telt karakters (bug), dus eerst parsen naar echte array.
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

interface ReplicateWebhookPayload {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string | string[] | null
  error?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const generationId = url.searchParams.get('generationId')
    const styleId = url.searchParams.get('styleId')
    const userId = url.searchParams.get('userId')

    if (!generationId || !styleId || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const payload = (await request.json()) as ReplicateWebhookPayload
    console.log(`Webhook: ${payload.id} status=${payload.status} style=${styleId}`)

    const { data: generation, error: genError } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (genError || !generation) {
      console.error('Generation not found:', generationId)
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Parse beide velden veilig naar echte arrays
    const stylesUsed = toArray(generation.styles_used)
    const existingUrls = toArray(generation.result_urls)
    const totalExpected = stylesUsed.length * VARIATIONS_PER_STYLE

    // === SUCCEEDED ===
    if (payload.status === 'succeeded' && payload.output) {
      const imageUrls = Array.isArray(payload.output) ? payload.output : [payload.output]
      console.log(`Got ${imageUrls.length} variations for ${styleId}`)

      const uploadPromises = imageUrls.map(async (imageUrl, idx) => {
        try {
          const response = await fetch(imageUrl)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const filename = `generated/${userId}/${Date.now()}-${styleId}-v${idx + 1}.webp`
          const { error: uploadError } = await supabase.storage
            .from('headshots')
            .upload(filename, buffer, {
              contentType: 'image/webp',
              cacheControl: '31536000',
              upsert: true,
            })

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('headshots').getPublicUrl(filename)
            return publicUrlData.publicUrl
          } else {
            console.error(`Upload error v${idx + 1}:`, uploadError)
            return imageUrl
          }
        } catch (err) {
          console.error(`Download error v${idx + 1}:`, err)
          return imageUrl
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Veilig samenvoegen (existingUrls is nu een echte array)
      const newUrls = [...existingUrls, ...uploadedUrls]
      const isComplete = newUrls.length >= totalExpected

      await supabase
        .from('generations')
        .update({
          result_urls: newUrls,
          credits_used: newUrls.length,
          status: isComplete ? 'completed' : 'processing',
        })
        .eq('id', generationId)

      console.log(`Progress ${generationId}: ${newUrls.length}/${totalExpected} complete`)

      if (isComplete) {
        await supabase.from('credits_transactions').insert({
          user_id: userId,
          amount: -newUrls.length,
          type: 'generation',
          description: `Generated ${newUrls.length} headshots (${stylesUsed.length} styles x ${VARIATIONS_PER_STYLE})`,
        })
      }

      return NextResponse.json({ received: true })
    }

    // === FAILED / CANCELED ===
    if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`Prediction ${payload.status}: ${styleId}`, payload.error)

      const { data: userData } = await supabase
        .from('users').select('credits').eq('id', userId).single()

      if (userData) {
        await supabase
          .from('users')
          .update({ credits: (userData.credits || 0) + VARIATIONS_PER_STYLE })
          .eq('id', userId)
      }

      const currentCompleted = existingUrls.length

      // Forceer complete state als dit de laatste prediction was
      if (currentCompleted >= totalExpected - VARIATIONS_PER_STYLE) {
        await supabase
          .from('generations')
          .update({ status: 'completed' })
          .eq('id', generationId)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}