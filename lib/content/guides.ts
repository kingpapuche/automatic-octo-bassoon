import type { Locale } from '@/lib/i18n'

// SEO-contentpagina's ("guides"). Elke guide is per taal vertaald.
export type GuideBlock =
  | { t: 'h2'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }

export interface GuideContent {
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  blocks: GuideBlock[]
  ctaText: string
  ctaSub: string
}

// slug -> per taal. Voeg nieuwe guides toe door een nieuwe slug-key toe te voegen.
export const GUIDES: Record<string, Record<Locale, GuideContent>> = {
  'ai-headshots-for-linkedin': {
    en: {
      metaTitle: 'AI Headshots for LinkedIn — Professional Photo Without a Photographer',
      metaDescription: 'Get a professional LinkedIn photo without a photographer. Turn a few selfies into polished AI headshots for your LinkedIn profile in about 30 minutes.',
      h1: 'AI Headshots for LinkedIn',
      intro: 'Your LinkedIn photo is often the first impression recruiters, clients and colleagues get of you. A polished, professional headshot builds instant trust — but booking a photographer is expensive and slow. Nova Imago turns a few selfies into professional LinkedIn headshots with AI, in about 30 minutes.',
      blocks: [
        { t: 'h2', text: 'Why your LinkedIn photo matters' },
        { t: 'p', text: 'Profiles with a professional photo get far more views, connection requests and replies than those without. A clear, friendly, well-lit headshot signals that you take your professional presence seriously.' },
        { t: 'h2', text: 'How to get your LinkedIn headshot with AI' },
        { t: 'ol', items: [
          'Upload 8–15 clear selfies from different angles.',
          'We train a personal AI model of your face.',
          'Pick your favourite styles — corporate, smart-casual and more.',
          'Download your professional headshots in about 30 minutes.',
        ] },
        { t: 'h2', text: 'Tips for the best LinkedIn headshot' },
        { t: 'ul', items: [
          'Choose a style that matches your industry (formal for finance and law, smart-casual for tech and creative roles).',
          'Go for a clean, uncluttered background.',
          'A natural, approachable smile works best.',
          'Use a high-resolution image so it stays sharp on every device.',
        ] },
        { t: 'h2', text: 'AI headshots vs. a photographer' },
        { t: 'p', text: 'A studio shoot costs hundreds and takes days to arrange. AI headshots cost a fraction, are ready in minutes, and give you dozens of styles to choose from — with a money-back guarantee if you don’t get a usable shot.' },
      ],
      ctaText: 'Create my LinkedIn headshots',
      ctaSub: 'Ready in ~30 minutes · money-back guarantee',
    },
    nl: {
      metaTitle: 'AI-headshots voor LinkedIn — professionele foto zonder fotograaf',
      metaDescription: 'Een professionele LinkedIn-foto zonder fotograaf. Zet een paar selfies om in verzorgde AI-headshots voor je LinkedIn-profiel in ~30 minuten.',
      h1: 'AI-headshots voor LinkedIn',
      intro: 'Je LinkedIn-foto is vaak de eerste indruk die recruiters, klanten en collega’s van je krijgen. Een verzorgde, professionele headshot wekt meteen vertrouwen — maar een fotograaf boeken is duur en traag. Nova Imago zet een paar selfies om in professionele LinkedIn-headshots met AI, in ~30 minuten.',
      blocks: [
        { t: 'h2', text: 'Waarom je LinkedIn-foto ertoe doet' },
        { t: 'p', text: 'Profielen met een professionele foto krijgen veel meer weergaven, connectieverzoeken en reacties dan profielen zonder. Een scherpe, vriendelijke, goed belichte headshot toont dat je je professionele aanwezigheid serieus neemt.' },
        { t: 'h2', text: 'Zo krijg je je LinkedIn-headshot met AI' },
        { t: 'ol', items: [
          'Upload 8–15 scherpe selfies vanuit verschillende hoeken.',
          'Wij trainen een persoonlijk AI-model van je gezicht.',
          'Kies je favoriete stijlen — zakelijk, smart-casual en meer.',
          'Download je professionele headshots in ~30 minuten.',
        ] },
        { t: 'h2', text: 'Tips voor de beste LinkedIn-headshot' },
        { t: 'ul', items: [
          'Kies een stijl die past bij je sector (formeel voor finance en recht, smart-casual voor tech en creatieve functies).',
          'Ga voor een rustige, opgeruimde achtergrond.',
          'Een natuurlijke, toegankelijke glimlach werkt het best.',
          'Gebruik een afbeelding met hoge resolutie zodat ze op elk toestel scherp blijft.',
        ] },
        { t: 'h2', text: 'AI-headshots vs. een fotograaf' },
        { t: 'p', text: 'Een studioshoot kost honderden euro’s en duurt dagen om te regelen. AI-headshots kosten een fractie, zijn klaar in minuten en geven je tientallen stijlen om uit te kiezen — met geld-terug-garantie als je geen bruikbare foto krijgt.' },
      ],
      ctaText: 'Maak mijn LinkedIn-headshots',
      ctaSub: 'Klaar in ~30 minuten · geld-terug-garantie',
    },
    fr: {
      metaTitle: 'Portraits IA pour LinkedIn — photo professionnelle sans photographe',
      metaDescription: 'Une photo LinkedIn professionnelle sans photographe. Transformez quelques selfies en portraits IA soignés pour votre profil LinkedIn en ~30 minutes.',
      h1: 'Portraits IA pour LinkedIn',
      intro: 'Votre photo LinkedIn est souvent la première impression que recruteurs, clients et collègues ont de vous. Un portrait professionnel et soigné inspire confiance immédiatement — mais réserver un photographe coûte cher et prend du temps. Nova Imago transforme quelques selfies en portraits LinkedIn professionnels grâce à l’IA, en ~30 minutes.',
      blocks: [
        { t: 'h2', text: 'Pourquoi votre photo LinkedIn compte' },
        { t: 'p', text: 'Les profils avec une photo professionnelle obtiennent bien plus de vues, de demandes de connexion et de réponses. Un portrait net, avenant et bien éclairé montre que vous prenez votre présence professionnelle au sérieux.' },
        { t: 'h2', text: 'Comment obtenir votre portrait LinkedIn avec l’IA' },
        { t: 'ol', items: [
          'Envoyez 8 à 15 selfies nets sous différents angles.',
          'Nous entraînons un modèle IA personnel de votre visage.',
          'Choisissez vos styles préférés — corporate, smart-casual et plus.',
          'Téléchargez vos portraits professionnels en ~30 minutes.',
        ] },
        { t: 'h2', text: 'Conseils pour le meilleur portrait LinkedIn' },
        { t: 'ul', items: [
          'Choisissez un style adapté à votre secteur (formel pour la finance et le droit, smart-casual pour la tech et les métiers créatifs).',
          'Optez pour un arrière-plan sobre et épuré.',
          'Un sourire naturel et avenant fonctionne le mieux.',
          'Utilisez une image en haute résolution pour qu’elle reste nette sur tous les appareils.',
        ] },
        { t: 'h2', text: 'Portraits IA vs. un photographe' },
        { t: 'p', text: 'Une séance en studio coûte des centaines d’euros et prend des jours à organiser. Les portraits IA coûtent une fraction, sont prêts en minutes et offrent des dizaines de styles — avec une garantie satisfait ou remboursé si vous n’obtenez pas de photo utilisable.' },
      ],
      ctaText: 'Créer mes portraits LinkedIn',
      ctaSub: 'Prêts en ~30 minutes · satisfait ou remboursé',
    },
    de: {
      metaTitle: 'KI-Headshots für LinkedIn — professionelles Foto ohne Fotograf',
      metaDescription: 'Ein professionelles LinkedIn-Foto ohne Fotograf. Verwandle ein paar Selfies in gepflegte KI-Headshots für dein LinkedIn-Profil in ~30 Minuten.',
      h1: 'KI-Headshots für LinkedIn',
      intro: 'Dein LinkedIn-Foto ist oft der erste Eindruck, den Recruiter, Kunden und Kolleg:innen von dir bekommen. Ein gepflegter, professioneller Headshot schafft sofort Vertrauen — aber einen Fotografen zu buchen ist teuer und langsam. Nova Imago verwandelt ein paar Selfies mit KI in professionelle LinkedIn-Headshots, in ~30 Minuten.',
      blocks: [
        { t: 'h2', text: 'Warum dein LinkedIn-Foto zählt' },
        { t: 'p', text: 'Profile mit einem professionellen Foto erhalten deutlich mehr Aufrufe, Kontaktanfragen und Antworten als solche ohne. Ein klarer, sympathischer, gut ausgeleuchteter Headshot zeigt, dass du deinen professionellen Auftritt ernst nimmst.' },
        { t: 'h2', text: 'So bekommst du deinen LinkedIn-Headshot mit KI' },
        { t: 'ol', items: [
          'Lade 8–15 scharfe Selfies aus verschiedenen Winkeln hoch.',
          'Wir trainieren ein persönliches KI-Modell deines Gesichts.',
          'Wähle deine Lieblingsstile — Business, Smart Casual und mehr.',
          'Lade deine professionellen Headshots in ~30 Minuten herunter.',
        ] },
        { t: 'h2', text: 'Tipps für den besten LinkedIn-Headshot' },
        { t: 'ul', items: [
          'Wähle einen Stil, der zu deiner Branche passt (formell für Finanzen und Recht, Smart Casual für Tech und kreative Rollen).',
          'Setze auf einen ruhigen, aufgeräumten Hintergrund.',
          'Ein natürliches, sympathisches Lächeln wirkt am besten.',
          'Nutze ein hochauflösendes Bild, damit es auf jedem Gerät scharf bleibt.',
        ] },
        { t: 'h2', text: 'KI-Headshots vs. ein Fotograf' },
        { t: 'p', text: 'Ein Studioshooting kostet Hunderte und braucht Tage Vorbereitung. KI-Headshots kosten einen Bruchteil, sind in Minuten fertig und bieten Dutzende Stile zur Auswahl — mit Geld-zurück-Garantie, falls du kein brauchbares Foto bekommst.' },
      ],
      ctaText: 'Meine LinkedIn-Headshots erstellen',
      ctaSub: 'Fertig in ~30 Minuten · Geld-zurück-Garantie',
    },
    es: {
      metaTitle: 'Retratos con IA para LinkedIn — foto profesional sin fotógrafo',
      metaDescription: 'Una foto profesional de LinkedIn sin fotógrafo. Convierte unos selfies en retratos con IA pulidos para tu perfil de LinkedIn en ~30 minutos.',
      h1: 'Retratos con IA para LinkedIn',
      intro: 'Tu foto de LinkedIn suele ser la primera impresión que reclutadores, clientes y colegas tienen de ti. Un retrato profesional y cuidado genera confianza al instante — pero contratar a un fotógrafo es caro y lento. Nova Imago convierte unos selfies en retratos profesionales para LinkedIn con IA, en ~30 minutos.',
      blocks: [
        { t: 'h2', text: 'Por qué importa tu foto de LinkedIn' },
        { t: 'p', text: 'Los perfiles con una foto profesional reciben muchas más visitas, solicitudes de conexión y respuestas que los que no la tienen. Un retrato nítido, cercano y bien iluminado demuestra que te tomas en serio tu presencia profesional.' },
        { t: 'h2', text: 'Cómo conseguir tu retrato de LinkedIn con IA' },
        { t: 'ol', items: [
          'Sube 8–15 selfies nítidos desde distintos ángulos.',
          'Entrenamos un modelo de IA personal de tu rostro.',
          'Elige tus estilos favoritos — corporativo, smart-casual y más.',
          'Descarga tus retratos profesionales en ~30 minutos.',
        ] },
        { t: 'h2', text: 'Consejos para el mejor retrato de LinkedIn' },
        { t: 'ul', items: [
          'Elige un estilo acorde a tu sector (formal para finanzas y derecho, smart-casual para tecnología y perfiles creativos).',
          'Opta por un fondo limpio y despejado.',
          'Una sonrisa natural y cercana funciona mejor.',
          'Usa una imagen de alta resolución para que se vea nítida en todos los dispositivos.',
        ] },
        { t: 'h2', text: 'Retratos con IA vs. un fotógrafo' },
        { t: 'p', text: 'Una sesión de estudio cuesta cientos y tarda días en organizarse. Los retratos con IA cuestan una fracción, están listos en minutos y ofrecen decenas de estilos — con garantía de devolución si no obtienes una foto utilizable.' },
      ],
      ctaText: 'Crear mis retratos de LinkedIn',
      ctaSub: 'Listos en ~30 minutos · garantía de devolución',
    },
    it: {
      metaTitle: 'Ritratti IA per LinkedIn — foto professionale senza fotografo',
      metaDescription: 'Una foto LinkedIn professionale senza fotografo. Trasforma qualche selfie in ritratti IA curati per il tuo profilo LinkedIn in ~30 minuti.',
      h1: 'Ritratti IA per LinkedIn',
      intro: 'La tua foto LinkedIn è spesso la prima impressione che recruiter, clienti e colleghi hanno di te. Un ritratto professionale e curato ispira fiducia immediata — ma prenotare un fotografo è costoso e lento. Nova Imago trasforma qualche selfie in ritratti LinkedIn professionali con l’IA, in ~30 minuti.',
      blocks: [
        { t: 'h2', text: 'Perché la tua foto LinkedIn conta' },
        { t: 'p', text: 'I profili con una foto professionale ottengono molte più visualizzazioni, richieste di collegamento e risposte di quelli senza. Un ritratto nitido, cordiale e ben illuminato mostra che prendi sul serio la tua presenza professionale.' },
        { t: 'h2', text: 'Come ottenere il tuo ritratto LinkedIn con l’IA' },
        { t: 'ol', items: [
          'Carica 8–15 selfie nitidi da angolazioni diverse.',
          'Alleniamo un modello IA personale del tuo volto.',
          'Scegli i tuoi stili preferiti — corporate, smart-casual e altro.',
          'Scarica i tuoi ritratti professionali in ~30 minuti.',
        ] },
        { t: 'h2', text: 'Consigli per il miglior ritratto LinkedIn' },
        { t: 'ul', items: [
          'Scegli uno stile adatto al tuo settore (formale per finanza e diritto, smart-casual per tech e ruoli creativi).',
          'Punta su uno sfondo pulito e ordinato.',
          'Un sorriso naturale e cordiale funziona meglio.',
          'Usa un’immagine ad alta risoluzione così resta nitida su ogni dispositivo.',
        ] },
        { t: 'h2', text: 'Ritratti IA vs. un fotografo' },
        { t: 'p', text: 'Un servizio in studio costa centinaia di euro e richiede giorni di organizzazione. I ritratti IA costano una frazione, sono pronti in minuti e offrono decine di stili — con garanzia soddisfatti o rimborsati se non ottieni una foto utilizzabile.' },
      ],
      ctaText: 'Crea i miei ritratti LinkedIn',
      ctaSub: 'Pronti in ~30 minuti · soddisfatti o rimborsati',
    },
    pt: {
      metaTitle: 'Retratos com IA para LinkedIn — foto profissional sem fotógrafo',
      metaDescription: 'Uma foto de LinkedIn profissional sem fotógrafo. Transforme algumas selfies em retratos com IA cuidados para o seu perfil de LinkedIn em ~30 minutos.',
      h1: 'Retratos com IA para LinkedIn',
      intro: 'A sua foto de LinkedIn é muitas vezes a primeira impressão que recrutadores, clientes e colegas têm de si. Um retrato profissional e cuidado gera confiança imediata — mas contratar um fotógrafo é caro e demorado. A Nova Imago transforma algumas selfies em retratos profissionais para LinkedIn com IA, em ~30 minutos.',
      blocks: [
        { t: 'h2', text: 'Porque a sua foto de LinkedIn importa' },
        { t: 'p', text: 'Os perfis com uma foto profissional recebem muito mais visualizações, pedidos de ligação e respostas do que os que não têm. Um retrato nítido, simpático e bem iluminado mostra que leva a sua presença profissional a sério.' },
        { t: 'h2', text: 'Como obter o seu retrato de LinkedIn com IA' },
        { t: 'ol', items: [
          'Carregue 8–15 selfies nítidas de ângulos diferentes.',
          'Treinamos um modelo de IA pessoal do seu rosto.',
          'Escolha os seus estilos favoritos — corporativo, smart-casual e mais.',
          'Descarregue os seus retratos profissionais em ~30 minutos.',
        ] },
        { t: 'h2', text: 'Dicas para o melhor retrato de LinkedIn' },
        { t: 'ul', items: [
          'Escolha um estilo adequado ao seu setor (formal para finanças e direito, smart-casual para tecnologia e funções criativas).',
          'Opte por um fundo limpo e sem distrações.',
          'Um sorriso natural e simpático funciona melhor.',
          'Use uma imagem de alta resolução para que fique nítida em todos os dispositivos.',
        ] },
        { t: 'h2', text: 'Retratos com IA vs. um fotógrafo' },
        { t: 'p', text: 'Uma sessão em estúdio custa centenas e demora dias a organizar. Os retratos com IA custam uma fração, ficam prontos em minutos e oferecem dezenas de estilos — com garantia de reembolso se não obtiver uma foto utilizável.' },
      ],
      ctaText: 'Criar os meus retratos de LinkedIn',
      ctaSub: 'Prontos em ~30 minutos · garantia de reembolso',
    },
  },
}

export const GUIDE_SLUGS = Object.keys(GUIDES)
