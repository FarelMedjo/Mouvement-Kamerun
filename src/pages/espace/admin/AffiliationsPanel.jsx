import { useEffect, useMemo, useState } from 'react'
import { listerAffiliations, mettreAJourStatutAffiliation } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement, BadgeStatut } from './ui'
import { useLang } from '../../../i18n/LanguageContext'

// `[valeur, label]` — label bilingue ({ fr, en }).
const FILTRES = [
  ['', { fr: 'Toutes', en: 'All' }],
  ['en_attente', { fr: 'En attente', en: 'Pending' }],
  ['validee', { fr: 'Validées', en: 'Approved' }],
  ['rejetee', { fr: 'Rejetées', en: 'Rejected' }],
]

// Demandes d'affiliation : consultation et validation/rejet (statut en base).
export default function AffiliationsPanel() {
  const { lang, t } = useLang()
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [filtre, setFiltre] = useState('')
  const [enCours, setEnCours] = useState(null) // id en cours de mise à jour

  useEffect(() => {
    let actif = true
    listerAffiliations()
      .then((d) => actif && setDemandes(d))
      .catch((e) => actif && setErreur(e?.message || t('Échec du chargement.', 'Loading failed.')))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [t])

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
      alert(e?.message || t('Échec de la mise à jour.', 'Update failed.'))
    } finally {
      setEnCours(null)
    }
  }

  return (
    <div>
      <PanelHeader
        titre={t("Demandes d'affiliation", 'Membership requests')}
        sousTitre={t('Consultez et validez ou rejetez les demandes reçues.', 'Review and approve or reject the requests received.')}
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
                {t(lbl)}
              </button>
            ))}
          </div>
        }
      />

      <Carte>
        <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
          <span className="w-[200px] flex-none">{t('Demandeur', 'Applicant')}</span>
          <span className="flex-1">{t('Coordonnées', 'Contact details')}</span>
          <span className="w-[120px] flex-none">{t('Zone', 'Zone')}</span>
          <span className="w-[100px] flex-none">{t('Reçue le', 'Received on')}</span>
          <span className="w-[110px] flex-none">{t('Statut', 'Status')}</span>
          <span className="w-[180px] flex-none text-right">{t('Action', 'Action')}</span>
        </div>

        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : visibles.length === 0 ? (
          <EtatVide>
            {filtre
              ? t('Aucune demande dans cette catégorie.', 'No request in this category.')
              : t('Aucune demande reçue pour le moment.', 'No request received yet.')}
          </EtatVide>
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
                {formatDateLongue(d.created_at, lang)}
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
                      {t('Valider', 'Approve')}
                    </button>
                    <button
                      type="button"
                      disabled={enCours === d.id}
                      onClick={() => changerStatut(d.id, 'rejetee')}
                      className="rounded-md border border-kred px-3 py-[7px] font-sans text-[13px] font-bold text-kred disabled:opacity-50"
                    >
                      {t('Rejeter', 'Reject')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={enCours === d.id}
                    onClick={() => changerStatut(d.id, 'en_attente')}
                    className="font-sans text-[13px] font-bold text-kfaint hover:text-knavy disabled:opacity-50"
                  >
                    {t('Remettre en attente', 'Reset to pending')}
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
