import type { Locale } from '@/lib/i18n'

interface Step { title: string; desc: string }
interface DashCopy {
  signOut: string; title: string; subtitle: string; welcomeBack: string; yourCredits: string; creditEquals: string; loading: string
  buyTitle: string; buyDesc: string; buyBtn: string
  trainTitle: string; trainDesc: string; trainBtnNew: string; trainBtnStart: string
  genTitle: string; genDesc: string; genBtn: string; genRequired: string
  galTitle: string; galDesc: string; galBtn: string
  howTitle: string; videoTitle: string; videoSoon: string; steps: [Step, Step, Step, Step]
}
interface SuccessCopy {
  title: string; subtitle: string; whatNext: string
  s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string
  note: string; goDashboard: string; backHome: string
}
interface TrainingCopy {
  heading: string; tipsTitle: string; tips: [string, string, string]
  buyMore: string; viewGallery: string; leaveNote: string
  readyTitle: string; readyDesc: string; generateNow: string
  failedTitle: string; failedDesc: string; tryAgain: string
}
interface DashboardBundle { dashboard: DashCopy; success: SuccessCopy; training: TrainingCopy }

const en: DashboardBundle = {
  dashboard: {
    signOut: 'Sign Out', title: 'Dashboard', subtitle: 'Manage your AI headshots', welcomeBack: 'Welcome Back!', yourCredits: 'Your Credits', creditEquals: 'Each credit = 1 generated photo', loading: 'Loading...',
    buyTitle: 'Buy Credits', buyDesc: 'Purchase credit packs to generate AI headshots', buyBtn: 'Buy Now →',
    trainTitle: 'Train a Model', trainDesc: 'Upload 10-20 selfies to create a custom AI model — for yourself or someone else.', trainBtnNew: 'Train new model →', trainBtnStart: 'Start Training →',
    genTitle: 'Generate', genDesc: 'Choose styles and create your headshots', genBtn: 'Generate Headshots →', genRequired: 'Model Required',
    galTitle: 'My Gallery', galDesc: 'View and download your generated headshots', galBtn: 'View Gallery →',
    howTitle: 'How it Works', videoTitle: 'See how it works in 90 seconds', videoSoon: 'Video coming soon',
    steps: [
      { title: '1. Upload your photos', desc: 'Add 10-20 clear selfies. Different angles, expressions and lighting give the best results.' },
      { title: '2. We train your AI model', desc: 'Your personal model trains in about 25-35 minutes — we’ll let you know when it’s ready.' },
      { title: '3. Choose your styles', desc: 'Pick from 45+ hand-curated styles. Each style generates 4 unique variations.' },
      { title: '4. Download your headshots', desc: 'Browse your gallery and download the professional headshots you love.' },
    ],
  },
  success: {
    title: 'Payment Successful! 🎉', subtitle: 'Your credits have been added to your account. Let’s create your headshots!', whatNext: 'What happens next?',
    s1t: '1. Upload your photos', s1d: 'Upload 8–15 selfies so we can build your personal AI model.',
    s2t: '2. We train your model (~20–30 min)', s2d: 'We learn your face from your photos — this runs in the background.',
    s3t: '3. Choose styles & generate', s3d: 'Pick your looks and get your professional headshots.',
    note: 'From your dashboard you can upload photos to train your model, or jump straight to generating if your model is ready.', goDashboard: 'Go to your dashboard →', backHome: '← Back to home',
  },
  training: {
    heading: '🚀 Training Your AI Model', tipsTitle: '💡 While you wait:', tips: ['Training takes about 25-35 minutes', 'You’ll get better results with diverse photos', 'Once ready, you can generate your styles!'],
    buyMore: '💳 Buy More Credits', viewGallery: '🖼️ View Gallery', leaveNote: '📧 Stay on this page to watch the progress, or leave — we’ll email you the moment it’s ready. Don’t see the email? Please check your spam folder.',
    readyTitle: 'Model Ready!', readyDesc: 'Your AI model is trained and ready to generate headshots.', generateNow: 'Generate Headshots Now →',
    failedTitle: 'Training Failed', failedDesc: 'Something went wrong. Please try uploading your photos again.', tryAgain: 'Try Again →',
  },
}

const nl: DashboardBundle = {
  dashboard: {
    signOut: 'Uitloggen', title: 'Dashboard', subtitle: 'Beheer je AI-headshots', welcomeBack: 'Welkom terug!', yourCredits: 'Jouw credits', creditEquals: 'Elke credit = 1 gegenereerde foto', loading: 'Laden...',
    buyTitle: 'Credits kopen', buyDesc: 'Koop creditpakketten om AI-headshots te genereren', buyBtn: 'Nu kopen →',
    trainTitle: 'Model trainen', trainDesc: 'Upload 10-20 selfies om een eigen AI-model te maken — voor jezelf of iemand anders.', trainBtnNew: 'Nieuw model trainen →', trainBtnStart: 'Start training →',
    genTitle: 'Genereren', genDesc: 'Kies stijlen en maak je headshots', genBtn: 'Headshots genereren →', genRequired: 'Model vereist',
    galTitle: 'Mijn gallerij', galDesc: 'Bekijk en download je gegenereerde headshots', galBtn: 'Gallerij bekijken →',
    howTitle: 'Hoe het werkt', videoTitle: 'Zie in 90 seconden hoe het werkt', videoSoon: 'Video komt binnenkort',
    steps: [
      { title: '1. Upload je foto’s', desc: 'Voeg 10-20 duidelijke selfies toe. Verschillende hoeken, uitdrukkingen en licht geven het beste resultaat.' },
      { title: '2. We trainen je AI-model', desc: 'Je persoonlijke model traint in ongeveer 25-35 minuten — we laten je weten wanneer het klaar is.' },
      { title: '3. Kies je stijlen', desc: 'Kies uit 45+ zorgvuldig samengestelde stijlen. Elke stijl levert 4 unieke variaties.' },
      { title: '4. Download je headshots', desc: 'Blader door je gallerij en download de professionele headshots die je mooi vindt.' },
    ],
  },
  success: {
    title: 'Betaling geslaagd! 🎉', subtitle: 'Je credits zijn toegevoegd aan je account. Laten we je headshots maken!', whatNext: 'Wat gebeurt er nu?',
    s1t: '1. Upload je foto’s', s1d: 'Upload 8–15 selfies zodat we je persoonlijke AI-model kunnen bouwen.',
    s2t: '2. We trainen je model (~20–30 min)', s2d: 'We leren je gezicht uit je foto’s — dit loopt op de achtergrond.',
    s3t: '3. Kies stijlen & genereer', s3d: 'Kies je looks en krijg je professionele headshots.',
    note: 'Vanuit je dashboard kan je foto’s uploaden om je model te trainen, of meteen genereren als je model klaar is.', goDashboard: 'Naar je dashboard →', backHome: '← Terug naar home',
  },
  training: {
    heading: '🚀 Je AI-model wordt getraind', tipsTitle: '💡 Terwijl je wacht:', tips: ['Training duurt ongeveer 25-35 minuten', 'Je krijgt betere resultaten met gevarieerde foto’s', 'Zodra het klaar is, kan je je stijlen genereren!'],
    buyMore: '💳 Meer credits kopen', viewGallery: '🖼️ Gallerij bekijken', leaveNote: '📧 Blijf op deze pagina om de voortgang te volgen, of ga weg — we mailen je zodra het klaar is. Geen mail? Kijk in je spam-map.',
    readyTitle: 'Model klaar!', readyDesc: 'Je AI-model is getraind en klaar om headshots te genereren.', generateNow: 'Nu headshots genereren →',
    failedTitle: 'Training mislukt', failedDesc: 'Er ging iets mis. Probeer je foto’s opnieuw te uploaden.', tryAgain: 'Opnieuw proberen →',
  },
}

const fr: DashboardBundle = {
  dashboard: {
    signOut: 'Déconnexion', title: 'Tableau de bord', subtitle: 'Gérez vos portraits IA', welcomeBack: 'Bon retour !', yourCredits: 'Vos crédits', creditEquals: 'Chaque crédit = 1 photo générée', loading: 'Chargement...',
    buyTitle: 'Acheter des crédits', buyDesc: 'Achetez des packs de crédits pour générer des portraits IA', buyBtn: 'Acheter →',
    trainTitle: 'Entraîner un modèle', trainDesc: 'Importez 10-20 selfies pour créer un modèle IA personnalisé — pour vous ou quelqu’un d’autre.', trainBtnNew: 'Entraîner un nouveau modèle →', trainBtnStart: 'Démarrer l’entraînement →',
    genTitle: 'Générer', genDesc: 'Choisissez des styles et créez vos portraits', genBtn: 'Générer les portraits →', genRequired: 'Modèle requis',
    galTitle: 'Ma galerie', galDesc: 'Consultez et téléchargez vos portraits générés', galBtn: 'Voir la galerie →',
    howTitle: 'Comment ça marche', videoTitle: 'Découvrez comment ça marche en 90 secondes', videoSoon: 'Vidéo bientôt disponible',
    steps: [
      { title: '1. Importez vos photos', desc: 'Ajoutez 10-20 selfies nets. Différents angles, expressions et éclairages donnent les meilleurs résultats.' },
      { title: '2. Nous entraînons votre modèle IA', desc: 'Votre modèle personnel s’entraîne en environ 25-35 minutes — nous vous préviendrons dès qu’il est prêt.' },
      { title: '3. Choisissez vos styles', desc: 'Choisissez parmi plus de 45 styles soignés. Chaque style génère 4 variations uniques.' },
      { title: '4. Téléchargez vos portraits', desc: 'Parcourez votre galerie et téléchargez les portraits que vous aimez.' },
    ],
  },
  success: {
    title: 'Paiement réussi ! 🎉', subtitle: 'Vos crédits ont été ajoutés à votre compte. Créons vos portraits !', whatNext: 'Et ensuite ?',
    s1t: '1. Importez vos photos', s1d: 'Importez 8–15 selfies pour que nous construisions votre modèle IA personnel.',
    s2t: '2. Nous entraînons votre modèle (~20–30 min)', s2d: 'Nous apprenons votre visage à partir de vos photos — cela se fait en arrière-plan.',
    s3t: '3. Choisissez des styles et générez', s3d: 'Choisissez vos looks et obtenez vos portraits professionnels.',
    note: 'Depuis votre tableau de bord, importez des photos pour entraîner votre modèle, ou passez directement à la génération s’il est prêt.', goDashboard: 'Aller au tableau de bord →', backHome: '← Retour à l’accueil',
  },
  training: {
    heading: '🚀 Entraînement de votre modèle IA', tipsTitle: '💡 En attendant :', tips: ['L’entraînement prend environ 25-35 minutes', 'Vous obtiendrez de meilleurs résultats avec des photos variées', 'Une fois prêt, vous pourrez générer vos styles !'],
    buyMore: '💳 Acheter plus de crédits', viewGallery: '🖼️ Voir la galerie', leaveNote: '📧 Restez sur cette page pour suivre l’avancement, ou partez — nous vous enverrons un e-mail dès que c’est prêt. Pas d’e-mail ? Vérifiez vos spams.',
    readyTitle: 'Modèle prêt !', readyDesc: 'Votre modèle IA est entraîné et prêt à générer des portraits.', generateNow: 'Générer maintenant →',
    failedTitle: 'Échec de l’entraînement', failedDesc: 'Un problème est survenu. Réessayez en important vos photos.', tryAgain: 'Réessayer →',
  },
}

const de: DashboardBundle = {
  dashboard: {
    signOut: 'Abmelden', title: 'Dashboard', subtitle: 'Verwalte deine KI-Headshots', welcomeBack: 'Willkommen zurück!', yourCredits: 'Deine Credits', creditEquals: 'Jeder Credit = 1 generiertes Foto', loading: 'Laden...',
    buyTitle: 'Credits kaufen', buyDesc: 'Kaufe Credit-Pakete, um KI-Headshots zu generieren', buyBtn: 'Jetzt kaufen →',
    trainTitle: 'Modell trainieren', trainDesc: 'Lade 10-20 Selfies hoch, um ein eigenes KI-Modell zu erstellen — für dich oder jemand anderen.', trainBtnNew: 'Neues Modell trainieren →', trainBtnStart: 'Training starten →',
    genTitle: 'Generieren', genDesc: 'Wähle Stile und erstelle deine Headshots', genBtn: 'Headshots generieren →', genRequired: 'Modell erforderlich',
    galTitle: 'Meine Galerie', galDesc: 'Sieh dir deine generierten Headshots an und lade sie herunter', galBtn: 'Galerie ansehen →',
    howTitle: 'So funktioniert’s', videoTitle: 'In 90 Sekunden sehen, wie es funktioniert', videoSoon: 'Video folgt in Kürze',
    steps: [
      { title: '1. Lade deine Fotos hoch', desc: 'Füge 10-20 klare Selfies hinzu. Verschiedene Winkel, Ausdrücke und Licht liefern die besten Ergebnisse.' },
      { title: '2. Wir trainieren dein KI-Modell', desc: 'Dein persönliches Modell trainiert in etwa 25-35 Minuten — wir sagen dir Bescheid, sobald es fertig ist.' },
      { title: '3. Wähle deine Stile', desc: 'Wähle aus über 45 kuratierten Stilen. Jeder Stil erzeugt 4 einzigartige Varianten.' },
      { title: '4. Lade deine Headshots herunter', desc: 'Durchstöbere deine Galerie und lade die Headshots herunter, die dir gefallen.' },
    ],
  },
  success: {
    title: 'Zahlung erfolgreich! 🎉', subtitle: 'Deine Credits wurden deinem Konto gutgeschrieben. Lass uns deine Headshots erstellen!', whatNext: 'Wie geht es weiter?',
    s1t: '1. Lade deine Fotos hoch', s1d: 'Lade 8–15 Selfies hoch, damit wir dein persönliches KI-Modell erstellen können.',
    s2t: '2. Wir trainieren dein Modell (~20–30 Min.)', s2d: 'Wir lernen dein Gesicht aus deinen Fotos — das läuft im Hintergrund.',
    s3t: '3. Stile wählen & generieren', s3d: 'Wähle deine Looks und erhalte deine professionellen Headshots.',
    note: 'In deinem Dashboard kannst du Fotos hochladen, um dein Modell zu trainieren, oder direkt generieren, wenn dein Modell bereit ist.', goDashboard: 'Zum Dashboard →', backHome: '← Zurück zur Startseite',
  },
  training: {
    heading: '🚀 Dein KI-Modell wird trainiert', tipsTitle: '💡 Während du wartest:', tips: ['Das Training dauert etwa 25-35 Minuten', 'Mit abwechslungsreichen Fotos werden die Ergebnisse besser', 'Sobald es fertig ist, kannst du deine Stile generieren!'],
    buyMore: '💳 Mehr Credits kaufen', viewGallery: '🖼️ Galerie ansehen', leaveNote: '📧 Bleib auf dieser Seite, um den Fortschritt zu sehen, oder geh — wir mailen dir, sobald es fertig ist. Keine Mail? Schau im Spam-Ordner.',
    readyTitle: 'Modell bereit!', readyDesc: 'Dein KI-Modell ist trainiert und bereit, Headshots zu generieren.', generateNow: 'Jetzt Headshots generieren →',
    failedTitle: 'Training fehlgeschlagen', failedDesc: 'Etwas ist schiefgelaufen. Bitte lade deine Fotos erneut hoch.', tryAgain: 'Erneut versuchen →',
  },
}

const es: DashboardBundle = {
  dashboard: {
    signOut: 'Cerrar sesión', title: 'Panel', subtitle: 'Gestiona tus retratos IA', welcomeBack: '¡Bienvenido de nuevo!', yourCredits: 'Tus créditos', creditEquals: 'Cada crédito = 1 foto generada', loading: 'Cargando...',
    buyTitle: 'Comprar créditos', buyDesc: 'Compra packs de créditos para generar retratos IA', buyBtn: 'Comprar →',
    trainTitle: 'Entrenar un modelo', trainDesc: 'Sube 10-20 selfies para crear un modelo IA personalizado — para ti o para otra persona.', trainBtnNew: 'Entrenar nuevo modelo →', trainBtnStart: 'Iniciar entrenamiento →',
    genTitle: 'Generar', genDesc: 'Elige estilos y crea tus retratos', genBtn: 'Generar retratos →', genRequired: 'Modelo necesario',
    galTitle: 'Mi galería', galDesc: 'Consulta y descarga tus retratos generados', galBtn: 'Ver galería →',
    howTitle: 'Cómo funciona', videoTitle: 'Descubre cómo funciona en 90 segundos', videoSoon: 'Vídeo próximamente',
    steps: [
      { title: '1. Sube tus fotos', desc: 'Añade 10-20 selfies nítidas. Distintos ángulos, expresiones e iluminación dan los mejores resultados.' },
      { title: '2. Entrenamos tu modelo IA', desc: 'Tu modelo personal se entrena en unos 25-35 minutos — te avisaremos cuando esté listo.' },
      { title: '3. Elige tus estilos', desc: 'Elige entre más de 45 estilos cuidados. Cada estilo genera 4 variaciones únicas.' },
      { title: '4. Descarga tus retratos', desc: 'Explora tu galería y descarga los retratos que más te gusten.' },
    ],
  },
  success: {
    title: '¡Pago realizado! 🎉', subtitle: 'Tus créditos se han añadido a tu cuenta. ¡Vamos a crear tus retratos!', whatNext: '¿Qué pasa ahora?',
    s1t: '1. Sube tus fotos', s1d: 'Sube 8–15 selfies para que construyamos tu modelo IA personal.',
    s2t: '2. Entrenamos tu modelo (~20–30 min)', s2d: 'Aprendemos tu rostro a partir de tus fotos — esto ocurre en segundo plano.',
    s3t: '3. Elige estilos y genera', s3d: 'Elige tus looks y consigue tus retratos profesionales.',
    note: 'Desde tu panel puedes subir fotos para entrenar tu modelo, o ir directamente a generar si tu modelo está listo.', goDashboard: 'Ir a tu panel →', backHome: '← Volver al inicio',
  },
  training: {
    heading: '🚀 Entrenando tu modelo IA', tipsTitle: '💡 Mientras esperas:', tips: ['El entrenamiento tarda unos 25-35 minutos', 'Obtendrás mejores resultados con fotos variadas', '¡Cuando esté listo, podrás generar tus estilos!'],
    buyMore: '💳 Comprar más créditos', viewGallery: '🖼️ Ver galería', leaveNote: '📧 Quédate en esta página para ver el progreso, o sal — te enviaremos un correo en cuanto esté listo. ¿No lo ves? Revisa tu carpeta de spam.',
    readyTitle: '¡Modelo listo!', readyDesc: 'Tu modelo IA está entrenado y listo para generar retratos.', generateNow: 'Generar retratos ahora →',
    failedTitle: 'Error en el entrenamiento', failedDesc: 'Algo salió mal. Intenta subir tus fotos de nuevo.', tryAgain: 'Intentar de nuevo →',
  },
}

const it: DashboardBundle = {
  dashboard: {
    signOut: 'Esci', title: 'Dashboard', subtitle: 'Gestisci i tuoi ritratti IA', welcomeBack: 'Bentornato!', yourCredits: 'I tuoi crediti', creditEquals: 'Ogni credito = 1 foto generata', loading: 'Caricamento...',
    buyTitle: 'Acquista crediti', buyDesc: 'Acquista pacchetti di crediti per generare ritratti IA', buyBtn: 'Acquista →',
    trainTitle: 'Allena un modello', trainDesc: 'Carica 10-20 selfie per creare un modello IA personalizzato — per te o per qualcun altro.', trainBtnNew: 'Allena nuovo modello →', trainBtnStart: 'Avvia l’allenamento →',
    genTitle: 'Genera', genDesc: 'Scegli gli stili e crea i tuoi ritratti', genBtn: 'Genera ritratti →', genRequired: 'Modello richiesto',
    galTitle: 'La mia galleria', galDesc: 'Visualizza e scarica i tuoi ritratti generati', galBtn: 'Vedi la galleria →',
    howTitle: 'Come funziona', videoTitle: 'Guarda come funziona in 90 secondi', videoSoon: 'Video in arrivo',
    steps: [
      { title: '1. Carica le tue foto', desc: 'Aggiungi 10-20 selfie nitidi. Angolazioni, espressioni e luci diverse danno i risultati migliori.' },
      { title: '2. Alleniamo il tuo modello IA', desc: 'Il tuo modello personale si allena in circa 25-35 minuti — ti avviseremo quando è pronto.' },
      { title: '3. Scegli i tuoi stili', desc: 'Scegli tra oltre 45 stili curati. Ogni stile genera 4 variazioni uniche.' },
      { title: '4. Scarica i tuoi ritratti', desc: 'Sfoglia la tua galleria e scarica i ritratti che ami.' },
    ],
  },
  success: {
    title: 'Pagamento riuscito! 🎉', subtitle: 'I tuoi crediti sono stati aggiunti al tuo account. Creiamo i tuoi ritratti!', whatNext: 'Cosa succede ora?',
    s1t: '1. Carica le tue foto', s1d: 'Carica 8–15 selfie così possiamo costruire il tuo modello IA personale.',
    s2t: '2. Alleniamo il tuo modello (~20–30 min)', s2d: 'Impariamo il tuo volto dalle tue foto — avviene in background.',
    s3t: '3. Scegli gli stili e genera', s3d: 'Scegli i tuoi look e ottieni i tuoi ritratti professionali.',
    note: 'Dalla tua dashboard puoi caricare foto per allenare il modello, o passare direttamente alla generazione se il modello è pronto.', goDashboard: 'Vai alla dashboard →', backHome: '← Torna alla home',
  },
  training: {
    heading: '🚀 Allenamento del tuo modello IA', tipsTitle: '💡 Nel frattempo:', tips: ['L’allenamento richiede circa 25-35 minuti', 'Otterrai risultati migliori con foto varie', 'Una volta pronto, potrai generare i tuoi stili!'],
    buyMore: '💳 Acquista altri crediti', viewGallery: '🖼️ Vedi la galleria', leaveNote: '📧 Resta su questa pagina per seguire l’avanzamento, oppure esci — ti invieremo un’e-mail appena è pronto. Non la vedi? Controlla lo spam.',
    readyTitle: 'Modello pronto!', readyDesc: 'Il tuo modello IA è allenato e pronto a generare ritratti.', generateNow: 'Genera ritratti ora →',
    failedTitle: 'Allenamento non riuscito', failedDesc: 'Qualcosa è andato storto. Prova a ricaricare le tue foto.', tryAgain: 'Riprova →',
  },
}

const pt: DashboardBundle = {
  dashboard: {
    signOut: 'Sair', title: 'Painel', subtitle: 'Gerencie seus retratos IA', welcomeBack: 'Bem-vindo de volta!', yourCredits: 'Seus créditos', creditEquals: 'Cada crédito = 1 foto gerada', loading: 'Carregando...',
    buyTitle: 'Comprar créditos', buyDesc: 'Compre pacotes de créditos para gerar retratos IA', buyBtn: 'Comprar →',
    trainTitle: 'Treinar um modelo', trainDesc: 'Envie 10-20 selfies para criar um modelo IA personalizado — para você ou outra pessoa.', trainBtnNew: 'Treinar novo modelo →', trainBtnStart: 'Iniciar treinamento →',
    genTitle: 'Gerar', genDesc: 'Escolha estilos e crie seus retratos', genBtn: 'Gerar retratos →', genRequired: 'Modelo necessário',
    galTitle: 'Minha galeria', galDesc: 'Veja e baixe seus retratos gerados', galBtn: 'Ver galeria →',
    howTitle: 'Como funciona', videoTitle: 'Veja como funciona em 90 segundos', videoSoon: 'Vídeo em breve',
    steps: [
      { title: '1. Envie suas fotos', desc: 'Adicione 10-20 selfies nítidas. Ângulos, expressões e iluminação variados dão os melhores resultados.' },
      { title: '2. Treinamos seu modelo IA', desc: 'Seu modelo pessoal treina em cerca de 25-35 minutos — avisaremos quando estiver pronto.' },
      { title: '3. Escolha seus estilos', desc: 'Escolha entre mais de 45 estilos selecionados. Cada estilo gera 4 variações únicas.' },
      { title: '4. Baixe seus retratos', desc: 'Navegue pela sua galeria e baixe os retratos que você adora.' },
    ],
  },
  success: {
    title: 'Pagamento concluído! 🎉', subtitle: 'Seus créditos foram adicionados à sua conta. Vamos criar seus retratos!', whatNext: 'O que acontece agora?',
    s1t: '1. Envie suas fotos', s1d: 'Envie 8–15 selfies para construirmos seu modelo IA pessoal.',
    s2t: '2. Treinamos seu modelo (~20–30 min)', s2d: 'Aprendemos seu rosto a partir das suas fotos — isso roda em segundo plano.',
    s3t: '3. Escolha estilos e gere', s3d: 'Escolha seus looks e receba seus retratos profissionais.',
    note: 'No seu painel você pode enviar fotos para treinar seu modelo, ou ir direto para a geração se o modelo estiver pronto.', goDashboard: 'Ir para o painel →', backHome: '← Voltar ao início',
  },
  training: {
    heading: '🚀 Treinando seu modelo IA', tipsTitle: '💡 Enquanto você espera:', tips: ['O treinamento leva cerca de 25-35 minutos', 'Você terá melhores resultados com fotos variadas', 'Quando estiver pronto, você poderá gerar seus estilos!'],
    buyMore: '💳 Comprar mais créditos', viewGallery: '🖼️ Ver galeria', leaveNote: '📧 Fique nesta página para acompanhar o progresso, ou saia — enviaremos um e-mail assim que estiver pronto. Não achou? Verifique o spam.',
    readyTitle: 'Modelo pronto!', readyDesc: 'Seu modelo IA está treinado e pronto para gerar retratos.', generateNow: 'Gerar retratos agora →',
    failedTitle: 'Falha no treinamento', failedDesc: 'Algo deu errado. Tente enviar suas fotos novamente.', tryAgain: 'Tentar de novo →',
  },
}

export const DASHBOARD: Record<Locale, DashboardBundle> = { en, nl, fr, de, es, it, pt }
