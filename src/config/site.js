// ----------------------------------------------------------------------------
// Données de configuration du site reprises des maquettes.
// Centralisées ici pour être réutilisées par l'en-tête et le pied de page.
// (Les adresses e-mail sont des valeurs à confirmer par le parti.)
// ----------------------------------------------------------------------------

export const SITE = {
  nom: 'Mouvement Kamerun',
  slogan: 'Le nouveau départ',
  description: 'Pour un Cameroun souverain, prospère et uni. Le nouveau départ.',
  soutien: 'Soutenu par le Mouvement citoyen national camerounais (MCNC).',
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
export const NAV_PRINCIPALE = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Le programme', to: '/le-programme' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Événements', to: '/evenements' },
  { label: 'Ressources', to: '/ressources' },
]

// Liens du pied de page « Liens rapides ».
export const NAV_FOOTER = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Le programme', to: '/le-programme' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Faire un don', to: '/faire-un-don' },
]
