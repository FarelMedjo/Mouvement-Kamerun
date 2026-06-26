import { useAuth } from '../../auth/AuthContext'

// Gabarit d'espace personnel protégé. Confirme visuellement qui est connecté
// et avec quel(s) rôle(s) réel(s) — le contenu fonctionnel (téléversement,
// gestion…) sera construit aux étapes suivantes.
export default function EspacePlaceholder({ titre, intro, accent = 'kgreen' }) {
  const { user, roles } = useAuth()
  return (
    <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,72px)]">
      <div className="mx-auto max-w-site">
        <span className={`font-sans text-[13px] font-bold uppercase tracking-[0.16em] text-${accent}`}>
          Espace personnel
        </span>
        <h1 className="mt-3 font-heading text-[clamp(30px,5vw,46px)] font-bold uppercase leading-[1.05] text-knavy">
          {titre}
        </h1>
        {intro && (
          <p className="mt-4 max-w-[640px] font-sans text-[16px] leading-[1.6] text-kink">{intro}</p>
        )}

        <div className="mt-7 inline-block rounded-lg border border-[#e3e7ec] bg-white p-6 shadow-[0_6px_28px_rgba(17,32,63,.06)]">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-kfaint">
            Session active
          </div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-sans text-[15px]">
            <dt className="text-kfaint">Connecté en tant que</dt>
            <dd className="font-semibold text-knavy">{user?.email}</dd>
            <dt className="text-kfaint">Rôle(s) réel(s)</dt>
            <dd className="font-semibold text-knavy">
              {roles.length ? roles.join(', ') : '—'}
            </dd>
          </dl>
        </div>

        <p className="mt-6 font-sans text-[14px] text-kfaint">
          Contenu fonctionnel à construire à l'étape suivante.
        </p>
      </div>
    </section>
  )
}
