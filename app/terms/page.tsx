import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/25">
              AI
            </div>
            <span className="font-semibold text-xl text-white tracking-tight">Nova Imago</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition font-medium text-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-[100px] pb-[80px] max-w-[800px] mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Terms of Service</h1>
          <p className="text-gray-400">Last updated: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              By using Nova Imago ("the Service"), you confirm your acceptance of, and agree to be bound by, these Terms of Service for our AI headshot generation service. This Agreement takes effect on the date on which you first use the Nova Imago website or our AI headshot generation service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              Nova Imago is an AI-powered headshot generation service. Users upload personal photos, which are used to train a custom AI model. This model then generates professional headshots in various styles for use on LinkedIn, CVs, websites, and other professional platforms. The Service is provided on an "as is" basis and results may vary depending on the quality and quantity of uploaded photos.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use Nova Imago. By using the Service, you confirm that you meet this requirement. Nova Imago reserves the right to terminate accounts of users found to be under 18.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. User Accounts</h2>
            <p className="mb-3">
              To use the Service, you must create an account using a valid email address or Google account. You are responsible for:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Maintaining the confidentiality of your account credentials',
                'All activities that occur under your account',
                'Notifying us immediately of any unauthorized use of your account',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Service Access and Credits</h2>
            <p className="mb-3">
              Nova Imago offers various plans for AI-generated headshots. Our service is purchased through a credit-based system. Credits are used to train your personal AI model and generate headshots. By making a purchase, you agree to the following:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'All payments are processed securely via Stripe',
                'Credits are non-transferable and cannot be exchanged for cash',
                'Credits do not expire',
                'Prices are listed in USD and may be subject to change with prior notice',
                'One credit equals one generated headshot',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Refund Policy</h2>
            <p className="mb-3">
              We offer refunds under the following conditions:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Refund requests must be made within 7 days of purchase',
                'Refunds are only eligible if your AI model has not yet been trained',
                'No refunds will be given if you have downloaded any AI-generated headshots',
                'If your AI model fails to train due to a technical error on our side, you will receive a full refund or credit replacement',
                'Credits that have already been used to generate headshots are non-refundable',
                'Refund requests must be submitted via email with your order details',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Acceptable Use</h2>
            <p className="mb-3">You agree not to use Nova Imago to:</p>
            <ul className="space-y-2 pl-4">
              {[
                'Upload photos of other people without their explicit consent',
                'Upload photos containing minors (persons under 18)',
                'Generate content that is harmful, offensive, or violates applicable laws',
                'Attempt to reverse engineer or interfere with the Service',
                'Use the Service for any fraudulent or illegal purpose',
                'Misrepresent your identity using AI-generated headshots in a misleading way',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Intellectual Property</h2>
            <p className="mb-3">
              You retain full commercial ownership and rights to the headshots generated for you. You may use them on social media, websites, CVs, business cards, and other professional materials without restriction.
            </p>
            <p className="mb-3">
              By using the Service, you grant Nova Imago a limited license to use your uploaded photos solely for the purpose of training your personal AI model and generating your headshots. Your uploaded photos are stored only as long as necessary and can be deleted at any time upon request.
            </p>
            <p>
              If you opt in to allow Nova Imago to use your photos as examples, you grant us a non-exclusive license to display sample headshots on our website for marketing purposes. You may revoke this permission at any time by contacting us.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Data and Privacy</h2>
            <p className="mb-3">
              Nova Imago takes your privacy seriously. Regarding your data:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Your uploaded photos are used solely to train your personal AI model',
                'Photos are stored securely and can be deleted at any time upon request',
                'We comply with GDPR and applicable data protection laws',
                'Your personal data is never sold to third parties',
                'For full details, please review our Privacy Policy',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Disclaimer</h2>
            <p>
              While we strive for high-quality results, it is not warranted that Nova Imago will meet all your requirements or that its operation will be uninterrupted or error-free. AI-generated results may vary and we cannot guarantee perfect likeness in all cases. The quality of results depends significantly on the quality and variety of the photos you upload.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Limitation of Liability</h2>
            <p>
              Nova Imago provides its AI headshot generation service "as is" without any warranty. We shall not be liable for any indirect, special, or consequential loss or damage arising from the use of our service. Our liability, if any, is limited to the amount you paid for the service in the past 12 months.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Responsibilities</h2>
            <p>
              You are responsible for the photos you upload and how you use the AI-generated headshots. Nova Imago is not responsible for any misuse of the generated content. You confirm that you have the right to upload the photos you submit and that they do not violate any third-party rights.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Termination</h2>
            <p>
              Nova Imago reserves the right to suspend or terminate your account at any time if you violate these Terms of Service. Upon termination, your access to the Service will be revoked. Any unused credits may be forfeited depending on the reason for termination.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Changes to Terms</h2>
            <p>
              Nova Imago reserves the right to update these Terms of Service at any time. We will provide reasonable prior notice of any significant changes. Your continued use of the Service after changes take effect constitutes your acceptance of the new terms.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of Belgium. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Belgium.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Contact</h2>
            <p className="mb-3">
              If you have any questions about these Terms of Service or wish to request a refund, please contact us at:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-semibold">Nova Imago</p>
              <p className="text-gray-400 mt-1">Belgium</p>
              <p className="text-violet-400 mt-1">support@novaimago.com</p>
            </div>
          </section>

        </div>

        {/* FOOTER LINKS */}
        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          <Link href="/" className="hover:text-white transition">Back to Home</Link>
        </div>

      </div>
    </div>
  )
}