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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const files = formData.getAll('photos') as File[]

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 })
    }

    if (files.length < 10) {
      return NextResponse.json(
        { error: `Please upload at least 10 photos. You uploaded ${files.length}.` },
        { status: 400 }
      )
    }

    console.log(`📸 Uploading ${files.length} photos for order: ${orderId}`)

    // Upload all photos to Supabase Storage
    const photoUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${orderId}/${timestamp}-${i}.jpg`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('headshots')
        .upload(filename, buffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`❌ Failed to upload photo ${i}:`, error)
        throw new Error(`Failed to upload photo ${i}: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('headshots')
        .getPublicUrl(filename)

      photoUrls.push(publicUrlData.publicUrl)
      console.log(`✅ Uploaded photo ${i + 1}/${files.length}`)
    }

    console.log(`📦 All photos uploaded. Total: ${photoUrls.length}`)

    // Save to database
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .insert({
        order_id: orderId,
        photo_urls: photoUrls,
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