import type { Locale } from '@/lib/i18n'

// UI-teksten voor de publieke stijl-showcase (/styles). Catalogus zelf via tr() in styleText.
export interface StylesCopy {
  howItWorks: string
  plans: string
  create: string
  getStarted: string
  heroTitle: string
  heroSubtitle: string // {n} = aantal stijlen
  heroHint: string
  forWomen: string
  forMen: string
  stylesLabel: string
  ctaTitle: string
  ctaBody: string
  ctaButton: string
  close: string
  exampleNote: string
}

export const STYLES: Record<Locale, StylesCopy> = {
  en: {
    howItWorks: 'How It Works', plans: 'Plans', create: 'Create →', getStarted: 'Get Started →',
    heroTitle: 'Browse every style',
    heroSubtitle: '{n}+ professional looks — from boardroom to gala, studio to outdoor. Pick your favourites and get a full set of AI headshots from a single photo shoot.',
    heroHint: 'Tap any style to see it up close.',
    forWomen: 'For Women', forMen: 'For Men', stylesLabel: 'styles',
    ctaTitle: 'Ready to get your headshots?',
    ctaBody: 'Upload a few photos, pick your styles, and get studio-quality headshots in ~30 minutes.',
    ctaButton: 'Create your headshots →', close: 'Close',
    exampleNote: 'Example — your photos will feature your own face.',
  },
  nl: {
    howItWorks: 'Hoe het werkt', plans: 'Prijzen', create: 'Aanmaken →', getStarted: 'Aan de slag →',
    heroTitle: 'Bekijk elke stijl',
    heroSubtitle: '{n}+ professionele looks — van boardroom tot gala, studio tot buiten. Kies je favorieten en ontvang een volledige set AI-headshots uit één fotoshoot.',
    heroHint: 'Tik op een stijl om hem van dichtbij te zien.',
    forWomen: 'Voor vrouwen', forMen: 'Voor mannen', stylesLabel: 'stijlen',
    ctaTitle: 'Klaar voor je headshots?',
    ctaBody: 'Upload een paar foto’s, kies je stijlen en krijg headshots van studiokwaliteit in ~30 minuten.',
    ctaButton: 'Maak je headshots →', close: 'Sluiten',
    exampleNote: 'Voorbeeld — op jouw foto’s staat je eigen gezicht.',
  },
  fr: {
    howItWorks: 'Comment ça marche', plans: 'Tarifs', create: 'Créer →', getStarted: 'Commencer →',
    heroTitle: 'Parcourez tous les styles',
    heroSubtitle: '{n}+ looks professionnels — de la salle de réunion au gala, du studio à l’extérieur. Choisissez vos préférés et recevez une série complète de portraits IA à partir d’une seule séance photo.',
    heroHint: 'Touchez un style pour le voir de près.',
    forWomen: 'Pour femmes', forMen: 'Pour hommes', stylesLabel: 'styles',
    ctaTitle: 'Prêt·e pour vos portraits ?',
    ctaBody: 'Téléchargez quelques photos, choisissez vos styles et obtenez des portraits de qualité studio en ~30 minutes.',
    ctaButton: 'Créer vos portraits →', close: 'Fermer',
    exampleNote: 'Exemple — vos photos montreront votre propre visage.',
  },
  de: {
    howItWorks: 'So funktioniert’s', plans: 'Preise', create: 'Erstellen →', getStarted: 'Loslegen →',
    heroTitle: 'Alle Stile ansehen',
    heroSubtitle: '{n}+ professionelle Looks — vom Boardroom bis zur Gala, vom Studio bis nach draußen. Wähle deine Favoriten und erhalte ein komplettes Set KI-Headshots aus einem einzigen Fotoshooting.',
    heroHint: 'Tippe auf einen Stil, um ihn aus der Nähe zu sehen.',
    forWomen: 'Für Frauen', forMen: 'Für Männer', stylesLabel: 'Stile',
    ctaTitle: 'Bereit für deine Headshots?',
    ctaBody: 'Lade ein paar Fotos hoch, wähle deine Stile und erhalte Headshots in Studioqualität in ~30 Minuten.',
    ctaButton: 'Headshots erstellen →', close: 'Schließen',
    exampleNote: 'Beispiel — auf deinen Fotos ist dein eigenes Gesicht zu sehen.',
  },
  es: {
    howItWorks: 'Cómo funciona', plans: 'Precios', create: 'Crear →', getStarted: 'Empezar →',
    heroTitle: 'Explora todos los estilos',
    heroSubtitle: '{n}+ looks profesionales — de la sala de juntas a la gala, del estudio al exterior. Elige tus favoritos y consigue un set completo de retratos con IA a partir de una sola sesión.',
    heroHint: 'Toca un estilo para verlo de cerca.',
    forWomen: 'Para mujeres', forMen: 'Para hombres', stylesLabel: 'estilos',
    ctaTitle: '¿Listo para tus retratos?',
    ctaBody: 'Sube unas fotos, elige tus estilos y consigue retratos de calidad de estudio en ~30 minutos.',
    ctaButton: 'Crea tus retratos →', close: 'Cerrar',
    exampleNote: 'Ejemplo — tus fotos mostrarán tu propia cara.',
  },
  it: {
    howItWorks: 'Come funziona', plans: 'Prezzi', create: 'Crea →', getStarted: 'Inizia →',
    heroTitle: 'Sfoglia tutti gli stili',
    heroSubtitle: '{n}+ look professionali — dalla sala riunioni al gala, dallo studio all’esterno. Scegli i tuoi preferiti e ottieni un set completo di ritratti AI da un solo shooting.',
    heroHint: 'Tocca uno stile per vederlo da vicino.',
    forWomen: 'Per donne', forMen: 'Per uomini', stylesLabel: 'stili',
    ctaTitle: 'Pronto per i tuoi ritratti?',
    ctaBody: 'Carica qualche foto, scegli i tuoi stili e ottieni ritratti di qualità da studio in ~30 minuti.',
    ctaButton: 'Crea i tuoi ritratti →', close: 'Chiudi',
    exampleNote: 'Esempio — nelle tue foto ci sarà il tuo viso.',
  },
  pt: {
    howItWorks: 'Como funciona', plans: 'Preços', create: 'Criar →', getStarted: 'Começar →',
    heroTitle: 'Explore todos os estilos',
    heroSubtitle: '{n}+ looks profissionais — da sala de reuniões ao gala, do estúdio ao ar livre. Escolha os seus favoritos e receba um conjunto completo de retratos com IA a partir de uma única sessão.',
    heroHint: 'Toque num estilo para o ver de perto.',
    forWomen: 'Para mulheres', forMen: 'Para homens', stylesLabel: 'estilos',
    ctaTitle: 'Pronto para os seus retratos?',
    ctaBody: 'Carregue algumas fotos, escolha os seus estilos e receba retratos com qualidade de estúdio em ~30 minutos.',
    ctaButton: 'Crie os seus retratos →', close: 'Fechar',
    exampleNote: 'Exemplo — nas suas fotos aparece o seu próprio rosto.',
  },
}
