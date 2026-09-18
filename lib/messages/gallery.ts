import type { Locale } from '@/lib/i18n'

interface GalleryCopy {
  loading: string; redirecting: string; dashboard: string; generateMore: string
  title: string; photosGenerated: string; downloadTip: string; downloadTipStrong: string
  none: string; generateFirst: string; download: string
}
interface ReviewCopy {
  thanks: string; thanksDesc: string; question: string; private: string
  placeholder: string; consent: string; selectStar: string; error: string; sending: string; submit: string; stars: string
}
interface GalleryBundle { gallery: GalleryCopy; review: ReviewCopy }

const en: GalleryBundle = {
  gallery: {
    loading: 'Loading your headshots...', redirecting: 'Redirecting to login...', dashboard: '← Dashboard', generateMore: 'Generate More',
    title: 'Your Headshots', photosGenerated: 'photos generated',
    downloadTip: 'Tip:', downloadTipStrong: 'download the headshots you want to keep',
    none: 'No headshots yet!', generateFirst: 'Generate Your First Headshot', download: 'Download',
  },
  review: {
    thanks: 'Thanks for your feedback!', thanksDesc: 'It really helps us improve Nova Imago.',
    question: 'How was your experience?', private: 'Your feedback is private — only the Nova Imago team sees it.',
    placeholder: 'Tell us what you think... (optional)', consent: 'You may use my review as an example',
    selectStar: 'Please select a star rating', error: 'Something went wrong. Please try again.', sending: 'Sending...', submit: 'Submit review', stars: 'stars',
  },
}

const nl: GalleryBundle = {
  gallery: {
    loading: 'Je headshots laden...', redirecting: 'Doorsturen naar login...', dashboard: '← Dashboard', generateMore: 'Meer genereren',
    title: 'Jouw headshots', photosGenerated: 'foto’s gegenereerd',
    downloadTip: 'Tip:', downloadTipStrong: 'download de headshots die je wil bewaren',
    none: 'Nog geen headshots!', generateFirst: 'Genereer je eerste headshot', download: 'Download',
  },
  review: {
    thanks: 'Bedankt voor je feedback!', thanksDesc: 'Het helpt ons echt om Nova Imago te verbeteren.',
    question: 'Hoe was je ervaring?', private: 'Je feedback is privé — enkel het Nova Imago-team ziet ze.',
    placeholder: 'Vertel ons wat je ervan vindt... (optioneel)', consent: 'Je mag mijn review als voorbeeld gebruiken',
    selectStar: 'Kies een sterbeoordeling', error: 'Er ging iets mis. Probeer opnieuw.', sending: 'Versturen...', submit: 'Review versturen', stars: 'sterren',
  },
}

const fr: GalleryBundle = {
  gallery: {
    loading: 'Chargement de vos portraits...', redirecting: 'Redirection vers la connexion...', dashboard: '← Tableau de bord', generateMore: 'Générer plus',
    title: 'Vos portraits', photosGenerated: 'photos générées',
    downloadTip: 'Astuce :', downloadTipStrong: 'téléchargez les portraits que vous voulez garder',
    none: 'Pas encore de portraits !', generateFirst: 'Générez votre premier portrait', download: 'Télécharger',
  },
  review: {
    thanks: 'Merci pour votre retour !', thanksDesc: 'Cela nous aide vraiment à améliorer Nova Imago.',
    question: 'Comment s’est passée votre expérience ?', private: 'Votre avis est privé — seule l’équipe Nova Imago le voit.',
    placeholder: 'Dites-nous ce que vous en pensez... (facultatif)', consent: 'Vous pouvez utiliser mon avis comme exemple',
    selectStar: 'Veuillez choisir une note', error: 'Une erreur s’est produite. Réessayez.', sending: 'Envoi...', submit: 'Envoyer l’avis', stars: 'étoiles',
  },
}

const de: GalleryBundle = {
  gallery: {
    loading: 'Deine Headshots werden geladen...', redirecting: 'Weiterleitung zum Login...', dashboard: '← Dashboard', generateMore: 'Mehr generieren',
    title: 'Deine Headshots', photosGenerated: 'Fotos generiert',
    downloadTip: 'Tipp:', downloadTipStrong: 'lade die Headshots herunter, die du behalten möchtest',
    none: 'Noch keine Headshots!', generateFirst: 'Erstelle deinen ersten Headshot', download: 'Herunterladen',
  },
  review: {
    thanks: 'Danke für dein Feedback!', thanksDesc: 'Es hilft uns wirklich, Nova Imago zu verbessern.',
    question: 'Wie war deine Erfahrung?', private: 'Dein Feedback ist privat — nur das Nova-Imago-Team sieht es.',
    placeholder: 'Sag uns, was du denkst... (optional)', consent: 'Ihr dürft meine Bewertung als Beispiel verwenden',
    selectStar: 'Bitte wähle eine Sternebewertung', error: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.', sending: 'Senden...', submit: 'Bewertung senden', stars: 'Sterne',
  },
}

const es: GalleryBundle = {
  gallery: {
    loading: 'Cargando tus retratos...', redirecting: 'Redirigiendo al inicio de sesión...', dashboard: '← Panel', generateMore: 'Generar más',
    title: 'Tus retratos', photosGenerated: 'fotos generadas',
    downloadTip: 'Consejo:', downloadTipStrong: 'descarga los retratos que quieras conservar',
    none: '¡Aún no hay retratos!', generateFirst: 'Genera tu primer retrato', download: 'Descargar',
  },
  review: {
    thanks: '¡Gracias por tu opinión!', thanksDesc: 'Nos ayuda mucho a mejorar Nova Imago.',
    question: '¿Qué tal tu experiencia?', private: 'Tu opinión es privada — solo la ve el equipo de Nova Imago.',
    placeholder: 'Cuéntanos qué te parece... (opcional)', consent: 'Podéis usar mi opinión como ejemplo',
    selectStar: 'Elige una valoración con estrellas', error: 'Algo salió mal. Inténtalo de nuevo.', sending: 'Enviando...', submit: 'Enviar opinión', stars: 'estrellas',
  },
}

const it: GalleryBundle = {
  gallery: {
    loading: 'Caricamento dei tuoi ritratti...', redirecting: 'Reindirizzamento al login...', dashboard: '← Dashboard', generateMore: 'Genera altri',
    title: 'I tuoi ritratti', photosGenerated: 'foto generate',
    downloadTip: 'Suggerimento:', downloadTipStrong: 'scarica i ritratti che vuoi conservare',
    none: 'Ancora nessun ritratto!', generateFirst: 'Genera il tuo primo ritratto', download: 'Scarica',
  },
  review: {
    thanks: 'Grazie per il tuo feedback!', thanksDesc: 'Ci aiuta davvero a migliorare Nova Imago.',
    question: 'Com’è stata la tua esperienza?', private: 'Il tuo feedback è privato — lo vede solo il team di Nova Imago.',
    placeholder: 'Dicci cosa ne pensi... (facoltativo)', consent: 'Potete usare la mia recensione come esempio',
    selectStar: 'Seleziona una valutazione', error: 'Qualcosa è andato storto. Riprova.', sending: 'Invio...', submit: 'Invia recensione', stars: 'stelle',
  },
}

const pt: GalleryBundle = {
  gallery: {
    loading: 'Carregando seus retratos...', redirecting: 'Redirecionando para o login...', dashboard: '← Painel', generateMore: 'Gerar mais',
    title: 'Seus retratos', photosGenerated: 'fotos geradas',
    downloadTip: 'Dica:', downloadTipStrong: 'baixe os retratos que você quer guardar',
    none: 'Ainda não há retratos!', generateFirst: 'Gere seu primeiro retrato', download: 'Baixar',
  },
  review: {
    thanks: 'Obrigado pelo seu feedback!', thanksDesc: 'Isso nos ajuda muito a melhorar o Nova Imago.',
    question: 'Como foi sua experiência?', private: 'Seu feedback é privado — apenas a equipe do Nova Imago o vê.',
    placeholder: 'Conte o que você achou... (opcional)', consent: 'Vocês podem usar minha avaliação como exemplo',
    selectStar: 'Escolha uma classificação por estrelas', error: 'Algo deu errado. Tente novamente.', sending: 'Enviando...', submit: 'Enviar avaliação', stars: 'estrelas',
  },
}

export const GALLERY: Record<Locale, GalleryBundle> = { en, nl, fr, de, es, it, pt }
