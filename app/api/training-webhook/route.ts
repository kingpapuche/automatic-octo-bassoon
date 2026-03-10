import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔔 Webhook received from Replicate')
    console.log('📊 Status:', body.status)
    console.log('🆔 Training ID:', body.id)

    if (body.status !== 'succeeded') {
      console.log(`⏳ Training status: ${body.status} - waiting for completion`)
      return NextResponse.json({ received: true, status: body.status })
    }

    const output = body.output
    let versionId = null

    if (output?.version) {
      versionId = output.version
      if (versionId.includes(':')) {
        versionId = versionId.split(':')[1]
      }
    } else if (typeof output === 'string' && output.includes(':')) {
      versionId = output.split(':')[1]
    }

    if (!versionId) {
      console.error('❌ No version in webhook output')
      return NextResponse.json({ error: 'Could not extract version ID', output }, { status: 400 })
    }

    console.log('✅ Training completed!')
    console.log('🔑 Version ID:', versionId)

    const trainingId = body.id

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('trained_model_id', trainingId)
      .single()

    if (findError || !user) {
      console.error('❌ Could not find user with training ID:', trainingId)
      return NextResponse.json({ error: 'User not found for training', trainingId }, { status: 404 })
    }

    console.log('👤 Found user:', user.email)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        trained_model_id: versionId,
        model_trained_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Failed to update user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    console.log('✅ User updated with version ID:', versionId)

    // Send email notification
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
                  Great news! Your personal AI model has been trained and is ready to generate your professional headshots.
                </p>
                <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
                  Log in to your account and start generating your headshots now. Choose from 90+ styles and get studio-quality results in seconds.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://automatic-octo-bassoon-six.vercel.app/dashboard" 
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
                  © 2026 Nova Imago • <a href="https://automatic-octo-bassoon-six.vercel.app/privacy-policy" style="color: rgba(255,255,255,0.5);">Privacy Policy</a>
                </p>
              </div>
            </div>
          `,
        })
        console.log('📧 Email sent to:', user.email)
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError)
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      versionId: versionId,
      message: 'Training completed, user updated, email sent',
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Training webhook endpoint is active' 
  })
}