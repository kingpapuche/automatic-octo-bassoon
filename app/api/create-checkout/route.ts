import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

// Prijs-ID's per munt via env (zodat test en live makkelijk wisselen).
// Fallback = de huidige TEST-prijs-ID's (EUR 29/39/59, USD 35/45/69).
// LIVE price-ID's (niet geheim). Optioneel te overschrijven via STRIPE_PRICE_<EUR|USD>_<TIER> env vars.
const PRICE_IDS = {
  EUR: {
    starter: process.env.STRIPE_PRICE_EUR_STARTER || 'price_1ULeHe0eDPd7Y2qZf783101X', // €29
    pro:     process.env.STRIPE_PRICE_EUR_PRO     || 'price_1ULeVY0eDPd7Y2qZCW9y1jtm', // €39
    premium: process.env.STRIPE_PRICE_EUR_PREMIUM || 'price_1ULeTN0eDPd7Y2qZ0L67YMMh', // €59
  },
  USD: {
    starter: process.env.STRIPE_PRICE_USD_STARTER || 'price_1TGJ250eDPd7Y2qZBWIVAwp2', // $35
    pro:     process.env.STRIPE_PRICE_USD_PRO     || 'price_1ULeWT0eDPd7Y2qZG9HPSuIq', // $45
    premium: process.env.STRIPE_PRICE_USD_PREMIUM || 'price_1TGJ6Y0eDPd7Y2qZB97lhNIm', // $69
  },
} as const

const CREDITS = {
  starter: 40,
  pro:     80,
  premium: 120,
}

export async function POST(request: NextRequest) {
  try {
    const { userId, priceId, isBusiness, currency } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const cur = currency === 'USD' ? 'USD' : 'EUR'
    const plan = priceId as keyof typeof CREDITS
    // Land van de klant (Vercel geo-header) -> in metadata voor "aankopen per land"
    const country = request.headers.get('x-vercel-ip-country') || ''

    if (!plan || !PRICE_IDS[cur][plan]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    const stripePriceId = PRICE_IDS[cur][plan]
    const planCredits = CREDITS[plan]

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buy-credits`,
      metadata: {
        userId:     userId,
        plan:       plan,
        credits:    planCredits.toString(),
        currency:   cur,
        country:    country,
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