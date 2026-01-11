import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    // Inline Supabase client
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

    // Inline Stripe client
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
    })

    const body = await request.json()
    const { email, plan, photoUrls } = body

    // Validate
    if (!email || !plan) {
      return NextResponse.json(
        { error: 'Invalid request. Need email and plan.' },
        { status: 400 }
      )
    }

    // Pricing
    const pricing: { [key: string]: number } = {
      starter: 2900,    // $29
      pro: 4900,        // $49
      executive: 9900,  // $99
    }

    const amount = pricing[plan] || 4900

    console.log('Creating order:', { email, plan, amount: amount / 100 })

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        plan,
        amount: amount / 100,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      throw orderError
    }

    console.log('Order created:', order.id)

    // Save uploaded photos (if provided)
    if (photoUrls && photoUrls.length > 0) {
      const { error: uploadError } = await supabase
        .from('uploads')
        .insert({
          order_id: order.id,
          photo_urls: photoUrls,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Photos saved for order:', order.id)
    }

    // Plan names for display
    const planNames: { [key: string]: string } = {
      starter: 'Starter Plan - 40 Headshots',
      pro: 'Professional Plan - 100 Headshots',
      executive: 'Executive Plan - 200 Headshots',
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planNames[plan] || 'AI Headshot Package',
              description: `Professional AI-generated headshots`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upload?plan=${plan}`,
      customer_email: email,
      metadata: {
        order_id: order.id,
        plan: plan,
      },
    })

    console.log('Stripe session created:', session.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutUrl: session.url,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}