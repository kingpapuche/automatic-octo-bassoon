import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

function getStatusMessage(status: string, startedAt?: string): { message: string; estimatedMinutes?: number } {
  switch (status) {
    case 'starting':
      return { message: 'Training is queued. Starts within 1-2 minutes.', estimatedMinutes: 25 }
    case 'processing': {
      if (startedAt) {
        const elapsedMin = Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000)
        const remaining = Math.max(1, 25 - elapsedMin)
        return {
          message: `In progress (${elapsedMin} min elapsed). About ${remaining} min remaining.`,
          estimatedMinutes: remaining,
        }
      }
      return { message: 'In progress. Takes 20-30 minutes.', estimatedMinutes: 25 }
    }
    case 'succeeded':
      return { message: 'Training complete! Your model is ready.' }
    case 'failed':
      return { message: 'Training failed. Please try again.' }
    case 'canceled':
      return { message: 'Training was canceled.' }
    default:
      return { message: `Status: ${status}` }
  }
}

async function getStatusForUser(userId: string) {
  const { data: userData } = await supabase
    .from('users')
    .select('trained_model_id')
    .eq('id', userId)
    .single()

  if (!userData?.trained_model_id) {
    return { success: true, status: null, message: 'No active training' }
  }

  // Als trained_model_id een ':' bevat → training is voltooid (= "owner/name:version")
  if (userData.trained_model_id.includes(':')) {
    return {
      success: true,
      status: 'succeeded',
      message: 'Your model is ready!',
    }
  }

  // Anders: het is een training_id, check status op Replicate
  const training = await replicate.trainings.get(userData.trained_model_id)
  const { message, estimatedMinutes } = getStatusMessage(training.status, training.started_at ?? undefined)

  return {
    success: true,
    status: training.status,
    message,
    estimatedMinutes,
    startedAt: training.started_at,
    completedAt: training.completed_at,
    error: training.error,
  }
}

// GET: ?userId=xxx (gebruikt door de frontend)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const result = await getStatusForUser(userId)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// POST: { trainingId } of { userId } in body (backup)
export async function POST(request: NextRequest) {
  try {
    const { trainingId, userId } = await request.json()

    if (trainingId) {
      const training = await replicate.trainings.get(trainingId)
      const { message, estimatedMinutes } = getStatusMessage(training.status, training.started_at ?? undefined)
      return NextResponse.json({
        success: true,
        status: training.status,
        message,
        estimatedMinutes,
        startedAt: training.started_at,
        completedAt: training.completed_at,
        error: training.error,
      })
    }

    if (userId) {
      const result = await getStatusForUser(userId)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Missing trainingId or userId' }, { status: 400 })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}