import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'

// ----------------------------------------------------------------------------
// Internationalisation (FR / EN) — implémentation légère, sans librairie.
//
// Choix d'architecture : traductions « inline » via un helper `t(fr, en)` plutôt
// qu'un dictionnaire de clés séparé. Chaque chaîne reste à côté de son markup, ce
// qui évite de désynchroniser des clés sur un site déjà volumineux.
//
//   const t = useT()
//   <h1>{t('Accueil', 'Home')}</h1>
//
// La langue est mémorisée dans `localStorage` et reflétée sur <html lang="…">.
// ----------------------------------------------------------------------------

const STORAGE_KEY = 'mk-lang'
export const LANGUES = ['fr', 'en']
const LANGUE_DEFAUT = 'fr'

const LanguageContext = createContext(null)

function langueInitiale() {
  if (typeof window === 'undefined') return LANGUE_DEFAUT
  const memo = window.localStorage.getItem(STORAGE_KEY)
  if (memo && LANGUES.includes(memo)) return memo
  // À défaut, on respecte la préférence du navigateur (anglais sinon français).
  const nav = window.navigator?.language?.slice(0, 2).toLowerCase()
  return nav === 'en' ? 'en' : LANGUE_DEFAUT
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(langueInitiale)

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = useCallback((next) => {
    if (LANGUES.includes(next)) setLangState(next)
  }, [])

  // Helper de traduction. Accepte `t('FR', 'EN')` ou `t({ fr, en })`.
  const t = useCallback(
    (fr, en) => {
      if (fr !== null && typeof fr === 'object') {
        return lang === 'en' ? fr.en ?? fr.fr : fr.fr
      }
      return lang === 'en' ? (en ?? fr) : fr
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Accès complet au contexte (langue courante + bascule).
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang doit être utilisé dans <LanguageProvider>')
  return ctx
}

// Raccourci quand seul le helper de traduction est nécessaire.
export function useT() {
  return useLang().t
}
