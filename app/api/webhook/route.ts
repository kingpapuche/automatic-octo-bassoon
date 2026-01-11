import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Initialize Supabase
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify the webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      )
    }

    console.log('Webhook event type:', event.type)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Payment succeeded for session:', session.id)
      console.log('Order ID from metadata:', session.metadata?.order_id)

      const orderId = session.metadata?.order_id

      if (!orderId) {
        console.error('No order_id in session metadata')
        return NextResponse.json(
          { error: 'No order_id in metadata' },
          { status: 400 }
        )
      }

      // Update order status to 'paid'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId)
        .select()
        .single()

      if (orderError) {
        console.error('Error updating order:', orderError)
        throw orderError
      }

      console.log('Order updated to paid:', order.id)

      // Save payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          stripe_session_id: session.id,
          amount: (session.amount_total || 0) / 100,
          status: 'completed',
        })

      if (paymentError) {
        console.error('Error saving payment:', paymentError)
        // Don't throw - order is already updated
      }

      console.log('Payment record saved for order:', orderId)

      // Trigger AI generation
      console.log('Triggering AI generation for order:', orderId)
      
      // Call the generate API in the background (don't wait for it)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      }).catch(err => {
        console.error('Error triggering AI generation:', err)
      })

      console.log('AI generation triggered in background')
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}