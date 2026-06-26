import { useEffect, useState } from 'react'
import { getStatistiques } from '../../../lib/admin'
import { PanelHeader, Carte } from './ui'
import { useT } from '../../../i18n/LanguageContext'

// Vue d'ensemble : chiffres clés de l'espace d'administration.
// Chaque carte renvoie vers le panneau correspondant.
export default function ApercuPanel({ onNaviguer }) {
  const t = useT()
  const [stats, setStats] = useState(null)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    getStatistiques()
      .then((s) => actif && setStats(s))
      .catch((e) => actif && setErreur(e?.message || t('Échec du chargement.', 'Loading failed.')))
    return () => {
      actif = false
    }
  }, [t])

  const cartes = [
    { cle: 'fichiers', libelle: t('Fichiers reçus', 'Files received'), valeur: stats?.fichiers, vers: 'fichiers', accent: 'text-kgreen' },
    { cle: 'scrutateurs', libelle: t('Scrutateurs', 'Poll watchers'), valeur: stats?.scrutateurs, vers: 'comptes', accent: 'text-knavy' },
    { cle: 'benevoles', libelle: t('Bénévoles', 'Volunteers'), valeur: stats?.benevoles, vers: 'comptes', accent: 'text-knavy' },
    {
      cle: 'affiliations',
      libelle: t('Affiliations en attente', 'Pending memberships'),
      valeur: stats?.affiliationsEnAttente,
      vers: 'affiliations',
      accent: 'text-kred',
    },
    { cle: 'newsletter', libelle: t('Inscrits newsletter', 'Newsletter subscribers'), valeur: stats?.newsletter, vers: 'newsletter', accent: 'text-[#b58f00]' },
  ]

  return (
    <div>
      <PanelHeader titre={t("Vue d'ensemble", 'Overview')} sousTitre={t("Aperçu de l'activité du mouvement.", 'Overview of the movement’s activity.')} />
      {erreur && <p className="mb-4 font-sans text-[14px] text-kred">{erreur}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cartes.map((c) => (
          <button key={c.cle} type="button" onClick={() => onNaviguer(c.vers)} className="text-left">
            <Carte className="h-full p-5 transition-shadow hover:shadow-[0_10px_34px_rgba(17,32,63,.12)]">
              <div className={`font-heading text-[40px] font-bold leading-none ${c.accent}`}>
                {c.valeur ?? '—'}
              </div>
              <div className="mt-2 font-sans text-[12px] font-bold uppercase tracking-[0.05em] leading-[1.3] text-kfaint">
                {c.libelle}
              </div>
              {/* libellé déjà traduit en amont */}
            </Carte>
          </button>
        ))}
      </div>
    </div>
  )
}
