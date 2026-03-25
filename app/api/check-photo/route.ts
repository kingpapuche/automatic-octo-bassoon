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
              text: `Analyze this photo for AI headshot training quality. Check ONLY these 8 criteria:

1. MULTIPLE_PEOPLE: Are there multiple people clearly visible in the photo?
2. FACE_NOT_VISIBLE: Is the face hidden (sunglasses, hat covering face, hand over face, face fully turned away)?
3. TOO_DARK: Is the photo too dark to clearly see the person's face?
4. FACE_TOO_SMALL: Does the face take up less than 10% of the image (person too far away)?
5. PHOTO_OF_PHOTO: Is this a photo of a screen, printed photo, or low quality screenshot?
6. BLURRY: Is the photo significantly blurry or out of focus on the face?
7. EXTREME_FILTER: Does the photo have heavy beauty filters, Snapchat/Instagram filters, FaceApp edits, or extreme skin smoothing that distorts natural appearance?
8. LOW_RESOLUTION: Is the photo very low resolution, heavily compressed, or too small to show clear facial details?

Respond ONLY in this exact JSON format, nothing else:
{"passed": true, "issues": [], "message": "Photo looks good for AI training."}

If issues found example:
{"passed": false, "issues": ["EXTREME_FILTER"], "message": "Heavy filter detected. Please use a natural photo without beauty filters."}

Use these exact messages per issue:
- MULTIPLE_PEOPLE: "Multiple people visible. Please use a solo photo."
- FACE_NOT_VISIBLE: "Face not clearly visible. Remove sunglasses, hats or obstructions."
- TOO_DARK: "Photo is too dark. Please use a well-lit photo."
- FACE_TOO_SMALL: "You are too far from the camera. Please use a closer photo."
- PHOTO_OF_PHOTO: "This looks like a photo of a screen or printed photo. Please use an original photo."
- BLURRY: "Photo is too blurry. Please use a sharp, in-focus photo."
- EXTREME_FILTER: "Heavy filter detected. Please use a natural photo without beauty filters."
- LOW_RESOLUTION: "Photo quality is too low. Please use a higher quality photo."`,
            },
          ],
        },
      ],
    })

    const text  = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Photo check error:', error)
    // Bij fout: foto goedkeuren zodat gebruiker niet geblokkeerd wordt
    return NextResponse.json({
      passed:  true,
      issues:  [],
      message: 'Check skipped',
    })
  }
}