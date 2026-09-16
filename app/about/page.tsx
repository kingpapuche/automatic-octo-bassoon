import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'About Nova Imago',
  description: 'Professional AI headshots from your selfies — studio quality in minutes, without the studio.',
}

export default function AboutPage() {
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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">About Nova Imago</h1>
        <p className="text-xl text-[#6B6B6B] mb-12">Studio-quality headshots, without the studio.</p>

        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">What we do</h2>
            <p>
              Nova Imago turns a handful of everyday selfies into professional headshots. You upload your photos,
              we train a personal AI model just for you, and within minutes you receive a set of polished,
              profile-worthy images across dozens of styles — for LinkedIn, your CV, your website, dating profiles and more.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Why we built it</h2>
            <p>
              A professional photoshoot costs hundreds of euros, takes hours to arrange, and often still leaves you
              with only one or two usable shots. We think everyone deserves a great headshot without that hassle or price tag.
              Nova Imago makes it fast, affordable and something you can do from your couch.
            </p>
          </section>

          <section className="bg-[#F0EEF8] rounded-2xl p-8 border border-[#5B4E9D]/20">
            <h2 className="font-serif text-2xl text-[#5B4E9D] mb-4">Our promise</h2>
            <ul className="list-disc pl-6 space-y-3 text-[#2D2D2D]">
              <li><strong>Quality you can use.</strong> We guarantee at least one profile-worthy headshot in every order — or your money back.</li>
              <li><strong>Your photos are yours.</strong> We never share your images without your permission, and you stay in control of your data.</li>
              <li><strong>Honest pricing.</strong> One-time payment, no subscriptions, no hidden fees.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2D2D2D] mb-4">Get in touch</h2>
            <p>
              Questions or feedback? Email us at{' '}
              <a href="mailto:support@novaimago.ai" className="text-[#5B4E9D] underline">support@novaimago.ai</a> — we&apos;re happy to help.
            </p>
          </section>

          <div className="pt-4">
            <Link href="/" className="inline-block bg-[#5B4E9D] hover:bg-[#483A7C] text-white px-8 py-3.5 rounded-full font-semibold transition">
              Create your headshots →
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">Back to Nova Imago</Link>
      </footer>
    </div>
  )
}
