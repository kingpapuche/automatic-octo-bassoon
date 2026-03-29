'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

interface StyleOption {
  id: string
  label: string
  description: string
  icon: string
}

interface StyleCategory {
  id: string
  name: string
  icon: string
  gender: 'male' | 'female' | 'both'
  styles: StyleOption[]
}

const STYLE_CATEGORIES: StyleCategory[] = [
  // ===== MANNENSTIJLEN =====
  {
    id: 'formal',
    name: 'Formal / Corporate',
    icon: '👔',
    gender: 'male',
    styles: [
      { id: 'corporate-classic', label: 'Corporate Classic', description: 'Navy suit, gray studio', icon: '🏢' },
      { id: 'executive-navy', label: 'Executive Navy', description: 'Arms crossed, city skyline', icon: '🌆' },
      { id: 'ceo-black', label: 'CEO Black', description: 'Black suit, white studio', icon: '⬛' },
      { id: 'boardroom-gray', label: 'Boardroom Gray', description: 'Gray suit, office windows', icon: '🪟' },
      { id: 'power-suit', label: 'Power Suit', description: 'Navy suit, library', icon: '📚' },
      { id: 'light-blue-exec', label: 'Light Blue Exec', description: 'Blue blazer, tablet', icon: '📱' },
      { id: 'pinstripe-pro', label: 'Pinstripe Pro', description: 'Pinstripe suit, gray bg', icon: '📐' },
      { id: 'three-piece', label: 'Three Piece', description: 'Three piece suit, dramatic', icon: '🎩' },
      { id: 'wall-street', label: 'Wall Street', description: 'Dark suit, red tie', icon: '📈' },
      { id: 'corner-office', label: 'Corner Office', description: 'Sitting at desk, city view', icon: '🏙️' },
      { id: 'conference-ready', label: 'Conference Ready', description: 'Navy blazer, standing', icon: '🎤' },
      { id: 'investor-meeting', label: 'Investor Meeting', description: 'Charcoal suit, white bg', icon: '🤝' },
      { id: 'formal-black', label: 'Formal Black', description: 'Black suit, dark studio', icon: '🖤' },
    ],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    icon: '🧥',
    gender: 'male',
    styles: [
      { id: 'teal-blazer', label: 'Teal Blazer', description: 'Teal blazer, white tee', icon: '💎' },
      { id: 'beige-elegance', label: 'Beige Elegance', description: 'Beige suit, watch', icon: '⌚' },
      { id: 'gray-blazer-blue', label: 'Gray Blazer', description: 'Gray blazer, blue bg', icon: '🔵' },
      { id: 'open-collar-navy', label: 'Open Collar', description: 'Navy blazer, open collar', icon: '👕' },
      { id: 'blazer-white-tee', label: 'Blazer + White Tee', description: 'Black blazer, city lights', icon: '✨' },
      { id: 'v-neck-sweater', label: 'V-Neck Sweater', description: 'Blue sweater, white bg', icon: '🧶' },
      { id: 'office-casual-plants', label: 'Office Casual', description: 'Oxford shirt, plants', icon: '🌿' },
      { id: 'weekend-blazer', label: 'Weekend Blazer', description: 'Tan blazer, café', icon: '☕' },
      { id: 'creative-director', label: 'Creative Director', description: 'Black blazer + turtleneck', icon: '🎨' },
      { id: 'startup-ceo', label: 'Startup CEO', description: 'Navy blazer, coworking', icon: '🚀' },
      { id: 'tech-lead', label: 'Tech Lead', description: 'Gray sport coat', icon: '💻' },
      { id: 'consultant-look', label: 'Consultant', description: 'Light gray suit, no tie', icon: '📋' },
    ],
  },
  {
    id: 'casual',
    name: 'Casual Professional',
    icon: '👕',
    gender: 'male',
    styles: [
      { id: 'white-tee-orange', label: 'White Tee Orange', description: 'White tee, orange bg', icon: '🟠' },
      { id: 'black-tee-urban', label: 'Black Tee Urban', description: 'Black tee, urban street', icon: '🏘️' },
      { id: 'navy-polo-clean', label: 'Navy Polo', description: 'Navy polo, white bg', icon: '🔷' },
      { id: 'gray-tee-crossed', label: 'Gray Tee Crossed', description: 'Gray tee, arms crossed', icon: '💪' },
      { id: 'white-tee-nature', label: 'White Tee Nature', description: 'White tee, green nature', icon: '🌳' },
      { id: 'plaid-casual', label: 'Plaid Casual', description: 'Plaid shirt, studio', icon: '🪵' },
      { id: 'henley-relaxed', label: 'Henley Relaxed', description: 'Henley, window light', icon: '🪟' },
      { id: 'denim-shirt', label: 'Denim Shirt', description: 'Chambray, white bg', icon: '👖' },
      { id: 'knit-sweater', label: 'Knit Sweater', description: 'Chunky knit, cozy', icon: '🧣' },
      { id: 'linen-summer', label: 'Linen Summer', description: 'White linen, outdoor', icon: '☀️' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative / Edgy',
    icon: '🎸',
    gender: 'male',
    styles: [
      { id: 'leather-jacket-city', label: 'Leather Jacket', description: 'Leather jacket, bokeh', icon: '🧥' },
      { id: 'night-life', label: 'Night Life', description: 'Black outfit, nightlife', icon: '🌃' },
      { id: 'turtleneck-modern', label: 'Turtleneck Modern', description: 'Gray turtleneck', icon: '🤍' },
      { id: 'black-turtleneck-drama', label: 'Black Turtleneck', description: 'Dramatic side light', icon: '🖤' },
      { id: 'tech-founder', label: 'Tech Founder', description: 'Gray tee, tech office', icon: '⚡' },
      { id: 'all-black-minimal', label: 'All Black', description: 'All black, dramatic', icon: '🌑' },
      { id: 'creative-colorful', label: 'Creative Colorful', description: 'Colorful shirt', icon: '🌈' },
      { id: 'rebel-professional', label: 'Rebel Pro', description: 'Blazer + band tee', icon: '🎵' },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor / Natural',
    icon: '🌿',
    gender: 'male',
    styles: [
      { id: 'park-portrait', label: 'Park Portrait', description: 'Green park, daylight', icon: '🌲' },
      { id: 'rooftop-view', label: 'Rooftop View', description: 'City panorama, golden hr', icon: '🏙️' },
      { id: 'golden-hour', label: 'Golden Hour', description: 'White shirt, warm tones', icon: '🌅' },
      { id: 'nature-fresh', label: 'Nature Fresh', description: 'Trees, natural light', icon: '🍃' },
      { id: 'city-walk', label: 'City Walk', description: 'Walking, city street', icon: '🚶' },
      { id: 'coffee-shop', label: 'Coffee Shop', description: 'Sitting, café', icon: '☕' },
      { id: 'beach-professional', label: 'Beach Pro', description: 'Linen shirt, coastal', icon: '🏖️' },
      { id: 'architectural', label: 'Architectural', description: 'Modern architecture', icon: '🏛️' },
    ],
  },
  {
    id: 'poses',
    name: 'Specialty Poses',
    icon: '🧍',
    gender: 'male',
    styles: [
      { id: 'arms-crossed-power', label: 'Arms Crossed', description: 'Power pose, dark suit', icon: '💪' },
      { id: 'holding-tablet', label: 'Holding Tablet', description: 'Tablet, office', icon: '📱' },
      { id: 'sitting-confident', label: 'Sitting Confident', description: 'Chair, legs crossed', icon: '🪑' },
      { id: 'leaning-casual', label: 'Leaning Casual', description: 'Against wall', icon: '🚪' },
      { id: 'hands-in-pockets', label: 'Hands in Pockets', description: 'Blazer + jeans', icon: '🤙' },
      { id: 'thoughtful-pose', label: 'Thoughtful', description: 'Hand near chin', icon: '🤔' },
      { id: 'looking-up', label: 'Looking Up', description: 'From below', icon: '⬆️' },
    ],
  },
  {
    id: 'colored',
    name: 'Colored Backgrounds',
    icon: '🎨',
    gender: 'male',
    styles: [
      { id: 'blue-studio', label: 'Blue Studio', description: 'Business, blue bg', icon: '🔵' },
      { id: 'green-studio', label: 'Green Studio', description: 'Smart casual, green', icon: '🟢' },
      { id: 'purple-creative', label: 'Purple Creative', description: 'Dark outfit, purple', icon: '🟣' },
      { id: 'yellow-energetic', label: 'Yellow Energetic', description: 'Casual, yellow', icon: '🟡' },
      { id: 'red-bold', label: 'Red Bold', description: 'Professional, red', icon: '🔴' },
      { id: 'gradient-modern', label: 'Gradient Modern', description: 'Blue to purple', icon: '🌀' },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    icon: '🧍',
    gender: 'male',
    styles: [
      { id: 'fullbody-navy-suit', label: 'Full Body Navy Suit', description: 'Head to toe, navy suit', icon: '👔' },
      { id: 'fullbody-black-outfit', label: 'Full Body Black', description: 'All black, full length', icon: '🖤' },
      { id: 'fullbody-casual-white', label: 'Full Body Casual', description: 'White tee, jeans, studio', icon: '👕' },
      { id: 'fullbody-blazer-jeans', label: 'Blazer + Jeans', description: 'Blazer, jeans, modern interior', icon: '🧥' },
      { id: 'fullbody-city-street', label: 'City Street', description: 'Urban, smart casual, full body', icon: '🏙️' },
      { id: 'fullbody-outdoor', label: 'Outdoor Full Body', description: 'Park, casual, full length', icon: '🌿' },
    ],
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    icon: '🕶️',
    gender: 'male',
    styles: [
      { id: 'sunglasses-city', label: 'Sunglasses City', description: 'Dark blazer, city street', icon: '🏙️' },
      { id: 'sunglasses-outdoor', label: 'Sunglasses Outdoor', description: 'Casual jacket, outdoor', icon: '☀️' },
      { id: 'sunglasses-black-suit', label: 'Sunglasses Black Suit', description: 'Black suit, mysterious', icon: '🖤' },
      { id: 'sunglasses-casual', label: 'Sunglasses Casual', description: 'White tee, outdoor', icon: '😎' },
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury / Watch',
    icon: '⌚',
    gender: 'male',
    styles: [
      { id: 'watch-showcase', label: 'Watch Showcase', description: 'Luxury watch, beige blazer', icon: '✨' },
      { id: 'watch-luxury-outdoor', label: 'Watch Outdoor', description: 'Watch visible, nature bg', icon: '🌿' },
      { id: 'watch-dark-elegant', label: 'Watch Dark Elegant', description: 'Watch, dark suit, dramatic', icon: '🖤' },
    ],
  },
  {
    id: 'bold-colors',
    name: 'Bold Colored Suits',
    icon: '🌈',
    gender: 'male',
    styles: [
      { id: 'teal-suit', label: 'Teal Suit', description: 'Teal suit, arms crossed', icon: '💎' },
      { id: 'green-suit', label: 'Green Suit', description: 'Green blazer, white bg', icon: '🟢' },
      { id: 'pink-blazer', label: 'Pink Blazer', description: 'Pink blazer, modern', icon: '🌸' },
      { id: 'orange-suit', label: 'Orange Suit', description: 'Orange blazer, vibrant', icon: '🟠' },
      { id: 'brown-suit-elegant', label: 'Brown Suit', description: 'Warm brown, dark bg', icon: '🤎' },
    ],
  },
  {
    id: 'blacktie',
    name: 'Black Tie / Tuxedo',
    icon: '🎩',
    gender: 'male',
    styles: [
      { id: 'tuxedo-classic', label: 'Classic Tuxedo', description: 'Black tux, bow tie, gala', icon: '🥂' },
      { id: 'tuxedo-modern', label: 'Modern Tuxedo', description: 'Slim tux, open collar', icon: '✨' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle / Motor',
    icon: '🏍️',
    gender: 'male',
    styles: [
      { id: 'moto-leather', label: 'Moto Leather', description: 'Brown leather jacket, moto', icon: '🤎' },
      { id: 'moto-city', label: 'Moto City', description: 'Black leather, city street', icon: '🖤' },
    ],
  },
  {
    id: 'sitting-casual',
    name: 'Sitting Casual',
    icon: '🪑',
    gender: 'male',
    styles: [
      { id: 'sitting-ground', label: 'Sitting on Ground', description: 'Casual, knees up, studio', icon: '🧘' },
      { id: 'sitting-steps', label: 'Sitting on Steps', description: 'Outdoor steps, urban', icon: '🏙️' },
      { id: 'sitting-chair-casual', label: 'Chair Sideways', description: 'Sideways in chair, relaxed', icon: '🪑' },
    ],
  },
  {
    id: 'closeup',
    name: 'Close-Up Headshots',
    icon: '🎯',
    gender: 'male',
    styles: [
      { id: 'closeup-dramatic', label: 'Dramatic Close-Up', description: 'Cinematic, dark bg', icon: '🎬' },
      { id: 'closeup-warm', label: 'Warm Close-Up', description: 'Warm light, genuine smile', icon: '☀️' },
      { id: 'closeup-outdoor', label: 'Outdoor Close-Up', description: 'Natural light, green bg', icon: '🌿' },
    ],
  },

  // ===== VROUWENSTIJLEN =====
  {
    id: 'women-corporate',
    name: 'Women — Corporate',
    icon: '💼',
    gender: 'female',
    styles: [
      { id: 'w-black-blazer-city', label: 'Black Blazer City', description: 'Black blazer, city window', icon: '🏙️' },
      { id: 'w-navy-blazer-arms', label: 'Navy Blazer', description: 'Navy blazer, arms crossed', icon: '💪' },
      { id: 'w-white-shirt-pro', label: 'White Shirt Pro', description: 'White blouse, neutral bg', icon: '🤍' },
      { id: 'w-light-blue-shirt', label: 'Light Blue Shirt', description: 'Light blue blouse, studio', icon: '💙' },
      { id: 'w-black-turtleneck-pro', label: 'Black Turtleneck', description: 'Black turtleneck, dark bg', icon: '🖤' },
      { id: 'w-teal-turtleneck', label: 'Teal Turtleneck', description: 'Teal turtleneck, office', icon: '💚' },
      { id: 'w-cream-blazer', label: 'Cream Blazer', description: 'Cream blazer, arms crossed', icon: '🤍' },
      { id: 'w-dark-blazer-table', label: 'Dark Blazer Table', description: 'Dark blazer, sitting', icon: '🪑' },
      { id: 'w-white-blazer-arms', label: 'White Blazer', description: 'White blazer, arms crossed', icon: '🤍' },
      { id: 'w-black-outfit-minimal', label: 'All Black Minimal', description: 'Black outfit, white studio', icon: '🖤' },
    ],
  },
  {
    id: 'women-colored-suits',
    name: 'Women — Gekleurde Suits',
    icon: '🌈',
    gender: 'female',
    styles: [
      { id: 'w-red-suit', label: 'Red Power Suit', description: 'Red blazer suit, laptop', icon: '🔴' },
      { id: 'w-pink-suit', label: 'Pink Suit', description: 'Pink suit, modern office', icon: '🌸' },
      { id: 'w-blue-suit', label: 'Blue Suit', description: 'Light blue suit, dark bg', icon: '💙' },
      { id: 'w-green-suit', label: 'Green Suit', description: 'Green suit, green bg', icon: '💚' },
      { id: 'w-orange-suit', label: 'Orange Suit', description: 'Orange blazer, purple bg', icon: '🟠' },
      { id: 'w-camel-blazer', label: 'Camel Blazer', description: 'Camel blazer, neutral', icon: '🤎' },
      { id: 'w-green-dark-blazer', label: 'Forest Green Blazer', description: 'Dark green blazer, studio', icon: '🌲' },
      { id: 'w-brown-blazer', label: 'Brown Blazer', description: 'Brown blazer, warm bg', icon: '🤎' },
    ],
  },
  {
    id: 'women-smart-casual',
    name: 'Women — Smart Casual',
    icon: '🧥',
    gender: 'female',
    styles: [
      { id: 'w-blazer-jeans-street', label: 'Blazer + Jeans Street', description: 'Blazer, jeans, city street', icon: '🏙️' },
      { id: 'w-black-blazer-outdoor', label: 'Black Blazer Outdoor', description: 'Black blazer, outdoor', icon: '🌿' },
      { id: 'w-beige-blazer-casual', label: 'Beige Blazer Casual', description: 'Beige blazer, city walk', icon: '☕' },
      { id: 'w-leather-jacket', label: 'Leather Jacket', description: 'Black leather jacket, street', icon: '🖤' },
      { id: 'w-leather-jacket-city', label: 'Leather Jacket City', description: 'Leather jacket, night city', icon: '🌃' },
      { id: 'w-denim-jacket', label: 'Denim Jacket', description: 'Denim jacket, white tee', icon: '👖' },
      { id: 'w-navy-turtleneck-street', label: 'Navy Turtleneck Street', description: 'Navy turtleneck, city street', icon: '🔵' },
      { id: 'w-dark-blazer-restaurant', label: 'Dark Blazer Restaurant', description: 'Elegant, warm restaurant', icon: '🍷' },
    ],
  },
  {
    id: 'women-casual',
    name: 'Women — Casual',
    icon: '👕',
    gender: 'female',
    styles: [
      { id: 'w-white-tee-casual', label: 'White Tee Casual', description: 'White tee, jeans, studio', icon: '🤍' },
      { id: 'w-red-tee', label: 'Red Tee', description: 'Red t-shirt, beige pants', icon: '🔴' },
      { id: 'w-pink-tee-street', label: 'Pink Tee Street', description: 'Pink tee, city street', icon: '🌸' },
      { id: 'w-purple-tee', label: 'Purple Tee', description: 'Purple tee, pink bg', icon: '🟣' },
      { id: 'w-orange-polo', label: 'Orange Polo', description: 'Orange polo, outdoor', icon: '🟠' },
      { id: 'w-yellow-shirt', label: 'Yellow Shirt', description: 'Yellow blouse, casual', icon: '🟡' },
      { id: 'w-cream-tee-sitting', label: 'Cream Tee Sitting', description: 'Cream tee, sitting, studio', icon: '🪑' },
      { id: 'w-brown-longsleeve', label: 'Brown Longsleeve', description: 'Brown longsleeve, arms crossed', icon: '🤎' },
    ],
  },
  {
    id: 'women-outdoor',
    name: 'Women — Outdoor / Natural',
    icon: '🌿',
    gender: 'female',
    styles: [
      { id: 'w-outdoor-blazer-nature', label: 'Blazer Nature', description: 'Beige blazer, outdoor nature', icon: '🌲' },
      { id: 'w-outdoor-city-walk', label: 'City Walk', description: 'Casual outfit, city street', icon: '🚶‍♀️' },
      { id: 'w-outdoor-cafe', label: 'Café Outdoor', description: 'Smart casual, café terras', icon: '☕' },
      { id: 'w-golden-hour', label: 'Golden Hour', description: 'Warm tones, sunset light', icon: '🌅' },
      { id: 'w-park-portrait', label: 'Park Portrait', description: 'Natural light, green park', icon: '🌳' },
      { id: 'w-rooftop-city', label: 'Rooftop City', description: 'City panorama, evening', icon: '🏙️' },
      { id: 'w-desert-boho', label: 'Desert Boho', description: 'Rust dress, desert bg', icon: '🏜️' },
    ],
  },
  {
    id: 'women-dresses',
    name: 'Women — Jurken',
    icon: '👗',
    gender: 'female',
    styles: [
      { id: 'w-black-dress-casual', label: 'Black Dress Casual', description: 'Zwarte jurk, studio', icon: '🖤' },
      { id: 'w-black-maxi-dress', label: 'Black Maxi Dress', description: 'Lange zwarte jurk, elegant', icon: '🖤' },
      { id: 'w-black-slip-dress', label: 'Black Slip Dress', description: 'Zwarte slip jurk, minimal', icon: '✨' },
      { id: 'sheath-dress-navy', label: 'Navy Sheath Dress', description: 'Navy jurk, kantoor', icon: '🔵' },
      { id: 'sheath-dress-burgundy', label: 'Burgundy Dress', description: 'Bordeaux jurk, elegant', icon: '🍷' },
      { id: 'wrap-dress-emerald', label: 'Emerald Wrap Dress', description: 'Groene wikkel jurk', icon: '💚' },
      { id: 'w-brown-skirt-top', label: 'Brown Skirt + Top', description: 'Bruine rok met top', icon: '🤎' },
      { id: 'sheath-dress-with-blazer', label: 'Jurk + Blazer', description: 'Navy jurk met blazer', icon: '👔' },
    ],
  },
  {
    id: 'women-soft',
    name: 'Women — Soft & Warm',
    icon: '🧶',
    gender: 'female',
    styles: [
      { id: 'cardigan-professional', label: 'Cardigan Professional', description: 'Crème cardigan, warm', icon: '🤍' },
      { id: 'soft-knit-sage', label: 'Soft Knit Sage', description: 'Saliegroen trui, rustig', icon: '🌿' },
      { id: 'fine-knit-camel', label: 'Fine Knit Camel', description: 'Kameel coltrui, elegant', icon: '🤎' },
      { id: 'w-white-blouse-arms', label: 'White Blouse', description: 'Wit blouse, armen gekruist', icon: '🤍' },
      { id: 'silk-blouse-jewel', label: 'Silk Blouse Jewel', description: 'Zijden blouse, juweel kleur', icon: '💎' },
      { id: 'vneck-blouse-professional', label: 'V-Neck Blouse Teal', description: 'Teal v-hals blouse', icon: '💠' },
      { id: 'soft-blouse-outdoor', label: 'Soft Blouse Outdoor', description: 'Roze blouse, outdoor', icon: '🌸' },
    ],
  },
]

export default function CreateStylesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        const { data: userData } = await supabase
          .from('users')
          .select('id, credits, gender')
          .eq('id', session.user.id)
          .single()
        if (userData) {
          setUserCredits(userData.credits || 0)
          // Stel gender in op basis van gebruikersprofiel
          if (userData.gender === 'female') {
            setGender('female')
            setExpandedCategory('women-corporate')
          } else {
            setGender('male')
            setExpandedCategory('formal')
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  // Filter categorieën op gender
  const filteredCategories = STYLE_CATEGORIES.filter(c => c.gender === gender)

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    )
  }

  const selectAllInCategory = (categoryId: string) => {
    const category = STYLE_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return
    const ids = category.styles.map(s => s.id)
    const allSelected = ids.every(id => selectedStyles.includes(id))
    if (allSelected) {
      setSelectedStyles(prev => prev.filter(id => !ids.includes(id)))
    } else {
      setSelectedStyles(prev => [...new Set([...prev, ...ids])])
    }
  }

  const handleGenderSwitch = (newGender: 'male' | 'female') => {
    setGender(newGender)
    setSelectedStyles([]) // Reset selectie bij gender switch
    setExpandedCategory(newGender === 'female' ? 'women-corporate' : 'formal')
  }

  const handleContinue = () => {
    if (selectedStyles.length === 0) return
    sessionStorage.setItem('bestai_styleIds', JSON.stringify(selectedStyles))
    router.push('/create/generate')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const totalStyles = filteredCategories.reduce((acc, c) => acc + c.styles.length, 0)

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <CreateProgressBar currentStep={2} userCredits={userCredits} />

      <div className="pt-[140px] pb-[160px] max-w-[900px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Choose Your Styles</h1>
          <p className="text-gray-400 text-lg">Select the looks you want. Each style = 1 headshot = 1 credit.</p>
          <p className="text-gray-600 text-sm mt-2">{totalStyles} styles available</p>
        </div>

        {/* Gender filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex gap-2">
            <button
              onClick={() => handleGenderSwitch('male')}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2 ${
                gender === 'male'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👨 Man
            </button>
            <button
              onClick={() => handleGenderSwitch('female')}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2 ${
                gender === 'female'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👩 Woman
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategory === category.id
            const selectedCount = category.styles.filter(s => selectedStyles.includes(s.id)).length
            const allSelected = selectedCount === category.styles.length

            return (
              <div key={category.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-500 text-sm">{category.styles.length} styles</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedCount > 0 && (
                      <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {selectedCount} selected
                      </span>
                    )}
                    <span className={`text-gray-400 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => selectAllInCategory(category.id)}
                      className={`mb-3 text-sm font-medium px-4 py-1.5 rounded-lg transition ${
                        allSelected
                          ? 'bg-violet-600/20 text-violet-300 hover:bg-violet-600/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {allSelected ? '✓ Deselect All' : 'Select All'}
                    </button>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {category.styles.map((style) => {
                        const isSelected = selectedStyles.includes(style.id)
                        return (
                          <button
                            key={style.id}
                            onClick={() => toggleStyle(style.id)}
                            className={`relative flex flex-col items-center text-center py-4 px-3 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-violet-600/20 border-2 border-violet-500 shadow-lg shadow-violet-500/10'
                                : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <span className="text-2xl mb-2">{style.icon}</span>
                            <span className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {style.label}
                            </span>
                            <span className="text-gray-500 text-xs leading-tight">{style.description}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">{selectedStyles.length}</span>
            <span className="text-gray-400 ml-2">styles selected</span>
            <span className="text-gray-600 mx-2">•</span>
            <span className="text-violet-400 font-semibold">{selectedStyles.length} credits</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/create')}
              className="py-3 px-6 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedStyles.length === 0}
              className={`py-3 px-8 rounded-xl font-bold transition-all duration-300 ${
                selectedStyles.length > 0
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}