'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PhotoQualityChecker from '@/components/PhotoQualityChecker'

interface UserCharacteristics {
  full_name: string
  gender: 'male' | 'female' | 'non-binary' | ''
  ethnicity: string
  eye_color: string
  hair_color: string
  is_bald: boolean
  has_glasses: boolean
  use_cases: string[]
  age_range: string
}

const AGE_RANGE_OPTIONS = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55-64', label: '55-64' },
  { id: '65+', label: '65+' },
]

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
  { value: 'website', label: 'Website / About Us' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'cv', label: 'CV / Resume' },
  { value: 'dating', label: 'Dating Profile' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'business-cards', label: 'Business Cards' },
  { value: 'online-platforms', label: 'Online Platforms' },
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
  const [step, setStep] = useState(1)
  const [characteristics, setCharacteristics] = useState<UserCharacteristics>({
    full_name: '', gender: '', ethnicity: '', eye_color: '',
    hair_color: '', is_bald: false, has_glasses: false, use_cases: [], age_range: '',
  })

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/login'); return }
      const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single()
      if (userData) {
        setUser({ id: session.user.id, email: session.user.email || '', credits: userData.credits || 0 })
        if (userData.full_name) {
          setCharacteristics({
            full_name: userData.full_name || '', gender: userData.gender || '',
            ethnicity: userData.ethnicity || '', eye_color: userData.eye_color || '',
            hair_color: userData.hair_color || '', is_bald: userData.is_bald || false,
            has_glasses: userData.has_glasses || false, use_cases: userData.use_cases || [],
            age_range: userData.age_range || '',
          })
        }
      }
    }
    getUser()
  }, [router])

  const updateCharacteristic = (key: keyof UserCharacteristics, value: any) => {
    setCharacteristics(prev => ({ ...prev, [key]: value }))
    if (key === 'is_bald' && value === true) setCharacteristics(prev => ({ ...prev, hair_color: '' }))
  }

  const toggleUseCase = (value: string) => {
    setCharacteristics(prev => {
      const current = prev.use_cases
      if (current.includes(value)) return { ...prev, use_cases: current.filter(v => v !== value) }
      else if (current.length < 3) return { ...prev, use_cases: [...current, value] }
      return prev
    })
  }

  const isStep1Valid = () =>
    characteristics.full_name.trim() !== '' &&
    characteristics.gender !== '' &&
    characteristics.ethnicity !== '' &&
    characteristics.eye_color !== '' &&
    characteristics.age_range !== '' &&
    (characteristics.is_bald || characteristics.hair_color !== '')

  const handleStep1Submit = async () => {
    if (!isStep1Valid() || !user) return
    setError('')
    try {
      const { error: updateError } = await supabase.from('users').update({
        full_name: characteristics.full_name, gender: characteristics.gender,
        ethnicity: characteristics.ethnicity, eye_color: characteristics.eye_color,
        hair_color: characteristics.is_bald ? null : characteristics.hair_color,
        is_bald: characteristics.is_bald, has_glasses: characteristics.has_glasses,
        use_cases: characteristics.use_cases, age_range: characteristics.age_range,
      }).eq('id', user.id)
      if (updateError) throw updateError
      setStep(2)
    } catch (err) {
      setError('Failed to save your information. Please try again.')
    }
  }

  const handlePhotosApproved = (approvedFiles: File[]) => {
    setPhotos(approvedFiles)
    setError('')
  }

  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return }
    if (photos.length < 8) { setError('Please upload at least 8 photos'); return }
    if (user.credits < 1) { setError('You need credits to train a model. Please buy credits first.'); return }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, photoUrls: uploadData.photoUrls, characteristics }),
      })
      const trainData = await trainResponse.json()
      if (!trainResponse.ok || trainData.error) throw new Error(trainData.error || 'Failed to start training')
      setStatus('Training started! This takes about 15-20 minutes.')
      setTimeout(() => router.push('/dashboard?training=started'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false); setTraining(false); setStatus('')
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  )

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden">
      <nav className="border-b border-[#334155] bg-[#0f172a] shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/"><span className="font-serif text-xl text-white tracking-tight">Nova <em>Imago</em></span></Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-full px-3 py-1.5">
              <span className="text-[#7D6FB8] font-bold text-xs">Credits</span>
              <span className="text-white font-semibold text-sm">{user.credits}</span>
            </div>
            <Link href="/dashboard" className="text-[#94a3b8] hover:text-white text-sm font-medium">← Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="shrink-0 max-w-5xl mx-auto w-full px-6 pt-4 pb-2">
        <div className="flex items-center justify-center gap-3">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#7D6FB8]' : 'text-[#475569]'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#7D6FB8] text-white' : 'bg-[#334155] text-[#94a3b8]'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="font-medium text-sm">Your Details</span>
          </div>
          <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-[#7D6FB8]' : 'bg-[#334155]'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#7D6FB8]' : 'text-[#475569]'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#7D6FB8] text-white' : 'bg-[#334155] text-[#94a3b8]'}`}>2</div>
            <span className="font-medium text-sm">Upload Photos</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 pb-6">

          {step === 1 && (
            <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-white mb-1">Tell Us About Yourself</h1>
                <p className="text-[#94a3b8] text-sm">This helps our AI create headshots that actually look like you.</p>
              </div>
              <div className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155] mb-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-1.5 text-sm">Full Name</label>
                      <input type="text" value={characteristics.full_name}
                        onChange={(e) => updateCharacteristic('full_name', e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm placeholder-[#64748b] focus:outline-none focus:border-[#7D6FB8] transition" />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1.5 text-sm">Gender</label>
                      <div className="flex gap-2">
                        {[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'non-binary', label: 'Non-binary' }].map(o => (
                          <button key={o.value} onClick={() => updateCharacteristic('gender', o.value)}
                            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition ${characteristics.gender === o.value ? 'bg-[#7D6FB8] text-white' : 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:border-[#7D6FB8]'}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1.5 text-sm">Ethnicity</label>
                      <select value={characteristics.ethnicity} onChange={(e) => updateCharacteristic('ethnicity', e.target.value)}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7D6FB8] transition appearance-none cursor-pointer">
                        <option value="" disabled>Select your ethnicity</option>
                        {ETHNICITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1.5 text-sm">Age Range</label>
                      <div className="flex flex-wrap gap-2">
                        {AGE_RANGE_OPTIONS.map(o => (
                          <button key={o.id} onClick={() => updateCharacteristic('age_range', o.id)}
                            className={`py-1.5 px-3 rounded-xl text-sm font-medium transition ${characteristics.age_range === o.id ? 'bg-[#7D6FB8] text-white' : 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:border-[#7D6FB8]'}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => updateCharacteristic('is_bald', !characteristics.is_bald)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition shrink-0 ${characteristics.is_bald ? 'bg-[#7D6FB8] border-[#7D6FB8]' : 'border-[#475569] hover:border-[#7D6FB8]'}`}>
                          {characteristics.is_bald && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-white text-sm">Bald / very short hair</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => updateCharacteristic('has_glasses', !characteristics.has_glasses)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition shrink-0 ${characteristics.has_glasses ? 'bg-[#7D6FB8] border-[#7D6FB8]' : 'border-[#475569] hover:border-[#7D6FB8]'}`}>
                          {characteristics.has_glasses && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-white text-sm">Glasses</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-1.5 text-sm">Eye Color</label>
                      <div className="flex flex-wrap gap-2">
                        {EYE_COLOR_OPTIONS.map(o => (
                          <button key={o.value} onClick={() => updateCharacteristic('eye_color', o.value)}
                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition text-sm ${characteristics.eye_color === o.value ? 'bg-[#7D6FB8]/20 border-2 border-[#7D6FB8]' : 'bg-[#0f172a] border border-[#334155] hover:border-[#7D6FB8]'}`}>
                            <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: o.color }} />
                            <span className={characteristics.eye_color === o.value ? 'text-white' : 'text-[#94a3b8]'}>{o.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {!characteristics.is_bald && (
                      <div>
                        <label className="block text-white font-semibold mb-1.5 text-sm">Hair Color</label>
                        <div className="flex flex-wrap gap-2">
                          {HAIR_COLOR_OPTIONS.map(o => (
                            <button key={o.value} onClick={() => updateCharacteristic('hair_color', o.value)}
                              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition text-sm ${characteristics.hair_color === o.value ? 'bg-[#7D6FB8]/20 border-2 border-[#7D6FB8]' : 'bg-[#0f172a] border border-[#334155] hover:border-[#7D6FB8]'}`}>
                              <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: o.color }} />
                              <span className={characteristics.hair_color === o.value ? 'text-white' : 'text-[#94a3b8]'}>{o.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-white font-semibold mb-1 text-sm">What will you use these for? <span className="text-[#64748b] font-normal">(optional, max 3)</span></label>
                      <div className="flex flex-wrap gap-1.5">
                        {USE_CASE_OPTIONS.map(o => (
                          <button key={o.value} onClick={() => toggleUseCase(o.value)}
                            disabled={!characteristics.use_cases.includes(o.value) && characteristics.use_cases.length >= 3}
                            className={`py-1.5 px-3 rounded-xl text-xs transition ${characteristics.use_cases.includes(o.value) ? 'bg-[#7D6FB8] text-white' : 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:border-[#7D6FB8] disabled:opacity-50 disabled:cursor-not-allowed'}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {error && <div className="mt-4 bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 rounded-xl p-3 text-[#FF6B4A] text-sm">{error}</div>}
              </div>
              <button onClick={handleStep1Submit} disabled={!isStep1Valid()}
                className="w-full bg-[#FF6B4A] hover:bg-[#FF5230] disabled:bg-[#334155] disabled:cursor-not-allowed text-white py-4 rounded-full text-base font-bold transition shadow-lg hover:-translate-y-0.5 disabled:hover:translate-y-0">
                {isStep1Valid() ? 'Continue to Photo Upload →' : 'Please fill in all required fields'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-3">
                <h1 className="text-2xl font-bold text-white mb-1">Upload Your Photos</h1>
                <p className="text-[#94a3b8] text-sm">Upload <strong className="text-white">10–20 photos</strong> for the best results.</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setStep(1)} className="text-[#94a3b8] hover:text-white text-sm flex items-center gap-1">← Back to edit your details</button>
                <div className="flex flex-wrap gap-2">
                  {[characteristics.full_name, characteristics.gender, characteristics.ethnicity,
                    characteristics.age_range,
                    `${characteristics.eye_color} eyes`,
                    characteristics.is_bald ? 'Bald' : `${characteristics.hair_color} hair`,
                    characteristics.has_glasses ? 'Glasses' : null,
                  ].filter(Boolean).map(tag => (
                    <span key={tag} className="bg-[#7D6FB8]/20 text-[#7D6FB8] px-2 py-0.5 rounded-full text-xs capitalize">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#1e293b] rounded-2xl border border-[#334155] mb-4 overflow-hidden">
                <PhotoQualityChecker onPhotosApproved={handlePhotosApproved} minPhotos={10} maxPhotos={20} />
              </div>
              {error && <div className="mb-3 bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 rounded-xl p-3 text-[#FF6B4A] text-sm">{error}</div>}
              {status && <div className="mb-3 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl p-3 text-[#0D9488] text-sm font-semibold">{status}</div>}
              {photos.length >= 10 && (
                <button onClick={handleSubmit} disabled={uploading || training}
                  className="w-full bg-[#FF6B4A] hover:bg-[#FF5230] disabled:bg-[#334155] disabled:cursor-not-allowed text-white py-4 rounded-full text-base font-bold transition shadow-lg hover:-translate-y-0.5">
                  {uploading ? 'Uploading photos...' : training ? 'Starting AI training...' : `Start AI Training with ${photos.length} photos →`}
                </button>
              )}
              <p className="text-center mt-3 text-[#94a3b8] text-xs">Training takes about 15–20 minutes. We&apos;ll notify you when it&apos;s ready.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
