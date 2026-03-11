'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

// ─── OPTIONS ───────────────────────────────────────────────────────────────

const AGE_RANGE_OPTIONS = [
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-44', label: '35–44' },
  { id: '45-54', label: '45–54' },
  { id: '55-64', label: '55–64' },
  { id: '65+',   label: '65+' },
]

const ETHNICITY_OPTIONS = [
  { value: 'caucasian',  label: 'Caucasian' },
  { value: 'hispanic',   label: 'Hispanic' },
  { value: 'black',      label: 'Black' },
  { value: 'asian',      label: 'Asian' },
  { value: 'indian',     label: 'Indian' },
  { value: 'arabic',     label: 'Arabic' },
  { value: 'caribbean',  label: 'Caribbean' },
  { value: 'african',    label: 'African' },
  { value: 'other',      label: 'Other' },
]

const EYE_COLOR_OPTIONS = [
  { value: 'brown',  label: 'Brown',  color: '#8B4513' },
  { value: 'blue',   label: 'Blue',   color: '#4169E1' },
  { value: 'amber',  label: 'Amber',  color: '#FFBF00' },
  { value: 'green',  label: 'Green',  color: '#228B22' },
  { value: 'black',  label: 'Black',  color: '#1a1a1a' },
  { value: 'honey',  label: 'Honey',  color: '#EB9605' },
  { value: 'gray',   label: 'Gray',   color: '#808080' },
]

const HAIR_COLOR_OPTIONS = [
  { value: 'black',  label: 'Black',  color: '#1a1a1a' },
  { value: 'brown',  label: 'Brown',  color: '#8B4513' },
  { value: 'blonde', label: 'Blonde', color: '#F4D03F' },
  { value: 'red',    label: 'Red',    color: '#B7410E' },
  { value: 'gray',   label: 'Gray',   color: '#808080' },
  { value: 'white',  label: 'White',  color: '#E5E5E5' },
]

const USE_CASE_OPTIONS = [
  { value: 'website',        label: 'Website / About Us' },
  { value: 'social-media',   label: 'Social Media' },
  { value: 'cv',             label: 'CV / Resume' },
  { value: 'dating',         label: 'Dating Profile' },
  { value: 'portfolio',      label: 'Portfolio' },
  { value: 'business-cards', label: 'Business Cards' },
  { value: 'online-platforms', label: 'Online Platforms' },
  { value: 'other',          label: 'Other' },
]

// ─── TYPES ─────────────────────────────────────────────────────────────────

interface UserCharacteristics {
  full_name:    string
  gender:       'male' | 'female' | 'non-binary' | ''
  ethnicity:    string
  eye_color:    string
  hair_color:   string
  is_bald:      boolean
  has_glasses:  boolean
  use_cases:    string[]
  age_range:    string
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string; credits: number } | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [training, setTraining] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [step, setStep] = useState(1)
  const [allowPhotoUsage, setAllowPhotoUsage] = useState(true)

  const [characteristics, setCharacteristics] = useState<UserCharacteristics>({
    full_name: '', gender: '', ethnicity: '', eye_color: '',
    hair_color: '', is_bald: false, has_glasses: false,
    use_cases: [], age_range: '',
  })

  // ── Load user ─────────────────────────────────────────────────
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/login'); return }
      const { data: userData } = await supabase
        .from('users').select('*').eq('id', session.user.id).single()
      if (userData) {
        setUser({ id: session.user.id, email: session.user.email || '', credits: userData.credits || 0 })
        if (userData.full_name) {
          setCharacteristics({
            full_name:   userData.full_name   || '',
            gender:      userData.gender      || '',
            ethnicity:   userData.ethnicity   || '',
            eye_color:   userData.eye_color   || '',
            hair_color:  userData.hair_color  || '',
            is_bald:     userData.is_bald     || false,
            has_glasses: userData.has_glasses || false,
            use_cases:   userData.use_cases   || [],
            age_range:   userData.age_range   || '',
          })
        }
      }
    }
    getUser()
  }, [router])

  // ── Helpers ───────────────────────────────────────────────────
  const updateChar = (key: keyof UserCharacteristics, value: any) => {
    setCharacteristics(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'is_bald' && value === true) next.hair_color = ''
      return next
    })
  }

  const toggleUseCase = (value: string) => {
    setCharacteristics(prev => {
      const cur = prev.use_cases
      if (cur.includes(value)) return { ...prev, use_cases: cur.filter(v => v !== value) }
      if (cur.length >= 3) return prev
      return { ...prev, use_cases: [...cur, value] }
    })
  }

  const isStep1Valid = () =>
    characteristics.full_name.trim() !== '' &&
    characteristics.gender !== '' &&
    characteristics.ethnicity !== '' &&
    characteristics.eye_color !== '' &&
    characteristics.age_range !== '' &&
    (characteristics.is_bald || characteristics.hair_color !== '')

  // ── Step 1 submit ─────────────────────────────────────────────
  const handleStep1Submit = async () => {
    if (!isStep1Valid() || !user) return
    setError('')
    try {
      await supabase.from('users').update({
        full_name:    characteristics.full_name,
        gender:       characteristics.gender,
        ethnicity:    characteristics.ethnicity,
        eye_color:    characteristics.eye_color,
        hair_color:   characteristics.is_bald ? null : characteristics.hair_color,
        is_bald:      characteristics.is_bald,
        has_glasses:  characteristics.has_glasses,
        use_cases:    characteristics.use_cases,
        age_range:    characteristics.age_range,
        allow_photo_usage: allowPhotoUsage,
      }).eq('id', user.id)
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Failed to save your details. Please try again.')
    }
  }

  // ── Dropzone ──────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('')
    if (photos.length + acceptedFiles.length > 20) { setError('Maximum 20 photos allowed'); return }
    const validFiles = acceptedFiles.filter(f => f.type.startsWith('image/') && f.size < 10 * 1024 * 1024)
    if (validFiles.length !== acceptedFiles.length)
      setError('Some files were rejected. Only images under 10MB are allowed.')
    const existing = new Set(photos.map(p => `${p.name}-${p.size}`))
    const newFiles: File[] = []
    validFiles.forEach(file => {
      const key = `${file.name}-${file.size}`
      if (!existing.has(key)) { newFiles.push(file); existing.add(key) }
    })
    if (newFiles.length > 0) setPhotos(prev => [...prev, ...newFiles])
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  })

  const removePhoto = (index: number) => setPhotos(prev => prev.filter((_, i) => i !== index))

  // ── Final submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return }
    if (photos.length < 8) { setError('Please upload at least 8 photos'); return }
    if (user.credits < 1) { setError('You need credits to train a model.'); return }

    setUploading(true); setError(''); setStatus('Uploading photos...')
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('userId', user.id)
      photos.forEach(photo => uploadFormData.append('photos', photo))

      const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok || uploadData.error) throw new Error(uploadData.error || 'Failed to upload photos')

      setStatus('Photos uploaded! Starting AI training...')
      setUploading(false); setTraining(true)

      const trainResponse = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, photoUrls: uploadData.photoUrls }),
      })
      const trainData = await trainResponse.json()
      if (!trainResponse.ok || trainData.error) throw new Error(trainData.error || 'Failed to start training')

      setStatus('Training started! 🎉')
      setTimeout(() => router.push('/dashboard?training=started'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false); setTraining(false); setStatus('')
    }
  }

  // ── Loading screen ────────────────────────────────────────────
  if (!user) return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  )

  const photoCount = photos.length
  const isReady = photoCount >= 8

  // ── Shared pill style ─────────────────────────────────────────
  const pillBase = 'py-1.5 px-3 rounded-xl text-sm font-medium transition border cursor-pointer'
  const pillActive = 'bg-violet-600 border-violet-600 text-white'
  const pillInactive = 'bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/50'

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0f1a]">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/25">
              AI
            </div>
            <span className="font-semibold text-xl text-white tracking-tight">Nova Imago</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition font-medium text-sm">Dashboard</Link>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-violet-400 text-sm">✦</span>
              <span className="text-white font-semibold">{user.credits}</span>
              <span className="text-gray-400 text-sm">credits</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-[100px] pb-[60px] max-w-[700px] mx-auto px-6">

        {/* ── STEP INDICATOR ── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                  : step > s
                  ? 'bg-violet-600/40 text-violet-300'
                  : 'bg-white/5 text-gray-500'
              }`}>{step > s ? '✓' : s}</div>
              <span className={`text-sm font-medium ${step === s ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Your Details' : 'Upload Photos'}
              </span>
              {s < 2 && <div className={`w-8 h-px ${step > s ? 'bg-violet-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            STEP 1 — CHARACTERISTICS
        ════════════════════════════════════════════ */}
        {step === 1 && (
          <>
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Train Your AI Model</h1>
              <p className="text-gray-400 text-lg">Tell us a bit about yourself so your AI model gets it right.</p>
            </div>

            {/* NAME */}
            <div className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10 border border-violet-500/20 rounded-2xl p-6 mb-5">
              <label className="block text-white font-semibold mb-1">Who are these photos for? *</label>
              <p className="text-gray-500 text-sm mb-3">This name identifies your AI model — handy if you train multiple models.</p>
              <input
                type="text"
                value={characteristics.full_name}
                onChange={e => updateChar('full_name', e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* CHARACTERISTICS */}
            <div className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10 border border-violet-500/20 rounded-2xl p-6 mb-5 space-y-6">
              <h3 className="text-white font-semibold">About You <span className="text-gray-500 font-normal text-sm">(helps the AI get the details right)</span></h3>

              {/* Gender */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Gender *</label>
                <div className="flex flex-wrap gap-2">
                  {['male', 'female', 'non-binary'].map(g => (
                    <button key={g} onClick={() => updateChar('gender', g)}
                      className={`${pillBase} capitalize ${characteristics.gender === g ? pillActive : pillInactive}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Age Range *</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGE_OPTIONS.map(o => (
                    <button key={o.id} onClick={() => updateChar('age_range', o.id)}
                      className={`${pillBase} ${characteristics.age_range === o.id ? pillActive : pillInactive}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ethnicity */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Ethnicity *</label>
                <div className="flex flex-wrap gap-2">
                  {ETHNICITY_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => updateChar('ethnicity', o.value)}
                      className={`${pillBase} ${characteristics.ethnicity === o.value ? pillActive : pillInactive}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Eye Color *</label>
                <div className="flex flex-wrap gap-2">
                  {EYE_COLOR_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => updateChar('eye_color', o.value)}
                      className={`${pillBase} flex items-center gap-2 ${characteristics.eye_color === o.value ? pillActive : pillInactive}`}>
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: o.color }} />
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bald + Glasses */}
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => updateChar('is_bald', !characteristics.is_bald)}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    characteristics.is_bald ? 'bg-violet-600 border-violet-600' : 'bg-white/5 border-white/20 hover:border-violet-500/50'
                  }`}>
                    {characteristics.is_bald && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-white text-sm">Bald / very short hair</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => updateChar('has_glasses', !characteristics.has_glasses)}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    characteristics.has_glasses ? 'bg-violet-600 border-violet-600' : 'bg-white/5 border-white/20 hover:border-violet-500/50'
                  }`}>
                    {characteristics.has_glasses && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-white text-sm">Glasses</span>
                </label>
              </div>

              {/* Hair Color (hidden when bald) */}
              {!characteristics.is_bald && (
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Hair Color *</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLOR_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => updateChar('hair_color', o.value)}
                        className={`${pillBase} flex items-center gap-2 ${characteristics.hair_color === o.value ? pillActive : pillInactive}`}>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: o.color }} />
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Use Cases (optional) */}
              <div>
                <label className="block text-white font-semibold mb-1 text-sm">
                  What will you use these for?
                  <span className="text-gray-500 font-normal ml-2">(optional, max 3)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {USE_CASE_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => toggleUseCase(o.value)}
                      disabled={!characteristics.use_cases.includes(o.value) && characteristics.use_cases.length >= 3}
                      className={`${pillBase} text-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                        characteristics.use_cases.includes(o.value) ? pillActive : pillInactive
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* OPT-IN */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
              <label className="flex items-start gap-4 cursor-pointer" onClick={() => setAllowPhotoUsage(!allowPhotoUsage)}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  allowPhotoUsage ? 'bg-violet-600 border-violet-600' : 'bg-white/5 border-white/20'
                }`}>
                  {allowPhotoUsage && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Allow Nova Imago to use my photos as examples</p>
                  <p className="text-gray-500 text-xs mt-1">Your photos may be shown on our website to help future customers. No personal info is shared. You can uncheck this if you prefer.</p>
                </div>
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* STEP 1 BUTTON */}
            <button
              onClick={handleStep1Submit}
              disabled={!isStep1Valid()}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isStep1Valid()
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}>
              {isStep1Valid() ? 'Continue to Photo Upload →' : 'Please fill in all required fields'}
            </button>
          </>
        )}

        {/* ════════════════════════════════════════════
            STEP 2 — PHOTO UPLOAD
        ════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Upload Your Photos</h1>
              <p className="text-gray-400 text-lg">Upload <strong className="text-white">10–20 photos</strong> for the best results.</p>
            </div>

            {/* SUMMARY TAGS */}
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm transition flex items-center gap-1">
                ← Edit details
              </button>
              <div className="w-px h-4 bg-white/10" />
              {[
                characteristics.full_name,
                characteristics.gender,
                characteristics.age_range,
                characteristics.ethnicity,
                `${characteristics.eye_color} eyes`,
                characteristics.is_bald ? 'Bald' : `${characteristics.hair_color} hair`,
                characteristics.has_glasses ? 'Glasses' : null,
              ].filter(Boolean).map(tag => (
                <span key={tag} className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full text-xs capitalize">
                  {tag}
                </span>
              ))}
            </div>

            {/* TIPS */}
            <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">💡 Tips for the best results</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {[
                  <><span className="text-white font-semibold">10–20 photos</span> for best results</>,
                  <>Solo only — no sunglasses or hats</>,
                  <>Mix <span className="text-white font-semibold">smiling</span> and <span className="text-white font-semibold">neutral</span></>,
                  <>Good <span className="text-white font-semibold">natural lighting</span></>,
                  <>Different <span className="text-white font-semibold">angles</span> and settings</>,
                  <>No heavy filters or edits</>,
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-violet-400 shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DROPZONE */}
            <div className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10 border border-violet-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Upload Photos</h3>
                {photoCount > 0 && (
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      photoCount >= 10 ? 'text-emerald-400' :
                      photoCount >= 8  ? 'text-amber-400'  : 'text-gray-400'
                    }`}>
                      {photoCount}/20 photos{photoCount >= 10 && ' ✓'}
                    </span>
                    <button onClick={() => setPhotos([])} className="text-xs text-gray-500 hover:text-red-400 transition">
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 hover:border-violet-500/50 hover:bg-white/[0.03]'
                }`}>
                <input {...getInputProps()} />
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                {isDragActive ? (
                  <p className="text-violet-400 font-semibold text-lg">Drop your photos here...</p>
                ) : (
                  <>
                    <p className="text-white font-semibold text-lg mb-1">Drag & drop photos here</p>
                    <p className="text-gray-500 text-sm mb-2">or click to browse</p>
                    <p className="text-gray-600 text-xs">JPG, PNG, WEBP • Max 10MB each</p>
                  </>
                )}
              </div>

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-5 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-xl border border-white/10 group-hover:border-violet-500/50 transition"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition text-xs font-bold flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Not enough photos warning */}
            {photoCount > 0 && photoCount < 8 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <p className="text-amber-400 text-sm font-medium">
                  Upload {8 - photoCount} more photo{8 - photoCount !== 1 ? 's' : ''} to continue (minimum 8)
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {status && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                <p className="text-emerald-400 text-sm font-semibold">{status}</p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={uploading || training || !isReady}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isReady && !uploading && !training
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}>
              {uploading ? (
                <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Uploading photos...</>
              ) : training ? (
                <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Starting AI training...</>
              ) : photoCount < 8 ? (
                `Upload ${8 - photoCount} more photo${8 - photoCount !== 1 ? 's' : ''} to continue`
              ) : (
                <><span className="text-xl">🚀</span> Start AI Training ({photoCount} photos)</>
              )}
            </button>

            <p className="text-center mt-4 text-gray-600 text-sm">
              Training takes about 15–20 minutes. You'll be notified when it's ready.
            </p>
          </>
        )}

      </div>
    </div>
  )
}