import Link from 'next/link'

export default function RefundPolicyPage() {
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
        <h1 className="font-serif text-4xl font-bold text-[#2D2D2D] mb-2">Refund Policy</h1>
        <p className="text-[#9B9B9B] mb-10">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[#4B4B4B] leading-relaxed">

          {/* Guarantee Banner */}
          <div className="bg-white border-2 border-[#0D9488]/30 rounded-3xl p-8 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h2 className="font-serif text-2xl text-[#2D2D2D] font-semibold mb-3">Profile-Worthy Guarantee</h2>
            <p className="text-[#6B6B6B]">We guarantee at least 1 profile-worthy headshot in every order. If not, we refund you in full within 7 days. No forms, no hassle.</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Our Guarantee</h2>
            <p>We stand behind the quality of our AI-generated headshots. Every order comes with our Profile-Worthy Guarantee: if you do not receive at least one headshot that you consider profile-worthy, you are entitled to a full refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Refund Conditions</h2>
            <p>To be eligible for a refund, the following conditions must be met:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your refund request must be submitted within <strong>7 days</strong> of your order being completed</li>
              <li><strong>No headshots have been downloaded</strong> from your account. Once any headshot has been downloaded, the order is considered used and no refund will be issued</li>
              <li>You must contact us via email to request your refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Non-Refundable Cases</h2>
            <p>Refunds will not be issued in the following situations:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>One or more headshots have been downloaded from your account</li>
              <li>The refund request is made more than 7 days after order completion</li>
              <li>Poor results caused by low-quality upload photos (blurry, group photos, heavy filters, sunglasses)</li>
              <li>Dissatisfaction with style choices made by the customer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">How to Request a Refund</h2>
            <p>To request a refund, simply send an email to <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a> with:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>The email address associated with your account</li>
              <li>A brief description of why you are unsatisfied</li>
            </ul>
            <p className="mt-3">We will process your refund within <strong>3-5 business days</strong>. No forms, no hassle.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Tips for Best Results</h2>
            <p>To maximize the quality of your headshots, please ensure your uploaded photos:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Are clear and in focus</li>
              <li>Show only you (no group photos)</li>
              <li>Have good lighting</li>
              <li>Do not have heavy filters or sunglasses</li>
              <li>Include a variety of angles and expressions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Contact</h2>
            <p>For refund requests or questions, contact us at: <a href="mailto:novaimagosupport@gmail.com" className="text-[#5B4E9D]">novaimagosupport@gmail.com</a></p>
          </section>

        </div>
      </div>

      <footer className="bg-[#2D2D2D] text-white py-8 px-8 text-center text-white/60 text-sm">
        © 2026 Nova Imago • <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link> • <Link href="/terms" className="hover:text-white transition">Terms of Service</Link> • <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
      </footer>
    </div>
  )
}