import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'
import sodium from 'libsodium-wrappers'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ============================================================
// Webhook signature verification (fal.ai)
// Docs: https://fal.ai/docs/documentation/model-apis/inference/webhooks
// ============================================================

const JWKS_URL = 'https://rest.fal.ai/.well-known/jwks.json'
const JWKS_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 uur

interface JwksKey {
  x: string
  [key: string]: unknown
}

let jwksCache: JwksKey[] | null = null
let jwksCacheTime = 0

async function fetchJwks(): Promise<JwksKey[]> {
  const currentTime = Date.now()
  if (!jwksCache || (currentTime - jwksCacheTime) > JWKS_CACHE_DURATION) {
    const response = await fetch(JWKS_URL)
    if (!response.ok) throw new Error(`JWKS fetch failed: ${response.status}`)
    const data = await response.json()
    jwksCache = (data.keys as JwksKey[]) || []
    jwksCacheTime = currentTime
  }
  return jwksCache
}

async function verifyWebhookSignature(
  requestId: string,
  userId: string,
  timestamp: string,
  signatureHex: string,
  body: Buffer
): Promise<boolean> {
  await sodium.ready

  // Tijdcheck: ±5 minuten leeway
  const timestampInt = parseInt(timestamp, 10)
  const currentTime = Math.floor(Date.now() / 1000)
  if (isNaN(timestampInt) || Math.abs(currentTime - timestampInt) > 300) {
    console.error('⚠️ Webhook timestamp invalid or too old')
    return false
  }

  // Bouw bericht op
  const messageParts = [
    requestId,
    userId,
    timestamp,
    crypto.createHash('sha256').update(body).digest('hex'),
  ]
  const messageBytes = Buffer.from(messageParts.join('\n'), 'utf-8')

  // Decodeer handtekening
  let signatureBytes: Buffer
  try {
    signatureBytes = Buffer.from(signatureHex, 'hex')
  } catch {
    console.error('⚠️ Invalid signature format')
    return false
  }

  // Probeer elke public key
  const keys = await fetchJwks()
  for (const keyInfo of keys) {
    try {
      const publicKeyBytes = Buffer.from(keyInfo.x, 'base64url')
      const isValid = sodium.crypto_sign_verify_detached(
        signatureBytes,
        messageBytes,
        publicKeyBytes
      )
      if (isValid) return true
    } catch {
      continue
    }
  }

  return false
}

// ============================================================
// Webhook payload van fal.ai:
// { request_id, gateway_request_id, status: "OK" | "ERROR", payload: {...} }
// Bij OK: payload.diffusers_lora_file.url bevat de getrainde LoRA
// ============================================================

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // Raw body voor signature check
    const bodyText = await request.text()
    const bodyBuffer = Buffer.from(bodyText, 'utf-8')

    // Headers ophalen
    const headerRequestId = request.headers.get('x-fal-webhook-request-id')
    const headerUserId = request.headers.get('x-fal-webhook-user-id')
    const headerTimestamp = request.headers.get('x-fal-webhook-timestamp')
    const headerSignature = request.headers.get('x-fal-webhook-signature')

    if (!headerRequestId || !headerUserId || !headerTimestamp || !headerSignature) {
      console.error('❌ Missing webhook signature headers')
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 401 })
    }

    // Signature verifiëren
    const isValid = await verifyWebhookSignature(
      headerRequestId,
      headerUserId,
      headerTimestamp,
      headerSignature,
      bodyBuffer
    )

    if (!isValid) {
      console.error('❌ Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Body parsen
    const body = JSON.parse(bodyText)

    console.log('🔔 Webhook received')
    console.log('📊 Status:', body.status)
    console.log('🆔 Request ID:', body.request_id)

    const falRequestId = body.request_id
    if (!falRequestId) {
      return NextResponse.json({ error: 'Missing request_id in payload' }, { status: 400 })
    }

    // User opzoeken via trained_model_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, trigger_word, lora_url')
      .eq('trained_model_id', falRequestId)
      .single()

    if (userError || !user) {
      console.error(`❌ No user found for request_id: ${falRequestId}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Status: ERROR → training gefaald
    if (body.status === 'ERROR') {
      console.error(`❌ Training failed for user ${user.id}:`, body.error)

      // Null de stale velden zodat user opnieuw kan starten
      await supabase
        .from('users')
        .update({
          trained_model_id: null,
          lora_url: null,
          trigger_word: null,
          model_trained_at: null,
        })
        .eq('id', user.id)

      await supabase
        .from('models')
        .update({ status: 'failed' })
        .eq('training_id', falRequestId)

      return NextResponse.json({ received: true, status: 'failed' })
    }

    // Status: niet OK → onbekende status, log en negeer
    if (body.status !== 'OK') {
      console.log(`⏳ Unhandled status: ${body.status}`)
      return NextResponse.json({ received: true, status: body.status })
    }

    // Status: OK → LoRA URL ophalen
    const loraUrl = body.payload?.diffusers_lora_file?.url

    if (!loraUrl) {
      console.error('❌ Missing LoRA URL in payload:', body.payload)
      return NextResponse.json({ error: 'Missing diffusers_lora_file.url' }, { status: 400 })
    }

    // Idempotentie check: al verwerkt?
    if (user.lora_url === loraUrl) {
      console.log('✅ Webhook already processed for this user, skipping')
      return NextResponse.json({ received: true, alreadyProcessed: true })
    }

    console.log('✅ Training completed!')
    console.log('🔗 LoRA URL:', loraUrl)

    // Update users tabel
    const { error: updateError } = await supabase
      .from('users')
      .update({
        lora_url: loraUrl,
        model_trained_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Failed to update user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Update models tabel
    await supabase
      .from('models')
      .update({ status: 'completed', lora_url: loraUrl })
      .eq('training_id', falRequestId)

    console.log('✅ User updated with LoRA URL')

    // Stuur email notificatie
    if (user.email) {
      try {
        await resend.emails.send({
          from: 'Nova Imago <onboarding@resend.dev>',
          to: user.email,
          subject: '🎉 Your AI model is ready — generate your headshots now!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #5B4E9D, #0D9488); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Nova Imago</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Your AI Headshot Generator</p>
              </div>
              <div style="padding: 40px; background: #f9f9f9;">
                <h2 style="color: #2D2D2D; font-size: 24px; margin-bottom: 16px;">🎉 Your AI model is ready!</h2>
                <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
                  Your personal AI model has been trained and is ready to generate your professional headshots.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://novaimago.ai/dashboard" 
                     style="background: linear-gradient(135deg, #5B4E9D, #0D9488); color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                    Generate My Headshots →
                  </a>
                </div>
                <div style="background: white; border: 1px solid #E8E6E0; border-radius: 12px; padding: 20px; margin-top: 24px;">
                  <p style="color: #2D2D2D; font-weight: bold; margin: 0 0 8px 0;">🛡️ Profile-Worthy Guarantee</p>
                  <p style="color: #6B6B6B; font-size: 14px; margin: 0;">
                    Not satisfied? Contact us within 7 days for a full refund. No questions asked.
                  </p>
                </div>
              </div>
              <div style="padding: 24px; text-align: center; background: #2D2D2D; border-radius: 0 0 12px 12px;">
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
                  © 2026 Nova Imago • <a href="https://novaimago.ai/privacy-policy" style="color: rgba(255,255,255,0.5);">Privacy Policy</a>
                </p>
              </div>
            </div>
          `,
        })
        console.log('📧 Email sent to:', user.email)
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      loraUrl,
      message: 'Training completed, user updated, email sent',
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Training webhook endpoint is active' })
}