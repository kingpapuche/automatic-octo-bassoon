import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// Zelfbedienings-terugbetaling met automatische, EU-conforme logica:
//   - al gedownload                -> geen refund (product gebruikt)
//   - al gegenereerd (sinds koop)  -> geen auto-refund; profielwaardig-garantie via support
//   - niks gebruikt + binnen 14 dagen -> AUTOMATISCHE refund via Stripe + credits/trainingen terug
//   - ouder dan 14 dagen           -> buiten de termijn
// "Gegenereerd" is het niet-te-omzeilen signaal (je kunt niet downloaden zonder te genereren).

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})
const WITHDRAWAL_DAYS = 14

export async function POST(request: Request) {
  try {
    // Identiteit verifiëren via het access token van de ingelogde klant.
    const token = (request.headers.get('authorization') || '').replace('Bearer ', '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) return NextResponse.json({ ok: false, reason: 'auth' }, { status: 401 })
    const userId = user.id

    // Laatste aankoop ophalen.
    const { data: purchase } = await supabaseAdmin
      .from('credits_transactions')
      .select('id, amount, description, created_at')
      .eq('user_id', userId)
      .eq('type', 'purchase')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!purchase) return NextResponse.json({ ok: false, reason: 'no_purchase' })

    // Al terugbetaald na deze aankoop?
    const { data: existingRefund } = await supabaseAdmin
      .from('credits_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'refund')
      .gte('created_at', purchase.created_at)
      .limit(1)
      .maybeSingle()
    if (existingRefund) return NextResponse.json({ ok: false, reason: 'already_refunded' })

    // Al gedownload? (hard nee)
    const { count: dlCount } = await supabaseAdmin
      .from('downloads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    if ((dlCount ?? 0) > 0) return NextResponse.json({ ok: false, reason: 'downloaded' })

    // Al gegenereerd sinds de aankoop? (product gebruikt -> garantie via support)
    const { count: genCount } = await supabaseAdmin
      .from('generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', purchase.created_at)
    if ((genCount ?? 0) > 0) return NextResponse.json({ ok: false, reason: 'used' })

    // Binnen de 14-dagen herroepingstermijn?
    const ageDays = (Date.now() - new Date(purchase.created_at).getTime()) / 86_400_000
    if (ageDays > WITHDRAWAL_DAYS) return NextResponse.json({ ok: false, reason: 'window' })

    // --- Toegestaan: automatische terugbetaling ---
    const sessionId = (purchase.description || '').match(/cs_[A-Za-z0-9_]+/)?.[0]
    if (!sessionId) return NextResponse.json({ ok: false, reason: 'manual' })

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const pi = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id
    if (!pi) return NextResponse.json({ ok: false, reason: 'manual' })

    await stripe.refunds.create({ payment_intent: pi })

    // Credits + trainingen terugnemen (klant gebruikte niks). Nooit onder 0.
    const plan = (purchase.description || '').split(' ')[0].toLowerCase()
    const trainingsBack = plan === 'premium' ? 2 : 1
    const { data: u } = await supabaseAdmin
      .from('users')
      .select('credits, trainings_remaining')
      .eq('id', userId)
      .maybeSingle()
    await supabaseAdmin
      .from('users')
      .update({
        credits: Math.max(0, (u?.credits ?? 0) - (purchase.amount ?? 0)),
        trainings_remaining: Math.max(0, (u?.trainings_remaining ?? 0) - trainingsBack),
      })
      .eq('id', userId)

    await supabaseAdmin.from('credits_transactions').insert({
      user_id: userId,
      amount: -(purchase.amount ?? 0),
      type: 'refund',
      description: `Auto-refund - ${sessionId}`,
    })

    console.log(`💸 Auto-refund verwerkt voor user ${userId} (${sessionId})`)
    return NextResponse.json({ ok: true, reason: 'refunded' })
  } catch (e) {
    console.error('request-refund:', e)
    return NextResponse.json({ ok: false, reason: 'error' }, { status: 500 })
  }
}
