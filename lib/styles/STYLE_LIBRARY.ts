// lib/styles/STYLE_LIBRARY.ts
// Complete 50+ style library for Nova Imago
// Organized by categories like AISelfie.es

export interface StyleDefinition {
  id: string
  name: string
  category: string
  description: string
  preview: string // Path to preview image
  prompts: string[] // 4 prompt variations for this style
  tier: 'starter' | 'pro' // Which pricing tier unlocks this
  popular?: boolean // Mark popular styles
}

export const STYLE_CATEGORIES = {
  BUSINESS_SUITS: 'Business Suits',
  CASUAL_PROFESSIONAL: 'Casual Professional',
  WITH_PROPS: 'With Props',
  CONFIDENT_POSES: 'Confident Poses',
  CREATIVE_BACKGROUNDS: 'Creative Backgrounds',
  DESIGNER_WEAR: 'Designer Wear',
  OUTDOOR_SETTINGS: 'Outdoor Settings',
  MODERN_CASUAL: 'Modern Casual',
}

export const STYLE_LIBRARY: StyleDefinition[] = [
  
  // ========================================
  // BUSINESS SUITS (8 styles)
  // ========================================
  {
    id: 'biz_navy_gray',
    name: 'Navy Suit - Gray Background',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Classic navy suit with gray studio background',
    preview: '/styles/navy-gray.jpg',
    tier: 'starter',
    popular: true,
    prompts: [
      'TOK person professional headshot, navy blue suit, white shirt, gray background, studio lighting, 8k, sharp focus, professional',
      'TOK person executive portrait, navy suit, crisp white shirt, neutral gray backdrop, studio lighting, detailed, high resolution',
      'TOK person corporate headshot, navy blue business suit, white dress shirt, soft gray background, professional lighting, sharp',
      'TOK person business portrait, navy suit jacket, white collar shirt, gray studio background, confident expression, 8k'
    ]
  },
  
  {
    id: 'biz_charcoal_office',
    name: 'Charcoal Suit - Office',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Charcoal gray suit in modern office setting',
    preview: '/styles/charcoal-office.jpg',
    tier: 'starter',
    popular: true,
    prompts: [
      'TOK person executive portrait, charcoal suit, light blue shirt, office background, natural lighting, high resolution, professional',
      'TOK person corporate headshot, dark gray suit, blue oxford shirt, modern office, soft lighting, 8k, detailed',
      'TOK person professional photo, charcoal suit, light blue dress shirt, blurred office background, natural light, sharp',
      'TOK person business portrait, gray suit, powder blue shirt, corporate office setting, professional lighting, high quality'
    ]
  },
  
  {
    id: 'biz_black_white',
    name: 'Black Suit - White Background',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Sharp black suit on clean white backdrop',
    preview: '/styles/black-white.jpg',
    tier: 'starter',
    prompts: [
      'TOK person business photo, black suit, white shirt, white background, studio lighting, detailed, crisp, 8k',
      'TOK person professional headshot, black business suit, crisp white background, studio lighting, sharp focus, high resolution',
      'TOK person executive portrait, black suit jacket, white backdrop, clean lighting, professional, detailed',
      'TOK person corporate photo, black formal suit, pure white background, studio lighting, confident expression, 8k'
    ]
  },
  
  {
    id: 'biz_navy_window',
    name: 'Navy Suit - Window Light',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Navy suit with natural window lighting',
    preview: '/styles/navy-window.jpg',
    tier: 'starter',
    prompts: [
      'TOK person professional portrait, navy suit, natural window light, office background, soft lighting, 8k, realistic',
      'TOK person executive headshot, navy blue suit, window lighting from side, modern office, natural light, detailed',
      'TOK person business photo, navy suit jacket, soft window light, professional setting, realistic lighting, sharp',
      'TOK person corporate portrait, navy business suit, natural daylight, office interior, soft shadows, high resolution'
    ]
  },
  
  {
    id: 'biz_three_piece',
    name: 'Three-Piece Suit',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Classic three-piece suit with vest',
    preview: '/styles/three-piece.jpg',
    tier: 'pro',
    prompts: [
      'TOK person executive portrait, three-piece navy suit with vest, white shirt, gray background, studio lighting, 8k, sharp',
      'TOK person professional headshot, complete three-piece suit, vest visible, formal attire, studio lighting, detailed',
      'TOK person business photo, navy three-piece suit, vest and jacket, white shirt, professional lighting, high resolution',
      'TOK person corporate portrait, formal three-piece suit, vest showing, confident pose, studio lighting, 8k'
    ]
  },
  
  {
    id: 'biz_pinstripe',
    name: 'Pinstripe Suit',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Classic pinstripe business suit',
    preview: '/styles/pinstripe.jpg',
    tier: 'pro',
    prompts: [
      'TOK person executive portrait, navy pinstripe suit, white shirt, gray background, studio lighting, professional, 8k',
      'TOK person professional headshot, pinstripe business suit, subtle stripes, formal attire, studio lighting, detailed',
      'TOK person corporate photo, charcoal pinstripe suit, professional setting, confident expression, high resolution',
      'TOK person business portrait, classic pinstripe suit, white dress shirt, studio lighting, sharp focus, 8k'
    ]
  },
  
  {
    id: 'biz_light_gray',
    name: 'Light Gray Suit',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Modern light gray suit for approachable look',
    preview: '/styles/light-gray.jpg',
    tier: 'pro',
    prompts: [
      'TOK person professional headshot, light gray suit, white shirt, neutral background, modern style, 8k, sharp',
      'TOK person business portrait, light gray business suit, contemporary look, professional lighting, detailed',
      'TOK person executive photo, pale gray suit, modern professional, clean background, studio lighting, high resolution',
      'TOK person corporate headshot, light gray suit jacket, approachable professional, soft lighting, 8k'
    ]
  },
  
  {
    id: 'biz_burgundy_tie',
    name: 'Navy Suit - Burgundy Tie',
    category: STYLE_CATEGORIES.BUSINESS_SUITS,
    description: 'Navy suit with pop of color from tie',
    preview: '/styles/burgundy-tie.jpg',
    tier: 'pro',
    prompts: [
      'TOK person executive portrait, navy suit, white shirt, burgundy tie, gray background, studio lighting, 8k, professional',
      'TOK person professional headshot, navy business suit, burgundy red tie, formal attire, studio lighting, sharp focus',
      'TOK person corporate photo, navy suit with burgundy necktie, confident expression, professional lighting, detailed',
      'TOK person business portrait, navy suit, burgundy tie accent, white shirt, studio lighting, high resolution'
    ]
  },
  
  // ========================================
  // CASUAL PROFESSIONAL (8 styles)
  // ========================================
  {
    id: 'casual_blue_shirt',
    name: 'Blue Oxford Shirt',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Classic blue dress shirt, no jacket',
    preview: '/styles/blue-oxford.jpg',
    tier: 'starter',
    popular: true,
    prompts: [
      'TOK person corporate headshot, blue oxford shirt, modern office, soft lighting, professional, 8k, natural',
      'TOK person business casual, light blue dress shirt, office background, friendly expression, natural lighting, detailed',
      'TOK person professional photo, blue button-up shirt, neutral background, approachable, studio lighting, high resolution',
      'TOK person casual headshot, blue oxford shirt, modern workspace, natural light, professional, sharp focus'
    ]
  },
  
  {
    id: 'casual_white_polo',
    name: 'White Polo Shirt',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Clean white polo for LinkedIn',
    preview: '/styles/white-polo.jpg',
    tier: 'starter',
    popular: true,
    prompts: [
      'TOK person LinkedIn photo, white polo shirt, gray background, professional, studio lighting, sharp, 8k',
      'TOK person casual professional, white polo shirt, neutral background, friendly, natural lighting, detailed',
      'TOK person business casual headshot, white polo, clean background, approachable expression, studio lighting, high quality',
      'TOK person corporate casual, white polo shirt, gray backdrop, professional yet approachable, 8k'
    ]
  },
  
  {
    id: 'casual_navy_polo',
    name: 'Navy Polo Shirt',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Navy blue polo for casual professional look',
    preview: '/styles/navy-polo.jpg',
    tier: 'starter',
    prompts: [
      'TOK person casual professional, navy polo shirt, neutral background, friendly, natural lighting, detailed, 8k',
      'TOK person business casual headshot, navy blue polo, gray background, approachable, studio lighting, sharp',
      'TOK person professional photo, navy polo shirt, modern style, clean background, soft lighting, high resolution',
      'TOK person corporate casual, navy polo, neutral backdrop, friendly expression, professional lighting, 8k'
    ]
  },
  
  {
    id: 'casual_sweater',
    name: 'Business Casual Sweater',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'V-neck sweater over dress shirt',
    preview: '/styles/sweater.jpg',
    tier: 'pro',
    prompts: [
      'TOK person professional photo, navy v-neck sweater over white shirt, modern casual, studio lighting, 8k, sharp',
      'TOK person business casual, sweater over dress shirt, approachable professional, natural lighting, detailed',
      'TOK person casual executive, v-neck sweater, white collar showing, professional yet relaxed, soft lighting, high resolution',
      'TOK person corporate casual, navy sweater over shirt, modern professional, studio lighting, 8k'
    ]
  },
  
  {
    id: 'casual_blazer_jeans',
    name: 'Blazer with Jeans',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Smart casual blazer and jeans combo',
    preview: '/styles/blazer-jeans.jpg',
    tier: 'pro',
    prompts: [
      'TOK person smart casual, navy blazer, white t-shirt, modern professional, natural lighting, 8k, contemporary',
      'TOK person casual executive, blazer without tie, relaxed professional, studio lighting, detailed, sharp',
      'TOK person business casual, sport coat, modern style, approachable yet professional, soft lighting, high resolution',
      'TOK person contemporary professional, blazer, casual shirt, confident expression, natural lighting, 8k'
    ]
  },
  
  {
    id: 'casual_henley',
    name: 'Henley Shirt',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Casual henley for approachable look',
    preview: '/styles/henley.jpg',
    tier: 'pro',
    prompts: [
      'TOK person casual professional, navy henley shirt, modern casual, natural lighting, approachable, 8k, sharp',
      'TOK person relaxed business casual, henley style shirt, contemporary look, soft lighting, detailed',
      'TOK person modern casual, henley shirt, friendly professional, studio lighting, high resolution',
      'TOK person approachable professional, casual henley, neutral background, natural light, 8k'
    ]
  },
  
  {
    id: 'casual_button_down_open',
    name: 'Open Collar Shirt',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Button-down with open collar',
    preview: '/styles/open-collar.jpg',
    tier: 'starter',
    prompts: [
      'TOK person business casual, white shirt open collar, relaxed professional, natural lighting, 8k, approachable',
      'TOK person casual executive, button-down shirt, no tie, modern professional, soft lighting, detailed',
      'TOK person relaxed professional, dress shirt open at collar, contemporary style, studio lighting, sharp',
      'TOK person modern business casual, open collar white shirt, friendly professional, natural light, high resolution'
    ]
  },
  
  {
    id: 'casual_turtleneck',
    name: 'Black Turtleneck',
    category: STYLE_CATEGORIES.CASUAL_PROFESSIONAL,
    description: 'Modern black turtleneck look',
    preview: '/styles/turtleneck.jpg',
    tier: 'pro',
    prompts: [
      'TOK person modern professional, black turtleneck, contemporary style, studio lighting, 8k, minimalist',
      'TOK person casual executive, black turtleneck sweater, clean background, sophisticated, soft lighting, detailed',
      'TOK person contemporary professional, black turtleneck, modern aesthetic, studio lighting, sharp, high resolution',
      'TOK person minimalist professional, black turtleneck, neutral background, confident expression, 8k'
    ]
  },
  
  // ========================================
  // WITH PROPS (8 styles)
  // ========================================
  {
    id: 'prop_coffee_standing',
    name: 'Standing with Coffee',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Holding white coffee cup, standing',
    preview: '/styles/coffee-standing.jpg',
    tier: 'pro',
    popular: true,
    prompts: [
      'TOK person professional photo, holding white coffee cup, business casual, modern office, warm lighting, 8k, natural',
      'TOK person casual headshot, white coffee mug in hand, blue shirt, office background, friendly, soft lighting, detailed',
      'TOK person business casual, holding coffee cup, standing position, modern workspace, natural light, sharp, realistic',
      'TOK person professional portrait, white coffee mug, business attire, office setting, warm lighting, high resolution'
    ]
  },
  
  {
    id: 'prop_coffee_desk',
    name: 'Coffee at Desk',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Sitting at desk with coffee',
    preview: '/styles/coffee-desk.jpg',
    tier: 'pro',
    prompts: [
      'TOK person at desk with coffee cup, business casual, modern office, natural lighting, professional, 8k, realistic',
      'TOK person sitting at desk, coffee mug visible, laptop nearby, office background, natural light, detailed',
      'TOK person professional at workspace, coffee on desk, business attire, office setting, soft lighting, sharp',
      'TOK person casual office photo, coffee cup on desk, working environment, natural light, high resolution'
    ]
  },
  
  {
    id: 'prop_phone_checking',
    name: 'Checking Smartphone',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Looking at phone, professional setting',
    preview: '/styles/phone-checking.jpg',
    tier: 'pro',
    popular: true,
    prompts: [
      'TOK person professional photo, holding smartphone, navy suit, modern office background, looking at phone, natural lighting, 8k, detailed',
      'TOK person business portrait, iPhone in hand, blue shirt, gray background, professional, studio lighting, sharp',
      'TOK person corporate photo, checking phone, casual outfit, office setting, natural light, realistic, high resolution',
      'TOK person executive photo, smartphone visible, business attire, modern workspace, professional lighting, 8k'
    ]
  },
  
  {
    id: 'prop_phone_call',
    name: 'On Phone Call',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Taking a phone call, professional',
    preview: '/styles/phone-call.jpg',
    tier: 'pro',
    prompts: [
      'TOK person on phone call, smartphone to ear, business attire, office background, professional, natural lighting, 8k',
      'TOK person professional portrait, taking phone call, confident expression, modern office, soft lighting, detailed',
      'TOK person executive on call, smartphone, business suit, office setting, natural light, sharp, realistic',
      'TOK person business photo, phone conversation, professional demeanor, office background, natural lighting, high resolution'
    ]
  },
  
  {
    id: 'prop_laptop_typing',
    name: 'Working at Laptop',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'At laptop, focused on work',
    preview: '/styles/laptop-typing.jpg',
    tier: 'pro',
    prompts: [
      'TOK person working at laptop, business attire, modern office desk, focused expression, natural lighting, 8k, professional',
      'TOK person at MacBook, casual shirt, office background, typing, natural light, detailed, realistic',
      'TOK person professional photo, laptop visible, blue shirt, office setting, confident, natural lighting, sharp',
      'TOK person at workspace, working on laptop, business casual, modern desk, soft lighting, high resolution'
    ]
  },
  
  {
    id: 'prop_tablet_presenting',
    name: 'Presenting with Tablet',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Holding tablet, explaining',
    preview: '/styles/tablet.jpg',
    tier: 'pro',
    prompts: [
      'TOK person holding tablet, presenting information, business attire, office background, professional, natural lighting, 8k',
      'TOK person with iPad, explaining, business casual, modern office, confident expression, soft lighting, detailed',
      'TOK person professional presentation, tablet in hand, business suit, office setting, natural light, sharp',
      'TOK person executive with tablet, professional demeanor, modern workspace, natural lighting, high resolution'
    ]
  },
  
  {
    id: 'prop_documents',
    name: 'Reviewing Documents',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Looking at documents, professional',
    preview: '/styles/documents.jpg',
    tier: 'pro',
    prompts: [
      'TOK person reviewing documents, business attire, office setting, focused expression, natural lighting, 8k, professional',
      'TOK person with papers, professional photo, business casual, modern office, soft lighting, detailed, realistic',
      'TOK person holding documents, executive portrait, business suit, office background, natural light, sharp',
      'TOK person professional with paperwork, confident demeanor, office setting, natural lighting, high resolution'
    ]
  },
  
  {
    id: 'prop_glasses',
    name: 'Adjusting Glasses',
    category: STYLE_CATEGORIES.WITH_PROPS,
    description: 'Thoughtful pose with glasses',
    preview: '/styles/glasses.jpg',
    tier: 'pro',
    prompts: [
      'TOK person wearing professional glasses, thoughtful expression, business attire, studio lighting, 8k, sharp',
      'TOK person with eyeglasses, adjusting frames, professional photo, office background, natural lighting, detailed',
      'TOK person professional portrait, glasses, business casual, modern style, soft lighting, high resolution',
      'TOK person executive with glasses, confident professional, studio lighting, sharp focus, 8k'
    ]
  },
  
  // ========================================
  // CONFIDENT POSES (6 styles)
  // ========================================
  {
    id: 'pose_arms_crossed',
    name: 'Arms Crossed - Confident',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Classic power pose with crossed arms',
    preview: '/styles/arms-crossed.jpg',
    tier: 'starter',
    popular: true,
    prompts: [
      'TOK person arms crossed, confident posture, navy suit, office background, professional, sharp focus, 8k, executive',
      'TOK person standing with crossed arms, blue shirt, modern office, professional portrait, natural lighting, detailed',
      'TOK person confident pose, arms crossed, business attire, corporate background, studio lighting, high resolution',
      'TOK person executive stance, arms folded, professional outfit, office setting, confident expression, 8k, sharp'
    ]
  },
  
  {
    id: 'pose_sitting_desk',
    name: 'Sitting at Desk',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Professional seated at workspace',
    preview: '/styles/sitting-desk.jpg',
    tier: 'starter',
    prompts: [
      'TOK person sitting at desk, hands clasped, professional attire, office background, natural lighting, 8k, professional',
      'TOK person seated executive portrait, modern office desk, confident, detailed, 4k, business setting',
      'TOK person at workspace, sitting position, business casual, office environment, natural light, sharp, realistic',
      'TOK person desk portrait, professional pose, modern office, natural lighting, high resolution, detailed'
    ]
  },
  
  {
    id: 'pose_leaning_forward',
    name: 'Leaning Forward - Engaged',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Leaning forward, engaged and approachable',
    preview: '/styles/leaning-forward.jpg',
    tier: 'pro',
    prompts: [
      'TOK person leaning forward, engaged expression, business casual, desk visible, natural lighting, 8k, approachable',
      'TOK person casual professional pose, leaning in, friendly demeanor, office setting, soft lighting, detailed',
      'TOK person approachable professional, leaning forward slightly, business attire, natural light, sharp, realistic',
      'TOK person engaged pose, leaning toward camera, professional outfit, office background, natural lighting, high resolution'
    ]
  },
  
  {
    id: 'pose_hands_together',
    name: 'Hands Together - Thoughtful',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Hands together in thoughtful pose',
    preview: '/styles/hands-together.jpg',
    tier: 'pro',
    prompts: [
      'TOK person hands together, thoughtful expression, business attire, office background, professional lighting, 8k, executive',
      'TOK person professional pose, hands clasped together, confident demeanor, studio lighting, detailed, sharp',
      'TOK person executive portrait, hands together thoughtfully, business suit, neutral background, soft lighting, high resolution',
      'TOK person confident professional, hands positioned together, business casual, studio lighting, 8k, realistic'
    ]
  },
  
  {
    id: 'pose_standing_straight',
    name: 'Standing Tall - Executive',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Strong standing posture',
    preview: '/styles/standing-tall.jpg',
    tier: 'pro',
    prompts: [
      'TOK person standing tall, strong posture, business suit, office background, confident, natural lighting, 8k, executive',
      'TOK person professional standing pose, straight posture, business attire, modern office, studio lighting, detailed',
      'TOK person executive standing portrait, confident stance, business suit, corporate setting, natural light, sharp',
      'TOK person strong professional pose, standing position, business outfit, office background, professional lighting, high resolution'
    ]
  },
  
  {
    id: 'pose_casual_lean',
    name: 'Casual Lean - Approachable',
    category: STYLE_CATEGORIES.CONFIDENT_POSES,
    description: 'Relaxed leaning pose',
    preview: '/styles/casual-lean.jpg',
    tier: 'pro',
    prompts: [
      'TOK person casual lean, relaxed professional, business casual, modern office, natural lighting, 8k, approachable',
      'TOK person leaning casually, friendly professional, contemporary style, office background, soft lighting, detailed',
      'TOK person relaxed pose, casual lean, approachable demeanor, modern workspace, natural light, sharp, realistic',
      'TOK person casual professional stance, relaxed posture, business casual, office setting, natural lighting, high resolution'
    ]
  },
  
  // ========================================
  // CREATIVE BACKGROUNDS (6 styles)
  // ========================================
  {
    id: 'bg_orange_gradient',
    name: 'Orange Gradient',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Vibrant orange gradient background',
    preview: '/styles/orange-gradient.jpg',
    tier: 'pro',
    popular: true,
    prompts: [
      'TOK person professional headshot, navy suit, orange to yellow gradient background, vibrant, 8k, modern style',
      'TOK person executive portrait, business attire, warm orange gradient backdrop, contemporary, studio lighting, detailed',
      'TOK person professional photo, orange gradient background, business suit, modern aesthetic, sharp focus, high resolution',
      'TOK person corporate headshot, vibrant orange gradient, professional outfit, modern style, studio lighting, 8k'
    ]
  },
  
  {
    id: 'bg_pink_gradient',
    name: 'Pink Gradient',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Modern pink to purple gradient',
    preview: '/styles/pink-gradient.jpg',
    tier: 'pro',
    prompts: [
      'TOK person portrait, blue shirt, pink to purple gradient, modern style, high quality, sharp, professional, 8k',
      'TOK person professional headshot, pink gradient background, business casual, contemporary aesthetic, studio lighting, detailed',
      'TOK person executive photo, pink to purple gradient backdrop, modern professional, soft lighting, high resolution',
      'TOK person corporate portrait, vibrant pink gradient, professional attire, modern style, studio lighting, 8k'
    ]
  },
  
  {
    id: 'bg_teal_gradient',
    name: 'Teal Gradient',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Cool teal gradient background',
    preview: '/styles/teal-gradient.jpg',
    tier: 'pro',
    prompts: [
      'TOK person executive photo, business attire, teal gradient background, contemporary, 8k, detailed, modern',
      'TOK person professional portrait, teal to blue gradient, business suit, modern aesthetic, studio lighting, sharp',
      'TOK person corporate headshot, cool teal gradient backdrop, professional outfit, contemporary style, high resolution',
      'TOK person modern professional, teal gradient background, business attire, studio lighting, 8k, detailed'
    ]
  },
  
  {
    id: 'bg_blue_gradient',
    name: 'Blue Gradient',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Professional blue gradient',
    preview: '/styles/blue-gradient.jpg',
    tier: 'starter',
    prompts: [
      'TOK person professional headshot, blue gradient background, business casual, modern, sharp focus, high resolution, 8k',
      'TOK person executive portrait, blue to navy gradient, business suit, contemporary style, studio lighting, detailed',
      'TOK person corporate photo, blue gradient backdrop, professional attire, modern aesthetic, soft lighting, sharp',
      'TOK person professional portrait, blue gradient background, business outfit, studio lighting, high resolution, 8k'
    ]
  },
  
  {
    id: 'bg_bokeh_lights',
    name: 'Bokeh City Lights',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Blurred city lights background',
    preview: '/styles/bokeh.jpg',
    tier: 'pro',
    prompts: [
      'TOK person professional portrait, bokeh city lights background, business attire, evening atmosphere, 8k, cinematic',
      'TOK person executive photo, blurred city lights backdrop, professional outfit, urban style, soft focus background, detailed',
      'TOK person corporate headshot, bokeh light effect, business suit, modern urban aesthetic, professional lighting, sharp',
      'TOK person professional photo, out of focus city lights, business attire, evening setting, cinematic lighting, high resolution'
    ]
  },
  
  {
    id: 'bg_minimalist_white',
    name: 'Pure White Minimalist',
    category: STYLE_CATEGORIES.CREATIVE_BACKGROUNDS,
    description: 'Clean white background, minimal',
    preview: '/styles/white-minimal.jpg',
    tier: 'starter',
    prompts: [
      'TOK person professional headshot, pure white background, business attire, minimalist style, studio lighting, 8k, clean',
      'TOK person executive portrait, clean white backdrop, professional outfit, minimalist aesthetic, soft lighting, detailed',
      'TOK person corporate photo, white background, business suit, modern minimalist, studio lighting, sharp, high resolution',
      'TOK person professional headshot, minimalist white background, business casual, clean style, studio lighting, 8k'
    ]
  },
  
  // ========================================
  // OUTDOOR SETTINGS (3 styles)
  // ========================================
  {
    id: 'outdoor_corporate_park',
    name: 'Corporate Park',
    category: STYLE_CATEGORIES.OUTDOOR_SETTINGS,
    description: 'Modern corporate park setting',
    preview: '/styles/corporate-park.jpg',
    tier: 'pro',
    popular: true,
    prompts: [
      'TOK person professional photo, business casual, outdoor corporate park, natural daylight, 8k, realistic, sharp',
      'TOK person executive portrait, modern office building exterior, blue sky, professional, detailed, natural light',
      'TOK person outdoor headshot, business attire, urban corporate setting, natural lighting, high resolution, professional',
      'TOK person corporate photo, outdoor professional setting, natural environment, daylight, 8k, realistic, detailed'
    ]
  },
  
  {
    id: 'outdoor_urban_street',
    name: 'Urban Street Professional',
    category: STYLE_CATEGORIES.OUTDOOR_SETTINGS,
    description: 'Professional in urban environment',
    preview: '/styles/urban-street.jpg',
    tier: 'pro',
    prompts: [
      'TOK person professional photo, business casual, urban street background, natural daylight, 8k, modern, realistic',
      'TOK person outdoor portrait, city street setting, business attire, natural light, contemporary style, detailed',
      'TOK person urban professional, street environment, business outfit, natural lighting, sharp focus, high resolution',
      'TOK person city professional photo, urban backdrop, business casual, natural daylight, modern style, 8k'
    ]
  },
  
  {
    id: 'outdoor_building_exterior',
    name: 'Modern Building Exterior',
    category: STYLE_CATEGORIES.OUTDOOR_SETTINGS,
    description: 'Professional at modern building',
    preview: '/styles/building-exterior.jpg',
    tier: 'pro',
    prompts: [
      'TOK person executive portrait, modern office building background, business suit, natural daylight, 8k, professional',
      'TOK person professional outdoor photo, contemporary architecture backdrop, business attire, natural light, detailed',
      'TOK person corporate outdoor portrait, modern building exterior, professional outfit, daylight, sharp, high resolution',
      'TOK person outdoor executive photo, architectural background, business suit, natural lighting, modern style, 8k'
    ]
  },
  
  // ========================================
  // DESIGNER WEAR (3 styles)
  // ========================================
  {
    id: 'designer_polo_logo',
    name: 'Designer Polo with Logo',
    category: STYLE_CATEGORIES.DESIGNER_WEAR,
    description: 'Polo shirt with subtle designer logo',
    preview: '/styles/designer-polo.jpg',
    tier: 'pro',
    prompts: [
      'TOK person wearing polo shirt with small embroidered logo, professional, gray background, 8k, detailed, sharp',
      'TOK person in designer polo, subtle logo visible, casual professional, neutral background, natural lighting, high resolution',
      'TOK person professional photo, polo shirt with small logo detail, modern casual, studio lighting, detailed, 8k',
      'TOK person casual executive, branded polo shirt, professional setting, soft lighting, sharp focus, high resolution'
    ]
  },
  
  {
    id: 'designer_button_down',
    name: 'Designer Button-Down',
    category: STYLE_CATEGORIES.DESIGNER_WEAR,
    description: 'Premium button-down shirt',
    preview: '/styles/designer-shirt.jpg',
    tier: 'pro',
    prompts: [
      'TOK person wearing premium button-down shirt, subtle branding, professional, studio lighting, 8k, detailed',
      'TOK person in designer dress shirt, high-quality fabric, business casual, natural lighting, sharp, high resolution',
      'TOK person professional photo, premium button-down, modern casual, soft lighting, detailed, 8k',
      'TOK person casual executive, designer shirt, professional setting, natural light, sharp focus, high resolution'
    ]
  },
  
  {
    id: 'designer_casual_luxury',
    name: 'Luxury Casual Wear',
    category: STYLE_CATEGORIES.DESIGNER_WEAR,
    description: 'High-end casual professional look',
    preview: '/styles/luxury-casual.jpg',
    tier: 'pro',
    prompts: [
      'TOK person luxury casual wear, premium fabrics, modern professional, studio lighting, 8k, sophisticated',
      'TOK person in high-end casual attire, designer quality, professional photo, natural lighting, detailed, sharp',
      'TOK person executive casual, luxury brands, modern style, soft lighting, high resolution, 8k',
      'TOK person premium casual professional, designer wear, sophisticated look, studio lighting, detailed, sharp focus'
    ]
  },
]

// Helper functions
export const getStylesByCategory = (category: string): StyleDefinition[] => {
  return STYLE_LIBRARY.filter(style => style.category === category)
}

export const getStylesByTier = (tier: 'starter' | 'pro'): StyleDefinition[] => {
  return STYLE_LIBRARY.filter(style => style.tier === tier || style.tier === 'starter')
}

export const getPopularStyles = (): StyleDefinition[] => {
  return STYLE_LIBRARY.filter(style => style.popular)
}

export const getStyleById = (id: string): StyleDefinition | undefined => {
  return STYLE_LIBRARY.find(style => style.id === id)
}

export const getTotalStyleCount = (): number => {
  return STYLE_LIBRARY.length
}

export const getCategoryCount = (): number => {
  return Object.keys(STYLE_CATEGORIES).length
}
