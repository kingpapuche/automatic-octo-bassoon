import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

interface GenerateInput {
  userId: string
  prompt: string
  styleId?: string
  styleName?: string
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateInput
    const { userId, prompt, styleId, styleName, aspectRatio = '3:4' } = body

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('trained_model_id, trigger_word, credits')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check: model klaar (heeft ":" = "owner/name:version")
    if (!userData.trained_model_id || !userData.trained_model_id.includes(':')) {
      return NextResponse.json(
        { error: 'Model not ready yet. Please wait for training to finish.' },
        { status: 400 }
      )
    }

    if (!userData.trigger_word) {
      return NextResponse.json({ error: 'Trigger word missing' }, { status: 400 })
    }

    const credits = userData.credits ?? 0
    if (credits <= 0) {
      return NextResponse.json({ error: 'No credits remaining.' }, { status: 403 })
    }

    // Bouw prompt
    const triggerWord = userData.trigger_word
    const promptHasTrigger = prompt.toLowerCase().includes(triggerWord.toLowerCase())
    const finalPrompt = promptHasTrigger ? prompt : `${triggerWord}, ${prompt}`

    const modelRef = userData.trained_model_id as `${string}/${string}:${string}`
    console.log(`Generating: ${modelRef.split(':')[0]}:${modelRef.split(':')[1].slice(0, 8)}...`)

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
      return NextResponse.json({ error: 'No image returned' }, { status: 500 })
    }

    // Download + sla op in Supabase Storage
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const fileName = `generated/${userId}/${Date.now()}-${styleId || 'photo'}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('headshots')
      .upload(fileName, imageBuffer, { contentType: 'image/jpeg' })

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from('headshots').getPublicUrl(fileName)
    const storedImageUrl = publicUrlData.publicUrl

    // Verminder credits
    await supabase.from('users').update({ credits: credits - 1 }).eq('id', userId)

    return NextResponse.json({
      success: true,
      imageUrl: storedImageUrl,
      replicateUrl: imageUrl,
      creditsRemaining: credits - 1,
      styleId,
      styleName,
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}