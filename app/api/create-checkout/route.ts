import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const PRICE_IDS = {
  starter: 'price_1SosE81mfNQUAnELpy6yPFXe',
  pro:     'price_1SosEu1mfNQUAnELbIDepyMp',
  premium: 'price_1SosFW1mfNQUAnELacoUArM7',
}

const CREDITS = {
  starter: 40,
  pro:     100,
  premium: 150,
}

export async function POST(request: NextRequest) {
  try {
    const { userId, priceId, credits, amount, isBusiness, companyName, vatNumber } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    if (!priceId || !PRICE_IDS[priceId as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    if (isBusiness && (!companyName || !vatNumber)) {
      return NextResponse.json({ error: 'Company name and VAT number are required for business purchases' }, { status: 400 })
    }

    const stripePriceId = PRICE_IDS[priceId as keyof typeof PRICE_IDS]
    const planCredits = CREDITS[priceId as keyof typeof CREDITS]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buy-credits`,
      metadata: {
        userId:      userId,
        plan:        priceId,
        credits:     planCredits.toString(),
        isBusiness:  isBusiness ? 'true' : 'false',
        companyName: companyName || '',
        vatNumber:   vatNumber || '',
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}