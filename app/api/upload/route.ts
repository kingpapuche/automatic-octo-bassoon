import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

// Helper: wait between uploads to avoid rate limits
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper: upload with retry (max 3 attempts)
async function uploadWithRetry(
  bucket: string,
  filename: string,
  buffer: Buffer,
  options: { contentType: string; cacheControl: string; upsert: boolean },
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, options)

    if (!error) return { data, error: null }

    console.log(`⚠️ Upload attempt ${attempt}/${maxRetries} failed: ${error.message}`)

    if (attempt < maxRetries) {
      // Wait longer each retry: 1s, 2s, 3s
      await delay(attempt * 1000)
    } else {
      return { data: null, error }
    }
  }
  return { data: null, error: new Error('Upload failed after retries') }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const files = formData.getAll('photos') as File[]

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 })
    }

    if (files.length < 8) {
      return NextResponse.json(
        { error: `Please upload at least 8 photos. You uploaded ${files.length}.` },
        { status: 400 }
      )
    }

    if (files.length > 20) {
      return NextResponse.json(
        { error: `Maximum 20 photos allowed. You uploaded ${files.length}.` },
        { status: 400 }
      )
    }

    console.log(`📸 Uploading ${files.length} photos for user: ${userId}`)

    // Upload all photos to Supabase Storage
    const photoUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${userId}/${timestamp}-${i}.jpg`

      // Upload with retry logic
      const { data, error } = await uploadWithRetry(
        'headshots',
        filename,
        buffer,
        {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        }
      )

      if (error) {
        console.error(`❌ Failed to upload photo ${i} after retries:`, error)
        throw new Error(`Failed to upload photo ${i}: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('headshots')
        .getPublicUrl(filename)

      photoUrls.push(publicUrlData.publicUrl)
      console.log(`✅ Uploaded photo ${i + 1}/${files.length}`)

      // Small delay between uploads to prevent rate limiting
      if (i < files.length - 1) {
        await delay(300)
      }
    }

    console.log(`📦 All photos uploaded. Total: ${photoUrls.length}`)

    // Save to uploads table
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        photo_urls: photoUrls,
        status: 'uploaded',
      })
      .select()
      .single()

    if (uploadError) {
      console.error('❌ Failed to save upload to database:', uploadError)
      throw new Error(`Failed to save upload: ${uploadError.message}`)
    }

    console.log('✅ Upload record saved to database')

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      photoCount: photoUrls.length,
      photoUrls: photoUrls,
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}