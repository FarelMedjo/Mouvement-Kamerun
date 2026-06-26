import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

// Affichée lorsqu'un utilisateur connecté tente d'accéder à un espace qui
// n'est pas le sien.
export default function AccesRefuse() {
  const { dashboardPath } = useAuth()
  return (
    <section className="flex justify-center bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(56px,8vw,96px)]">
      <div className="max-w-[520px] text-center">
        <span className="font-sans text-[13px] font-bold uppercase tracking-[0.16em] text-kred">
          Accès refusé
        </span>
        <h1 className="mt-3 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-[1.05] text-knavy">
          Vous n'avez pas accès à cet espace
        </h1>
        <p className="mt-4 font-sans text-[16px] leading-[1.6] text-kink">
          Cet espace est réservé à un autre profil d'utilisateur. Si vous pensez qu'il
          s'agit d'une erreur, contactez un administrateur.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to={dashboardPath}
            className="rounded-md bg-kgreen px-6 py-[14px] font-sans text-[15px] font-bold text-white no-underline"
          >
            Mon espace
          </Link>
          <Link
            to="/"
            className="rounded-md border border-[#d7dce3] bg-white px-6 py-[14px] font-sans text-[15px] font-bold text-knavy no-underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </section>
  )
}
