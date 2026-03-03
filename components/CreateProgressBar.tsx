'use client'

import Link from 'next/link'

interface ProgressBarProps {
  currentStep: number
  userCredits: number
}

const STEPS = [
  { num: 1, label: 'Order Details', href: '/create' },
  { num: 2, label: 'Select Styles', href: '/create/styles' },
  { num: 3, label: 'Generate', href: '/create/generate' },
]

export default function CreateProgressBar({ currentStep, userCredits }: ProgressBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 z-50">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/25">AI</div>
          <span className="font-semibold text-xl text-white tracking-tight">Nova Imago</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition font-medium text-sm">Dashboard</Link>
          <Link href="/gallery" className="text-gray-400 hover:text-white transition font-medium text-sm">Gallery</Link>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className="text-violet-400 text-sm">✦</span>
            <span className="text-white font-semibold">{userCredits}</span>
            <span className="text-gray-400 text-sm">credits</span>
          </div>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-[900px] mx-auto px-6 pb-4">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${
                  currentStep === step.num
                    ? 'text-violet-400'
                    : currentStep > step.num
                      ? 'text-emerald-400'
                      : 'text-gray-500'
                }`}>
                  {String(step.num).padStart(2, '0')}/
                </span>
                <span className={`text-sm font-semibold ${
                  currentStep >= step.num ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-4 h-[2px] relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: currentStep > step.num ? '100%' : currentStep === step.num ? '50%' : '0%' 
                    }}
                  />
                  {currentStep === step.num && (
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full border-2 border-[#0a0f1a] shadow-lg shadow-violet-500/50" 
                      style={{ left: '50%' }}
                    />
                  )}
                  {currentStep > step.num && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full border-2 border-[#0a0f1a]"
                      style={{ right: '-6px' }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}