import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const VARIATIONS_PER_STYLE = 4

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

    // === SUCCEEDED ===
    if (payload.status === 'succeeded' && payload.output) {
      const imageUrls = Array.isArray(payload.output) ? payload.output : [payload.output]
      console.log(`Got ${imageUrls.length} variations for ${styleId}`)

      // Download van Replicate -> upload naar eigen storage (permanente urls)
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

      // Atomair + idempotent vastleggen: deze prediction werkt z'n EIGEN item-rij
      // bij, en de DB-functie herberekent de aggregatie onder een row-lock.
      // Geen lost-update race meer, en webhook-retries zijn idempotent.
      const { data: rpcResult, error: rpcError } = await supabase.rpc('record_generation_item', {
        p_generation_id: generationId,
        p_user_id: userId,
        p_style_id: styleId,
        p_prediction_id: payload.id,
        p_status: 'completed',
        p_urls: uploadedUrls,
        p_variations: VARIATIONS_PER_STYLE,
      })

      if (rpcError) {
        console.error('record_generation_item (succeeded) error:', rpcError)
        return NextResponse.json({ error: 'Failed to record item' }, { status: 500 })
      }

      console.log(`Progress ${generationId}:`, rpcResult)
      return NextResponse.json({ received: true })
    }

    // === FAILED / CANCELED ===
    if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`Prediction ${payload.status}: ${styleId}`, payload.error)

      // Markeer item als failed; de DB-functie refundt de credits voor deze style
      // precies één keer en flipt de generation naar completed als dit de laatste was.
      const { error: rpcError } = await supabase.rpc('record_generation_item', {
        p_generation_id: generationId,
        p_user_id: userId,
        p_style_id: styleId,
        p_prediction_id: payload.id,
        p_status: 'failed',
        p_urls: [],
        p_variations: VARIATIONS_PER_STYLE,
      })

      if (rpcError) {
        console.error('record_generation_item (failed) error:', rpcError)
        return NextResponse.json({ error: 'Failed to record item' }, { status: 500 })
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