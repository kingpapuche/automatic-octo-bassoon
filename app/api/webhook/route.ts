import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const userId      = session.metadata?.userId
      const credits     = parseInt(session.metadata?.credits || '0')
      const plan        = session.metadata?.plan
      const isBusiness  = session.metadata?.isBusiness === 'true'
      const companyName = session.metadata?.companyName || ''
      const vatNumber   = session.metadata?.vatNumber || ''
      const customerEmail = session.customer_email || ''

      if (!userId || !credits) {
        console.error('Missing metadata:', { userId, credits, plan })
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      console.log(`💰 Adding ${credits} credits to user ${userId} for plan ${plan}`)

      // Get current credits
      const { data: userData, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('credits, trainings_remaining')
        .eq('id', userId)
        .single()

      if (fetchError) {
        console.error('Error fetching user:', fetchError)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const currentCredits   = userData?.credits || 0
      const newCredits       = currentCredits + credits
      const currentTrainings = userData?.trainings_remaining || 0

      // Update credits + trainings
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          credits:              newCredits,
          trainings_remaining:  currentTrainings + 1,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating credits:', updateError)
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
      }

      // Log transaction
      await supabaseAdmin
        .from('credits_transactions')
        .insert({
          user_id:     userId,
          amount:      credits,
          type:        'purchase',
          description: `${plan} plan - Stripe session: ${session.id}`,
        })

      console.log(`✅ Successfully added ${credits} credits + 1 training. New balance: ${newCredits} credits`)

      // ── Stuur email naar jou als het een business klant is ──
      if (isBusiness) {
        try {
          await resend.emails.send({
            from: 'Nova Imago <onboarding@resend.dev>',
            to:   'novaimagosupport@gmail.com',
            subject: `🏢 Nieuwe business klant — factuur nodig!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #5B4E9D, #0D9488); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">🏢 Nieuwe Business Aankoop</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Nova Imago — Factuur nodig via Peppol</p>
                </div>

                <div style="padding: 32px; background: #f9f9f9; border: 1px solid #E8E6E0;">
                  <h2 style="color: #2D2D2D; margin-top: 0;">Klantgegevens</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6B6B6B; width: 40%;">Email klant</td>
                      <td style="padding: 8px 0; color: #2D2D2D; font-weight: bold;">${customerEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B6B6B;">Bedrijfsnaam</td>
                      <td style="padding: 8px 0; color: #2D2D2D; font-weight: bold;">${companyName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B6B6B;">BTW-nummer</td>
                      <td style="padding: 8px 0; color: #2D2D2D; font-weight: bold;">${vatNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B6B6B;">Pakket</td>
                      <td style="padding: 8px 0; color: #2D2D2D; font-weight: bold;">${plan} (${credits} credits)</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B6B6B;">Stripe Session</td>
                      <td style="padding: 8px 0; color: #2D2D2D; font-size: 12px;">${session.id}</td>
                    </tr>
                  </table>
                </div>

                <div style="padding: 24px; background: #FFF3CD; border: 1px solid #FFEEBA; border-radius: 0 0 12px 12px;">
                  <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Actie vereist</p>
                  <p style="margin: 8px 0 0 0; color: #856404; font-size: 14px;">
                    Maak een factuur aan in Billit en stuur deze via Peppol naar het BTW-nummer hierboven. 
                    Vermeld "Vrijgesteld van BTW - Kleine ondernemersregeling artikel 56bis W.BTW".
                  </p>
                </div>
              </div>
            `,
          })
          console.log('📧 Business notificatie email verstuurd naar novaimagosupport@gmail.com')
        } catch (emailError) {
          console.error('❌ Failed to send business notification email:', emailError)
        }
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}