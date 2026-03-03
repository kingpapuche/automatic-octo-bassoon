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
    const body = await request.json()
    
    console.log('🔔 Webhook received from Replicate')
    console.log('📊 Status:', body.status)
    console.log('🆔 Training ID:', body.id)

    // Only process when training is completed
    if (body.status !== 'succeeded') {
      console.log(`⏳ Training status: ${body.status} - waiting for completion`)
      return NextResponse.json({ received: true, status: body.status })
    }

    // Extract the version ID from the output
    const output = body.output
    
    let versionId = null
    
    // Try different ways to get version ID
    if (output?.version) {
      versionId = output.version
      if (versionId.includes(':')) {
        versionId = versionId.split(':')[1]
      }
    } else if (typeof output === 'string' && output.includes(':')) {
      versionId = output.split(':')[1]
    }
    
    if (!versionId) {
      console.error('❌ No version in webhook output')
      console.log('📦 Full output:', JSON.stringify(output, null, 2))
      return NextResponse.json({ 
        error: 'Could not extract version ID',
        output: output 
      }, { status: 400 })
    }

    console.log('✅ Training completed!')
    console.log('🔑 Version ID:', versionId)

    // Find the user by training ID
    const trainingId = body.id
    
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('trained_model_id', trainingId)
      .single()

    if (findError || !user) {
      console.error('❌ Could not find user with training ID:', trainingId)
      return NextResponse.json({ 
        error: 'User not found for training',
        trainingId: trainingId 
      }, { status: 404 })
    }

    console.log('👤 Found user:', user.email)

    // Update user with the actual version ID
    const { error: updateError } = await supabase
      .from('users')
      .update({
        trained_model_id: versionId,
        model_trained_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Failed to update user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    console.log('✅ User updated with version ID:', versionId)

    return NextResponse.json({
      success: true,
      userId: user.id,
      versionId: versionId,
      message: 'Training completed and user updated',
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Training webhook endpoint is active' 
  })
}