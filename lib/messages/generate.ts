import type { Locale } from '@/lib/i18n'

// UI-teksten voor de review/generate-stap (/create/generate).
// Tokens: {n}=variaties, {styles}, {total}, {credits}
export interface GenerateCopy {
  loading: string
  creditsTitle: string
  creditsBody: string      // {styles} {n} {total} {credits}
  creditsHint: string
  cancel: string
  buyCredits: string
  modelTitle: string
  modelBody: string
  uploadPhotos: string
  title: string
  subtitle: string
  selectedStyles: string
  change: string
  eachGenerates: string    // {n}
  generatingFor: string
  generatingForDesc: string
  changeLower: string
  photoFormat: string
  fmtPortrait: string
  fmtSquare: string
  fmtLandscape: string
  fmtPortraitDesc: string
  fmtSquareDesc: string
  fmtLandscapeDesc: string
  genSettings: string
  aspectRatio: string
  variationsPerStyle: string
  quality: string
  qualityValue: string
  format: string
  stylesSelected: string
  totalHeadshots: string
  photos: string           // {total}
  creditsNeeded: string
  yourBalance: string
  creditsUnit: string
  back: string
  starting: string
  generateBtn: string      // {total}
  genFailed: string
}

export const GENERATE: Record<Locale, GenerateCopy> = {
  en: {
    loading: 'Loading...', creditsTitle: 'You Need More Credits',
    creditsBody: 'You selected {styles} styles × {n} = {total} headshots but only have {credits} credits.',
    creditsHint: 'Grab a pack to top up — it only takes a minute.',
    cancel: 'Cancel', buyCredits: 'Buy Credits →',
    modelTitle: 'Train Your AI Model First', modelBody: 'Before generating headshots, you need to train an AI model with your photos.', uploadPhotos: 'Upload Photos →',
    title: 'Review & Generate', subtitle: "Everything looks good? Let's create your headshots.",
    selectedStyles: 'Your Selected Styles', change: 'Change',
    eachGenerates: 'Each style generates {n} unique variations with different poses and expressions.',
    generatingFor: 'Generating for', generatingForDesc: 'Headshots will be created for this person.', changeLower: 'change',
    photoFormat: 'Photo Format', fmtPortrait: 'Portrait', fmtSquare: 'Square', fmtLandscape: 'Landscape',
    fmtPortraitDesc: 'LinkedIn, CV & dating apps', fmtSquareDesc: 'Instagram, X & WhatsApp', fmtLandscapeDesc: 'Website & iPad',
    genSettings: 'Generation Settings', aspectRatio: 'Aspect Ratio', variationsPerStyle: 'Variations per style', quality: 'Quality', qualityValue: 'High (35 steps)', format: 'Format',
    stylesSelected: 'Styles selected', totalHeadshots: 'Total headshots', photos: '{total} photos', creditsNeeded: 'Credits needed', yourBalance: 'Your balance', creditsUnit: 'credits',
    back: '← Back', starting: 'Starting generation...', generateBtn: 'Generate {total} Headshots', genFailed: 'Generation failed. Please try again.',
  },
  nl: {
    loading: 'Laden...', creditsTitle: 'Je hebt meer credits nodig',
    creditsBody: 'Je koos {styles} stijlen × {n} = {total} headshots maar hebt maar {credits} credits.',
    creditsHint: 'Koop een pakket om bij te vullen — het duurt maar een minuutje.',
    cancel: 'Annuleren', buyCredits: 'Credits kopen →',
    modelTitle: 'Train eerst je AI-model', modelBody: 'Voordat je headshots kunt genereren, moet je een AI-model trainen met je foto’s.', uploadPhotos: 'Foto’s uploaden →',
    title: 'Controleren & genereren', subtitle: 'Ziet alles er goed uit? Laten we je headshots maken.',
    selectedStyles: 'Je gekozen stijlen', change: 'Wijzigen',
    eachGenerates: 'Elke stijl genereert {n} unieke variaties met verschillende poses en expressies.',
    generatingFor: 'Genereren voor', generatingForDesc: 'De headshots worden voor deze persoon gemaakt.', changeLower: 'wijzigen',
    photoFormat: 'Fotoformaat', fmtPortrait: 'Portret', fmtSquare: 'Vierkant', fmtLandscape: 'Liggend',
    fmtPortraitDesc: 'LinkedIn, cv & dating-apps', fmtSquareDesc: 'Instagram, X & WhatsApp', fmtLandscapeDesc: 'Website & iPad',
    genSettings: 'Generatie-instellingen', aspectRatio: 'Beeldverhouding', variationsPerStyle: 'Variaties per stijl', quality: 'Kwaliteit', qualityValue: 'Hoog (35 stappen)', format: 'Formaat',
    stylesSelected: 'Gekozen stijlen', totalHeadshots: 'Totaal headshots', photos: '{total} foto’s', creditsNeeded: 'Credits nodig', yourBalance: 'Je saldo', creditsUnit: 'credits',
    back: '← Terug', starting: 'Generatie starten...', generateBtn: 'Genereer {total} headshots', genFailed: 'Genereren mislukt. Probeer het opnieuw.',
  },
  fr: {
    loading: 'Chargement...', creditsTitle: 'Il vous faut plus de crédits',
    creditsBody: 'Vous avez choisi {styles} styles × {n} = {total} portraits mais vous n’avez que {credits} crédits.',
    creditsHint: 'Prenez un pack pour recharger — ça ne prend qu’une minute.',
    cancel: 'Annuler', buyCredits: 'Acheter des crédits →',
    modelTitle: 'Entraînez d’abord votre modèle IA', modelBody: 'Avant de générer des portraits, vous devez entraîner un modèle IA avec vos photos.', uploadPhotos: 'Télécharger des photos →',
    title: 'Vérifier & générer', subtitle: 'Tout est bon ? Créons vos portraits.',
    selectedStyles: 'Vos styles sélectionnés', change: 'Modifier',
    eachGenerates: 'Chaque style génère {n} variations uniques avec différentes poses et expressions.',
    generatingFor: 'Génération pour', generatingForDesc: 'Les portraits seront créés pour cette personne.', changeLower: 'modifier',
    photoFormat: 'Format photo', fmtPortrait: 'Portrait', fmtSquare: 'Carré', fmtLandscape: 'Paysage',
    fmtPortraitDesc: 'LinkedIn, CV & apps de rencontre', fmtSquareDesc: 'Instagram, X & WhatsApp', fmtLandscapeDesc: 'Site web & iPad',
    genSettings: 'Paramètres de génération', aspectRatio: 'Format d’image', variationsPerStyle: 'Variations par style', quality: 'Qualité', qualityValue: 'Élevée (35 étapes)', format: 'Format',
    stylesSelected: 'Styles sélectionnés', totalHeadshots: 'Portraits au total', photos: '{total} photos', creditsNeeded: 'Crédits nécessaires', yourBalance: 'Votre solde', creditsUnit: 'crédits',
    back: '← Retour', starting: 'Démarrage de la génération...', generateBtn: 'Générer {total} portraits', genFailed: 'Échec de la génération. Veuillez réessayer.',
  },
  de: {
    loading: 'Laden...', creditsTitle: 'Du brauchst mehr Credits',
    creditsBody: 'Du hast {styles} Stile × {n} = {total} Headshots gewählt, hast aber nur {credits} Credits.',
    creditsHint: 'Hol dir ein Paket zum Aufladen — dauert nur eine Minute.',
    cancel: 'Abbrechen', buyCredits: 'Credits kaufen →',
    modelTitle: 'Trainiere zuerst dein KI-Modell', modelBody: 'Bevor du Headshots generierst, musst du ein KI-Modell mit deinen Fotos trainieren.', uploadPhotos: 'Fotos hochladen →',
    title: 'Prüfen & generieren', subtitle: 'Sieht alles gut aus? Lass uns deine Headshots erstellen.',
    selectedStyles: 'Deine ausgewählten Stile', change: 'Ändern',
    eachGenerates: 'Jeder Stil erzeugt {n} einzigartige Varianten mit verschiedenen Posen und Ausdrücken.',
    generatingFor: 'Generieren für', generatingForDesc: 'Die Headshots werden für diese Person erstellt.', changeLower: 'ändern',
    photoFormat: 'Fotoformat', fmtPortrait: 'Hochformat', fmtSquare: 'Quadrat', fmtLandscape: 'Querformat',
    fmtPortraitDesc: 'LinkedIn, Lebenslauf & Dating-Apps', fmtSquareDesc: 'Instagram, X & WhatsApp', fmtLandscapeDesc: 'Website & iPad',
    genSettings: 'Generierungseinstellungen', aspectRatio: 'Seitenverhältnis', variationsPerStyle: 'Varianten pro Stil', quality: 'Qualität', qualityValue: 'Hoch (35 Schritte)', format: 'Format',
    stylesSelected: 'Ausgewählte Stile', totalHeadshots: 'Headshots gesamt', photos: '{total} Fotos', creditsNeeded: 'Benötigte Credits', yourBalance: 'Dein Guthaben', creditsUnit: 'Credits',
    back: '← Zurück', starting: 'Generierung wird gestartet...', generateBtn: '{total} Headshots generieren', genFailed: 'Generierung fehlgeschlagen. Bitte versuche es erneut.',
  },
  es: {
    loading: 'Cargando...', creditsTitle: 'Necesitas más créditos',
    creditsBody: 'Elegiste {styles} estilos × {n} = {total} retratos pero solo tienes {credits} créditos.',
    creditsHint: 'Consigue un paquete para recargar — solo toma un minuto.',
    cancel: 'Cancelar', buyCredits: 'Comprar créditos →',
    modelTitle: 'Entrena primero tu modelo de IA', modelBody: 'Antes de generar retratos, necesitas entrenar un modelo de IA con tus fotos.', uploadPhotos: 'Subir fotos →',
    title: 'Revisar y generar', subtitle: '¿Todo bien? Vamos a crear tus retratos.',
    selectedStyles: 'Tus estilos seleccionados', change: 'Cambiar',
    eachGenerates: 'Cada estilo genera {n} variaciones únicas con diferentes poses y expresiones.',
    generatingFor: 'Generando para', generatingForDesc: 'Los retratos se crearán para esta persona.', changeLower: 'cambiar',
    photoFormat: 'Formato de foto', fmtPortrait: 'Vertical', fmtSquare: 'Cuadrado', fmtLandscape: 'Horizontal',
    fmtPortraitDesc: 'LinkedIn, CV y apps de citas', fmtSquareDesc: 'Instagram, X y WhatsApp', fmtLandscapeDesc: 'Web e iPad',
    genSettings: 'Ajustes de generación', aspectRatio: 'Relación de aspecto', variationsPerStyle: 'Variaciones por estilo', quality: 'Calidad', qualityValue: 'Alta (35 pasos)', format: 'Formato',
    stylesSelected: 'Estilos seleccionados', totalHeadshots: 'Retratos totales', photos: '{total} fotos', creditsNeeded: 'Créditos necesarios', yourBalance: 'Tu saldo', creditsUnit: 'créditos',
    back: '← Atrás', starting: 'Iniciando generación...', generateBtn: 'Generar {total} retratos', genFailed: 'La generación falló. Inténtalo de nuevo.',
  },
  it: {
    loading: 'Caricamento...', creditsTitle: 'Ti servono più crediti',
    creditsBody: 'Hai scelto {styles} stili × {n} = {total} ritratti ma hai solo {credits} crediti.',
    creditsHint: 'Prendi un pacchetto per ricaricare — ci vuole solo un minuto.',
    cancel: 'Annulla', buyCredits: 'Acquista crediti →',
    modelTitle: 'Allena prima il tuo modello AI', modelBody: 'Prima di generare i ritratti, devi allenare un modello AI con le tue foto.', uploadPhotos: 'Carica foto →',
    title: 'Rivedi e genera', subtitle: 'Tutto a posto? Creiamo i tuoi ritratti.',
    selectedStyles: 'I tuoi stili selezionati', change: 'Modifica',
    eachGenerates: 'Ogni stile genera {n} variazioni uniche con pose ed espressioni diverse.',
    generatingFor: 'Generazione per', generatingForDesc: 'I ritratti verranno creati per questa persona.', changeLower: 'modifica',
    photoFormat: 'Formato foto', fmtPortrait: 'Verticale', fmtSquare: 'Quadrato', fmtLandscape: 'Orizzontale',
    fmtPortraitDesc: 'LinkedIn, CV e app di incontri', fmtSquareDesc: 'Instagram, X e WhatsApp', fmtLandscapeDesc: 'Sito web e iPad',
    genSettings: 'Impostazioni di generazione', aspectRatio: 'Proporzioni', variationsPerStyle: 'Variazioni per stile', quality: 'Qualità', qualityValue: 'Alta (35 passaggi)', format: 'Formato',
    stylesSelected: 'Stili selezionati', totalHeadshots: 'Ritratti totali', photos: '{total} foto', creditsNeeded: 'Crediti necessari', yourBalance: 'Il tuo saldo', creditsUnit: 'crediti',
    back: '← Indietro', starting: 'Avvio della generazione...', generateBtn: 'Genera {total} ritratti', genFailed: 'Generazione fallita. Riprova.',
  },
  pt: {
    loading: 'Carregando...', creditsTitle: 'Precisa de mais créditos',
    creditsBody: 'Escolheu {styles} estilos × {n} = {total} retratos mas só tem {credits} créditos.',
    creditsHint: 'Adquira um pacote para recarregar — leva apenas um minuto.',
    cancel: 'Cancelar', buyCredits: 'Comprar créditos →',
    modelTitle: 'Treine primeiro o seu modelo de IA', modelBody: 'Antes de gerar retratos, precisa de treinar um modelo de IA com as suas fotos.', uploadPhotos: 'Carregar fotos →',
    title: 'Rever e gerar', subtitle: 'Está tudo bem? Vamos criar os seus retratos.',
    selectedStyles: 'Os seus estilos selecionados', change: 'Alterar',
    eachGenerates: 'Cada estilo gera {n} variações únicas com diferentes poses e expressões.',
    generatingFor: 'A gerar para', generatingForDesc: 'Os retratos serão criados para esta pessoa.', changeLower: 'alterar',
    photoFormat: 'Formato de foto', fmtPortrait: 'Retrato', fmtSquare: 'Quadrado', fmtLandscape: 'Paisagem',
    fmtPortraitDesc: 'LinkedIn, CV e apps de encontros', fmtSquareDesc: 'Instagram, X e WhatsApp', fmtLandscapeDesc: 'Site e iPad',
    genSettings: 'Definições de geração', aspectRatio: 'Proporção', variationsPerStyle: 'Variações por estilo', quality: 'Qualidade', qualityValue: 'Alta (35 passos)', format: 'Formato',
    stylesSelected: 'Estilos selecionados', totalHeadshots: 'Retratos no total', photos: '{total} fotos', creditsNeeded: 'Créditos necessários', yourBalance: 'O seu saldo', creditsUnit: 'créditos',
    back: '← Voltar', starting: 'A iniciar a geração...', generateBtn: 'Gerar {total} retratos', genFailed: 'A geração falhou. Tente novamente.',
  },
}
