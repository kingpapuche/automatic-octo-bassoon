import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

const VARIATIONS_PER_STYLE = 4
const STUCK_MINUTES = 10        // pas generaties aanraken die hier ouder dan zijn
const GIVE_UP_MINUTES = 30      // voorspelling nog steeds bezig na dit -> als failed boeken
const MAX_GENERATIONS = 20      // per run, om binnen de tijdslimiet te blijven

// styles_used staat als JSON-string in een text-kolom; veilig naar array parsen.
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

// Download van Replicate -> upload naar eigen storage (identiek aan de webhook).
async function uploadOutputs(userId: string, styleId: string, imageUrls: string[]): Promise<string[]> {
  const uploads = imageUrls.map(async (imageUrl, idx) => {
    try {
      const response = await fetch(imageUrl)
      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = `generated/${userId}/${Date.now()}-${styleId}-v${idx + 1}.webp`
      const { error } = await supabase.storage
        .from('headshots')
        .upload(filename, buffer, { contentType: 'image/webp', cacheControl: '31536000', upsert: true })
      if (!error) {
        return supabase.storage.from('headshots').getPublicUrl(filename).data.publicUrl
      }
      console.error(`reconcile upload error v${idx + 1}:`, error)
      return imageUrl
    } catch (err) {
      console.error(`reconcile download error v${idx + 1}:`, err)
      return imageUrl
    }
  })
  return Promise.all(uploads)
}

async function recordItem(
  gen: { id: string; user_id: string },
  styleId: string,
  predictionId: string,
  status: 'completed' | 'failed',
  urls: string[]
) {
  const { error } = await supabase.rpc('record_generation_item', {
    p_generation_id: gen.id,
    p_user_id: gen.user_id,
    p_style_id: styleId,
    p_prediction_id: predictionId,
    p_status: status,
    p_urls: urls,
    p_variations: VARIATIONS_PER_STYLE,
  })
  if (error) console.error(`reconcile record (${status}) error for ${styleId}:`, error)
}

export async function GET(request: NextRequest) {
  // Beveiliging: alleen aanroepbaar met het juiste secret (Vercel Cron of extern).
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - STUCK_MINUTES * 60_000).toISOString()

  const { data: stuck, error } = await supabase
    .from('generations')
    .select('id, user_id, styles_used, created_at')
    .eq('status', 'processing')
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(MAX_GENERATIONS)

  if (error) {
    console.error('reconcile query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const reconciled: Array<{ id: string; actions: string[] }> = []

  for (const gen of stuck ?? []) {
    const actions: string[] = []
    const styles = toArray(gen.styles_used)
    const ageMin = (Date.now() - new Date(gen.created_at).getTime()) / 60_000

    const { data: items } = await supabase
      .from('generation_items')
      .select('style_id, prediction_id, status')
      .eq('generation_id', gen.id)

    const seenStyles = new Set((items ?? []).map(i => i.style_id))

    // 1) Styles die nooit een item kregen (start mislukt + functie afgekapt):
    //    boek als failed zodat de generatie kan afronden + credits terug.
    for (const styleId of styles) {
      if (!seenStyles.has(styleId)) {
        await recordItem(gen, styleId, `reconcile-missing-${gen.id}-${styleId}`, 'failed', [])
        actions.push(`missing:${styleId}->failed`)
      }
    }

    // 2) Items die nog op 'processing' staan: echte status bij Replicate ophalen.
    for (const item of items ?? []) {
      if (item.status !== 'processing') continue
      const pid = item.prediction_id
      // Synthetische ids (geen echte Replicate-prediction) overslaan.
      if (!pid || pid.startsWith('failedstart-') || pid.startsWith('reconcile-')) continue

      let pred: { status?: string; output?: unknown } | null = null
      try {
        pred = await replicate.predictions.get(pid)
      } catch (err) {
        console.error(`reconcile: kon prediction ${pid} niet ophalen:`, err)
        continue
      }

      if (pred?.status === 'succeeded' && pred.output) {
        const urls = Array.isArray(pred.output) ? (pred.output as string[]) : [pred.output as string]
        const uploaded = await uploadOutputs(gen.user_id, item.style_id, urls)
        await recordItem(gen, item.style_id, pid, 'completed', uploaded)
        actions.push(`${item.style_id}->completed`)
      } else if (pred?.status === 'failed' || pred?.status === 'canceled') {
        await recordItem(gen, item.style_id, pid, 'failed', [])
        actions.push(`${item.style_id}->failed`)
      } else if (ageMin > GIVE_UP_MINUTES) {
        // Hangt te lang -> opgeven en refunden.
        await recordItem(gen, item.style_id, pid, 'failed', [])
        actions.push(`${item.style_id}->failed(timeout)`)
      }
    }

    if (actions.length) reconciled.push({ id: gen.id, actions })
  }

  console.log(`reconcile: ${reconciled.length} generaties bijgewerkt`)
  return NextResponse.json({ scanned: stuck?.length ?? 0, reconciled })
}
