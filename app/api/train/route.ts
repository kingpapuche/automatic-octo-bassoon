import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!
const RUNPOD_TRAINING_ENDPOINT = process.env.RUNPOD_TRAINING_ENDPOINT_ID!

function isValidImage(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { userId, photoUrls, modelName } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!photoUrls || photoUrls.length < 8) {
      return NextResponse.json({ error: 'Need at least 8 photos for training' }, { status: 400 })
    }

    const { data: userData, error: userCheckError } = await supabase
      .from('users')
      .select('trainings_remaining, gender, ethnicity, eye_color, hair_color, is_bald, has_glasses, full_name')
      .eq('id', userId)
      .single()

    if (userCheckError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const trainingsRemaining = userData.trainings_remaining ?? 0
    if (trainingsRemaining <= 0) {
      return NextResponse.json({ error: 'No trainings remaining.' }, { status: 403 })
    }

    // Valideer foto's
    const limitedPhotoUrls = photoUrls.slice(0, 20)
    const validPhotoUrls: string[] = []

    for (const url of limitedPhotoUrls) {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        if (isValidImage(arrayBuffer)) validPhotoUrls.push(url)
        else console.warn(`⚠️ Skipping invalid photo: ${url}`)
      } catch {
        console.error(`❌ Failed to fetch photo: ${url}`)
      }
    }

    if (validPhotoUrls.length < 8) {
      return NextResponse.json(
        { error: `Only ${validPhotoUrls.length} valid photos. Need at least 8.` },
        { status: 400 }
      )
    }

    // Trigger word aanmaken
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4)
    const triggerWord = `PERSON_${userId.replace(/-/g, '').slice(0, 6).toUpperCase()}_${uniqueSuffix}`
    console.log(`🎯 Trigger word: ${triggerWord}`)

    // RunPod training starten
    const runpodResponse = await fetch(
      `https://api.runpod.ai/v2/${RUNPOD_TRAINING_ENDPOINT}/run`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RUNPOD_API_KEY}`,
        },
        body: JSON.stringify({
          input: {
            image_urls: validPhotoUrls,
            trigger_word: triggerWord,
            user_id: userId,
          },
        }),
      }
    )

    if (!runpodResponse.ok) {
      const error = await runpodResponse.text()
      throw new Error(`RunPod error: ${error}`)
    }

    const runpodData = await runpodResponse.json()
    const trainingJobId = runpodData.id
    console.log(`🚀 RunPod job started: ${trainingJobId}`)

    // Opslaan in database
    const modelDisplayName = modelName || userData.full_name || `Model ${new Date().toLocaleDateString()}`

    await supabase.from('models').insert({
      user_id: userId,
      training_id: trainingJobId,
      trigger_word: triggerWord,
      name: modelDisplayName,
      status: 'training',
    })

    await supabase
      .from('users')
      .update({
        trained_model_id: trainingJobId,
        trigger_word: triggerWord,
        model_trained_at: new Date().toISOString(),
        trainings_remaining: trainingsRemaining - 1,
        training_provider: 'runpod',
      })
      .eq('id', userId)

    return NextResponse.json({
      success: true,
      trainingId: trainingJobId,
      status: 'IN_QUEUE',
      triggerWord,
      validPhotos: validPhotoUrls.length,
      trainingsRemaining: trainingsRemaining - 1,
      message: 'Training started! This takes about 20-30 minutes.',
    })

  } catch (error) {
    console.error('❌ Training error:', error)
    return NextResponse.json(
      { error: 'Training failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}