'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CreateProgressBar from '@/components/CreateProgressBar'

const GENDER_OPTIONS = [
  { id: 'male', label: 'Man', icon: '👨' },
  { id: 'female', label: 'Woman', icon: '👩' },
]

const ETHNICITY_OPTIONS = [
  { id: 'caucasian', label: 'Caucasian' },
  { id: 'hispanic', label: 'Hispanic / Latino' },
  { id: 'black', label: 'Black / African' },
  { id: 'south-asian', label: 'South Asian' },
  { id: 'east-asian', label: 'East Asian' },
  { id: 'middle-eastern', label: 'Middle Eastern' },
  { id: 'southeast-asian', label: 'Southeast Asian' },
  { id: 'caribbean', label: 'Caribbean' },
  { id: 'mixed', label: 'Mixed / Other' },
]

const EYE_COLOR_OPTIONS = [
  { id: 'brown', label: 'Brown', hex: '#5C3317' },
  { id: 'blue', label: 'Blue', hex: '#4682B4' },
  { id: 'green', label: 'Green', hex: '#2E8B57' },
  { id: 'hazel', label: 'Hazel', hex: '#8E7618' },
  { id: 'gray', label: 'Gray', hex: '#808080' },
  { id: 'amber', label: 'Amber', hex: '#FFBF00' },
  { id: 'dark-brown', label: 'Dark Brown', hex: '#3B2212' },
]

const HAIR_COLOR_OPTIONS = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'dark-brown', label: 'Dark Brown', hex: '#3B2212' },
  { id: 'brown', label: 'Brown', hex: '#6B4226' },
  { id: 'light-brown', label: 'Light Brown', hex: '#A0734A' },
  { id: 'blonde', label: 'Blonde', hex: '#D4A76A' },
  { id: 'red', label: 'Red / Auburn', hex: '#922724' },
  { id: 'gray', label: 'Gray / Silver', hex: '#A0A0A0' },
  { id: 'white', label: 'White', hex: '#E0E0E0' },
]

const AGE_RANGE_OPTIONS = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55-64', label: '55-64' },
  { id: '65+', label: '65+' },
]

export default function CreateOrderDetailsPage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [userCredits, setUserCredits] = useState(0)
  const [savingProfile, setSavingProfile] = useState(false)

  const [gender, setGender] = useState<string>('')
  const [ethnicity, setEthnicity] = useState<string>('')
  const [eyeColor, setEyeColor] = useState<string>('')
  const [hairColor, setHairColor] = useState<string>('')
  const [isBald, setIsBald] = useState<boolean>(false)
  const [hasGlasses, setHasGlasses] = useState<boolean>(false)
  const [ageRange, setAgeRange] = useState<string>('')

  const isProfileComplete = gender && ethnicity && eyeColor && (isBald || hairColor) && ageRange

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          setUserId(userData.id)
          setUserCredits(userData.credits || 0)
          if (userData.gender) setGender(userData.gender)
          if (userData.ethnicity) setEthnicity(userData.ethnicity)
          if (userData.eye_color) setEyeColor(userData.eye_color)
          if (userData.hair_color) setHairColor(userData.hair_color)
          if (userData.is_bald) setIsBald(userData.is_bald)
          if (userData.has_glasses) setHasGlasses(userData.has_glasses)
          if (userData.age_range) setAgeRange(userData.age_range)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleContinue = async () => {
    if (!isProfileComplete || !userId) return
    setSavingProfile(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          gender,
          ethnicity,
          eye_color: eyeColor,
          hair_color: isBald ? null : hairColor,
          is_bald: isBald,
          has_glasses: hasGlasses,
          age_range: ageRange,
        })
        .eq('id', userId)

      if (error) {
        alert('Failed to save. Please try again.')
        console.error(error)
      } else {
        router.push('/create/styles')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingProfile(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <CreateProgressBar currentStep={1} userCredits={userCredits} />

      <div className="pt-[140px] pb-[100px] max-w-[700px] mx-auto px-6">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Tell us about yourself</h1>
          <p className="text-gray-400 text-lg">This helps the AI generate accurate, realistic headshots that look like you.</p>
        </div>

        <div className="space-y-6">

          {/* GENDER */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-4 text-lg">Gender *</label>
            <div className="flex gap-3">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGender(opt.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    gender === opt.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ETHNICITY */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-2 text-lg">Ethnicity *</label>
            <p className="text-gray-400 text-sm mb-4">Helps the AI match your skin tone accurately.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ETHNICITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEthnicity(opt.id)}
                  className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                    ethnicity === opt.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* EYE COLOR */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-4 text-lg">Eye Color *</label>
            <div className="flex flex-wrap gap-3">
              {EYE_COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEyeColor(opt.id)}
                  className={`flex items-center gap-2 py-3 px-5 rounded-xl font-medium text-sm transition-all ${
                    eyeColor === opt.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: opt.hex }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* BALD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-4 text-lg">Are you bald?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsBald(false)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  !isBald
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >No</button>
              <button
                onClick={() => { setIsBald(true); setHairColor('') }}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  isBald
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >Yes</button>
            </div>
          </div>

          {/* HAIR COLOR */}
          {!isBald && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-4 text-lg">Hair Color *</label>
              <div className="flex flex-wrap gap-3">
                {HAIR_COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setHairColor(opt.id)}
                    className={`flex items-center gap-2 py-3 px-5 rounded-xl font-medium text-sm transition-all ${
                      hairColor === opt.id
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: opt.hex }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GLASSES */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-4 text-lg">Do you wear glasses?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setHasGlasses(false)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  !hasGlasses
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >No</button>
              <button
                onClick={() => setHasGlasses(true)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  hasGlasses
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >Yes</button>
            </div>
          </div>

          {/* AGE RANGE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-2 text-lg">Age Range *</label>
            <p className="text-gray-400 text-sm mb-4">Helps the AI match realistic skin and facial features for your age.</p>
            <div className="grid grid-cols-3 gap-2">
              {AGE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAgeRange(opt.id)}
                  className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                    ageRange === opt.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTINUE */}
          <button
            onClick={handleContinue}
            disabled={!isProfileComplete || savingProfile}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isProfileComplete && !savingProfile
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/25 hover:-translate-y-0.5'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {savingProfile ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>Continue to Select Styles -&gt;</>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}