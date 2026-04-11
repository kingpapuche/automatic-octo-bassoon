import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!
const RUNPOD_GENERATION_ENDPOINT = process.env.RUNPOD_GENERATION_ENDPOINT_ID!

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
  if (characteristics.is_bald) parts.push('bald head')
  else if (characteristics.hair_color) parts.push(`${characteristics.hair_color} hair`)
  if (characteristics.has_glasses) parts.push('wearing glasses')
  return parts.join(', ')
}

function buildNegativePrompt(characteristics: UserCharacteristics): string {
  const negatives: string[] = []
  if (characteristics.gender === 'male') negatives.push('female', 'woman', 'feminine features', 'makeup')
  else if (characteristics.gender === 'female') negatives.push('male', 'man', 'masculine features', 'beard', 'mustache')
  if (characteristics.is_bald) negatives.push('hair on head', 'full head of hair', 'long hair')
  if (characteristics.has_glasses === false) negatives.push('glasses', 'eyeglasses', 'spectacles')
  return negatives.join(', ')
}

const STYLE_PROMPTS: Record<string, string> = {
  // ===== FORMAL / CORPORATE =====
  'corporate-classic': 'professional headshot, navy blue suit, white dress shirt, modern office background with windows, natural light, sharp focus',
  'executive-navy': 'half body portrait, arms crossed, navy blue suit with tie, office background with city view, soft natural light, confident pose',
  'ceo-black': 'headshot portrait, black suit, white shirt, light gray background, soft natural light, strong presence',
  'boardroom-gray': 'half body portrait, arms crossed, charcoal gray suit, modern office background with windows, natural lighting, confident pose',
  'power-suit': 'half body portrait, dark navy suit, library or office background, warm ambient light, professional look',
  'light-blue-exec': 'half body portrait, holding tablet, light blue blazer, white shirt, modern office with large windows, bright natural light',
  'pinstripe-pro': 'professional headshot, pinstripe suit, neutral background, soft natural light, sharp professional look',
  'three-piece': 'half body portrait, arms crossed, three piece suit with vest, office background, window light, distinguished look',
  'wall-street': 'professional portrait, dark suit, red tie, city street background, confident expression, natural light',
  'corner-office': 'medium shot, sitting at desk, dark suit, modern office, city view through windows, natural daylight',
  'conference-ready': 'half body portrait, navy blazer, standing confidently, conference room background, soft natural light',
  'investor-meeting': 'professional headshot, charcoal suit, white shirt, light neutral background, trustworthy expression, soft natural light',
  'formal-black': 'headshot portrait, black formal suit, white shirt, neutral background, soft natural light, elegant',
  // ===== SMART CASUAL =====
  'teal-blazer': 'half body portrait, arms crossed, teal blazer, white t-shirt, light background, soft natural light, modern professional',
  'beige-elegance': 'half body portrait, watch visible on wrist, beige linen suit, dark background, warm ambient light, sophisticated',
  'gray-blazer-blue': 'half body portrait, arms crossed, gray blazer, light background, soft window light, approachable professional',
  'open-collar-navy': 'close up headshot, navy blazer, open collar white shirt, gray background, soft natural light, friendly expression',
  'blazer-white-tee': 'medium shot portrait, black blazer over white t-shirt, outdoor evening background, natural light, confident',
  'v-neck-sweater': 'headshot portrait, blue v-neck sweater over collared shirt, white background, soft light, smart casual',
  'office-casual-plants': 'medium shot, sitting at modern desk, light blue oxford shirt, office with plants, natural daylight, relaxed',
  'weekend-blazer': 'half body portrait, tan blazer, dark t-shirt, outdoor cafe background, natural light, relaxed confidence',
  'creative-director': 'half body portrait, black blazer, black turtleneck, minimalist background, soft natural light, creative',
  'startup-ceo': 'medium shot, navy blazer, no tie, open collar, coworking space background, natural light, energetic',
  'tech-lead': 'headshot portrait, gray sport coat, crew neck, clean background, soft window light, natural expression',
  'consultant-look': 'half body portrait, light gray suit, no tie, arms relaxed, modern office, soft natural light, confident',
  // ===== CASUAL =====
  'white-tee-orange': 'half body portrait, white t-shirt, warm orange toned background, fresh modern look, soft natural light',
  'black-tee-urban': 'medium shot portrait, black t-shirt, city street background, natural daylight, confident casual',
  'navy-polo-clean': 'headshot portrait, navy blue polo shirt, clean background, soft natural light, friendly expression',
  'gray-tee-crossed': 'half body portrait, arms crossed, gray t-shirt, light background, natural light, relaxed pose',
  'white-tee-nature': 'half body portrait, arms crossed, white t-shirt, green nature background blurred, outdoor natural light',
  'plaid-casual': 'headshot portrait, plaid button-up shirt, neutral background, soft natural light, relaxed professional',
  'henley-relaxed': 'medium shot, henley shirt, window lighting, home office background, comfortable natural feel',
  'denim-shirt': 'headshot portrait, chambray denim shirt, white background, soft natural light, casual friendly look',
  'knit-sweater': 'half body portrait, chunky knit sweater, warm ambient light, cozy background, approachable',
  'linen-summer': 'half body portrait, white linen shirt, bright outdoor background, natural sunlight, relaxed',
  // ===== CREATIVE =====
  'leather-jacket-city': 'medium shot, black leather jacket, white t-shirt, city street background, natural evening light, edgy professional',
  'night-life': 'medium shot, black outfit, leather jacket, city background with ambient lights, confident urban style',
  'turtleneck-modern': 'close up portrait, gray turtleneck sweater, white curtain background, soft natural light, minimalist modern',
  'black-turtleneck-drama': 'headshot portrait, black turtleneck, dark background, soft side light from window, moody atmosphere',
  'tech-founder': 'half body portrait, dark gray t-shirt, arms crossed, modern office background, soft natural light, confident',
  'all-black-minimal': 'half body portrait, all black outfit, dark neutral background, soft ambient light, minimal style',
  'creative-colorful': 'headshot portrait, colorful patterned shirt, light background, soft natural light, creative professional',
  'rebel-professional': 'medium shot, dark blazer, casual t-shirt underneath, urban outdoor background, natural light, creative style',
  // ===== OUTDOOR =====
  'park-portrait': 'medium shot, outdoor park setting, casual shirt, dappled sunlight, relaxed natural pose',
  'rooftop-view': 'medium shot, rooftop setting, city skyline background, smart casual outfit, natural daylight',
  'golden-hour': 'portrait, golden hour lighting, outdoor, warm natural tones, lifestyle photography style',
  'nature-fresh': 'half body portrait, light casual shirt, green nature background, soft daylight, fresh outdoor',
  'city-walk': 'medium shot, walking pose, casual jacket, city street background, urban lifestyle, natural movement',
  'coffee-shop': 'medium shot, coffee shop interior, casual smart outfit, warm ambient lighting, relaxed',
  'beach-professional': 'medium shot, beach boardwalk, light linen shirt, ocean background, natural golden light',
  'architectural': 'half body portrait, modern architecture background, business casual outfit, natural light, editorial style',
  // ===== POSES =====
  'arms-crossed-power': 'half body portrait, arms crossed, dark suit, natural background light, authoritative pose',
  'holding-tablet': 'half body portrait, holding tablet device, business casual, modern office, natural daylight',
  'sitting-confident': 'medium shot, sitting confidently in chair, blazer, office setting, natural window light',
  'leaning-casual': 'medium shot, leaning against wall, smart casual outfit, modern interior, soft natural light',
  'hands-in-pockets': 'half body portrait, hands in pockets, blazer and jeans, outdoor urban background, natural light',
  'thoughtful-pose': 'headshot portrait, hand near chin, professional attire, soft background, natural window light',
  'looking-up': 'headshot portrait, looking up confidently, professional attire, bright outdoor background, natural light',
  // ===== COLORED BACKGROUNDS =====
  'blue-studio': 'professional headshot, business attire, solid blue background, soft even lighting, clean look',
  'green-studio': 'half body portrait, smart casual outfit, solid green background, soft natural-style light',
  'purple-creative': 'headshot portrait, dark outfit, purple background, soft creative lighting',
  'yellow-energetic': 'half body portrait, casual outfit, bright yellow background, vibrant, energetic',
  'red-bold': 'headshot portrait, dark outfit, red background, bold, confident, soft even light',
  'gradient-modern': 'professional headshot, modern outfit, gradient background, contemporary style, soft light',
  // ===== FULL BODY =====
  'fullbody-navy-suit': 'full body portrait, standing confidently, navy blue suit, white shirt, light neutral background, natural light, head to toe',
  'fullbody-black-outfit': 'full body portrait, standing tall, all black outfit, dark background, soft ambient light, full length',
  'fullbody-casual-white': 'full body portrait, standing relaxed, white t-shirt, light jeans, white background, natural light, full length',
  'fullbody-blazer-jeans': 'full body portrait, hand in pocket, blazer and dark jeans, modern interior, soft natural light, head to toe',
  'fullbody-city-street': 'full body portrait, city street, smart casual outfit, natural daylight, lifestyle photography',
  'fullbody-outdoor': 'full body portrait, park setting, casual smart outfit, green background blurred, natural light, relaxed full body',
  // ===== SUNGLASSES =====
  'sunglasses-city': 'half body portrait, stylish sunglasses, dark blazer, city street background, natural daylight, cool confident',
  'sunglasses-outdoor': 'medium shot, sunglasses, casual jacket, outdoor sunny background, natural daylight, relaxed',
  'sunglasses-black-suit': 'half body portrait, dark sunglasses, black suit, urban background, natural light, confident',
  'sunglasses-casual': 'headshot portrait, sunglasses, white t-shirt, outdoor bright background, natural light, casual cool',
  // ===== LUXURY =====
  'watch-showcase': 'half body portrait, hand visible with luxury watch, beige blazer, dark background, warm ambient light, sophisticated',
  'watch-luxury-outdoor': 'medium shot, sitting relaxed, luxury watch on wrist, smart casual blazer, outdoor nature background, natural light',
  'watch-dark-elegant': 'half body portrait, hand showing watch, dark suit, dark background, soft ambient light, luxury style',
  // ===== BOLD COLORS =====
  'teal-suit': 'half body portrait, arms crossed, teal suit, white shirt, light background, soft natural light, bold professional',
  'green-suit': 'half body portrait, green blazer suit, light background, soft natural light, fresh bold look',
  'pink-blazer': 'half body portrait, pink blazer, white top, light background, soft natural light, stylish modern',
  'orange-suit': 'half body portrait, orange blazer, white shirt, vibrant background, natural light, energetic professional',
  'brown-suit-elegant': 'half body portrait, warm brown suit, open collar, dark background, warm ambient light, elegant',
  // ===== TUXEDO =====
  'tuxedo-classic': 'half body portrait, black tuxedo, white dress shirt, black bow tie, dark elegant background, soft ambient light',
  'tuxedo-modern': 'headshot portrait, modern slim tuxedo, no tie, open collar, soft dramatic light, elegant evening',
  // ===== MOTOR =====
  'moto-leather': 'medium shot, leaning against motorcycle, brown leather jacket, white t-shirt, outdoor urban background, natural light',
  'moto-city': 'half body portrait, standing next to motorbike, black leather jacket, city street, natural daylight, confident',
  // ===== SITTING =====
  'sitting-ground': 'medium shot, sitting casually on ground, knees up, casual outfit, soft outdoor light, relaxed approachable',
  'sitting-steps': 'medium shot, sitting on outdoor steps, smart casual outfit, urban background, natural daylight, candid feel',
  'sitting-chair-casual': 'medium shot, sitting sideways in chair, arms on backrest, smart casual outfit, modern interior, soft window light',
  // ===== CLOSE-UP =====
  'closeup-dramatic': 'extreme close up headshot, side window light, dark background, intense gaze, cinematic portrait',
  'closeup-warm': 'close up headshot, soft warm window light, light background, genuine warm smile, approachable',
  'closeup-outdoor': 'close up headshot, outdoor natural light, blurred green background, fresh natural look, candid feel',
  // ===== WOMEN — CORPORATE =====
  'w-black-blazer-city': 'headshot portrait, black blazer, white shirt underneath, modern office with city window background, soft natural light, confident professional',
  'w-navy-blazer-arms': 'half body portrait, arms crossed, navy blue blazer, light blouse, soft neutral background, natural light, confident feminine',
  'w-white-shirt-pro': 'headshot portrait, crisp white blouse, clean neutral background, soft window light, polished professional',
  'w-light-blue-shirt': 'headshot portrait, light blue button-up blouse, studio background, soft natural light, approachable professional',
  'w-black-turtleneck-pro': 'headshot portrait, black turtleneck, dark background, soft side light, sophisticated minimal',
  'w-teal-turtleneck': 'headshot portrait, teal turtleneck sweater, modern office background, soft natural light, polished confident',
  'w-cream-blazer': 'half body portrait, arms crossed, cream white blazer, light neutral background, soft natural light, elegant professional',
  'w-dark-blazer-table': 'medium shot, sitting at table, dark blazer, restaurant or office background, warm ambient light, confident feminine',
  'w-white-blazer-arms': 'half body portrait, arms crossed, white blazer, light neutral background, soft natural light, sharp professional',
  'w-black-outfit-minimal': 'headshot portrait, all black outfit, white studio background, soft even light, minimal elegant',
  // ===== WOMEN — GEKLEURDE SUITS =====
  'w-red-suit': 'half body portrait, red power suit blazer, holding laptop, purple background, soft natural light, bold confident feminine',
  'w-pink-suit': 'half body portrait, pink blazer suit, modern office background, soft natural light, stylish feminine professional',
  'w-blue-suit': 'half body portrait, light blue suit blazer, dark background, soft natural light, fresh professional',
  'w-green-suit': 'half body portrait, green blazer suit, matching green background, soft natural light, bold feminine',
  'w-orange-suit': 'half body portrait, orange blazer, purple background, soft natural light, vibrant confident feminine',
  'w-camel-blazer': 'half body portrait, camel tan blazer, neutral background, soft warm light, elegant feminine professional',
  'w-green-dark-blazer': 'headshot portrait, dark forest green blazer, studio background, soft natural light, sophisticated feminine',
  'w-brown-blazer': 'half body portrait, warm brown blazer, neutral background, soft warm light, elegant feminine',
  // ===== WOMEN — SMART CASUAL =====
  'w-blazer-jeans-street': 'half body portrait, blazer and jeans, city street background, natural daylight, casual chic feminine',
  'w-black-blazer-outdoor': 'half body portrait, arms crossed, black blazer, outdoor background, natural light, confident feminine',
  'w-beige-blazer-casual': 'half body portrait, beige blazer, casual top underneath, city walk background, natural light, relaxed chic',
  'w-leather-jacket': 'half body portrait, black leather jacket, city street background, natural daylight, edgy confident feminine',
  'w-leather-jacket-city': 'medium shot, black leather jacket, night city background with bokeh lights, confident urban feminine style',
  'w-denim-jacket': 'headshot portrait, denim jacket, white t-shirt underneath, casual outdoor background, natural light, relaxed feminine',
  'w-navy-turtleneck-street': 'half body portrait, arms crossed, navy turtleneck, city street background, natural daylight, modern feminine',
  'w-dark-blazer-restaurant': 'medium shot, dark blazer, warm restaurant background, ambient warm light, elegant evening feminine',
  // ===== WOMEN — CASUAL =====
  'w-white-tee-casual': 'half body portrait, white t-shirt, jeans, studio background, soft natural light, fresh casual feminine',
  'w-red-tee': 'half body portrait, red t-shirt, beige pants, neutral background, soft natural light, casual feminine',
  'w-pink-tee-street': 'medium shot, pink t-shirt, city street background, natural daylight, casual relaxed feminine',
  'w-purple-tee': 'half body portrait, purple t-shirt, pink background, soft natural light, vibrant casual feminine',
  'w-orange-polo': 'half body portrait, orange polo shirt, outdoor background, natural light, casual energetic feminine',
  'w-yellow-shirt': 'headshot portrait, yellow blouse, casual outfit, soft natural light, bright friendly feminine',
  'w-cream-tee-sitting': 'medium shot, sitting casually, cream t-shirt, studio background, soft natural light, relaxed approachable feminine',
  'w-brown-longsleeve': 'half body portrait, arms crossed, brown longsleeve top, neutral background, soft warm light, casual confident feminine',
  // ===== WOMEN — OUTDOOR =====
  'w-outdoor-blazer-nature': 'half body portrait, beige blazer, outdoor nature background with trees, soft natural daylight, relaxed professional feminine',
  'w-outdoor-city-walk': 'medium shot, walking pose, casual smart outfit, city street background, natural daylight, lifestyle feminine',
  'w-outdoor-cafe': 'medium shot, smart casual outfit, outdoor café terrace background, warm natural light, relaxed feminine',
  'w-golden-hour': 'portrait, warm golden hour lighting, outdoor, soft warm tones, lifestyle photography feminine',
  'w-park-portrait': 'medium shot, natural light, green park background blurred, casual smart outfit, fresh outdoor feminine',
  'w-rooftop-city': 'half body portrait, smart casual outfit, rooftop with city panorama background, evening light, confident feminine',
  'w-desert-boho': 'medium shot, rust brown dress, desert landscape background, warm natural light, boho feminine portrait',
  // ===== WOMEN — JURKEN =====
  'w-black-dress-casual': 'headshot portrait, black casual dress, studio background, soft natural light, simple elegant feminine',
  'w-black-maxi-dress': 'half body portrait, black maxi dress, elegant background, soft ambient light, sophisticated feminine',
  'w-black-slip-dress': 'headshot portrait, black slip dress, minimal background, soft natural light, minimal chic feminine',
  'sheath-dress-navy': 'headshot portrait, navy blue sheath dress, clean lines, office background, soft natural light, elegant professional',
  'sheath-dress-burgundy': 'headshot portrait, deep burgundy sheath dress, neutral background, soft window light, confident sophisticated',
  'wrap-dress-emerald': 'half body portrait, emerald green wrap dress, outdoor nature background, soft natural light, warm confident',
  'w-brown-skirt-top': 'half body portrait, brown midi skirt with matching top, neutral background, soft warm light, elegant feminine',
  'sheath-dress-with-blazer': 'half body portrait, navy sheath dress with matching blazer, office background, natural daylight, executive feminine',
  // ===== WOMEN — SOFT & WARM =====
  'cardigan-professional': 'headshot portrait, cream cardigan over blouse, soft indoor background, warm window light, approachable warm professional',
  'soft-knit-sage': 'headshot portrait, sage green soft knit sweater, clean background, soft natural light, calm approachable feminine',
  'fine-knit-camel': 'close up headshot, camel fine knit turtleneck, neutral background, warm soft light, elegant understated feminine',
  'w-white-blouse-arms': 'half body portrait, arms crossed, white blouse, neutral background, soft natural light, clean professional feminine',
  'silk-blouse-jewel': 'headshot portrait, jewel tone silk blouse, soft draping neckline, light neutral background, soft natural light, polished feminine',
  'vneck-blouse-professional': 'headshot portrait, teal v-neck blouse, clean background, soft window light, approachable confident feminine',
  'soft-blouse-outdoor': 'medium shot, flowing dusty rose blouse, outdoor garden background, golden hour light, warm approachable feminine',
}

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!styleIds || styleIds.length === 0) return NextResponse.json({ error: 'No styles selected' }, { status: 400 })

    const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).single()
    if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const creditsNeeded = styleIds.length
    if (user.credits < creditsNeeded) {
      return NextResponse.json({ error: `Not enough credits. Need ${creditsNeeded}, have ${user.credits}` }, { status: 400 })
    }

    if (!user.trained_model_id) return NextResponse.json({ error: 'No trained model found' }, { status: 400 })

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
    const negativeAdditions = buildNegativePrompt(characteristics)

    const baseNegative = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, blurry, low quality, disfigured, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, CGI, 3d render, illustration, cartoon, oversaturated, HDR"
    const fullNegative = negativeAdditions ? `${baseNegative}, ${negativeAdditions}` : baseNegative

    // Haal lora_url op uit Supabase storage
    const loraUrl = user.lora_url // opgeslagen door RunPod training webhook
    if (!loraUrl) return NextResponse.json({ error: 'LoRA model URL not found. Training may not be complete.' }, { status: 400 })

    console.log(`🚀 Starting generation for user: ${userId}, ${styleIds.length} styles`)

    const generatedImages: string[] = []
    const failedStyles: string[] = []

    for (const styleId of styleIds) {
      const stylePrompt = STYLE_PROMPTS[styleId] || 'professional headshot portrait, natural lighting, clean background'
      const fullPrompt = personDescription ? `${triggerWord}, ${personDescription}, ${stylePrompt}` : `${triggerWord}, ${stylePrompt}`

      try {
        // Stuur job naar RunPod generation endpoint
        const runpodResponse = await fetch(
          `https://api.runpod.io/v2/${RUNPOD_GENERATION_ENDPOINT}/runsync`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RUNPOD_API_KEY}`,
            },
            body: JSON.stringify({
              input: {
                user_id: userId,
                lora_url: loraUrl,
                trigger_word: triggerWord,
                style_id: styleId,
                prompt: fullPrompt,
                negative_prompt: fullNegative,
                gender: user.gender,
              },
            }),
          }
        )

        if (!runpodResponse.ok) {
          console.error(`❌ RunPod error for style ${styleId}`)
          failedStyles.push(styleId)
          continue
        }

        const result = await runpodResponse.json()

        if (result.output?.image_url) {
          generatedImages.push(result.output.image_url)
          console.log(`✅ Generated: ${styleId}`)
        } else {
          failedStyles.push(styleId)
        }
      } catch (error) {
        console.error(`❌ Error generating style ${styleId}:`, error)
        failedStyles.push(styleId)
      }
    }

    // Credits aftrekken
    const actualCreditsUsed = generatedImages.length
    const newCredits = user.credits - actualCreditsUsed
    await supabase.from('users').update({ credits: newCredits }).eq('id', userId)

    // Generatie opslaan
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
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}