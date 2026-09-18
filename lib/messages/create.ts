import type { Locale } from '@/lib/i18n'

interface ModelSelectCopy { loading: string; forWho: string; forWhoDesc: string; modelFallback: string; chooseStyles: string }
interface GenerationsCopy { notFound: string; toGallery: string; oops: string; generating: string; photosReady: string; startingUp: string; complete: string; takesMinutes: string }
interface CreateBundle { modelSelect: ModelSelectCopy; generations: GenerationsCopy }

const en: CreateBundle = {
  modelSelect: { loading: 'Loading…', forWho: 'Who are these headshots for?', forWhoDesc: 'Choose the person — we’ll show the right styles for them.', modelFallback: 'model', chooseStyles: 'Choose styles →' },
  generations: { notFound: 'Generation not found', toGallery: 'To gallery', oops: 'Oops', generating: 'Generating Your Headshots', photosReady: '{done} of {total} photos ready', startingUp: 'Starting up...', complete: 'complete', takesMinutes: 'This takes a few minutes. You’ll be taken to your gallery automatically when all photos are ready.' },
}
const nl: CreateBundle = {
  modelSelect: { loading: 'Laden…', forWho: 'Voor wie zijn deze headshots?', forWhoDesc: 'Kies de persoon — we tonen de juiste stijlen voor hem/haar.', modelFallback: 'model', chooseStyles: 'Kies stijlen →' },
  generations: { notFound: 'Generatie niet gevonden', toGallery: 'Naar gallerij', oops: 'Oeps', generating: 'Je headshots worden gegenereerd', photosReady: '{done} van {total} foto’s klaar', startingUp: 'Opstarten...', complete: 'voltooid', takesMinutes: 'Dit duurt enkele minuten. Je wordt automatisch naar je gallerij gebracht zodra alle foto’s klaar zijn.' },
}
const fr: CreateBundle = {
  modelSelect: { loading: 'Chargement…', forWho: 'Pour qui sont ces portraits ?', forWhoDesc: 'Choisissez la personne — nous afficherons les styles adaptés.', modelFallback: 'modèle', chooseStyles: 'Choisir les styles →' },
  generations: { notFound: 'Génération introuvable', toGallery: 'Vers la galerie', oops: 'Oups', generating: 'Génération de vos portraits', photosReady: '{done} sur {total} photos prêtes', startingUp: 'Démarrage...', complete: 'terminé', takesMinutes: 'Cela prend quelques minutes. Vous serez redirigé vers votre galerie dès que toutes les photos sont prêtes.' },
}
const de: CreateBundle = {
  modelSelect: { loading: 'Laden…', forWho: 'Für wen sind diese Headshots?', forWhoDesc: 'Wähle die Person — wir zeigen die passenden Stile.', modelFallback: 'Modell', chooseStyles: 'Stile wählen →' },
  generations: { notFound: 'Generierung nicht gefunden', toGallery: 'Zur Galerie', oops: 'Ups', generating: 'Deine Headshots werden generiert', photosReady: '{done} von {total} Fotos fertig', startingUp: 'Startet...', complete: 'fertig', takesMinutes: 'Das dauert ein paar Minuten. Du wirst automatisch zu deiner Galerie gebracht, sobald alle Fotos fertig sind.' },
}
const es: CreateBundle = {
  modelSelect: { loading: 'Cargando…', forWho: '¿Para quién son estos retratos?', forWhoDesc: 'Elige a la persona — mostraremos los estilos adecuados.', modelFallback: 'modelo', chooseStyles: 'Elegir estilos →' },
  generations: { notFound: 'Generación no encontrada', toGallery: 'A la galería', oops: 'Vaya', generating: 'Generando tus retratos', photosReady: '{done} de {total} fotos listas', startingUp: 'Iniciando...', complete: 'completado', takesMinutes: 'Esto tarda unos minutos. Te llevaremos a tu galería automáticamente cuando todas las fotos estén listas.' },
}
const it: CreateBundle = {
  modelSelect: { loading: 'Caricamento…', forWho: 'Per chi sono questi ritratti?', forWhoDesc: 'Scegli la persona — mostreremo gli stili giusti.', modelFallback: 'modello', chooseStyles: 'Scegli gli stili →' },
  generations: { notFound: 'Generazione non trovata', toGallery: 'Alla galleria', oops: 'Ops', generating: 'Generazione dei tuoi ritratti', photosReady: '{done} di {total} foto pronte', startingUp: 'Avvio...', complete: 'completato', takesMinutes: 'Ci vogliono alcuni minuti. Verrai portato alla tua galleria automaticamente quando tutte le foto sono pronte.' },
}
const pt: CreateBundle = {
  modelSelect: { loading: 'Carregando…', forWho: 'Para quem são estes retratos?', forWhoDesc: 'Escolha a pessoa — mostraremos os estilos certos.', modelFallback: 'modelo', chooseStyles: 'Escolher estilos →' },
  generations: { notFound: 'Geração não encontrada', toGallery: 'Para a galeria', oops: 'Ops', generating: 'Gerando seus retratos', photosReady: '{done} de {total} fotos prontas', startingUp: 'Iniciando...', complete: 'concluído', takesMinutes: 'Isso leva alguns minutos. Você será levado à sua galeria automaticamente quando todas as fotos estiverem prontas.' },
}

export const CREATE: Record<Locale, CreateBundle> = { en, nl, fr, de, es, it, pt }
