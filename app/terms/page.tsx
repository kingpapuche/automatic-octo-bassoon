import { redirect } from 'next/navigation'

// Legacy-URL: leidt door naar de canonieke, vertaalde voorwaarden.
export default function TermsRedirect() {
  redirect('/terms-of-service')
}
