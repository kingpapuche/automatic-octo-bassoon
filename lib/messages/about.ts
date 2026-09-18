import type { Locale } from '@/lib/i18n'

export interface AboutCopy {
  title: string
  subtitle: string
  whatTitle: string
  whatBody: string
  whyTitle: string
  whyBody: string
  promiseTitle: string
  promise: { b: string; t: string }[]
  contactTitle: string
  contactPre: string
  contactPost: string
  ctaButton: string
  backLink: string
}

export const ABOUT: Record<Locale, AboutCopy> = {
  en: {
    title: 'About Nova Imago', subtitle: 'Studio-quality headshots, without the studio.',
    whatTitle: 'What we do',
    whatBody: 'Nova Imago turns a handful of everyday selfies into professional headshots. You upload your photos, we train a personal AI model just for you, and within minutes you receive a set of polished, profile-worthy images across dozens of styles — for LinkedIn, your CV, your website, dating profiles and more.',
    whyTitle: 'Why we built it',
    whyBody: 'A professional photoshoot costs hundreds of euros, takes hours to arrange, and often still leaves you with only one or two usable shots. We think everyone deserves a great headshot without that hassle or price tag. Nova Imago makes it fast, affordable and something you can do from your couch.',
    promiseTitle: 'Our promise',
    promise: [
      { b: 'Quality you can use.', t: 'We guarantee at least one profile-worthy headshot in every order — or your money back.' },
      { b: 'Your photos are yours.', t: 'We never share your images without your permission, and you stay in control of your data.' },
      { b: 'Honest pricing.', t: 'One-time payment, no subscriptions, no hidden fees.' },
    ],
    contactTitle: 'Get in touch',
    contactPre: 'Questions or feedback? Email us at ', contactPost: ' — we’re happy to help.',
    ctaButton: 'Create your headshots →', backLink: 'Back to Nova Imago',
  },
  nl: {
    title: 'Over Nova Imago', subtitle: 'Headshots van studiokwaliteit, zonder de studio.',
    whatTitle: 'Wat we doen',
    whatBody: 'Nova Imago verandert een handvol alledaagse selfies in professionele headshots. Je uploadt je foto’s, wij trainen een persoonlijk AI-model speciaal voor jou, en binnen enkele minuten ontvang je een set verzorgde, profielwaardige beelden in tientallen stijlen — voor LinkedIn, je cv, je website, datingprofielen en meer.',
    whyTitle: 'Waarom we het bouwden',
    whyBody: 'Een professionele fotoshoot kost honderden euro’s, kost uren om te regelen en levert vaak nog maar één of twee bruikbare foto’s op. Wij vinden dat iedereen een goede headshot verdient zonder dat gedoe of prijskaartje. Nova Imago maakt het snel, betaalbaar en iets wat je vanaf je bank kunt doen.',
    promiseTitle: 'Onze belofte',
    promise: [
      { b: 'Kwaliteit die je kunt gebruiken.', t: 'We garanderen minstens één profielwaardige headshot in elke bestelling — of je geld terug.' },
      { b: 'Jouw foto’s zijn van jou.', t: 'We delen je beelden nooit zonder je toestemming, en jij houdt de controle over je gegevens.' },
      { b: 'Eerlijke prijzen.', t: 'Eenmalige betaling, geen abonnementen, geen verborgen kosten.' },
    ],
    contactTitle: 'Neem contact op',
    contactPre: 'Vragen of feedback? Mail ons op ', contactPost: ' — we helpen je graag.',
    ctaButton: 'Maak je headshots →', backLink: 'Terug naar Nova Imago',
  },
  fr: {
    title: 'À propos de Nova Imago', subtitle: 'Des portraits de qualité studio, sans le studio.',
    whatTitle: 'Ce que nous faisons',
    whatBody: 'Nova Imago transforme quelques selfies du quotidien en portraits professionnels. Vous téléchargez vos photos, nous entraînons un modèle IA personnel rien que pour vous, et en quelques minutes vous recevez une série d’images soignées et dignes d’un profil, dans des dizaines de styles — pour LinkedIn, votre CV, votre site web, les applis de rencontre et plus encore.',
    whyTitle: 'Pourquoi nous l’avons créé',
    whyBody: 'Une séance photo professionnelle coûte des centaines d’euros, prend des heures à organiser et ne laisse souvent qu’une ou deux photos utilisables. Nous pensons que tout le monde mérite un bon portrait sans ces tracas ni ce prix. Nova Imago rend cela rapide, abordable et réalisable depuis votre canapé.',
    promiseTitle: 'Notre promesse',
    promise: [
      { b: 'Une qualité utilisable.', t: 'Nous garantissons au moins un portrait digne d’un profil dans chaque commande — ou remboursé.' },
      { b: 'Vos photos vous appartiennent.', t: 'Nous ne partageons jamais vos images sans votre autorisation, et vous gardez le contrôle de vos données.' },
      { b: 'Des prix honnêtes.', t: 'Paiement unique, pas d’abonnement, pas de frais cachés.' },
    ],
    contactTitle: 'Nous contacter',
    contactPre: 'Des questions ou des retours ? Écrivez-nous à ', contactPost: ' — nous serons ravis de vous aider.',
    ctaButton: 'Créer vos portraits →', backLink: 'Retour à Nova Imago',
  },
  de: {
    title: 'Über Nova Imago', subtitle: 'Headshots in Studioqualität, ohne Studio.',
    whatTitle: 'Was wir tun',
    whatBody: 'Nova Imago verwandelt eine Handvoll alltäglicher Selfies in professionelle Headshots. Du lädst deine Fotos hoch, wir trainieren ein persönliches KI-Modell nur für dich, und innerhalb von Minuten erhältst du eine Reihe gepflegter, profilwürdiger Bilder in Dutzenden Stilen — für LinkedIn, deinen Lebenslauf, deine Website, Dating-Profile und mehr.',
    whyTitle: 'Warum wir es gebaut haben',
    whyBody: 'Ein professionelles Fotoshooting kostet Hunderte von Euro, braucht Stunden Vorbereitung und liefert oft trotzdem nur ein oder zwei brauchbare Aufnahmen. Wir finden, dass jeder einen guten Headshot verdient — ohne diesen Aufwand oder Preis. Nova Imago macht es schnell, erschwinglich und von der Couch aus machbar.',
    promiseTitle: 'Unser Versprechen',
    promise: [
      { b: 'Qualität, die du nutzen kannst.', t: 'Wir garantieren mindestens einen profilwürdigen Headshot in jeder Bestellung — oder Geld zurück.' },
      { b: 'Deine Fotos gehören dir.', t: 'Wir teilen deine Bilder niemals ohne deine Erlaubnis, und du behältst die Kontrolle über deine Daten.' },
      { b: 'Ehrliche Preise.', t: 'Einmalige Zahlung, keine Abos, keine versteckten Gebühren.' },
    ],
    contactTitle: 'Kontakt aufnehmen',
    contactPre: 'Fragen oder Feedback? Schreib uns an ', contactPost: ' — wir helfen gerne.',
    ctaButton: 'Headshots erstellen →', backLink: 'Zurück zu Nova Imago',
  },
  es: {
    title: 'Acerca de Nova Imago', subtitle: 'Retratos con calidad de estudio, sin el estudio.',
    whatTitle: 'Qué hacemos',
    whatBody: 'Nova Imago convierte un puñado de selfies cotidianos en retratos profesionales. Subes tus fotos, entrenamos un modelo de IA personal solo para ti, y en minutos recibes un conjunto de imágenes pulidas y dignas de un perfil, en decenas de estilos — para LinkedIn, tu CV, tu web, perfiles de citas y más.',
    whyTitle: 'Por qué lo creamos',
    whyBody: 'Una sesión de fotos profesional cuesta cientos de euros, lleva horas organizarla y a menudo solo deja una o dos fotos utilizables. Creemos que todos merecen un buen retrato sin esa molestia ni ese precio. Nova Imago lo hace rápido, asequible y algo que puedes hacer desde el sofá.',
    promiseTitle: 'Nuestra promesa',
    promise: [
      { b: 'Calidad que puedes usar.', t: 'Garantizamos al menos un retrato digno de un perfil en cada pedido — o te devolvemos el dinero.' },
      { b: 'Tus fotos son tuyas.', t: 'Nunca compartimos tus imágenes sin tu permiso, y tú mantienes el control de tus datos.' },
      { b: 'Precios honestos.', t: 'Pago único, sin suscripciones, sin cargos ocultos.' },
    ],
    contactTitle: 'Contáctanos',
    contactPre: '¿Preguntas o comentarios? Escríbenos a ', contactPost: ' — estaremos encantados de ayudar.',
    ctaButton: 'Crea tus retratos →', backLink: 'Volver a Nova Imago',
  },
  it: {
    title: 'Chi siamo', subtitle: 'Ritratti di qualità da studio, senza lo studio.',
    whatTitle: 'Cosa facciamo',
    whatBody: 'Nova Imago trasforma una manciata di selfie di tutti i giorni in ritratti professionali. Carichi le tue foto, alleniamo un modello AI personale solo per te, e in pochi minuti ricevi una serie di immagini curate e degne di un profilo, in decine di stili — per LinkedIn, il tuo CV, il tuo sito web, i profili di incontri e altro ancora.',
    whyTitle: 'Perché l’abbiamo creato',
    whyBody: 'Un servizio fotografico professionale costa centinaia di euro, richiede ore per organizzarsi e spesso lascia comunque solo una o due foto utilizzabili. Crediamo che tutti meritino un bel ritratto senza quella seccatura o quel prezzo. Nova Imago lo rende veloce, accessibile e realizzabile dal divano.',
    promiseTitle: 'La nostra promessa',
    promise: [
      { b: 'Qualità utilizzabile.', t: 'Garantiamo almeno un ritratto degno di un profilo in ogni ordine — o soldi indietro.' },
      { b: 'Le tue foto sono tue.', t: 'Non condividiamo mai le tue immagini senza il tuo permesso, e mantieni il controllo dei tuoi dati.' },
      { b: 'Prezzi onesti.', t: 'Pagamento unico, niente abbonamenti, nessun costo nascosto.' },
    ],
    contactTitle: 'Contattaci',
    contactPre: 'Domande o feedback? Scrivici a ', contactPost: ' — saremo felici di aiutarti.',
    ctaButton: 'Crea i tuoi ritratti →', backLink: 'Torna a Nova Imago',
  },
  pt: {
    title: 'Sobre a Nova Imago', subtitle: 'Retratos com qualidade de estúdio, sem o estúdio.',
    whatTitle: 'O que fazemos',
    whatBody: 'A Nova Imago transforma um punhado de selfies do dia a dia em retratos profissionais. Carrega as suas fotos, treinamos um modelo de IA pessoal só para si, e em minutos recebe um conjunto de imagens polidas e dignas de um perfil, em dezenas de estilos — para o LinkedIn, o seu CV, o seu site, perfis de encontros e muito mais.',
    whyTitle: 'Porque o criámos',
    whyBody: 'Uma sessão fotográfica profissional custa centenas de euros, leva horas a organizar e muitas vezes ainda deixa apenas uma ou duas fotos utilizáveis. Achamos que todos merecem um bom retrato sem esse incómodo ou preço. A Nova Imago torna-o rápido, acessível e algo que pode fazer do sofá.',
    promiseTitle: 'A nossa promessa',
    promise: [
      { b: 'Qualidade que pode usar.', t: 'Garantimos pelo menos um retrato digno de um perfil em cada encomenda — ou devolvemos o seu dinheiro.' },
      { b: 'As suas fotos são suas.', t: 'Nunca partilhamos as suas imagens sem a sua permissão, e mantém o controlo dos seus dados.' },
      { b: 'Preços honestos.', t: 'Pagamento único, sem subscrições, sem taxas escondidas.' },
    ],
    contactTitle: 'Fale connosco',
    contactPre: 'Perguntas ou feedback? Escreva-nos para ', contactPost: ' — teremos todo o gosto em ajudar.',
    ctaButton: 'Crie os seus retratos →', backLink: 'Voltar à Nova Imago',
  },
}
