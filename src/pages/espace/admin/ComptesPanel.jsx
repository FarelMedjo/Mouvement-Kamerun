import { useEffect, useState } from 'react'
import { listerScrutateurs, listerBenevoles, listerMembres } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement } from './ui'
import { useLang } from '../../../i18n/LanguageContext'

// Liste des scrutateurs, des bénévoles et des membres, avec leurs détails.
export default function ComptesPanel() {
  const { lang, t } = useLang()
  const [onglet, setOnglet] = useState('scrutateurs')
  const [scrutateurs, setScrutateurs] = useState([])
  const [benevoles, setBenevoles] = useState([])
  const [membres, setMembres] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    Promise.all([listerScrutateurs(), listerBenevoles(), listerMembres()])
      .then(([s, b, m]) => {
        if (!actif) return
        setScrutateurs(s)
        setBenevoles(b)
        setMembres(m)
      })
      .catch((e) => actif && setErreur(e?.message || t('Échec du chargement.', 'Loading failed.')))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [t])

  const liste = onglet === 'scrutateurs' ? scrutateurs : onglet === 'benevoles' ? benevoles : membres

  return (
    <div>
      <PanelHeader
        titre={t('Comptes', 'Accounts')}
        sousTitre={t('Scrutateurs, bénévoles et membres inscrits, avec leurs détails.', 'Registered poll watchers, volunteers and members, with their details.')}
        actions={
          <div className="inline-flex rounded-md border border-[#d7dce3] p-1">
            {[
              ['scrutateurs', `${t('Scrutateurs', 'Poll watchers')} (${scrutateurs.length})`],
              ['benevoles', `${t('Bénévoles', 'Volunteers')} (${benevoles.length})`],
              ['membres', `${t('Membres', 'Members')} (${membres.length})`],
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
          <EtatVide>
            {onglet === 'scrutateurs'
              ? t('Aucun scrutateur inscrit.', 'No poll watcher registered.')
              : onglet === 'benevoles'
                ? t('Aucun bénévole inscrit.', 'No volunteer registered.')
                : t('Aucun membre inscrit.', 'No member registered.')}
          </EtatVide>
        ) : onglet === 'scrutateurs' ? (
          <TableScrutateurs lignes={scrutateurs} lang={lang} t={t} />
        ) : onglet === 'benevoles' ? (
          <TableBenevoles lignes={benevoles} lang={lang} t={t} />
        ) : (
          <TableMembres lignes={membres} lang={lang} t={t} />
        )}
      </Carte>
    </div>
  )
}

function Cellule({ children, className = '' }) {
  return <div className={`font-sans text-[14px] text-kink ${className}`}>{children || '—'}</div>
}

function TableScrutateurs({ lignes, lang, t }) {
  return (
    <>
      <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
        <span className="w-[180px] flex-none">{t('Nom', 'Name')}</span>
        <span className="w-[130px] flex-none">{t('Téléphone', 'Phone')}</span>
        <span className="flex-1">{t('Localisation', 'Location')}</span>
        <span className="w-[140px] flex-none">{t('Bureau', 'Station')}</span>
        <span className="w-[120px] flex-none">{t('Inscrit le', 'Registered on')}</span>
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
            <Cellule className="w-[120px] flex-none text-kfaint">{formatDateLongue(l.inscrit_le, lang)}</Cellule>
          </div>
        )
      })}
    </>
  )
}

function TableBenevoles({ lignes, lang, t }) {
  return (
    <>
      <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
        <span className="w-[180px] flex-none">{t('Nom', 'Name')}</span>
        <span className="w-[130px] flex-none">{t('Téléphone', 'Phone')}</span>
        <span className="w-[120px] flex-none">{t('Zone', 'Zone')}</span>
        <span className="flex-1">{t('Secteurs', 'Areas')}</span>
        <span className="w-[120px] flex-none">{t('Inscrit le', 'Registered on')}</span>
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
            <Cellule className="w-[120px] flex-none text-kfaint">{formatDateLongue(l.inscrit_le, lang)}</Cellule>
          </div>
        )
      })}
    </>
  )
}

function TableMembres({ lignes, lang, t }) {
  return (
    <>
      <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
        <span className="w-[220px] flex-none">{t('Nom', 'Name')}</span>
        <span className="w-[150px] flex-none">{t('Téléphone', 'Phone')}</span>
        <span className="flex-1">{t('Zone', 'Zone')}</span>
        <span className="w-[120px] flex-none">{t('Inscrit le', 'Registered on')}</span>
      </div>
      {lignes.map((l) => {
        const d = l.details
        return (
          <div
            key={l.user_id}
            className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
          >
            <Cellule className="w-[220px] flex-none basis-full font-semibold text-knavy md:basis-auto">
              {l.profil?.nom_complet}
            </Cellule>
            <Cellule className="w-[150px] flex-none">{l.profil?.telephone}</Cellule>
            <Cellule className="flex-1">{d?.zone}</Cellule>
            <Cellule className="w-[120px] flex-none text-kfaint">{formatDateLongue(l.inscrit_le, lang)}</Cellule>
          </div>
        )
      })}
    </>
  )
}
