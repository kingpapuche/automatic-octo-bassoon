import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
const REPLICATE_USERNAME = process.env.REPLICATE_USERNAME || 'kingpapuche'

// ===========================================
// Aantal foto's per stijl (productie). 1 stijl = 4 foto's = 4 credits.
// Deze constante staat in 6 bestanden — houd ze gelijk bij wijzigen.
// ===========================================
const VARIATIONS_PER_STYLE = 1

interface UserCharacteristics {
  gender?: string; ethnicity?: string; eye_color?: string
  hair_color?: string; is_bald?: boolean; has_glasses?: boolean; has_beard?: boolean; age_range?: string
}

const skinToneMap: Record<string, string> = {
  'caucasian': 'fair skin', 'latin american': 'warm medium brown skin', 'hispanic': 'warm tan skin',
  'black': 'dark brown skin', 'caribbean': 'rich brown skin', 'asian': 'light tan skin',
  'middle eastern': 'olive skin', 'mixed': 'warm medium brown skin', 'south asian': 'warm brown skin',
  'african': 'deep brown skin', 'arabic': 'olive warm skin', 'indian': 'warm brown skin',
}

function buildPersonDescription(c: UserCharacteristics): string {
  // Houd description minimaal: alleen features die LoRA mogelijk niet vasthoudt.
  // - gender (verplicht voor LoRA per Ostris docs)
  // - is_bald (voorkomt dat AI haar toevoegt)
  // - has_glasses (voorkomt dat AI bril vergeet)
  // - has_beard (voorkomt dat AI baard toevoegt/vergeet)
  // Ethnicity/skin/eyes/age laten we WEG — die heeft de LoRA al van je gezicht geleerd.
  const parts: string[] = []
  if (c.gender) parts.push(`a ${c.gender}`)
  if (c.is_bald) parts.push('bald')
  if (c.has_glasses) parts.push('wearing glasses')
  if (c.has_beard) parts.push('with beard')
  return parts.join(', ')
}

function buildNegativePromptAdditions(c: UserCharacteristics): string {
  const negatives: string[] = []
  if (c.gender === 'male') negatives.push('female','woman','feminine features','makeup','lipstick','long eyelashes','breasts','cleavage')
  else if (c.gender === 'female') negatives.push('male','man','masculine features','beard','mustache','stubble','facial hair','adam apple')
  if (c.is_bald) negatives.push('hair on head','full head of hair','long hair','short hair','hairstyle')
  if (c.has_glasses === false) negatives.push('glasses','eyeglasses','spectacles','sunglasses')
  if (c.has_beard === false) negatives.push('beard','mustache','stubble','facial hair','goatee')
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
  'corporate-classic':   '[TRIGGER], professional headshot, navy blue suit, white dress shirt, clean light gray studio background, soft studio lighting, sharp focus, confident',
  'executive-navy':      '[TRIGGER], half body portrait, arms crossed, navy blue suit with tie, clean gray studio background, soft studio lighting, confident',
  'ceo-black':           '[TRIGGER], professional headshot, black suit, white shirt, white studio background, soft studio lighting, strong presence',
  'boardroom-charcoal':  '[TRIGGER], half body portrait, tailored light gray suit, white dress shirt, dark patterned tie, neutral gray studio background, soft studio lighting, confident executive',
  'pinstripe-pro':       '[TRIGGER], professional headshot, pinstripe suit with tie, neutral gray studio background, soft studio lighting, sharp professional look',
  'three-piece':         '[TRIGGER], half body portrait, arms crossed, three piece suit with vest, dark studio background, dramatic studio lighting, distinguished',
  'formal-black-drama':  '[TRIGGER], professional headshot, black formal suit, white shirt, dark studio background, dramatic side studio lighting, elegant moody',
  'wall-street-power':   '[TRIGGER], professional headshot, dark suit, red tie, neutral gray studio background, soft studio lighting, confident power pose',
  'navy-blazer-open':    '[TRIGGER], close up portrait, navy blazer, open collar white shirt, gray studio background, soft studio lighting, friendly',
  'gray-blazer-blue':    '[TRIGGER], half body portrait, arms crossed, gray blazer, light blue studio background, soft studio lighting, approachable professional',
  'beige-elegance':      '[TRIGGER], half body portrait, beige linen suit, dark studio background, warm soft studio lighting, sophisticated',
  'teal-blazer':         '[TRIGGER], half body portrait, arms crossed, teal blazer, white t-shirt, white studio background, soft studio lighting, modern professional',
  'light-blue-blazer':   '[TRIGGER], half body portrait, light blue blazer, white shirt, clean light gray studio background, soft studio lighting, bright modern',
  'creative-director':   '[TRIGGER], half body portrait, black blazer, black turtleneck, minimalist white studio background, soft studio lighting, creative',
  'consultant-look':     '[TRIGGER], half body portrait, light gray suit, no tie, neutral studio background, soft studio lighting, confident',
  'tech-turtleneck':     '[TRIGGER], close up portrait, gray turtleneck sweater, neutral gray studio background, soft studio lighting, minimalist modern, intelligent gaze',
  'gray-sweater-pro':    '[TRIGGER], portrait, gray crew neck sweater over collared shirt, clean studio background, soft studio lighting, smart casual',
  'knit-cozy':           '[TRIGGER], half body portrait, chunky knit sweater, warm neutral studio background, warm soft studio lighting, approachable',
  'v-neck-smart':        '[TRIGGER], portrait, blue v-neck sweater over collared shirt, light studio background, soft studio lighting, smart casual',
  'white-button-down':   '[TRIGGER], portrait, clean white button-down shirt, soft neutral gray studio background, soft studio lighting, approachable professional',
  'light-blue-oxford':   '[TRIGGER], half body portrait, light blue oxford button-down shirt, open collar, soft neutral studio background, soft studio lighting, classic smart casual',
  'navy-polo':           '[TRIGGER], portrait, navy blue polo shirt, clean light studio background, soft studio lighting, friendly',
  'denim-shirt-fresh':   '[TRIGGER], portrait, chambray denim shirt, white studio background, soft studio lighting, casual friendly',
  'plaid-friendly':      '[TRIGGER], portrait, plaid button-up shirt, neutral studio background, soft studio lighting, relaxed approachable',
  'white-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain white t-shirt, soft neutral light gray studio background, soft studio lighting, relaxed',
  'black-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain black t-shirt, soft neutral medium gray studio background, soft studio lighting, confident relaxed',
  'henley-relaxed':      '[TRIGGER], portrait, fitted henley shirt with button opening, warm neutral studio background, warm soft studio lighting, relaxed natural',
  'golden-hour':         '[TRIGGER], portrait, casual smart shirt, golden hour outdoor lighting, warm natural tones, blurred outdoor background, lifestyle photography',
  'park-natural':        '[TRIGGER], medium shot, outdoor park setting, casual smart outfit or plain t-shirt, dappled sunlight, blurred green background, relaxed natural',
  'rooftop-city':        '[TRIGGER], medium shot, rooftop setting, blurred city skyline background, smart casual outfit, natural daylight',
  'city-walk':           '[TRIGGER], medium shot, casual jacket, blurred city street background, natural daylight, urban lifestyle',
  'leather-jacket-urban': '[TRIGGER], medium shot, black leather jacket, white t-shirt, dark moody studio background, dramatic studio lighting, edgy',
  'all-black-minimal':   '[TRIGGER], portrait, all black outfit, black shirt or turtleneck, dark studio background, dramatic side studio lighting, minimal',
  'bold-colored-blazer': '[TRIGGER], half body portrait, bold colored blazer deep red or emerald green, white t-shirt underneath, clean colored studio background, soft studio lighting, confident statement',
  'restaurant-elegant':  '[TRIGGER], medium shot portrait, smart casual button-down, warm elegant neutral studio background, soft warm studio lighting, sophisticated',
  'wine-bar-relaxed':    '[TRIGGER], medium shot, dark sweater or shirt, warm neutral studio background, soft warm studio lighting, relaxed sophisticated',
  'coffee-shop-date':    '[TRIGGER], medium shot, casual smart sweater or shirt, warm neutral studio background, soft warm studio lighting, relaxed friendly',
  'rooftop-bar-evening': '[TRIGGER], half body portrait, stylish jacket or dark shirt, dark warm studio background, soft warm studio lighting, sophisticated evening',
  'w-power-blazer-navy':   '[TRIGGER], professional woman portrait, navy blue tailored blazer, white silk blouse, arms crossed confidently, soft neutral gray studio background, soft studio lighting, executive',
  'w-executive-charcoal':  '[TRIGGER], half body portrait of professional woman, charcoal gray tailored suit, light silk blouse, neutral gray studio background, soft studio lighting, confident executive',
  'w-ceo-black':           '[TRIGGER], elegant portrait of businesswoman, black tailored blazer, white blouse, white studio background, soft studio lighting, powerful executive',
  'w-pinstripe-pro':       '[TRIGGER], professional portrait of businesswoman, pinstripe blazer, silk blouse, neutral gray studio background, soft studio lighting, sharp sophisticated',
  'w-sheath-classic':      '[TRIGGER], elegant portrait of businesswoman, fitted black sheath dress, minimal jewelry, light neutral studio background, soft studio lighting, refined',
  'w-pussybow-elegant':    '[TRIGGER], professional portrait of woman, cream silk blouse with pussy bow detail, tweed jacket, neutral studio background, soft studio lighting, classic elegant',
  'w-cream-blazer-arms':   '[TRIGGER], half body portrait of professional woman, cream beige blazer, white t-shirt underneath, arms crossed, soft neutral studio background, soft studio lighting, modern professional',
  'w-turtleneck-blazer':   '[TRIGGER], portrait of professional woman, black turtleneck under gray tailored blazer, minimalist neutral studio background, soft studio lighting, modern sophisticated',
  'w-silk-blouse-modern':  '[TRIGGER], half body portrait of woman, navy silk blouse, clean neutral studio background, soft studio lighting, contemporary professional elegant',
  'w-cardigan-soft':       '[TRIGGER], portrait of woman, soft beige cardigan over white tee, warm neutral studio background, warm soft studio lighting, approachable smart casual',
  'w-knit-twinset':        '[TRIGGER], professional portrait of woman, matching knit top and cardigan in neutral tones, soft neutral studio background, warm soft studio lighting, refined smart casual',
  'w-startup-casual':      '[TRIGGER], medium shot portrait of woman, light blue button-down shirt, clean light studio background, soft studio lighting, energetic approachable professional',
  'w-red-power-suit':      '[TRIGGER], half body portrait of woman, bold red blazer, white t-shirt underneath, clean neutral studio background, soft studio lighting, confident power pose',
  'w-emerald-blazer':      '[TRIGGER], professional portrait of woman, emerald green blazer, black top underneath, neutral studio background, soft studio lighting, bold creative professional',
  'w-mustard-creative':    '[TRIGGER], half body portrait of woman, mustard yellow silk blouse, clean neutral studio background, soft studio lighting, artistic professional',
  'w-statement-coral':     '[TRIGGER], portrait of woman, coral pink tailored blazer, clean neutral studio background, soft studio lighting, bold confident professional',
  'w-jewel-purple':        '[TRIGGER], portrait of woman, deep purple silk top, neutral studio background, soft studio lighting, jewel-tone creative professional',
  'w-white-tee-natural':   '[TRIGGER], half body portrait of woman, clean white t-shirt, blurred green nature background, outdoor natural daylight, fresh, genuine smile',
  'w-cream-sweater-window': '[TRIGGER], portrait of woman, soft cream knit sweater, warm neutral studio background, warm soft studio lighting, relaxed approachable',
  'w-denim-shirt-fresh':   '[TRIGGER], professional portrait of woman, light chambray denim shirt, white studio background, soft studio lighting, casual approachable professional',
  'w-coffee-shop-warm':    '[TRIGGER], medium shot of woman, casual smart sweater, warm neutral studio background, warm soft studio lighting, relaxed approachable',
  'w-park-outdoor':        '[TRIGGER], half body portrait of woman, light casual blouse, blurred green park background, soft natural daylight, fresh outdoor',
  'w-rooftop-golden':      '[TRIGGER], medium shot of woman, smart casual blouse, rooftop, blurred city panorama background, warm golden hour lighting, lifestyle',
  'w-architectural':       '[TRIGGER], half body portrait of woman, modern fitted top, clean neutral studio background, soft studio lighting, contemporary',
  'w-city-walk':           '[TRIGGER], medium shot of woman, casual jacket and smart top, blurred urban city street background, natural daylight, dynamic lifestyle',
  'w-beach-professional':  '[TRIGGER], half body portrait of woman, white linen blouse, blurred coastal beach background, bright natural light, relaxed vacation professional',
  'w-restaurant-elegant':  '[TRIGGER], elegant portrait of woman, smart casual silk blouse, warm elegant neutral studio background, soft warm studio lighting, sophisticated',
  'w-wine-bar-casual':     '[TRIGGER], medium shot of woman, stylish casual top, warm neutral studio background, soft warm studio lighting, relaxed sophisticated',
  'w-cocktail-glamour':    '[TRIGGER], half body portrait of woman, elegant cocktail dress, dark elegant studio background, soft warm studio lighting, sophisticated',
  'w-cafe-date':           '[TRIGGER], medium shot of woman, casual sweater, warm neutral studio background, soft warm studio lighting, relaxed approachable',
  'w-rooftop-bar':         '[TRIGGER], half body portrait of woman, stylish evening top, dark warm studio background, soft warm studio lighting, sophisticated evening',
  'w-restaurant-evening':  '[TRIGGER], elegant portrait of woman, sophisticated evening top, dark elegant studio background, soft warm studio lighting, refined',
  'w-bistro-warm':         '[TRIGGER], medium shot of woman, smart casual chic outfit, warm neutral studio background, soft warm studio lighting, sophisticated',
  'w-leather-jacket-edge': '[TRIGGER], medium shot of woman, black leather jacket, dark top underneath, dark moody studio background, dramatic studio lighting, edgy sophisticated',
  'w-evening-rooftop':     '[TRIGGER], half body portrait of woman, elegant black evening top, dark elegant studio background, soft warm studio lighting, glamorous',
  'w-night-city-glamour':  '[TRIGGER], portrait of woman, stylish dark outfit, dark elegant studio background, soft studio lighting, sophisticated glamorous',

  // ===== SPECIALTY POSES (man) =====
  'arms-crossed-power':  '[TRIGGER], half body portrait, arms crossed powerfully, dark suit, neutral gray studio background, soft studio lighting, authoritative confident pose',
  'sitting-confident':   '[TRIGGER], medium shot, sitting confidently, blazer, neutral gray studio background, soft studio lighting, executive presence',
  'leaning-elegant':     '[TRIGGER], medium shot, smart casual outfit, relaxed pose, neutral studio background, soft studio lighting, approachable confidence',
  'hands-in-pockets':    '[TRIGGER], half body portrait, hands in pockets relaxed, blazer, neutral gray studio background, soft studio lighting, casual confidence',
  'thoughtful-pose':     '[TRIGGER], portrait, hand near chin thoughtfully, professional attire, soft neutral studio background, soft studio lighting, intellectual look',
  'holding-tablet':      '[TRIGGER], half body portrait, holding tablet device, business casual attire, neutral studio background, soft studio lighting, tech-savvy professional',

  // ===== SPECIALTY POSES (vrouw) =====
  'w-arms-crossed-power': '[TRIGGER], half body portrait of professional woman, arms crossed confidently, tailored blazer, neutral gray studio background, soft studio lighting, authoritative elegant pose',
  'w-sitting-confident':  '[TRIGGER], medium shot of professional woman, sitting confidently, tailored blazer, neutral gray studio background, soft studio lighting, executive presence',
  'w-leaning-elegant':    '[TRIGGER], medium shot of woman, smart casual outfit, relaxed pose, neutral studio background, soft studio lighting, approachable elegant confidence',
  'w-hands-relaxed':      '[TRIGGER], half body portrait of woman, relaxed hand pose, blazer, neutral gray studio background, soft studio lighting, casual confidence',
  'w-thoughtful-pose':    '[TRIGGER], portrait of woman, hand near chin thoughtfully, professional attire, soft neutral studio background, soft studio lighting, intelligent elegant look',
  'w-holding-tablet':     '[TRIGGER], half body portrait of woman, holding tablet device, business casual attire, neutral studio background, soft studio lighting, tech-savvy professional',
}

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!styleIds || styleIds.length === 0) return NextResponse.json({ error: 'No styles selected' }, { status: 400 })

    const totalHeadshots = styleIds.length * VARIATIONS_PER_STYLE
    console.log(`🚀 Start: ${userId} | ${styleIds.length} styles × ${VARIATIONS_PER_STYLE} = ${totalHeadshots} portraits`)

    const { data: user, error: userError } = await supabase
      .from('users').select('*').eq('id', userId).single()

    if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Credits check: 4 credits per stijl (1 per gegenereerde portrait)
    const creditsNeeded = totalHeadshots
    if (user.credits < creditsNeeded) {
      return NextResponse.json({
        error: `Not enough credits. Need ${creditsNeeded} (${styleIds.length} styles × ${VARIATIONS_PER_STYLE}), have ${user.credits}`
      }, { status: 400 })
    }

    if (!user.trained_model_id) return NextResponse.json({ error: 'No trained model found' }, { status: 400 })

    // Gebruik het per-user getrainde model (productie). Elke klant krijgt z'n eigen LoRA.
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

    const baseNegativePrompt = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, porcelain skin, skin retouching, heavy skin smoothing, uncanny valley, CGI, 3d render, illustration, cartoon, oversaturated, HDR, oversharpened, instagram filter, heavy vignette, studio strobe lighting, artificial lighting, cropped head, partial face, head cut off, extreme close-up, face partially out of frame, only neck visible, sharp background, busy background, cluttered background, everything in focus, deep focus, cheap clothing, ill-fitting clothing, wrinkled suit, amateur snapshot, low budget, blurry face, out of focus face, soft focus on face, blurry eyes, soft blurry features, plain empty wall, boring flat background, bare wall background, dull background, amateur smartphone photo, selfie, snapshot, flat dull lighting, harsh lighting, people in background, bystanders in background, crowd in background, random clutter, messy objects, tattoos, arm tattoos, tattooed arms, tattooed skin"
    const fullNegativePrompt = negativeAdditions ? `${baseNegativePrompt}, ${negativeAdditions}` : baseNegativePrompt

    // Maak generation record met empty result_urls
    // total_expected = styles × 4 variations
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        styles_used: styleIds,
        result_urls: [],
        credits_used: 0,
        status: 'processing',
        total_predictions: styleIds.length,
      })
      .select()
      .single()

    if (genError || !generation) {
      console.error('❌ Supabase insert error:', JSON.stringify(genError, null, 2))
      console.error('Attempted insert:', { user_id: userId, styles_used: styleIds, result_urls: [], credits_used: 0, status: 'processing' })
      return NextResponse.json({
        error: 'Failed to create generation',
        details: genError?.message || 'Unknown Supabase error',
        code: genError?.code,
        hint: genError?.hint,
      }, { status: 500 })
    }

    const generationId = generation.id

    // Reserveer credits direct
    await supabase.from('users').update({ credits: user.credits - creditsNeeded }).eq('id', userId)

    const triggerWithDescription = personDescription ? `${triggerWord}, ${personDescription}` : triggerWord

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`

    // Start predictions SEQUENTIEEL met retry. Alles tegelijk afvuren liet
    // Replicate de extra starts weigeren (rate-limit/429) -> dan kwam er maar
    // 1 stijl door. Sequentieel + backoff voorkomt die burst.
    const startedPredictions: Array<{ styleId: string; predictionId?: string; success: boolean }> = []

    for (const styleId of styleIds) {
      const promptTemplate = STYLE_PROMPTS[styleId] || '[TRIGGER], professional headshot, clean neutral studio background, soft studio lighting, sharp focus'

      // Schone, professionele studio-look (zoals de bewezen oude prompts). Geen
      // "echte omgeving"-suffix meer (die gaf de amateur snapshot-achtergronden).
      const fullPrompt = `${promptTemplate.replace(/\[TRIGGER\]/g, triggerWithDescription)}, waist-up framing with comfortable headroom, sharp focus on face, sharp detailed eyes, tailored well-fitted premium clothing, professional photography, high quality, 4k`
      const webhookUrl = `${baseUrl}/api/generation-webhook?generationId=${generationId}&styleId=${encodeURIComponent(styleId)}&userId=${userId}`

      const input = {
        prompt: fullPrompt,
        negative_prompt: fullNegativePrompt,
        model: 'dev',
        lora_scale: 1,
        num_outputs: VARIATIONS_PER_STYLE, // 4 variaties per stijl
        aspect_ratio: aspectRatio || '3:4',
        output_format: 'webp',
        guidance_scale: 3.5,
        output_quality: 90,
        num_inference_steps: 28,
        disable_safety_checker: false,
      }

      // Tot 4 pogingen met oplopende vertraging bij tijdelijke fouten (429/5xx).
      let prediction: { id: string } | null = null
      let lastErr: unknown = null
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          prediction = await replicate.predictions.create({
            version: versionId,
            input,
            webhook: webhookUrl,
            webhook_events_filter: ['completed'],
          })
          break
        } catch (err) {
          lastErr = err
          const status = (err as { response?: { status?: number }; status?: number })?.response?.status
            ?? (err as { status?: number })?.status
          const retryable = !status || status === 429 || status >= 500
          if (!retryable || attempt === 3) break
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1))) // 1s, 2s, 3s
        }
      }

      if (prediction) {
        await supabase
          .from('generation_items')
          .upsert(
            { generation_id: generationId, style_id: styleId, prediction_id: prediction.id, status: 'processing' },
            { onConflict: 'prediction_id', ignoreDuplicates: true }
          )
        console.log(`✅ Started ${styleId} (4 variations) → ${prediction.id}`)
        startedPredictions.push({ styleId, predictionId: prediction.id, success: true })
      } else {
        // Startte niet: failed item vastleggen (refund) + de exacte fout bewaren voor diagnose.
        const errText = (lastErr instanceof Error ? lastErr.message : String(lastErr)).slice(0, 500)
        console.error(`❌ Failed to start ${styleId}:`, lastErr)
        try {
          const syntheticId = `failedstart-${generationId}-${styleId}`
          await supabase.rpc('record_generation_item', {
            p_generation_id: generationId,
            p_user_id: userId,
            p_style_id: styleId,
            p_prediction_id: syntheticId,
            p_status: 'failed',
            p_urls: [],
            p_variations: VARIATIONS_PER_STYLE,
          })
          await supabase.from('generation_items').update({ error: errText }).eq('prediction_id', syntheticId)
        } catch (rpcErr) {
          console.error(`❌ Kon failed item niet vastleggen voor ${styleId}:`, rpcErr)
        }
        startedPredictions.push({ styleId, success: false })
      }
    }

    const successfulStarts = startedPredictions.filter(p => p.success).length

    return NextResponse.json({
      success: true,
      generationId,
      pendingPredictions: successfulStarts,
      totalStyles: styleIds.length,
      totalHeadshots: totalHeadshots,
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