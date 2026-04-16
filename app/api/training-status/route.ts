import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!

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

    // Check status bij RunPod
    try {
      const response = await fetch(
        `https://api.runpod.ai/v2/${process.env.RUNPOD_TRAINING_ENDPOINT_ID}/status/${user.trained_model_id}`,
        {
          headers: {
            'Authorization': `Bearer ${RUNPOD_API_KEY}`,
          }
        }
      )

      if (!response.ok) {
        throw new Error('RunPod status check failed')
      }

      const data = await response.json()
      const runpodStatus = data.status // IN_QUEUE, IN_PROGRESS, COMPLETED, FAILED, CANCELLED

      // Bereken geschatte tijd
      let estimatedMinutes = 0
      if (runpodStatus === 'IN_QUEUE' || runpodStatus === 'IN_PROGRESS') {
        const startTime = new Date(user.model_trained_at).getTime()
        const now = Date.now()
        const elapsedMinutes = Math.floor((now - startTime) / 60000)
        estimatedMinutes = Math.max(0, 30 - elapsedMinutes)
      }

      // Vertaal RunPod status naar onze status
      const statusMap: Record<string, string> = {
        'IN_QUEUE': 'starting',
        'IN_PROGRESS': 'processing',
        'COMPLETED': 'succeeded',
        'FAILED': 'failed',
        'CANCELLED': 'failed',
      }

      const mappedStatus = statusMap[runpodStatus] || 'starting'

      return NextResponse.json({
        status: mappedStatus,
        trainingId: user.trained_model_id,
        estimatedMinutesRemaining: estimatedMinutes,
        message: getStatusMessage(mappedStatus, estimatedMinutes)
      })

    } catch (runpodError) {
      console.error('RunPod status error:', runpodError)
      // Bij fout: toon "in progress" ipv "succeeded"
      return NextResponse.json({
        status: 'processing',
        trainingId: user.trained_model_id,
        estimatedMinutesRemaining: 20,
        message: 'Training in progress...'
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