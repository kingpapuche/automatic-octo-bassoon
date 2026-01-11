import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import JSZip from 'jszip'

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

export async function POST(request: NextRequest) {
  let orderId: string | undefined

  try {
    const body = await request.json()
    orderId = body.orderId

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    console.log('🚀 Starting AI generation for order:', orderId)

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get uploaded photos
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (uploadError || !upload) {
      console.error('❌ Upload not found:', uploadError)
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    console.log(`📸 Found ${upload.photo_urls.length} photos to process`)

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orderId)

    console.log('👔 Order status updated to: processing')

    const headshotCounts: { [key: string]: number } = {
      starter: 40,
      pro: 100,
      executive: 200,
    }
    const numHeadshots = headshotCounts[order.plan] || 100

    console.log(`🎨 Will generate ${numHeadshots} headshots for ${order.plan} plan`)

    // STEP 1: Download all photos and create ZIP
    console.log('📥 Downloading photos and creating ZIP...')
    
    const zip = new JSZip()
    
    for (let i = 0; i < upload.photo_urls.length; i++) {
      const photoUrl = upload.photo_urls[i]
      
      try {
        const response = await fetch(photoUrl)
        if (!response.ok) {
          throw new Error(`Failed to download photo ${i}: ${response.statusText}`)
        }
        
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Add to ZIP with simple numbered names
        zip.file(`photo_${i + 1}.jpg`, buffer)
        
        console.log(`✅ Downloaded photo ${i + 1}/${upload.photo_urls.length}`)
      } catch (downloadError) {
        console.error(`❌ Failed to download photo ${i}:`, downloadError)
        throw downloadError
      }
    }

    // Generate ZIP buffer
    console.log('🗜️ Compressing ZIP...')
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    console.log(`✅ ZIP created: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`)

    // STEP 2: Upload ZIP to Supabase Storage
    console.log('📤 Uploading ZIP to Supabase...')
    
    const zipFilename = `${orderId}/training-photos.zip`
    
    const { data: zipUploadData, error: zipUploadError } = await supabase.storage
      .from('headshots')
      .upload(zipFilename, zipBuffer, {
        contentType: 'application/zip',
        cacheControl: '3600',
        upsert: true,
      })

    if (zipUploadError) {
      console.error('❌ Failed to upload ZIP:', zipUploadError)
      throw new Error(`Failed to upload ZIP: ${zipUploadError.message}`)
    }

    // Get public URL for ZIP
    const { data: zipPublicUrlData } = supabase.storage
      .from('headshots')
      .getPublicUrl(zipFilename)

    const zipUrl = zipPublicUrlData.publicUrl

    console.log('✅ ZIP uploaded:', zipUrl)

    // STEP 3: Create destination model
    const modelName = `headshot-${orderId.slice(0, 8)}`
    const modelOwner = 'kingpapuche'

    console.log('📦 Creating destination model:', `${modelOwner}/${modelName}`)
    
    const createModelResponse = await fetch(
      'https://api.replicate.com/v1/models',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: modelOwner,
          name: modelName,
          visibility: 'private',
          hardware: 'gpu-t4',
          description: 'AI Headshot Model',
        }),
      }
    )

    // 409 means model already exists, which is fine
    if (!createModelResponse.ok && createModelResponse.status !== 409) {
      const errorText = await createModelResponse.text()
      console.error('❌ Failed to create model:', errorText)
      throw new Error(`Failed to create model: ${errorText}`)
    }

    console.log('✅ Model created or already exists')

    // STEP 4: Start training with ZIP file
    console.log('🧠 Starting FLUX LoRA training via HTTP API...')

    const trainingResponse = await fetch(
      'https://api.replicate.com/v1/models/ostris/flux-dev-lora-trainer/versions/e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497/trainings',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: `${modelOwner}/${modelName}`,
          input: {
            input_images: zipUrl,
            steps: 1500,
            lora_rank: 16,
            optimizer: 'adamw8bit',
            batch_size: 1,
            resolution: '512,768,1024',
            autocaption: false,
            trigger_word: 'TOK',
            learning_rate: 0.0004,
            wandb_project: 'flux_train_replicate',
            wandb_save_interval: 100,
            caption_dropout_rate: 0.05,
            cache_latents_to_disk: false,
            wandb_sample_interval: 100,
          },
        }),
      }
    )

    if (!trainingResponse.ok) {
      const errorText = await trainingResponse.text()
      console.error('❌ Training failed:', errorText)
      throw new Error(`Training failed: ${trainingResponse.status} - ${errorText}`)
    }

    const training = await trainingResponse.json()

    console.log('✅ Training started:', training.id)
    console.log('⏱️  Training will take ~15-20 minutes...')

    // STEP 5: Poll for training completion
    let trainingStatus = training
    let attempts = 0
    const maxAttempts = 60

    while (
      trainingStatus.status !== 'succeeded' &&
      trainingStatus.status !== 'failed' &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 60000)) // 1 min

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/trainings/${training.id}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      )

      if (statusResponse.ok) {
        trainingStatus = await statusResponse.json()
        attempts++
        console.log(`🔄 Training status: ${trainingStatus.status} (${attempts} min)`)
      } else {
        attempts++
        console.log(`⚠️  Failed to check status, retrying... (${attempts} min)`)
      }

      if (trainingStatus.status === 'failed') {
        throw new Error(`Training failed: ${JSON.stringify(trainingStatus.error)}`)
      }
    }

    if (trainingStatus.status !== 'succeeded') {
      throw new Error('Training timed out after 60 minutes')
    }

    console.log('🎉 Training completed!')

    const trainedModelVersion = trainingStatus.output?.version

    if (!trainedModelVersion) {
      throw new Error('No trained model version returned')
    }

    console.log('📦 Trained model version:', trainedModelVersion)

    // STEP 6: Generate headshots
    console.log('🎨 Generating headshots...')

    const generatedUrls: string[] = []
    const prompts = [
      'TOK person professional corporate headshot, navy suit, gray background, studio lighting',
      'TOK person executive portrait, charcoal suit, neutral background, professional lighting',
      'TOK person LinkedIn headshot, business casual, soft gray background, natural lighting',
      'TOK person corporate photo, black suit, white background, studio lighting',
      'TOK person professional headshot, modern style, clean background, perfect lighting',
    ]

    for (let i = 0; i < 5; i++) {
      try {
        const predictionResponse = await fetch(
          'https://api.replicate.com/v1/predictions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              version: trainedModelVersion,
              input: {
                prompt: prompts[i],
                num_outputs: 1,
                aspect_ratio: '1:1',
                output_format: 'webp',
                output_quality: 90,
              },
            }),
          }
        )

        if (!predictionResponse.ok) {
          console.error(`⚠️  Failed to create prediction ${i + 1}`)
          continue
        }

        const prediction = await predictionResponse.json()

        // Wait for completion
        let finalPrediction = prediction
        let predAttempts = 0
        while (
          finalPrediction.status !== 'succeeded' &&
          finalPrediction.status !== 'failed' &&
          predAttempts < 30
        ) {
          await new Promise((resolve) => setTimeout(resolve, 2000))

          const statusResponse = await fetch(
            `https://api.replicate.com/v1/predictions/${prediction.id}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
              },
            }
          )

          if (statusResponse.ok) {
            finalPrediction = await statusResponse.json()
          }
          predAttempts++
        }

        if (finalPrediction.output) {
          const replicateUrl = Array.isArray(finalPrediction.output)
            ? finalPrediction.output[0]
            : finalPrediction.output

          console.log(`✅ Headshot ${i + 1}/5 generated, downloading...`)

          // Download from Replicate
          try {
            const downloadResponse = await fetch(replicateUrl)
            if (!downloadResponse.ok) {
              throw new Error(`Failed to download: ${downloadResponse.statusText}`)
            }

            const arrayBuffer = await downloadResponse.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Upload to Supabase Storage
            const filename = `${orderId}/headshot-${i + 1}.webp`

            const { error: uploadError } = await supabase.storage
              .from('headshots')
              .upload(filename, buffer, {
                contentType: 'image/webp',
                cacheControl: '31536000', // 1 year
                upsert: true,
              })

            if (uploadError) {
              console.error(`❌ Failed to upload headshot ${i + 1}:`, uploadError)
              // Fallback to Replicate URL if upload fails
              generatedUrls.push(replicateUrl)
            } else {
              // Get permanent Supabase URL
              const { data: publicUrlData } = supabase.storage
                .from('headshots')
                .getPublicUrl(filename)

              generatedUrls.push(publicUrlData.publicUrl)
              console.log(`💾 Headshot ${i + 1}/5 saved to Supabase`)
            }
          } catch (downloadError) {
            console.error(`❌ Error downloading headshot ${i + 1}:`, downloadError)
            // Fallback to Replicate URL
            generatedUrls.push(replicateUrl)
          }
        }
      } catch (genError) {
        console.error(`❌ Error generating headshot ${i + 1}:`, genError)
      }
    }

    console.log(`🎉 Generated and saved ${generatedUrls.length} headshots total`)

    // STEP 7: Save to database
    const { data: generation } = await supabase
      .from('generations')
      .insert({
        order_id: orderId,
        result_urls: generatedUrls,
        trained_model_version: trainedModelVersion,
        status: 'completed',
      })
      .select()
      .single()

    await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId)

    console.log('🎉 AI generation completed!')

    return NextResponse.json({
      success: true,
      orderId,
      headshotsGenerated: generatedUrls.length,
      generationId: generation?.id,
    })
  } catch (error) {
    console.error('💥 AI generation error:', error)

    if (orderId) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('id', orderId)
      } catch (updateError) {
        console.error('❌ Error updating order status:', updateError)
      }
    }

    return NextResponse.json(
      {
        error: 'AI generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
