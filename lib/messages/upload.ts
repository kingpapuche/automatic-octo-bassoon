import type { Locale } from '@/lib/i18n'

type Opt = Record<string, string>
interface UploadCopy {
  navDashboard: string; credits: string
  step1Label: string; step2Label: string
  step1Title: string; step1Sub: string
  forWhom: string; forWhomHelp: string; namePlaceholder: string
  aboutYou: string; aboutYouHint: string
  gender: string; ethnicity: string; eyeColor: string; hairColor: string
  bald: string; glasses: string; beard: string
  useForWhat: string; useForWhatHint: string
  consentLabel: string; consentDesc: string
  continueBtn: string; fillRequired: string
  step2Title: string; step2Sub: string; editDetails: string
  eyesSuffix: string; hairSuffix: string; baldTag: string; glassesTag: string; beardTag: string
  tipsTitle: string; tips: string[]
  uploadSection: string; clearAll: string
  optimizing: string; dropHere: string; dragDrop: string; orBrowse: string; fileTypes: string
  uploadMoreMin: string; uploadMoreBtn: string; startTraining: string; startingTraining: string
  trainingNote: string
  statusUploading: string; statusUploaded: string; statusStarted: string
  errSave: string; errMax: string; errTooLarge: string; errProcess: string; errMin8: string; errNoCredits: string; errStartTrain: string; errGeneric: string
  genderOpts: Opt; ethnicityOpts: Opt; eyeOpts: Opt; hairOpts: Opt; useCaseOpts: Opt
}

const en: UploadCopy = {
  navDashboard: 'Dashboard', credits: 'credits',
  step1Label: 'Your Details', step2Label: 'Upload Photos',
  step1Title: 'Train Your AI Model', step1Sub: 'Tell us a bit about yourself so your AI model gets it right.',
  forWhom: 'Who are these photos for? *', forWhomHelp: 'Use the full name (first + last) — it identifies this AI model.', namePlaceholder: 'e.g. John Smith',
  aboutYou: 'About You', aboutYouHint: '(helps the AI get the details right)',
  gender: 'Gender *', ethnicity: 'Ethnicity *', eyeColor: 'Eye Color *', hairColor: 'Hair Color *',
  bald: 'Bald / very short hair', glasses: 'Glasses', beard: 'Beard / facial hair',
  useForWhat: 'What will you use these for?', useForWhatHint: '(optional, max 3)',
  consentLabel: 'Allow Nova Imago to use my photos as examples', consentDesc: 'Your photos may be shown on our website to help future customers. No personal info is shared.',
  continueBtn: 'Continue to Photo Upload →', fillRequired: 'Please fill in all required fields',
  step2Title: 'Upload Your Photos', step2Sub: 'Upload 8–15 photos for the best results.', editDetails: '← Edit details',
  eyesSuffix: 'eyes', hairSuffix: 'hair', baldTag: 'Bald', glassesTag: 'Glasses', beardTag: 'Beard',
  tipsTitle: '💡 Tips for the best results', tips: ['8–15 photos for best results', 'Solo only — no sunglasses or hats', 'Mix smiling and neutral', 'Good natural lighting', 'Different angles & expressions', 'Varied backgrounds & locations — important for pro results!', 'Photos auto-optimized — any size works'],
  uploadSection: 'Upload Photos', clearAll: 'Clear all',
  optimizing: 'Optimizing photos...', dropHere: 'Drop your photos here...', dragDrop: 'Drag & drop photos here', orBrowse: 'or click to browse', fileTypes: 'JPG, PNG, WEBP • Auto-optimized for upload',
  uploadMoreMin: 'Upload {n} more photos to continue (minimum 8)', uploadMoreBtn: 'Upload {n} more photos to continue', startTraining: 'Start AI Training', startingTraining: 'Starting AI training...',
  trainingNote: 'Training takes about 25–35 minutes. Stay on this page to watch the progress, or leave — we’ll email you the moment your model is ready. Don’t see the email? Please check your spam folder.',
  statusUploading: 'Uploading photos...', statusUploaded: 'Photos uploaded! Starting AI training...', statusStarted: 'Training started! 🎉',
  errSave: 'Failed to save your details. Please try again.', errMax: 'Maximum 15 photos allowed', errTooLarge: '{name} is too large (>15MB). Please use a smaller photo.', errProcess: 'Could not process {name}. Try a different photo.', errMin8: 'Please upload at least 8 photos', errNoCredits: 'You need credits to train a model.', errStartTrain: 'Failed to start training', errGeneric: 'Something went wrong',
  genderOpts: { male: 'Male', female: 'Female', 'non-binary': 'Non-binary' },
  ethnicityOpts: { caucasian: 'Caucasian', hispanic: 'Hispanic', black: 'Black', asian: 'Asian', indian: 'Indian', arabic: 'Arabic', caribbean: 'Caribbean', african: 'African', other: 'Other' },
  eyeOpts: { brown: 'Brown', blue: 'Blue', amber: 'Amber', green: 'Green', black: 'Black', honey: 'Honey', gray: 'Gray', hazel: 'Hazel' },
  hairOpts: { black: 'Black', brown: 'Brown', blonde: 'Blonde', red: 'Red', gray: 'Gray', white: 'White', auburn: 'Auburn', 'dark brown': 'Dark Brown' },
  useCaseOpts: { website: 'Website / About Us', 'social-media': 'Social Media', cv: 'CV / Resume', dating: 'Dating Profile', portfolio: 'Portfolio', 'business-cards': 'Business Cards', 'online-platforms': 'Online Platforms', other: 'Other' },
}

const nl: UploadCopy = {
  navDashboard: 'Dashboard', credits: 'credits',
  step1Label: 'Je gegevens', step2Label: 'Foto’s uploaden',
  step1Title: 'Train je AI-model', step1Sub: 'Vertel ons iets over jezelf zodat je AI-model het juist krijgt.',
  forWhom: 'Voor wie zijn deze foto’s? *', forWhomHelp: 'Gebruik de volledige naam (voor + achter) — die identificeert dit AI-model.', namePlaceholder: 'bv. Jan Janssens',
  aboutYou: 'Over jou', aboutYouHint: '(helpt de AI met de details)',
  gender: 'Geslacht *', ethnicity: 'Etniciteit *', eyeColor: 'Oogkleur *', hairColor: 'Haarkleur *',
  bald: 'Kaal / heel kort haar', glasses: 'Bril', beard: 'Baard / gezichtshaar',
  useForWhat: 'Waarvoor ga je ze gebruiken?', useForWhatHint: '(optioneel, max 3)',
  consentLabel: 'Nova Imago mag mijn foto’s als voorbeeld gebruiken', consentDesc: 'Je foto’s kunnen op onze website getoond worden om toekomstige klanten te helpen. Er wordt geen persoonlijke info gedeeld.',
  continueBtn: 'Verder naar foto’s uploaden →', fillRequired: 'Vul alle verplichte velden in',
  step2Title: 'Upload je foto’s', step2Sub: 'Upload 8–15 foto’s voor het beste resultaat.', editDetails: '← Gegevens bewerken',
  eyesSuffix: 'ogen', hairSuffix: 'haar', baldTag: 'Kaal', glassesTag: 'Bril', beardTag: 'Baard',
  tipsTitle: '💡 Tips voor het beste resultaat', tips: ['8–15 foto’s voor het beste resultaat', 'Enkel solo — geen zonnebril of hoed', 'Mix lachend en neutraal', 'Goed natuurlijk licht', 'Verschillende hoeken & uitdrukkingen', 'Gevarieerde achtergronden & locaties — belangrijk voor pro-resultaten!', 'Foto’s worden automatisch geoptimaliseerd — elk formaat werkt'],
  uploadSection: 'Foto’s uploaden', clearAll: 'Alles wissen',
  optimizing: 'Foto’s optimaliseren...', dropHere: 'Sleep je foto’s hier...', dragDrop: 'Sleep je foto’s hierheen', orBrowse: 'of klik om te bladeren', fileTypes: 'JPG, PNG, WEBP • Automatisch geoptimaliseerd',
  uploadMoreMin: 'Upload nog {n} foto’s om verder te gaan (minimum 8)', uploadMoreBtn: 'Upload nog {n} foto’s om verder te gaan', startTraining: 'Start AI-training', startingTraining: 'AI-training starten...',
  trainingNote: 'Training duurt ongeveer 25–35 minuten. Blijf op deze pagina om de voortgang te volgen, of ga weg — we mailen je zodra je model klaar is. Geen mail? Kijk in je spam-map.',
  statusUploading: 'Foto’s uploaden...', statusUploaded: 'Foto’s geüpload! AI-training starten...', statusStarted: 'Training gestart! 🎉',
  errSave: 'Kon je gegevens niet opslaan. Probeer opnieuw.', errMax: 'Maximaal 15 foto’s toegestaan', errTooLarge: '{name} is te groot (>15MB). Gebruik een kleinere foto.', errProcess: 'Kon {name} niet verwerken. Probeer een andere foto.', errMin8: 'Upload minstens 8 foto’s', errNoCredits: 'Je hebt credits nodig om een model te trainen.', errStartTrain: 'Kon de training niet starten', errGeneric: 'Er ging iets mis',
  genderOpts: { male: 'Man', female: 'Vrouw', 'non-binary': 'Non-binair' },
  ethnicityOpts: { caucasian: 'Kaukasisch', hispanic: 'Hispanic', black: 'Zwart', asian: 'Aziatisch', indian: 'Indiaas', arabic: 'Arabisch', caribbean: 'Caribisch', african: 'Afrikaans', other: 'Anders' },
  eyeOpts: { brown: 'Bruin', blue: 'Blauw', amber: 'Amber', green: 'Groen', black: 'Zwart', honey: 'Honing', gray: 'Grijs', hazel: 'Hazelnoot' },
  hairOpts: { black: 'Zwart', brown: 'Bruin', blonde: 'Blond', red: 'Rood', gray: 'Grijs', white: 'Wit', auburn: 'Kastanjebruin', 'dark brown': 'Donkerbruin' },
  useCaseOpts: { website: 'Website / Over ons', 'social-media': 'Social media', cv: 'CV', dating: 'Datingprofiel', portfolio: 'Portfolio', 'business-cards': 'Visitekaartjes', 'online-platforms': 'Online platforms', other: 'Anders' },
}

const fr: UploadCopy = {
  navDashboard: 'Tableau de bord', credits: 'crédits',
  step1Label: 'Vos infos', step2Label: 'Importer des photos',
  step1Title: 'Entraînez votre modèle IA', step1Sub: 'Parlez-nous un peu de vous pour que votre modèle IA soit juste.',
  forWhom: 'Pour qui sont ces photos ? *', forWhomHelp: 'Utilisez le nom complet (prénom + nom) — il identifie ce modèle IA.', namePlaceholder: 'ex. Jean Dupont',
  aboutYou: 'À propos de vous', aboutYouHint: '(aide l’IA à bien saisir les détails)',
  gender: 'Genre *', ethnicity: 'Origine *', eyeColor: 'Couleur des yeux *', hairColor: 'Couleur des cheveux *',
  bald: 'Chauve / cheveux très courts', glasses: 'Lunettes', beard: 'Barbe / pilosité',
  useForWhat: 'Pour quoi allez-vous les utiliser ?', useForWhatHint: '(facultatif, max 3)',
  consentLabel: 'Autoriser Nova Imago à utiliser mes photos comme exemples', consentDesc: 'Vos photos peuvent être affichées sur notre site pour aider de futurs clients. Aucune info personnelle n’est partagée.',
  continueBtn: 'Continuer vers l’import →', fillRequired: 'Veuillez remplir tous les champs requis',
  step2Title: 'Importez vos photos', step2Sub: 'Importez 8–15 photos pour un résultat optimal.', editDetails: '← Modifier les infos',
  eyesSuffix: 'yeux', hairSuffix: 'cheveux', baldTag: 'Chauve', glassesTag: 'Lunettes', beardTag: 'Barbe',
  tipsTitle: '💡 Conseils pour un résultat optimal', tips: ['8–15 photos pour un résultat optimal', 'Solo uniquement — sans lunettes de soleil ni chapeau', 'Mélangez sourire et neutre', 'Bonne lumière naturelle', 'Angles & expressions variés', 'Arrière-plans & lieux variés — important pour un rendu pro !', 'Photos auto-optimisées — toute taille convient'],
  uploadSection: 'Importer des photos', clearAll: 'Tout effacer',
  optimizing: 'Optimisation des photos...', dropHere: 'Déposez vos photos ici...', dragDrop: 'Glissez-déposez vos photos ici', orBrowse: 'ou cliquez pour parcourir', fileTypes: 'JPG, PNG, WEBP • Auto-optimisées',
  uploadMoreMin: 'Importez encore {n} photos pour continuer (minimum 8)', uploadMoreBtn: 'Importez encore {n} photos pour continuer', startTraining: 'Démarrer l’entraînement IA', startingTraining: 'Démarrage de l’entraînement...',
  trainingNote: 'L’entraînement prend environ 25–35 minutes. Restez sur cette page pour suivre l’avancement, ou partez — nous vous enverrons un e-mail dès que votre modèle est prêt. Pas d’e-mail ? Vérifiez vos spams.',
  statusUploading: 'Import des photos...', statusUploaded: 'Photos importées ! Démarrage de l’entraînement...', statusStarted: 'Entraînement démarré ! 🎉',
  errSave: 'Échec de l’enregistrement de vos infos. Réessayez.', errMax: '15 photos maximum', errTooLarge: '{name} est trop volumineux (>15 Mo). Utilisez une photo plus petite.', errProcess: 'Impossible de traiter {name}. Essayez une autre photo.', errMin8: 'Importez au moins 8 photos', errNoCredits: 'Vous avez besoin de crédits pour entraîner un modèle.', errStartTrain: 'Échec du démarrage de l’entraînement', errGeneric: 'Une erreur s’est produite',
  genderOpts: { male: 'Homme', female: 'Femme', 'non-binary': 'Non-binaire' },
  ethnicityOpts: { caucasian: 'Caucasien', hispanic: 'Hispanique', black: 'Noir', asian: 'Asiatique', indian: 'Indien', arabic: 'Arabe', caribbean: 'Caribéen', african: 'Africain', other: 'Autre' },
  eyeOpts: { brown: 'Marron', blue: 'Bleu', amber: 'Ambre', green: 'Vert', black: 'Noir', honey: 'Miel', gray: 'Gris', hazel: 'Noisette' },
  hairOpts: { black: 'Noir', brown: 'Brun', blonde: 'Blond', red: 'Roux', gray: 'Gris', white: 'Blanc', auburn: 'Auburn', 'dark brown': 'Brun foncé' },
  useCaseOpts: { website: 'Site web / À propos', 'social-media': 'Réseaux sociaux', cv: 'CV', dating: 'Profil de rencontre', portfolio: 'Portfolio', 'business-cards': 'Cartes de visite', 'online-platforms': 'Plateformes en ligne', other: 'Autre' },
}

const de: UploadCopy = {
  navDashboard: 'Dashboard', credits: 'Credits',
  step1Label: 'Deine Angaben', step2Label: 'Fotos hochladen',
  step1Title: 'Trainiere dein KI-Modell', step1Sub: 'Erzähl uns etwas über dich, damit dein KI-Modell stimmt.',
  forWhom: 'Für wen sind diese Fotos? *', forWhomHelp: 'Verwende den vollen Namen (Vor- + Nachname) — er identifiziert dieses KI-Modell.', namePlaceholder: 'z. B. Max Mustermann',
  aboutYou: 'Über dich', aboutYouHint: '(hilft der KI mit den Details)',
  gender: 'Geschlecht *', ethnicity: 'Herkunft *', eyeColor: 'Augenfarbe *', hairColor: 'Haarfarbe *',
  bald: 'Glatze / sehr kurzes Haar', glasses: 'Brille', beard: 'Bart / Gesichtsbehaarung',
  useForWhat: 'Wofür wirst du sie nutzen?', useForWhatHint: '(optional, max 3)',
  consentLabel: 'Nova Imago darf meine Fotos als Beispiele nutzen', consentDesc: 'Deine Fotos können auf unserer Website gezeigt werden, um künftigen Kunden zu helfen. Es werden keine persönlichen Daten geteilt.',
  continueBtn: 'Weiter zum Foto-Upload →', fillRequired: 'Bitte fülle alle Pflichtfelder aus',
  step2Title: 'Lade deine Fotos hoch', step2Sub: 'Lade 8–15 Fotos für die besten Ergebnisse hoch.', editDetails: '← Angaben bearbeiten',
  eyesSuffix: 'Augen', hairSuffix: 'Haare', baldTag: 'Glatze', glassesTag: 'Brille', beardTag: 'Bart',
  tipsTitle: '💡 Tipps für die besten Ergebnisse', tips: ['8–15 Fotos für die besten Ergebnisse', 'Nur solo — keine Sonnenbrille oder Hüte', 'Lächelnd und neutral mischen', 'Gutes natürliches Licht', 'Verschiedene Winkel & Ausdrücke', 'Abwechslungsreiche Hintergründe & Orte — wichtig für Pro-Ergebnisse!', 'Fotos werden automatisch optimiert — jede Größe funktioniert'],
  uploadSection: 'Fotos hochladen', clearAll: 'Alle löschen',
  optimizing: 'Fotos werden optimiert...', dropHere: 'Lege deine Fotos hier ab...', dragDrop: 'Fotos hierher ziehen', orBrowse: 'oder klicken zum Durchsuchen', fileTypes: 'JPG, PNG, WEBP • Automatisch optimiert',
  uploadMoreMin: 'Lade noch {n} Fotos hoch, um fortzufahren (mindestens 8)', uploadMoreBtn: 'Lade noch {n} Fotos hoch, um fortzufahren', startTraining: 'KI-Training starten', startingTraining: 'KI-Training wird gestartet...',
  trainingNote: 'Das Training dauert etwa 25–35 Minuten. Bleib auf dieser Seite, um den Fortschritt zu sehen, oder geh — wir mailen dir, sobald dein Modell fertig ist. Keine Mail? Schau im Spam-Ordner.',
  statusUploading: 'Fotos werden hochgeladen...', statusUploaded: 'Fotos hochgeladen! KI-Training wird gestartet...', statusStarted: 'Training gestartet! 🎉',
  errSave: 'Angaben konnten nicht gespeichert werden. Bitte versuche es erneut.', errMax: 'Maximal 15 Fotos erlaubt', errTooLarge: '{name} ist zu groß (>15 MB). Bitte nutze ein kleineres Foto.', errProcess: '{name} konnte nicht verarbeitet werden. Versuche ein anderes Foto.', errMin8: 'Bitte lade mindestens 8 Fotos hoch', errNoCredits: 'Du brauchst Credits, um ein Modell zu trainieren.', errStartTrain: 'Training konnte nicht gestartet werden', errGeneric: 'Etwas ist schiefgelaufen',
  genderOpts: { male: 'Männlich', female: 'Weiblich', 'non-binary': 'Non-binär' },
  ethnicityOpts: { caucasian: 'Kaukasisch', hispanic: 'Hispanisch', black: 'Schwarz', asian: 'Asiatisch', indian: 'Indisch', arabic: 'Arabisch', caribbean: 'Karibisch', african: 'Afrikanisch', other: 'Andere' },
  eyeOpts: { brown: 'Braun', blue: 'Blau', amber: 'Bernstein', green: 'Grün', black: 'Schwarz', honey: 'Honig', gray: 'Grau', hazel: 'Haselnuss' },
  hairOpts: { black: 'Schwarz', brown: 'Braun', blonde: 'Blond', red: 'Rot', gray: 'Grau', white: 'Weiß', auburn: 'Kastanienbraun', 'dark brown': 'Dunkelbraun' },
  useCaseOpts: { website: 'Website / Über uns', 'social-media': 'Social Media', cv: 'Lebenslauf', dating: 'Dating-Profil', portfolio: 'Portfolio', 'business-cards': 'Visitenkarten', 'online-platforms': 'Online-Plattformen', other: 'Andere' },
}

const es: UploadCopy = {
  navDashboard: 'Panel', credits: 'créditos',
  step1Label: 'Tus datos', step2Label: 'Subir fotos',
  step1Title: 'Entrena tu modelo IA', step1Sub: 'Cuéntanos un poco sobre ti para que tu modelo IA acierte.',
  forWhom: '¿Para quién son estas fotos? *', forWhomHelp: 'Usa el nombre completo (nombre + apellido) — identifica este modelo IA.', namePlaceholder: 'ej. Juan Pérez',
  aboutYou: 'Sobre ti', aboutYouHint: '(ayuda a la IA con los detalles)',
  gender: 'Género *', ethnicity: 'Etnia *', eyeColor: 'Color de ojos *', hairColor: 'Color de pelo *',
  bald: 'Calvo / pelo muy corto', glasses: 'Gafas', beard: 'Barba / vello facial',
  useForWhat: '¿Para qué las usarás?', useForWhatHint: '(opcional, máx 3)',
  consentLabel: 'Permitir a Nova Imago usar mis fotos como ejemplos', consentDesc: 'Tus fotos pueden mostrarse en nuestra web para ayudar a futuros clientes. No se comparte información personal.',
  continueBtn: 'Continuar a subir fotos →', fillRequired: 'Rellena todos los campos obligatorios',
  step2Title: 'Sube tus fotos', step2Sub: 'Sube 8–15 fotos para el mejor resultado.', editDetails: '← Editar datos',
  eyesSuffix: 'ojos', hairSuffix: 'pelo', baldTag: 'Calvo', glassesTag: 'Gafas', beardTag: 'Barba',
  tipsTitle: '💡 Consejos para el mejor resultado', tips: ['8–15 fotos para el mejor resultado', 'Solo en solitario — sin gafas de sol ni sombreros', 'Mezcla sonriendo y neutral', 'Buena luz natural', 'Distintos ángulos y expresiones', 'Fondos y lugares variados — ¡importante para un resultado pro!', 'Fotos autooptimizadas — cualquier tamaño sirve'],
  uploadSection: 'Subir fotos', clearAll: 'Borrar todo',
  optimizing: 'Optimizando fotos...', dropHere: 'Suelta tus fotos aquí...', dragDrop: 'Arrastra y suelta tus fotos aquí', orBrowse: 'o haz clic para explorar', fileTypes: 'JPG, PNG, WEBP • Autooptimizadas',
  uploadMoreMin: 'Sube {n} fotos más para continuar (mínimo 8)', uploadMoreBtn: 'Sube {n} fotos más para continuar', startTraining: 'Iniciar entrenamiento IA', startingTraining: 'Iniciando entrenamiento IA...',
  trainingNote: 'El entrenamiento tarda unos 25–35 minutos. Quédate en esta página para ver el progreso, o sal — te enviaremos un correo en cuanto tu modelo esté listo. ¿No lo ves? Revisa tu carpeta de spam.',
  statusUploading: 'Subiendo fotos...', statusUploaded: '¡Fotos subidas! Iniciando entrenamiento IA...', statusStarted: '¡Entrenamiento iniciado! 🎉',
  errSave: 'No se pudieron guardar tus datos. Inténtalo de nuevo.', errMax: 'Máximo 15 fotos', errTooLarge: '{name} es demasiado grande (>15MB). Usa una foto más pequeña.', errProcess: 'No se pudo procesar {name}. Prueba con otra foto.', errMin8: 'Sube al menos 8 fotos', errNoCredits: 'Necesitas créditos para entrenar un modelo.', errStartTrain: 'No se pudo iniciar el entrenamiento', errGeneric: 'Algo salió mal',
  genderOpts: { male: 'Hombre', female: 'Mujer', 'non-binary': 'No binario' },
  ethnicityOpts: { caucasian: 'Caucásico', hispanic: 'Hispano', black: 'Negro', asian: 'Asiático', indian: 'Indio', arabic: 'Árabe', caribbean: 'Caribeño', african: 'Africano', other: 'Otro' },
  eyeOpts: { brown: 'Marrón', blue: 'Azul', amber: 'Ámbar', green: 'Verde', black: 'Negro', honey: 'Miel', gray: 'Gris', hazel: 'Avellana' },
  hairOpts: { black: 'Negro', brown: 'Castaño', blonde: 'Rubio', red: 'Pelirrojo', gray: 'Gris', white: 'Blanco', auburn: 'Caoba', 'dark brown': 'Castaño oscuro' },
  useCaseOpts: { website: 'Web / Sobre nosotros', 'social-media': 'Redes sociales', cv: 'CV', dating: 'Perfil de citas', portfolio: 'Portafolio', 'business-cards': 'Tarjetas de visita', 'online-platforms': 'Plataformas online', other: 'Otro' },
}

const it: UploadCopy = {
  navDashboard: 'Dashboard', credits: 'crediti',
  step1Label: 'I tuoi dati', step2Label: 'Carica foto',
  step1Title: 'Allena il tuo modello IA', step1Sub: 'Raccontaci qualcosa di te così il tuo modello IA sarà preciso.',
  forWhom: 'Per chi sono queste foto? *', forWhomHelp: 'Usa il nome completo (nome + cognome) — identifica questo modello IA.', namePlaceholder: 'es. Mario Rossi',
  aboutYou: 'Su di te', aboutYouHint: '(aiuta l’IA con i dettagli)',
  gender: 'Genere *', ethnicity: 'Etnia *', eyeColor: 'Colore occhi *', hairColor: 'Colore capelli *',
  bald: 'Calvo / capelli molto corti', glasses: 'Occhiali', beard: 'Barba / peli sul viso',
  useForWhat: 'Per cosa le userai?', useForWhatHint: '(facoltativo, max 3)',
  consentLabel: 'Consenti a Nova Imago di usare le mie foto come esempi', consentDesc: 'Le tue foto potrebbero essere mostrate sul nostro sito per aiutare futuri clienti. Nessun dato personale viene condiviso.',
  continueBtn: 'Continua al caricamento foto →', fillRequired: 'Compila tutti i campi obbligatori',
  step2Title: 'Carica le tue foto', step2Sub: 'Carica 8–15 foto per il miglior risultato.', editDetails: '← Modifica dati',
  eyesSuffix: 'occhi', hairSuffix: 'capelli', baldTag: 'Calvo', glassesTag: 'Occhiali', beardTag: 'Barba',
  tipsTitle: '💡 Consigli per il miglior risultato', tips: ['8–15 foto per il miglior risultato', 'Solo da soli — niente occhiali da sole o cappelli', 'Mescola sorridente e neutro', 'Buona luce naturale', 'Angolazioni ed espressioni diverse', 'Sfondi e luoghi vari — importante per risultati pro!', 'Foto auto-ottimizzate — qualsiasi dimensione va bene'],
  uploadSection: 'Carica foto', clearAll: 'Cancella tutto',
  optimizing: 'Ottimizzazione foto...', dropHere: 'Rilascia le tue foto qui...', dragDrop: 'Trascina e rilascia le foto qui', orBrowse: 'o clicca per sfogliare', fileTypes: 'JPG, PNG, WEBP • Auto-ottimizzate',
  uploadMoreMin: 'Carica altre {n} foto per continuare (minimo 8)', uploadMoreBtn: 'Carica altre {n} foto per continuare', startTraining: 'Avvia l’allenamento IA', startingTraining: 'Avvio dell’allenamento IA...',
  trainingNote: 'L’allenamento richiede circa 25–35 minuti. Resta su questa pagina per seguire l’avanzamento, oppure esci — ti invieremo un’e-mail appena il tuo modello è pronto. Non la vedi? Controlla lo spam.',
  statusUploading: 'Caricamento foto...', statusUploaded: 'Foto caricate! Avvio dell’allenamento IA...', statusStarted: 'Allenamento avviato! 🎉',
  errSave: 'Impossibile salvare i tuoi dati. Riprova.', errMax: 'Massimo 15 foto', errTooLarge: '{name} è troppo grande (>15MB). Usa una foto più piccola.', errProcess: 'Impossibile elaborare {name}. Prova un’altra foto.', errMin8: 'Carica almeno 8 foto', errNoCredits: 'Servono crediti per allenare un modello.', errStartTrain: 'Impossibile avviare l’allenamento', errGeneric: 'Qualcosa è andato storto',
  genderOpts: { male: 'Uomo', female: 'Donna', 'non-binary': 'Non binario' },
  ethnicityOpts: { caucasian: 'Caucasico', hispanic: 'Ispanico', black: 'Nero', asian: 'Asiatico', indian: 'Indiano', arabic: 'Arabo', caribbean: 'Caraibico', african: 'Africano', other: 'Altro' },
  eyeOpts: { brown: 'Marrone', blue: 'Azzurro', amber: 'Ambra', green: 'Verde', black: 'Nero', honey: 'Miele', gray: 'Grigio', hazel: 'Nocciola' },
  hairOpts: { black: 'Neri', brown: 'Castani', blonde: 'Biondi', red: 'Rossi', gray: 'Grigi', white: 'Bianchi', auburn: 'Ramati', 'dark brown': 'Castano scuro' },
  useCaseOpts: { website: 'Sito web / Chi siamo', 'social-media': 'Social media', cv: 'CV', dating: 'Profilo di incontri', portfolio: 'Portfolio', 'business-cards': 'Biglietti da visita', 'online-platforms': 'Piattaforme online', other: 'Altro' },
}

const pt: UploadCopy = {
  navDashboard: 'Painel', credits: 'créditos',
  step1Label: 'Seus dados', step2Label: 'Enviar fotos',
  step1Title: 'Treine seu modelo IA', step1Sub: 'Conte um pouco sobre você para o seu modelo IA acertar.',
  forWhom: 'Para quem são estas fotos? *', forWhomHelp: 'Use o nome completo (nome + sobrenome) — ele identifica este modelo IA.', namePlaceholder: 'ex. João Silva',
  aboutYou: 'Sobre você', aboutYouHint: '(ajuda a IA com os detalhes)',
  gender: 'Gênero *', ethnicity: 'Etnia *', eyeColor: 'Cor dos olhos *', hairColor: 'Cor do cabelo *',
  bald: 'Careca / cabelo bem curto', glasses: 'Óculos', beard: 'Barba / pelos faciais',
  useForWhat: 'Para que você vai usá-las?', useForWhatHint: '(opcional, máx 3)',
  consentLabel: 'Permitir que a Nova Imago use minhas fotos como exemplos', consentDesc: 'Suas fotos podem aparecer no nosso site para ajudar futuros clientes. Nenhuma informação pessoal é compartilhada.',
  continueBtn: 'Continuar para enviar fotos →', fillRequired: 'Preencha todos os campos obrigatórios',
  step2Title: 'Envie suas fotos', step2Sub: 'Envie 8–15 fotos para o melhor resultado.', editDetails: '← Editar dados',
  eyesSuffix: 'olhos', hairSuffix: 'cabelo', baldTag: 'Careca', glassesTag: 'Óculos', beardTag: 'Barba',
  tipsTitle: '💡 Dicas para o melhor resultado', tips: ['8–15 fotos para o melhor resultado', 'Apenas sozinho — sem óculos de sol ou chapéus', 'Misture sorrindo e neutro', 'Boa luz natural', 'Ângulos e expressões diferentes', 'Fundos e locais variados — importante para resultados pro!', 'Fotos auto-otimizadas — qualquer tamanho funciona'],
  uploadSection: 'Enviar fotos', clearAll: 'Limpar tudo',
  optimizing: 'Otimizando fotos...', dropHere: 'Solte suas fotos aqui...', dragDrop: 'Arraste e solte suas fotos aqui', orBrowse: 'ou clique para procurar', fileTypes: 'JPG, PNG, WEBP • Auto-otimizadas',
  uploadMoreMin: 'Envie mais {n} fotos para continuar (mínimo 8)', uploadMoreBtn: 'Envie mais {n} fotos para continuar', startTraining: 'Iniciar treinamento IA', startingTraining: 'Iniciando treinamento IA...',
  trainingNote: 'O treinamento leva cerca de 25–35 minutos. Fique nesta página para acompanhar o progresso, ou saia — enviaremos um e-mail assim que seu modelo estiver pronto. Não achou? Verifique o spam.',
  statusUploading: 'Enviando fotos...', statusUploaded: 'Fotos enviadas! Iniciando treinamento IA...', statusStarted: 'Treinamento iniciado! 🎉',
  errSave: 'Não foi possível salvar seus dados. Tente novamente.', errMax: 'Máximo de 15 fotos', errTooLarge: '{name} é muito grande (>15MB). Use uma foto menor.', errProcess: 'Não foi possível processar {name}. Tente outra foto.', errMin8: 'Envie pelo menos 8 fotos', errNoCredits: 'Você precisa de créditos para treinar um modelo.', errStartTrain: 'Não foi possível iniciar o treinamento', errGeneric: 'Algo deu errado',
  genderOpts: { male: 'Homem', female: 'Mulher', 'non-binary': 'Não binário' },
  ethnicityOpts: { caucasian: 'Caucasiano', hispanic: 'Hispânico', black: 'Negro', asian: 'Asiático', indian: 'Indiano', arabic: 'Árabe', caribbean: 'Caribenho', african: 'Africano', other: 'Outro' },
  eyeOpts: { brown: 'Castanho', blue: 'Azul', amber: 'Âmbar', green: 'Verde', black: 'Preto', honey: 'Mel', gray: 'Cinza', hazel: 'Avelã' },
  hairOpts: { black: 'Preto', brown: 'Castanho', blonde: 'Loiro', red: 'Ruivo', gray: 'Grisalho', white: 'Branco', auburn: 'Ruivo-acastanhado', 'dark brown': 'Castanho-escuro' },
  useCaseOpts: { website: 'Site / Sobre nós', 'social-media': 'Redes sociais', cv: 'Currículo', dating: 'Perfil de namoro', portfolio: 'Portfólio', 'business-cards': 'Cartões de visita', 'online-platforms': 'Plataformas online', other: 'Outro' },
}

export const UPLOAD: Record<Locale, UploadCopy> = { en, nl, fr, de, es, it, pt }
