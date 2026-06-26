import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

// Barre utilitaire fine (fond marine) au-dessus de l'en-tête.
//  - Déconnecté : accès aux espaces (connexion / inscription).
//  - Connecté   : « Mon espace » + bouton de déconnexion.
// Le sélecteur FR/EN reste non fonctionnel à ce stade (prévu ultérieurement).
export default function UtilityBar() {
  const { isAuthenticated, user, signOut } = useAuth()
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
      {isAuthenticated ? (
        <>
          <span className="hidden text-kmuted sm:inline" title={user?.email}>
            {user?.email}
          </span>
          <Link to="/espace" className="text-kgold no-underline">
            Mon espace
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="text-[#cfd6e4] no-underline hover:text-white"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link to="/scrutateurs" className="text-kgold no-underline">
            Espace Scrutateurs
          </Link>
          <Link to="/benevoles" className="text-[#cfd6e4] no-underline">
            Espace Bénévoles
          </Link>
        </>
      )}

      <span className="opacity-40">|</span>
      <a href="#" className="text-white no-underline" aria-current="true">
        FR
      </a>
      <a href="#" className="text-kfaint no-underline">
        EN
      </a>
    </div>
  )
}
