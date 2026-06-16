import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'
import JSZip from 'jszip'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

const REPLICATE_USERNAME = process.env.REPLICATE_USERNAME!
const TRAINER_VERSION = '4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa'

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
    const { userId, photoUrls } = await request.json()

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    if (!photoUrls || photoUrls.length < 8) {
      return NextResponse.json({ error: 'Need at least 8 photos' }, { status: 400 })
    }

    const { data: userData, error: userCheckError } = await supabase
      .from('users')
      .select('trainings_remaining, full_name')
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
    const validPhotos: Array<{ buffer: ArrayBuffer; ext: string }> = []

    for (const url of limitedPhotoUrls) {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        if (isValidImage(arrayBuffer)) {
          const bytes = new Uint8Array(arrayBuffer)
          let ext = 'jpg'
          if (bytes[0] === 0x89 && bytes[1] === 0x50) ext = 'png'
          else if (bytes[8] === 0x57 && bytes[9] === 0x45) ext = 'webp'
          validPhotos.push({ buffer: arrayBuffer, ext })
        }
      } catch {
        console.error(`Failed to fetch: ${url}`)
      }
    }

    if (validPhotos.length < 8) {
      return NextResponse.json(
        { error: `Only ${validPhotos.length} valid photos.` },
        { status: 400 }
      )
    }

    // ZIP bouwen + uploaden
    const zip = new JSZip()
    validPhotos.forEach((photo, index) => {
      zip.file(`photo_${index + 1}.${photo.ext}`, photo.buffer)
    })

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    const zipFileName = `training-zips/${userId}-${Date.now()}.zip`

    const { error: uploadError } = await supabase.storage
      .from('headshots')
      .upload(zipFileName, zipBuffer, { contentType: 'application/zip' })

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload training data' }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from('headshots').getPublicUrl(zipFileName)
    const zipUrl = publicUrlData.publicUrl

    // Trigger word + destination
    const uniqueSuffix = Date.now().toString(36).toLowerCase().slice(-4)
    const userIdShort = userId.replace(/-/g, '').slice(0, 8).toLowerCase()
    const triggerWord = `person_${userIdShort}_${uniqueSuffix}`
    const destinationModelName = `headshot-${userIdShort}-${uniqueSuffix}`
    const destinationFullPath = `${REPLICATE_USERNAME}/${destinationModelName}`

    // Maak destination model
    try {
      await replicate.models.create(REPLICATE_USERNAME, destinationModelName, {
        visibility: 'private',
        hardware: 'gpu-t4',
        description: `Headshot model for user ${userId}`,
      })
    } catch (modelError: unknown) {
      const errMsg = modelError instanceof Error ? modelError.message : String(modelError)
      if (!errMsg.includes('already exists')) {
        return NextResponse.json({ error: 'Failed to create destination model' }, { status: 500 })
      }
    }

    // Webhook URL met userId + modelPath als query params
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/training-webhook?userId=${userId}&modelPath=${encodeURIComponent(destinationFullPath)}`

    const training = await replicate.trainings.create(
      'ostris',
      'flux-dev-lora-trainer',
      TRAINER_VERSION,
      {
        destination: destinationFullPath as `${string}/${string}`,
        input: {
          input_images: zipUrl,
          trigger_word: triggerWord,
          steps: 800, // verlaagd van 1000: minder overfit -> minder amateur-achtergrond-lek
          lora_rank: 16,
          batch_size: 1,
          resolution: '512,768,1024',
          autocaption: true,
          learning_rate: 0.0004,
        },
        webhook: webhookUrl,
        webhook_events_filter: ['completed'],
      }
    )

    // Sla op: trained_model_id = training.id (wordt later overschreven door webhook)
    await supabase
      .from('users')
      .update({
        trained_model_id: training.id,
        trigger_word: triggerWord,
        model_trained_at: new Date().toISOString(),
        trainings_remaining: trainingsRemaining - 1,
      })
      .eq('id', userId)

    return NextResponse.json({
      success: true,
      trainingId: training.id,
      triggerWord,
      validPhotos: validPhotos.length,
      message: 'Training started! This takes about 20-30 minutes.',
    })

  } catch (error) {
    console.error('Training error:', error)
    return NextResponse.json(
      { error: 'Training failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}