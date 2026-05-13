import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fal } from '@fal-ai/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Haal user op
    const { data: user, error } = await supabase
      .from('users')
      .select('trained_model_id, model_trained_at, training_provider, lora_url')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Geen model gestart
    if (!user.trained_model_id) {
      return NextResponse.json({
        status: 'no_model',
        message: 'No training started yet'
      })
    }

    // Als lora_url al bestaat → training geslaagd
    if (user.lora_url) {
      return NextResponse.json({
        status: 'succeeded',
        trainingId: user.trained_model_id,
        message: 'Model is ready!'
      })
    }

    // Check status bij fal.ai
    try {
      const status = await fal.queue.status('fal-ai/flux-lora-portrait-trainer', {
        requestId: user.trained_model_id,
      })

      // Map fal.ai status naar onze interne status
      let mappedStatus: string
      if (status.status === 'IN_QUEUE') {
        mappedStatus = 'starting'
      } else if (status.status === 'IN_PROGRESS') {
        mappedStatus = 'processing'
      } else if (status.status === 'COMPLETED') {
        mappedStatus = 'succeeded'
      } else {
        mappedStatus = 'failed'
      }

      // Bij failed: null de stale velden in users tabel
      if (mappedStatus === 'failed') {
        await supabase
          .from('users')
          .update({
            trained_model_id: null,
            lora_url: null,
            trigger_word: null,
            model_trained_at: null,
          })
          .eq('id', userId)
      }

      // Bereken geschatte tijd (35 min totaal voor portrait-trainer)
      let estimatedMinutes = 0
      if (mappedStatus === 'starting' || mappedStatus === 'processing') {
        const startTime = new Date(user.model_trained_at).getTime()
        const now = Date.now()
        const elapsedMinutes = Math.floor((now - startTime) / 60000)
        estimatedMinutes = Math.max(0, 35 - elapsedMinutes)
      }

      return NextResponse.json({
        status: mappedStatus,
        trainingId: user.trained_model_id,
        estimatedMinutesRemaining: estimatedMinutes,
        message: getStatusMessage(mappedStatus, estimatedMinutes)
      })

    } catch (falError) {
      console.error('fal.ai status error:', falError)

      await supabase
        .from('users')
        .update({
          trained_model_id: null,
          lora_url: null,
          trigger_word: null,
          model_trained_at: null,
        })
        .eq('id', userId)

      return NextResponse.json({
        status: 'failed',
        trainingId: user.trained_model_id,
        message: 'Training failed. Please try again.'
      })
    }

  } catch (error) {
    console.error('Training status error:', error)
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}

function getStatusMessage(status: string, minutes: number): string {
  switch (status) {
    case 'starting':
      return 'Training is starting up...'
    case 'processing':
      return minutes > 0
        ? `Training in progress... ~${minutes} minutes remaining`
        : 'Training almost done...'
    case 'succeeded':
      return 'Model is ready!'
    case 'failed':
      return 'Training failed. Please try again.'
    default:
      return 'Checking status...'
  }
}