// Utilitaires de date (FR / EN).

const MOIS_COURTS = {
  fr: [
    'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
  ],
  en: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ],
}

const LOCALE = { fr: 'fr-FR', en: 'en-GB' }

// Date longue : « 19 juillet 2025 » / "19 July 2025".
export function formatDateLongue(value, lang = 'fr') {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat(LOCALE[lang] ?? LOCALE.fr, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

// Découpe pour la pastille de date d'un événement : { jour: '12', mois: 'Sept. 2026' }.
export function partsDate(value, lang = 'fr') {
  if (!value) return { jour: '—', mois: '' }
  const d = new Date(value)
  const mois = MOIS_COURTS[lang] ?? MOIS_COURTS.fr
  return {
    jour: String(d.getDate()).padStart(2, '0'),
    mois: `${mois[d.getMonth()]} ${d.getFullYear()}`,
  }
}
