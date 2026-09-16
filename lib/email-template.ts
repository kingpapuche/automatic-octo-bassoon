// Herbruikbare gebrande e-mailtemplate voor transactionele mails (Resend).
// Table-based + inline CSS = maximale compatibiliteit in mailclients (Gmail, Outlook, Apple Mail).
// Levert altijd HTML én een platte-tekst-versie (beter voor deliverability / minder spam).

interface EmailButton {
  label: string
  url: string
}

interface EmailOptions {
  previewText: string   // verborgen preheader die in de inbox-preview verschijnt
  heading: string
  paragraphs: string[]  // body-alinea's (platte tekst; worden veilig ge-escaped)
  button?: EmailButton
}

const BRAND = '#5B4E9D'
const TEXT = '#2D2D2D'
const MUTED = '#6B6B6B'
const BG = '#F4F4F5'
const CARD = '#FFFFFF'
const BORDER = '#E8E6E0'
const SITE_URL = 'https://novaimago.ai'
const SUPPORT = 'novaimagosupport@gmail.com'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function brandedEmail(opts: EmailOptions): { html: string; text: string } {
  const { previewText, heading, paragraphs, button } = opts

  const paraHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${TEXT};">${escapeHtml(p)}</p>`
    )
    .join('')

  const buttonHtml = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
         <tr>
           <td align="center" bgcolor="${BRAND}" style="border-radius:10px;">
             <a href="${button.url}" target="_blank"
                style="display:inline-block;padding:14px 30px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;background:${BRAND};">
               ${escapeHtml(button.label)}
             </a>
           </td>
         </tr>
       </table>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <!-- preheader (verborgen inbox-preview) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">

          <!-- header / wordmark -->
          <tr>
            <td align="center" style="padding:8px 0 20px;">
              <a href="${SITE_URL}" target="_blank" style="text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${BRAND};">
                Nova <span style="font-style:italic;">Imago</span>
              </a>
            </td>
          </tr>

          <!-- card -->
          <tr>
            <td style="background:${CARD};border:1px solid ${BORDER};border-radius:16px;padding:32px 32px 28px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${TEXT};font-family:Georgia,'Times New Roman',serif;font-weight:normal;">${escapeHtml(heading)}</h1>
              ${paraHtml}
              ${buttonHtml}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 24px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:${MUTED};">
                Questions? Just reply to this email or contact
                <a href="mailto:${SUPPORT}" style="color:${BRAND};text-decoration:none;">${SUPPORT}</a>.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9A9A9A;">
                You received this account notification because you have a Nova Imago account.<br>
                <a href="${SITE_URL}" style="color:#9A9A9A;text-decoration:underline;">novaimago.ai</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  // Platte-tekst-versie
  const textLines = [
    heading,
    '',
    ...paragraphs,
  ]
  if (button) {
    textLines.push('', `${button.label}: ${button.url}`)
  }
  textLines.push(
    '',
    '—',
    `Questions? Reply to this email or contact ${SUPPORT}.`,
    'You received this account notification because you have a Nova Imago account.',
    SITE_URL
  )
  const text = textLines.join('\n')

  return { html, text }
}
