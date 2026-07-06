import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useLang } from '../../i18n/LanguageContext'

// Barre utilitaire fine (fond marine) au-dessus de l'en-tête.
//  - Déconnecté : uniquement le sélecteur de langue (les accès aux espaces
//    « Espace Scrutateurs / Bénévoles » sont désormais dans le menu principal).
//  - Connecté   : e-mail + bouton de déconnexion (« Mon espace » est dans le menu).
//  - Sélecteur FR/EN : bascule la langue de tout le site (contexte i18n).
export default function UtilityBar() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { lang, setLang, t } = useLang()
  const navigate = useNavigate()

  const onSignOut = async () => {
    try {
      await signOut()
    } finally {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 bg-knavy px-[clamp(16px,5vw,44px)] py-[9px] font-sans text-[12px] font-semibold leading-none tracking-[0.03em] text-[#cfd6e4]">
      {isAuthenticated && (
        <>
          <span className="hidden text-kmuted sm:inline" title={user?.email}>
            {user?.email}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="text-[#cfd6e4] no-underline hover:text-white"
          >
            {t('Déconnexion', 'Sign out')}
          </button>
          <span className="opacity-40">|</span>
        </>
      )}

      <button
        type="button"
        onClick={() => setLang('fr')}
        aria-current={lang === 'fr' ? 'true' : undefined}
        className={lang === 'fr' ? 'text-white no-underline' : 'text-kfaint no-underline hover:text-white'}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-current={lang === 'en' ? 'true' : undefined}
        className={lang === 'en' ? 'text-white no-underline' : 'text-kfaint no-underline hover:text-white'}
      >
        EN
      </button>
    </div>
  )
}
