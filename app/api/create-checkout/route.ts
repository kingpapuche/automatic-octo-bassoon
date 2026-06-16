import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

// Prijs-ID's via env (zodat sandbox/test en live makkelijk wisselen).
// Geen env gezet -> fallback naar de live prijs-ID's, dus productie blijft werken.
const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_1TGJ250eDPd7Y2qZBWIVAwp2',
  pro:     process.env.STRIPE_PRICE_PRO     || 'price_1TGJ4D0eDPd7Y2qZnAeyri3K',
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_1TGJ6Y0eDPd7Y2qZB97lhNIm',
}

const CREDITS = {
  starter: 40,
  pro:     80,
  premium: 120,
}

export async function POST(request: NextRequest) {
  try {
    const { userId, priceId, isBusiness } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    if (!priceId || !PRICE_IDS[priceId as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    const stripePriceId = PRICE_IDS[priceId as keyof typeof PRICE_IDS]
    const planCredits = CREDITS[priceId as keyof typeof CREDITS]

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buy-credits`,
      metadata: {
        userId:     userId,
        plan:       priceId,
        credits:    planCredits.toString(),
        isBusiness: isBusiness ? 'true' : 'false',
      },
    }

    // Alleen voor (Belgische) bedrijven: Stripe verzamelt adres + BTW (gevalideerd)
    // en maakt een factuur aan -> Billit-app zet die om naar een Peppol e-factuur.
    // Particulieren houden een wrijvingsloze checkout (geen extra velden).
    if (isBusiness) {
      params.customer_creation = 'always'
      params.billing_address_collection = 'required'
      params.tax_id_collection = { enabled: true }
      params.invoice_creation = { enabled: true }
    }

    const session = await stripe.checkout.sessions.create(params)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}