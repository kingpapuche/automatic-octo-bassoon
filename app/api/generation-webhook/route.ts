import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ===========================================
// GENERATION WEBHOOK
// Replicate roept dit aan per voltooide prediction.
// URL: /api/generation-webhook?generationId=X&styleId=Y&userId=Z
//
// Flow:
// 1. Download de gegenereerde image van Replicate
// 2. Upload naar Supabase Storage
// 3. Voeg URL toe aan generation.result_urls array
// 4. Check of generation compleet is, update status indien zo
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

    // Haal current generation op
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
      const imageUrl = Array.isArray(payload.output) ? payload.output[0] : payload.output

      try {
        // Download image van Replicate
        const response = await fetch(imageUrl)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload naar Supabase Storage
        const filename = `generated/${userId}/${Date.now()}-${styleId}.webp`
        const { error: uploadError } = await supabase.storage
          .from('headshots')
          .upload(filename, buffer, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: true,
          })

        let publicUrl = imageUrl
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('headshots').getPublicUrl(filename)
          publicUrl = publicUrlData.publicUrl
          console.log(`✅ Saved ${styleId} to storage`)
        } else {
          console.error('Upload error:', uploadError)
        }

        // Voeg URL toe aan result_urls array
        const newUrls = [...(generation.result_urls || []), publicUrl]
        const totalStyles = generation.styles_used?.length || 0
        const isComplete = newUrls.length >= totalStyles

        await supabase
          .from('generations')
          .update({
            result_urls: newUrls,
            credits_used: newUrls.length,
            status: isComplete ? 'completed' : 'processing',
          })
          .eq('id', generationId)

        console.log(`📊 Generation ${generationId}: ${newUrls.length}/${totalStyles} complete`)

        // Log credit transactie alleen als alles klaar is
        if (isComplete) {
          await supabase.from('credits_transactions').insert({
            user_id: userId,
            amount: -newUrls.length,
            type: 'generation',
            description: `Generated ${newUrls.length} headshots`,
          })
        }
      } catch (downloadError) {
        console.error('Download/upload error:', downloadError)
      }

      return NextResponse.json({ received: true })
    }

    // === FAILED / CANCELED ===
    if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`Prediction ${payload.status}: ${styleId}`, payload.error)

      // Geef credit terug aan user
      const { data: userData } = await supabase
        .from('users').select('credits').eq('id', userId).single()

      if (userData) {
        await supabase
          .from('users')
          .update({ credits: (userData.credits || 0) + 1 })
          .eq('id', userId)
      }

      // Markeer dit als 'partial completion' — update completed count maar geen URL toevoegen
      const expectedTotal = generation.styles_used?.length || 0
      const currentCompleted = (generation.result_urls?.length || 0)

      // Check of dit de laatste prediction was (alleen op processing/completed status updaten)
      // We doen niets actiefs — alle URL's die er zijn blijven, generation blijft processing
      // tot alles binnen is. Frontend ziet zelf wat success vs failure was.

      // Als alleen failures over zijn → mark completed
      if (currentCompleted >= expectedTotal - 1) {
        // Dit is de laatste, en wel een failure → forceer complete state
        await supabase
          .from('generations')
          .update({ status: 'completed' })
          .eq('id', generationId)
      }

      return NextResponse.json({ received: true })
    }

    // Andere statussen (starting, processing) - geen actie
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}