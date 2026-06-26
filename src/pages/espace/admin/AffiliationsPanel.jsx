import { useEffect, useMemo, useState } from 'react'
import { listerAffiliations, mettreAJourStatutAffiliation } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement, BadgeStatut } from './ui'

const FILTRES = [
  ['', 'Toutes'],
  ['en_attente', 'En attente'],
  ['validee', 'Validées'],
  ['rejetee', 'Rejetées'],
]

// Demandes d'affiliation : consultation et validation/rejet (statut en base).
export default function AffiliationsPanel() {
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [filtre, setFiltre] = useState('')
  const [enCours, setEnCours] = useState(null) // id en cours de mise à jour

  useEffect(() => {
    let actif = true
    listerAffiliations()
      .then((d) => actif && setDemandes(d))
      .catch((e) => actif && setErreur(e?.message || 'Échec du chargement.'))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [])

  const visibles = useMemo(
    () => (filtre ? demandes.filter((d) => d.statut === filtre) : demandes),
    [demandes, filtre]
  )

  const changerStatut = async (id, statut) => {
    setEnCours(id)
    try {
      await mettreAJourStatutAffiliation(id, statut)
      setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)))
    } catch (e) {
      alert(e?.message || 'Échec de la mise à jour.')
    } finally {
      setEnCours(null)
    }
  }

  return (
    <div>
      <PanelHeader
        titre="Demandes d'affiliation"
        sousTitre="Consultez et validez ou rejetez les demandes reçues."
        actions={
          <div className="inline-flex rounded-md border border-[#d7dce3] p-1">
            {FILTRES.map(([cle, lbl]) => (
              <button
                key={cle}
                type="button"
                onClick={() => setFiltre(cle)}
                className={`rounded px-3 py-[6px] font-sans text-[13px] font-bold ${
                  filtre === cle ? 'bg-kgreen text-white' : 'text-kink'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        }
      />

      <Carte>
        <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
          <span className="w-[200px] flex-none">Demandeur</span>
          <span className="flex-1">Coordonnées</span>
          <span className="w-[120px] flex-none">Zone</span>
          <span className="w-[100px] flex-none">Reçue le</span>
          <span className="w-[110px] flex-none">Statut</span>
          <span className="w-[180px] flex-none text-right">Action</span>
        </div>

        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : visibles.length === 0 ? (
          <EtatVide>Aucune demande {filtre ? 'dans cette catégorie' : 'reçue pour le moment'}.</EtatVide>
        ) : (
          visibles.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
            >
              <div className="w-[200px] flex-none basis-full font-sans text-[15px] font-semibold text-knavy md:basis-auto">
                {[d.prenom, d.nom].filter(Boolean).join(' ') || '—'}
              </div>
              <div className="min-w-0 flex-1 font-sans text-[13px] leading-[1.4] text-kink">
                {d.email && <div className="truncate">{d.email}</div>}
                {d.telephone && <div className="text-kfaint">{d.telephone}</div>}
                {!d.email && !d.telephone && '—'}
              </div>
              <div className="w-[120px] flex-none font-sans text-[14px] text-kink">{d.zone || '—'}</div>
              <div className="w-[100px] flex-none font-sans text-[13px] text-kfaint">
                {formatDateLongue(d.created_at)}
              </div>
              <div className="w-[110px] flex-none">
                <BadgeStatut statut={d.statut} />
              </div>
              <div className="w-[180px] flex-none text-right">
                {d.statut === 'en_attente' ? (
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      disabled={enCours === d.id}
                      onClick={() => changerStatut(d.id, 'validee')}
                      className="rounded-md bg-kgreen px-3 py-[7px] font-sans text-[13px] font-bold text-white disabled:opacity-50"
                    >
                      Valider
                    </button>
                    <button
                      type="button"
                      disabled={enCours === d.id}
                      onClick={() => changerStatut(d.id, 'rejetee')}
                      className="rounded-md border border-kred px-3 py-[7px] font-sans text-[13px] font-bold text-kred disabled:opacity-50"
                    >
                      Rejeter
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={enCours === d.id}
                    onClick={() => changerStatut(d.id, 'en_attente')}
                    className="font-sans text-[13px] font-bold text-kfaint hover:text-knavy disabled:opacity-50"
                  >
                    Remettre en attente
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </Carte>
    </div>
  )
}
