import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

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

export async function POST(request: NextRequest) {
  try {
    const { trainingId } = await request.json()
    if (!trainingId) return NextResponse.json({ error: 'Missing trainingId' }, { status: 400 })

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

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}