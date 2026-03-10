import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="font-serif text-4xl font-bold text-[#2D2D2D] mb-2">Terms of Service</h1>
        <p className="text-[#9B9B9B] mb-10">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[#4B4B4B] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Nova Imago, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service. You must be at least 18 years old to use Nova Imago.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">2. Description of Service</h2>
            <p>Nova Imago is an AI-powered headshot generation service. We train a personal AI model based on your uploaded photos and generate professional headshots in various styles. Results are delivered digitally and are available for download through your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">3. Your Account</h2>
            <p>You are responsible for maintaining the security of your account. You must provide accurate information when creating your account. Nova Imago is not responsible for any loss resulting from unauthorized access to your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">4. Acceptable Use</h2>
            <p>When using Nova Imago, you agree to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Only upload photos of yourself — not of other people without their consent</li>
              <li>Not upload photos that are illegal, offensive, or violate the rights of others</li>
              <li>Not attempt to misuse, reverse engineer, or exploit our AI systems</li>
              <li>Not use the service for any fraudulent or illegal purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">5. Payments</h2>
            <p>All payments are one-time and processed securely via Stripe. Prices are displayed in USD. By completing a purchase, you authorize Nova Imago to charge the displayed amount. We do not store your payment details.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">6. Ownership of Generated Images</h2>
            <p>Once your order is complete and paid for, you own the rights to all generated headshots. You may use them for personal or commercial purposes including LinkedIn, websites, resumes, and marketing materials. Nova Imago retains no ownership over your generated images.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">7. Refunds</h2>
            <p>Please refer to our <Link href="/refund-policy" className="text-[#5B4E9D]">Refund Policy</Link> for full details on our Profile-Worthy Guarantee and refund conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">8. Disclaimer of Warranties</h2>
            <p>Nova Imago is provided "as is". While we strive for the highest quality results, AI-generated images may not always meet every expectation. We do not guarantee specific results beyond what is stated in our Profile-Worthy Guarantee.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Nova Imago shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service. Our total liability shall not exceed the amount you paid for your order.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">10. Changes to Terms</h2>
            <p>We may update these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the updated terms. We will notify users of significant changes via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">11. Contact</h2>
            <p>For any questions regarding these Terms, contact us at: <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a></p>
          </section>

        </div>
      </div>

      <footer className="bg-[#2D2D2D] text-white py-8 px-8 text-center text-white/60 text-sm">
        © 2026 Nova Imago • <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link> • <Link href="/terms" className="hover:text-white transition">Terms of Service</Link> • <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
      </footer>
    </div>
  )
}