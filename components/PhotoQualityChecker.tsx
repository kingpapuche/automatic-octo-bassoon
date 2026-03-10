'use client'

import { useState, useCallback } from 'react'

interface PhotoCheck {
  file: File
  preview: string
  status: 'checking' | 'good' | 'warning' | 'rejected'
  issues: string[]
  score: number
}

const GOOD_PHOTO_TIPS = [
  '10–20 photos give the best results',
  'Mix smiling and neutral expressions',
  'Different angles — front, three-quarter, slight side',
  'Good lighting — natural daylight, no heavy filters',
  'Well-lit face — no backlighting or dark shadows',
  'Only yourself in the photo — no group shots',
  'Face clearly visible — no sunglasses or hats',
  'Sharp photo — not blurry or shaken',
  'Variety of angles and settings',
  'No heavy filters or edits',
]

async function analyzePhoto(file: File, preview: string): Promise<{ issues: string[], score: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = preview
    img.onload = () => {
      const issues: string[] = []
      let score = 100

      if (img.width < 512 || img.height < 512) {
        issues.push('Resolution too low (min. 512x512)')
        score -= 40
      }
      if (file.size < 50 * 1024) {
        issues.push('File size too small')
        score -= 30
      }
      const ratio = img.width / img.height
      if (ratio > 3 || ratio < 0.3) {
        issues.push('Aspect ratio too extreme')
        score -= 25
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = 50
        canvas.height = 50
        ctx.drawImage(img, 0, 0, 50, 50)
        const imageData = ctx.getImageData(0, 0, 50, 50)
        const pixels = imageData.data
        let totalBrightness = 0
        for (let i = 0; i < pixels.length; i += 4) {
          totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
        }
        const avgBrightness = totalBrightness / (pixels.length / 4)
        if (avgBrightness < 40) {
          issues.push('Photo too dark')
          score -= 35
        } else if (avgBrightness > 230) {
          issues.push('Photo too bright / overexposed')
          score -= 20
        }
      }

      resolve({ issues, score: Math.max(0, score) })
    }
    img.onerror = () => resolve({ issues: ['Could not load photo'], score: 0 })
  })
}

export default function PhotoQualityChecker({
  onPhotosApproved,
  minPhotos = 10,
  maxPhotos = 20,
}: {
  onPhotosApproved: (files: File[]) => void
  minPhotos?: number
  maxPhotos?: number
}) {
  const [photos, setPhotos] = useState<PhotoCheck[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (fileArray.length === 0) return

    const newPhotos: PhotoCheck[] = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'checking' as const,
      issues: [],
      score: 0,
    }))

    setPhotos(prev => [...prev, ...newPhotos].slice(0, maxPhotos))

    for (const photo of newPhotos) {
      const { issues, score } = await analyzePhoto(photo.file, photo.preview)
      setPhotos(prev =>
        prev.map(p =>
          p.preview === photo.preview
            ? { ...p, status: issues.length === 0 ? 'good' : score < 50 ? 'rejected' : 'warning', issues, score }
            : p
        )
      )
    }
  }, [maxPhotos])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }, [processFiles])

  const removePhoto = (preview: string) => {
    setPhotos(prev => prev.filter(p => p.preview !== preview))
  }

  const goodPhotos = photos.filter(p => p.status === 'good')
  const warningPhotos = photos.filter(p => p.status === 'warning')
  const rejectedPhotos = photos.filter(p => p.status === 'rejected')
  const approvedPhotos = [...goodPhotos, ...warningPhotos]
  const isReady = approvedPhotos.length >= minPhotos

  const getStatusColor = (status: PhotoCheck['status']) => {
    switch (status) {
      case 'good': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'rejected': return '#ef4444'
      default: return '#475569'
    }
  }

  const getStatusLabel = (status: PhotoCheck['status']) => {
    switch (status) {
      case 'good': return '✓ Good'
      case 'warning': return '⚠ Warning'
      case 'rejected': return '✗ Rejected'
      default: return '⏳ Checking...'
    }
  }

  return (
    <div className="p-10">

      {/* Checklist — matches existing tips style on upload page */}
      <div className="bg-gradient-to-r from-[#5B4E9D]/15 to-[#7D6FB8]/15 border border-[#7D6FB8]/30 rounded-2xl p-5 mb-8">
        <h3 className="text-white font-semibold text-base mb-3">
          Tips for the best results
        </h3>
        <ul className="text-[#94a3b8] text-sm space-y-2">
          {GOOD_PHOTO_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#7D6FB8] mt-0.5 shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById('photo-input')?.click()}
        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#5B4E9D] bg-[#5B4E9D]/10'
            : 'border-[#475569] hover:border-[#7D6FB8] hover:bg-[#334155]/50'
        }`}
      >
        <div className="w-16 h-16 bg-[#0f172a] border-2 border-[#475569] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📸</span>
        </div>
        {isDragging ? (
          <p className="text-xl text-[#7D6FB8] font-semibold">Drop your photos here...</p>
        ) : (
          <>
            <p className="text-xl text-white font-semibold mb-2">Drag & drop photos here</p>
            <p className="text-[#94a3b8] mb-4">or click to browse</p>
            <p className="text-sm text-[#64748b]">{minPhotos}–{maxPhotos} photos · JPG, PNG, WEBP · Max 10MB each</p>
          </>
        )}
        <input
          id="photo-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Status bar */}
      {photos.length > 0 && (
        <div className={`flex justify-between items-center rounded-xl px-5 py-3 mt-6 border ${
          isReady
            ? 'bg-[#0D9488]/10 border-[#0D9488]/30'
            : 'bg-[#f59e0b]/10 border-[#f59e0b]/30'
        }`}>
          <div className="flex gap-4 text-sm">
            {goodPhotos.length > 0 && <span className="text-[#10b981] font-bold">✓ {goodPhotos.length} good</span>}
            {warningPhotos.length > 0 && <span className="text-[#f59e0b] font-bold">⚠ {warningPhotos.length} warning</span>}
            {rejectedPhotos.length > 0 && <span className="text-[#ef4444] font-bold">✗ {rejectedPhotos.length} rejected</span>}
          </div>
          <span className={`text-sm font-semibold ${isReady ? 'text-[#0D9488]' : 'text-[#f59e0b]'}`}>
            {isReady
              ? `✓ Ready for training! (${approvedPhotos.length}/${minPhotos})`
              : `${minPhotos - approvedPhotos.length} more photos needed`
            }
          </span>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          {photos.map((photo) => (
            <div key={photo.preview} className="relative group">
              <div
                className="rounded-xl overflow-hidden aspect-square relative"
                style={{ border: `2px solid ${getStatusColor(photo.status)}` }}
              >
                <img
                  src={photo.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {photo.status === 'rejected' && (
                  <div className="absolute inset-0 bg-red-500/20" />
                )}

                <div
                  className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold text-center rounded-md py-0.5"
                  style={{ background: getStatusColor(photo.status) }}
                >
                  {getStatusLabel(photo.status)}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.preview) }}
                  className="absolute top-2 right-2 bg-black/70 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition font-bold text-sm flex items-center justify-center"
                >×</button>
              </div>

              {photo.issues.length > 0 && (
                <div className="mt-1">
                  {photo.issues.map((issue, i) => (
                    <p key={i} className="text-xs leading-tight" style={{ color: photo.status === 'rejected' ? '#ef4444' : '#f59e0b' }}>
                      {issue}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ready button */}
      {isReady && (
        <button
          onClick={() => onPhotosApproved(approvedPhotos.map(p => p.file))}
          className="w-full mt-8 bg-[#FF6B4A] hover:bg-[#FF5230] text-white py-5 rounded-full text-xl font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          🚀 Start training with {approvedPhotos.length} photos →
        </button>
      )}
    </div>
  )
}