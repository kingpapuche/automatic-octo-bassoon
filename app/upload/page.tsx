'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

// Types voor persoonlijke kenmerken
interface UserCharacteristics {
  full_name: string
  gender: 'male' | 'female' | 'non-binary' | ''
  ethnicity: string
  eye_color: string
  hair_color: string
  is_bald: boolean
  has_glasses: boolean
  use_cases: string[]
}

// Opties voor dropdowns (gebaseerd op BetterPic + extras)
const ETHNICITY_OPTIONS = [
  { value: 'caucasian', label: 'Caucasian' },
  { value: 'hispanic', label: 'Hispanic' },
  { value: 'black', label: 'Black' },
  { value: 'asian', label: 'Asian' },
  { value: 'indian', label: 'Indian' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'african', label: 'African' },
  { value: 'other', label: 'Other' },
]

const EYE_COLOR_OPTIONS = [
  { value: 'brown', label: 'Brown', color: '#8B4513' },
  { value: 'blue', label: 'Blue', color: '#4169E1' },
  { value: 'amber', label: 'Amber', color: '#FFBF00' },
  { value: 'green', label: 'Green', color: '#228B22' },
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'honey', label: 'Honey', color: '#EB9605' },
  { value: 'gray', label: 'Gray', color: '#808080' },
]

const HAIR_COLOR_OPTIONS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'brown', label: 'Brown', color: '#8B4513' },
  { value: 'blonde', label: 'Blonde', color: '#F4D03F' },
  { value: 'red', label: 'Red', color: '#B7410E' },
  { value: 'gray', label: 'Gray', color: '#808080' },
  { value: 'white', label: 'White', color: '#F5F5F5' },
]

const USE_CASE_OPTIONS = [
  { value: 'website', label: 'Website Team/About Us Section' },
  { value: 'social-media', label: 'Social Media Profile Picture' },
  { value: 'cv', label: 'CV/Resume' },
  { value: 'dating', label: 'Dating Profile' },
  { value: 'portfolio', label: 'Portfolio for Actors, Realtors, etc' },
  { value: 'business-cards', label: 'Business Cards & Email Signatures' },
  { value: 'online-platforms', label: 'Online Platforms (Upwork, Slack, Teams)' },
  { value: 'other', label: 'Other' },
]

export default function UploadPage() {
  const router = useRouter()
  
  const [user, setUser] = useState<{ id: string; email: string; credits: number } | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [training, setTraining] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  
  // Stap 1 of 2 (1 = kenmerken invullen, 2 = foto's uploaden)
  const [step, setStep] = useState(1)
  
  // Persoonlijke kenmerken state
  const [characteristics, setCharacteristics] = useState<UserCharacteristics>({
    full_name: '',
    gender: '',
    ethnicity: '',
    eye_color: '',
    hair_color: '',
    is_bald: false,
    has_glasses: false,
    use_cases: [],
  })

  // Get current user
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/login')
        return
      }

      // Get user data from database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userData) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          credits: userData.credits || 0,
        })
        
        // Als gebruiker al kenmerken heeft ingevuld, laad deze
        if (userData.full_name) {
          setCharacteristics({
            full_name: userData.full_name || '',
            gender: userData.gender || '',
            ethnicity: userData.ethnicity || '',
            eye_color: userData.eye_color || '',
            hair_color: userData.hair_color || '',
            is_bald: userData.is_bald || false,
            has_glasses: userData.has_glasses || false,
            use_cases: userData.use_cases || [],
          })
        }
      }
    }
    getUser()
  }, [router])

  // Update een enkel kenmerk
  const updateCharacteristic = (key: keyof UserCharacteristics, value: any) => {
    setCharacteristics(prev => ({ ...prev, [key]: value }))
    
    // Als "kaal" wordt aangevinkt, reset haarkleur
    if (key === 'is_bald' && value === true) {
      setCharacteristics(prev => ({ ...prev, hair_color: '' }))
    }
  }

  // Toggle use case (max 3)
  const toggleUseCase = (value: string) => {
    setCharacteristics(prev => {
      const current = prev.use_cases
      if (current.includes(value)) {
        return { ...prev, use_cases: current.filter(v => v !== value) }
      } else if (current.length < 3) {
        return { ...prev, use_cases: [...current, value] }
      }
      return prev // Max 3 bereikt
    })
  }

  // Valideer stap 1 (kenmerken)
  const isStep1Valid = () => {
    return (
      characteristics.full_name.trim() !== '' &&
      characteristics.gender !== '' &&
      characteristics.ethnicity !== '' &&
      characteristics.eye_color !== '' &&
      (characteristics.is_bald || characteristics.hair_color !== '')
    )
  }

  // Ga naar stap 2 en sla kenmerken op
  const handleStep1Submit = async () => {
    if (!isStep1Valid() || !user) return
    
    setError('')
    
    try {
      // Sla kenmerken op in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: characteristics.full_name,
          gender: characteristics.gender,
          ethnicity: characteristics.ethnicity,
          eye_color: characteristics.eye_color,
          hair_color: characteristics.is_bald ? null : characteristics.hair_color,
          is_bald: characteristics.is_bald,
          has_glasses: characteristics.has_glasses,
          use_cases: characteristics.use_cases,
        })
        .eq('id', user.id)
      
      if (updateError) throw updateError
      
      setStep(2)
    } catch (err) {
      console.error('Error saving characteristics:', err)
      setError('Failed to save your information. Please try again.')
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('')

    if (photos.length + acceptedFiles.length > 15) {
      setError('Maximum 15 photos allowed')
      return
    }

    const validFiles = acceptedFiles.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isUnder10MB = file.size < 10 * 1024 * 1024
      return isImage && isUnder10MB
    })

    if (validFiles.length !== acceptedFiles.length) {
      setError('Some files were rejected. Only images under 10MB are allowed.')
    }

    const existingFiles = new Set(photos.map(p => `${p.name}-${p.size}`))
    const newFiles: File[] = []

    validFiles.forEach(file => {
      const fileKey = `${file.name}-${file.size}`
      if (!existingFiles.has(fileKey)) {
        newFiles.push(file)
        existingFiles.add(fileKey)
      }
    })

    if (newFiles.length > 0) {
      setPhotos(prev => [...prev, ...newFiles])
    }
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  })

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (photos.length < 8) {
      setError('Please upload at least 8 photos')
      return
    }

    if (user.credits < 1) {
      setError('You need credits to train a model. Please buy credits first.')
      return
    }

    setUploading(true)
    setError('')
    setStatus('Uploading photos...')

    try {
      // Step 1: Upload photos
      const uploadFormData = new FormData()
      uploadFormData.append('userId', user.id)

      photos.forEach((photo) => {
        uploadFormData.append('photos', photo)
      })

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok || uploadData.error) {
        throw new Error(uploadData.error || 'Failed to upload photos')
      }

      console.log('✅ Photos uploaded:', uploadData.photoCount)
      setStatus('Photos uploaded! Starting AI training...')
      setUploading(false)
      setTraining(true)

      // Step 2: Start training (met kenmerken)
      const trainResponse = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          photoUrls: uploadData.photoUrls,
          // Stuur kenmerken mee voor betere training
          characteristics: characteristics,
        }),
      })

      const trainData = await trainResponse.json()

      if (!trainResponse.ok || trainData.error) {
        throw new Error(trainData.error || 'Failed to start training')
      }

      console.log('✅ Training started:', trainData.trainingId)
      setStatus('Training started! This takes about 15-20 minutes.')

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard?training=started')
      }, 2000)

    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false)
      setTraining(false)
      setStatus('')
    }
  }

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <nav className="border-b border-[#334155] bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center text-white text-2xl">
              ✨
            </div>
            <span className="font-serif text-2xl font-semibold text-white">
              BestAIHeadshot
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-full px-4 py-2">
              <span className="text-[#7D6FB8] font-bold">✨</span>
              <span className="text-white font-semibold">{user.credits} Credits</span>
            </div>
            <Link href="/dashboard" className="text-[#94a3b8] hover:text-white font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-8 pt-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#7D6FB8]' : 'text-[#475569]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-[#7D6FB8] text-white' : 'bg-[#334155] text-[#94a3b8]'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="font-medium">Your Details</span>
          </div>
          
          <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-[#7D6FB8]' : 'bg-[#334155]'}`} />
          
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#7D6FB8]' : 'text-[#475569]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-[#7D6FB8] text-white' : 'bg-[#334155] text-[#94a3b8]'
            }`}>
              2
            </div>
            <span className="font-medium">Upload Photos</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-16">
        
        {/* ==================== STEP 1: Personal Details ==================== */}
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Tell Us About Yourself</h1>
              <p className="text-[#94a3b8] text-lg">
                This helps our AI create headshots that actually look like you.
              </p>
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-10 border border-[#334155] mb-8">
              
              {/* Full Name */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Full Name</label>
                <input
                  type="text"
                  value={characteristics.full_name}
                  onChange={(e) => updateCharacteristic('full_name', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#7D6FB8] transition"
                />
              </div>

              {/* Gender */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Gender</label>
                <div className="flex gap-3">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'non-binary', label: 'Non-binary' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateCharacteristic('gender', option.value)}
                      className={`flex-1 py-3 px-6 rounded-xl font-medium transition ${
                        characteristics.gender === option.value
                          ? 'bg-[#7D6FB8] text-white'
                          : 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:border-[#7D6FB8]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ethnicity */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Ethnicity</label>
                <select
                  value={characteristics.ethnicity}
                  onChange={(e) => updateCharacteristic('ethnicity', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7D6FB8] transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your ethnicity</option>
                  {ETHNICITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Eye Color */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Eye Color</label>
                <div className="flex flex-wrap gap-3">
                  {EYE_COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateCharacteristic('eye_color', option.value)}
                      className={`flex items-center gap-2 py-2 px-4 rounded-xl transition ${
                        characteristics.eye_color === option.value
                          ? 'bg-[#7D6FB8]/20 border-2 border-[#7D6FB8]'
                          : 'bg-[#0f172a] border border-[#334155] hover:border-[#7D6FB8]'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className={characteristics.eye_color === option.value ? 'text-white' : 'text-[#94a3b8]'}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bald Checkbox */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div 
                    onClick={() => updateCharacteristic('is_bald', !characteristics.is_bald)}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                      characteristics.is_bald 
                        ? 'bg-[#7D6FB8] border-[#7D6FB8]' 
                        : 'border-[#475569] hover:border-[#7D6FB8]'
                    }`}
                  >
                    {characteristics.is_bald && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="text-white font-medium">I am bald / have very short hair</span>
                </label>
              </div>

              {/* Hair Color (alleen tonen als niet kaal) */}
              {!characteristics.is_bald && (
                <div className="mb-8">
                  <label className="block text-white font-semibold mb-3">Hair Color</label>
                  <div className="flex flex-wrap gap-3">
                    {HAIR_COLOR_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateCharacteristic('hair_color', option.value)}
                        className={`flex items-center gap-2 py-2 px-4 rounded-xl transition ${
                          characteristics.hair_color === option.value
                            ? 'bg-[#7D6FB8]/20 border-2 border-[#7D6FB8]'
                            : 'bg-[#0f172a] border border-[#334155] hover:border-[#7D6FB8]'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: option.color }}
                        />
                        <span className={characteristics.hair_color === option.value ? 'text-white' : 'text-[#94a3b8]'}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glasses Checkbox */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div 
                    onClick={() => updateCharacteristic('has_glasses', !characteristics.has_glasses)}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                      characteristics.has_glasses 
                        ? 'bg-[#7D6FB8] border-[#7D6FB8]' 
                        : 'border-[#475569] hover:border-[#7D6FB8]'
                    }`}
                  >
                    {characteristics.has_glasses && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="text-white font-medium">I wear glasses</span>
                </label>
              </div>

              {/* Use Cases (optioneel) */}
              <div className="mb-4">
                <label className="block text-white font-semibold mb-1">What will you use these headshots for?</label>
                <p className="text-[#64748b] text-sm mb-3">Optional - Select up to 3</p>
                <div className="flex flex-wrap gap-2">
                  {USE_CASE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleUseCase(option.value)}
                      disabled={!characteristics.use_cases.includes(option.value) && characteristics.use_cases.length >= 3}
                      className={`py-2 px-4 rounded-xl text-sm transition ${
                        characteristics.use_cases.includes(option.value)
                          ? 'bg-[#7D6FB8] text-white'
                          : 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:border-[#7D6FB8] disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 rounded-xl p-4 text-[#FF6B4A] flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleStep1Submit}
              disabled={!isStep1Valid()}
              className="w-full bg-[#FF6B4A] hover:bg-[#FF5230] disabled:bg-[#334155] disabled:cursor-not-allowed text-white py-5 rounded-full text-xl font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {isStep1Valid() ? 'Continue to Photo Upload →' : 'Please fill in all required fields'}
            </button>
          </>
        )}

        {/* ==================== STEP 2: Photo Upload ==================== */}
        {step === 2 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Upload Your Photos</h1>
              <p className="text-[#94a3b8] text-lg">
                Upload 8-15 photos of yourself. Our AI will learn your face and create professional headshots.
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="text-[#94a3b8] hover:text-white mb-6 flex items-center gap-2"
            >
              ← Back to edit your details
            </button>

            {/* Summary of characteristics */}
            <div className="bg-[#334155]/30 rounded-2xl p-4 mb-8 flex flex-wrap gap-3">
              <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm">
                {characteristics.full_name}
              </span>
              <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm capitalize">
                {characteristics.gender}
              </span>
              <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm capitalize">
                {characteristics.ethnicity}
              </span>
              <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm capitalize">
                {characteristics.eye_color} eyes
              </span>
              {characteristics.is_bald ? (
                <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm">Bald</span>
              ) : (
                <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm capitalize">
                  {characteristics.hair_color} hair
                </span>
              )}
              {characteristics.has_glasses && (
                <span className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-3 py-1 rounded-full text-sm">Glasses</span>
              )}
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-10 border border-[#334155] mb-8">
              
              {/* ========== VIOLET PHOTO TIPS BANNER ========== */}
              <div className="bg-gradient-to-r from-[#5B4E9D]/15 to-[#7D6FB8]/15 border border-[#7D6FB8]/30 rounded-2xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💡</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">Tips for the best results</h3>
                    <ul className="text-[#94a3b8] text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#7D6FB8] mt-0.5">•</span>
                        <span>Include <strong className="text-white">3-4 smiling photos</strong> and <strong className="text-white">3-4 serious/neutral photos</strong> so we can generate both expressions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7D6FB8] mt-0.5">•</span>
                        <span>Add <strong className="text-white">different angles</strong> — front-facing, three-quarter, and side profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7D6FB8] mt-0.5">•</span>
                        <span>Use <strong className="text-white">good lighting</strong> — natural daylight works best, avoid heavy filters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7D6FB8] mt-0.5">•</span>
                        <span>Avoid sunglasses, hats, or anything covering your face</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-[#5B4E9D] bg-[#5B4E9D]/10'
                    : 'border-[#475569] hover:border-[#7D6FB8] hover:bg-[#334155]/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">📸</div>
                {isDragActive ? (
                  <p className="text-xl text-[#7D6FB8] font-semibold">Drop your photos here...</p>
                ) : (
                  <div>
                    <p className="text-xl text-white font-semibold mb-2">
                      Drag &amp; drop photos here
                    </p>
                    <p className="text-[#94a3b8] mb-4">or click to browse</p>
                    <p className="text-sm text-[#64748b]">
                      8-15 photos • JPG, PNG • Max 10MB each
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 rounded-xl p-4 text-[#FF6B4A] flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold mb-1">Error:</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {status && (
                <div className="mt-6 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl p-4 text-[#0D9488] flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <p className="font-semibold">{status}</p>
                  </div>
                </div>
              )}

              {/* Photo Preview Grid */}
              {photos.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-white">
                      {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
                      {photos.length < 8 && (
                        <span className="text-[#FF6B4A] ml-2">
                          ({8 - photos.length} more needed)
                        </span>
                      )}
                      {photos.length >= 8 && (
                        <span className="text-[#0D9488] ml-2">✓ Ready to train!</span>
                      )}
                    </h4>
                    <button
                      onClick={() => setPhotos([])}
                      className="text-sm text-[#94a3b8] hover:text-[#FF6B4A] font-medium transition"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-xl border-2 border-[#334155] group-hover:border-[#7D6FB8] transition"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-[#FF6B4A] hover:bg-[#FF5230] text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition font-bold shadow-lg"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start Training Button */}
            <button
              onClick={handleSubmit}
              disabled={uploading || training || photos.length < 8}
              className="w-full bg-[#FF6B4A] hover:bg-[#FF5230] disabled:bg-[#334155] disabled:cursor-not-allowed text-white py-5 rounded-full text-xl font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {uploading ? (
                'Uploading photos...'
              ) : training ? (
                'Starting AI training...'
              ) : photos.length < 8 ? (
                `Upload ${8 - photos.length} more photo${8 - photos.length !== 1 ? 's' : ''} to continue`
              ) : (
                '🚀 Start AI Training'
              )}
            </button>

            {/* Info */}
            <div className="text-center mt-6 text-[#94a3b8] text-sm">
              Training takes about 15-20 minutes. We&apos;ll notify you when it&apos;s ready!
            </div>
          </>
        )}
      </div>
    </div>
  )
}