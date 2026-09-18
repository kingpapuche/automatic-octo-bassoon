import type { Locale } from '@/lib/i18n'

// UI-teksten voor de stijl-picker (/create en /create/styles).
// Tokens: {n}=variaties per stijl, {credits}, {maxStyles}, {total}, {label}, {count}
export interface PickerCopy {
  loading: string
  onbTitle: string
  onbBody: string        // {n}
  onbStyle: string
  onbPhotos: string
  onbQuota: string       // {credits} {maxStyles} {total}
  onbCta: string
  title: string
  subtitle: string
  eqStyle: string
  eqPhotos: string
  bannerNote: string     // {n}
  yourPlan: string
  planValue: string      // {credits} {maxStyles}
  youllReceive: string
  receiveValue: string   // {total}
  needCredits: string
  buyCredits: string
  catStyles: string      // {n}
  selected: string       // {n}
  selectAll: string
  deselectAll: string
  popular: string
  barStyles: string
  barPerStyle: string
  barTotal: string
  back: string
  cont: string
  tAdd: string           // {label} {n}
  tRemove: string        // {label} {n}
  tAddMulti: string      // {count} {n}
  tRemoveMulti: string   // {count} {n}
  // Voortgangsbalk (CreateProgressBar)
  navDashboard: string
  navGallery: string
  credits: string
  step1: string
  step2: string
  step3: string
}

export const PICKER: Record<Locale, PickerCopy> = {
  en: {
    loading: 'Loading...', onbTitle: 'How It Works',
    onbBody: 'Pick the looks you want. Each style gives you {n} unique photos with different poses, angles & lighting.',
    onbStyle: 'Style', onbPhotos: 'Photos',
    onbQuota: 'You have {credits} credits = up to {maxStyles} styles = {total} total headshots',
    onbCta: "Got it, let's go →",
    title: 'Choose Your Styles', subtitle: 'Pick the looks you want for your headshots',
    eqStyle: 'style', eqPhotos: 'unique photos',
    bannerNote: 'Each style you pick generates {n} different variations with unique poses, angles & lighting',
    yourPlan: 'Your plan', planValue: '{credits} credits = up to {maxStyles} styles',
    youllReceive: "You'll receive", receiveValue: '{total} total headshots',
    needCredits: '⚠️ You need credits to generate headshots', buyCredits: 'Buy Credits →',
    catStyles: '{n} styles', selected: '{n} selected', selectAll: 'Select All', deselectAll: '✓ Deselect All', popular: 'Popular',
    barStyles: 'Styles', barPerStyle: 'Per style', barTotal: 'Total headshots', back: '← Back', cont: 'Continue →',
    tAdd: 'Added {label} — +{n} photos', tRemove: 'Removed {label} — −{n} photos',
    tAddMulti: 'Added {count} styles — +{n} photos', tRemoveMulti: 'Removed {count} styles — −{n} photos',
    navDashboard: 'Dashboard', navGallery: 'Gallery', credits: 'credits', step1: 'Order Details', step2: 'Select Styles', step3: 'Generate',
  },
  nl: {
    loading: 'Laden...', onbTitle: 'Hoe het werkt',
    onbBody: 'Kies de looks die je wilt. Elke stijl geeft je {n} unieke foto’s met verschillende poses, hoeken & belichting.',
    onbStyle: 'Stijl', onbPhotos: 'Foto’s',
    onbQuota: 'Je hebt {credits} credits = tot {maxStyles} stijlen = {total} headshots in totaal',
    onbCta: 'Begrepen, we gaan →',
    title: 'Kies je stijlen', subtitle: 'Kies de looks die je wilt voor je headshots',
    eqStyle: 'stijl', eqPhotos: 'unieke foto’s',
    bannerNote: 'Elke stijl die je kiest genereert {n} verschillende variaties met unieke poses, hoeken & belichting',
    yourPlan: 'Jouw plan', planValue: '{credits} credits = tot {maxStyles} stijlen',
    youllReceive: 'Je ontvangt', receiveValue: '{total} headshots in totaal',
    needCredits: '⚠️ Je hebt credits nodig om headshots te genereren', buyCredits: 'Credits kopen →',
    catStyles: '{n} stijlen', selected: '{n} geselecteerd', selectAll: 'Alles selecteren', deselectAll: '✓ Alles deselecteren', popular: 'Populair',
    barStyles: 'Stijlen', barPerStyle: 'Per stijl', barTotal: 'Totaal headshots', back: '← Terug', cont: 'Doorgaan →',
    tAdd: '{label} toegevoegd — +{n} foto’s', tRemove: '{label} verwijderd — −{n} foto’s',
    tAddMulti: '{count} stijlen toegevoegd — +{n} foto’s', tRemoveMulti: '{count} stijlen verwijderd — −{n} foto’s',
    navDashboard: 'Dashboard', navGallery: 'Gallerij', credits: 'credits', step1: 'Bestelgegevens', step2: 'Stijlen kiezen', step3: 'Genereren',
  },
  fr: {
    loading: 'Chargement...', onbTitle: 'Comment ça marche',
    onbBody: 'Choisissez les looks que vous voulez. Chaque style vous donne {n} photos uniques avec différentes poses, angles et éclairages.',
    onbStyle: 'Style', onbPhotos: 'Photos',
    onbQuota: 'Vous avez {credits} crédits = jusqu’à {maxStyles} styles = {total} portraits au total',
    onbCta: 'Compris, c’est parti →',
    title: 'Choisissez vos styles', subtitle: 'Choisissez les looks que vous voulez pour vos portraits',
    eqStyle: 'style', eqPhotos: 'photos uniques',
    bannerNote: 'Chaque style choisi génère {n} variations différentes avec des poses, angles et éclairages uniques',
    yourPlan: 'Votre formule', planValue: '{credits} crédits = jusqu’à {maxStyles} styles',
    youllReceive: 'Vous recevrez', receiveValue: '{total} portraits au total',
    needCredits: '⚠️ Il vous faut des crédits pour générer des portraits', buyCredits: 'Acheter des crédits →',
    catStyles: '{n} styles', selected: '{n} sélectionné(s)', selectAll: 'Tout sélectionner', deselectAll: '✓ Tout désélectionner', popular: 'Populaire',
    barStyles: 'Styles', barPerStyle: 'Par style', barTotal: 'Portraits au total', back: '← Retour', cont: 'Continuer →',
    tAdd: '{label} ajouté — +{n} photos', tRemove: '{label} retiré — −{n} photos',
    tAddMulti: '{count} styles ajoutés — +{n} photos', tRemoveMulti: '{count} styles retirés — −{n} photos',
    navDashboard: 'Tableau de bord', navGallery: 'Galerie', credits: 'crédits', step1: 'Détails de la commande', step2: 'Choisir les styles', step3: 'Générer',
  },
  de: {
    loading: 'Laden...', onbTitle: 'So funktioniert’s',
    onbBody: 'Wähle die Looks, die du willst. Jeder Stil liefert dir {n} einzigartige Fotos mit verschiedenen Posen, Winkeln und Licht.',
    onbStyle: 'Stil', onbPhotos: 'Fotos',
    onbQuota: 'Du hast {credits} Credits = bis zu {maxStyles} Stile = {total} Headshots insgesamt',
    onbCta: 'Verstanden, los geht’s →',
    title: 'Wähle deine Stile', subtitle: 'Wähle die Looks, die du für deine Headshots willst',
    eqStyle: 'Stil', eqPhotos: 'einzigartige Fotos',
    bannerNote: 'Jeder gewählte Stil erzeugt {n} verschiedene Varianten mit einzigartigen Posen, Winkeln und Licht',
    yourPlan: 'Dein Plan', planValue: '{credits} Credits = bis zu {maxStyles} Stile',
    youllReceive: 'Du erhältst', receiveValue: '{total} Headshots insgesamt',
    needCredits: '⚠️ Du brauchst Credits, um Headshots zu generieren', buyCredits: 'Credits kaufen →',
    catStyles: '{n} Stile', selected: '{n} ausgewählt', selectAll: 'Alle auswählen', deselectAll: '✓ Auswahl aufheben', popular: 'Beliebt',
    barStyles: 'Stile', barPerStyle: 'Pro Stil', barTotal: 'Headshots gesamt', back: '← Zurück', cont: 'Weiter →',
    tAdd: '{label} hinzugefügt — +{n} Fotos', tRemove: '{label} entfernt — −{n} Fotos',
    tAddMulti: '{count} Stile hinzugefügt — +{n} Fotos', tRemoveMulti: '{count} Stile entfernt — −{n} Fotos',
    navDashboard: 'Dashboard', navGallery: 'Galerie', credits: 'Credits', step1: 'Bestelldetails', step2: 'Stile wählen', step3: 'Generieren',
  },
  es: {
    loading: 'Cargando...', onbTitle: 'Cómo funciona',
    onbBody: 'Elige los looks que quieras. Cada estilo te da {n} fotos únicas con diferentes poses, ángulos e iluminación.',
    onbStyle: 'Estilo', onbPhotos: 'Fotos',
    onbQuota: 'Tienes {credits} créditos = hasta {maxStyles} estilos = {total} retratos en total',
    onbCta: 'Entendido, ¡vamos! →',
    title: 'Elige tus estilos', subtitle: 'Elige los looks que quieras para tus retratos',
    eqStyle: 'estilo', eqPhotos: 'fotos únicas',
    bannerNote: 'Cada estilo que elijas genera {n} variaciones distintas con poses, ángulos e iluminación únicos',
    yourPlan: 'Tu plan', planValue: '{credits} créditos = hasta {maxStyles} estilos',
    youllReceive: 'Recibirás', receiveValue: '{total} retratos en total',
    needCredits: '⚠️ Necesitas créditos para generar retratos', buyCredits: 'Comprar créditos →',
    catStyles: '{n} estilos', selected: '{n} seleccionados', selectAll: 'Seleccionar todo', deselectAll: '✓ Deseleccionar todo', popular: 'Popular',
    barStyles: 'Estilos', barPerStyle: 'Por estilo', barTotal: 'Retratos totales', back: '← Atrás', cont: 'Continuar →',
    tAdd: '{label} añadido — +{n} fotos', tRemove: '{label} eliminado — −{n} fotos',
    tAddMulti: '{count} estilos añadidos — +{n} fotos', tRemoveMulti: '{count} estilos eliminados — −{n} fotos',
    navDashboard: 'Panel', navGallery: 'Galería', credits: 'créditos', step1: 'Detalles del pedido', step2: 'Elegir estilos', step3: 'Generar',
  },
  it: {
    loading: 'Caricamento...', onbTitle: 'Come funziona',
    onbBody: 'Scegli i look che vuoi. Ogni stile ti dà {n} foto uniche con pose, angolazioni e luci diverse.',
    onbStyle: 'Stile', onbPhotos: 'Foto',
    onbQuota: 'Hai {credits} crediti = fino a {maxStyles} stili = {total} ritratti in totale',
    onbCta: 'Capito, andiamo →',
    title: 'Scegli i tuoi stili', subtitle: 'Scegli i look che vuoi per i tuoi ritratti',
    eqStyle: 'stile', eqPhotos: 'foto uniche',
    bannerNote: 'Ogni stile scelto genera {n} variazioni diverse con pose, angolazioni e luci uniche',
    yourPlan: 'Il tuo piano', planValue: '{credits} crediti = fino a {maxStyles} stili',
    youllReceive: 'Riceverai', receiveValue: '{total} ritratti in totale',
    needCredits: '⚠️ Ti servono crediti per generare i ritratti', buyCredits: 'Acquista crediti →',
    catStyles: '{n} stili', selected: '{n} selezionati', selectAll: 'Seleziona tutto', deselectAll: '✓ Deseleziona tutto', popular: 'Popolare',
    barStyles: 'Stili', barPerStyle: 'Per stile', barTotal: 'Ritratti totali', back: '← Indietro', cont: 'Continua →',
    tAdd: '{label} aggiunto — +{n} foto', tRemove: '{label} rimosso — −{n} foto',
    tAddMulti: '{count} stili aggiunti — +{n} foto', tRemoveMulti: '{count} stili rimossi — −{n} foto',
    navDashboard: 'Dashboard', navGallery: 'Galleria', credits: 'crediti', step1: 'Dettagli ordine', step2: 'Scegli gli stili', step3: 'Genera',
  },
  pt: {
    loading: 'Carregando...', onbTitle: 'Como funciona',
    onbBody: 'Escolha os looks que quiser. Cada estilo dá-lhe {n} fotos únicas com diferentes poses, ângulos e iluminação.',
    onbStyle: 'Estilo', onbPhotos: 'Fotos',
    onbQuota: 'Tem {credits} créditos = até {maxStyles} estilos = {total} retratos no total',
    onbCta: 'Entendido, vamos →',
    title: 'Escolha os seus estilos', subtitle: 'Escolha os looks que quiser para os seus retratos',
    eqStyle: 'estilo', eqPhotos: 'fotos únicas',
    bannerNote: 'Cada estilo que escolher gera {n} variações diferentes com poses, ângulos e iluminação únicos',
    yourPlan: 'O seu plano', planValue: '{credits} créditos = até {maxStyles} estilos',
    youllReceive: 'Vai receber', receiveValue: '{total} retratos no total',
    needCredits: '⚠️ Precisa de créditos para gerar retratos', buyCredits: 'Comprar créditos →',
    catStyles: '{n} estilos', selected: '{n} selecionados', selectAll: 'Selecionar tudo', deselectAll: '✓ Desmarcar tudo', popular: 'Popular',
    barStyles: 'Estilos', barPerStyle: 'Por estilo', barTotal: 'Retratos no total', back: '← Voltar', cont: 'Continuar →',
    tAdd: '{label} adicionado — +{n} fotos', tRemove: '{label} removido — −{n} fotos',
    tAddMulti: '{count} estilos adicionados — +{n} fotos', tRemoveMulti: '{count} estilos removidos — −{n} fotos',
    navDashboard: 'Painel', navGallery: 'Galeria', credits: 'créditos', step1: 'Detalhes do pedido', step2: 'Escolher estilos', step3: 'Gerar',
  },
}
