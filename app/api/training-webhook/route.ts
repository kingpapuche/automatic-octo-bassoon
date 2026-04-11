import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ============================================================
// Deze webhook wordt aangeroepen door RunPod wanneer training klaar is
// RunPod stuurt: { jobId, status, output: { lora_url, trigger_word, user_id } }
// ============================================================

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.json()

    console.log('🔔 Webhook received')
    console.log('📊 Status:', body.status)
    console.log('🆔 Job ID:', body.id)

    // RunPod stuurt status: COMPLETED, FAILED, etc.
    if (body.status !== 'COMPLETED') {
      console.log(`⏳ Training status: ${body.status} - not completed yet`)
      return NextResponse.json({ received: true, status: body.status })
    }

    const output = body.output
    const loraUrl = output?.lora_url
    const triggerWord = output?.trigger_word
    const userId = output?.user_id

    if (!loraUrl || !triggerWord || !userId) {
      console.error('❌ Missing output data:', output)
      return NextResponse.json({ error: 'Missing lora_url, trigger_word or user_id' }, { status: 400 })
    }

    console.log('✅ Training completed!')
    console.log('🔗 LoRA URL:', loraUrl)
    console.log('🎯 Trigger word:', triggerWord)

    // Update user met lora_url
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        lora_url: loraUrl,
        trained_model_id: body.id,
        model_trained_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError) {
      console.error('❌ Failed to update user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Update models tabel
    await supabase
      .from('models')
      .update({ status: 'completed', lora_url: loraUrl })
      .eq('training_id', body.id)

    console.log('✅ User updated with LoRA URL')

    // Stuur email notificatie
    if (user?.email) {
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
      userId,
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