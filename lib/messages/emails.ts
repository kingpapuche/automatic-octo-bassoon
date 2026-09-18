import type { Locale } from '@/lib/i18n'

// Vertaalde inhoud voor de transactionele e-mails (training-webhook).
// {name} wordt vervangen door de voornaam van de klant.
export interface EmailCopy {
  subject: string
  previewText: string
  heading: string       // {name}
  paragraphs: string[]
  buttonLabel: string
}

interface EmailBundle { ready: EmailCopy; issue: EmailCopy }

export const EMAILS: Record<Locale, EmailBundle> = {
  en: {
    ready: {
      subject: 'Your AI model is ready',
      previewText: 'Your AI model is trained and ready — time to create your headshots.',
      heading: "You're all set, {name}!",
      paragraphs: [
        'Great news — your personal AI model is trained and ready to generate professional headshots.',
        'Head to your dashboard to choose your styles and create your first set. Each style gives you 4 unique variations.',
      ],
      buttonLabel: 'Create my headshots',
    },
    issue: {
      subject: 'Training issue — let us help',
      previewText: "Your training didn't complete — your credit is safe, let's try again.",
      heading: "Let's get that sorted, {name}",
      paragraphs: [
        "Your training didn't complete successfully — but don't worry, your credit hasn't been used.",
        'Please try again with a fresh set of photos. Clear, well-lit selfies from different angles give the best results.',
        "Still stuck? Just reply to this email and we'll help you personally.",
      ],
      buttonLabel: 'Try again',
    },
  },
  nl: {
    ready: {
      subject: 'Je AI-model is klaar',
      previewText: 'Je AI-model is getraind en klaar — tijd om je headshots te maken.',
      heading: 'Alles staat klaar, {name}!',
      paragraphs: [
        'Goed nieuws — je persoonlijke AI-model is getraind en klaar om professionele headshots te genereren.',
        'Ga naar je dashboard om je stijlen te kiezen en je eerste set te maken. Elke stijl geeft je 4 unieke variaties.',
      ],
      buttonLabel: 'Mijn headshots maken',
    },
    issue: {
      subject: 'Probleem met de training — wij helpen',
      previewText: 'Je training is niet voltooid — je credit is veilig, laten we het opnieuw proberen.',
      heading: 'We lossen dit op, {name}',
      paragraphs: [
        'Je training is niet succesvol voltooid — maar geen zorgen, je credit is niet gebruikt.',
        'Probeer het opnieuw met een nieuwe set foto’s. Scherpe, goed belichte selfies vanuit verschillende hoeken geven de beste resultaten.',
        'Kom je er niet uit? Beantwoord gewoon deze e-mail en we helpen je persoonlijk.',
      ],
      buttonLabel: 'Opnieuw proberen',
    },
  },
  fr: {
    ready: {
      subject: 'Votre modèle IA est prêt',
      previewText: 'Votre modèle IA est entraîné et prêt — à vous les portraits.',
      heading: 'Tout est prêt, {name} !',
      paragraphs: [
        'Bonne nouvelle — votre modèle IA personnel est entraîné et prêt à générer des portraits professionnels.',
        'Rendez-vous sur votre tableau de bord pour choisir vos styles et créer votre première série. Chaque style vous donne 4 variations uniques.',
      ],
      buttonLabel: 'Créer mes portraits',
    },
    issue: {
      subject: 'Problème d’entraînement — nous vous aidons',
      previewText: 'Votre entraînement n’a pas abouti — votre crédit est intact, réessayons.',
      heading: 'On règle ça, {name}',
      paragraphs: [
        'Votre entraînement n’a pas abouti — mais pas d’inquiétude, votre crédit n’a pas été utilisé.',
        'Veuillez réessayer avec une nouvelle série de photos. Des selfies nets et bien éclairés sous différents angles donnent les meilleurs résultats.',
        'Toujours bloqué ? Répondez simplement à cet e-mail et nous vous aiderons personnellement.',
      ],
      buttonLabel: 'Réessayer',
    },
  },
  de: {
    ready: {
      subject: 'Dein KI-Modell ist fertig',
      previewText: 'Dein KI-Modell ist trainiert und bereit — Zeit für deine Headshots.',
      heading: 'Alles bereit, {name}!',
      paragraphs: [
        'Gute Neuigkeiten — dein persönliches KI-Modell ist trainiert und bereit, professionelle Headshots zu generieren.',
        'Geh zu deinem Dashboard, um deine Stile zu wählen und deine erste Serie zu erstellen. Jeder Stil liefert dir 4 einzigartige Varianten.',
      ],
      buttonLabel: 'Meine Headshots erstellen',
    },
    issue: {
      subject: 'Problem beim Training — wir helfen',
      previewText: 'Dein Training wurde nicht abgeschlossen — dein Credit ist sicher, versuchen wir es erneut.',
      heading: 'Das bringen wir in Ordnung, {name}',
      paragraphs: [
        'Dein Training wurde nicht erfolgreich abgeschlossen — aber keine Sorge, dein Credit wurde nicht verwendet.',
        'Bitte versuche es mit einer neuen Fotoserie erneut. Klare, gut beleuchtete Selfies aus verschiedenen Winkeln liefern die besten Ergebnisse.',
        'Kommst du nicht weiter? Antworte einfach auf diese E-Mail und wir helfen dir persönlich.',
      ],
      buttonLabel: 'Erneut versuchen',
    },
  },
  es: {
    ready: {
      subject: 'Tu modelo de IA está listo',
      previewText: 'Tu modelo de IA está entrenado y listo — hora de crear tus retratos.',
      heading: '¡Todo listo, {name}!',
      paragraphs: [
        'Buenas noticias — tu modelo de IA personal está entrenado y listo para generar retratos profesionales.',
        'Ve a tu panel para elegir tus estilos y crear tu primera serie. Cada estilo te da 4 variaciones únicas.',
      ],
      buttonLabel: 'Crear mis retratos',
    },
    issue: {
      subject: 'Problema con el entrenamiento — te ayudamos',
      previewText: 'Tu entrenamiento no se completó — tu crédito está a salvo, vamos a intentarlo de nuevo.',
      heading: 'Vamos a solucionarlo, {name}',
      paragraphs: [
        'Tu entrenamiento no se completó correctamente — pero no te preocupes, tu crédito no se ha usado.',
        'Vuelve a intentarlo con un nuevo conjunto de fotos. Los selfies nítidos y bien iluminados desde distintos ángulos dan los mejores resultados.',
        '¿Sigues atascado? Responde a este correo y te ayudaremos personalmente.',
      ],
      buttonLabel: 'Intentar de nuevo',
    },
  },
  it: {
    ready: {
      subject: 'Il tuo modello IA è pronto',
      previewText: 'Il tuo modello IA è addestrato e pronto — è ora di creare i tuoi ritratti.',
      heading: 'Tutto pronto, {name}!',
      paragraphs: [
        'Buone notizie — il tuo modello IA personale è addestrato e pronto a generare ritratti professionali.',
        'Vai alla tua dashboard per scegliere i tuoi stili e creare la tua prima serie. Ogni stile ti dà 4 variazioni uniche.',
      ],
      buttonLabel: 'Crea i miei ritratti',
    },
    issue: {
      subject: 'Problema con l’addestramento — ti aiutiamo',
      previewText: 'Il tuo addestramento non è stato completato — il tuo credito è al sicuro, riproviamo.',
      heading: 'Sistemiamo tutto, {name}',
      paragraphs: [
        'Il tuo addestramento non è stato completato correttamente — ma non preoccuparti, il tuo credito non è stato usato.',
        'Riprova con una nuova serie di foto. Selfie nitidi e ben illuminati da diverse angolazioni danno i risultati migliori.',
        'Ancora bloccato? Rispondi a questa e-mail e ti aiuteremo personalmente.',
      ],
      buttonLabel: 'Riprova',
    },
  },
  pt: {
    ready: {
      subject: 'O seu modelo de IA está pronto',
      previewText: 'O seu modelo de IA está treinado e pronto — hora de criar os seus retratos.',
      heading: 'Está tudo pronto, {name}!',
      paragraphs: [
        'Boas notícias — o seu modelo de IA pessoal está treinado e pronto para gerar retratos profissionais.',
        'Vá ao seu painel para escolher os seus estilos e criar a sua primeira série. Cada estilo dá-lhe 4 variações únicas.',
      ],
      buttonLabel: 'Criar os meus retratos',
    },
    issue: {
      subject: 'Problema no treino — nós ajudamos',
      previewText: 'O seu treino não foi concluído — o seu crédito está seguro, vamos tentar de novo.',
      heading: 'Vamos resolver isto, {name}',
      paragraphs: [
        'O seu treino não foi concluído com sucesso — mas não se preocupe, o seu crédito não foi usado.',
        'Tente novamente com um novo conjunto de fotos. Selfies nítidas e bem iluminadas de diferentes ângulos dão os melhores resultados.',
        'Ainda com dificuldades? Basta responder a este e-mail e ajudamos pessoalmente.',
      ],
      buttonLabel: 'Tentar de novo',
    },
  },
}
