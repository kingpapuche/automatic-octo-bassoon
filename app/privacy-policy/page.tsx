import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E8E6E0] z-50">
        <div className="max-w-[1320px] mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-semibold text-[#2D2D2D]">
            Nova Imago
          </Link>
        </div>
      </nav>

      <div className="pt-[100px] pb-24 max-w-[800px] mx-auto px-8">
        <h1 className="font-serif text-4xl font-bold text-[#2D2D2D] mb-2">Privacy Policy</h1>
        <p className="text-[#9B9B9B] mb-10">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[#4B4B4B] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">1. Who We Are</h2>
            <p>Nova Imago is an AI-powered headshot generation service. We are committed to protecting your privacy and handling your data with care. If you have any questions, contact us at <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">2. What Data We Collect</h2>
            <p>When you use Nova Imago, we collect the following information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your email address (used for account creation and communication)</li>
              <li>Photos you upload for AI headshot generation</li>
              <li>Physical characteristics you provide (gender, ethnicity, eye color, hair color, age range)</li>
              <li>Payment information (processed securely by Stripe — we never store your card details)</li>
              <li>Basic usage data (browser type, device type, IP address)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">3. How We Use Your Data</h2>
            <p>We use your data solely to provide our service:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>To train a personal AI model based on your photos</li>
              <li>To generate professional headshots</li>
              <li>To process your payment</li>
              <li>To communicate with you about your order</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties. We do not use your photos to train general AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">4. Photo Storage and Deletion</h2>
            <p>Your uploaded photos and generated headshots are stored securely. You may request deletion of your data at any time by contacting us at <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a>. We will process your request within 7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">5. Third-Party Services</h2>
            <p>We use the following trusted third-party services to operate Nova Imago:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Supabase</strong> — secure database and authentication</li>
              <li><strong>Replicate</strong> — AI model training and generation</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Cloudinary</strong> — image storage</li>
              <li><strong>Vercel</strong> — website hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">7. Cookies</h2>
            <p>We use essential cookies only — these are required for the website to function (authentication, session management). We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date. Continued use of our service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">9. Contact</h2>
            <p>For any privacy-related questions or requests, contact us at: <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a></p>
          </section>

        </div>
      </div>

      <footer className="bg-[#2D2D2D] text-white py-8 px-8 text-center text-white/60 text-sm">
        © 2026 Nova Imago • <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link> • <Link href="/terms" className="hover:text-white transition">Terms of Service</Link> • <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
      </footer>
    </div>
  )
}