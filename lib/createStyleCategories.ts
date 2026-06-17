// Shared style categories for the "Choose Your Styles" step.
// Imported by both /create and /create/styles so the two pages can never diverge.

export interface StyleOption {
  id: string
  label: string
  description: string
  icon: string
}

export interface StyleCategory {
  id: string
  name: string
  icon: string
  gender: 'male' | 'female'
  styles: StyleOption[]
}

// Kadrering per stijl (afgeleid uit de generate-prompts). Wordt op het stijl-kaartje
// getoond zodat de klant vooraf weet of het een close-up, half body, enz. wordt.
export const STYLE_FRAMING: Record<string, string> = {
  'corporate-classic': 'Headshot', 'executive-navy': 'Half body', 'ceo-black': 'Headshot', 'boardroom-charcoal': 'Half body', 'pinstripe-pro': 'Headshot', 'three-piece': 'Half body', 'formal-black-drama': 'Headshot', 'wall-street-power': 'Headshot',
  'navy-blazer-open': 'Close-up', 'gray-blazer-blue': 'Half body', 'beige-elegance': 'Half body', 'teal-blazer': 'Half body', 'light-blue-blazer': 'Half body', 'creative-director': 'Half body', 'consultant-look': 'Half body',
  'tech-turtleneck': 'Close-up', 'gray-sweater-pro': 'Headshot', 'knit-cozy': 'Half body', 'v-neck-smart': 'Headshot',
  'white-button-down': 'Headshot', 'light-blue-oxford': 'Half body', 'navy-polo': 'Headshot', 'denim-shirt-fresh': 'Headshot', 'plaid-friendly': 'Headshot', 'white-tee-clean': 'Close-up', 'black-tee-clean': 'Close-up', 'henley-relaxed': 'Headshot',
  'golden-hour': 'Headshot', 'park-natural': 'Medium shot', 'rooftop-city': 'Medium shot', 'city-walk': 'Medium shot',
  'leather-jacket-urban': 'Medium shot', 'all-black-minimal': 'Headshot', 'bold-colored-blazer': 'Half body',
  'restaurant-elegant': 'Medium shot', 'wine-bar-relaxed': 'Medium shot', 'coffee-shop-date': 'Medium shot', 'rooftop-bar-evening': 'Half body',
  'arms-crossed-power': 'Half body', 'sitting-confident': 'Medium shot', 'leaning-elegant': 'Medium shot', 'hands-in-pockets': 'Half body', 'thoughtful-pose': 'Headshot', 'holding-tablet': 'Half body',
  'w-power-blazer-navy': 'Headshot', 'w-executive-charcoal': 'Half body', 'w-ceo-black': 'Headshot', 'w-pinstripe-pro': 'Headshot', 'w-sheath-classic': 'Headshot', 'w-pussybow-elegant': 'Headshot', 'w-cream-blazer-arms': 'Half body', 'w-turtleneck-blazer': 'Headshot',
  'w-silk-blouse-modern': 'Half body', 'w-cardigan-soft': 'Headshot', 'w-knit-twinset': 'Headshot', 'w-startup-casual': 'Medium shot',
  'w-red-power-suit': 'Half body', 'w-emerald-blazer': 'Headshot', 'w-mustard-creative': 'Half body', 'w-statement-coral': 'Headshot', 'w-jewel-purple': 'Headshot',
  'w-white-tee-natural': 'Half body', 'w-cream-sweater-window': 'Headshot', 'w-denim-shirt-fresh': 'Headshot', 'w-coffee-shop-warm': 'Medium shot', 'w-park-outdoor': 'Half body', 'w-rooftop-golden': 'Medium shot', 'w-architectural': 'Half body', 'w-city-walk': 'Medium shot', 'w-beach-professional': 'Half body',
  'w-restaurant-elegant': 'Headshot', 'w-wine-bar-casual': 'Medium shot', 'w-cocktail-glamour': 'Half body', 'w-cafe-date': 'Medium shot', 'w-rooftop-bar': 'Half body', 'w-restaurant-evening': 'Headshot', 'w-bistro-warm': 'Medium shot', 'w-leather-jacket-edge': 'Medium shot', 'w-evening-rooftop': 'Half body', 'w-night-city-glamour': 'Headshot',
  'w-arms-crossed-power': 'Half body', 'w-sitting-confident': 'Medium shot', 'w-leaning-elegant': 'Medium shot', 'w-hands-relaxed': 'Half body', 'w-thoughtful-pose': 'Headshot', 'w-holding-tablet': 'Half body',
}

export const STYLE_CATEGORIES: StyleCategory[] = [

  // MANNEN-STIJLEN
  {
    id: 'formal',
    name: 'Formal / Corporate Power',
    icon: '👔',
    gender: 'male',
    styles: [
      { id: 'corporate-classic',   label: 'Corporate Classic',  description: 'Navy suit, modern office',   icon: '🏢' },
      { id: 'executive-navy',      label: 'Executive Navy',     description: 'Navy suit, city skyline',    icon: '🌆' },
      { id: 'ceo-black',           label: 'CEO Black',          description: 'Black suit, light gray bg',  icon: '⬛' },
      { id: 'boardroom-charcoal',  label: 'Light Grey Suit',     description: 'Light grey suit, premium office', icon: '🪟' },
      { id: 'pinstripe-pro',       label: 'Pinstripe Pro',      description: 'Pinstripe suit + tie',       icon: '📐' },
      { id: 'three-piece',         label: 'Three Piece',        description: 'Three piece suit + vest',    icon: '🎩' },
      { id: 'formal-black-drama',  label: 'Formal Black',       description: 'Black suit, dramatic light', icon: '🖤' },
      { id: 'wall-street-power',   label: 'Wall Street Power',  description: 'Dark suit, red tie, street', icon: '📈' },
    ],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual / Business Modern',
    icon: '🧥',
    gender: 'male',
    styles: [
      { id: 'navy-blazer-open',    label: 'Navy Blazer Open',   description: 'Navy blazer, open collar',  icon: '👕' },
      { id: 'gray-blazer-blue',    label: 'Gray Blazer',        description: 'Gray blazer, blue bg',       icon: '🔵' },
      { id: 'beige-elegance',      label: 'Beige Elegance',     description: 'Beige linen suit',           icon: '🟫' },
      { id: 'teal-blazer',         label: 'Teal Blazer',        description: 'Teal blazer, white tee',     icon: '💎' },
      { id: 'light-blue-blazer',   label: 'Light Blue Blazer',  description: 'Light blue blazer, office',  icon: '💙' },
      { id: 'creative-director',   label: 'Creative Director',  description: 'Black blazer + turtleneck',  icon: '🎨' },
      { id: 'consultant-look',     label: 'Consultant',         description: 'Light gray suit, no tie',    icon: '📋' },
    ],
  },
  {
    id: 'tech-founder',
    name: 'Tech Founder / Sweater',
    icon: '⚡',
    gender: 'male',
    styles: [
      { id: 'tech-turtleneck',     label: 'Tech Turtleneck',    description: 'Gray turtleneck, minimal',   icon: '🤍' },
      { id: 'gray-sweater-pro',    label: 'Gray Sweater Pro',   description: 'Crew neck over collar',      icon: '🧶' },
      { id: 'knit-cozy',           label: 'Knit Cozy',          description: 'Chunky knit, warm light',    icon: '🧣' },
      { id: 'v-neck-smart',        label: 'V-Neck Smart',       description: 'Blue V-neck over collar',    icon: '🔻' },
    ],
  },
  {
    id: 'casual',
    name: 'Casual Professional',
    icon: '👕',
    gender: 'male',
    styles: [
      { id: 'white-button-down',   label: 'White Button-Down',  description: 'Clean white shirt',          icon: '🤍' },
      { id: 'light-blue-oxford',   label: 'Light Blue Oxford',  description: 'Light blue oxford, open',    icon: '💙' },
      { id: 'navy-polo',           label: 'Navy Polo',          description: 'Navy polo, clean bg',        icon: '🔷' },
      { id: 'denim-shirt-fresh',   label: 'Denim Shirt',        description: 'Chambray, white bg',         icon: '👖' },
      { id: 'plaid-friendly',      label: 'Plaid Friendly',     description: 'Plaid button-up, neutral',   icon: '🪵' },
      { id: 'white-tee-clean',     label: 'White Tee Clean',    description: 'Plain white tee, casual',    icon: '⚪' },
      { id: 'black-tee-clean',     label: 'Black Tee Clean',    description: 'Plain black tee, casual',    icon: '⚫' },
      { id: 'henley-relaxed',      label: 'Henley Relaxed',     description: 'Henley, warm window light',  icon: '🪟' },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor / Lifestyle',
    icon: '🌿',
    gender: 'male',
    styles: [
      { id: 'golden-hour',         label: 'Golden Hour',        description: 'Warm tones, sunset light',   icon: '🌅' },
      { id: 'park-natural',        label: 'Park Natural',       description: 'Green park, daylight',       icon: '🌳' },
      { id: 'rooftop-city',        label: 'Rooftop City',       description: 'City skyline, rooftop',      icon: '🏙️' },
      { id: 'city-walk',           label: 'City Walk',          description: 'Walking, urban street',      icon: '🚶' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative / Bold',
    icon: '🎸',
    gender: 'male',
    styles: [
      { id: 'leather-jacket-urban', label: 'Leather Jacket',   description: 'Black leather, urban',       icon: '🧥' },
      { id: 'all-black-minimal',   label: 'All Black Minimal', description: 'All black, dramatic',        icon: '🌑' },
      { id: 'bold-colored-blazer', label: 'Bold Colored Blazer', description: 'Red/emerald blazer',       icon: '🌈' },
    ],
  },
  {
    id: 'specialty-poses',
    name: 'Specialty Poses',
    icon: '🧍',
    gender: 'male',
    styles: [
      { id: 'arms-crossed-power',  label: 'Arms Crossed',       description: 'Arms crossed, dark suit',    icon: '💪' },
      { id: 'sitting-confident',   label: 'Sitting Confident',  description: 'Sitting in chair, blazer',   icon: '🪑' },
      { id: 'leaning-elegant',     label: 'Leaning Elegant',    description: 'Leaning casually, modern',   icon: '🚪' },
      { id: 'hands-in-pockets',    label: 'Hands in Pockets',   description: 'Relaxed, urban background',  icon: '🧍' },
      { id: 'thoughtful-pose',     label: 'Thoughtful',         description: 'Hand near chin, intellectual', icon: '🤔' },
      { id: 'holding-tablet',      label: 'Holding Tablet',     description: 'Tablet, modern office',      icon: '📱' },
    ],
  },
  {
    id: 'restaurant-mens',
    name: 'Restaurant / Date Night',
    icon: '🍷',
    gender: 'male',
    styles: [
      { id: 'restaurant-elegant',   label: 'Restaurant Elegant', description: 'Upscale restaurant, candlelit', icon: '🕯️' },
      { id: 'wine-bar-relaxed',     label: 'Wine Bar Relaxed',   description: 'At wine bar, warm light',    icon: '🍷' },
      { id: 'coffee-shop-date',     label: 'Coffee Shop Date',   description: 'Coffee shop, ambient',       icon: '☕' },
      { id: 'rooftop-bar-evening',  label: 'Rooftop Bar Evening', description: 'City lights, evening',      icon: '🌃' },
    ],
  },

  // VROUWEN-STIJLEN
  {
    id: 'w-formal',
    name: 'Formal / Corporate Power',
    icon: '💼',
    gender: 'female',
    styles: [
      { id: 'w-power-blazer-navy',   label: 'Navy Power Blazer', description: 'Navy blazer, white blouse', icon: '🔷' },
      { id: 'w-executive-charcoal',  label: 'Executive Charcoal', description: 'Charcoal suit, modern',    icon: '🪟' },
      { id: 'w-ceo-black',           label: 'CEO Black',         description: 'Black blazer, powerful',     icon: '⬛' },
      { id: 'w-pinstripe-pro',       label: 'Pinstripe Pro',     description: 'Pinstripe blazer, silk',     icon: '📐' },
      { id: 'w-sheath-classic',      label: 'Sheath Dress',      description: 'Black sheath, refined',      icon: '🖤' },
      { id: 'w-pussybow-elegant',    label: 'Pussybow Elegant',  description: 'Silk blouse, tweed',         icon: '🎀' },
    ],
  },
  {
    id: 'w-smart-casual',
    name: 'Smart Casual / Business Modern',
    icon: '🧥',
    gender: 'female',
    styles: [
      { id: 'w-cream-blazer-arms',   label: 'Cream Blazer',      description: 'Cream blazer + tee',         icon: '🟡' },
      { id: 'w-turtleneck-blazer',   label: 'Turtleneck + Blazer', description: 'Black turtleneck + gray',  icon: '🖤' },
      { id: 'w-silk-blouse-modern',  label: 'Silk Blouse',       description: 'Navy silk, modern office',   icon: '💙' },
      { id: 'w-cardigan-soft',       label: 'Cardigan Soft',     description: 'Beige cardigan, warm',       icon: '🧶' },
      { id: 'w-knit-twinset',        label: 'Knit Twinset',      description: 'Matching knit, neutral',     icon: '🌾' },
      { id: 'w-startup-casual',      label: 'Startup Casual',    description: 'Light blue shirt, modern',   icon: '🚀' },
    ],
  },
  {
    id: 'w-creative',
    name: 'Creative / Bold',
    icon: '🌈',
    gender: 'female',
    styles: [
      { id: 'w-red-power-suit',      label: 'Red Power Suit',    description: 'Red blazer, statement',      icon: '🔴' },
      { id: 'w-emerald-blazer',      label: 'Emerald Blazer',    description: 'Green blazer, bold',         icon: '💚' },
      { id: 'w-mustard-creative',    label: 'Mustard Creative',  description: 'Mustard silk, artistic',     icon: '🟡' },
      { id: 'w-statement-coral',     label: 'Statement Coral',   description: 'Coral blazer, vibrant',      icon: '🪸' },
      { id: 'w-jewel-purple',        label: 'Jewel Purple',      description: 'Deep purple, expressive',    icon: '🟣' },
    ],
  },
  {
    id: 'w-casual',
    name: 'Casual / Approachable',
    icon: '👕',
    gender: 'female',
    styles: [
      { id: 'w-white-tee-natural',   label: 'White Tee Nature',  description: 'White tee, green outdoor',   icon: '🌿' },
      { id: 'w-cream-sweater-window', label: 'Cream Sweater',    description: 'Soft knit, window light',    icon: '🤍' },
      { id: 'w-denim-shirt-fresh',   label: 'Denim Shirt',       description: 'Chambray, fresh white bg',   icon: '👖' },
      { id: 'w-coffee-shop-warm',    label: 'Coffee Shop Warm',  description: 'Casual sweater, café',       icon: '☕' },
      { id: 'w-park-outdoor',        label: 'Park Outdoor',      description: 'Light blouse, park bg',      icon: '🌳' },
    ],
  },
  {
    id: 'w-outdoor',
    name: 'Outdoor / Lifestyle',
    icon: '🌿',
    gender: 'female',
    styles: [
      { id: 'w-rooftop-golden',      label: 'Rooftop Golden',    description: 'City panorama, golden hour', icon: '🌅' },
      { id: 'w-architectural',       label: 'Architectural',     description: 'Modern architecture bg',     icon: '🏛️' },
      { id: 'w-city-walk',           label: 'City Walk',         description: 'Walking, urban street',      icon: '🚶‍♀️' },
      { id: 'w-beach-professional',  label: 'Beach Professional', description: 'Linen blouse, coastal',     icon: '🏖️' },
    ],
  },
  {
    id: 'w-specialty-poses',
    name: 'Specialty Poses',
    icon: '🧍‍♀️',
    gender: 'female',
    styles: [
      { id: 'w-arms-crossed-power', label: 'Arms Crossed',      description: 'Arms crossed, blazer',       icon: '💪' },
      { id: 'w-sitting-confident',  label: 'Sitting Confident', description: 'Sitting in chair, blazer',   icon: '🪑' },
      { id: 'w-leaning-elegant',    label: 'Leaning Elegant',   description: 'Leaning casually, modern',   icon: '🚪' },
      { id: 'w-hands-relaxed',      label: 'Hands Relaxed',     description: 'Relaxed pose, urban',        icon: '🧍‍♀️' },
      { id: 'w-thoughtful-pose',    label: 'Thoughtful',        description: 'Hand near chin, elegant',    icon: '🤔' },
      { id: 'w-holding-tablet',     label: 'Holding Tablet',    description: 'Tablet, modern office',      icon: '📱' },
    ],
  },
  {
    id: 'w-restaurant',
    name: 'Restaurant / Date Night',
    icon: '🍷',
    gender: 'female',
    styles: [
      { id: 'w-restaurant-elegant',  label: 'Restaurant Elegant', description: 'Silk blouse, candlelit',    icon: '🕯️' },
      { id: 'w-wine-bar-casual',     label: 'Wine Bar Casual',   description: 'At wine bar, warm light',    icon: '🍷' },
      { id: 'w-cocktail-glamour',    label: 'Cocktail Glamour',  description: 'Cocktail dress, evening',    icon: '✨' },
      { id: 'w-cafe-date',           label: 'Café Date',         description: 'Charming cafe interior',     icon: '☕' },
      { id: 'w-rooftop-bar',         label: 'Rooftop Bar',       description: 'Rooftop bar, city lights',   icon: '🌃' },
      { id: 'w-restaurant-evening',  label: 'Restaurant Evening', description: 'Intimate, candlelight',     icon: '🌙' },
      { id: 'w-bistro-warm',         label: 'Bistro Warm',       description: 'Smart casual, bistro',       icon: '🥂' },
    ],
  },
  {
    id: 'w-evening',
    name: 'Evening / Statement',
    icon: '✨',
    gender: 'female',
    styles: [
      { id: 'w-leather-jacket-edge', label: 'Leather Jacket',    description: 'Black leather, edgy',        icon: '🧥' },
      { id: 'w-evening-rooftop',     label: 'Evening Rooftop',   description: 'Black evening top, lights',  icon: '🌃' },
      { id: 'w-night-city-glamour',  label: 'Night City Glamour', description: 'City nightlife, glamorous', icon: '💫' },
    ],
  },
]
