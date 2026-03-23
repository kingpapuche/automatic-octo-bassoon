import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

interface UserCharacteristics {
  gender?: string
  ethnicity?: string
  eye_color?: string
  hair_color?: string
  is_bald?: boolean
  has_glasses?: boolean
}

const skinToneMap: Record<string, string> = {
  'caucasian': 'fair skin',
  'latin american': 'warm medium brown skin',
  'hispanic': 'warm tan skin',
  'black': 'dark brown skin',
  'caribbean': 'rich brown skin',
  'asian': 'light tan skin',
  'middle eastern': 'olive skin',
  'mixed': 'warm medium brown skin',
  'south asian': 'warm brown skin',
  'african': 'deep brown skin',
  'arabic': 'olive warm skin',
  'indian': 'warm brown skin',
}

function buildPersonDescription(characteristics: UserCharacteristics): string {
  const parts: string[] = []
  
  if (characteristics.ethnicity && characteristics.gender) {
    const article = ['a', 'e', 'i', 'o', 'u'].includes(characteristics.ethnicity[0].toLowerCase()) ? 'an' : 'a'
    parts.push(`${article} ${characteristics.ethnicity} ${characteristics.gender}`)
  } else if (characteristics.gender) {
    parts.push(`a ${characteristics.gender}`)
  }

  if (characteristics.ethnicity) {
    const skinTone = skinToneMap[characteristics.ethnicity.toLowerCase()]
    if (skinTone) parts.push(skinTone)
  }
  
  if (characteristics.eye_color) parts.push(`with ${characteristics.eye_color} eyes`)
  
  if (characteristics.is_bald) {
    parts.push(`bald head`)
  } else if (characteristics.hair_color) {
    parts.push(`${characteristics.hair_color} hair`)
  }
  
  if (characteristics.has_glasses) parts.push(`wearing glasses`)

  // AGE RANGE BEWUST WEGGELATEN
  // Model is getraind op echte foto's — leeftijd zit ingebakken
  // Age range in prompt voegt ongewenste veroudering toe

  return parts.join(', ')
}

function buildNegativePromptAdditions(characteristics: UserCharacteristics): string {
  const negatives: string[] = []
  
  if (characteristics.gender === 'male') {
    negatives.push('female', 'woman', 'feminine features', 'makeup')
  } else if (characteristics.gender === 'female') {
    negatives.push('male', 'man', 'masculine features', 'beard', 'mustache', 'facial hair')
  }
  
  if (characteristics.is_bald) {
    negatives.push('hair on head', 'full head of hair', 'long hair', 'short hair', 'thick hair', 'hairstyle')
  }
  
  if (characteristics.has_glasses === false) {
    negatives.push('glasses', 'eyeglasses', 'spectacles', 'sunglasses')
  }
  
  return negatives.join(', ')
}

async function resolveModelVersionId(userId: string, trainedModelId: string): Promise<string> {
  const isVersionId = /^[a-f0-9]{64}$/.test(trainedModelId)
  if (isVersionId) return trainedModelId
  
  console.log(`🔍 Training job ID gevonden, versie ID ophalen bij Replicate...`)
  const training = await replicate.trainings.get(trainedModelId)
  console.log(`📊 Training status: ${training.status}`)
  
  if (training.status !== 'succeeded') {
    throw new Error(`Model nog niet klaar. Status: ${training.status}.`)
  }
  
  const output = training.output as any
  let versionId: string | null = null
  
  if (output?.version) {
    versionId = output.version
    if (versionId && versionId.includes(':')) versionId = versionId.split(':')[1]
  } else if (typeof output === 'string' && output.includes(':')) {
    versionId = output.split(':')[1]
  }
  
  if (!versionId) throw new Error('Kon versie ID niet ophalen.')
  
  await supabase.from('users').update({ trained_model_id: versionId }).eq('id', userId)
  return versionId
}

const STYLE_PROMPTS: Record<string, string> = {

  // ===== FORMAL / CORPORATE =====
  'corporate-classic': '[TRIGGER], professional headshot, navy blue suit, white dress shirt, modern office background with windows, natural light, sharp focus',
  'executive-navy': '[TRIGGER], half body portrait, arms crossed, navy blue suit with tie, office background with city view, soft natural light, confident pose',
  'ceo-black': '[TRIGGER], headshot portrait, black suit, white shirt, light gray background, soft natural light, strong presence',
  'boardroom-gray': '[TRIGGER], half body portrait, arms crossed, charcoal gray suit, modern office background with windows, natural lighting, confident pose',
  'power-suit': '[TRIGGER], half body portrait, dark navy suit, library or office background, warm ambient light, professional look',
  'light-blue-exec': '[TRIGGER], half body portrait, holding tablet, light blue blazer, white shirt, modern office with large windows, bright natural light',
  'pinstripe-pro': '[TRIGGER], professional headshot, pinstripe suit, neutral background, soft natural light, sharp professional look',
  'three-piece': '[TRIGGER], half body portrait, arms crossed, three piece suit with vest, office background, window light, distinguished look',
  'wall-street': '[TRIGGER], professional portrait, dark suit, red tie, city street background, confident expression, natural light',
  'corner-office': '[TRIGGER], medium shot, sitting at desk, dark suit, modern office, city view through windows, natural daylight',
  'conference-ready': '[TRIGGER], half body portrait, navy blazer, standing confidently, conference room background, soft natural light',
  'investor-meeting': '[TRIGGER], professional headshot, charcoal suit, white shirt, light neutral background, trustworthy expression, soft natural light',
  'formal-black': '[TRIGGER], headshot portrait, black formal suit, white shirt, neutral background, soft natural light, elegant',

  // ===== SMART CASUAL =====
  'teal-blazer': '[TRIGGER], half body portrait, arms crossed, teal blazer, white t-shirt, light background, soft natural light, modern professional',
  'beige-elegance': '[TRIGGER], half body portrait, watch visible on wrist, beige linen suit, dark background, warm ambient light, sophisticated',
  'gray-blazer-blue': '[TRIGGER], half body portrait, arms crossed, gray blazer, light background, soft window light, approachable professional',
  'open-collar-navy': '[TRIGGER], close up headshot, navy blazer, open collar white shirt, gray background, soft natural light, friendly expression',
  'blazer-white-tee': '[TRIGGER], medium shot portrait, black blazer over white t-shirt, outdoor evening background, natural light, confident',
  'v-neck-sweater': '[TRIGGER], headshot portrait, blue v-neck sweater over collared shirt, white background, soft light, smart casual',
  'office-casual-plants': '[TRIGGER], medium shot, sitting at modern desk, light blue oxford shirt, office with plants, natural daylight, relaxed',
  'weekend-blazer': '[TRIGGER], half body portrait, tan blazer, dark t-shirt, outdoor cafe background, natural light, relaxed confidence',
  'creative-director': '[TRIGGER], half body portrait, black blazer, black turtleneck, minimalist background, soft natural light, creative',
  'startup-ceo': '[TRIGGER], medium shot, navy blazer, no tie, open collar, coworking space background, natural light, energetic',
  'tech-lead': '[TRIGGER], headshot portrait, gray sport coat, crew neck, clean background, soft window light, natural expression',
  'consultant-look': '[TRIGGER], half body portrait, light gray suit, no tie, arms relaxed, modern office, soft natural light, confident',

  // ===== CASUAL PROFESSIONAL =====
  'white-tee-orange': '[TRIGGER], half body portrait, white t-shirt, warm orange toned background, fresh modern look, soft natural light',
  'black-tee-urban': '[TRIGGER], medium shot portrait, black t-shirt, city street background, natural daylight, confident casual',
  'navy-polo-clean': '[TRIGGER], headshot portrait, navy blue polo shirt, clean background, soft natural light, friendly expression',
  'gray-tee-crossed': '[TRIGGER], half body portrait, arms crossed, gray t-shirt, light background, natural light, relaxed pose',
  'white-tee-nature': '[TRIGGER], half body portrait, arms crossed, white t-shirt, green nature background blurred, outdoor natural light',
  'plaid-casual': '[TRIGGER], headshot portrait, plaid button-up shirt, neutral background, soft natural light, relaxed professional',
  'henley-relaxed': '[TRIGGER], medium shot, henley shirt, window lighting, home office background, comfortable natural feel',
  'denim-shirt': '[TRIGGER], headshot portrait, chambray denim shirt, white background, soft natural light, casual friendly look',
  'knit-sweater': '[TRIGGER], half body portrait, chunky knit sweater, warm ambient light, cozy background, approachable',
  'linen-summer': '[TRIGGER], half body portrait, white linen shirt, bright outdoor background, natural sunlight, relaxed',

  // ===== CREATIVE / EDGY =====
  'leather-jacket-city': '[TRIGGER], medium shot, black leather jacket, white t-shirt, city street background, natural evening light, edgy professional',
  'night-life': '[TRIGGER], medium shot, black outfit, leather jacket, city background with ambient lights, confident urban style',
  'turtleneck-modern': '[TRIGGER], close up portrait, gray turtleneck sweater, white curtain background, soft natural light, minimalist modern',
  'black-turtleneck-drama': '[TRIGGER], headshot portrait, black turtleneck, dark background, soft side light from window, moody atmosphere',
  'tech-founder': '[TRIGGER], half body portrait, dark gray t-shirt, arms crossed, modern office background, soft natural light, confident',
  'all-black-minimal': '[TRIGGER], half body portrait, all black outfit, dark neutral background, soft ambient light, minimal style',
  'creative-colorful': '[TRIGGER], headshot portrait, colorful patterned shirt, light background, soft natural light, creative professional',
  'rebel-professional': '[TRIGGER], medium shot, dark blazer, casual t-shirt underneath, urban outdoor background, natural light, creative style',

  // ===== OUTDOOR / NATURAL =====
  'park-portrait': '[TRIGGER], medium shot, outdoor park setting, casual shirt, dappled sunlight, relaxed natural pose',
  'rooftop-view': '[TRIGGER], medium shot, rooftop setting, city skyline background, smart casual outfit, natural daylight',
  'golden-hour': '[TRIGGER], portrait, golden hour lighting, outdoor, warm natural tones, lifestyle photography style',
  'nature-fresh': '[TRIGGER], half body portrait, light casual shirt, green nature background, soft daylight, fresh outdoor',
  'city-walk': '[TRIGGER], medium shot, walking pose, casual jacket, city street background, urban lifestyle, natural movement',
  'coffee-shop': '[TRIGGER], medium shot, coffee shop interior, casual smart outfit, warm ambient lighting, relaxed',
  'beach-professional': '[TRIGGER], medium shot, beach boardwalk, light linen shirt, ocean background, natural golden light',
  'architectural': '[TRIGGER], half body portrait, modern architecture background, business casual outfit, natural light, editorial style',

  // ===== SPECIALTY POSES =====
  'arms-crossed-power': '[TRIGGER], half body portrait, arms crossed, dark suit, natural background light, authoritative pose',
  'holding-tablet': '[TRIGGER], half body portrait, holding tablet device, business casual, modern office, natural daylight',
  'sitting-confident': '[TRIGGER], medium shot, sitting confidently in chair, blazer, office setting, natural window light',
  'leaning-casual': '[TRIGGER], medium shot, leaning against wall, smart casual outfit, modern interior, soft natural light',
  'hands-in-pockets': '[TRIGGER], half body portrait, hands in pockets, blazer and jeans, outdoor urban background, natural light',
  'thoughtful-pose': '[TRIGGER], headshot portrait, hand near chin, professional attire, soft background, natural window light',
  'looking-up': '[TRIGGER], headshot portrait, looking up confidently, professional attire, bright outdoor background, natural light',

  // ===== COLORED BACKGROUNDS =====
  'blue-studio': '[TRIGGER], professional headshot, business attire, solid blue background, soft even lighting, clean look',
  'green-studio': '[TRIGGER], half body portrait, smart casual outfit, solid green background, soft natural-style light',
  'purple-creative': '[TRIGGER], headshot portrait, dark outfit, purple background, soft creative lighting',
  'yellow-energetic': '[TRIGGER], half body portrait, casual outfit, bright yellow background, vibrant, energetic',
  'red-bold': '[TRIGGER], headshot portrait, dark outfit, red background, bold, confident, soft even light',
  'gradient-modern': '[TRIGGER], professional headshot, modern outfit, gradient background, contemporary style, soft light',

  // ===== FULL BODY =====
  'fullbody-navy-suit': '[TRIGGER], full body portrait, standing confidently, navy blue suit, white shirt, light neutral background, natural light, head to toe',
  'fullbody-black-outfit': '[TRIGGER], full body portrait, standing tall, all black outfit, dark background, soft ambient light, full length',
  'fullbody-casual-white': '[TRIGGER], full body portrait, standing relaxed, white t-shirt, light jeans, white background, natural light, full length',
  'fullbody-blazer-jeans': '[TRIGGER], full body portrait, hand in pocket, blazer and dark jeans, modern interior, soft natural light, head to toe',
  'fullbody-city-street': '[TRIGGER], full body portrait, city street, smart casual outfit, natural daylight, lifestyle photography',
  'fullbody-outdoor': '[TRIGGER], full body portrait, park setting, casual smart outfit, green background blurred, natural light, relaxed full body',

  // ===== ZONNEBRIL =====
  'sunglasses-city': '[TRIGGER], half body portrait, stylish sunglasses, dark blazer, city street background, natural daylight, cool confident',
  'sunglasses-outdoor': '[TRIGGER], medium shot, sunglasses, casual jacket, outdoor sunny background, natural daylight, relaxed',
  'sunglasses-black-suit': '[TRIGGER], half body portrait, dark sunglasses, black suit, urban background, natural light, confident',
  'sunglasses-casual': '[TRIGGER], headshot portrait, sunglasses, white t-shirt, outdoor bright background, natural light, casual cool',

  // ===== LUXURY / WATCH =====
  'watch-showcase': '[TRIGGER], half body portrait, hand visible with luxury watch, beige blazer, dark background, warm ambient light, sophisticated',
  'watch-luxury-outdoor': '[TRIGGER], medium shot, sitting relaxed, luxury watch on wrist, smart casual blazer, outdoor nature background, natural light',
  'watch-dark-elegant': '[TRIGGER], half body portrait, hand showing watch, dark suit, dark background, soft ambient light, luxury style',

  // ===== GEKLEURDE PAKKEN =====
  'teal-suit': '[TRIGGER], half body portrait, arms crossed, teal suit, white shirt, light background, soft natural light, bold professional',
  'green-suit': '[TRIGGER], half body portrait, green blazer suit, light background, soft natural light, fresh bold look',
  'pink-blazer': '[TRIGGER], half body portrait, pink blazer, white top, light background, soft natural light, stylish modern',
  'orange-suit': '[TRIGGER], half body portrait, orange blazer, white shirt, vibrant background, natural light, energetic professional',
  'brown-suit-elegant': '[TRIGGER], half body portrait, warm brown suit, open collar, dark background, warm ambient light, elegant',

  // ===== TUXEDO / BLACK TIE =====
  'tuxedo-classic': '[TRIGGER], half body portrait, black tuxedo, white dress shirt, black bow tie, dark elegant background, soft ambient light',
  'tuxedo-modern': '[TRIGGER], headshot portrait, modern slim tuxedo, no tie, open collar, soft dramatic light, elegant evening',

  // ===== MOTOR / LIFESTYLE =====
  'moto-leather': '[TRIGGER], medium shot, leaning against motorcycle, brown leather jacket, white t-shirt, outdoor urban background, natural light',
  'moto-city': '[TRIGGER], half body portrait, standing next to motorbike, black leather jacket, city street, natural daylight, confident',

  // ===== ZITTEND CASUAL =====
  'sitting-ground': '[TRIGGER], medium shot, sitting casually on ground, knees up, casual outfit, soft outdoor light, relaxed approachable',
  'sitting-steps': '[TRIGGER], medium shot, sitting on outdoor steps, smart casual outfit, urban background, natural daylight, candid feel',
  'sitting-chair-casual': '[TRIGGER], medium shot, sitting sideways in chair, arms on backrest, smart casual outfit, modern interior, soft window light',

  // ===== CLOSE-UP HEADSHOTS =====
  'closeup-dramatic': '[TRIGGER], extreme close up headshot, side window light, dark background, intense gaze, cinematic portrait',
  'closeup-warm': '[TRIGGER], close up headshot, soft warm window light, light background, genuine warm smile, approachable',
  'closeup-outdoor': '[TRIGGER], close up headshot, outdoor natural light, blurred green background, fresh natural look, candid feel',

  // ===== VROUWENSTIJLEN — JURKEN =====
  'sheath-dress-navy': '[TRIGGER], headshot portrait, navy blue sheath dress, knee length, clean lines, office background, soft natural light, elegant professional',
  'sheath-dress-burgundy': '[TRIGGER], headshot portrait, deep burgundy sheath dress, modest neckline, neutral background, soft window light, confident sophisticated',
  'wrap-dress-emerald': '[TRIGGER], half body portrait, emerald green wrap dress, v-neckline, outdoor nature background, soft natural light, warm confident',
  'jewel-dress-sapphire': '[TRIGGER], headshot portrait, sapphire blue fitted dress, professional neckline, light neutral background, soft natural light, polished',
  'sheath-dress-with-blazer': '[TRIGGER], half body portrait, navy sheath dress with matching blazer, office background with plants, natural daylight, executive look',

  // ===== VROUWENSTIJLEN — BLAZER COMBINATIES =====
  'women-blazer-white-blouse': '[TRIGGER], headshot portrait, navy blazer over crisp white blouse, clean neutral background, soft natural light, classic professional',
  'women-blazer-camisole': '[TRIGGER], half body portrait, black blazer over silk camisole, modern office background, soft window light, sophisticated feminine',
  'women-emerald-blazer': '[TRIGGER], headshot portrait, emerald green blazer, white top underneath, light background, soft natural light, bold professional feminine',
  'women-burgundy-blazer': '[TRIGGER], half body portrait, burgundy blazer, neutral blouse, modern interior background, soft natural light, warm confident',

  // ===== VROUWENSTIJLEN — SOFT & WARM =====
  'cardigan-professional': '[TRIGGER], headshot portrait, cream cardigan over blouse, soft indoor background, warm window light, approachable warm professional',
  'soft-knit-sage': '[TRIGGER], headshot portrait, sage green soft knit sweater, clean background, soft natural light, calm approachable look',
  'fine-knit-camel': '[TRIGGER], close up headshot, camel fine knit turtleneck, neutral background, warm soft light, elegant understated',

  // ===== VROUWENSTIJLEN — BLOUSES =====
  'silk-blouse-jewel': '[TRIGGER], headshot portrait, jewel tone silk blouse, soft draping neckline, light neutral background, soft natural light, polished feminine',
  'vneck-blouse-professional': '[TRIGGER], headshot portrait, professional v-neck blouse in deep teal, clean background, soft window light, approachable confident',
  'soft-blouse-outdoor': '[TRIGGER], medium shot, flowing soft blouse in dusty rose, outdoor garden background, golden hour light, warm approachable',
}

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!styleIds || styleIds.length === 0) return NextResponse.json({ error: 'No styles selected' }, { status: 400 })

    console.log(`🚀 Starting generation for user: ${userId}`)

    const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).single()

    if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const creditsNeeded = styleIds.length
    if (user.credits < creditsNeeded) {
      return NextResponse.json({ error: `Not enough credits. Need ${creditsNeeded}, have ${user.credits}` }, { status: 400 })
    }

    if (!user.trained_model_id) return NextResponse.json({ error: 'No trained model found' }, { status: 400 })

    const modelVersionId = await resolveModelVersionId(userId, user.trained_model_id)
    const triggerWord = user.trigger_word || 'HEADSHOT'
    
    const characteristics: UserCharacteristics = {
      gender: user.gender,
      ethnicity: user.ethnicity,
      eye_color: user.eye_color,
      hair_color: user.hair_color,
      is_bald: user.is_bald,
      has_glasses: user.has_glasses,
    }
    
    const personDescription = buildPersonDescription(characteristics)
    const negativeAdditions = buildNegativePromptAdditions(characteristics)
    
    console.log(`✅ User has ${user.credits} credits, needs ${creditsNeeded}`)
    console.log(`👤 Person description: ${personDescription}`)

    const generatedImages: string[] = []
    const failedStyles: string[] = []

    const baseNegativePrompt = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, blurry, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, porcelain skin, skin retouching, heavy skin smoothing, uncanny valley, CGI, 3d render, illustration, cartoon, oversaturated, HDR, oversharpened, instagram filter, heavy vignette, studio strobe lighting, artificial lighting, added wrinkles, aging effects, jowls, sagging skin"

    const fullNegativePrompt = negativeAdditions ? `${baseNegativePrompt}, ${negativeAdditions}` : baseNegativePrompt

    for (const styleId of styleIds) {
      const promptTemplate = STYLE_PROMPTS[styleId] || '[TRIGGER], professional headshot portrait, natural lighting, clean background, sharp focus'
      const triggerWithDescription = personDescription ? `${triggerWord}, ${personDescription}` : triggerWord
      const realism = 'natural skin texture, photorealistic, candid feel, film grain, shot on 50mm lens, subtle skin imperfections'
      const fullPrompt = promptTemplate.replace(/\[TRIGGER\]/g, triggerWithDescription) + `, ${realism}`

      console.log(`🎨 Generating style: ${styleId}`)

      try {
        const output = await replicate.run(
          `kingpapuche/headshot-model:${modelVersionId}`,
          {
            input: {
              prompt: fullPrompt,
              negative_prompt: fullNegativePrompt,
              model: "dev",
              lora_scale: 1,
              num_outputs: 1,
              aspect_ratio: aspectRatio || "3:4",
              output_format: "webp",
              guidance_scale: 3.0,
              output_quality: 90,
              num_inference_steps: 35,
              disable_safety_checker: false,
            },
          }
        )

        if (Array.isArray(output)) {
          for (let i = 0; i < output.length; i++) {
            const imageUrl = output[i]
            try {
              const response = await fetch(imageUrl as string)
              const arrayBuffer = await response.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              const filename = `generated/${userId}/${Date.now()}-${styleId}-${i}.webp`

              const { error: uploadError } = await supabase.storage.from('headshots').upload(filename, buffer, {
                contentType: 'image/webp',
                cacheControl: '31536000',
                upsert: true,
              })

              if (!uploadError) {
                const { data: publicUrlData } = supabase.storage.from('headshots').getPublicUrl(filename)
                generatedImages.push(publicUrlData.publicUrl)
                console.log(`✅ Saved image ${generatedImages.length}: ${styleId}`)
              } else {
                generatedImages.push(imageUrl as string)
              }
            } catch {
              generatedImages.push(imageUrl as string)
            }
          }
        }
      } catch (genError) {
        console.error(`❌ Error generating style ${styleId}:`, genError)
        failedStyles.push(styleId)
      }
    }

    if (generatedImages.length > 0) {
      await supabase.from('style_analytics').insert(styleIds.map((styleId: string) => ({ style_id: styleId, user_id: userId })))
    }

    const actualCreditsUsed = generatedImages.length
    const newCredits = user.credits - actualCreditsUsed
    await supabase.from('users').update({ credits: newCredits }).eq('id', userId)

    const { data: generation } = await supabase.from('generations').insert({
      user_id: userId,
      result_urls: generatedImages,
      styles_used: styleIds,
      credits_used: actualCreditsUsed,
      status: 'completed',
    }).select().single()

    await supabase.from('credits_transactions').insert({
      user_id: userId,
      amount: -actualCreditsUsed,
      type: 'generation',
      description: `Generated ${generatedImages.length} headshots (${styleIds.length} styles)`,
    })

    return NextResponse.json({
      success: true,
      imagesGenerated: generatedImages.length,
      imageUrls: generatedImages,
      creditsUsed: actualCreditsUsed,
      creditsRemaining: newCredits,
      generationId: generation?.id,
      failedStyles: failedStyles.length > 0 ? failedStyles : undefined,
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    return NextResponse.json({ error: 'Generation failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}