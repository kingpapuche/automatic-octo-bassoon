import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mediaType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analyze this photo for AI headshot training quality. Check ONLY these 6 criteria:

1. MULTIPLE_PEOPLE: Are there multiple people clearly visible in the photo?
2. FACE_NOT_VISIBLE: Is the face hidden (sunglasses, hat covering face, hand over face, face fully turned away)?
3. TOO_DARK: Is the photo too dark to clearly see the person's face?
4. FACE_TOO_SMALL: Does the face take up less than 10% of the image (person too far away)?
5. PHOTO_OF_PHOTO: Is this a photo of a screen, printed photo, or low quality screenshot?
6. BLURRY: Is the photo significantly blurry or out of focus on the face?

Respond ONLY in this exact JSON format, nothing else:
{"passed": true, "issues": [], "message": "Photo looks good for AI training."}

If issues found example:
{"passed": false, "issues": ["MULTIPLE_PEOPLE"], "message": "Multiple people visible. Please use a solo photo."}`,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Photo check error:', error)
    // On error: allow the photo so it doesn't block the user
    return NextResponse.json({
      passed: true,
      issues: [],
      message: 'Check skipped',
    })
  }
}