import Link from 'next/link'
import Image from 'next/image'
import BeforeAfterSlider from '@/components/beforeafterslider'
import {
  Zap, Palette, Gem, Lock, BadgeDollarSign, ShieldCheck,
  Upload, SlidersHorizontal, Download,
  Camera, Star, Sparkles, Check
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E8E6E0] z-50">
        <div className="max-w-[1320px] mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-semibold text-[#2D2D2D] tracking-tight">
              Nova Imago
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">Why Us</Link>
            <Link href="#pricing" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">Plans</Link>
            <Link href="#how-it-works" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">How It Works</Link>
            <Link href="#faq" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition">Help</Link>
            <Link href="/login" className="text-[#5B4E9D] hover:text-[#483A7C] font-semibold transition">Login</Link>
            <Link href="/login" className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-105">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mt-[90px] py-10 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B4A]/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Tekst kolom */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white px-5 py-2.5 rounded-full shadow-lg mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Powered by FLUX AI — the most realistic model available</span>
              </div>

              <h1 className="font-serif text-[clamp(2rem,4vw,4.5rem)] leading-[1.15] mb-7 text-[#2D2D2D] font-normal tracking-tight">
                Turn Your Selfies Into<br />
                <span className="italic bg-gradient-to-r from-[#7D6FB8] via-[#3A9B8E] to-[#14B8A6] text-transparent bg-clip-text">Professional Headshots</span>
              </h1>

              <p className="text-[1.25rem] text-[#6B6B6B] mb-10 leading-relaxed">
                Upload 10–20 photos. Choose your style. Get studio-quality headshots in under 30 minutes — without a photographer, studio, or expensive session.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/login" className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
                  Get Your Headshots Now →
                </Link>
                <Link href="#pricing" className="bg-white hover:bg-[#5B4E9D] text-[#5B4E9D] hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition border-2 border-[#5B4E9D] hover:-translate-y-1">
                  View Pricing
                </Link>
              </div>

              <div className="flex flex-wrap gap-6">
                {['Ready in 30 minutes', 'Profile-Worthy Guarantee', '100% private & secure'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <span className="text-[#6B6B6B] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider kolom — strikt begrensd */}
            <div className="flex justify-center items-center w-full overflow-hidden">
              <div className="w-full max-w-[360px]">
                <BeforeAfterSlider
                  beforeImage="/images/before.jpeg"
                  afterImage="/images/headshot-42.webp"
                  beforeLabel="Your Selfie"
                  afterLabel="AI Headshot"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Bar */}
      <section className="py-16 px-8 bg-gradient-to-r from-[#5B4E9D] to-[#483A7C] text-white">
        <div className="max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div><h3 className="font-serif text-5xl mb-2">30 min</h3><p className="opacity-90">Average delivery time</p></div>
          <div><h3 className="font-serif text-5xl mb-2">93+</h3><p className="opacity-90">Unique styles available</p></div>
          <div><h3 className="font-serif text-5xl mb-2">$29</h3><p className="opacity-90">Starting price</p></div>
          <div><h3 className="font-serif text-5xl mb-2">🛡️</h3><p className="opacity-90">Profile-Worthy Guarantee</p></div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">How It Works</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">Three simple steps to your perfect headshot</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Upload, title: 'Upload Your Photos', desc: 'Upload 10–20 selfies from different angles and lighting conditions. No professional equipment needed.' },
              { step: '02', icon: SlidersHorizontal, title: 'Choose Your Styles', desc: 'Pick from 93+ hand-curated styles — corporate, casual, creative, full body, and more.' },
              { step: '03', icon: Download, title: 'Receive Your Headshots', desc: 'Your AI-generated headshots are ready in under 30 minutes. Download and use them anywhere.' },
            ].map((item) => (
              <div key={item.step} className="bg-white p-10 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-3 hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-6 right-8 text-[#E8E6E0] font-serif text-6xl font-bold">{item.step}</div>
                <div className="w-14 h-14 bg-[#F0EEF8] rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#5B4E9D]" />
                </div>
                <h3 className="text-[1.375rem] font-bold text-[#2D2D2D] mb-4">{item.title}</h3>
                <p className="text-[#6B6B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL RESULTS SECTION */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">Real People. Real Results.</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">These headshots were generated by Nova Imago. No photographer. No studio.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

            {/* Roy */}
            <div className="bg-[#FAFAF9] rounded-3xl border border-[#E8E6E0] overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Before</div>
                  <Image src="/images/roy-before.jpg" alt="Roy before" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 bg-[#5B4E9D] text-white text-xs font-semibold px-3 py-1.5 rounded-full">AI Headshot</div>
                  <Image src="/images/roy-after.webp" alt="Roy after" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-[#6B6B6B] text-sm italic">&ldquo;Incredible result — looks completely natural and professional.&rdquo;</p>
                <p className="text-[#2D2D2D] font-semibold text-sm mt-2">Roy</p>
              </div>
            </div>

            {/* Leen */}
            <div className="bg-[#FAFAF9] rounded-3xl border border-[#E8E6E0] overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Before</div>
                  <Image src="/images/leen-before.jpg" alt="Leen before" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 bg-[#5B4E9D] text-white text-xs font-semibold px-3 py-1.5 rounded-full">AI Headshot</div>
                  <Image src="/images/leen-after.webp" alt="Leen after" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-[#6B6B6B] text-sm italic">&ldquo;I couldn&apos;t believe how realistic it looks. Using it on LinkedIn right away!&rdquo;</p>
                <p className="text-[#2D2D2D] font-semibold text-sm mt-2">Leen</p>
              </div>
            </div>

            {/* Stijn */}
            <div className="bg-[#FAFAF9] rounded-3xl border border-[#E8E6E0] overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Before</div>
                  <Image src="/images/stijn-before.jpg" alt="Stijn before" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 bg-[#5B4E9D] text-white text-xs font-semibold px-3 py-1.5 rounded-full">AI Headshot</div>
                  <Image src="/images/stijn-after.jpg" alt="Stijn after" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-[#6B6B6B] text-sm italic">&ldquo;Amazing quality — I use it on my LinkedIn profile now!&rdquo;</p>
                <p className="text-[#2D2D2D] font-semibold text-sm mt-2">Stijn</p>
              </div>
            </div>

            {/* Renata */}
            <div className="bg-[#FAFAF9] rounded-3xl border border-[#E8E6E0] overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Before</div>
                  <Image src="/images/renata-before.jpg" alt="Renata before" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 bg-[#5B4E9D] text-white text-xs font-semibold px-3 py-1.5 rounded-full">AI Headshot</div>
                  <Image src="/images/renata-after.jpg" alt="Renata after" width={400} height={500} className="w-full h-[320px] object-cover object-top" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <p className="text-[#6B6B6B] text-sm italic">&ldquo;The results exceeded my expectations. So natural and professional!&rdquo;</p>
                <p className="text-[#2D2D2D] font-semibold text-sm mt-2">Renata</p>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link href="/login" className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 inline-block">
              Get Your Headshots Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">Why Professionals Choose Us</h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">Studio-quality headshots without the studio price tag</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Results in 30 Minutes', desc: 'Upload your selfies and receive professional headshots in under 30 minutes. No waiting days for a photographer.' },
              { icon: Palette, title: '93+ Curated Styles', desc: 'Corporate executive, smart casual, creative, full body, sunglasses, black tie — hand-tuned for consistent quality.' },
              { icon: Gem, title: 'Powered by FLUX AI', desc: 'We use the most advanced AI model available, specifically fine-tuned on your photos for maximum realism.' },
              { icon: Lock, title: 'Your Photos Stay Private', desc: 'Your photos are encrypted, never shared or sold, and automatically deleted after your order is complete.' },
              { icon: BadgeDollarSign, title: 'Save $200–$500', desc: 'A professional photographer charges $300–700 for one session. Get unlimited variations starting at just $29.' },
              { icon: ShieldCheck, title: 'Profile-Worthy Guarantee', desc: 'We guarantee at least 1 profile-worthy headshot in every order — or your money back within 7 days. No questions asked.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-10 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-3 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-[#F0EEF8] rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#5B4E9D]" />
                </div>
                <h3 className="text-[1.375rem] font-bold text-[#2D2D2D] mb-4">{feature.title}</h3>
                <p className="text-[#6B6B6B] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-8 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5">Simple, Honest Pricing</h2>
            <p className="text-xl text-[#6B6B6B]">One-time payment. No subscriptions. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Starter */}
            <div className="bg-[#FAFAF9] p-8 rounded-[28px] border-2 border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-2 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#F0EEF8] rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-[#5B4E9D]" />
              </div>
              <h3 className="text-[1.5rem] font-bold mb-2">Starter</h3>
              <p className="text-[#9B9B9B] text-sm mb-4">40 headshots</p>
              <div className="font-serif text-5xl mb-4"><span className="text-2xl font-sans">$</span>29</div>
              <p className="text-[#9B9B9B] mb-6 text-sm">One-time payment</p>
              <ul className="space-y-3 mb-8">
                {['1 AI model trained on you', '40 headshots', '40 styles to choose from', 'HD quality', 'Ready in 30 minutes'].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0 stroke-[3]" />
                    <span className="text-[#6B6B6B] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full bg-[#5B4E9D] hover:bg-[#483A7C] text-white text-center py-3.5 rounded-full font-semibold transition">Get Started →</Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-[#5B4E9D] to-[#483A7C] p-8 rounded-[28px] border-2 border-[#D4AF37] text-white relative scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#2D2D2D] px-4 py-1.5 rounded-full text-sm font-bold shadow-md">Best Value</div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[1.5rem] font-bold mb-2">Pro</h3>
              <p className="text-white/60 text-sm mb-4">80 headshots</p>
              <div className="font-serif text-5xl mb-4"><span className="text-2xl font-sans">$</span>39</div>
              <p className="text-white/60 mb-6 text-sm">One-time payment</p>
              <ul className="space-y-3 mb-8">
                {['1 AI model trained on you', '80 headshots', '80 styles to choose from', 'HD quality', 'Priority generation', 'Ready in 30 minutes'].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0 stroke-[3]" />
                    <span className="text-white/90 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] text-center py-3.5 rounded-full font-semibold transition">Get Started →</Link>
            </div>

            {/* Premium */}
            <div className="bg-[#FAFAF9] p-8 rounded-[28px] border-2 border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-2 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#F0EEF8] rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#5B4E9D]" />
              </div>
              <h3 className="text-[1.5rem] font-bold mb-2">Premium</h3>
              <p className="text-[#9B9B9B] text-sm mb-4">120 headshots</p>
              <div className="font-serif text-5xl mb-4"><span className="text-2xl font-sans">$</span>49</div>
              <p className="text-[#9B9B9B] mb-6 text-sm">One-time payment</p>
              <ul className="space-y-3 mb-8">
                {['2 AI models trained on you', '120 headshots', 'All 93+ styles included', 'HD quality', 'Priority support', 'Ready in 30 minutes'].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0 stroke-[3]" />
                    <span className="text-[#6B6B6B] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full bg-[#5B4E9D] hover:bg-[#483A7C] text-white text-center py-3.5 rounded-full font-semibold transition">Get Started →</Link>
            </div>

          </div>

          {/* GUARANTEE BANNER */}
          <div className="mt-12 bg-white border-2 border-[#0D9488]/30 rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-sm">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-3">Profile-Worthy Guarantee</h3>
            <p className="text-[#6B6B6B] leading-relaxed mb-5">
              Not every photo will be perfect — that&apos;s the nature of AI. But we guarantee you&apos;ll get at least <span className="text-[#2D2D2D] font-semibold">1 profile-worthy headshot</span> in every order. If not, we refund you in full within 7 days. No forms, no hassle.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {['Full refund within 7 days', 'No questions asked', 'No forms or hassle'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-[#6B6B6B] text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[#9B9B9B] mt-6 text-sm">One-time payment • No subscription ever</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[880px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D]">Common Questions</h2>
          </div>
          <div className="space-y-5">
            {[
              { q: 'How realistic are the AI-generated headshots?', a: 'We use FLUX LoRA — the most advanced AI portrait model available. The AI is trained specifically on your photos, which means the results look like you, not a generic AI person.' },
              { q: 'What kind of photos should I upload?', a: 'Upload 10–20 clear solo photos with good lighting from different angles. Avoid group photos, sunglasses, heavy filters, or blurry images. The more variety, the better the result.' },
              { q: 'How long does it take?', a: 'Training your personal AI model takes about 20–25 minutes. After that, each headshot generates in about 30 seconds.' },
              { q: 'Are my photos safe?', a: 'Yes. Your photos are stored securely, never shared with third parties, and deleted automatically after your order is complete.' },
              { q: 'What if I am not happy with the results?', a: 'We guarantee at least 1 profile-worthy headshot in every order. If not, we refund you in full within 7 days. No forms, no hassle — just contact us.' },
              { q: 'Can I use these headshots commercially?', a: 'Yes. You own the rights to every headshot we generate for you. Use them on LinkedIn, your website, business cards, or anywhere else.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-7 border border-[#E8E6E0] hover:border-[#7D6FB8] transition">
                <h3 className="font-semibold text-lg text-[#2D2D2D] mb-3">{faq.q}</h3>
                <p className="text-[#6B6B6B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-gradient-to-br from-[#3A2D63] via-[#5B4E9D] to-[#0D9488] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-[720px] mx-auto relative z-10">
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] mb-7">Your Best Photo Is One Upload Away</h2>
          <p className="text-[1.375rem] mb-12 opacity-95">No photographer. No studio. No awkward posing. Just upload your selfies and let the AI do the work.</p>
          <Link href="/login" className="inline-block bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] px-10 py-4 rounded-full font-bold text-lg transition shadow-xl hover:scale-105">
            Get Started — From $29 →
          </Link>
          <div className="mt-10 inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-7 py-4 rounded-full">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-semibold">Profile-Worthy Guarantee • Zero Risk</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-16 px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            <div><h4 className="font-bold mb-5 text-lg">Product</h4><ul className="space-y-3">{['Features', 'Pricing', 'How It Works', 'FAQ'].map(i => <li key={i}><Link href={`#${i.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-white transition">{i}</Link></li>)}</ul></div>
            <div><h4 className="font-bold mb-5 text-lg">Company</h4><ul className="space-y-3">{['About', 'Blog', 'Contact'].map(i => <li key={i}><Link href="#" className="text-white/70 hover:text-white transition">{i}</Link></li>)}</ul></div>
            <div><h4 className="font-bold mb-5 text-lg">Use Cases</h4><ul className="space-y-3">{['LinkedIn Headshots', 'Resume Photos', 'Dating Profile', 'Business Portraits'].map(i => <li key={i}><Link href="#" className="text-white/70 hover:text-white transition">{i}</Link></li>)}</ul></div>
            <div><h4 className="font-bold mb-5 text-lg">Legal</h4><ul className="space-y-3">{['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].map(i => <li key={i}><Link href="#" className="text-white/70 hover:text-white transition">{i}</Link></li>)}</ul></div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/60">© 2025 Nova Imago • All rights reserved</div>
        </div>
      </footer>

    </div>
  )
}