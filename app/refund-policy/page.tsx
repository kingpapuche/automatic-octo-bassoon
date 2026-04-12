import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="border-b border-[#E8E6E0] bg-white px-8 py-5">
        <div className="max-w-[900px] mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#2D2D2D]">Nova Imago</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-[900px] mx-auto px-8 py-16">
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">Refund Policy</h1>
        <p className="text-[#9B9B9B] mb-12">Last updated: April 2026</p>
        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">
          <section className="bg-[#F0EEF8] rounded-2xl p-8 border border-[#5B4E9D]/20">
            <h2 className="font-serif text-2xl text-[#5B4E9D] mb-4">Our Profile-Worthy Guarantee</h2>
            <p className="text-[#2D2D2D] text-lg">We guarantee at least 1 profile-worthy headshot in every order. If you do not get a single usable headshot, we refund you in full — no questions asked.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">When You Qualify for a Refund</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You did not receive a single profile-worthy headshot</li>
              <li>You request the refund within <strong>7 days</strong> of your order completion</li>
              <li>You followed our photo upload guidelines</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">When Refunds Are Not Available</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>More than 7 days have passed since your order was completed</li>
              <li>You received profile-worthy headshots but prefer a different style</li>
              <li>Poor results due to low-quality uploaded photos</li>
              <li>You have already downloaded and used your headshots</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">How to Request a Refund</h2>
            <p>Send an email to <a href="mailto:support@novaimago.ai" className="text-[#5B4E9D] underline">support@novaimago.ai</a> with your order email and a brief description. We process refunds within <strong>3-5 business days</strong>.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Questions?</h2>
            <p>Contact us at <a href="mailto:support@novaimago.ai" className="text-[#5B4E9D] underline">support@novaimago.ai</a></p>
          </section>
        </div>
      </div>
      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">Back to Nova Imago</Link>
      </footer>
    </div>
  )
}
