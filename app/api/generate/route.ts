import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

export const maxDuration = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
const REPLICATE_USERNAME = process.env.REPLICATE_USERNAME || 'kingpapuche'

interface UserCharacteristics {
  gender?: string; ethnicity?: string; eye_color?: string
  hair_color?: string; is_bald?: boolean; has_glasses?: boolean; age_range?: string
}

const skinToneMap: Record<string, string> = {
  'caucasian': 'fair skin', 'latin american': 'warm medium brown skin', 'hispanic': 'warm tan skin',
  'black': 'dark brown skin', 'caribbean': 'rich brown skin', 'asian': 'light tan skin',
  'middle eastern': 'olive skin', 'mixed': 'warm medium brown skin', 'south asian': 'warm brown skin',
  'african': 'deep brown skin', 'arabic': 'olive warm skin', 'indian': 'warm brown skin',
}

function buildPersonDescription(c: UserCharacteristics): string {
  const parts: string[] = []
  if (c.ethnicity && c.gender) {
    const article = ['a','e','i','o','u'].includes(c.ethnicity[0].toLowerCase()) ? 'an' : 'a'
    parts.push(`${article} ${c.ethnicity} ${c.gender}`)
  } else if (c.gender) parts.push(`a ${c.gender}`)
  if (c.ethnicity) { const s = skinToneMap[c.ethnicity.toLowerCase()]; if (s) parts.push(s) }
  if (c.eye_color) parts.push(`with ${c.eye_color} eyes`)
  if (c.is_bald) parts.push(`bald head`)
  else if (c.hair_color) parts.push(`${c.hair_color} hair`)
  if (c.has_glasses) parts.push(`wearing glasses`)
  if (c.age_range) parts.push(`${c.age_range} years old`)
  return parts.join(', ')
}

function buildNegativePromptAdditions(c: UserCharacteristics): string {
  const negatives: string[] = []
  if (c.gender === 'male') negatives.push('female','woman','feminine features','makeup','lipstick','long eyelashes','breasts','cleavage')
  else if (c.gender === 'female') negatives.push('male','man','masculine features','beard','mustache','stubble','facial hair','adam apple')
  if (c.is_bald) negatives.push('hair on head','full head of hair','long hair','short hair','hairstyle')
  if (c.has_glasses === false) negatives.push('glasses','eyeglasses','spectacles','sunglasses')
  return negatives.join(', ')
}

async function resolveModelReference(userId: string, trainedModelId: string): Promise<string> {
  if (trainedModelId.includes('/') && trainedModelId.includes(':')) return trainedModelId
  if (trainedModelId.includes(':') && !trainedModelId.includes('/')) {
    const fullRef = `${REPLICATE_USERNAME}/${trainedModelId}`
    await supabase.from('users').update({ trained_model_id: fullRef }).eq('id', userId)
    return fullRef
  }
  const training = await replicate.trainings.get(trainedModelId)
  if (training.status !== 'succeeded') throw new Error(`Model nog niet klaar. Status: ${training.status}.`)
  const output = training.output as any
  let fullRef: string | null = null
  if (output?.version) fullRef = output.version
  else if (typeof output === 'string' && output.includes(':')) fullRef = output
  if (!fullRef) throw new Error('Kon model version niet ophalen.')
  if (!fullRef.includes('/')) fullRef = `${REPLICATE_USERNAME}/${fullRef}`
  await supabase.from('users').update({ trained_model_id: fullRef }).eq('id', userId)
  return fullRef
}

const STYLE_PROMPTS: Record<string, string> = {
  'corporate-classic':   '[TRIGGER], professional headshot, navy blue suit, white dress shirt, modern office background with windows, natural light, sharp focus, confident look',
  'executive-navy':      '[TRIGGER], half body portrait, arms crossed, navy blue suit with tie, office background with city view, soft natural light, confident pose',
  'ceo-black':           '[TRIGGER], headshot portrait, black suit, white shirt, light gray background, soft natural light, strong presence',
  'boardroom-charcoal':  '[TRIGGER], half body portrait, arms crossed, charcoal gray suit, modern office background with windows, natural lighting, confident pose',
  'pinstripe-pro':       '[TRIGGER], professional headshot, pinstripe suit with tie, neutral background, soft natural light, sharp professional look',
  'three-piece':         '[TRIGGER], half body portrait, arms crossed, three piece suit with vest, office background, window light, distinguished look',
  'formal-black-drama':  '[TRIGGER], headshot portrait, black formal suit, white shirt, neutral darker background, soft side window light, elegant moody',
  'wall-street-power':   '[TRIGGER], professional portrait, dark suit, red tie, city street background, confident expression, natural light',
  'navy-blazer-open':    '[TRIGGER], close up headshot, navy blazer, open collar white shirt, gray background, soft natural light, friendly expression',
  'gray-blazer-blue':    '[TRIGGER], half body portrait, arms crossed, gray blazer, light blue background, soft window light, approachable professional',
  'beige-elegance':      '[TRIGGER], half body portrait, beige linen suit, dark background, warm ambient light, sophisticated',
  'teal-blazer':         '[TRIGGER], half body portrait, arms crossed, teal blazer, white t-shirt, light background, soft natural light, modern professional',
  'light-blue-blazer':   '[TRIGGER], half body portrait, light blue blazer, white shirt, modern office with large windows, bright natural light',
  'creative-director':   '[TRIGGER], half body portrait, black blazer, black turtleneck, minimalist background, soft natural light, creative',
  'consultant-look':     '[TRIGGER], half body portrait, light gray suit, no tie, arms relaxed, modern office, soft natural light, confident',
  'tech-turtleneck':     '[TRIGGER], close up portrait, gray turtleneck sweater, neutral background, soft natural light, minimalist modern, intelligent gaze',
  'gray-sweater-pro':    '[TRIGGER], headshot portrait, gray crew neck sweater over collared shirt, clean background, soft window light, smart casual',
  'knit-cozy':           '[TRIGGER], half body portrait, chunky knit sweater, warm ambient light, cozy neutral background, approachable',
  'v-neck-smart':        '[TRIGGER], headshot portrait, blue v-neck sweater over collared shirt, light background, soft natural light, smart casual',
  'white-button-down':   '[TRIGGER], headshot portrait, clean white button-down shirt, soft neutral background, natural window light, approachable professional',
  'light-blue-oxford':   '[TRIGGER], half body portrait, light blue oxford button-down shirt, open collar, soft neutral background, natural window light, classic smart casual',
  'navy-polo':           '[TRIGGER], headshot portrait, navy blue polo shirt, clean light background, soft natural light, friendly expression',
  'denim-shirt-fresh':   '[TRIGGER], headshot portrait, chambray denim shirt, white background, soft natural light, casual friendly look',
  'plaid-friendly':      '[TRIGGER], headshot portrait, plaid button-up shirt, neutral background, soft natural light, relaxed approachable',
  'white-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain white t-shirt, soft neutral light gray background, natural window light, candid feel, relaxed expression',
  'black-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain black t-shirt, soft neutral medium gray background, natural light, candid feel, confident relaxed',
  'henley-relaxed':      '[TRIGGER], headshot portrait, fitted henley shirt with button opening, textured fabric, warm natural window light, comfortable relaxed natural feel',
  'golden-hour':         '[TRIGGER], portrait, casual smart shirt, golden hour outdoor lighting, warm natural tones, lifestyle photography',
  'park-natural':        '[TRIGGER], medium shot, outdoor park setting, casual smart outfit or plain t-shirt, dappled sunlight, blurred green background, relaxed natural pose',
  'rooftop-city':        '[TRIGGER], medium shot, rooftop setting, city skyline background, smart casual outfit, natural daylight',
  'city-walk':           '[TRIGGER], medium shot, walking pose, casual jacket, city street background, urban lifestyle, natural movement',
  'leather-jacket-urban': '[TRIGGER], medium shot, black leather jacket, white t-shirt, city street background, natural evening light, edgy professional',
  'all-black-minimal':   '[TRIGGER], headshot portrait, all black outfit, black shirt or turtleneck, dark neutral background, soft side light, minimal dramatic',
  'bold-colored-blazer': '[TRIGGER], half body portrait, bold colored blazer (deep red or emerald green), white t-shirt underneath, modern creative background, natural light, confident statement',
  'restaurant-elegant':  '[TRIGGER], medium shot portrait, smart casual button-down or henley, upscale restaurant interior background with warm ambient bokeh lights, candlelit warm lighting, sophisticated dinner atmosphere',
  'wine-bar-relaxed':    '[TRIGGER], medium shot, sitting at wine bar, dark sweater or shirt, warm intimate bar lighting, blurred bottles in background, relaxed sophisticated evening',
  'coffee-shop-date':    '[TRIGGER], medium shot, coffee shop interior, casual smart sweater or shirt, warm ambient lighting, relaxed friendly date vibe',
  'rooftop-bar-evening': '[TRIGGER], half body portrait, stylish jacket or dark shirt, rooftop bar background with city lights bokeh, evening lighting, urban nightlife vibe',
  'w-power-blazer-navy':   '[TRIGGER], professional woman portrait, navy blue tailored blazer, white silk blouse, soft neutral background, arms crossed confidently, natural light, executive look',
  'w-executive-charcoal':  '[TRIGGER], half body portrait of professional woman, charcoal gray tailored suit, light silk blouse, modern office background, natural professional lighting, confident executive',
  'w-ceo-black':           '[TRIGGER], elegant headshot portrait of businesswoman, black tailored blazer, white blouse, light neutral background, soft natural light, powerful executive presence',
  'w-pinstripe-pro':       '[TRIGGER], professional headshot of businesswoman, pinstripe blazer, silk blouse, neutral gray background, soft natural light, sharp sophisticated look',
  'w-sheath-classic':      '[TRIGGER], elegant portrait of businesswoman, fitted black sheath dress, minimal jewelry, light neutral background, soft natural lighting, refined executive style',
  'w-pussybow-elegant':    '[TRIGGER], professional headshot of woman, cream silk blouse with pussy bow detail, tweed jacket, neutral background, soft natural light, classic elegant style',
  'w-cream-blazer-arms':   '[TRIGGER], half body portrait of professional woman, cream beige blazer, white t-shirt underneath, arms crossed, soft neutral background, natural lighting, modern professional',
  'w-turtleneck-blazer':   '[TRIGGER], headshot of professional woman, black turtleneck under gray tailored blazer, minimalist neutral background, soft natural light, modern sophisticated',
  'w-silk-blouse-modern':  '[TRIGGER], half body portrait of woman, navy silk blouse, modern office background, natural window lighting, contemporary professional elegant',
  'w-cardigan-soft':       '[TRIGGER], headshot portrait of woman, soft beige cardigan over white tee, warm natural window light, cozy professional, approachable smart casual',
  'w-knit-twinset':        '[TRIGGER], professional headshot of woman, matching knit top and cardigan in neutral tones, soft neutral background, warm natural light, refined smart casual',
  'w-startup-casual':      '[TRIGGER], medium shot portrait of woman, light blue button-down shirt, no blazer, modern coworking space background, natural light, energetic approachable professional',
  'w-red-power-suit':      '[TRIGGER], half body portrait of woman, bold red blazer, white t-shirt underneath, modern creative office background, natural light, confident power pose, statement professional',
  'w-emerald-blazer':      '[TRIGGER], professional headshot of woman, emerald green blazer, black top underneath, soft side natural light, neutral background, bold creative professional',
  'w-mustard-creative':    '[TRIGGER], half body portrait of woman, mustard yellow silk blouse, creative neutral background, natural lighting, artistic professional',
  'w-statement-coral':     '[TRIGGER], headshot of woman, coral pink tailored blazer, modern creative office background, vibrant natural lighting, bold confident creative professional',
  'w-jewel-purple':        '[TRIGGER], portrait of woman, deep purple silk top, artistic neutral background, soft natural light, jewel-tone creative professional, expressive',
  'w-white-tee-natural':   '[TRIGGER], half body portrait of woman, clean white t-shirt, blurred green nature background, outdoor natural daylight, fresh approachable, genuine smile',
  'w-cream-sweater-window': '[TRIGGER], headshot portrait of woman, soft cream knit sweater, warm window light, blurred home interior background, relaxed approachable',
  'w-denim-shirt-fresh':   '[TRIGGER], professional headshot of woman, light chambray denim shirt, white background, natural daylight, casual approachable professional, friendly',
  'w-coffee-shop-warm':    '[TRIGGER], medium shot of woman, casual smart sweater, warm coffee shop interior background, ambient lighting, relaxed approachable, natural casual',
  'w-park-outdoor':        '[TRIGGER], half body portrait of woman, light casual blouse, blurred green park background, soft natural daylight, fresh outdoor relaxed',
  'w-rooftop-golden':      '[TRIGGER], medium shot of woman, smart casual blouse, rooftop setting, city panorama background, warm golden hour lighting, lifestyle professional',
  'w-architectural':       '[TRIGGER], half body portrait of woman, modern fitted top, modern architecture background, clean lines, natural light, contemporary',
  'w-city-walk':           '[TRIGGER], medium shot of woman walking, casual jacket and smart top, urban city street background, natural daylight, dynamic lifestyle',
  'w-beach-professional':  '[TRIGGER], half body portrait of woman, white linen blouse, coastal beach background blurred, bright natural light, relaxed vacation professional',
  'w-restaurant-elegant':  '[TRIGGER], elegant portrait of woman, smart casual silk blouse, upscale restaurant interior background with warm bokeh lights, candlelit warm lighting, sophisticated dinner atmosphere',
  'w-wine-bar-casual':     '[TRIGGER], medium shot of woman sitting at wine bar, stylish casual top, warm intimate bar lighting, blurred bottles in background, relaxed sophisticated evening',
  'w-cocktail-glamour':    '[TRIGGER], half body portrait of woman, elegant cocktail dress, upscale restaurant background with bokeh lights, warm evening lighting, sophisticated date night',
  'w-cafe-date':           '[TRIGGER], medium shot of woman, cute casual sweater, charming cafe interior background, warm ambient lighting, relaxed approachable, perfect coffee date vibe',
  'w-rooftop-bar':         '[TRIGGER], half body portrait of woman, stylish evening top, rooftop bar background with city lights bokeh, warm evening lighting, urban nightlife',
  'w-restaurant-evening':  '[TRIGGER], elegant portrait of woman, sophisticated evening top, intimate restaurant interior with candlelight, warm romantic lighting, refined evening look',
  'w-bistro-warm':         '[TRIGGER], medium shot of woman, smart casual chic outfit, charming bistro interior background, warm ambient lighting, sophisticated relaxed evening',
  'w-leather-jacket-edge': '[TRIGGER], medium shot of woman, black leather jacket, dark top underneath, urban evening background, natural evening light, edgy sophisticated',
  'w-evening-rooftop':     '[TRIGGER], half body portrait of woman, elegant black evening top, rooftop background with city lights, warm evening lighting, glamorous nighttime',
  'w-night-city-glamour':  '[TRIGGER], portrait of woman, stylish dark outfit, city nightlife background with bokeh lights, sophisticated glamorous evening',
}

// ===========================================
// BACKGROUND PROCESSING — GENERATE ROUTE
// 1. Maakt generation record met empty result_urls
// 2. Start ALLE Replicate predictions (parallel, async fire-and-forget)
// 3. Returnt direct met generation_id (geen wachten op completion!)
// 4. Webhook (/api/generation-webhook) ontvangt completed predictions per stuk
// 5. Frontend polleert /api/generation-status/{id} voor updates
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!styleIds || styleIds.length === 0) return NextResponse.json({ error: 'No styles selected' }, { status: 400 })

    console.log(`🚀 Start background generation: ${userId} | ${styleIds.length} styles`)

    const { data: user, error: userError } = await supabase
      .from('users').select('*').eq('id', userId).single()

    if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.credits < styleIds.length) {
      return NextResponse.json({ error: `Not enough credits. Need ${styleIds.length}, have ${user.credits}` }, { status: 400 })
    }
    if (!user.trained_model_id) return NextResponse.json({ error: 'No trained model found' }, { status: 400 })

    const modelReference = await resolveModelReference(userId, user.trained_model_id)
    const versionId = modelReference.split(':')[1]
    if (!versionId) return NextResponse.json({ error: 'Invalid model reference' }, { status: 500 })

    const triggerWord = user.trigger_word || 'HEADSHOT'

    const characteristics: UserCharacteristics = {
      gender: user.gender, ethnicity: user.ethnicity, eye_color: user.eye_color,
      hair_color: user.hair_color, is_bald: user.is_bald, has_glasses: user.has_glasses, age_range: user.age_range,
    }

    const personDescription = buildPersonDescription(characteristics)
    const negativeAdditions = buildNegativePromptAdditions(characteristics)

    const baseNegativePrompt = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, blurry, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, porcelain skin, skin retouching, heavy skin smoothing, uncanny valley, CGI, 3d render, illustration, cartoon, oversaturated, HDR, oversharpened, instagram filter, heavy vignette, studio strobe lighting, artificial lighting"
    const fullNegativePrompt = negativeAdditions ? `${baseNegativePrompt}, ${negativeAdditions}` : baseNegativePrompt

    // Maak generation record - status processing, lege result_urls
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        styles_used: styleIds,
        result_urls: [],
        credits_used: 0,
        status: 'processing',
      })
      .select()
      .single()

    if (genError || !generation) {
      console.error('Failed to create generation record:', genError)
      return NextResponse.json({ error: 'Failed to create generation' }, { status: 500 })
    }

    const generationId = generation.id

    // Reserveer credits direct (worden bij failure terug gegeven via webhook)
    await supabase.from('users').update({ credits: user.credits - styleIds.length }).eq('id', userId)

    const triggerWithDescription = personDescription ? `${triggerWord}, ${personDescription}` : triggerWord
    const realism = 'natural skin texture, photorealistic, candid feel, film grain, shot on 50mm lens, subtle skin imperfections'

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`

    // Start ALLE predictions parallel met webhook callback
    // Geen await op completion — predictions runnen in achtergrond
    const predictionPromises = styleIds.map(async (styleId: string) => {
      try {
        const promptTemplate = STYLE_PROMPTS[styleId] || '[TRIGGER], professional headshot portrait, natural lighting, clean background, sharp focus'
        const fullPrompt = promptTemplate.replace(/\[TRIGGER\]/g, triggerWithDescription) + `, ${realism}`

        const webhookUrl = `${baseUrl}/api/generation-webhook?generationId=${generationId}&styleId=${encodeURIComponent(styleId)}&userId=${userId}`

        const prediction = await replicate.predictions.create({
          version: versionId,
          input: {
            prompt: fullPrompt,
            negative_prompt: fullNegativePrompt,
            model: 'dev',
            lora_scale: 1,
            num_outputs: 1,
            aspect_ratio: aspectRatio || '3:4',
            output_format: 'webp',
            guidance_scale: 3.0,
            output_quality: 90,
            num_inference_steps: 35,
            disable_safety_checker: false,
          },
          webhook: webhookUrl,
          webhook_events_filter: ['completed'],
        })

        console.log(`✅ Prediction started: ${styleId} → ${prediction.id}`)
        return { styleId, predictionId: prediction.id, success: true }
      } catch (err) {
        console.error(`❌ Failed to start ${styleId}:`, err)
        return { styleId, success: false }
      }
    })

    const startedPredictions = await Promise.all(predictionPromises)
    const successfulStarts = startedPredictions.filter(p => p.success).length

    console.log(`🎉 Started ${successfulStarts}/${styleIds.length} predictions in background`)

    return NextResponse.json({
      success: true,
      generationId,
      pendingPredictions: successfulStarts,
      totalStyles: styleIds.length,
      message: 'Generation started in background',
    })

  } catch (error) {
    console.error('❌ Generation start error:', error)
    return NextResponse.json(
      { error: 'Generation failed to start', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}