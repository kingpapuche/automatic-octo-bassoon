import type { Locale } from '@/lib/i18n'

// Vertalingen voor de app-pagina's (buiten de landing). Groeit per batch.

interface AuthCopy {
  loginTitle: string; loginSubtitle: string
  signupTitle: string; signupSubtitle: string
  continueGoogle: string; or: string; emailLabel: string; emailPlaceholder: string
  sending: string; sendMagicLink: string
  checkEmailLogin: string; checkEmailSignup: string; sentTo: string
  spamTipLogin: string; spamTipSignup: string
  goBack: string; useDifferentEmail: string; backToHome: string; aiGenerated: string
  agree: string; terms: string; privacy: string
  trust: [string, string, string, string]
  errLink: string; errGoogle: string
}

export interface AppCopy {
  auth: AuthCopy
}

const en: AppCopy = {
  auth: {
    loginTitle: 'Transform Selfies into Professional Photos', loginSubtitle: 'Sign up to create your photos',
    signupTitle: 'Get Started', signupSubtitle: 'No password needed — sign in with Google or get a magic link',
    continueGoogle: 'Continue with Google', or: 'or', emailLabel: 'Email', emailPlaceholder: 'Email',
    sending: 'Sending...', sendMagicLink: 'Send Magic Link',
    checkEmailLogin: 'Check your email to continue', checkEmailSignup: 'Check your email', sentTo: "We've sent a magic link to",
    spamTipLogin: 'Tip: it might be in your spam folder', spamTipSignup: 'The link arrives within 1 minute. Tip: also check your spam folder.',
    goBack: 'Go back', useDifferentEmail: 'Use a different email', backToHome: 'Back to homepage', aiGenerated: 'AI Generated',
    agree: 'By signing up, you agree to our', terms: 'Terms', privacy: 'Privacy Policy',
    trust: ['Profile-Worthy Guarantee', 'Your photos in under 30 minutes', 'We respect your privacy', 'No subscription, pay once'],
    errLink: 'Failed to send magic link', errGoogle: 'Failed to sign in with Google',
  },
}

const nl: AppCopy = {
  auth: {
    loginTitle: 'Zet selfies om in professionele foto’s', loginSubtitle: 'Meld je aan om je foto’s te maken',
    signupTitle: 'Aan de slag', signupSubtitle: 'Geen wachtwoord nodig — log in met Google of krijg een magische link',
    continueGoogle: 'Doorgaan met Google', or: 'of', emailLabel: 'E-mail', emailPlaceholder: 'E-mail',
    sending: 'Versturen...', sendMagicLink: 'Stuur magische link',
    checkEmailLogin: 'Check je e-mail om verder te gaan', checkEmailSignup: 'Check je e-mail', sentTo: 'We hebben een magische link gestuurd naar',
    spamTipLogin: 'Tip: kijk eventueel in je spam-map', spamTipSignup: 'De link komt binnen 1 minuut aan. Tip: kijk ook in je spam-map.',
    goBack: 'Terug', useDifferentEmail: 'Ander e-mailadres gebruiken', backToHome: 'Terug naar de homepagina', aiGenerated: 'AI-gegenereerd',
    agree: 'Door je aan te melden ga je akkoord met onze', terms: 'Voorwaarden', privacy: 'Privacybeleid',
    trust: ['Profielwaardig-garantie', 'Je foto’s in minder dan 30 minuten', 'We respecteren je privacy', 'Geen abonnement, eenmalig betalen'],
    errLink: 'Kon de magische link niet versturen', errGoogle: 'Kon niet inloggen met Google',
  },
}

const fr: AppCopy = {
  auth: {
    loginTitle: 'Transformez vos selfies en photos professionnelles', loginSubtitle: 'Inscrivez-vous pour créer vos photos',
    signupTitle: 'Commencer', signupSubtitle: 'Aucun mot de passe — connectez-vous avec Google ou recevez un lien magique',
    continueGoogle: 'Continuer avec Google', or: 'ou', emailLabel: 'E-mail', emailPlaceholder: 'E-mail',
    sending: 'Envoi...', sendMagicLink: 'Envoyer le lien magique',
    checkEmailLogin: 'Vérifiez votre e-mail pour continuer', checkEmailSignup: 'Vérifiez votre e-mail', sentTo: 'Nous avons envoyé un lien magique à',
    spamTipLogin: 'Astuce : vérifiez vos spams', spamTipSignup: 'Le lien arrive en moins d’1 minute. Astuce : vérifiez aussi vos spams.',
    goBack: 'Retour', useDifferentEmail: 'Utiliser une autre adresse', backToHome: 'Retour à l’accueil', aiGenerated: 'Généré par IA',
    agree: 'En vous inscrivant, vous acceptez nos', terms: 'Conditions', privacy: 'Politique de confidentialité',
    trust: ['Garantie photo de profil', 'Vos photos en moins de 30 minutes', 'Nous respectons votre vie privée', 'Sans abonnement, paiement unique'],
    errLink: 'Échec de l’envoi du lien magique', errGoogle: 'Échec de la connexion avec Google',
  },
}

const de: AppCopy = {
  auth: {
    loginTitle: 'Verwandle Selfies in professionelle Fotos', loginSubtitle: 'Melde dich an, um deine Fotos zu erstellen',
    signupTitle: 'Loslegen', signupSubtitle: 'Kein Passwort nötig — melde dich mit Google an oder erhalte einen Magic Link',
    continueGoogle: 'Mit Google fortfahren', or: 'oder', emailLabel: 'E-Mail', emailPlaceholder: 'E-Mail',
    sending: 'Senden...', sendMagicLink: 'Magic Link senden',
    checkEmailLogin: 'Prüfe deine E-Mail, um fortzufahren', checkEmailSignup: 'Prüfe deine E-Mail', sentTo: 'Wir haben einen Magic Link gesendet an',
    spamTipLogin: 'Tipp: Schau auch im Spam-Ordner', spamTipSignup: 'Der Link kommt innerhalb von 1 Minute an. Tipp: Schau auch im Spam-Ordner.',
    goBack: 'Zurück', useDifferentEmail: 'Andere E-Mail verwenden', backToHome: 'Zurück zur Startseite', aiGenerated: 'KI-generiert',
    agree: 'Mit der Anmeldung akzeptierst du unsere', terms: 'AGB', privacy: 'Datenschutz',
    trust: ['Profilwürdig-Garantie', 'Deine Fotos in unter 30 Minuten', 'Wir respektieren deine Privatsphäre', 'Kein Abo, einmalig bezahlen'],
    errLink: 'Magic Link konnte nicht gesendet werden', errGoogle: 'Anmeldung mit Google fehlgeschlagen',
  },
}

const es: AppCopy = {
  auth: {
    loginTitle: 'Convierte selfies en fotos profesionales', loginSubtitle: 'Regístrate para crear tus fotos',
    signupTitle: 'Empezar', signupSubtitle: 'Sin contraseña — inicia sesión con Google o recibe un enlace mágico',
    continueGoogle: 'Continuar con Google', or: 'o', emailLabel: 'Correo', emailPlaceholder: 'Correo',
    sending: 'Enviando...', sendMagicLink: 'Enviar enlace mágico',
    checkEmailLogin: 'Revisa tu correo para continuar', checkEmailSignup: 'Revisa tu correo', sentTo: 'Hemos enviado un enlace mágico a',
    spamTipLogin: 'Consejo: revisa tu carpeta de spam', spamTipSignup: 'El enlace llega en menos de 1 minuto. Consejo: revisa también tu carpeta de spam.',
    goBack: 'Volver', useDifferentEmail: 'Usar otro correo', backToHome: 'Volver al inicio', aiGenerated: 'Generado por IA',
    agree: 'Al registrarte, aceptas nuestros', terms: 'Términos', privacy: 'Política de privacidad',
    trust: ['Garantía apta para perfil', 'Tus fotos en menos de 30 minutos', 'Respetamos tu privacidad', 'Sin suscripción, pago único'],
    errLink: 'No se pudo enviar el enlace mágico', errGoogle: 'No se pudo iniciar sesión con Google',
  },
}

const it: AppCopy = {
  auth: {
    loginTitle: 'Trasforma i selfie in foto professionali', loginSubtitle: 'Registrati per creare le tue foto',
    signupTitle: 'Inizia', signupSubtitle: 'Nessuna password — accedi con Google o ricevi un magic link',
    continueGoogle: 'Continua con Google', or: 'o', emailLabel: 'E-mail', emailPlaceholder: 'E-mail',
    sending: 'Invio...', sendMagicLink: 'Invia magic link',
    checkEmailLogin: 'Controlla la tua e-mail per continuare', checkEmailSignup: 'Controlla la tua e-mail', sentTo: 'Abbiamo inviato un magic link a',
    spamTipLogin: 'Suggerimento: controlla la cartella spam', spamTipSignup: 'Il link arriva entro 1 minuto. Suggerimento: controlla anche lo spam.',
    goBack: 'Indietro', useDifferentEmail: 'Usa un’altra e-mail', backToHome: 'Torna alla home', aiGenerated: 'Generato dall’IA',
    agree: 'Registrandoti, accetti i nostri', terms: 'Termini', privacy: 'Informativa privacy',
    trust: ['Garanzia foto profilo', 'Le tue foto in meno di 30 minuti', 'Rispettiamo la tua privacy', 'Nessun abbonamento, paghi una volta'],
    errLink: 'Impossibile inviare il magic link', errGoogle: 'Accesso con Google non riuscito',
  },
}

const pt: AppCopy = {
  auth: {
    loginTitle: 'Transforme selfies em fotos profissionais', loginSubtitle: 'Cadastre-se para criar suas fotos',
    signupTitle: 'Começar', signupSubtitle: 'Sem senha — entre com o Google ou receba um link mágico',
    continueGoogle: 'Continuar com o Google', or: 'ou', emailLabel: 'E-mail', emailPlaceholder: 'E-mail',
    sending: 'Enviando...', sendMagicLink: 'Enviar link mágico',
    checkEmailLogin: 'Verifique seu e-mail para continuar', checkEmailSignup: 'Verifique seu e-mail', sentTo: 'Enviamos um link mágico para',
    spamTipLogin: 'Dica: verifique a pasta de spam', spamTipSignup: 'O link chega em menos de 1 minuto. Dica: verifique também o spam.',
    goBack: 'Voltar', useDifferentEmail: 'Usar outro e-mail', backToHome: 'Voltar ao início', aiGenerated: 'Gerado por IA',
    agree: 'Ao se cadastrar, você concorda com nossos', terms: 'Termos', privacy: 'Política de Privacidade',
    trust: ['Garantia digna de perfil', 'Suas fotos em menos de 30 minutos', 'Respeitamos sua privacidade', 'Sem assinatura, pagamento único'],
    errLink: 'Falha ao enviar o link mágico', errGoogle: 'Falha ao entrar com o Google',
  },
}

export const APP: Record<Locale, AppCopy> = { en, nl, fr, de, es, it, pt }
