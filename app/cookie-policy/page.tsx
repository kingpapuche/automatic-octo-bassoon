import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function CookiePolicyPage() {
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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">Cookie Policy</h1>
        <p className="text-[#9B9B9B] mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Cookies We Use</h2>
            <p>Nova Imago uses only <strong>essential cookies</strong> — we do not use advertising or tracking cookies.</p>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#E8E6E0]">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F4F0]">
                  <tr>
                    <th className="text-left px-4 py-3 text-[#2D2D2D] font-semibold">Cookie</th>
                    <th className="text-left px-4 py-3 text-[#2D2D2D] font-semibold">Purpose</th>
                    <th className="text-left px-4 py-3 text-[#2D2D2D] font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E0]">
                  <tr>
                    <td className="px-4 py-3 font-mono text-[#5B4E9D]">sb-auth-token</td>
                    <td className="px-4 py-3">Keeps you logged in to your account</td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-[#5B4E9D]">sb-refresh-token</td>
                    <td className="px-4 py-3">Refreshes your login session automatically</td>
                    <td className="px-4 py-3">7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">What We Do NOT Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No Google Analytics or tracking pixels</li>
              <li>No Facebook or social media tracking</li>
              <li>No advertising cookies</li>
              <li>No third-party cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Managing Cookies</h2>
            <p>You can disable cookies in your browser settings. However, disabling essential cookies will prevent you from logging in to your account.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Contact</h2>
            <p>For questions about our cookie policy, contact us at: <a href="mailto:privacy@novaimago.ai" className="text-[#5B4E9D] underline">privacy@novaimago.ai</a></p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">← Back to Nova Imago</Link>
      </footer>
    </div>
  )
}