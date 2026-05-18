import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const VARIATIONS_PER_STYLE = 4

// ===========================================
// GENERATION WEBHOOK — Option C
// 1 prediction = 4 outputs (1 stijl = 4 variaties)
// Upload alle 4 en voeg toe aan result_urls
// ===========================================

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

    // === SUCCEEDED ===
    if (payload.status === 'succeeded' && payload.output) {
      // Output = array van 4 URLs (one per variation)
      const imageUrls = Array.isArray(payload.output) ? payload.output : [payload.output]
      console.log(`Got ${imageUrls.length} variations for ${styleId}`)

      const uploadedUrls: string[] = []

      // Upload alle variaties naar Supabase Storage parallel
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
            return imageUrl // fallback naar Replicate URL
          }
        } catch (err) {
          console.error(`Download error v${idx + 1}:`, err)
          return imageUrl
        }
      })

      const results = await Promise.all(uploadPromises)
      uploadedUrls.push(...results)

      // Voeg alle 4 URLs toe aan result_urls
      const newUrls = [...(generation.result_urls || []), ...uploadedUrls]
      const totalExpected = (generation.styles_used?.length || 0) * VARIATIONS_PER_STYLE
      const isComplete = newUrls.length >= totalExpected

      await supabase
        .from('generations')
        .update({
          result_urls: newUrls,
          credits_used: newUrls.length,
          status: isComplete ? 'completed' : 'processing',
        })
        .eq('id', generationId)

      console.log(`📊 ${generationId}: ${newUrls.length}/${totalExpected} complete`)

      // Log credit transactie alleen als alles klaar is
      if (isComplete) {
        await supabase.from('credits_transactions').insert({
          user_id: userId,
          amount: -newUrls.length,
          type: 'generation',
          description: `Generated ${newUrls.length} headshots (${generation.styles_used?.length} styles × ${VARIATIONS_PER_STYLE})`,
        })
      }

      return NextResponse.json({ received: true })
    }

    // === FAILED / CANCELED ===
    if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`Prediction ${payload.status}: ${styleId}`, payload.error)

      // Geef de 4 credits voor deze stijl terug
      const { data: userData } = await supabase
        .from('users').select('credits').eq('id', userId).single()

      if (userData) {
        await supabase
          .from('users')
          .update({ credits: (userData.credits || 0) + VARIATIONS_PER_STYLE })
          .eq('id', userId)
      }

      const totalExpected = (generation.styles_used?.length || 0) * VARIATIONS_PER_STYLE
      const currentCompleted = (generation.result_urls?.length || 0)

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