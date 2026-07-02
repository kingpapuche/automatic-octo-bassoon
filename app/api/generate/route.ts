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
const VARIATIONS_PER_STYLE = 4

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
  if (c.has_glasses === false) negatives.push('glasses','eyeglasses','spectacles')
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
  'corporate-classic':   '[TRIGGER], professional portrait, navy blue suit, white dress shirt, modern office background with windows, natural light, sharp focus, confident look',
  'executive-navy':      '[TRIGGER], half body portrait, arms crossed, navy blue suit with tie, standing by large floor-to-ceiling windows with a clear city skyline visible behind, modern high-rise office, soft natural light, confident pose',
  'ceo-black':           '[TRIGGER], portrait, sharp tailored black suit, crisp white dress shirt, dramatic dark charcoal background, moody cinematic side lighting, powerful executive presence',
  'boardroom-charcoal':  '[TRIGGER], three-quarter length shot showing head to thighs, the full tailored light gray suit visible, white dress shirt, dark patterned tie, hands in pockets, standing in a spacious high-end office interior with large windows and soft natural light, confident executive',
  'pinstripe-pro':       '[TRIGGER], professional portrait, pinstripe suit with tie, neutral background, soft natural light, sharp professional look',
  'three-piece':         '[TRIGGER], half body portrait, arms crossed, three piece suit with vest, office background, window light, distinguished look',
  'formal-black-drama':  '[TRIGGER], portrait, black formal suit, crisp white shirt, elegant refined dark interior, moody atmospheric low-key side lighting, sophisticated editorial look',
  'wall-street-power':   '[TRIGGER], professional portrait, dark suit, red tie, standing outdoors in a downtown financial district surrounded by towering glass skyscrapers and high-rise corporate towers, dramatic tall skyscraper skyline directly behind, natural daylight, confident expression',
  'navy-blazer-open':    '[TRIGGER], close up portrait, navy blazer, open collar white shirt, soft blurred modern professional office, upscale interior, soft warm natural light, friendly expression',
  'gray-blazer-blue':    '[TRIGGER], half body portrait, arms crossed, gray blazer, bright modern office, soft window light, approachable professional',
  'beige-elegance':      '[TRIGGER], half body portrait, beige linen suit, dark background, warm ambient light, sophisticated',
  'teal-blazer':         '[TRIGGER], half body portrait, arms crossed, teal blazer, white t-shirt, clean bright modern studio backdrop, soft natural light, modern professional',
  'light-blue-blazer':   '[TRIGGER], half body portrait, light blue blazer, white shirt, modern office with large windows, bright natural light',
  'creative-director':   '[TRIGGER], half body portrait, black blazer, black turtleneck, smooth mid-grey editorial studio backdrop, dramatic directional lighting, sophisticated creative director look',
  'consultant-look':     '[TRIGGER], half body portrait, light gray suit, no tie, arms relaxed, modern office, soft natural light, confident',
  'tech-turtleneck':     '[TRIGGER], close up portrait, gray turtleneck sweater, clean seamless studio backdrop, smooth plain neutral background, soft studio lighting, intelligent gaze',
  'gray-sweater-pro':    '[TRIGGER], portrait, gray crew neck sweater over collared shirt, bright modern office, clean and uncluttered, soft window light, smart casual',
  'knit-cozy':           '[TRIGGER], half body portrait, chunky knit sweater, warm ambient light, cozy neutral background, approachable',
  'v-neck-smart':        '[TRIGGER], portrait, blue v-neck sweater over collared shirt, clean seamless light grey studio backdrop, smooth plain background, soft studio lighting, smart casual',
  'white-button-down':   '[TRIGGER], portrait, clean white button-down shirt, soft neutral background, natural window light, approachable professional',
  'light-blue-oxford':   '[TRIGGER], half body portrait, light blue oxford button-down shirt, open collar, soft neutral background, natural window light, classic smart casual',
  'navy-polo':           '[TRIGGER], portrait, navy blue polo shirt, clean light background, soft natural light, friendly expression',
  'denim-shirt-fresh':   '[TRIGGER], portrait, chambray denim shirt, white background, soft natural light, casual friendly look',
  'plaid-friendly':      '[TRIGGER], portrait, plaid button-up shirt, neutral background, soft natural light, relaxed approachable',
  'white-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain white t-shirt, soft neutral light gray background, natural window light, candid feel, relaxed expression',
  'black-tee-clean':     '[TRIGGER], close up portrait, well-fitting plain black t-shirt, soft neutral medium gray background, natural light, candid feel, confident relaxed',
  'henley-relaxed':      '[TRIGGER], portrait, fitted henley shirt with button opening, textured fabric, warm natural window light, comfortable relaxed natural feel',
  'golden-hour':         '[TRIGGER], portrait, casual smart shirt, golden hour outdoor lighting, warm natural tones, lifestyle photography',
  'park-natural':        '[TRIGGER], medium shot, outdoor park setting, casual smart outfit or plain t-shirt, dappled sunlight, blurred green background, relaxed natural pose',
  'rooftop-city':        '[TRIGGER], medium shot, rooftop setting, city skyline background, smart casual outfit, natural daylight',
  'city-walk':           '[TRIGGER], medium shot, walking pose, casual jacket, city street background, urban lifestyle, natural movement',
  'beach-professional':  '[TRIGGER], medium shot, crisp white linen shirt, wearing stylish sunglasses, relaxed at a tropical beach with palm trees and turquoise ocean in the background, bright sunny natural daylight, warm relaxed vacation vibe',
  'mountain-snow':       '[TRIGGER], medium shot, warm winter jacket and scarf, standing in snowy mountains with snow-capped peaks in the background, crisp bright natural daylight, adventurous relaxed vibe',
  'poolside-resort':     '[TRIGGER], medium shot, relaxed casual open shirt or polo, at a luxury resort infinity pool with palm trees, bright sunny natural daylight, aspirational vacation vibe',
  'autumn-forest':       '[TRIGGER], medium shot, casual sweater or jacket, in an autumn forest with golden and orange foliage, soft warm natural daylight, relaxed nature vibe',
  'mountain-lake':       '[TRIGGER], medium shot, casual outdoor jacket, standing by a serene mountain lake with scenic peaks in the background, soft natural daylight, adventurous relaxed vibe',
  'leather-jacket-urban': '[TRIGGER], medium shot, black leather jacket, white t-shirt, city street background, natural evening light, edgy professional',
  'all-black-minimal':   '[TRIGGER], portrait, all black outfit, black shirt or turtleneck, dark neutral background, soft side light, minimal dramatic',
  'bold-colored-blazer': '[TRIGGER], half body portrait, bold colored blazer (deep red or emerald green), white t-shirt underneath, bright creative studio with a bold colored backdrop, natural light, confident statement',
  'motorcycle-street':   '[TRIGGER], medium shot, brown leather jacket over a white t-shirt, leaning against a classic motorcycle on an urban street, natural daylight, cool confident relaxed vibe',
  'classic-car':         '[TRIGGER], medium shot, smart casual jacket, leaning against a sleek classic premium car on a city street, natural daylight, confident stylish vibe',
  'restaurant-elegant':  '[TRIGGER], medium-wide shot showing head to waist, smart casual button-down, sitting at a table in an elegant restaurant, set dining tables with plates and wine glasses visible behind, warm candlelit fine-dining ambiance',
  'wine-bar-relaxed':    '[TRIGGER], medium-wide shot showing head to waist, dark sweater or shirt, sitting at a cozy wine bar, rows of wine bottles on wooden shelves and a bar counter clearly visible behind, warm intimate lighting',
  'coffee-shop-date':    '[TRIGGER], medium-wide shot showing head to waist, casual smart sweater or shirt, in a modern coffee shop, espresso machine, coffee cups and a cafe counter visible behind, warm casual daytime lighting',
  'rooftop-bar-evening': '[TRIGGER], medium-wide shot showing head to waist, stylish jacket or dark shirt, on a rooftop bar terrace in the evening, city skyline and glass railing behind, string lights, dusk sky',
  'w-power-blazer-navy':   '[TRIGGER], professional woman portrait, navy blue tailored blazer, white silk blouse, bright modern office, arms crossed confidently, soft natural light, executive look',
  'w-executive-charcoal':  '[TRIGGER], half body portrait of professional woman, charcoal gray tailored suit, light silk blouse, modern office background, natural professional lighting, confident executive',
  'w-ceo-black':           '[TRIGGER], elegant portrait of businesswoman, black tailored blazer, crisp white blouse, dramatic dark charcoal background, moody cinematic side lighting, powerful executive presence',
  'w-pinstripe-pro':       '[TRIGGER], professional portrait of businesswoman, pinstripe blazer, silk blouse, neutral gray background, soft natural light, sharp sophisticated look',
  'w-sheath-classic':      '[TRIGGER], elegant portrait of businesswoman, fitted black sheath dress, minimal jewelry, light neutral background, soft natural lighting, refined executive style',
  'w-pussybow-elegant':    '[TRIGGER], professional portrait of woman, cream silk blouse with pussy bow detail, tweed jacket, neutral background, soft natural light, classic elegant style',
  'w-cream-blazer-arms':   '[TRIGGER], half body portrait of professional woman, cream beige blazer, white t-shirt underneath, arms crossed, soft neutral background, natural lighting, modern professional',
  'w-turtleneck-blazer':   '[TRIGGER], portrait of professional woman, black turtleneck under gray tailored blazer, minimalist neutral background, soft natural light, modern sophisticated',
  'w-silk-blouse-modern':  '[TRIGGER], half body portrait of woman, navy silk blouse, modern office background, natural window lighting, contemporary professional elegant',
  'w-cardigan-soft':       '[TRIGGER], portrait of woman, soft beige cardigan over white tee, warm natural window light, cozy professional, approachable smart casual',
  'w-knit-twinset':        '[TRIGGER], professional portrait of woman, matching knit top and cardigan in neutral tones, soft neutral background, warm natural light, refined smart casual',
  'w-startup-casual':      '[TRIGGER], medium shot portrait of woman, light blue button-down shirt, no blazer, modern coworking space background, natural light, energetic approachable professional',
  'w-red-power-suit':      '[TRIGGER], half body portrait of woman, bold red blazer, white t-shirt underneath, modern creative office background, natural light, confident power pose, statement professional',
  'w-emerald-blazer':      '[TRIGGER], professional portrait of woman, emerald green blazer, black top underneath, bright creative studio with a colored backdrop, soft side natural light, bold creative professional',
  'w-mustard-creative':    '[TRIGGER], half body portrait of woman, mustard yellow silk blouse, bright creative studio with a warm colored backdrop, natural lighting, artistic professional',
  'w-statement-coral':     '[TRIGGER], portrait of woman, coral pink tailored blazer, modern creative office background, vibrant natural lighting, bold confident creative professional',
  'w-jewel-purple':        '[TRIGGER], portrait of woman, deep purple silk top, bright creative studio with a jewel-tone backdrop, soft natural light, jewel-tone creative professional, expressive',
  'w-white-tee-natural':   '[TRIGGER], half body portrait of woman, clean white t-shirt, blurred green nature background, outdoor natural daylight, fresh approachable, genuine smile',
  'w-cream-sweater-window': '[TRIGGER], portrait of woman, soft cream knit sweater, warm window light, blurred home interior background, relaxed approachable',
  'w-denim-shirt-fresh':   '[TRIGGER], professional portrait of woman, light chambray denim shirt, white background, natural daylight, casual approachable professional, friendly',
  'w-coffee-shop-warm':    '[TRIGGER], medium-wide shot of woman showing head to waist, casual smart sweater, in a modern coffee shop, espresso machine, coffee cups and a cafe counter visible behind, warm casual daytime lighting, relaxed approachable',
  'w-park-outdoor':        '[TRIGGER], half body portrait of woman, light casual blouse, blurred green park background, soft natural daylight, fresh outdoor relaxed',
  'w-rooftop-golden':      '[TRIGGER], medium shot of woman, smart casual blouse, rooftop setting, city panorama background, warm golden hour lighting, lifestyle professional',
  'w-architectural':       '[TRIGGER], half body portrait of woman, modern fitted top, modern architecture background, clean lines, natural light, contemporary',
  'w-city-walk':           '[TRIGGER], medium shot of woman walking, casual jacket and smart top, urban city street background, natural daylight, dynamic lifestyle',
  'w-beach-professional':  '[TRIGGER], half body portrait of woman, white linen blouse, coastal beach background blurred, bright natural light, relaxed vacation professional',
  'w-restaurant-elegant':  '[TRIGGER], medium-wide shot of woman showing head to waist, smart casual silk blouse, sitting at a table in an elegant restaurant, set dining tables with plates and wine glasses visible behind, warm candlelit fine-dining ambiance',
  'w-wine-bar-casual':     '[TRIGGER], medium-wide shot of woman showing head to waist, stylish casual top, sitting at a cozy wine bar, rows of wine bottles on wooden shelves and a bar counter clearly visible behind, warm intimate lighting',
  'w-cocktail-glamour':    '[TRIGGER], medium-wide shot of woman showing head to waist, elegant cocktail dress, at an upscale cocktail bar, cocktail glasses and bottles on the bar visible behind, ambient evening mood lighting',
  'w-cafe-date':           '[TRIGGER], medium-wide shot of woman showing head to waist, casual sweater, in a charming cafe, espresso machine, coffee cups and pastries on the counter visible behind, warm casual lighting, relaxed approachable',
  'w-rooftop-bar':         '[TRIGGER], medium-wide shot of woman showing head to waist, stylish evening top, on a rooftop bar terrace in the evening, city skyline and glass railing behind, string lights, dusk sky',
  'w-restaurant-evening':  '[TRIGGER], medium-wide shot of woman showing head to waist, sophisticated evening top, sitting at a candlelit table in an intimate restaurant, set dining tables with plates and glassware visible behind, warm romantic ambiance',
  'w-bistro-warm':         '[TRIGGER], medium-wide shot of woman showing head to waist, smart casual chic outfit, in a charming french bistro, bistro tables and chairs and a chalkboard menu visible behind, warm cozy lighting',
  'w-leather-jacket-edge': '[TRIGGER], medium shot of woman, black leather jacket, dark top underneath, urban evening background, natural evening light, edgy sophisticated',
  'w-evening-rooftop':     '[TRIGGER], half body portrait of woman, elegant black evening top, rooftop background with city lights, warm evening lighting, glamorous nighttime',
  'w-night-city-glamour':  '[TRIGGER], medium-wide shot of woman showing head to waist, stylish dark outfit, on a city street at night, bright city lights and neon signs bokeh behind, urban nighttime glamour',

  // ===== SPECIALTY POSES (man) =====
  'arms-crossed-power':  '[TRIGGER], half body portrait, arms crossed powerfully, dark suit, neutral background, soft natural light, authoritative confident pose',
  'sitting-confident':   '[TRIGGER], medium shot, sitting in chair confidently, legs crossed, blazer, modern office setting, soft natural light, executive presence',
  'leaning-elegant':     '[TRIGGER], medium shot, leaning against wall casually, smart casual outfit, modern interior, soft natural light, approachable confidence',
  'hands-in-pockets':    '[TRIGGER], half body portrait, hands in pockets relaxed, blazer, urban background, soft natural light, casual confidence',
  'thoughtful-pose':     '[TRIGGER], portrait, hand near chin thoughtfully, professional attire, soft neutral background, soft natural light, intellectual look',
  'holding-tablet':      '[TRIGGER], half body portrait, holding tablet device, business casual attire, modern office, soft natural light, tech-savvy professional',

  // ===== SPECIALTY POSES (vrouw) =====
  'w-arms-crossed-power': '[TRIGGER], half body portrait of professional woman, arms crossed confidently, tailored blazer, neutral background, soft natural light, authoritative elegant pose',
  'w-sitting-confident':  '[TRIGGER], medium shot of professional woman, sitting in chair confidently, tailored blazer, modern office setting, soft natural light, executive presence',
  'w-leaning-elegant':    '[TRIGGER], medium shot of woman, leaning against wall casually, smart casual outfit, modern interior, soft natural light, approachable elegant confidence',
  'w-hands-relaxed':      '[TRIGGER], half body portrait of woman, relaxed hand pose, blazer, urban background, soft natural light, casual confidence',
  'w-thoughtful-pose':    '[TRIGGER], portrait of woman, hand near chin thoughtfully, professional attire, soft neutral background, soft natural light, intelligent elegant look',
  'w-holding-tablet':     '[TRIGGER], half body portrait of woman, holding tablet device, business casual attire, modern office, soft natural light, tech-savvy professional',
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

    const baseNegativePrompt = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, porcelain skin, skin retouching, heavy skin smoothing, uncanny valley, CGI, 3d render, illustration, cartoon, oversaturated, HDR, oversharpened, instagram filter, heavy vignette, studio strobe lighting, artificial lighting, cropped head, partial face, head cut off, extreme close-up, tightly cropped, face filling the frame, macro face shot, face partially out of frame, only neck visible, sharp background, busy background, cluttered background, everything in focus, deep focus, cheap clothing, ill-fitting clothing, wrinkled suit, amateur snapshot, low budget, blurry face, out of focus face, soft focus on face, blurry eyes, soft blurry features, plain empty wall, boring flat background, bare wall background, dull background, amateur smartphone photo, selfie, snapshot, flat dull lighting, harsh lighting, people in background, bystanders in background, crowd in background, random clutter, messy objects, bedroom, bed, pillows, hotel room, kitchen, kitchen appliances, oven, refrigerator, tattoos, arm tattoos, tattooed arms, tattooed skin"
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
      const promptTemplate = STYLE_PROMPTS[styleId] || '[TRIGGER], professional portrait, natural lighting, sharp focus'

      // Kadrering hangt af van het GEKOZEN formaat (research: shot-type expliciet +
      // VOORAAN weegt het zwaarst):
      //  - 3:4 Portrait (LinkedIn/CV/dating): ruimer -> meer lichaam. Strakke
      //    openings-framing ("portrait"/"headshot"/"close up") -> "medium shot".
      //  - 1:1 Square (profielpic) & 4:3 Landscape (web): gezicht prominent houden,
      //    dus de oorspronkelijke (strakkere) kadrering laten staan.
      // Stijlen die al ruimer zijn (half body / medium shot / three-quarter) blijven
      // sowieso ongemoeid -> natuurlijke variatie blijft.
      const isPortrait = !aspectRatio || aspectRatio === '3:4'
      const isWoman = /of woman|of businesswoman|woman portrait|of professional woman/i.test(promptTemplate)
      // Erkende cinematografische shot-termen (research: die begrijpt het model;
      // 'upper body' is te vaag). Prominent vooraan + verderop herhaald.
      const mediumFraming = isWoman
        ? 'cowboy shot of a woman, three-quarter length portrait, waist-up framing'
        : 'cowboy shot, three-quarter length portrait, waist-up framing'
      const template = isPortrait
        ? promptTemplate.replace(
            /^(\[TRIGGER\], )(professional portrait of businesswoman|professional portrait of woman|professional woman portrait|portrait of professional woman|elegant portrait of businesswoman|elegant portrait of woman|portrait of woman|close up portrait|professional headshot|professional portrait|portrait)\b/,
            `$1${mediumFraming}`
          )
        : promptTemplate
      const bodyHint = isPortrait ? ', three-quarter length composition, waist-up shot, the torso and waist visible in frame' : ''

      // Expressie per stijl-groep: formeel/dramatisch = serieus/zelfverzekerd;
      // casual/lifestyle/date = warme oprechte glimlach; overige = subtiel vriendelijk.
      const SERIOUS_STYLES = new Set(['corporate-classic','executive-navy','ceo-black','boardroom-charcoal','pinstripe-pro','three-piece','formal-black-drama','wall-street-power','all-black-minimal','creative-director','leather-jacket-urban','arms-crossed-power','w-power-blazer-navy','w-executive-charcoal','w-ceo-black','w-pinstripe-pro','w-sheath-classic','w-leather-jacket-edge','w-evening-rooftop','w-night-city-glamour','w-arms-crossed-power'])
      const SMILE_STYLES = new Set(['white-tee-clean','black-tee-clean','navy-polo','henley-relaxed','plaid-friendly','white-button-down','light-blue-oxford','denim-shirt-fresh','golden-hour','park-natural','rooftop-city','city-walk','beach-professional','mountain-snow','poolside-resort','autumn-forest','mountain-lake','knit-cozy','restaurant-elegant','wine-bar-relaxed','coffee-shop-date','rooftop-bar-evening','w-white-tee-natural','w-denim-shirt-fresh','w-coffee-shop-warm','w-park-outdoor','w-rooftop-golden','w-city-walk','w-beach-professional','w-startup-casual','w-cardigan-soft','w-cafe-date','w-bistro-warm','w-restaurant-elegant','w-restaurant-evening','w-wine-bar-casual','w-rooftop-bar','w-cocktail-glamour'])
      const expression = SMILE_STYLES.has(styleId)
        ? ', warm genuine smile, friendly approachable expression'
        : SERIOUS_STYLES.has(styleId)
        ? ', confident composed expression, serious and not smiling'
        : ', pleasant confident expression, subtle friendly look'

      const fullPrompt = `${template.replace(/\[TRIGGER\]/g, triggerWithDescription)}${expression}${bodyHint}, not a tight close-up, sharp focus on face, sharp detailed eyes, the location and setting clearly visible and recognizable behind the subject, softly blurred background with natural depth, environmental portrait showing the surroundings, soft warm cinematic lighting, rich cinematic color grading, impeccably tailored well-fitted premium clothing, magazine-quality professional portrait, high-end editorial photography, 4k`
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