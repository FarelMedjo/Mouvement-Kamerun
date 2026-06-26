// Utilitaires de date (français).

const MOIS_COURTS = [
  'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
  'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
]

// Date longue : « 19 juillet 2025 ».
export function formatDateLongue(value) {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

// Découpe pour la pastille de date d'un événement : { jour: '12', mois: 'Sept. 2026' }.
export function partsDate(value) {
  if (!value) return { jour: '—', mois: '' }
  const d = new Date(value)
  return {
    jour: String(d.getDate()).padStart(2, '0'),
    mois: `${MOIS_COURTS[d.getMonth()]} ${d.getFullYear()}`,
  }
}
