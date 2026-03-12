import Link from 'next/link'

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: March 2026</p>
        </div>

        {/* INTRO HIGHLIGHT */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 mb-10">
          <p className="text-gray-300 leading-relaxed">
            Your privacy is important to us. Nova Imago is committed to protecting your personal data and being transparent about how we use it. We comply with the <strong className="text-white">General Data Protection Regulation (GDPR)</strong> and applicable Belgian data protection laws. We never sell your data to third parties.
          </p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Who We Are</h2>
            <p>
              Nova Imago is an AI-powered headshot generation service operated from Belgium. If you have any questions about this Privacy Policy or how we handle your data, you can contact us at{' '}
              <a href="mailto:novaimagosupport@gmail.com" className="text-violet-400 hover:text-violet-300 transition">
                novaimagosupport@gmail.com
              </a>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. What Data We Collect</h2>
            <p className="mb-3">When you use Nova Imago, we collect the following information:</p>
            <ul className="space-y-2 pl-4">
              {[
                'Account information: your email address and name (provided via Google OAuth or email login)',
                'Personal characteristics: gender, age range, ethnicity, eye color, hair color — used solely to improve AI accuracy',
                'Photos you upload: used exclusively to train your personal AI model and generate your headshots',
                'Payment information: processed securely by Stripe — we never store your credit card details',
                'Usage data: how you interact with the service (pages visited, features used) for improving the product',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
            <p className="mb-3">We use your data only for the following purposes:</p>
            <ul className="space-y-2 pl-4">
              {[
                'To train your personal AI model and generate your headshots',
                'To manage your account and credits',
                'To process your payments via Stripe',
                'To send you email notifications (e.g. when your training is complete)',
                'To improve and maintain the quality of our service',
                'To comply with legal obligations',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Your Photos and AI Model</h2>
            <p className="mb-3">
              We take the handling of your photos very seriously. Here is exactly what happens with your uploaded photos:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Your photos are uploaded directly and securely to our storage (Supabase)',
                'They are used solely to train your personal AI model via Replicate',
                'Your photos are never used to train general AI models or shared with third parties',
                'Your photos are never sold or used for advertising without your explicit consent',
                'You can request deletion of your photos and AI model at any time by contacting us',
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
            <h2 className="text-xl font-semibold text-white mb-3">5. Optional: Marketing Use of Your Photos</h2>
            <p>
              During the upload process, you can choose to allow Nova Imago to use sample headshots as examples on our website. This is entirely optional and you can withdraw your consent at any time by contacting us. If you opt out, your photos and headshots will never appear on our website or marketing materials. No personal information is ever shared alongside these example images.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
            <p className="mb-3">We retain your data only as long as necessary:</p>
            <ul className="space-y-2 pl-4">
              {[
                'Account data: retained for as long as your account is active',
                'Uploaded photos: stored securely and can be deleted at any time upon request',
                'Generated headshots: stored in your account and available for download',
                'Payment records: retained as required by Belgian tax law (7 years)',
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
            <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Services</h2>
            <p className="mb-3">
              Nova Imago uses the following trusted third-party services to operate. Each has their own privacy policy:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Supabase — database and file storage (GDPR compliant)',
                'Replicate — AI model training and generation',
                'Stripe — payment processing (PCI-DSS compliant)',
                'Resend — transactional email notifications',
                'Vercel — website hosting',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We only share your data with these services to the extent necessary to provide our service. We do not sell your data to any third party.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights (GDPR)</h2>
            <p className="mb-3">
              As a user based in the European Union, you have the following rights under GDPR:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                'Right of access: you can request a copy of all personal data we hold about you',
                'Right to rectification: you can ask us to correct inaccurate data',
                'Right to erasure: you can request deletion of your account and all associated data',
                'Right to restriction: you can ask us to limit how we use your data',
                'Right to data portability: you can request your data in a machine-readable format',
                'Right to object: you can object to certain types of data processing',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:novaimagosupport@gmail.com" className="text-violet-400 hover:text-violet-300 transition">
                novaimagosupport@gmail.com
              </a>. We will respond within 30 days.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Security</h2>
            <p>
              We take the security of your data seriously. All data is stored on secure, encrypted servers. Connections to our service are protected via HTTPS. Payment information is handled exclusively by Stripe and never stored on our servers. We regularly review our security practices to ensure your data is protected.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Cookies</h2>
            <p>
              Nova Imago uses only essential cookies required for the service to function (such as keeping you logged in). We do not use tracking cookies or advertising cookies. We do not share cookie data with third parties for advertising purposes.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Children's Privacy</h2>
            <p>
              Nova Imago is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from minors. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Your continued use of the service after changes take effect constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact</h2>
            <p className="mb-3">
              For any privacy-related questions or data requests, please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-semibold">Nova Imago</p>
              <p className="text-gray-400 mt-1">Belgium</p>
              <a href="mailto:novaimagosupport@gmail.com" className="text-violet-400 hover:text-violet-300 transition mt-1 block">
                novaimagosupport@gmail.com
              </a>
            </div>
          </section>

        </div>

        {/* FOOTER LINKS */}
        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
          <Link href="/" className="hover:text-white transition">Back to Home</Link>
        </div>

      </div>
    </div>
  )
}