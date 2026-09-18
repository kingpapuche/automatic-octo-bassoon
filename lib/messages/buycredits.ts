import type { Locale } from '@/lib/i18n'

interface BuyCopy {
  navCreate: string; navGallery: string; credits: string
  chooseYourPack: string; subtitle: string; variationsNote: string
  mostPopular: string; processing: string; purchase: string; oneTimeNoSub: string
  bizLabel: string; bizDesc: string
  securePayment: string; ssl: string; guaranteeBadge: string; instant: string
  alertFailed: string; alertWrong: string
}

const en: BuyCopy = {
  navCreate: 'Create', navGallery: 'Gallery', credits: 'credits',
  chooseYourPack: 'Choose Your Pack', subtitle: 'One-time payment. No subscription. Generate professional AI headshots in minutes.', variationsNote: 'Every style gives you 4 variations — so you can pick the one you like best.',
  mostPopular: 'Most Popular', processing: 'Processing...', purchase: 'Purchase', oneTimeNoSub: 'One-time payment • No subscription',
  bizLabel: 'I am buying as a business (I need an invoice)', bizDesc: 'You’ll enter your VAT number and billing address securely at checkout. Belgian businesses receive a Peppol e-invoice; other businesses receive a standard invoice — both automatically.',
  securePayment: 'Secure payment powered by Stripe', ssl: 'SSL Encrypted', guaranteeBadge: 'Profile-Worthy Guarantee', instant: 'Instant Delivery',
  alertFailed: 'Failed to create checkout session', alertWrong: 'Something went wrong. Please try again.',
}

const nl: BuyCopy = {
  navCreate: 'Aanmaken', navGallery: 'Gallerij', credits: 'credits',
  chooseYourPack: 'Kies je pakket', subtitle: 'Eenmalige betaling. Geen abonnement. Professionele AI-headshots in minuten.', variationsNote: 'Elke stijl geeft je 4 variaties — zo kies je degene die je het mooist vindt.',
  mostPopular: 'Meest gekozen', processing: 'Bezig...', purchase: 'Kopen', oneTimeNoSub: 'Eenmalige betaling • Geen abonnement',
  bizLabel: 'Ik koop als bedrijf (ik heb een factuur nodig)', bizDesc: 'Je vult je btw-nummer en factuuradres veilig in bij het afrekenen. Belgische bedrijven krijgen een Peppol-e-factuur; andere bedrijven een standaardfactuur — allebei automatisch.',
  securePayment: 'Veilig betalen via Stripe', ssl: 'SSL-versleuteld', guaranteeBadge: 'Profielwaardig-garantie', instant: 'Directe levering',
  alertFailed: 'Kon de afrekensessie niet aanmaken', alertWrong: 'Er ging iets mis. Probeer opnieuw.',
}

const fr: BuyCopy = {
  navCreate: 'Créer', navGallery: 'Galerie', credits: 'crédits',
  chooseYourPack: 'Choisissez votre pack', subtitle: 'Paiement unique. Sans abonnement. Des portraits IA professionnels en quelques minutes.', variationsNote: 'Chaque style vous donne 4 variations — vous choisissez celle que vous préférez.',
  mostPopular: 'Le plus choisi', processing: 'Traitement...', purchase: 'Acheter', oneTimeNoSub: 'Paiement unique • Sans abonnement',
  bizLabel: 'J’achète en tant qu’entreprise (j’ai besoin d’une facture)', bizDesc: 'Vous saisirez votre numéro de TVA et votre adresse de facturation en toute sécurité au paiement. Les entreprises belges reçoivent une e-facture Peppol ; les autres une facture standard — automatiquement.',
  securePayment: 'Paiement sécurisé via Stripe', ssl: 'Chiffré SSL', guaranteeBadge: 'Garantie photo de profil', instant: 'Livraison instantanée',
  alertFailed: 'Échec de la création de la session de paiement', alertWrong: 'Une erreur s’est produite. Réessayez.',
}

const de: BuyCopy = {
  navCreate: 'Erstellen', navGallery: 'Galerie', credits: 'Credits',
  chooseYourPack: 'Wähle dein Paket', subtitle: 'Einmalzahlung. Kein Abo. Professionelle KI-Headshots in Minuten.', variationsNote: 'Jeder Stil gibt dir 4 Varianten — so wählst du die, die dir am besten gefällt.',
  mostPopular: 'Am beliebtesten', processing: 'Wird verarbeitet...', purchase: 'Kaufen', oneTimeNoSub: 'Einmalzahlung • Kein Abo',
  bizLabel: 'Ich kaufe als Unternehmen (ich brauche eine Rechnung)', bizDesc: 'Du gibst deine USt-IdNr. und Rechnungsadresse sicher beim Checkout ein. Belgische Unternehmen erhalten eine Peppol-E-Rechnung; andere eine Standardrechnung — automatisch.',
  securePayment: 'Sichere Zahlung via Stripe', ssl: 'SSL-verschlüsselt', guaranteeBadge: 'Profilwürdig-Garantie', instant: 'Sofortige Lieferung',
  alertFailed: 'Checkout-Sitzung konnte nicht erstellt werden', alertWrong: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
}

const es: BuyCopy = {
  navCreate: 'Crear', navGallery: 'Galería', credits: 'créditos',
  chooseYourPack: 'Elige tu pack', subtitle: 'Pago único. Sin suscripción. Retratos IA profesionales en minutos.', variationsNote: 'Cada estilo te da 4 variaciones — así eliges la que más te guste.',
  mostPopular: 'El más elegido', processing: 'Procesando...', purchase: 'Comprar', oneTimeNoSub: 'Pago único • Sin suscripción',
  bizLabel: 'Compro como empresa (necesito factura)', bizDesc: 'Introducirás tu número de IVA y dirección de facturación de forma segura al pagar. Las empresas belgas reciben una e-factura Peppol; las demás una factura estándar — automáticamente.',
  securePayment: 'Pago seguro con Stripe', ssl: 'Cifrado SSL', guaranteeBadge: 'Garantía apta para perfil', instant: 'Entrega instantánea',
  alertFailed: 'No se pudo crear la sesión de pago', alertWrong: 'Algo salió mal. Inténtalo de nuevo.',
}

const it: BuyCopy = {
  navCreate: 'Crea', navGallery: 'Galleria', credits: 'crediti',
  chooseYourPack: 'Scegli il tuo pacchetto', subtitle: 'Pagamento unico. Nessun abbonamento. Ritratti IA professionali in pochi minuti.', variationsNote: 'Ogni stile ti dà 4 variazioni — così scegli quella che preferisci.',
  mostPopular: 'Il più scelto', processing: 'Elaborazione...', purchase: 'Acquista', oneTimeNoSub: 'Pagamento unico • Nessun abbonamento',
  bizLabel: 'Acquisto come azienda (mi serve una fattura)', bizDesc: 'Inserirai la tua partita IVA e l’indirizzo di fatturazione in modo sicuro al checkout. Le aziende belghe ricevono una e-fattura Peppol; le altre una fattura standard — automaticamente.',
  securePayment: 'Pagamento sicuro tramite Stripe', ssl: 'Crittografia SSL', guaranteeBadge: 'Garanzia foto profilo', instant: 'Consegna immediata',
  alertFailed: 'Impossibile creare la sessione di pagamento', alertWrong: 'Qualcosa è andato storto. Riprova.',
}

const pt: BuyCopy = {
  navCreate: 'Criar', navGallery: 'Galeria', credits: 'créditos',
  chooseYourPack: 'Escolha seu pacote', subtitle: 'Pagamento único. Sem assinatura. Retratos IA profissionais em minutos.', variationsNote: 'Cada estilo dá 4 variações — assim você escolhe a que mais gosta.',
  mostPopular: 'Mais escolhido', processing: 'Processando...', purchase: 'Comprar', oneTimeNoSub: 'Pagamento único • Sem assinatura',
  bizLabel: 'Estou comprando como empresa (preciso de nota fiscal)', bizDesc: 'Você informará seu número de IVA e endereço de cobrança com segurança no checkout. Empresas belgas recebem uma e-fatura Peppol; as demais uma fatura padrão — automaticamente.',
  securePayment: 'Pagamento seguro via Stripe', ssl: 'Criptografia SSL', guaranteeBadge: 'Garantia digna de perfil', instant: 'Entrega instantânea',
  alertFailed: 'Não foi possível criar a sessão de pagamento', alertWrong: 'Algo deu errado. Tente novamente.',
}

export const BUYCREDITS: Record<Locale, BuyCopy> = { en, nl, fr, de, es, it, pt }
