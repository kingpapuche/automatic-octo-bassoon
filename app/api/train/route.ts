import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import JSZip from 'jszip'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

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

function generateTriggerWord(userId: string): string {
  const uniquePart = userId.replace(/-/g, '').slice(0, 8).toUpperCase()
  return `PERSON_${uniquePart}`
}

function buildCaptionPrefix(triggerWord: string, user: any): string {
  const parts: string[] = [`a photo of ${triggerWord}`]
  
  if (user.ethnicity && user.gender) {
    const article = ['a', 'e', 'i', 'o', 'u'].includes(user.ethnicity[0]?.toLowerCase()) ? 'an' : 'a'
    parts.push(`${article} ${user.ethnicity} ${user.gender}`)
  } else if (user.gender) {
    parts.push(`a ${user.gender}`)
  }
  
  if (user.eye_color) parts.push(`with ${user.eye_color} eyes`)
  if (user.is_bald) parts.push(`bald head`)
  else if (user.hair_color) parts.push(`${user.hair_color} hair`)
  if (user.has_glasses) parts.push(`wearing glasses`)
  
  return parts.join(', ')
}

export async function POST(request: NextRequest) {
  try {
    const { userId, photoUrls, modelName } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (!photoUrls || photoUrls.length < 10) {
      return NextResponse.json(
        { error: 'Need at least 10 photos for training' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'No trainings remaining. Please purchase a new package to train a new model.' },
        { status: 403 }
      )
    }

    const limitedPhotoUrls = photoUrls.slice(0, 20)
    console.log(`🚀 Starting training for user: ${userId} with ${limitedPhotoUrls.length} photos`)

    // Unieke trigger word per training — op basis van timestamp zodat meerdere modellen uniek zijn
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4)
    const triggerWord = `PERSON_${userId.replace(/-/g, '').slice(0, 6).toUpperCase()}_${uniqueSuffix}`
    console.log(`🎯 Trigger word: ${triggerWord}`)

    let captionPrefix = `a photo of ${triggerWord}`
    if (userData) {
      captionPrefix = buildCaptionPrefix(triggerWord, userData)
    }
    console.log(`📝 Caption prefix: ${captionPrefix}`)

    const zip = new JSZip()
    for (let i = 0; i < limitedPhotoUrls.length; i++) {
      try {
        const response = await fetch(limitedPhotoUrls[i])
        const arrayBuffer = await response.arrayBuffer()
        zip.file(`photo_${i + 1}.jpg`, arrayBuffer)
      } catch (error) {
        console.error(`Failed to fetch photo ${i}:`, error)
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    const zipFilename = `training/${userId}/${Date.now()}.zip`
    
    const { error: uploadError } = await supabase.storage
      .from('headshots')
      .upload(zipFilename, zipBuffer, { contentType: 'application/zip', upsert: true })

    if (uploadError) throw new Error(`Failed to upload ZIP: ${uploadError.message}`)

    const { data: zipUrlData } = supabase.storage.from('headshots').getPublicUrl(zipFilename)
    const zipUrl = zipUrlData.publicUrl

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const webhookUrl = `${baseUrl}/api/training-webhook`
    const webhookConfig = webhookUrl.startsWith('https://') 
      ? { webhook: webhookUrl, webhook_events_filter: ['completed'] as const }
      : {}

    const training = await replicate.trainings.create(
      'ostris',
      'flux-dev-lora-trainer',
      'e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497',
      {
        destination: 'kingpapuche/headshot-model',
        input: {
          input_images: zipUrl,
          trigger_word: triggerWord,
          steps: 800,
          lora_rank: 16,
          learning_rate: 0.0004,
          batch_size: 1,
          resolution: '1024',
          autocaption: true,
          autocaption_prefix: captionPrefix,
        },
        ...webhookConfig,
      }
    )

    console.log(`🎯 Training started: ${training.id}`)

    // === NIEUW: Sla model op in aparte 'models' tabel ===
    const modelDisplayName = modelName || userData.full_name || `Model ${new Date().toLocaleDateString()}`
    
    const { error: modelInsertError } = await supabase
      .from('models')
      .insert({
        user_id: userId,
        training_id: training.id,
        trigger_word: triggerWord,
        name: modelDisplayName,
        status: 'training',
      })

    if (modelInsertError) {
      console.error('⚠️ Failed to save to models table:', modelInsertError)
      // Niet fataal — gaan we door
    } else {
      console.log(`✅ Model saved to models table: ${modelDisplayName}`)
    }

    // === Bestaande users tabel ook updaten (backward compatibility) ===
    const { error: updateError } = await supabase
      .from('users')
      .update({
        trained_model_id: training.id,
        trigger_word: triggerWord,
        model_trained_at: new Date().toISOString(),
        trainings_remaining: trainingsRemaining - 1,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to update user:', updateError)
    }

    return NextResponse.json({
      success: true,
      trainingId: training.id,
      status: training.status,
      triggerWord: triggerWord,
      trainingsRemaining: trainingsRemaining - 1,
      message: 'Training started! This takes about 15-20 minutes.',
    })

  } catch (error) {
    console.error('❌ Training error:', error)
    return NextResponse.json(
      {
        error: 'Training failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}