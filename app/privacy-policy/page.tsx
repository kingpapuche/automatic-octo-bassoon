import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Nav */}
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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">Privacy Policy</h1>
        <p className="text-[#9B9B9B] mb-12">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[#4B4B4B] leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">1. Who We Are</h2>
            <p>Nova Imago (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website novaimago.ai and provides AI-generated professional headshot services. We are committed to protecting your personal data and respecting your privacy.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">2. What Data We Collect</h2>
            <p>We collect the following types of data:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Account data:</strong> email address, name, gender, ethnicity, hair color, eye color (used to improve AI results)</li>
              <li><strong>Photos you upload:</strong> selfies you provide for AI model training</li>
              <li><strong>Generated headshots:</strong> AI-generated images created from your photos</li>
              <li><strong>Payment data:</strong> processed securely by Stripe — we never store your card details</li>
              <li><strong>Usage data:</strong> pages visited, styles selected, device type</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>To train a personal AI model on your face and generate headshots</li>
              <li>To process your payment and deliver your order</li>
              <li>To send you order confirmation and completion emails</li>
              <li>To improve our service and fix technical issues</li>
            </ul>
            <p className="mt-4"><strong>We never sell your data. We never use your photos to train general AI models.</strong></p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">4. Data Retention</h2>
            <p>We follow a strict data retention policy to protect your privacy:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Your uploaded selfies:</strong> stored for 7 days after your order is complete, then permanently deleted</li>
              <li><strong>Your AI model (LoRA):</strong> stored for 30 days, then permanently deleted</li>
              <li><strong>Your generated headshots:</strong> available for download for 30 days, then permanently deleted</li>
              <li><strong>Account data:</strong> retained as long as your account is active</li>
            </ul>
            <p className="mt-4">You can request immediate deletion of all your data at any time by contacting us at privacy@novaimago.ai.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">5. Third-Party Services</h2>
            <p>We use the following trusted third-party services:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Stripe:</strong> payment processing (USA/Europe)</li>
              <li><strong>Supabase:</strong> secure data storage (Europe)</li>
              <li><strong>RunPod / Replicate:</strong> AI model training and generation (USA/Europe)</li>
              <li><strong>Resend:</strong> transactional email delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">6. Your Rights (GDPR)</h2>
            <p>If you are in the European Union, you have the following rights:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, contact us at privacy@novaimago.ai.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">7. Cookies</h2>
            <p>We use essential cookies only — no advertising or tracking cookies. See our <Link href="/cookie-policy" className="text-[#5B4E9D] underline">Cookie Policy</Link> for details.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">8. Contact</h2>
            <p>For privacy questions or data requests, contact us at: <a href="mailto:privacy@novaimago.ai" className="text-[#5B4E9D] underline">privacy@novaimago.ai</a></p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">← Back to Nova Imago</Link>
      </footer>
    </div>
  )
}