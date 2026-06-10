import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

// Versie van het achtergrond-model cachen over warme invocaties heen.
let cachedVersion: string | null = null

async function getBackgroundModelVersion(): Promise<string | null> {
  if (cachedVersion) return cachedVersion
  try {
    const model = await replicate.models.get('851-labs', 'background-remover')
    cachedVersion = (model as { latest_version?: { id?: string } }).latest_version?.id ?? null
    return cachedVersion
  } catch (err) {
    console.error('getBackgroundModelVersion error:', err)
    return null
  }
}

/**
 * Professionele achtergrond-nabewerking (portret-modus): onderwerp blijft scherp,
 * achtergrond wordt sterk geblurd via InSPyReNet (851-labs/background-remover).
 * Verwijdert de "amateur snapshot" look; mensen/rommel worden onopvallend.
 *
 * Raakt het gezicht/onderwerp NIET aan (alleen de achtergrond).
 * Geeft een Buffer terug van de bewerkte PNG, of null bij elke fout (fail-safe:
 * de webhook valt dan terug op de originele foto, generaties breken nooit).
 */
export async function blurBackground(imageUrl: string): Promise<Buffer | null> {
  try {
    const version = await getBackgroundModelVersion()
    if (!version) return null

    const output = await replicate.run(
      `851-labs/background-remover:${version}` as `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          background_type: 'blur', // achtergrond sterk blurren, onderwerp scherp
          format: 'png',
          threshold: 0, // soft alpha matting -> natuurlijke randen
        },
      }
    )

    // Output kan een URL-string, een array, of een FileOutput-achtig object zijn.
    let url: string | null = null
    if (typeof output === 'string') url = output
    else if (Array.isArray(output) && typeof output[0] === 'string') url = output[0]
    else if (output && typeof (output as { url?: () => string }).url === 'function') {
      url = (output as { url: () => string }).url()
    }
    if (!url) return null

    const resp = await fetch(url)
    if (!resp.ok) return null
    return Buffer.from(await resp.arrayBuffer())
  } catch (err) {
    console.error('blurBackground error:', err)
    return null
  }
}
