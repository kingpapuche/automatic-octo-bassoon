import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E8E6E0] z-50">
        <div className="max-w-[1320px] mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B4E9D] to-[#7D6FB8] rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
              ✨
            </div>
            <span className="font-serif text-2xl font-semibold text-[#2D2D2D] tracking-tight">
              BestAIHeadshot
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition tracking-tight">
              Why Us
            </Link>
            <Link href="#pricing" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition tracking-tight">
              Plans
            </Link>
            <Link href="#reviews" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition tracking-tight">
              Reviews
            </Link>
            <Link href="#faq" className="text-[#6B6B6B] hover:text-[#5B4E9D] font-medium transition tracking-tight">
              Help
            </Link>
            <Link 
              href="/upload"
              className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-7 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - SIMPLE VERSION */}
      <section className="mt-[90px] py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B4A]/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="max-w-[1320px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5B4E9D] to-[#7D6FB8] text-white px-5 py-2.5 rounded-full shadow-lg mb-8">
            <span className="text-sm font-semibold">⭐ Rated #1 by 50,000+ Professionals</span>
          </div>
          
      <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.2] mb-7 text-[#2D2D2D] font-normal tracking-tight">
  Transform Selfies into<br/>
  <span className="italic bg-gradient-to-r from-[#7D6FB8] via-[#3A9B8E] to-[#14B8A6] text-transparent bg-clip-text inline-block pr-6 pb-2 mr-3">Studio-Grade</span>
  Headshots
</h1>
          
          <p className="text-[1.375rem] text-[#6B6B6B] max-w-[680px] mb-10 leading-relaxed">
            Upload 10 casual photos. Get 100 professional headshots in under 30 minutes. Perfect for LinkedIn, resumes, and your professional presence. No photographer. No studio. No stress.
          </p>
          
          <div className="flex flex-wrap gap-5 mb-12">
            <Link 
              href="/upload"
              className="bg-[#FF6B4A] hover:bg-[#FF5230] text-white px-10 py-4 rounded-full font-semibold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105"
            >
              Get Your Headshots Now →
            </Link>
            <Link 
              href="#pricing"
              className="bg-white hover:bg-[#5B4E9D] text-[#5B4E9D] hover:text-white px-10 py-4 rounded-full font-semibold text-lg transition border-2 border-[#5B4E9D] hover:-translate-y-1"
            >
              View Sample Results
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-8">
            {['Results in under 30 minutes', 'Money-back guarantee', '100% privacy protected'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#0D9488] rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                <span className="text-[#6B6B6B] font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="aspect-[3/4] bg-gradient-to-br from-[#E8E6F0] to-[#F5F4F0] rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer"
              >
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-8 bg-gradient-to-r from-[#5B4E9D] to-[#483A7C] text-white">
        <div className="max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="font-serif text-5xl mb-2 font-normal">50,000+</h3>
            <p className="opacity-90">Happy Professionals</p>
          </div>
          <div>
            <h3 className="font-serif text-5xl mb-2 font-normal">4.9/5</h3>
            <p className="opacity-90">Average Rating</p>
          </div>
          <div>
            <h3 className="font-serif text-5xl mb-2 font-normal">30 min</h3>
            <p className="opacity-90">Average Delivery</p>
          </div>
          <div>
            <h3 className="font-serif text-5xl mb-2 font-normal">98%</h3>
            <p className="opacity-90">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">
              Why Top Professionals Choose Us
            </h2>
            <p className="text-xl text-[#6B6B6B] max-w-[640px] mx-auto leading-relaxed">
              The most advanced AI headshot technology, backed by proven results and unmatched quality
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { emoji: '⚡', title: 'Lightning-Fast Results', desc: 'Upload your selfies and receive 100+ professional variations in under 30 minutes. Skip the multi-week photographer booking process.' },
              { emoji: '🎨', title: 'Industry-Specific Styles', desc: 'Choose from 100+ curated styles: corporate executive, creative professional, tech startup, or academic. Tailored to your field.' },
              { emoji: '💎', title: 'Unmatched Realism', desc: 'Advanced AI captures your unique facial features, skin texture, and natural expressions. 99% of users say "It looks exactly like me."' },
              { emoji: '🔐', title: 'Enterprise-Grade Security', desc: 'Your photos are encrypted, never used for training, and auto-deleted after 30 days. SOC 2 Type II certified.' },
              { emoji: '💰', title: 'Fraction of Studio Cost', desc: 'Professional photographers charge $300-700 per session. Get unlimited variations for just $39-49. One-time payment, no subscription.' },
              { emoji: '🎁', title: 'Risk-Free Guarantee', desc: 'Not satisfied? Full refund within 7 days, no questions asked. We\'re confident you\'ll love your results.' },
            ].map((feature) => (
              <div 
                key={feature.title}
                className="bg-white p-10 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-3 hover:shadow-xl transition-all duration-300"
              >
                <span className="text-5xl block mb-6">{feature.emoji}</span>
                <h3 className="text-[1.375rem] font-bold text-[#2D2D2D] mb-4 tracking-tight">{feature.title}</h3>
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
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">
              Choose Your Perfect Package
            </h2>
            <p className="text-xl text-[#6B6B6B]">
              One-time payment. Zero subscriptions. Unlimited possibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-10 rounded-[28px] border-2 border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-2 hover:shadow-xl transition-all">
              <h3 className="text-[1.75rem] font-bold mb-4">Starter</h3>
              <div className="font-serif text-6xl mb-4 font-normal">
                <span className="text-3xl font-sans">$</span>39
              </div>
              <p className="text-[#9B9B9B] mb-8">One-time payment</p>
              
              <ul className="space-y-4 mb-10">
                {[
                  '40 professional headshots',
                  '20+ style variations',
                  'HD quality (1024x1024)',
                  'Ready in under 30 minutes',
                  'Download within 30 days',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-[#0D9488] font-bold text-xl mt-0.5">✓</span>
                    <span className="text-[#6B6B6B] leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/upload?plan=starter"
                className="block w-full bg-[#5B4E9D] hover:bg-[#483A7C] text-white text-center py-4 rounded-full font-semibold transition"
              >
                Get Started →
              </Link>
            </div>

            {/* Pro - Featured */}
            <div className="bg-gradient-to-br from-[#5B4E9D] to-[#483A7C] p-10 rounded-[28px] border-2 border-[#D4AF37] text-white relative scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#2D2D2D] px-5 py-2 rounded-full text-sm font-bold shadow-md">
                🔥 Most Popular
              </div>
              
              <h3 className="text-[1.75rem] font-bold mb-4">Professional</h3>
              <div className="font-serif text-6xl mb-4 font-normal">
                <span className="text-3xl font-sans">$</span>49
              </div>
              <p className="text-white/70 mb-8">One-time payment • Best value</p>
              
              <ul className="space-y-4 mb-10">
                {[
                  '100 professional headshots',
                  '50+ premium styles',
                  '4K quality (2048x2048)',
                  'Ready in under 30 minutes',
                  'ALL premium styles unlocked',
                  'Download within 30 days',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-[#D4AF37] font-bold text-xl mt-0.5">✓</span>
                    <span className="text-white/90 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/upload?plan=pro"
                className="block w-full bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] text-center py-4 rounded-full font-semibold transition"
              >
                Get Started →
              </Link>
            </div>

            
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 px-8 bg-[#FAFAF9]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] mb-5 font-normal tracking-tight">
              What Professionals Are Saying
            </h2>
            <p className="text-xl text-[#6B6B6B]">
              Join thousands who've transformed their professional image
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer Martinez',
                role: 'Senior Product Manager',
                text: 'Absolutely incredible results! I needed new headshots for a job interview and didn\'t have time for a photographer. These AI-generated photos looked so professional that my recruiter asked who did my photoshoot. Worth every penny!',
              },
              {
                name: 'David Chen',
                role: 'Startup Founder & CEO',
                text: 'Game changer for our startup. We needed professional headshots for our entire team (12 people) for the website. Saved us $3,500+ compared to hiring a photographer, and the quality is indistinguishable from studio shots.',
              },
              {
                name: 'Emily Roberts',
                role: 'Real Estate Agent',
                text: 'As a realtor, having great headshots is crucial. I was skeptical about AI, but these are phenomenal. They captured my personality perfectly, and I\'ve gotten so many compliments from clients. My profile views increased 180%!',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-[#F5F4F0] p-8 rounded-3xl border border-[#E8E6E0] hover:border-[#7D6FB8] hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5B4E9D] to-[#0D9488] rounded-full shadow-md"></div>
                  <div>
                    <h4 className="font-bold text-[#2D2D2D] text-lg">{testimonial.name}</h4>
                    <p className="text-[#6B6B6B] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-[#D4AF37] text-xl mb-4 tracking-wider">★★★★★</div>
                <blockquote className="text-[#6B6B6B] leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-8 bg-white">
        <div className="max-w-[880px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] text-[#2D2D2D] font-normal tracking-tight">
              Common Questions Answered
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                q: 'How accurate are the AI-generated headshots?',
                a: 'Our advanced AI technology captures your unique facial features, skin tone, and natural expressions with 99% accuracy. Most users say their AI headshots are indistinguishable from professional studio photographs.',
              },
              {
                q: 'What kind of photos should I upload?',
                a: 'Upload 10-20 clear selfies with good lighting from different angles. Include variety: close-ups, different expressions, various backgrounds. Avoid group photos, sunglasses, or heavily filtered images for best results.',
              },
              {
                q: 'How long until I receive my headshots?',
                a: 'Most orders are completed within 30 minutes. We\'ll send you an email notification as soon as your professional headshots are ready to download.',
              },
              {
                q: 'Is my data and photos secure?',
                a: 'Absolutely. We\'re SOC 2 Type II certified. Your photos are encrypted during upload, never used to train our AI models, and automatically deleted after 30 days. Your privacy is our top priority.',
              },
              {
                q: 'What if I\'m not satisfied with the results?',
                a: 'We offer a 100% money-back guarantee within 7 days of purchase. If you\'re not completely satisfied with your headshots, simply email us and we\'ll process your full refund immediately—no questions asked.',
              },
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
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] mb-7 font-normal tracking-tight">
            Ready to Elevate Your Professional Image?
          </h2>
          <p className="text-[1.375rem] mb-12 opacity-95 leading-relaxed">
            Join 50,000+ professionals who've transformed their careers with AI-powered headshots
          </p>
          
          <Link
            href="/upload"
            className="inline-block bg-white hover:bg-[#F5F4F0] text-[#5B4E9D] px-10 py-4 rounded-full font-bold text-lg transition shadow-xl hover:scale-105"
          >
            Start Your Transformation →
          </Link>

          <div className="mt-10 inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-7 py-4 rounded-full">
            <span className="text-2xl">🛡️</span>
            <span className="font-semibold">7-Day Money-Back Guarantee • Zero Risk</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-16 px-8">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            <div>
              <h4 className="font-bold mb-5 text-lg">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Reviews', 'FAQ'].map(item => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-white/70 hover:text-white transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">Use Cases</h4>
              <ul className="space-y-3">
                {['LinkedIn Headshots', 'Resume Photos', 'Corporate Headshots', 'Business Portraits'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-white/70 hover:text-white transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">Legal</h4>
              <ul className="space-y-3">
                {['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-white/70 hover:text-white transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-white/60">
            © 2025 BestAIHeadshot • All rights reserved
          </div>
        </div>
      </footer>
    </div>
  )
}