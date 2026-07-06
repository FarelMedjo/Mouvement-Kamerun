// ----------------------------------------------------------------------------
// Données de configuration du site reprises des maquettes.
// Centralisées ici pour être réutilisées par l'en-tête et le pied de page.
// (Les adresses e-mail sont des valeurs à confirmer par le parti.)
// ----------------------------------------------------------------------------

export const SITE = {
  nom: 'Mouvement Kamerun',
  // Champs visibles bilingues ({ fr, en }), résolus à l'affichage via le helper i18n.
  slogan: { fr: 'Le nouveau départ', en: 'A new beginning' },
  description: {
    fr: 'Pour un Cameroun souverain, prospère et uni. Le nouveau départ.',
    en: 'For a sovereign, prosperous and united Cameroon. A new beginning.',
  },
  soutien: {
    fr: 'Soutenu par le Mouvement citoyen national camerounais (MCNC).',
    en: 'Supported by the Cameroonian National Citizens’ Movement (MCNC).',
  },
  emails: {
    // À remplacer par les adresses officielles confirmées.
    mouvement: 'contact@mouvement-kamerun.cm',
    gmail: 'mouvementkamerun@gmail.com',
  },
  telephones: ['+237 6 91 50 16 16', '+237 6 99 53 31 19'],
  reseaux: [
    { label: 'f', nom: 'Facebook', url: '#' },
    { label: 'X', nom: 'X (Twitter)', url: '#' },
    { label: 'in', nom: 'LinkedIn', url: '#' },
    { label: 'ig', nom: 'Instagram', url: '#' },
  ],
}

// Navigation principale (reprend exactement les maquettes).
// `label` est bilingue : { fr, en } résolu à l'affichage via le helper i18n.
export const NAV_PRINCIPALE = [
  { label: { fr: 'Accueil', en: 'Home' }, to: '/' },
  { label: { fr: 'À propos', en: 'About' }, to: '/a-propos' },
  { label: { fr: 'Le programme', en: 'Programme' }, to: '/le-programme' },
  { label: { fr: 'Actualités', en: 'News' }, to: '/actualites' },
  { label: { fr: 'Messages vidéo', en: 'Video messages' }, to: '/messages-video' },
  { label: { fr: 'Événements', en: 'Events' }, to: '/evenements' },
  { label: { fr: 'Ressources', en: 'Resources' }, to: '/ressources' },
]

// Régions du Cameroun (pays bilingue : noms officiels FR / EN) + « Diaspora ».
// Partagé par les formulaires d'adhésion et d'inscription. `label` bilingue.
export const REGIONS = [
  { fr: 'Adamaoua', en: 'Adamawa' },
  { fr: 'Centre', en: 'Centre' },
  { fr: 'Est', en: 'East' },
  { fr: 'Extrême-Nord', en: 'Far North' },
  { fr: 'Littoral', en: 'Littoral' },
  { fr: 'Nord', en: 'North' },
  { fr: 'Nord-Ouest', en: 'North-West' },
  { fr: 'Ouest', en: 'West' },
  { fr: 'Sud', en: 'South' },
  { fr: 'Sud-Ouest', en: 'South-West' },
  { fr: 'Diaspora', en: 'Diaspora' },
]

// Liens du pied de page « Liens rapides ».
export const NAV_FOOTER = [
  { label: { fr: 'Accueil', en: 'Home' }, to: '/' },
  { label: { fr: 'À propos', en: 'About' }, to: '/a-propos' },
  { label: { fr: 'Le programme', en: 'Programme' }, to: '/le-programme' },
  { label: { fr: 'Actualités', en: 'News' }, to: '/actualites' },
  { label: { fr: 'Faire un don', en: 'Donate' }, to: '/faire-un-don' },
]
