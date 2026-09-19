import { Link } from '@/lib/nav'
import { Sparkles } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { LEGAL_SHARED, type LegalContent, type Block } from '@/lib/messages/legal'

// Gedeelde layout voor de juridische pagina's. De taal komt uit de URL-prefix (via de page-params).
export default function LegalLayout({ page, locale }: { page: Record<Locale, LegalContent>; locale: Locale }) {
  const s = LEGAL_SHARED[locale]
  const c = page[locale]

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
        <h1 className="font-serif text-4xl text-[#2D2D2D] mb-4">{c.title}</h1>
        <p className="text-[#9B9B9B] mb-4">{s.lastUpdated}</p>

        {locale !== 'en' && s.notice && (
          <p className="text-[#9B9B9B] text-sm italic border-l-2 border-[#5B4E9D]/30 pl-4 mb-12">{s.notice}</p>
        )}
        {(locale === 'en' || !s.notice) && <div className="mb-12" />}

        <div className="space-y-10 text-[#4B4B4B] leading-relaxed">
          {c.blocks.map((b, i) => renderBlock(b, i))}
        </div>
      </div>

      <footer className="border-t border-[#E8E6E0] px-8 py-8 text-center text-[#9B9B9B] text-sm">
        <Link href="/" className="hover:text-[#5B4E9D] transition">{s.back}</Link>
      </footer>
    </div>
  )
}

function renderBlock(b: Block, i: number) {
  switch (b.t) {
    case 'box':
      return (
        <section key={i} className="bg-[#F0EEF8] rounded-2xl p-8 border border-[#5B4E9D]/20">
          <h2 className="font-serif text-2xl text-[#5B4E9D] mb-4">{b.title}</h2>
          <p className="text-[#2D2D2D] text-lg">{b.text}</p>
        </section>
      )
    case 'h2':
      return <h2 key={i} className="font-serif text-2xl text-[#2D2D2D] mb-4 pt-2">{b.text}</h2>
    case 'p':
      return <p key={i}>{b.text}</p>
    case 'pb':
      return <p key={i}><strong>{b.text}</strong></p>
    case 'ul':
      return (
        <ul key={i} className="list-disc pl-6 space-y-2">
          {b.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      )
    case 'dl':
      return (
        <ul key={i} className="list-disc pl-6 space-y-2">
          {b.items.map(([term, desc], j) => <li key={j}><strong>{term}:</strong> {desc}</li>)}
        </ul>
      )
    case 'contact':
      return (
        <p key={i}>
          {b.pre}
          <a href={`mailto:${b.email}`} className="text-[#5B4E9D] underline">{b.email}</a>
          {b.post ?? ''}
        </p>
      )
    case 'linkline':
      return (
        <p key={i}>
          {b.pre}
          <Link href={b.href} className="text-[#5B4E9D] underline">{b.linkText}</Link>
          {b.post}
        </p>
      )
    case 'table':
      return (
        <div key={i} className="overflow-hidden rounded-xl border border-[#E8E6E0]">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F4F0]">
              <tr>
                {b.head.map((h, j) => <th key={j} className="text-left px-4 py-3 text-[#2D2D2D] font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E0]">
              {b.rows.map((row, j) => (
                <tr key={j}>
                  <td className="px-4 py-3 font-mono text-[#5B4E9D]">{row[0]}</td>
                  <td className="px-4 py-3">{row[1]}</td>
                  <td className="px-4 py-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}
