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

// Lost een training_id/ref op naar "owner/name:version". Cachet het resultaat:
// naar de models-rij als modelRowId is meegegeven, anders naar users (backward-compat).
async function resolveModelReference(userId: string, trainedModelId: string, modelRowId?: string): Promise<string> {
  const persist = async (ref: string) => {
    if (modelRowId) await supabase.from('models').update({ training_id: ref }).eq('id', modelRowId)
    else await supabase.from('users').update({ trained_model_id: ref }).eq('id', userId)
  }
  if (trainedModelId.includes('/') && trainedModelId.includes(':')) return trainedModelId
  if (trainedModelId.includes(':') && !trainedModelId.includes('/')) {
    const fullRef = `${REPLICATE_USERNAME}/${trainedModelId}`
    await persist(fullRef)
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
  await persist(fullRef)
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
  'leather-jacket-urban': '[TRIGGER], cowboy shot, three-quarter length portrait, waist-up framing, black leather jacket, white t-shirt, the full leather jacket clearly visible, city street background, natural evening light, edgy professional',
  'all-black-minimal':   '[TRIGGER], portrait, all black outfit, black shirt or turtleneck, dark neutral background, soft side light, minimal dramatic',
  'bold-colored-blazer': '[TRIGGER], three-quarter length shot showing head to thighs, the entire blazer visible from shoulders down to the waist, arms visible at the sides, bold colored blazer (deep red or emerald green), white t-shirt underneath, bright creative studio with a bold colored backdrop, natural light, confident statement',
  'motorcycle-street':   '[TRIGGER], three-quarter length editorial shot from head to hips, leaning and half-sitting casually against a classic motorcycle on an urban street, hip resting against the bike with one forearm on the fuel tank, the motorcycle prominently visible at his side in the frame, open brown leather jacket over a white t-shirt, light blue jeans, relaxed confident pose looking off to the side, natural daylight, cool editorial vibe',
  'classic-car':         '[TRIGGER], full-length editorial shot from head to knees, leaning casually against a sleek classic vintage car on a city street, the classic car clearly and prominently filling much of the frame beside him, smart casual jacket over a white t-shirt, relaxed confident pose, natural daylight, cool editorial vibe',
  'restaurant-elegant':  '[TRIGGER], medium-wide shot showing head to waist, a crisp smart casual button-down shirt in white or a warm soft tone such as sand, soft pink or sage, not blue, sitting at a dining table in an elegant restaurant, on the table in the foreground a plate of beautifully plated gourmet food and a single glass of red wine clearly visible, warm candlelit fine-dining ambiance, softly blurred restaurant background with shallow depth of field',
  'wine-bar-relaxed':    '[TRIGGER], medium-wide shot showing head to waist, a smart shirt or fine knit sweater in a warm flattering color such as burgundy, navy, olive or warm neutral, sitting at a cozy wine bar, a single large glass of red wine standing on the table prominently in the foreground, fully visible and not cropped, nobody touching the glass, rows of wine bottles on wooden shelves softly blurred behind, warm intimate lighting, shallow depth of field',
  'coffee-shop-date':    '[TRIGGER], medium-wide shot showing head to waist, wearing a casual t-shirt or a relaxed fine knit (not a button-down shirt) in a warm earthy color such as sage green, warm oatmeal, terracotta or soft grey, sitting at a table in a modern coffee shop, holding a warm cup of coffee, the coffee is either a black espresso or a cappuccino with latte art, cozy cafe with an espresso machine softly blurred behind, warm casual daytime lighting, shallow depth of field',
  'rooftop-bar-evening': '[TRIGGER], medium shot showing the head, upper body and the table in front, wearing a relaxed-fit light-colored linen summer shirt in a bright warm tone such as light blue, sand, white or terracotta, no jacket, bright light summer clothing, natural everyday build, sitting at a table on a rooftop bar terrace in the evening, a cocktail in a rocks glass standing on the table clearly visible in the lower foreground, city skyline and string lights softly blurred behind, warm summer dusk sky, warm evening ambiance, shallow depth of field',
  'w-power-blazer-navy':   '[TRIGGER], professional woman portrait, navy blue tailored blazer, white silk blouse, bright modern office, arms crossed confidently, soft natural light, executive look',
  'w-executive-charcoal':  '[TRIGGER], half body portrait of professional woman, charcoal gray tailored suit, light silk blouse, standing by large floor-to-ceiling office windows with a clear city view behind, modern high-rise office, natural professional lighting, confident executive',
  'w-ceo-black':           '[TRIGGER], full-length three-quarter shot of woman from head to the knees, standing confidently with hands relaxed or in pockets, black tailored blazer, crisp white blouse, isolated against a seamless plain dramatic dark charcoal photographic studio backdrop with subtle warm texture, no furniture and no room visible, moody cinematic side lighting, powerful executive presence',
  'w-pinstripe-pro':       '[TRIGGER], full-length three-quarter shot of woman from head to the knees, standing confidently with hands relaxed or in pockets, the full pinstripe suit clearly visible from shoulders to hips, pinstripe blazer, silk blouse, neutral gray background, soft natural light, sharp sophisticated look',
  'w-sheath-classic':      '[TRIGGER], three-quarter length shot of woman showing head to thighs, the fitted black sheath dress fully visible, fitted black sheath dress, isolated against a clean seamless light grey studio backdrop, soft even studio lighting, refined executive editorial style',
  'w-pussybow-elegant':    '[TRIGGER], three-quarter length shot of woman showing head to thighs, wearing a cream silk pussy-bow blouse with a soft bow tied at the neck clearly visible, tweed jacket, isolated against a clean seamless light grey studio backdrop, soft even studio lighting, classic elegant style',
  'w-cream-blazer-arms':   '[TRIGGER], three-quarter length shot of woman showing head to thighs, the full cream beige blazer visible, cream beige blazer, white t-shirt underneath, arms crossed, soft blurred modern professional office, upscale interior, soft warm natural light, modern professional',
  'w-turtleneck-blazer':   '[TRIGGER], three-quarter length shot of woman showing head to thighs, the full gray tailored blazer visible, black turtleneck under gray tailored blazer, smooth mid-grey editorial studio backdrop, dramatic directional lighting, modern sophisticated',
  'w-silk-blouse-modern':  '[TRIGGER], medium-wide shot of woman showing head to waist, navy silk blouse, bright modern office, soft window light, contemporary professional elegant',
  'w-cardigan-soft':       '[TRIGGER], medium-wide shot of woman showing head to waist, soft beige cardigan over a blouse, soft blurred modern professional office, upscale interior, soft warm natural light, approachable smart casual professional',
  'w-knit-twinset':        '[TRIGGER], medium-wide shot of woman showing head to waist, matching knit top and cardigan in neutral tones, warm ambient light, cozy neutral background, refined smart casual',
  'w-startup-casual':      '[TRIGGER], medium shot portrait of woman, light blue button-down shirt, no blazer, modern coworking space background, natural light, energetic approachable professional',
  'w-red-power-suit':      '[TRIGGER], three-quarter length shot of woman showing head to thighs, the entire blazer visible from shoulders to waist, bold red blazer, white t-shirt underneath, modern creative office background, natural light, confident power pose, statement professional',
  'w-emerald-blazer':      '[TRIGGER], three-quarter length shot of woman showing head to thighs, the entire blazer visible, emerald green blazer, black top underneath, bright creative studio with a colored backdrop, soft side natural light, bold creative professional',
  'w-mustard-creative':    '[TRIGGER], medium-wide shot of woman showing head to waist, mustard yellow silk blouse, bright creative studio with a warm colored backdrop, natural lighting, artistic professional',
  'w-statement-coral':     '[TRIGGER], three-quarter length shot of woman showing head to thighs, the entire blazer visible, coral pink tailored blazer, white top underneath, modern creative office background, vibrant natural lighting, bold confident creative professional',
  'w-jewel-purple':        '[TRIGGER], medium-wide shot of woman showing head to waist, deep purple silk top, bright creative studio with a jewel-tone backdrop, soft natural light, jewel-tone creative professional, expressive',
  'w-white-tee-natural':   '[TRIGGER], medium-wide shot of woman showing head to waist, clean white t-shirt, blurred green nature background, outdoor natural daylight, fresh approachable, genuine smile',
  'w-cream-sweater-window': '[TRIGGER], medium-wide shot of woman showing head to waist, soft cream knit sweater, soft warm neutral background softly blurred, warm natural light, relaxed approachable',
  'w-denim-shirt-fresh':   '[TRIGGER], medium-wide shot of woman showing head to waist, light chambray denim shirt, clean white background, natural daylight, casual approachable professional, friendly',
  'w-coffee-shop-warm':    '[TRIGGER], medium-wide shot of woman showing head to waist, casual smart sweater, in a modern coffee shop, espresso machine, coffee cups and a cafe counter visible behind, warm casual daytime lighting, relaxed approachable',
  'w-park-outdoor':        '[TRIGGER], half body portrait of woman, light casual blouse, blurred green park background, soft natural daylight, fresh outdoor relaxed',
  'w-rooftop-golden':      '[TRIGGER], medium shot of woman, smart casual blouse, rooftop setting, city panorama background, warm golden hour lighting, lifestyle professional',
  'w-architectural':       '[TRIGGER], half body portrait of woman, modern fitted top, modern architecture background, clean lines, natural light, contemporary',
  'w-city-walk':           '[TRIGGER], medium shot of woman walking, casual jacket and smart top, urban city street background, natural daylight, dynamic lifestyle',
  'w-beach-professional':  '[TRIGGER], medium shot of woman, crisp white linen blouse, wearing stylish sunglasses, relaxed at a tropical beach with palm trees and turquoise ocean in the background, bright sunny natural daylight, warm relaxed vacation vibe',
  'w-mountain-snow':       '[TRIGGER], portrait of woman, warm stylish winter jacket and scarf, standing in snowy mountains with snow-capped peaks in the background, crisp bright natural daylight, adventurous relaxed vibe',
  'w-poolside-resort':     '[TRIGGER], portrait of woman, elegant relaxed summer outfit, at a luxury resort infinity pool with palm trees, bright sunny natural daylight, aspirational vacation vibe',
  'w-autumn-forest':       '[TRIGGER], portrait of woman, cozy casual sweater, in an autumn forest with golden and orange foliage, soft warm natural daylight, relaxed nature vibe',
  'w-mountain-lake':       '[TRIGGER], portrait of woman, casual outdoor jacket, standing by a serene mountain lake with scenic peaks in the background, soft natural daylight, adventurous relaxed vibe',
  'w-equestrian':          '[TRIGGER], portrait of woman, elegant equestrian outfit, standing beside a horse in the countryside, soft natural daylight, graceful confident adventurous vibe',
  'w-restaurant-elegant':  '[TRIGGER], medium-wide shot of woman showing head to waist, smart casual silk blouse in white, blush or a warm tone, not blue, sitting at a dining table in an elegant restaurant, on the table in the foreground a plate of beautifully plated gourmet food and a single glass of red wine clearly visible, warm candlelit fine-dining ambiance, softly blurred restaurant background with shallow depth of field',
  'w-wine-bar-casual':     '[TRIGGER], medium-wide shot of woman showing head to waist, stylish casual top in a warm flattering color such as burgundy, rust or warm neutral, sitting at a cozy wine bar, a single large glass of red wine standing on the table prominently in the foreground, fully visible and not cropped, nobody touching the glass, rows of wine bottles on wooden shelves softly blurred behind, warm intimate lighting, shallow depth of field',
  'w-cocktail-glamour':    '[TRIGGER], medium-wide shot of woman showing head to waist, elegant cocktail dress, sitting at an upscale cocktail bar, on the bar in the foreground an elegant cocktail glass clearly visible, bottles and bar softly blurred behind, ambient evening mood lighting, shallow depth of field',
  'w-cafe-date':           '[TRIGGER], medium-wide shot of woman showing head to waist, casual sweater in a soft flattering color such as cream, blush or sage, sitting at a table in a charming cafe, holding a warm cup of coffee, the coffee is either a black espresso or a cappuccino with latte art, cozy cafe softly blurred behind, warm casual lighting, relaxed approachable, shallow depth of field',
  'w-rooftop-bar':         '[TRIGGER], medium-wide shot of woman showing head to waist, stylish summer evening outfit in a bright or pastel color, at a table on a rooftop bar terrace in the evening, on the table in the foreground a cocktail glass clearly visible, city skyline and string lights softly blurred behind, warm summer dusk sky, warm evening ambiance, shallow depth of field',
  'w-restaurant-evening':  '[TRIGGER], medium-wide shot of woman showing head to waist, sophisticated evening top, sitting at a candlelit table in an intimate restaurant, on the table in the foreground a plate of beautifully plated food and a single glass of red wine clearly visible, warm romantic ambiance, softly blurred restaurant background with shallow depth of field',
  'w-bistro-warm':         '[TRIGGER], medium-wide shot of woman showing head to waist, smart casual chic outfit in a warm flattering color, sitting at a table in a charming french bistro, on the table in the foreground a glass of wine and a small dish clearly visible, bistro interior with a chalkboard menu softly blurred behind, warm cozy lighting, shallow depth of field',
  'w-leather-jacket-edge': '[TRIGGER], three-quarter length portrait of woman, cowboy shot framing, the full leather jacket clearly visible, black leather jacket, dark top underneath, city street background, natural evening light, edgy sophisticated',
  'w-evening-rooftop':     '[TRIGGER], half body portrait of woman, elegant black evening top, rooftop background with city lights, warm evening lighting, glamorous nighttime',
  'w-night-city-glamour':  '[TRIGGER], medium-wide shot of woman showing head to waist, stylish dark outfit, on a city street at night, bright city lights and neon signs bokeh behind, urban nighttime glamour',

  // ===== SPECIALTY POSES (man) =====
  'arms-crossed-power':  '[TRIGGER], half body portrait, arms crossed powerfully, dark tailored suit, deep blue-grey gunmetal studio backdrop, dramatic directional side lighting, authoritative confident pose',
  'sitting-confident':   '[TRIGGER], seated at a wooden desk, leaning slightly forward with both hands fully visible and clasped together on the desk in front of him, tailored blazer over a turtleneck or shirt, modern office with large floor-to-ceiling windows and a city view, soft natural light, warm confident engaging presence',
  'leaning-elegant':     '[TRIGGER], leaning sideways with one shoulder against a clean modern building exterior wall outdoors, body relaxed and tilted at an angle resting his weight on the wall, one hand in pocket, relaxed casual outfit such as a fine knit sweater or an open casual shirt, no blazer and no tie, soft natural daylight, approachable relaxed confidence',
  'leaning-office':      '[TRIGGER], leaning sideways with one shoulder against a wall in a modern corporate office, body relaxed and tilted at an angle resting his weight on the wall, one hand in pocket, tailored business blazer, softly blurred professional open-plan office behind him with glass-walled meeting rooms, desks and office chairs and a city view through large windows, soft natural light, confident professional presence',
  'hands-in-pockets':    '[TRIGGER], three-quarter length shot from head to thighs, standing relaxed with both hands clearly tucked into his trouser pockets, the hands in pockets clearly visible, blazer, urban background, soft natural light, casual confidence',
  'thoughtful-pose':     '[TRIGGER], three-quarter length shot, standing relaxed with one hand resting gently on the chin while looking away to the side in contemplation, natural thinking pose, professional attire, soft neutral background, soft natural light, intellectual reflective look, not a tight close-up',
  'holding-tablet':      '[TRIGGER], three-quarter length shot from head to thighs, holding a tablet device with both hands in front of him, the tablet clearly and fully visible in frame, business casual attire, modern office, soft natural light, tech-savvy professional',

  // ===== SPECIALTY POSES (vrouw) =====
  'w-arms-crossed-power': '[TRIGGER], half body portrait of professional woman, arms crossed confidently, tailored blazer, deep blue-grey gunmetal studio backdrop, dramatic directional side lighting, authoritative elegant pose',
  'w-sitting-confident':  '[TRIGGER], portrait of professional woman seated at a wooden desk, leaning slightly forward with both hands fully visible and clasped together on the desk in front of her, tailored blazer, modern office with large floor-to-ceiling windows and a city view, soft natural light, warm confident engaging presence',
  'w-leaning-elegant':    '[TRIGGER], portrait of woman leaning sideways with one shoulder against a clean modern building exterior wall outdoors, body relaxed and tilted at an angle resting her weight on the wall, one hand in pocket, relaxed casual outfit such as a fine knit top or an open casual blouse, no blazer, soft natural daylight, approachable relaxed confidence',
  'w-leaning-office':     '[TRIGGER], portrait of woman leaning sideways with one shoulder against a wall in a modern corporate office, body relaxed and tilted at an angle resting her weight on the wall, one hand in pocket, tailored business blazer, softly blurred professional open-plan office behind her with glass-walled meeting rooms, desks and office chairs and a city view through large windows, soft natural light, confident professional presence',
  'w-hands-relaxed':      '[TRIGGER], three-quarter length shot from head to thighs of woman, standing relaxed with both hands clearly tucked into her trouser pockets, the hands in pockets clearly visible, blazer, urban background, soft natural light, casual confidence',
  'w-thoughtful-pose':    '[TRIGGER], three-quarter length shot of woman, standing relaxed with one hand resting gently on the chin while looking away to the side in contemplation, natural thinking pose, professional attire, soft neutral background, soft natural light, intelligent elegant reflective look, not a tight close-up',
  'w-holding-tablet':     '[TRIGGER], three-quarter length shot from head to thighs of woman, holding a tablet device with both hands in front of her, the tablet clearly and fully visible in frame, business casual attire, modern office, soft natural light, tech-savvy professional',
}

export async function POST(request: NextRequest) {
  try {
    const { userId, styleIds, aspectRatio, modelId } = await request.json()

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

    // Kies het model: expliciet modelId (multi-model) of het 'actieve' model op users (backward-compat).
    let modelTrainingRef: string
    let triggerWord: string
    // Bron van de kenmerken (geslacht, kaal, bril, baard): per-model indien opgeslagen, anders het account.
    let charSource: Record<string, unknown> = user
    if (modelId) {
      const { data: model } = await supabase
        .from('models').select('*').eq('id', modelId).eq('user_id', userId).single()
      if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 })
      if (model.status !== 'completed') return NextResponse.json({ error: 'Dit model is nog niet klaar' }, { status: 400 })
      if (!model.training_id) return NextResponse.json({ error: 'Model has no training reference' }, { status: 400 })
      modelTrainingRef = await resolveModelReference(userId, model.training_id, model.id)
      triggerWord = model.trigger_word || 'HEADSHOT'
      // Per-model kenmerken indien aanwezig (kolommen kunnen ontbreken -> val terug op account).
      if (model.gender != null) charSource = model
    } else {
      if (!user.trained_model_id) return NextResponse.json({ error: 'No trained model found' }, { status: 400 })
      modelTrainingRef = await resolveModelReference(userId, user.trained_model_id)
      triggerWord = user.trigger_word || 'HEADSHOT'
    }
    const modelReference = modelTrainingRef
    const versionId = modelReference.split(':')[1]
    if (!versionId) return NextResponse.json({ error: 'Invalid model reference' }, { status: 500 })

    const characteristics: UserCharacteristics = {
      gender: charSource.gender as string, ethnicity: charSource.ethnicity as string, eye_color: charSource.eye_color as string,
      hair_color: charSource.hair_color as string, is_bald: charSource.is_bald as boolean, has_glasses: charSource.has_glasses as boolean,
      has_beard: charSource.has_beard as boolean, age_range: charSource.age_range as string,
    }

    const personDescription = buildPersonDescription(characteristics)
    const negativeAdditions = buildNegativePromptAdditions(characteristics)

    const baseNegativePrompt = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, low quality, disfigured, altered body proportions, unnatural body shape, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed, oversmoothed, unrealistic skin texture, perfect flawless skin, porcelain skin, skin retouching, heavy skin smoothing, shiny skin, oily skin, greasy skin, sweaty skin, glossy skin, shiny forehead, shiny bald head, shiny scalp, specular highlights on skin, skin glare, overexposed skin, blown-out highlights on face, waxy skin, uncanny valley, CGI, 3d render, illustration, cartoon, oversaturated, HDR, oversharpened, instagram filter, heavy vignette, studio strobe lighting, artificial lighting, cropped head, partial face, head cut off, extreme close-up, tightly cropped, face filling the frame, macro face shot, face partially out of frame, only neck visible, sharp background, busy background, cluttered background, everything in focus, deep focus, cheap clothing, ill-fitting clothing, wrinkled suit, amateur snapshot, low budget, blurry face, out of focus face, soft focus on face, blurry eyes, soft blurry features, plain empty wall, boring flat background, bare wall background, dull background, amateur smartphone photo, selfie, snapshot, flat dull lighting, harsh lighting, people in background, bystanders in background, crowd in background, random clutter, messy objects, bedroom, bed, pillows, hotel room, kitchen, kitchen appliances, oven, refrigerator, bathroom, sink, toilet, living room, home interior, residential home, tattoos, arm tattoos, tattooed arms, tattooed skin"
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
      // Pose-stijlen die iets meer lichaam tonen (head-to-knees) om de houding te laten zien,
      // zonder full-body (dat de gezichtsgelijkenis zou schaden).
      const THREE_QUARTER_STYLES = new Set(['leaning-elegant', 'w-leaning-elegant', 'leaning-office', 'w-leaning-office', 'hands-in-pockets', 'w-hands-relaxed', 'holding-tablet', 'w-holding-tablet'])
      const bodyHint = THREE_QUARTER_STYLES.has(styleId)
        ? ', three-quarter length shot from head to the knees, showing the full pose and stance including the hips'
        : isPortrait ? ', three-quarter length composition, waist-up shot, the torso and waist visible in frame' : ''

      // Expressie per stijl-groep: formeel/dramatisch = serieus/zelfverzekerd;
      // casual/lifestyle/date = warme oprechte glimlach; overige = subtiel vriendelijk.
      const SERIOUS_STYLES = new Set(['corporate-classic','executive-navy','ceo-black','boardroom-charcoal','pinstripe-pro','three-piece','formal-black-drama','wall-street-power','all-black-minimal','creative-director','leather-jacket-urban','arms-crossed-power','w-power-blazer-navy','w-executive-charcoal','w-ceo-black','w-pinstripe-pro','w-sheath-classic','w-leather-jacket-edge','w-evening-rooftop','w-night-city-glamour','w-arms-crossed-power'])
      const SMILE_STYLES = new Set(['white-tee-clean','black-tee-clean','navy-polo','henley-relaxed','plaid-friendly','white-button-down','light-blue-oxford','denim-shirt-fresh','golden-hour','park-natural','rooftop-city','city-walk','beach-professional','mountain-snow','poolside-resort','autumn-forest','mountain-lake','knit-cozy','sitting-confident','leaning-elegant','leaning-office','restaurant-elegant','wine-bar-relaxed','coffee-shop-date','rooftop-bar-evening','w-white-tee-natural','w-denim-shirt-fresh','w-coffee-shop-warm','w-park-outdoor','w-rooftop-golden','w-city-walk','w-beach-professional','w-mountain-snow','w-poolside-resort','w-autumn-forest','w-mountain-lake','w-equestrian','w-startup-casual','w-cardigan-soft','w-sitting-confident','w-leaning-elegant','w-leaning-office','w-cafe-date','w-bistro-warm','w-restaurant-elegant','w-restaurant-evening','w-wine-bar-casual','w-rooftop-bar','w-cocktail-glamour'])
      const expression = SMILE_STYLES.has(styleId)
        ? ', warm genuine smile, friendly approachable expression'
        : SERIOUS_STYLES.has(styleId)
        ? ', confident composed expression, serious and not smiling'
        : ', pleasant confident expression, subtle friendly look'

      // Rustige, strakke stijlen krijgen een kalme, sterk wazige achtergrond i.p.v. een
      // zichtbaar 'environmental' decor (dat maakt de achtergrond juist druk).
      const CLEAN_BG_STYLES = new Set(['leaning-elegant', 'w-leaning-elegant'])
      const backgroundClause = CLEAN_BG_STYLES.has(styleId)
        ? ', photographed outdoors on location against a clean modern architectural building facade with columns and clean geometric lines, real upscale urban setting with natural depth and perspective receding behind him, softly blurred background, soft natural daylight, authentic editorial photograph, the subject sharp and in focus'
        : ', the location and setting clearly visible and recognizable behind the subject, softly blurred background with natural depth, environmental portrait showing the surroundings'
      // Date-night / dining: handen rustig houden om AI-handglitches te vermijden.
      const ONE_DRINK_STYLES = new Set([
        'restaurant-elegant', 'wine-bar-relaxed', 'rooftop-bar-evening',
        'w-restaurant-elegant', 'w-restaurant-evening', 'w-wine-bar-casual',
        'w-bistro-warm', 'w-rooftop-bar', 'w-cocktail-glamour',
      ])
      const diningHands = ONE_DRINK_STYLES.has(styleId)
        ? ', both hands resting calmly and relaxed on the table, not holding the glass, not holding any cutlery or utensils, not eating, the drink standing on the table'
        : ''
      // Subtiel vrouwelijk accent: fijne juwelen (oorbellen/ketting = veilig bij het gezicht).
      const jewelryHint = isWoman
        ? (styleId === 'w-pussybow-elegant'
            ? ', small elegant earrings, understated and elegant'   // strik is het hals-accent, geen ketting
            : ', wearing subtle tasteful jewelry, small elegant earrings and a fine delicate necklace, optionally a slim bracelet or watch, understated and elegant')
        : ''
      const fullPrompt = `${template.replace(/\[TRIGGER\]/g, triggerWithDescription)}${expression}${bodyHint}${diningHands}${jewelryHint}, not a tight close-up, sharp focus on face, sharp detailed eyes, matte natural skin with realistic texture and subtle pores, non-shiny complexion, soft even flattering light on the face${backgroundClause}, soft warm cinematic lighting, rich cinematic color grading, impeccably tailored well-fitted premium clothing, magazine-quality professional portrait, high-end editorial photography, 4k`
      const webhookUrl = `${baseUrl}/api/generation-webhook?generationId=${generationId}&styleId=${encodeURIComponent(styleId)}&userId=${userId}`

      // Stijl-specifieke negatieven: forceer bv. de leun-pose in elke variatie.
      const LEANING_STYLES = new Set(['leaning-elegant', 'w-leaning-elegant', 'leaning-office', 'w-leaning-office'])
      const effectiveNegative = fullNegativePrompt
      let styleNegative = ''
      if (LEANING_STYLES.has(styleId)) {
        styleNegative += ', sitting, seated, sitting down, standing upright straight, rigid upright posture, standing away from the wall, body not touching the wall, square to camera facing forward, not leaning'
      }
      if (CLEAN_BG_STYLES.has(styleId)) {
        // Outdoor architecturaal: dwing buiten af, weer interieur en straatdrukte.
        styleNegative += ', indoor room, interior, curtains, furniture, busy street, crowd, people in background, parked cars, traffic, cluttered messy background'
      }
      const OFFICE_STYLES = new Set(['leaning-office', 'w-leaning-office'])
      if (OFFICE_STYLES.has(styleId)) {
        // Dwing een echt kantoor af, weer huiselijke settings.
        styleNegative += ', home, apartment, living room, dining table, dining room, kitchen, residential interior, balcony, bedroom'
      }
      if (ONE_DRINK_STYLES.has(styleId)) {
        // Slechts één drankje + geen bestek-in-hand (minder AI-handglitches).
        styleNegative += ', two wine glasses, multiple wine glasses, several glasses, pair of glasses, extra glass, many glasses on the table, deformed hands, malformed hands, holding a wine glass, hand gripping the glass, fist wrapped around the glass, hand around the glass bowl, holding cutlery, fork in hand, knife in hand, hands touching food, extra fingers, distorted fingers'
      }
      // Alle date-night stijlen: dwing af dat er altijd een drankje zichtbaar is.
      const DRINK_STYLES = new Set([...ONE_DRINK_STYLES, 'coffee-shop-date', 'w-cafe-date', 'rooftop-bar-evening'])
      if (DRINK_STYLES.has(styleId)) {
        styleNegative += ', empty table, no drink, no glass, no cup, table without a drink, missing drink'
      }
      const LIGHT_OUTFIT_STYLES = new Set(['rooftop-bar-evening', 'w-rooftop-bar'])
      if (LIGHT_OUTFIT_STYLES.has(styleId)) {
        // Zomeravond: dwing lichte/kleurige kleding af, weer donker/zwart + overdreven spiermassa.
        styleNegative += ', black shirt, all-black outfit, dark clothing, black clothing, dark leather jacket, dark jacket, overly muscular, bodybuilder physique, bulging muscles, tight fitted shirt, muscular arms'
      }
      // Casual date-settings: geen zwart (klant kleedt zich nooit in het zwart hiervoor).
      const NO_BLACK_STYLES = new Set([
        'restaurant-elegant', 'wine-bar-relaxed', 'coffee-shop-date',
        'w-restaurant-elegant', 'w-wine-bar-casual', 'w-cafe-date', 'w-bistro-warm',
      ])
      if (NO_BLACK_STYLES.has(styleId)) {
        styleNegative += ', black shirt, all-black outfit, black clothing, dressed all in black'
      }
      // Restaurant: geen blauw hemd (differentiatie t.o.v. de andere date-night kaarten).
      const NO_BLUE_STYLES = new Set(['restaurant-elegant', 'w-restaurant-elegant'])
      if (NO_BLUE_STYLES.has(styleId)) {
        styleNegative += ', blue shirt, light blue shirt, blue clothing, blue top'
      }
      // Coffee shop: casual t-shirt/knit i.p.v. een net hemd.
      const TSHIRT_STYLES = new Set(['coffee-shop-date'])
      if (TSHIRT_STYLES.has(styleId)) {
        styleNegative += ', button-down shirt, dress shirt, formal collared shirt'
      }
      // Kleding-is-kenmerk stijlen: weer close-up/borst-crop zodat vaker het hele kledingstuk in beeld komt.
      const MORE_BODY_STYLES = new Set([
        'boardroom-charcoal', 'bold-colored-blazer', 'leather-jacket-urban', 'hands-in-pockets', 'holding-tablet',
        'w-pinstripe-pro', 'w-sheath-classic', 'w-pussybow-elegant', 'w-cream-blazer-arms', 'w-turtleneck-blazer',
        'w-red-power-suit', 'w-emerald-blazer', 'w-statement-coral', 'w-leather-jacket-edge', 'w-hands-relaxed', 'w-holding-tablet',
        'w-ceo-black',
      ])
      if (MORE_BODY_STYLES.has(styleId)) {
        styleNegative += ', close-up, tight crop, cropped at the chest, only head and shoulders, headshot framing, face filling the frame'
      }
      // Vrouwen (behalve date-night, waar wazige gasten sfeer geven): geen vreemden op de achtergrond.
      if (isWoman && !ONE_DRINK_STYLES.has(styleId)) {
        styleNegative += ', other people, another person, background figures, people walking by, second person, strangers in the background'
      }
      // Dramatische donkere studio-stijlen: dwing de donkere backdrop af, weer kamer/raam.
      const DARK_BG_STYLES = new Set(['w-ceo-black'])
      if (DARK_BG_STYLES.has(styleId)) {
        styleNegative += ', bright background, window, visible room, room interior, furniture, chair, lamp, table, curtains, plant, hallway, mirror, floor visible'
      }
      // Schone lichte studio-stijlen: seamless backdrop afdwingen, weer kamer/kantoor.
      const CLEAN_STUDIO_STYLES = new Set(['w-sheath-classic', 'w-pussybow-elegant'])
      if (CLEAN_STUDIO_STYLES.has(styleId)) {
        styleNegative += ', office, desk, glass walls, room interior, home interior, hallway, furniture, chair, lamp, table, curtains, plant, visible room, window, floor visible'
      }
      // Pussybow: dwing de strik af, weer open kraag/ketting die ermee concurreren.
      if (styleId === 'w-pussybow-elegant') {
        styleNegative += ', necklace, open collar without a bow, plain collar, no bow at the neck'
      }

      const input = {
        prompt: fullPrompt,
        negative_prompt: `${effectiveNegative}${styleNegative}`,
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