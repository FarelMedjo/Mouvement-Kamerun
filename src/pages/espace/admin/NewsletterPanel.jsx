import { useEffect, useState } from 'react'
import { listerNewsletter, exporterCsv } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement } from './ui'

// Inscrits à la newsletter : consultation et export CSV.
export default function NewsletterPanel() {
  const [inscrits, setInscrits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    listerNewsletter()
      .then((d) => actif && setInscrits(d))
      .catch((e) => actif && setErreur(e?.message || 'Échec du chargement.'))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [])

  const exporter = () => {
    const date = new Date().toISOString().slice(0, 10)
    exporterCsv(
      `newsletter-${date}.csv`,
      [
        { cle: 'email', libelle: 'Email' },
        { cle: 'nom', libelle: 'Nom' },
        { cle: 'created_at', libelle: 'Inscrit le' },
      ],
      inscrits.map((i) => ({ ...i, created_at: formatDateLongue(i.created_at) }))
    )
  }

  return (
    <div>
      <PanelHeader
        titre="Newsletter"
        sousTitre="Personnes inscrites à la lettre d'information."
        actions={
          <button
            type="button"
            onClick={exporter}
            disabled={inscrits.length === 0}
            className="rounded-md bg-knavy px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-40"
          >
            Exporter en CSV
          </button>
        }
      />

      <Carte>
        <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
          <span className="flex-1">Email</span>
          <span className="w-[200px] flex-none">Nom</span>
          <span className="w-[140px] flex-none">Inscrit le</span>
        </div>

        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : inscrits.length === 0 ? (
          <EtatVide>Aucun inscrit pour le moment.</EtatVide>
        ) : (
          inscrits.map((i) => (
            <div
              key={i.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
            >
              <div className="min-w-0 flex-1 truncate font-sans text-[15px] font-semibold text-knavy">
                {i.email}
              </div>
              <div className="w-[200px] flex-none font-sans text-[14px] text-kink">{i.nom || '—'}</div>
              <div className="w-[140px] flex-none font-sans text-[13px] text-kfaint">
                {formatDateLongue(i.created_at)}
              </div>
            </div>
          ))
        )}
      </Carte>

      {!chargement && !erreur && (
        <p className="mt-3 font-sans text-[12px] text-kfaint">
          {inscrits.length} inscrit{inscrits.length > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  )
}
