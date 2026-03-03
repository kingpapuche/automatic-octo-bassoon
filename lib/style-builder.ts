// ===========================================
// BESTAIHEADSHOT - DYNAMIC STYLE BUILDER v3
// Natural language prompts for maximum realism
// ===========================================

// ===========================================
// TYPES
// ===========================================

export interface Location {
  id: string
  name: string
  icon: string
  description: string
  prompt: string  // Natural language scene description
}

export interface ClothingStyle {
  id: string
  name: string
  icon: string
  description: string
  malePrompt: string
  femalePrompt: string
}

export interface ClothingColor {
  id: string
  name: string
  hex: string
  popular?: boolean
  prompt: string
}

export interface Framing {
  id: string
  prompt: string        // Natural language body/pose description
  expression: string    // Facial expression for this framing
  description: string   // UI label
}

export interface StyleCombo {
  locationId: string
  clothingId: string
  colorId: string
}

// ===========================================
// LOCATIONS — Natural scene descriptions
// ===========================================
export const LOCATIONS: Location[] = [
  {
    id: 'office',
    name: 'Office',
    icon: '🏢',
    description: 'Modern corporate office with glass and natural light',
    prompt: 'standing in a modern corporate office with floor-to-ceiling windows, soft natural daylight streaming in from the left, blurred office furniture in the background'
  },
  {
    id: 'studio-mix',
    name: 'Studio',
    icon: '📸',
    description: 'Professional studio with rotating backgrounds',
    prompt: 'STUDIO_MIX'
  },
  {
    id: 'home-office',
    name: 'Home Office',
    icon: '🏠',
    description: 'Warm home office with bookshelves',
    prompt: 'in a cozy home office with wooden bookshelves behind, warm lamplight casting gentle shadows, a desk partially visible'
  },
  {
    id: 'outdoor-park',
    name: 'Outdoors',
    icon: '🌳',
    description: 'Natural green outdoor setting',
    prompt: 'outdoors in a lush green park on an overcast day, soft diffused natural light, trees and foliage blurred in the background'
  },
  {
    id: 'city-urban',
    name: 'City',
    icon: '🌆',
    description: 'Urban city street or skyline',
    prompt: 'on a city sidewalk with modern architecture behind, natural afternoon light, urban environment with shallow depth of field blurring the street'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    icon: '☕',
    description: 'Cozy café with warm ambience',
    prompt: 'seated in a warm coffee shop with soft ambient lighting, wooden tables and warm tones, blurred café interior in the background'
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Upscale restaurant or dinner date',
    prompt: 'at an upscale restaurant with warm dim ambient lighting, elegant décor blurred behind, candlelight-like warm glow'
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Law library or courtroom setting',
    prompt: 'in a prestigious law library with leather-bound books on dark wood shelves behind, warm reading lamp light, scholarly atmosphere'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: '🏥',
    description: 'Hospital or clinic environment',
    prompt: 'in a clean modern medical clinic with bright even lighting, neutral medical environment behind, professional healthcare setting'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏡',
    description: 'Modern property or open house setting',
    prompt: 'inside a luxury modern home with large windows and natural light flooding in, contemporary interior design visible behind'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Classroom or campus environment',
    prompt: 'on a university campus with academic buildings softly blurred behind, warm afternoon light, collegiate atmosphere'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    icon: '🌅',
    description: 'Warm sunset golden hour lighting',
    prompt: 'outdoors during golden hour with warm sunset light illuminating the face from the side, beautiful warm orange and amber tones, natural backlit glow'
  },
]

// ===========================================
// STUDIO MIX BACKGROUNDS — Cycles through these
// ===========================================
const STUDIO_MIX_BACKGROUNDS = [
  'in a professional photo studio with a clean white seamless backdrop, soft even studio lighting from two sides',
  'in a photo studio with a neutral gray backdrop, Rembrandt lighting with key light from the left creating a gentle shadow on the right cheek',
  'in a studio with a warm cream-colored backdrop, soft butterfly lighting from above',
  'in a studio with a light blue-gray backdrop, natural-looking window light simulation from the right',
  'in a professional studio with a textured dark charcoal backdrop, dramatic side lighting with soft fill',
  'in a minimalist studio with an off-white backdrop, clamshell lighting setup for even flattering light',
  'in a studio with a subtle gradient gray backdrop, split lighting creating artistic shadow on one side',
  'in a modern studio with a warm beige backdrop, soft ring light creating catchlights in the eyes',
]

// ===========================================
// CLOTHING STYLES
// ===========================================
export const CLOTHING_STYLES: ClothingStyle[] = [
  {
    id: 'business',
    name: 'Business',
    icon: '👔',
    description: 'Tailored suits, dress shirts, and ties projecting confidence and professionalism',
    malePrompt: 'a well-fitted tailored suit jacket with a crisp dress shirt',
    femalePrompt: 'a well-fitted tailored blazer with an elegant blouse'
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    icon: '🧥',
    description: 'Blazers with t-shirts or open collars for a modern professional look',
    malePrompt: 'a blazer layered over a casual button-up shirt with the collar open, no tie',
    femalePrompt: 'a stylish blazer over a casual top, modern relaxed professional look'
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: '👕',
    description: 'Relaxed t-shirts, polos, and comfortable everyday wear',
    malePrompt: 'a well-fitting casual t-shirt with a relaxed look',
    femalePrompt: 'a comfortable casual top with a relaxed modern style'
  },
  {
    id: 'formal',
    name: 'Formal',
    icon: '🤵',
    description: 'Three-piece suits, vests, and premium formal attire',
    malePrompt: 'a premium three-piece suit with a vest and neatly knotted tie',
    femalePrompt: 'an elegant formal outfit, premium tailored look'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: '🩺',
    description: 'White coats, scrubs, and professional medical attire',
    malePrompt: 'a white medical lab coat over a dress shirt with a stethoscope around the neck',
    femalePrompt: 'a white medical lab coat over a blouse with a stethoscope around the neck'
  },
]

// ===========================================
// CLOTHING COLORS
// ===========================================
export const CLOTHING_COLORS: ClothingColor[] = [
  { id: 'charcoal-grey', name: 'Charcoal Grey', hex: '#36454F', popular: true, prompt: 'charcoal grey' },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#000080', popular: true, prompt: 'navy blue' },
  { id: 'black', name: 'Black', hex: '#1a1a1a', popular: true, prompt: 'black' },
  { id: 'brown', name: 'Brown', hex: '#6B4226', prompt: 'brown' },
  { id: 'white', name: 'White', hex: '#F5F5F5', prompt: 'white' },
  { id: 'light-grey', name: 'Light Grey', hex: '#C0C0C0', prompt: 'light grey' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', prompt: 'burgundy' },
  { id: 'beige', name: 'Beige', hex: '#D4C5A9', prompt: 'beige' },
  { id: 'light-blue', name: 'Light Blue', hex: '#6CA6CD', prompt: 'light blue' },
  { id: 'olive', name: 'Olive Green', hex: '#556B2F', prompt: 'olive green' },
  { id: 'cream', name: 'Cream', hex: '#FFFDD0', prompt: 'cream' },
  { id: 'pink', name: 'Pink', hex: '#E8A0BF', prompt: 'soft pink' },
]

// ===========================================
// FRAMINGS — Each has a unique pose + expression
// Key insight: FLUX works best with natural sentences
// ===========================================
export const FRAMINGS: Framing[] = [
  {
    id: 'three-quarter-smile',
    prompt: 'A three-quarter body photograph showing from head to upper thighs. The subject is standing with one hand casually in a pocket and weight shifted to one leg.',
    expression: 'with a warm, natural smile and relaxed eyes',
    description: 'Three-quarter, smiling'
  },
  {
    id: 'medium-confident',
    prompt: 'A medium shot from head to the hips. The subject is standing straight with both arms relaxed at their sides, facing slightly to the left.',
    expression: 'with a confident, approachable expression and a slight closed-mouth smile',
    description: 'Medium shot, confident'
  },
  {
    id: 'arms-crossed-friendly',
    prompt: 'A medium shot from head to waist. The subject has their arms crossed loosely across the chest in a relaxed way, shoulders back.',
    expression: 'with a friendly grin and relaxed eyebrows',
    description: 'Arms crossed, friendly'
  },
  {
    id: 'seated-relaxed',
    prompt: 'A seated portrait showing the full upper body and lap. The subject is sitting comfortably in a chair, leaning slightly forward with hands resting on their thighs.',
    expression: 'with a genuine warm smile showing a hint of teeth, eyes slightly crinkled',
    description: 'Seated, relaxed'
  },
  {
    id: 'standing-pockets',
    prompt: 'A three-quarter body shot from head to just above the knees. The subject has both hands in their pockets, standing in a casual but confident stance.',
    expression: 'with a natural relaxed smile, looking directly at the camera',
    description: 'Standing, hands in pockets'
  },
  {
    id: 'leaning-candid',
    prompt: 'A medium-wide shot of the subject leaning casually against a wall or desk, full torso and arms visible, body angled slightly.',
    expression: 'with a candid, thoughtful expression and a subtle smile as if mid-conversation',
    description: 'Leaning, candid'
  },
  {
    id: 'headshot-warm',
    prompt: 'A professional headshot portrait showing head, shoulders and upper chest, photographed from eye level.',
    expression: 'with a warm genuine smile and direct eye contact, approachable and trustworthy',
    description: 'Headshot, warm smile'
  },
  {
    id: 'walking-lifestyle',
    prompt: 'A three-quarter body lifestyle shot of the subject captured mid-stride walking naturally, as if photographed candidly during a photoshoot. Full torso and upper legs visible.',
    expression: 'with a natural, easy-going expression and a relaxed smile',
    description: 'Walking, lifestyle'
  },
]

// ===========================================
// PROMPT BUILDER v3 — Natural language sentences
// Key insight from research: FLUX interprets
// natural descriptions better than keyword lists
// ===========================================
export function buildPrompt(options: {
  triggerWord: string
  personDescription: string
  locationId: string
  clothingId: string
  colorId: string
  gender: 'male' | 'female'
  imageIndex: number
}): string {
  const location = LOCATIONS.find(l => l.id === options.locationId)
  const clothing = CLOTHING_STYLES.find(c => c.id === options.clothingId)
  const color = CLOTHING_COLORS.find(c => c.id === options.colorId)
  
  // Pick framing based on imageIndex
  const framing = FRAMINGS[options.imageIndex % FRAMINGS.length]
  
  // Get gender-specific clothing description
  const clothingPrompt = options.gender === 'male' 
    ? clothing?.malePrompt 
    : clothing?.femalePrompt
  
  // Handle Studio Mix: cycle through different studio backgrounds
  let locationPrompt = location?.prompt || 'in a professional setting'
  if (locationPrompt === 'STUDIO_MIX') {
    locationPrompt = STUDIO_MIX_BACKGROUNDS[options.imageIndex % STUDIO_MIX_BACKGROUNDS.length]
  }
  
  // Build a natural language prompt as one flowing description
  // Structure: "A [photo type] of [trigger] [person], [expression]. They are wearing [clothes]. [location]. [camera details]."
  const prompt = [
    // Photo type + subject identity
    `${framing.prompt.replace('The subject', options.triggerWord + (options.personDescription ? ', ' + options.personDescription : ''))}`,
    
    // Expression
    `${framing.expression}`,
    
    // Clothing as natural sentence
    `They are wearing ${color?.prompt || 'dark'} ${clothingPrompt || 'professional attire'}`,
    
    // Location as scene description
    `${locationPrompt}`,
    
    // Camera/quality as technical specs (kept minimal)
    `Photographed with a Sony A7IV and 85mm f/1.8 lens at eye level. Shallow depth of field with the background softly blurred. Natural skin texture with visible pores and subtle imperfections. Authentic candid photograph, not retouched.`,
  ].join('. ') + '.'

  return prompt
}

// ===========================================
// NEGATIVE PROMPT v3 — Stronger anti-AI terms
// ===========================================
export const BASE_NEGATIVE_PROMPT = "different person, wrong face, deformed, distorted, bad anatomy, extra limbs, blurry, low quality, disfigured, altered body proportions, bad hands, missing fingers, extra fingers, fused fingers, plastic skin, airbrushed skin, over-smoothed, unrealistic skin, uncanny valley, CGI, 3d render, illustration, cartoon, porcelain skin, beauty filter, wax figure, doll-like, painted look, oversharpened, video game, studio flash on face, ring light reflection, overly symmetrical, perfect flawless skin, stock photo look, passport photo, mugshot, floating body, incorrect perspective"

export function buildNegativePrompt(characteristics: {
  gender?: string
  is_bald?: boolean
  has_glasses?: boolean
}): string {
  const negatives: string[] = []
  
  if (characteristics.gender === 'male') {
    negatives.push('female', 'woman', 'feminine features', 'makeup', 'lipstick')
  } else if (characteristics.gender === 'female') {
    negatives.push('male', 'man', 'masculine features', 'beard', 'mustache', 'facial hair')
  }
  
  if (characteristics.is_bald) {
    negatives.push('hair on head', 'full head of hair', 'long hair', 'short hair', 'thick hair', 'hairstyle', 'wig')
  }
  
  if (characteristics.has_glasses === false) {
    negatives.push('glasses', 'eyeglasses', 'spectacles', 'sunglasses')
  }
  
  return negatives.length > 0 
    ? `${BASE_NEGATIVE_PROMPT}, ${negatives.join(', ')}`
    : BASE_NEGATIVE_PROMPT
}

// ===========================================
// PERSON DESCRIPTION BUILDER
// ===========================================
export function buildPersonDescription(characteristics: {
  gender?: string
  ethnicity?: string
  eye_color?: string
  hair_color?: string
  is_bald?: boolean
  has_glasses?: boolean
}): string {
  const parts: string[] = []
  
  if (characteristics.ethnicity && characteristics.gender) {
    const article = ['a', 'e', 'i', 'o', 'u'].includes(characteristics.ethnicity[0].toLowerCase()) ? 'an' : 'a'
    parts.push(`${article} ${characteristics.ethnicity} ${characteristics.gender}`)
  } else if (characteristics.gender) {
    parts.push(`a ${characteristics.gender}`)
  }
  
  if (characteristics.eye_color) {
    parts.push(`with ${characteristics.eye_color} eyes`)
  }
  
  if (characteristics.is_bald) {
    parts.push(`a clean-shaven bald head`)
  } else if (characteristics.hair_color) {
    parts.push(`${characteristics.hair_color} hair`)
  }
  
  if (characteristics.has_glasses) {
    parts.push(`wearing glasses`)
  }
  
  return parts.join(', ')
}

// ===========================================
// HELPER: Get framing description for UI
// ===========================================
export function getFramingForIndex(index: number): string {
  return FRAMINGS[index % FRAMINGS.length].description
}

// ===========================================
// HELPER: Validate combo selections
// ===========================================
export function isValidCombo(combo: StyleCombo): boolean {
  const hasLocation = LOCATIONS.some(l => l.id === combo.locationId)
  const hasClothing = CLOTHING_STYLES.some(c => c.id === combo.clothingId)
  const hasColor = CLOTHING_COLORS.some(c => c.id === combo.colorId)
  return hasLocation && hasClothing && hasColor
}