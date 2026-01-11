'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Generation {
  id: string
  order_id: string
  result_urls: string[]
  status: string
  created_at: string
}

interface Order {
  id: string
  email: string
  plan: string
  status: string
}

export default function ResultsPage() {
  const params = useParams()
  const orderId = params?.orderId as string

  const [generation, setGeneration] = useState<Generation | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchResults = async () => {
      try {
        // Get order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError
        setOrder(orderData)

        // Get generation
        const { data: genData, error: genError } = await supabase
          .from('generations')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (genError) {
          if (orderData.status === 'processing') {
            setError('Your headshots are still being generated. Please check back in a few minutes!')
          } else {
            throw genError
          }
        } else {
          setGeneration(genData)
        }
      } catch (err) {
        console.error('Error fetching results:', err)
        setError('Failed to load results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()

    // Poll every 30 seconds if still processing
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [orderId])

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `headshot-${index + 1}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download image')
    }
  }

  const downloadAll = async () => {
    if (!generation?.result_urls) return
    
    for (let i = 0; i < generation.result_urls.length; i++) {
      await downloadImage(generation.result_urls[i], i)
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading your headshots...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {order?.status === 'processing' ? 'Still Processing' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (!generation?.result_urls || generation.result_urls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing...</h1>
          <p className="text-gray-600 mb-6">
            Your headshots are being generated. This usually takes 20-30 minutes.
          </p>
          <p className="text-sm text-gray-500">
            You can close this page and come back later!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Professional Headshots 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {generation.result_urls.length} headshots ready to download
          </p>
          <button
            onClick={downloadAll}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            📥 Download All Headshots
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {generation.result_urls.map((url, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              onClick={() => setSelectedImage(url)}
            >
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Headshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Headshot #{index + 1}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadImage(url, index)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Need more headshots?
          </h2>
          <p className="text-gray-600 mb-4">
            Order ID: <span className="font-mono text-sm">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-4">
            Save this page URL to access your headshots anytime!
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Order More Headshots
          </a>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Full size headshot"
              width={1024}
              height={1024}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
