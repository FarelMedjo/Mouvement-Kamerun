import { useEffect, useState } from 'react'
import { listerScrutateurs, listerBenevoles } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement } from './ui'

// Liste des scrutateurs et des bénévoles, avec leurs détails.
export default function ComptesPanel() {
  const [onglet, setOnglet] = useState('scrutateurs')
  const [scrutateurs, setScrutateurs] = useState([])
  const [benevoles, setBenevoles] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    Promise.all([listerScrutateurs(), listerBenevoles()])
      .then(([s, b]) => {
        if (!actif) return
        setScrutateurs(s)
        setBenevoles(b)
      })
      .catch((e) => actif && setErreur(e?.message || 'Échec du chargement.'))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [])

  const liste = onglet === 'scrutateurs' ? scrutateurs : benevoles

  return (
    <div>
      <PanelHeader
        titre="Comptes"
        sousTitre="Scrutateurs et bénévoles inscrits, avec leurs détails."
        actions={
          <div className="inline-flex rounded-md border border-[#d7dce3] p-1">
            {[
              ['scrutateurs', `Scrutateurs (${scrutateurs.length})`],
              ['benevoles', `Bénévoles (${benevoles.length})`],
            ].map(([cle, lbl]) => (
              <button
                key={cle}
                type="button"
                onClick={() => setOnglet(cle)}
                className={`rounded px-3 py-[6px] font-sans text-[13px] font-bold ${
                  onglet === cle ? 'bg-kgreen text-white' : 'text-kink'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        }
      />

      <Carte>
        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : liste.length === 0 ? (
          <EtatVide>Aucun {onglet === 'scrutateurs' ? 'scrutateur' : 'bénévole'} inscrit.</EtatVide>
        ) : onglet === 'scrutateurs' ? (
          <TableScrutateurs lignes={scrutateurs} />
        ) : (
          <TableBenevoles lignes={benevoles} />
        )}
      </Carte>
    </div>
  )
}

function Cellule({ children, className = '' }) {
  return <div className={`font-sans text-[14px] text-kink ${className}`}>{children || '—'}</div>
}

function TableScrutateurs({ lignes }) {
  return (
    <>
      <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
        <span className="w-[180px] flex-none">Nom</span>
        <span className="w-[130px] flex-none">Téléphone</span>
        <span className="flex-1">Localisation</span>
        <span className="w-[140px] flex-none">Bureau</span>
        <span className="w-[120px] flex-none">Inscrit le</span>
      </div>
      {lignes.map((l) => {
        const d = l.details
        const loc = [d?.region, d?.departement, d?.arrondissement].filter(Boolean).join(' · ')
        return (
          <div
            key={l.user_id}
            className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
          >
            <Cellule className="w-[180px] flex-none basis-full font-semibold text-knavy md:basis-auto">
              {l.profil?.nom_complet}
            </Cellule>
            <Cellule className="w-[130px] flex-none">{l.profil?.telephone}</Cellule>
            <Cellule className="flex-1">{loc}</Cellule>
            <Cellule className="w-[140px] flex-none">{d?.bureau_vote}</Cellule>
            <Cellule className="w-[120px] flex-none text-kfaint">{formatDateLongue(l.inscrit_le)}</Cellule>
          </div>
        )
      })}
    </>
  )
}

function TableBenevoles({ lignes }) {
  return (
    <>
      <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
        <span className="w-[180px] flex-none">Nom</span>
        <span className="w-[130px] flex-none">Téléphone</span>
        <span className="w-[120px] flex-none">Zone</span>
        <span className="flex-1">Secteurs</span>
        <span className="w-[120px] flex-none">Inscrit le</span>
      </div>
      {lignes.map((l) => {
        const d = l.details
        const secteurs = Array.isArray(d?.secteurs) ? d.secteurs.join(', ') : ''
        return (
          <div
            key={l.user_id}
            className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
          >
            <Cellule className="w-[180px] flex-none basis-full font-semibold text-knavy md:basis-auto">
              {l.profil?.nom_complet}
            </Cellule>
            <Cellule className="w-[130px] flex-none">{l.profil?.telephone}</Cellule>
            <Cellule className="w-[120px] flex-none">{d?.zone}</Cellule>
            <Cellule className="flex-1">{secteurs}</Cellule>
            <Cellule className="w-[120px] flex-none text-kfaint">{formatDateLongue(l.inscrit_le)}</Cellule>
          </div>
        )
      })}
    </>
  )
}
