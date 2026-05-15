import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

// Vercel timeout: zo lang mogelijk voor generation
export const maxDuration = 60

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

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (!styleIds || styleIds.length === 0) {
      return NextResponse.json({ error: 'No styles selected' }, { status: 400 })
    }

    console.log(`🚀 Starting generation for user: ${userId}`)
    console.log(`🎨 Styles: ${styleIds.length}, Aspect: ${aspectRatio}`)

    // Haal user data op (kenmerken nodig voor dynamische negative prompts)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check credits
    const creditsNeeded = styleIds.length
    if (user.credits < creditsNeeded) {
      return NextResponse.json({
        error: `Not enough credits. Need ${creditsNeeded}, have ${user.credits}`,
      }, { status: 400 })
    }

    // Check getraind model
    if (!user.trained_model_id) {
      return NextResponse.json({ error: 'No trained model found' }, { status: 400 })
    }

    // Trigger word ophalen
    const triggerWord = user.trigger_word || 'HEADSHOT'

    console.log(`✅ User has ${user.credits} credits, needs ${creditsNeeded}`)
    console.log(`🧠 Using model: ${user.trained_model_id}`)
    console.log(`🔑 Using trigger word: ${triggerWord}`)

    // ===========================================
    // DYNAMISCHE NEGATIVE PROMPT
    // ===========================================
    // Basis negative prompt (uit handoff doc - bewezen kwaliteit)
    let negativePrompt = 'different person, wrong face, deformed, distorted, bad anatomy, extra limbs, blurry, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, uncanny valley, CGI, 3d render, illustration, cartoon'

    // Voeg dynamische blocks toe op basis van user kenmerken
    if (user.gender === 'male') {
      negativePrompt += ', female, woman, feminine features, makeup, lipstick, long eyelashes'
    } else if (user.gender === 'female') {
      negativePrompt += ', male, man, masculine features, beard, mustache, stubble'
    }

    if (user.is_bald) {
      negativePrompt += ', hair on head, full head of hair, long hair, thick hair, hairstyle'
    }

    if (user.has_glasses === false) {
      negativePrompt += ', glasses, eyeglasses, spectacles, sunglasses'
    }

    console.log(`🛡️ Negative prompt: ${negativePrompt.substring(0, 100)}...`)

    // ===========================================
    // STYLE PROMPTS - 65 stijlen
    // [TRIGGER] wordt vervangen door user's unique trigger word
    // ===========================================

    const stylePrompts: Record<string, string> = {

      // ===== FORMAL / CORPORATE (13 styles) =====
      'corporate-classic': '[TRIGGER], professional corporate headshot, navy blue suit, white dress shirt, gray studio background, studio lighting, sharp focus, professional photography',
      'executive-navy': '[TRIGGER], half body portrait, arms crossed confidently, navy blue suit with tie, city skyline background, professional lighting, executive look',
      'ceo-black': '[TRIGGER], elegant headshot portrait, black suit, white shirt, white studio background, high contrast, studio lighting, powerful presence',
      'boardroom-gray': '[TRIGGER], half body portrait, arms crossed, charcoal gray suit, modern office background with windows, natural lighting, confident pose',
      'power-suit': '[TRIGGER], half body portrait, dark navy suit, library background with bookshelves, warm lighting, intellectual look, professional',
      'light-blue-exec': '[TRIGGER], half body portrait, holding tablet professionally, light blue blazer, white shirt, modern office with large windows, bright natural light',
      'pinstripe-pro': '[TRIGGER], professional headshot, pinstripe suit, neutral gray background, studio lighting, sharp professional look',
      'three-piece': '[TRIGGER], half body portrait, arms crossed, three piece suit with vest, dark studio background, dramatic lighting, distinguished look',
      'wall-street': '[TRIGGER], professional portrait, dark suit, red tie, financial district background blurred, confident expression, power pose',
      'corner-office': '[TRIGGER], medium shot, sitting at executive desk, dark suit, modern corner office, city view through windows, natural light',
      'conference-ready': '[TRIGGER], half body portrait, navy blazer, standing confidently, conference room background, professional lighting',
      'investor-meeting': '[TRIGGER], professional headshot, charcoal suit, white shirt, clean white background, trustworthy expression, studio lighting',
      'formal-black': '[TRIGGER], professional headshot portrait, black formal suit, white shirt, dark studio background, studio lighting, sharp focus, elegant',

      // ===== SMART CASUAL (12 styles) =====
      'teal-blazer': '[TRIGGER], half body portrait, arms crossed, teal green blazer, white t-shirt underneath, white studio background, modern professional',
      'beige-elegance': '[TRIGGER], half body portrait, hand visible showing watch, beige linen suit, black studio background, elegant lighting, sophisticated',
      'gray-blazer-blue': '[TRIGGER], half body portrait, arms crossed confidently, gray blazer, light blue background, soft studio lighting, approachable professional',
      'open-collar-navy': '[TRIGGER], close up headshot, navy blazer, open collar white shirt, gray background, relaxed professional, friendly expression',
      'blazer-white-tee': '[TRIGGER], medium shot portrait, black blazer over white t-shirt, city evening background with lights, modern style, confident',
      'v-neck-sweater': '[TRIGGER], headshot portrait, blue v-neck sweater over collared shirt, white background, smart casual, approachable',
      'office-casual-plants': '[TRIGGER], medium shot, sitting at modern desk, light blue oxford shirt, office with plants background, natural daylight, relaxed professional',
      'weekend-blazer': '[TRIGGER], half body portrait, unstructured tan blazer, dark t-shirt, outdoor cafe background blurred, natural light, relaxed confidence',
      'creative-director': '[TRIGGER], half body portrait, black blazer, black turtleneck, minimalist white background, artistic lighting, creative professional',
      'startup-ceo': '[TRIGGER], medium shot, navy blazer, no tie, open collar, modern coworking space background, energetic, approachable leader',
      'tech-lead': '[TRIGGER], headshot portrait, gray sport coat, crew neck underneath, clean background, intelligent expression, tech professional',
      'consultant-look': '[TRIGGER], half body portrait, light gray suit, no tie, arms relaxed at sides, modern office, confident consultant',

      // ===== CASUAL PROFESSIONAL (10 styles) =====
      'white-tee-orange': '[TRIGGER], half body portrait, clean white t-shirt, vibrant orange studio background, creative professional, fresh modern look',
      'black-tee-urban': '[TRIGGER], medium shot portrait, black t-shirt, urban street background, natural lighting, confident casual style',
      'navy-polo-clean': '[TRIGGER], headshot portrait, navy blue polo shirt, clean white background, professional yet approachable, friendly smile',
      'gray-tee-crossed': '[TRIGGER], half body portrait, arms crossed, gray t-shirt, light blue studio background, casual confidence, relaxed pose',
      'white-tee-nature': '[TRIGGER], half body portrait, arms crossed, white t-shirt, blurred green nature background, outdoor natural light, fresh look',
      'plaid-casual': '[TRIGGER], headshot portrait, casual plaid button-up shirt, gray studio background, relaxed professional, weekend style',
      'henley-relaxed': '[TRIGGER], medium shot, henley shirt, natural window lighting, home office background, comfortable professional',
      'denim-shirt': '[TRIGGER], headshot portrait, chambray denim shirt, white background, casual friday look, friendly expression',
      'knit-sweater': '[TRIGGER], half body portrait, chunky knit sweater, cozy background, warm lighting, approachable personality',
      'linen-summer': '[TRIGGER], half body portrait, white linen shirt, bright outdoor background, summer vibes, natural light, relaxed',

      // ===== CREATIVE / EDGY (8 styles) =====
      'leather-jacket-city': '[TRIGGER], medium shot portrait, black leather jacket, white t-shirt, city evening background with bokeh lights, edgy professional',
      'night-life': '[TRIGGER], medium shot portrait, black outfit, leather jacket, city nightlife background with lights, confident urban style',
      'turtleneck-modern': '[TRIGGER], close up portrait, gray turtleneck sweater, white curtain background, soft natural light, minimalist modern',
      'black-turtleneck-drama': '[TRIGGER], headshot portrait, black turtleneck, dark studio background, dramatic side lighting, artistic mood',
      'tech-founder': '[TRIGGER], half body portrait, dark gray t-shirt, arms crossed, modern tech office background, confident innovator look',
      'all-black-minimal': '[TRIGGER], half body portrait, all black outfit, black shirt, black background, dramatic lighting, mysterious professional',
      'creative-colorful': '[TRIGGER], headshot portrait, colorful patterned shirt, bright background, creative industry professional, artistic',
      'rebel-professional': '[TRIGGER], medium shot, dark blazer, band t-shirt underneath, industrial background, creative rebel style',

      // ===== OUTDOOR / NATURAL (8 styles) =====
      'park-portrait': '[TRIGGER], half body portrait, casual smart outfit, green park background blurred, natural daylight, relaxed confident',
      'rooftop-view': '[TRIGGER], medium shot portrait, leaning on railing, smart casual outfit, city panorama background, golden hour light',
      'golden-hour': '[TRIGGER], headshot portrait, white shirt, outdoor golden hour lighting, warm tones, natural background, glowing',
      'nature-fresh': '[TRIGGER], half body portrait, light colored clothing, trees and nature background blurred, fresh natural light, outdoor',
      'city-walk': '[TRIGGER], medium shot, walking pose, casual jacket, city street background, urban lifestyle, natural movement',
      'coffee-shop': '[TRIGGER], medium shot, sitting relaxed, casual smart outfit, coffee shop interior background, warm ambient light',
      'beach-professional': '[TRIGGER], half body portrait, linen shirt, coastal background blurred, bright natural light, relaxed vacation style',
      'architectural': '[TRIGGER], half body portrait, modern outfit, striking architecture background, clean lines, design professional',

      // ===== SPECIALTY POSES (8 styles) =====
      'arms-crossed-power': '[TRIGGER], half body portrait, arms crossed powerfully, dark suit, neutral background, authoritative pose, confident leader',
      'holding-tablet': '[TRIGGER], half body portrait, holding tablet device, business casual attire, modern office, tech-savvy professional',
      'sitting-confident': '[TRIGGER], medium shot, sitting in chair confidently, legs crossed, blazer, office setting, executive presence',
      'leaning-casual': '[TRIGGER], medium shot, leaning against wall casually, smart casual outfit, modern interior, approachable confidence',
      'hands-in-pockets': '[TRIGGER], half body portrait, hands in pockets relaxed, blazer and jeans, urban background, casual confidence',
      'thoughtful-pose': '[TRIGGER], headshot portrait, hand near chin thoughtfully, professional attire, soft background, intellectual look',
      'profile-angle': '[TRIGGER], three quarter profile portrait, looking away slightly, professional outfit, studio lighting, artistic angle',
      'looking-up': '[TRIGGER], headshot portrait from slightly below, looking up confidently, professional attire, bright background, aspirational',

      // ===== COLORED BACKGROUNDS (6 styles) =====
      'blue-studio': '[TRIGGER], professional headshot, business attire, solid blue studio background, clean studio lighting, corporate look',
      'green-studio': '[TRIGGER], half body portrait, smart casual outfit, solid green studio background, fresh professional look',
      'purple-creative': '[TRIGGER], headshot portrait, dark outfit, purple studio background, creative industry, artistic lighting',
      'yellow-energetic': '[TRIGGER], half body portrait, casual outfit, bright yellow background, energetic personality, vibrant',
      'red-bold': '[TRIGGER], headshot portrait, dark professional outfit, red studio background, bold statement, confident',
      'gradient-modern': '[TRIGGER], professional headshot, modern outfit, gradient blue to purple background, contemporary style',
    }

    const generatedImages: string[] = []

    // Loop door alle gekozen stijlen
    for (const styleId of styleIds) {
      // Haal prompt template op, gebruik fallback als styleId niet gevonden
      const promptTemplate = stylePrompts[styleId] || '[TRIGGER], professional headshot portrait, studio lighting, clean background, sharp focus'

      // Vervang [TRIGGER] door user's unique trigger word
      const fullPrompt = promptTemplate.replace(/\[TRIGGER\]/g, triggerWord)

      console.log(`🎨 Generating style: ${styleId}`)
      console.log(`📝 Prompt: ${fullPrompt.substring(0, 80)}...`)

      try {
        // Roep Replicate aan met user's getrainde model
        // trained_model_id bevat al de volledige path: "owner/name:version"
        const output = await replicate.run(
          user.trained_model_id as `${string}/${string}:${string}`,
          {
            input: {
              prompt: fullPrompt,
              negative_prompt: negativePrompt,
              model: 'dev',
              lora_scale: 1,
              num_outputs: 1,
              aspect_ratio: aspectRatio || '3:4',
              output_format: 'webp',
              guidance_scale: 3.5,
              output_quality: 90,
              num_inference_steps: 28,
              disable_safety_checker: false,
            },
          }
        )

        // Process output - kan een array zijn of single URL
        if (Array.isArray(output)) {
          for (let i = 0; i < output.length; i++) {
            const imageUrl = output[i]

            try {
              // Download de afbeelding van Replicate
              const response = await fetch(imageUrl as string)
              const arrayBuffer = await response.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)

              // Upload naar Supabase Storage voor permanente URL
              const filename = `generated/${userId}/${Date.now()}-${styleId}-${i}.webp`

              const { error: uploadError } = await supabase.storage
                .from('headshots')
                .upload(filename, buffer, {
                  contentType: 'image/webp',
                  cacheControl: '31536000',
                  upsert: true,
                })

              if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                  .from('headshots')
                  .getPublicUrl(filename)

                generatedImages.push(publicUrlData.publicUrl)
                console.log(`✅ Saved image ${generatedImages.length}: ${styleId}`)
              } else {
                console.error('Upload error:', uploadError)
                // Fallback: gebruik direct de Replicate URL
                generatedImages.push(imageUrl as string)
              }
            } catch (downloadError) {
              console.error('Download error:', downloadError)
              generatedImages.push(imageUrl as string)
            }
          }
        }
      } catch (genError) {
        console.error(`❌ Error generating style ${styleId}:`, genError)
        // Continue met volgende stijl - niet alles failen door één fout
      }
    }

    console.log(`🎉 Generated ${generatedImages.length} images total`)

    // Credits aftrekken (alleen voor succesvol gegenereerde stijlen)
    const actualCreditsUsed = Math.min(generatedImages.length, creditsNeeded)
    const newCredits = user.credits - actualCreditsUsed

    const { error: creditError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId)

    if (creditError) {
      console.error('Failed to deduct credits:', creditError)
    } else {
      console.log(`💳 Deducted ${actualCreditsUsed} credits. New balance: ${newCredits}`)
    }

    // Generatie opslaan in database
    const { data: generation, error: genRecordError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        result_urls: generatedImages,
        styles_used: styleIds,
        credits_used: actualCreditsUsed,
        status: 'completed',
      })
      .select()
      .single()

    if (genRecordError) {
      console.error('Failed to save generation record:', genRecordError)
    }

    // Transactie loggen
    await supabase
      .from('credits_transactions')
      .insert({
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
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    return NextResponse.json(
      {
        error: 'Generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}