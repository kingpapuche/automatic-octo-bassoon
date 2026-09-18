import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'
import { Resend } from 'resend'
import { brandedEmail } from '@/lib/email-template'
import { EMAILS } from '@/lib/messages/emails'
import { isLocale, DEFAULT_LOCALE } from '@/lib/i18n'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
const resend = new Resend(process.env.RESEND_API_KEY!)

interface ReplicateWebhookPayload {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: { version?: string } | null
  error?: string | null
}

// Vult {name} in de kop; zonder naam wordt ", {name}" netjes verwijderd (werkt voor alle talen).
function fillName(template: string, fullName?: string | null): string {
  const name = (fullName || '').trim()
  return name ? template.replace('{name}', name) : template.replace(/,?\s*\{name\}/, '')
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const modelPath = url.searchParams.get('modelPath')

    if (!userId || !modelPath) {
      return NextResponse.json({ error: 'Missing userId or modelPath' }, { status: 400 })
    }

    const payload = (await request.json()) as ReplicateWebhookPayload
    console.log(`Webhook: ${payload.id} status=${payload.status} user=${userId}`)

    // Haal user op voor email
    const { data: userData } = await supabase
      .from('users')
      .select('email, full_name, locale')
      .eq('id', userId)
      .single()

    // Taal van de klant (opgeslagen bij het opslaan van kenmerken); fallback = Engels
    const locale = isLocale(userData?.locale) ? userData.locale : DEFAULT_LOCALE

    // === SUCCEEDED ===
    if (payload.status === 'succeeded') {
      // Haal latest model versie op
      let modelVersion: string | null = null
      try {
        const [owner, name] = modelPath.split('/')
        const model = await replicate.models.get(owner, name)
        modelVersion = model.latest_version?.id ?? null
      } catch (err) {
        console.error('Failed to fetch model version:', err)
      }

      if (!modelVersion && payload.output?.version) {
        modelVersion = payload.output.version
      }

      if (modelVersion) {
        // Overschrijf trained_model_id met "owner/name:version" (klaar voor generation)
        await supabase
          .from('users')
          .update({ trained_model_id: `${modelPath}:${modelVersion}` })
          .eq('id', userId)
      }

      // Multi-model: markeer de bijbehorende modelrij als klaar (+ resolved ref indien beschikbaar).
      const fullRef = modelVersion ? `${modelPath}:${modelVersion}` : null
      await supabase
        .from('models')
        .update({ status: 'completed', ...(fullRef ? { training_id: fullRef } : {}) })
        .eq('training_id', payload.id)

      // Ruim enkel de trainings-ZIP op (nutteloos archief na de training).
      // LET OP: de ruwe uploads worden VOORLOPIG BEHOUDEN — nodig voor 'voor/na'-
      // voorbeelden tot we er genoeg van hebben. Generated foto's blijven ook staan.
      // TODO: uploads-verwijdering weer aanzetten zodra er genoeg voor/na-voorbeelden zijn.
      try {
        const { data: zipFiles } = await supabase.storage
          .from('headshots')
          .list('training-zips', { limit: 1000 })
        const userZips = (zipFiles || []).filter((f) => f.name.startsWith(`${userId}-`))
        if (userZips.length) {
          await supabase.storage
            .from('headshots')
            .remove(userZips.map((f) => `training-zips/${f.name}`))
        }
        console.log(`🧹 Cleaned training ZIP for user ${userId} (uploads + generated kept)`)
      } catch (cleanupErr) {
        console.error('ZIP cleanup failed (non-fatal):', cleanupErr)
      }

      if (userData?.email) {
        try {
          const copy = EMAILS[locale].ready
          const readyEmail = brandedEmail({
            previewText: copy.previewText,
            heading: fillName(copy.heading, userData.full_name),
            paragraphs: copy.paragraphs,
            button: { label: copy.buttonLabel, url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
          })
          await resend.emails.send({
            from: 'Nova Imago <noreply@novaimago.ai>',
            replyTo: 'support@novaimago.ai',
            to: userData.email,
            subject: copy.subject,
            html: readyEmail.html,
            text: readyEmail.text,
          })
        } catch (emailError) {
          console.error('Email failed:', emailError)
        }
      }

      return NextResponse.json({ received: true })
    }

    // === FAILED / CANCELED ===
    if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`Training ${payload.status}:`, payload.error)

      // Multi-model: markeer enkel deze modelrij als mislukt.
      await supabase
        .from('models')
        .update({ status: 'failed' })
        .eq('training_id', payload.id)

      // Alleen het 'actieve' model op users nullen als dit net die training was
      // (anders zou een mislukte 2e training een bestaand werkend model wissen).
      const { data: activeUser } = await supabase
        .from('users')
        .select('trained_model_id')
        .eq('id', userId)
        .single()
      if (activeUser?.trained_model_id === payload.id) {
        await supabase
          .from('users')
          .update({ trained_model_id: null, trigger_word: null, model_trained_at: null })
          .eq('id', userId)
      }

      if (userData?.email) {
        try {
          const copy = EMAILS[locale].issue
          const issueEmail = brandedEmail({
            previewText: copy.previewText,
            heading: fillName(copy.heading, userData.full_name),
            paragraphs: copy.paragraphs,
            button: { label: copy.buttonLabel, url: `${process.env.NEXT_PUBLIC_APP_URL}/upload` },
          })
          await resend.emails.send({
            from: 'Nova Imago <noreply@novaimago.ai>',
            replyTo: 'support@novaimago.ai',
            to: userData.email,
            subject: copy.subject,
            html: issueEmail.html,
            text: issueEmail.text,
          })
        } catch (emailError) {
          console.error('Email failed:', emailError)
        }
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}