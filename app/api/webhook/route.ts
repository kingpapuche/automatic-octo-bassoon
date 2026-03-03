import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const credits = parseInt(session.metadata?.credits || '0')
      const plan = session.metadata?.plan

      if (!userId || !credits) {
        console.error('Missing metadata:', { userId, credits, plan })
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        )
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
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const currentCredits = userData?.credits || 0
      const newCredits = currentCredits + credits
      const currentTrainings = userData?.trainings_remaining || 0

      // Update credits + add 1 training allowance
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          credits: newCredits,
          trainings_remaining: currentTrainings + 1,  // +1 training per pakket
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating credits:', updateError)
        return NextResponse.json(
          { error: 'Failed to update credits' },
          { status: 500 }
        )
      }

      // Log the transaction
      const { error: transactionError } = await supabaseAdmin
        .from('credits_transactions')
        .insert({
          user_id: userId,
          amount: credits,
          type: 'purchase',
          description: `${plan} plan - Stripe session: ${session.id}`,
        })

      if (transactionError) {
        console.error('Error logging transaction:', transactionError)
      }

      console.log(`✅ Successfully added ${credits} credits + 1 training. New balance: ${newCredits} credits, ${currentTrainings + 1} trainings remaining`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}