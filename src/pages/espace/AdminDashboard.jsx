import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useT } from '../../i18n/LanguageContext'
import ApercuPanel from './admin/ApercuPanel'
import FichiersPanel from './admin/FichiersPanel'
import ComptesPanel from './admin/ComptesPanel'
import AffiliationsPanel from './admin/AffiliationsPanel'
import ContenusPanel from './admin/ContenusPanel'
import NewsletterPanel from './admin/NewsletterPanel'

// ----------------------------------------------------------------------------
// Espace Administrateur — réservé au rôle 'admin' (vérifié en base par la RLS ;
// la route est en outre protégée par <ProtectedRoute role="admin">).
//
// Six fonctions, une par onglet :
//   1. Vue d'ensemble (chiffres clés)
//   2. Réception centralisée des fichiers (filtres bureau / date / type)
//   3. Comptes : scrutateurs et bénévoles
//   4. Demandes d'affiliation (validation / rejet)
//   5. Contenus publics : actualités et événements
//   6. Newsletter (consultation + export CSV)
// ----------------------------------------------------------------------------

// Libellés d'onglets bilingues ({ fr, en }).
const ONGLETS = [
  ['apercu', { fr: "Vue d'ensemble", en: 'Overview' }],
  ['fichiers', { fr: 'Fichiers', en: 'Files' }],
  ['comptes', { fr: 'Comptes', en: 'Accounts' }],
  ['affiliations', { fr: 'Affiliations', en: 'Memberships' }],
  ['contenus', { fr: 'Contenus', en: 'Content' }],
  ['newsletter', { fr: 'Newsletter', en: 'Newsletter' }],
]

export default function AdminDashboard() {
  const t = useT()
  const { user } = useAuth()
  const [onglet, setOnglet] = useState('apercu')

  return (
    <>
      {/* Bandeau d'accueil */}
      <div className="bg-knavy px-[clamp(16px,5vw,40px)] py-[clamp(22px,3vw,30px)]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-kgold">
              {t('Espace réservé', 'Restricted area')}
            </span>
            <h1 className="m-0 mt-1 font-heading text-[clamp(26px,4vw,38px)] font-bold uppercase leading-none text-white">
              {t('Administration', 'Administration')}
            </h1>
          </div>
          <div className="font-sans text-[13px] text-kmuted">
            {t('Connecté :', 'Signed in:')} <span className="font-semibold text-white">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Barre d'onglets */}
      <div className="sticky top-0 z-30 border-b border-kline bg-white">
        <div className="mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-[clamp(16px,5vw,40px)]">
          {ONGLETS.map(([cle, lbl]) => (
            <button
              key={cle}
              type="button"
              onClick={() => setOnglet(cle)}
              className={`whitespace-nowrap border-b-[3px] px-4 py-[14px] font-sans text-[14px] font-bold leading-none transition-colors ${
                onglet === cle
                  ? 'border-kgreen text-kgreen'
                  : 'border-transparent text-kink hover:text-kgreen'
              }`}
            >
              {t(lbl)}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-klight px-[clamp(16px,5vw,40px)] py-[clamp(28px,4vw,44px)]">
        <div className="mx-auto max-w-[1180px]">
          {onglet === 'apercu' && <ApercuPanel onNaviguer={setOnglet} />}
          {onglet === 'fichiers' && <FichiersPanel />}
          {onglet === 'comptes' && <ComptesPanel />}
          {onglet === 'affiliations' && <AffiliationsPanel />}
          {onglet === 'contenus' && <ContenusPanel />}
          {onglet === 'newsletter' && <NewsletterPanel />}
        </div>
      </section>
    </>
  )
}
