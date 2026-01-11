'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'pro'
  
  const [photos, setPhotos] = useState<File[]>([])
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const planDetails = {
    starter: { price: 29, photos: 40, name: 'Starter' },
    pro: { price: 49, photos: 100, name: 'Professional' },
    executive: { price: 99, photos: 200, name: 'Executive' },
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro

 const onDrop = useCallback((acceptedFiles: File[]) => {
  setError('')
  
  // Check max photos
  if (photos.length + acceptedFiles.length > 20) {
    setError('Maximum 20 photos allowed')
    return
  }

  // Filter valid files
  const validFiles = acceptedFiles.filter(file => {
    const isImage = file.type.startsWith('image/')
    const isUnder10MB = file.size < 10 * 1024 * 1024
    return isImage && isUnder10MB
  })

  if (validFiles.length !== acceptedFiles.length) {
    setError('Some files were rejected. Only images under 10MB are allowed.')
  }

  // Check for duplicates (by name and size)
  const existingFiles = new Set(photos.map(p => `${p.name}-${p.size}`))
  const newFiles: File[] = []
  const duplicates: string[] = []

  validFiles.forEach(file => {
    const fileKey = `${file.name}-${file.size}`
    if (existingFiles.has(fileKey)) {
      duplicates.push(file.name)
    } else {
      newFiles.push(file)
      existingFiles.add(fileKey)
    }
  })

  // Show duplicate warning
  if (duplicates.length > 0) {
    setError(`Duplicate photos skipped: ${duplicates.slice(0, 3).join(', ')}${duplicates.length > 3 ? ` and ${duplicates.length - 3} more` : ''}`)
  }

  // Add only new files
  if (newFiles.length > 0) {
    setPhotos(prev => [...prev, ...newFiles])
  }
}, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
  },
  maxSize: 10 * 1024 * 1024,
  multiple: true,
})

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (photos.length < 10) {
      setError('Please upload at least 10 photos')
      return
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Step 1: Create order first
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan,
          photoUrls: [], // Empty for now, will be filled by upload
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const { orderId, checkoutUrl } = orderData

      console.log('Order created:', orderId)

      // Step 2: Upload photos to Supabase via API
      const uploadFormData = new FormData()
      uploadFormData.append('orderId', orderId)
      
      photos.forEach((photo) => {
        uploadFormData.append('photos', photo)
      })

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok || uploadData.error) {
        throw new Error(uploadData.error || 'Failed to upload photos')
      }

      console.log('Photos uploaded:', uploadData.photoCount)
      console.log('Redirecting to Stripe:', checkoutUrl)

      // Step 3: Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <nav className="border-b border-[#E8E6E0] bg-white">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center text-white text-2xl">
              ✨
            </div>
            <span className="font-serif text-2xl font-semibold text-[#2D2D2D]">
              BestAIHeadshot
            </span>
          </Link>
          
          <Link href="/" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Plan Selected */}
        <div className="bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white rounded-3xl p-8 mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedPlan.name} Plan</h2>
              <p className="text-white/90">
                {selectedPlan.photos} professional headshots • Ready in 30 minutes
              </p>
            </div>
            <div className="text-right">
              <div className="font-serif text-5xl font-bold">${selectedPlan.price}</div>
              <p className="text-white/80 text-sm">One-time payment</p>
            </div>
          </div>
        </div>

     {/* Upload Section */}
<div className="bg-white rounded-3xl p-10 border-2 border-[#E8E6E0] mb-8">
  <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">
    Upload Your Photos
  </h3>
  <p className="text-[#6B6B6B] mb-8">
    Upload 10-20 photos for best results. Our AI needs variety!
  </p>

  {/* Pro Tips Panel */}
  <div className="bg-gradient-to-br from-[#F0EDFF] to-[#E8F5F4] border-2 border-[#7D6FB8]/20 rounded-2xl p-6 mb-8">
    <div className="flex items-start gap-4">
      <div className="text-4xl">💡</div>
      <div className="flex-1">
        <h4 className="font-bold text-[#2D2D2D] mb-3 text-lg">Photo Tips for Best Results:</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-[#0D9488] mb-2">✓ DO Upload:</p>
            <ul className="text-[#6B6B6B] space-y-1 text-sm">
              <li>• 10-20 <strong>different</strong> photos</li>
              <li>• Various angles (front, side, 3/4 view)</li>
              <li>• Different lighting conditions</li>
              <li>• Mix of expressions (smile, neutral)</li>
              <li>• Clear face, high quality</li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-red-600 mb-2">✗ DON&apos;T Upload:</p>
            <ul className="text-[#6B6B6B] space-y-1 text-sm">
              <li>• Duplicate photos</li>
              <li>• Group photos or multiple people</li>
              <li>• Sunglasses or heavy filters</li>
              <li>• Blurry or low-quality images</li>
              <li>• Photos with hats covering face</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#7D6FB8]/20">
          <p className="text-sm text-[#5B4E9D] font-medium">
            💎 <strong>Why variety matters:</strong> Our AI learns your unique features from different angles and lighting. More variety = more realistic, professional headshots!
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Dropzone */}
  <div
    {...getRootProps()}
    className={
      isDragActive
        ? 'border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all border-[#5B4E9D] bg-[#5B4E9D]/5'
        : 'border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all border-[#E8E6E0] hover:border-[#7D6FB8] hover:bg-[#F5F4F0]'
    }
  >
    <input {...getInputProps()} />
    <div className="text-6xl mb-4">📸</div>
    {isDragActive ? (
      <p className="text-xl text-[#5B4E9D] font-semibold">Drop your photos here...</p>
    ) : (
      <div>
        <p className="text-xl text-[#2D2D2D] font-semibold mb-2">
          Drag &amp; drop photos here
        </p>
        <p className="text-[#6B6B6B] mb-4">or click to browse</p>
        <p className="text-sm text-[#9B9B9B]">
          10-20 photos • JPG, PNG • Max 10MB each
        </p>
      </div>
    )}
  </div>

  {error && (
    <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-600 flex items-start gap-3">
      <span className="text-2xl">⚠️</span>
      <div>
        <p className="font-semibold mb-1">Upload Issue:</p>
        <p>{error}</p>
      </div>
    </div>
  )}

  {/* Photo Preview Grid */}
  {photos.length > 0 && (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-[#2D2D2D]">
          {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
          {photos.length < 10 && (
            <span className="text-[#FF6B4A] ml-2">
              ({10 - photos.length} more needed)
            </span>
          )}
          {photos.length >= 10 && (
            <span className="text-[#0D9488] ml-2">✓ Ready to continue!</span>
          )}
        </h4>
        <button
          onClick={() => setPhotos([])}
          className="text-sm text-[#6B6B6B] hover:text-red-600 font-medium transition"
        >
          Clear all
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Upload ${index + 1}`}
              className="w-full aspect-square object-cover rounded-xl border-2 border-[#E8E6E0] group-hover:border-[#7D6FB8] transition"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition font-bold shadow-lg"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

        {/* Email Input */}
        <div className="bg-white rounded-3xl p-10 border-2 border-[#E8E6E0] mb-8">
          <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">
            Your Email
          </h3>
          <p className="text-[#6B6B6B] mb-6">
            We'll send your headshots here when ready
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-6 py-4 border-2 border-[#E8E6E0] rounded-xl text-lg focus:border-[#5B4E9D] focus:outline-none transition"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          disabled={uploading || photos.length < 10 || !email}
          className="w-full bg-[#FF6B4A] hover:bg-[#FF5230] disabled:bg-[#9B9B9B] disabled:cursor-not-allowed text-white py-5 rounded-full text-xl font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0"
        >
          {uploading ? (
            'Uploading photos...'
          ) : photos.length < 10 ? (
            `Upload ${10 - photos.length} more photo${10 - photos.length !== 1 ? 's' : ''} to continue`
          ) : (
            `Continue to Payment ($${selectedPlan.price})`
          )}
        </button>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 mt-8 text-[#6B6B6B] text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#0D9488]">🔒</span>
            <span>Secure payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0D9488]">✓</span>
            <span>Money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0D9488]">🛡️</span>
            <span>Privacy protected</span>
          </div>
        </div>
      </div>
    </div>
  )
}