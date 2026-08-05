'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Model { id: string; name: string; status: string; gender: string | null }

// Sla het gekozen model op en ga naar de stijl-picker.
function pick(model: Model, router: ReturnType<typeof useRouter>) {
  sessionStorage.setItem('nova_modelId', model.id)
  sessionStorage.setItem('nova_modelName', model.name)
  if (model.gender) sessionStorage.setItem('nova_modelGender', model.gender)
  else sessionStorage.removeItem('nova_modelGender')
  router.push('/create/styles')
}

export default function ModelSelectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        const res = await fetch(`/api/models?userId=${session.user.id}`)
        const data = await res.json()
        const ready: Model[] = (data.models || []).filter((m: Model) => m.status === 'completed')

        if (ready.length === 0) { router.replace('/upload'); return }
        if (ready.length === 1) { pick(ready[0], router); return }   // maar 1 model -> direct door
        setModels(ready)
        setLoading(false)
      } catch {
        router.push('/create/styles')
      }
    }
    load()
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-white/60">Laden…</div>
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-2xl font-bold mb-2">Who are these headshots for?</h1>
        <p className="text-white/50 mb-8">Choose the person — we&apos;ll show the right styles for them.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => pick(m, router)}
              className="group bg-white/5 border border-white/10 hover:border-violet-500 hover:bg-violet-600/10 rounded-2xl p-6 text-left transition"
            >
              <div className="w-12 h-12 rounded-full bg-violet-600/30 flex items-center justify-center text-xl mb-4">
                {m.gender === 'female' ? '👩' : '👨'}
              </div>
              <div className="text-lg font-semibold">{m.name}</div>
              <div className="text-white/40 text-sm capitalize">{m.gender || 'model'}</div>
              <div className="mt-4 text-violet-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                Choose styles →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
