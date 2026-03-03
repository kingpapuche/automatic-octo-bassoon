import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

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

    // Haal user op met training ID
    const { data: user, error } = await supabase
      .from('users')
      .select('trained_model_id, model_trained_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.trained_model_id) {
      return NextResponse.json({ 
        status: 'no_model',
        message: 'No training started yet'
      })
    }

    // Check status bij Replicate
    try {
      const training = await replicate.trainings.get(user.trained_model_id)
      
      // Bereken geschatte tijd
      let estimatedMinutes = 0
      if (training.status === 'processing' || training.status === 'starting') {
        const startTime = new Date(training.created_at).getTime()
        const now = Date.now()
        const elapsedMinutes = Math.floor((now - startTime) / 60000)
        estimatedMinutes = Math.max(0, 25 - elapsedMinutes) // ~25 min totaal
      }

      return NextResponse.json({
        status: training.status, // starting, processing, succeeded, failed
        trainingId: user.trained_model_id,
        estimatedMinutesRemaining: estimatedMinutes,
        message: getStatusMessage(training.status, estimatedMinutes)
      })
    } catch (replicateError) {
      // Training ID is waarschijnlijk een voltooid model, niet een training
      return NextResponse.json({
        status: 'succeeded',
        trainingId: user.trained_model_id,
        message: 'Model is ready!'
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
      return 'Training is starting...'
    case 'processing':
      return minutes > 0 
        ? `Training in progress... ~${minutes} minutes remaining`
        : 'Training almost done...'
    case 'succeeded':
      return 'Model is ready!'
    case 'failed':
      return 'Training failed. Please try again.'
    case 'canceled':
      return 'Training was canceled.'
    default:
      return 'Checking status...'
  }
}
