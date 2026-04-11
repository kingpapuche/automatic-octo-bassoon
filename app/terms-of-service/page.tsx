import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function TermsOfServicePage() {
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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">Terms of Service</h1>
        <p className="text-[#9B9B9B] mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">1. Acceptance of Terms</h2>
            <p>By using Nova Imago (&ldquo;the Service&rdquo;), you agree to these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">2. The Service</h2>
            <p>Nova Imago provides AI-generated professional headshots. You upload photos, we train a personal AI model, and generate headshots in your chosen styles. Results are AI-generated and may not be perfect in every case.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">3. Your Photos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must only upload photos of yourself or people who have given explicit consent</li>
              <li>You confirm you have the right to use the photos you upload</li>
              <li>We use your photos solely to train your personal AI model</li>
              <li>We never use your photos to train general AI models or share them with third parties</li>
              <li>Uploaded photos are permanently deleted within 7 days after your order is complete</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">4. Ownership of Generated Headshots</h2>
            <p>You own the rights to all headshots generated for you. You may use them for personal or commercial purposes including LinkedIn, websites, marketing materials, and business cards. Nova Imago does not claim any rights to your generated headshots.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">5. Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in USD and are one-time payments</li>
              <li>Payments are processed securely by Stripe</li>
              <li>We do not store your payment details</li>
              <li>Credits are non-transferable and non-refundable except as stated in our Refund Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">6. Profile-Worthy Guarantee</h2>
            <p>We guarantee at least 1 profile-worthy headshot in every order. If you do not receive a usable headshot, you may request a full refund within 7 days of your order. See our <Link href="/refund-policy" className="text-[#5B4E9D] underline">Refund Policy</Link> for full details.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">7. Prohibited Uses</h2>
            <p>You may not use Nova Imago to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Upload photos of other people without their consent</li>
              <li>Create deceptive, misleading, or fraudulent content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse-engineer or copy our AI systems</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">8. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uploaded selfies: deleted within 7 days after training</li>
              <li>AI model: deleted after 30 days</li>
              <li>Generated headshots: available for 30 days, then deleted</li>
            </ul>
            <p className="mt-4">We recommend downloading your headshots within 30 days of delivery.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">9. Limitation of Liability</h2>
            <p>Nova Imago is not liable for any indirect, incidental, or consequential damages arising from the use of the Service. Our total liability is limited to the amount you paid for your order.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">10. Contact</h2>
            <p>For questions about these terms, contact us at: <a href="mailto:support@novaimago.ai" className="text-[#5B4E9D] underline">support@novaimago.ai</a></p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">← Back to Nova Imago</Link>
      </footer>
    </div>
  )
}