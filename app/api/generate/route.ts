import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'
import { getStyleById } from '@/lib/styles/STYLE_LIBRARY'

// Vercel timeout verhogen (Pro plan ondersteunt tot 300s)
export const maxDuration = 300

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

interface GenerateInput {
  userId: string
  styleIds: string[]
  aspectRatio?: '1:1' | '3:4' | '4:3'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateInput
    const { userId, styleIds, aspectRatio = '3:4' } = body

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!styleIds || !Array.isArray(styleIds) || styleIds.length === 0) {
      return NextResponse.json({ error: 'Missing styleIds' }, { status: 400 })
    }

    // Haal user op
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('trained_model_id, trigger_word, credits')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check: model ready (heeft ":" = "owner/name:version")
    if (!userData.trained_model_id || !userData.trained_model_id.includes(':')) {
      return NextResponse.json(
        { error: 'Model not ready yet. Please wait for training to finish.' },
        { status: 400 }
      )
    }

    if (!userData.trigger_word) {
      return NextResponse.json({ error: 'Trigger word missing' }, { status: 400 })
    }

    // Check credits
    const credits = userData.credits ?? 0
    if (credits < styleIds.length) {
      return NextResponse.json(
        { error: `Not enough credits. You need ${styleIds.length}, you have ${credits}.` },
        { status: 403 }
      )
    }

    const modelRef = userData.trained_model_id as `${string}/${string}:${string}`
    const triggerWord = userData.trigger_word

    console.log(`🎨 Generating ${styleIds.length} photos for user ${userId}`)
    console.log(`🤖 Model: ${modelRef.split(':')[0]}:${modelRef.split(':')[1].slice(0, 8)}...`)

    // Genereer alle stijlen parallel
    const results = await Promise.allSettled(
      styleIds.map(async (styleId) => {
        const style = getStyleById(styleId)
        if (!style) {
          console.error(`❌ Style not found: ${styleId}`)
          return null
        }

        // Random prompt variatie kiezen + TOK vervangen met trigger word
        const promptTemplate = style.prompts[Math.floor(Math.random() * style.prompts.length)]
        const finalPrompt = promptTemplate.replace(/\bTOK\b/g, triggerWord)

        console.log(`  → ${styleId}: "${finalPrompt.slice(0, 60)}..."`)

        // Genereer via Replicate
        const output = (await replicate.run(modelRef, {
          input: {
            prompt: finalPrompt,
            aspect_ratio: aspectRatio,
            num_outputs: 1,
            num_inference_steps: 28,
            guidance_scale: 3,
            lora_scale: 1.0,
            output_format: 'jpg',
            output_quality: 90,
            disable_safety_checker: false,
          },
        })) as string[] | string

        const outputUrls = Array.isArray(output) ? output : [output]
        const imageUrl = outputUrls[0]
        if (!imageUrl) {
          console.error(`❌ No image URL for ${styleId}`)
          return null
        }

        // Download + sla op in Supabase Storage
        const imageResponse = await fetch(imageUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        const fileName = `generated/${userId}/${Date.now()}-${styleId}.jpg`

        const { error: uploadError } = await supabase.storage
          .from('headshots')
          .upload(fileName, imageBuffer, { contentType: 'image/jpeg' })

        if (uploadError) {
          console.error(`❌ Storage upload failed for ${styleId}:`, uploadError)
          return null
        }

        const { data: publicUrlData } = supabase.storage
          .from('headshots')
          .getPublicUrl(fileName)

        const storedImageUrl = publicUrlData.publicUrl

        // Sla op in DB (fail-soft — als tabel/schema niet bestaat, log maar faal niet)
        try {
          await supabase.from('generated_photos').insert({
            user_id: userId,
            image_url: storedImageUrl,
            prompt: finalPrompt,
            style_id: styleId,
            style_name: style.name,
            aspect_ratio: aspectRatio,
          })
        } catch (dbError) {
          console.error(`⚠️ DB insert failed for ${styleId}:`, dbError)
        }

        console.log(`  ✅ ${styleId} done`)

        return {
          styleId,
          styleName: style.name,
          imageUrl: storedImageUrl,
        }
      })
    )

    // Tel successful results
    const successful = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => (r as PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof Promise.allSettled>>[number] extends PromiseFulfilledResult<infer T> ? T : never>>).value)

    const failed = results.length - successful.length
    if (failed > 0) {
      console.warn(`⚠️ ${failed}/${results.length} generations failed`)
    }

    // Verminder credits (1 per geslaagde generatie)
    const creditsUsed = successful.length
    if (creditsUsed > 0) {
      await supabase
        .from('users')
        .update({ credits: credits - creditsUsed })
        .eq('id', userId)
    }

    return NextResponse.json({
      success: true,
      imagesGenerated: successful.length,
      totalRequested: styleIds.length,
      failed,
      results: successful,
      creditsRemaining: credits - creditsUsed,
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}