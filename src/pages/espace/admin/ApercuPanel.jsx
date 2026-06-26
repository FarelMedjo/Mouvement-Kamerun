import { useEffect, useState } from 'react'
import { getStatistiques } from '../../../lib/admin'
import { PanelHeader, Carte } from './ui'

// Vue d'ensemble : chiffres clés de l'espace d'administration.
// Chaque carte renvoie vers le panneau correspondant.
export default function ApercuPanel({ onNaviguer }) {
  const [stats, setStats] = useState(null)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    getStatistiques()
      .then((s) => actif && setStats(s))
      .catch((e) => actif && setErreur(e?.message || 'Échec du chargement.'))
    return () => {
      actif = false
    }
  }, [])

  const cartes = [
    { cle: 'fichiers', libelle: 'Fichiers reçus', valeur: stats?.fichiers, vers: 'fichiers', accent: 'text-kgreen' },
    { cle: 'scrutateurs', libelle: 'Scrutateurs', valeur: stats?.scrutateurs, vers: 'comptes', accent: 'text-knavy' },
    { cle: 'benevoles', libelle: 'Bénévoles', valeur: stats?.benevoles, vers: 'comptes', accent: 'text-knavy' },
    {
      cle: 'affiliations',
      libelle: 'Affiliations en attente',
      valeur: stats?.affiliationsEnAttente,
      vers: 'affiliations',
      accent: 'text-kred',
    },
    { cle: 'newsletter', libelle: 'Inscrits newsletter', valeur: stats?.newsletter, vers: 'newsletter', accent: 'text-[#b58f00]' },
  ]

  return (
    <div>
      <PanelHeader titre="Vue d'ensemble" sousTitre="Aperçu de l'activité du mouvement." />
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
            </Carte>
          </button>
        ))}
      </div>
    </div>
  )
}
