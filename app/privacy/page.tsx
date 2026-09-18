import { redirect } from 'next/navigation'

// Legacy-URL: leidt door naar het canonieke, vertaalde privacybeleid.
export default function PrivacyRedirect() {
  redirect('/privacy-policy')
}
