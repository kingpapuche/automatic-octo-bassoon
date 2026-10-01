import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

// GDPR data-retentie opschoon-taak. Draait dagelijks via Vercel Cron (zie vercel.json).
// Beveiligd met CRON_SECRET (Vercel stuurt automatisch 'Authorization: Bearer <CRON_SECRET>').
// Test veilig met ?dry=1 (toont wat er ZOU verdwijnen, verwijdert niets).
//
// Retentie:
//   - Geüploade selfies (uploads/<uid>/)      -> 7 dagen
//   - Gegenereerde foto's (generated/<uid>/)   -> 30 dagen
//   - AI-model (LoRA, Replicate)               -> 30 dagen na aanmaak (zoals privacybeleid)

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const BUCKET = 'headshots'
const SELFIE_DAYS = 7
const GENERATED_DAYS = 30
const MODEL_DAYS = 30
const MAX_MODELS_PER_RUN = 100

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

const DAY_MS = 24 * 60 * 60 * 1000

function olderThan(iso: string | null | undefined, days: number): boolean {
  if (!iso) return false
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() - t > days * DAY_MS
}

// Verwijder bestanden ouder dan `days` in alle submappen van `root` (root/<uid>/<bestand>).
async function cleanStorageFolder(root: string, days: number, dry: boolean) {
  let deleted = 0
  const scannedUsers: string[] = []
  const { data: subs, error } = await supabase.storage.from(BUCKET).list(root, { limit: 1000 })
  if (error || !subs) return { deleted, users: 0, note: error?.message }

  for (const sub of subs) {
    // Mappen hebben id === null; echte bestanden hebben een id. We willen de <uid>-mappen.
    if (sub.id !== null) continue
    const folder = `${root}/${sub.name}`
    const { data: files } = await supabase.storage.from(BUCKET).list(folder, { limit: 1000 })
    if (!files) continue
    const toDelete = files
      .filter((f) => f.id !== null && olderThan(f.created_at, days))
      .map((f) => `${folder}/${f.name}`)
    if (toDelete.length > 0) {
      scannedUsers.push(sub.name)
      if (!dry) {
        const { error: rmErr } = await supabase.storage.from(BUCKET).remove(toDelete)
        if (rmErr) { console.error(`cleanup ${folder}:`, rmErr.message); continue }
      }
      deleted += toDelete.length
    }
  }
  return { deleted, users: scannedUsers.length }
}

async function cleanModels(dry: boolean) {
  let deleted = 0
  const errors: string[] = []
  const cutoff = new Date(Date.now() - MODEL_DAYS * DAY_MS).toISOString()

  // Enkel voltooide modellen die al minstens 30 dagen bestaan zijn kandidaat.
  const { data: models, error } = await supabase
    .from('models')
    .select('id, user_id, training_id, created_at')
    .eq('status', 'completed')
    .lt('created_at', cutoff)
    .limit(MAX_MODELS_PER_RUN)
  if (error || !models) return { deleted, errors: error ? [error.message] : [] }

  for (const m of models) {
    // Strikt volgens privacybeleid: 30 dagen na aanmaak (de query filtert hier al op).
    // training_id is "owner/name:version" na succes -> owner/name parsen.
    const ownerName = String(m.training_id || '').split(':')[0]
    if (ownerName.includes('/')) {
      const [owner, name] = ownerName.split('/')
      if (!dry) {
        try {
          await replicate.models.delete(owner, name)
        } catch (e) {
          errors.push(`model ${owner}/${name}: ${e instanceof Error ? e.message : 'delete failed'}`)
        }
      }
    }
    if (!dry) {
      await supabase.from('models').update({ status: 'deleted' }).eq('id', m.id)
      // Wis de actieve pointer enkel als die naar dit model verwees.
      await supabase
        .from('users')
        .update({ trained_model_id: null, trigger_word: null, model_trained_at: null })
        .eq('id', m.user_id)
        .eq('trained_model_id', m.training_id)
    }
    deleted++
  }
  return { deleted, errors }
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dry = new URL(request.url).searchParams.get('dry') === '1'

  const selfies = await cleanStorageFolder('uploads', SELFIE_DAYS, dry)
  const generated = await cleanStorageFolder('generated', GENERATED_DAYS, dry)

  // Dode links in de galerij opruimen: oude generaties leegmaken (na het wissen van de bestanden).
  if (!dry) {
    const genCutoff = new Date(Date.now() - GENERATED_DAYS * DAY_MS).toISOString()
    await supabase.from('generations').update({ result_urls: [] }).lt('created_at', genCutoff)
  }

  const models = await cleanModels(dry)

  const summary = {
    dryRun: dry,
    ranAt: new Date().toISOString(),
    selfies,
    generated,
    models,
  }
  console.log('🧹 cleanup-retention:', JSON.stringify(summary))
  return NextResponse.json(summary)
}
