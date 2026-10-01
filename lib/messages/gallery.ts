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
interface RefundCopy {
  btn: string; confirm: string; refunded: string; downloaded: string; used: string; window: string; none: string; already: string; error: string
}
interface GalleryBundle { gallery: GalleryCopy; review: ReviewCopy; refund: RefundCopy }

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
  refund: {
    btn: 'Request a refund',
    confirm: 'Request a refund for your most recent purchase?',
    refunded: 'Your refund has been processed — the amount will be back on your card within 5–10 business days.',
    downloaded: 'A refund is no longer possible because you have already downloaded your headshots.',
    used: 'You have already generated photos, so this purchase can’t be auto-refunded. Not happy with the quality? Email support@novaimago.ai within 7 days — our profile-worthy guarantee applies.',
    window: 'The 14-day refund window for this purchase has passed.',
    none: 'We couldn’t find a purchase to refund.',
    already: 'This purchase has already been refunded.',
    error: 'Something went wrong. Please try again later or email support@novaimago.ai.',
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
  refund: {
    btn: 'Terugbetaling aanvragen',
    confirm: 'Een terugbetaling aanvragen voor je recentste aankoop?',
    refunded: 'Je terugbetaling is verwerkt — het bedrag staat binnen 5–10 werkdagen terug op je kaart.',
    downloaded: 'Een terugbetaling is niet meer mogelijk omdat je je headshots al hebt gedownload.',
    used: 'Je hebt al foto’s gegenereerd, dus deze aankoop kan niet automatisch terugbetaald worden. Niet tevreden met de kwaliteit? Mail support@novaimago.ai binnen 7 dagen — onze profielwaardig-garantie geldt.',
    window: 'De terugbetalingstermijn van 14 dagen voor deze aankoop is verstreken.',
    none: 'We vonden geen aankoop om terug te betalen.',
    already: 'Deze aankoop is al terugbetaald.',
    error: 'Er ging iets mis. Probeer later opnieuw of mail support@novaimago.ai.',
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
  refund: {
    btn: 'Demander un remboursement',
    confirm: 'Demander un remboursement pour votre achat le plus récent ?',
    refunded: 'Votre remboursement a été traité — le montant reviendra sur votre carte sous 5 à 10 jours ouvrés.',
    downloaded: 'Un remboursement n’est plus possible car vous avez déjà téléchargé vos portraits.',
    used: 'Vous avez déjà généré des photos, cet achat ne peut donc pas être remboursé automatiquement. Pas satisfait de la qualité ? Écrivez à support@novaimago.ai sous 7 jours — notre garantie s’applique.',
    window: 'Le délai de remboursement de 14 jours pour cet achat est dépassé.',
    none: 'Nous n’avons trouvé aucun achat à rembourser.',
    already: 'Cet achat a déjà été remboursé.',
    error: 'Une erreur s’est produite. Réessayez plus tard ou écrivez à support@novaimago.ai.',
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
  refund: {
    btn: 'Rückerstattung anfragen',
    confirm: 'Eine Rückerstattung für deinen letzten Kauf anfragen?',
    refunded: 'Deine Rückerstattung wurde bearbeitet — der Betrag ist innerhalb von 5–10 Werktagen wieder auf deiner Karte.',
    downloaded: 'Eine Rückerstattung ist nicht mehr möglich, da du deine Headshots bereits heruntergeladen hast.',
    used: 'Du hast bereits Fotos generiert, daher kann dieser Kauf nicht automatisch erstattet werden. Nicht zufrieden mit der Qualität? Schreibe innerhalb von 7 Tagen an support@novaimago.ai — unsere Profil-würdig-Garantie gilt.',
    window: 'Die 14-tägige Rückerstattungsfrist für diesen Kauf ist abgelaufen.',
    none: 'Wir konnten keinen Kauf zum Erstatten finden.',
    already: 'Dieser Kauf wurde bereits erstattet.',
    error: 'Etwas ist schiefgelaufen. Bitte versuche es später erneut oder schreibe an support@novaimago.ai.',
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
  refund: {
    btn: 'Solicitar reembolso',
    confirm: '¿Solicitar un reembolso de tu compra más reciente?',
    refunded: 'Tu reembolso se ha procesado — el importe volverá a tu tarjeta en un plazo de 5 a 10 días hábiles.',
    downloaded: 'Ya no es posible un reembolso porque ya has descargado tus retratos.',
    used: 'Ya has generado fotos, así que esta compra no puede reembolsarse automáticamente. ¿No estás satisfecho con la calidad? Escribe a support@novaimago.ai en un plazo de 7 días — se aplica nuestra garantía.',
    window: 'El plazo de reembolso de 14 días para esta compra ha vencido.',
    none: 'No encontramos ninguna compra para reembolsar.',
    already: 'Esta compra ya ha sido reembolsada.',
    error: 'Algo salió mal. Inténtalo más tarde o escribe a support@novaimago.ai.',
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
  refund: {
    btn: 'Richiedi un rimborso',
    confirm: 'Richiedere un rimborso per il tuo acquisto più recente?',
    refunded: 'Il tuo rimborso è stato elaborato — l’importo tornerà sulla tua carta entro 5–10 giorni lavorativi.',
    downloaded: 'Un rimborso non è più possibile perché hai già scaricato i tuoi ritratti.',
    used: 'Hai già generato delle foto, quindi questo acquisto non può essere rimborsato automaticamente. Non sei soddisfatto della qualità? Scrivi a support@novaimago.ai entro 7 giorni — vale la nostra garanzia.',
    window: 'Il termine di rimborso di 14 giorni per questo acquisto è scaduto.',
    none: 'Non abbiamo trovato alcun acquisto da rimborsare.',
    already: 'Questo acquisto è già stato rimborsato.',
    error: 'Qualcosa è andato storto. Riprova più tardi o scrivi a support@novaimago.ai.',
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
  refund: {
    btn: 'Solicitar reembolso',
    confirm: 'Solicitar um reembolso da sua compra mais recente?',
    refunded: 'O seu reembolso foi processado — o valor voltará ao seu cartão em 5 a 10 dias úteis.',
    downloaded: 'Já não é possível um reembolso porque já descarregou os seus retratos.',
    used: 'Já gerou fotos, por isso esta compra não pode ser reembolsada automaticamente. Não está satisfeito com a qualidade? Escreva para support@novaimago.ai no prazo de 7 dias — aplica-se a nossa garantia.',
    window: 'O prazo de reembolso de 14 dias para esta compra terminou.',
    none: 'Não encontrámos nenhuma compra para reembolsar.',
    already: 'Esta compra já foi reembolsada.',
    error: 'Algo correu mal. Tente novamente mais tarde ou escreva para support@novaimago.ai.',
  },
}

export const GALLERY: Record<Locale, GalleryBundle> = { en, nl, fr, de, es, it, pt }
