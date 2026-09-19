import type { Locale } from '@/lib/i18n'

// Gelokaliseerde SEO title-tags + meta-descriptions per taal (per pagina).
// Titels van kindpagina's krijgen automatisch " | Nova Imago" via het title-template.
export interface PageMeta { title: string; description: string }
export interface SeoBundle {
  home: PageMeta
  styles: PageMeta
  buyCredits: PageMeta
  about: PageMeta
  terms: PageMeta
  privacy: PageMeta
  refund: PageMeta
  cookie: PageMeta
  ogTagline: string
  ogSub: string
}

export const SEO_META: Record<Locale, SeoBundle> = {
  en: {
    home: { title: 'Nova Imago — Professional AI Headshots in Minutes', description: 'Turn a few selfies into studio-quality professional headshots with AI. 45+ styles for LinkedIn, your CV and social profiles — ready in about 30 minutes, with a money-back guarantee.' },
    styles: { title: 'Browse Every AI Headshot Style', description: 'Browse 45+ professional AI headshot styles — corporate, smart-casual, outdoor, creative and more. Pick your favourites and get studio-quality headshots from a few selfies.' },
    buyCredits: { title: 'Pricing & Packages', description: 'Simple one-time pricing for AI headshots — no subscription. Pick a pack, upload a few selfies and get studio-quality headshots in about 30 minutes, with a money-back guarantee.' },
    about: { title: 'About', description: 'Nova Imago turns everyday selfies into professional headshots with AI — studio quality in minutes, without the studio. Learn who we are and what we promise.' },
    terms: { title: 'Terms of Service', description: 'The terms of service for using Nova Imago’s AI headshot service.' },
    privacy: { title: 'Privacy Policy', description: 'How Nova Imago collects, uses and protects your personal data and photos (GDPR-compliant).' },
    refund: { title: 'Refund Policy', description: 'Our profile-worthy guarantee: at least one usable headshot in every order, or your money back.' },
    cookie: { title: 'Cookie Policy', description: 'Nova Imago uses only essential cookies — no advertising or tracking cookies.' },
    ogTagline: 'Professional AI headshots in minutes', ogSub: 'Upload a few selfies · 45+ styles · money-back guarantee',
  },
  nl: {
    home: { title: 'Nova Imago — Professionele AI-headshots in minuten', description: 'Zet een paar selfies om in professionele headshots van studiokwaliteit met AI. 45+ stijlen voor LinkedIn, je cv en socials — klaar in ~30 minuten, met niet-goed-geld-terug-garantie.' },
    styles: { title: 'Alle AI-headshot-stijlen bekijken', description: 'Ontdek 45+ professionele AI-headshot-stijlen — zakelijk, smart-casual, outdoor, creatief en meer. Kies je favorieten en krijg headshots van studiokwaliteit uit een paar selfies.' },
    buyCredits: { title: 'Prijzen & pakketten', description: 'Eenvoudige eenmalige prijzen voor AI-headshots — geen abonnement. Kies een pakket, upload een paar selfies en krijg headshots van studiokwaliteit in ~30 minuten, met geld-terug-garantie.' },
    about: { title: 'Over ons', description: 'Nova Imago zet alledaagse selfies om in professionele headshots met AI — studiokwaliteit in minuten, zonder de studio. Ontdek wie we zijn en wat we beloven.' },
    terms: { title: 'Servicevoorwaarden', description: 'De servicevoorwaarden voor het gebruik van de AI-headshot-dienst van Nova Imago.' },
    privacy: { title: 'Privacybeleid', description: 'Hoe Nova Imago je persoonsgegevens en foto’s verzamelt, gebruikt en beschermt (AVG-conform).' },
    refund: { title: 'Terugbetalingsbeleid', description: 'Onze profielwaardige garantie: minstens één bruikbare headshot per bestelling, of je geld terug.' },
    cookie: { title: 'Cookiebeleid', description: 'Nova Imago gebruikt alleen essentiële cookies — geen advertentie- of trackingcookies.' },
    ogTagline: 'Professionele AI-headshots in minuten', ogSub: 'Upload een paar selfies · 45+ stijlen · geld terug',
  },
  fr: {
    home: { title: 'Nova Imago — Portraits professionnels par IA en minutes', description: 'Transformez quelques selfies en portraits professionnels de qualité studio grâce à l’IA. 45+ styles pour LinkedIn, votre CV et vos réseaux — prêts en ~30 minutes, satisfait ou remboursé.' },
    styles: { title: 'Tous les styles de portraits IA', description: 'Découvrez 45+ styles de portraits IA professionnels — corporate, smart-casual, extérieur, créatif et plus. Choisissez vos préférés et obtenez des portraits de qualité studio à partir de quelques selfies.' },
    buyCredits: { title: 'Tarifs & forfaits', description: 'Tarifs simples et uniques pour vos portraits IA — sans abonnement. Choisissez un forfait, envoyez quelques selfies et obtenez des portraits de qualité studio en ~30 minutes, satisfait ou remboursé.' },
    about: { title: 'À propos', description: 'Nova Imago transforme des selfies du quotidien en portraits professionnels grâce à l’IA — qualité studio en quelques minutes, sans le studio. Découvrez qui nous sommes.' },
    terms: { title: 'Conditions d’utilisation', description: 'Les conditions d’utilisation du service de portraits IA de Nova Imago.' },
    privacy: { title: 'Politique de confidentialité', description: 'Comment Nova Imago collecte, utilise et protège vos données personnelles et vos photos (conforme RGPD).' },
    refund: { title: 'Politique de remboursement', description: 'Notre garantie « digne d’un profil » : au moins un portrait utilisable par commande, ou remboursé.' },
    cookie: { title: 'Politique en matière de cookies', description: 'Nova Imago n’utilise que des cookies essentiels — aucun cookie publicitaire ou de suivi.' },
    ogTagline: 'Portraits professionnels par IA en minutes', ogSub: 'Quelques selfies · 45+ styles · satisfait ou remboursé',
  },
  de: {
    home: { title: 'Nova Imago — Professionelle KI-Headshots in Minuten', description: 'Verwandle ein paar Selfies mit KI in professionelle Headshots in Studioqualität. 45+ Stile für LinkedIn, Lebenslauf und Social Media — fertig in ~30 Minuten, mit Geld-zurück-Garantie.' },
    styles: { title: 'Alle KI-Headshot-Stile ansehen', description: 'Entdecke 45+ professionelle KI-Headshot-Stile — Business, Smart Casual, Outdoor, kreativ und mehr. Wähle deine Favoriten und erhalte Headshots in Studioqualität aus ein paar Selfies.' },
    buyCredits: { title: 'Preise & Pakete', description: 'Einfache Einmalpreise für KI-Headshots — kein Abo. Wähle ein Paket, lade ein paar Selfies hoch und erhalte Headshots in Studioqualität in ~30 Minuten, mit Geld-zurück-Garantie.' },
    about: { title: 'Über uns', description: 'Nova Imago verwandelt alltägliche Selfies mit KI in professionelle Headshots — Studioqualität in Minuten, ohne Studio. Erfahre, wer wir sind und was wir versprechen.' },
    terms: { title: 'Nutzungsbedingungen', description: 'Die Nutzungsbedingungen für den KI-Headshot-Dienst von Nova Imago.' },
    privacy: { title: 'Datenschutzerklärung', description: 'Wie Nova Imago deine personenbezogenen Daten und Fotos erhebt, nutzt und schützt (DSGVO-konform).' },
    refund: { title: 'Rückerstattungsrichtlinie', description: 'Unsere Profil-würdig-Garantie: mindestens ein brauchbarer Headshot pro Bestellung, oder Geld zurück.' },
    cookie: { title: 'Cookie-Richtlinie', description: 'Nova Imago verwendet nur essenzielle Cookies — keine Werbe- oder Tracking-Cookies.' },
    ogTagline: 'Professionelle KI-Headshots in Minuten', ogSub: 'Ein paar Selfies · 45+ Stile · Geld-zurück-Garantie',
  },
  es: {
    home: { title: 'Nova Imago — Retratos profesionales con IA en minutos', description: 'Convierte unos selfies en retratos profesionales de calidad de estudio con IA. 45+ estilos para LinkedIn, tu CV y redes — listos en ~30 minutos, con garantía de devolución.' },
    styles: { title: 'Todos los estilos de retrato IA', description: 'Explora 45+ estilos de retrato con IA profesionales — corporativo, smart-casual, exterior, creativo y más. Elige tus favoritos y consigue retratos de calidad de estudio con unos selfies.' },
    buyCredits: { title: 'Precios y paquetes', description: 'Precios simples de pago único para retratos con IA — sin suscripción. Elige un paquete, sube unos selfies y consigue retratos de calidad de estudio en ~30 minutos, con garantía de devolución.' },
    about: { title: 'Sobre nosotros', description: 'Nova Imago convierte selfies cotidianos en retratos profesionales con IA — calidad de estudio en minutos, sin estudio. Descubre quiénes somos y qué prometemos.' },
    terms: { title: 'Términos del servicio', description: 'Los términos del servicio para usar el servicio de retratos con IA de Nova Imago.' },
    privacy: { title: 'Política de privacidad', description: 'Cómo Nova Imago recopila, usa y protege tus datos personales y fotos (conforme al RGPD).' },
    refund: { title: 'Política de reembolso', description: 'Nuestra garantía «digno de un perfil»: al menos un retrato utilizable por pedido, o te devolvemos el dinero.' },
    cookie: { title: 'Política de cookies', description: 'Nova Imago usa solo cookies esenciales — sin cookies de publicidad ni de seguimiento.' },
    ogTagline: 'Retratos profesionales con IA en minutos', ogSub: 'Sube unos selfies · 45+ estilos · garantía de devolución',
  },
  it: {
    home: { title: 'Nova Imago — Ritratti professionali con IA in minuti', description: 'Trasforma qualche selfie in ritratti professionali di qualità da studio con l’IA. 45+ stili per LinkedIn, CV e social — pronti in ~30 minuti, soddisfatti o rimborsati.' },
    styles: { title: 'Tutti gli stili di ritratto IA', description: 'Scopri 45+ stili di ritratto AI professionali — corporate, smart-casual, outdoor, creativo e altro. Scegli i tuoi preferiti e ottieni ritratti di qualità da studio da qualche selfie.' },
    buyCredits: { title: 'Prezzi e pacchetti', description: 'Prezzi semplici e una tantum per i ritratti AI — nessun abbonamento. Scegli un pacchetto, carica qualche selfie e ottieni ritratti di qualità da studio in ~30 minuti, soddisfatti o rimborsati.' },
    about: { title: 'Chi siamo', description: 'Nova Imago trasforma i selfie di tutti i giorni in ritratti professionali con l’IA — qualità da studio in pochi minuti, senza studio. Scopri chi siamo.' },
    terms: { title: 'Termini di servizio', description: 'I termini di servizio per l’uso del servizio di ritratti AI di Nova Imago.' },
    privacy: { title: 'Informativa sulla privacy', description: 'Come Nova Imago raccoglie, usa e protegge i tuoi dati personali e le tue foto (conforme al GDPR).' },
    refund: { title: 'Politica di rimborso', description: 'La nostra garanzia «degno di un profilo»: almeno un ritratto utilizzabile per ordine, o rimborsati.' },
    cookie: { title: 'Politica sui cookie', description: 'Nova Imago utilizza solo cookie essenziali — nessun cookie pubblicitario o di tracciamento.' },
    ogTagline: 'Ritratti professionali con IA in minuti', ogSub: 'Qualche selfie · 45+ stili · soddisfatti o rimborsati',
  },
  pt: {
    home: { title: 'Nova Imago — Retratos profissionais com IA em minutos', description: 'Transforme algumas selfies em retratos profissionais com qualidade de estúdio usando IA. 45+ estilos para LinkedIn, CV e redes — prontos em ~30 minutos, com garantia de reembolso.' },
    styles: { title: 'Todos os estilos de retrato IA', description: 'Descubra 45+ estilos de retrato com IA profissionais — corporativo, smart-casual, ao ar livre, criativo e mais. Escolha os favoritos e obtenha retratos com qualidade de estúdio a partir de algumas selfies.' },
    buyCredits: { title: 'Preços e pacotes', description: 'Preços simples de pagamento único para retratos com IA — sem subscrição. Escolha um pacote, carregue algumas selfies e obtenha retratos com qualidade de estúdio em ~30 minutos, com garantia de reembolso.' },
    about: { title: 'Sobre nós', description: 'A Nova Imago transforma selfies do dia a dia em retratos profissionais com IA — qualidade de estúdio em minutos, sem estúdio. Conheça quem somos.' },
    terms: { title: 'Termos de serviço', description: 'Os termos de serviço para usar o serviço de retratos com IA da Nova Imago.' },
    privacy: { title: 'Política de privacidade', description: 'Como a Nova Imago recolhe, usa e protege os seus dados pessoais e fotos (conforme o RGPD).' },
    refund: { title: 'Política de reembolso', description: 'A nossa garantia «digno de um perfil»: pelo menos um retrato utilizável por encomenda, ou devolvemos o dinheiro.' },
    cookie: { title: 'Política de cookies', description: 'A Nova Imago usa apenas cookies essenciais — sem cookies de publicidade ou de rastreamento.' },
    ogTagline: 'Retratos profissionais com IA em minutos', ogSub: 'Algumas selfies · 45+ estilos · garantia de reembolso',
  },
}
