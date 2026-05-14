import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'
import { Resend } from 'resend'

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
      .select('email, full_name')
      .eq('id', userId)
      .single()

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

      if (userData?.email) {
        try {
          await resend.emails.send({
            from: 'Nova Imago <onboarding@resend.dev>',
            to: userData.email,
            subject: '🎉 Your AI model is ready!',
            html: `<h2>Hi ${userData.full_name || 'there'}!</h2>
              <p>Your personal AI model is ready to generate professional headshots.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Go to dashboard</a></p>
              <p>— Nova Imago</p>`,
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

      // Null stale velden
      await supabase
        .from('users')
        .update({
          trained_model_id: null,
          trigger_word: null,
          model_trained_at: null,
        })
        .eq('id', userId)

      if (userData?.email) {
        try {
          await resend.emails.send({
            from: 'Nova Imago <onboarding@resend.dev>',
            to: userData.email,
            subject: 'Training issue — let us help',
            html: `<h2>Hi ${userData.full_name || 'there'},</h2>
              <p>Your training didn't complete successfully. Your credit hasn't been used. Please try again with different photos, or reply to this email.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Back to dashboard</a></p>`,
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