import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Price IDs from Stripe
const PRICE_IDS = {
  starter: 'price_1SosE81mfNQUAnELpy6yPFXe',
  pro: 'price_1SosEu1mfNQUAnELbIDepyMp',
  premium: 'price_1SosFW1mfNQUAnELacoUArM7',
}

// Credits per plan
const CREDITS = {
  starter: 40,
  pro: 100,
  premium: 150,
}

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, userEmail } = await request.json()

    // Validate plan
    if (!plan || !PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Validate user
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS]
    const credits = CREDITS[plan as keyof typeof CREDITS]

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buy-credits`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        plan: plan,
        credits: credits.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}