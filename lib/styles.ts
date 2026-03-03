// ===========================================
// BESTAIHEADSHOT - STYLE LIBRARY
// 50+ Professional Headshot Styles
// Inspired by AISelfie.es
// ===========================================

export type Gender = 'male' | 'female' | 'unisex'
export type StyleCategory = 'formal' | 'smart-casual' | 'casual' | 'creative' | 'outdoor' | 'studio'
export type StyleBadge = 'Popular' | 'New' | 'Premium' | undefined

export interface Style {
  id: string
  name: string
  description: string
  category: StyleCategory
  gender: Gender
  badge?: StyleBadge
  prompt: string  // Uses [TRIGGER] placeholder
}

// ===========================================
// STYLE CATEGORIES
// ===========================================
export const STYLE_CATEGORIES: { id: StyleCategory; name: string; icon: string }[] = [
  { id: 'formal', name: 'Formal', icon: '👔' },
  { id: 'smart-casual', name: 'Smart Casual', icon: '🧥' },
  { id: 'casual', name: 'Casual', icon: '👕' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
  { id: 'studio', name: 'Studio', icon: '📸' },
]

// ===========================================
// MALE STYLES (25+)
// ===========================================
const MALE_STYLES: Style[] = [
  // FORMAL
  {
    id: 'm-corporate-navy',
    name: 'Corporate Navy',
    description: 'Classic navy suit, white shirt',
    category: 'formal',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], professional corporate headshot, man wearing navy blue suit, white dress shirt, gray studio background, studio lighting, sharp focus, professional photography'
  },
  {
    id: 'm-executive-black',
    name: 'Executive Black',
    description: 'Black suit, powerful presence',
    category: 'formal',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], elegant executive headshot portrait, man wearing black suit, white shirt, white studio background, high contrast, studio lighting, powerful presence'
  },
  {
    id: 'm-boardroom-gray',
    name: 'Boardroom Gray',
    description: 'Charcoal suit, modern office',
    category: 'formal',
    gender: 'male',
    prompt: '[TRIGGER], half body portrait, man with arms crossed, charcoal gray suit, modern office background with windows, natural lighting, confident pose'
  },
  {
    id: 'm-pinstripe-pro',
    name: 'Pinstripe Professional',
    description: 'Classic pinstripe suit',
    category: 'formal',
    gender: 'male',
    badge: 'Premium',
    prompt: '[TRIGGER], professional headshot, man wearing pinstripe suit, neutral gray background, studio lighting, sharp professional look'
  },
  {
    id: 'm-three-piece',
    name: 'Three Piece Suit',
    description: 'Distinguished three piece',
    category: 'formal',
    gender: 'male',
    badge: 'Premium',
    prompt: '[TRIGGER], half body portrait, man with arms crossed, three piece suit with vest, dark studio background, dramatic lighting, distinguished look'
  },
  {
    id: 'm-light-blue-suit',
    name: 'Light Blue Suit',
    description: 'Modern light blue suit',
    category: 'formal',
    gender: 'male',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, man wearing light blue suit, white shirt, modern office with large windows, bright natural light, fresh professional'
  },

  // SMART CASUAL
  {
    id: 'm-blazer-tshirt',
    name: 'Blazer & T-Shirt',
    description: 'Navy blazer over white tee',
    category: 'smart-casual',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], medium shot portrait, man wearing navy blazer over white t-shirt, neutral background, modern style, confident professional'
  },
  {
    id: 'm-gray-blazer',
    name: 'Gray Blazer',
    description: 'Relaxed gray blazer look',
    category: 'smart-casual',
    gender: 'male',
    prompt: '[TRIGGER], half body portrait, man with arms crossed, gray blazer, light blue background, soft studio lighting, approachable professional'
  },
  {
    id: 'm-open-collar',
    name: 'Open Collar',
    description: 'Navy blazer, no tie',
    category: 'smart-casual',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], close up headshot, man wearing navy blazer, open collar white shirt, gray background, relaxed professional, friendly expression'
  },
  {
    id: 'm-turtleneck-blazer',
    name: 'Turtleneck & Blazer',
    description: 'Black turtleneck, dark blazer',
    category: 'smart-casual',
    gender: 'male',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, man wearing dark blazer over black turtleneck, minimalist white background, artistic lighting, creative professional'
  },
  {
    id: 'm-sweater-shirt',
    name: 'V-Neck Sweater',
    description: 'Blue sweater over collared shirt',
    category: 'smart-casual',
    gender: 'male',
    prompt: '[TRIGGER], headshot portrait, man wearing blue v-neck sweater over collared shirt, white background, smart casual, approachable'
  },
  {
    id: 'm-startup-ceo',
    name: 'Startup CEO',
    description: 'Casual blazer, coworking vibe',
    category: 'smart-casual',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], medium shot, man wearing navy blazer, no tie, open collar, modern coworking space background, energetic, approachable leader'
  },
  {
    id: 'm-tech-lead',
    name: 'Tech Lead',
    description: 'Gray sport coat, intelligent look',
    category: 'smart-casual',
    gender: 'male',
    prompt: '[TRIGGER], headshot portrait, man wearing gray sport coat, crew neck underneath, clean background, intelligent expression, tech professional'
  },

  // CASUAL
  {
    id: 'm-white-tee-orange',
    name: 'White Tee Orange BG',
    description: 'Clean white tee, vibrant orange',
    category: 'casual',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], half body portrait, man wearing clean white t-shirt, vibrant orange studio background, creative professional, fresh modern look'
  },
  {
    id: 'm-black-tee',
    name: 'Black T-Shirt',
    description: 'Simple black tee, urban style',
    category: 'casual',
    gender: 'male',
    prompt: '[TRIGGER], medium shot portrait, man wearing black t-shirt, urban street background, natural lighting, confident casual style'
  },
  {
    id: 'm-gray-tee-crossed',
    name: 'Gray Tee Arms Crossed',
    description: 'Gray tee, confident pose',
    category: 'casual',
    gender: 'male',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, man with arms crossed, gray t-shirt, light blue studio background, casual confidence, relaxed pose'
  },
  {
    id: 'm-polo-navy',
    name: 'Navy Polo',
    description: 'Classic navy polo shirt',
    category: 'casual',
    gender: 'male',
    prompt: '[TRIGGER], headshot portrait, man wearing navy blue polo shirt, clean white background, professional yet approachable, friendly smile'
  },
  {
    id: 'm-henley',
    name: 'Henley Shirt',
    description: 'Relaxed henley, natural light',
    category: 'casual',
    gender: 'male',
    prompt: '[TRIGGER], medium shot, man wearing henley shirt, natural window lighting, home office background, comfortable professional'
  },
  {
    id: 'm-denim-shirt',
    name: 'Denim Shirt',
    description: 'Casual chambray denim',
    category: 'casual',
    gender: 'male',
    prompt: '[TRIGGER], headshot portrait, man wearing chambray denim shirt, white background, casual friday look, friendly expression'
  },

  // CREATIVE
  {
    id: 'm-leather-jacket',
    name: 'Leather Jacket',
    description: 'Edgy black leather jacket',
    category: 'creative',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], medium shot portrait, man wearing black leather jacket, white t-shirt, city evening background with bokeh lights, edgy professional'
  },
  {
    id: 'm-all-black',
    name: 'All Black',
    description: 'Dramatic all black outfit',
    category: 'creative',
    gender: 'male',
    badge: 'Premium',
    prompt: '[TRIGGER], half body portrait, man wearing all black outfit, black shirt, black background, dramatic lighting, mysterious professional'
  },
  {
    id: 'm-turtleneck-black',
    name: 'Black Turtleneck',
    description: 'Minimalist black turtleneck',
    category: 'creative',
    gender: 'male',
    prompt: '[TRIGGER], headshot portrait, man wearing black turtleneck, dark studio background, dramatic side lighting, artistic mood'
  },
  {
    id: 'm-creative-colorful',
    name: 'Creative Colorful',
    description: 'Colorful shirt, artistic vibe',
    category: 'creative',
    gender: 'male',
    badge: 'New',
    prompt: '[TRIGGER], headshot portrait, man wearing colorful patterned shirt, bright background, creative industry professional, artistic'
  },

  // OUTDOOR
  {
    id: 'm-park-casual',
    name: 'Park Portrait',
    description: 'Outdoor park setting',
    category: 'outdoor',
    gender: 'male',
    prompt: '[TRIGGER], half body portrait, man wearing casual smart outfit, green park background blurred, natural daylight, relaxed confident'
  },
  {
    id: 'm-golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden hour lighting',
    category: 'outdoor',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], headshot portrait, man wearing white shirt, outdoor golden hour lighting, warm tones, natural background, glowing'
  },
  {
    id: 'm-city-walk',
    name: 'City Walk',
    description: 'Urban street lifestyle',
    category: 'outdoor',
    gender: 'male',
    prompt: '[TRIGGER], medium shot, man walking pose, casual jacket, city street background, urban lifestyle, natural movement'
  },
  {
    id: 'm-rooftop',
    name: 'Rooftop View',
    description: 'City panorama background',
    category: 'outdoor',
    gender: 'male',
    badge: 'Premium',
    prompt: '[TRIGGER], medium shot portrait, man leaning on railing, smart casual outfit, city panorama background, golden hour light'
  },

  // STUDIO
  {
    id: 'm-studio-blue',
    name: 'Blue Studio',
    description: 'Clean blue background',
    category: 'studio',
    gender: 'male',
    prompt: '[TRIGGER], professional headshot, man wearing business attire, solid blue studio background, clean studio lighting, corporate look'
  },
  {
    id: 'm-studio-gray',
    name: 'Gray Studio',
    description: 'Classic gray backdrop',
    category: 'studio',
    gender: 'male',
    badge: 'Popular',
    prompt: '[TRIGGER], professional headshot, man wearing dark suit, solid gray studio background, professional studio lighting, classic corporate'
  },
  {
    id: 'm-studio-white',
    name: 'White Studio',
    description: 'Bright white background',
    category: 'studio',
    gender: 'male',
    prompt: '[TRIGGER], professional headshot, man wearing navy suit, bright white studio background, clean high-key lighting, modern professional'
  },
  {
    id: 'm-teal-background',
    name: 'Teal Background',
    description: 'Modern teal studio',
    category: 'studio',
    gender: 'male',
    badge: 'New',
    prompt: '[TRIGGER], professional headshot, man wearing gray blazer, teal blue studio background, modern professional look, confident expression'
  },
]

// ===========================================
// FEMALE STYLES (25+)
// ===========================================
const FEMALE_STYLES: Style[] = [
  // FORMAL
  {
    id: 'f-corporate-black',
    name: 'Corporate Black',
    description: 'Elegant black blazer',
    category: 'formal',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], professional corporate headshot, woman wearing black blazer, white blouse, gray studio background, studio lighting, sharp focus, professional photography'
  },
  {
    id: 'f-executive-navy',
    name: 'Executive Navy',
    description: 'Navy suit, powerful presence',
    category: 'formal',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], elegant executive headshot portrait, woman wearing navy blue suit, white studio background, high contrast, studio lighting, powerful presence'
  },
  {
    id: 'f-boardroom-gray',
    name: 'Boardroom Gray',
    description: 'Charcoal blazer, modern office',
    category: 'formal',
    gender: 'female',
    prompt: '[TRIGGER], half body portrait, woman with arms crossed, charcoal gray blazer, modern office background with windows, natural lighting, confident pose'
  },
  {
    id: 'f-cream-blazer',
    name: 'Cream Blazer',
    description: 'Elegant cream colored blazer',
    category: 'formal',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, woman wearing cream colored blazer, dark green top underneath, neutral background, sophisticated professional'
  },
  {
    id: 'f-power-red',
    name: 'Power Red',
    description: 'Bold red blazer',
    category: 'formal',
    gender: 'female',
    badge: 'Premium',
    prompt: '[TRIGGER], half body portrait, woman wearing red blazer, white top, holding laptop, modern office, confident powerful executive'
  },
  {
    id: 'f-emerald-suit',
    name: 'Emerald Suit',
    description: 'Rich emerald green suit',
    category: 'formal',
    gender: 'female',
    badge: 'Premium',
    prompt: '[TRIGGER], professional headshot, woman wearing emerald green suit, cream blouse, studio background, elegant professional look'
  },

  // SMART CASUAL
  {
    id: 'f-blazer-tshirt',
    name: 'Blazer & T-Shirt',
    description: 'Black blazer over white tee',
    category: 'smart-casual',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], medium shot portrait, woman wearing black blazer over white t-shirt, neutral background, modern style, confident professional'
  },
  {
    id: 'f-blouse-elegant',
    name: 'Elegant Blouse',
    description: 'Silk blouse, refined look',
    category: 'smart-casual',
    gender: 'female',
    prompt: '[TRIGGER], close up headshot, woman wearing elegant silk blouse, soft gray background, refined professional, warm expression'
  },
  {
    id: 'f-turtleneck-black',
    name: 'Black Turtleneck',
    description: 'Minimalist black turtleneck',
    category: 'smart-casual',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], headshot portrait, woman wearing black turtleneck, dark studio background, dramatic side lighting, artistic professional'
  },
  {
    id: 'f-camel-coat',
    name: 'Camel Coat',
    description: 'Classic camel colored coat',
    category: 'smart-casual',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, woman wearing camel colored coat, street background blurred, natural lighting, sophisticated urban style'
  },
  {
    id: 'f-navy-sweater',
    name: 'Navy Sweater',
    description: 'Cozy navy knit sweater',
    category: 'smart-casual',
    gender: 'female',
    prompt: '[TRIGGER], headshot portrait, woman wearing navy blue knit sweater, white background, warm approachable professional'
  },
  {
    id: 'f-white-shirt-classic',
    name: 'Classic White Shirt',
    description: 'Timeless white button-up',
    category: 'smart-casual',
    gender: 'female',
    prompt: '[TRIGGER], half body portrait, woman wearing crisp white button-up shirt, arms crossed, neutral gray background, confident professional'
  },

  // CASUAL
  {
    id: 'f-white-tee-orange',
    name: 'White Tee Orange BG',
    description: 'Clean white tee, vibrant orange',
    category: 'casual',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], half body portrait, woman wearing clean white t-shirt, vibrant orange studio background, creative professional, fresh modern look'
  },
  {
    id: 'f-pink-top',
    name: 'Pink Top',
    description: 'Soft pink casual top',
    category: 'casual',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], headshot portrait, woman wearing soft pink top, light background, friendly approachable expression, natural makeup'
  },
  {
    id: 'f-denim-jacket',
    name: 'Denim Jacket',
    description: 'Casual denim jacket',
    category: 'casual',
    gender: 'female',
    prompt: '[TRIGGER], medium shot portrait, woman wearing denim jacket, white t-shirt underneath, urban background, casual cool style'
  },
  {
    id: 'f-beige-knit',
    name: 'Beige Knit',
    description: 'Cozy beige sweater',
    category: 'casual',
    gender: 'female',
    prompt: '[TRIGGER], headshot portrait, woman wearing cozy beige knit sweater, warm background, friendly smile, approachable'
  },
  {
    id: 'f-striped-shirt',
    name: 'Striped Shirt',
    description: 'Classic blue stripes',
    category: 'casual',
    gender: 'female',
    prompt: '[TRIGGER], headshot portrait, woman wearing blue and white striped shirt, clean white background, fresh professional look'
  },
  {
    id: 'f-yellow-top',
    name: 'Yellow Top',
    description: 'Bright sunny yellow',
    category: 'casual',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, woman wearing bright yellow top, neutral background, energetic positive expression, fresh style'
  },

  // CREATIVE
  {
    id: 'f-leather-jacket',
    name: 'Leather Jacket',
    description: 'Edgy black leather',
    category: 'creative',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], medium shot portrait, woman wearing black leather jacket, city evening background with bokeh lights, edgy creative professional'
  },
  {
    id: 'f-orange-blazer',
    name: 'Orange Blazer',
    description: 'Bold orange statement',
    category: 'creative',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], half body portrait, woman wearing bright orange blazer, white top, purple studio background, bold creative professional'
  },
  {
    id: 'f-purple-dress',
    name: 'Purple Dress',
    description: 'Elegant purple outfit',
    category: 'creative',
    gender: 'female',
    badge: 'Premium',
    prompt: '[TRIGGER], half body portrait, woman wearing elegant purple dress, artistic background, creative professional, sophisticated'
  },
  {
    id: 'f-green-creative',
    name: 'Green Statement',
    description: 'Bold green blazer',
    category: 'creative',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], half body portrait, woman wearing bold green blazer, pink background, creative industry professional, confident'
  },
  {
    id: 'f-all-black-artistic',
    name: 'All Black Artistic',
    description: 'Dramatic all black',
    category: 'creative',
    gender: 'female',
    badge: 'Premium',
    prompt: '[TRIGGER], half body portrait, woman wearing all black outfit, black background, dramatic lighting, mysterious artistic professional'
  },

  // OUTDOOR
  {
    id: 'f-park-casual',
    name: 'Park Portrait',
    description: 'Natural outdoor setting',
    category: 'outdoor',
    gender: 'female',
    prompt: '[TRIGGER], half body portrait, woman wearing casual smart outfit, green park background blurred, natural daylight, relaxed confident'
  },
  {
    id: 'f-golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden hour glow',
    category: 'outdoor',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], headshot portrait, woman wearing white blouse, outdoor golden hour lighting, warm tones, natural background, glowing'
  },
  {
    id: 'f-city-street',
    name: 'City Street',
    description: 'Urban street style',
    category: 'outdoor',
    gender: 'female',
    prompt: '[TRIGGER], medium shot, woman walking pose, smart casual outfit, city street background, urban lifestyle, natural movement'
  },
  {
    id: 'f-coffee-shop',
    name: 'Coffee Shop',
    description: 'Cozy cafe atmosphere',
    category: 'outdoor',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], medium shot, woman sitting relaxed, casual smart outfit, coffee shop interior background, warm ambient light'
  },

  // STUDIO
  {
    id: 'f-studio-blue',
    name: 'Blue Studio',
    description: 'Clean blue background',
    category: 'studio',
    gender: 'female',
    prompt: '[TRIGGER], professional headshot, woman wearing business attire, solid blue studio background, clean studio lighting, corporate look'
  },
  {
    id: 'f-studio-gray',
    name: 'Gray Studio',
    description: 'Classic gray backdrop',
    category: 'studio',
    gender: 'female',
    badge: 'Popular',
    prompt: '[TRIGGER], professional headshot, woman wearing dark blazer, solid gray studio background, professional studio lighting, classic corporate'
  },
  {
    id: 'f-studio-white',
    name: 'White Studio',
    description: 'Bright white background',
    category: 'studio',
    gender: 'female',
    prompt: '[TRIGGER], professional headshot, woman wearing navy blazer, bright white studio background, clean high-key lighting, modern professional'
  },
  {
    id: 'f-pink-background',
    name: 'Pink Background',
    description: 'Soft pink studio',
    category: 'studio',
    gender: 'female',
    badge: 'New',
    prompt: '[TRIGGER], professional headshot, woman wearing white top, soft pink studio background, feminine professional look, warm expression'
  },
  {
    id: 'f-teal-background',
    name: 'Teal Background',
    description: 'Modern teal studio',
    category: 'studio',
    gender: 'female',
    prompt: '[TRIGGER], professional headshot, woman wearing cream blazer, teal blue studio background, modern professional look, confident expression'
  },
]

// ===========================================
// COMBINED EXPORTS
// ===========================================

// All styles combined
export const ALL_STYLES: Style[] = [...MALE_STYLES, ...FEMALE_STYLES]

// Get styles by gender
export function getStylesByGender(gender: Gender): Style[] {
  if (gender === 'unisex') return ALL_STYLES
  return ALL_STYLES.filter(s => s.gender === gender || s.gender === 'unisex')
}

// Get styles by category
export function getStylesByCategory(category: StyleCategory): Style[] {
  return ALL_STYLES.filter(s => s.category === category)
}

// Get styles by gender AND category
export function getStylesFiltered(gender: Gender, category: StyleCategory | 'all'): Style[] {
  let styles = getStylesByGender(gender)
  if (category !== 'all') {
    styles = styles.filter(s => s.category === category)
  }
  return styles
}

// Get popular styles
export function getPopularStyles(gender: Gender): Style[] {
  return getStylesByGender(gender).filter(s => s.badge === 'Popular')
}

// Get new styles
export function getNewStyles(gender: Gender): Style[] {
  return getStylesByGender(gender).filter(s => s.badge === 'New')
}

// Get premium styles
export function getPremiumStyles(gender: Gender): Style[] {
  return getStylesByGender(gender).filter(s => s.badge === 'Premium')
}

// Legacy export for backwards compatibility
export const STYLES = ALL_STYLES