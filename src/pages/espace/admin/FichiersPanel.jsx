import { useEffect, useMemo, useState } from 'react'
import { listerTousFichiers, urlSigneeFichier } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement, BadgeType, ChampSelect, Champ, formatTaille } from './ui'
import { useLang } from '../../../i18n/LanguageContext'

// `[valeur, label]` — label bilingue ({ fr, en }).
const TYPES = [
  ['', { fr: 'Tous les types', en: 'All types' }],
  ['pv', { fr: 'PV / Documents', en: 'Reports / Documents' }],
  ['image', { fr: 'Images', en: 'Images' }],
  ['audio', { fr: 'Audio', en: 'Audio' }],
  ['video', { fr: 'Vidéo', en: 'Video' }],
  ['autre', { fr: 'Autre', en: 'Other' }],
]

// Réception centralisée de TOUS les fichiers des scrutateurs, avec filtres par
// bureau de vote, par date et par type, et consultation/téléchargement.
export default function FichiersPanel() {
  const { lang, t } = useLang()
  const [fichiers, setFichiers] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  // Filtres
  const [fBureau, setFBureau] = useState('')
  const [fType, setFType] = useState('')
  const [fDate, setFDate] = useState('') // AAAA-MM-JJ

  useEffect(() => {
    let actif = true
    listerTousFichiers()
      .then((fs) => actif && setFichiers(fs))
      .catch((e) => actif && setErreur(e?.message || t('Échec du chargement.', 'Loading failed.')))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [t])

  // Liste des bureaux présents, pour le menu déroulant de filtre.
  const bureaux = useMemo(
    () => [...new Set(fichiers.map((f) => f.bureau).filter(Boolean))].sort(),
    [fichiers]
  )

  const fichiersFiltres = useMemo(() => {
    return fichiers.filter((f) => {
      if (fType && f.type !== fType) return false
      if (fBureau && f.bureau !== fBureau) return false
      if (fDate) {
        const jour = new Date(f.created_at).toLocaleDateString('en-CA') // AAAA-MM-JJ
        if (jour !== fDate) return false
      }
      return true
    })
  }, [fichiers, fType, fBureau, fDate])

  const telecharger = async (path) => {
    try {
      const url = await urlSigneeFichier(path)
      window.open(url, '_blank', 'noopener')
    } catch (e) {
      alert(e?.message || t('Impossible de générer le lien.', 'Unable to generate the link.'))
    }
  }

  const reinitialiser = () => {
    setFBureau('')
    setFType('')
    setFDate('')
  }
  const filtreActif = fBureau || fType || fDate

  return (
    <div>
      <PanelHeader
        titre={t('Réception des fichiers', 'File reception')}
        sousTitre={t('Tous les documents transmis par les scrutateurs, centralisés ici.', 'All documents sent by poll watchers, centralised here.')}
      />

      {/* Barre de filtres */}
      <Carte className="mb-5">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <ChampSelect label={t('Bureau de vote', 'Polling station')} value={fBureau} onChange={(e) => setFBureau(e.target.value)}>
            <option value="">{t('Tous les bureaux', 'All stations')}</option>
            {bureaux.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </ChampSelect>
          <ChampSelect label={t('Type', 'Type')} value={fType} onChange={(e) => setFType(e.target.value)}>
            {TYPES.map(([v, l]) => (
              <option key={v} value={v}>
                {t(l)}
              </option>
            ))}
          </ChampSelect>
          <Champ label={t('Date', 'Date')} type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} />
          <div className="flex items-end">
            <button
              type="button"
              onClick={reinitialiser}
              disabled={!filtreActif}
              className="w-full rounded-md border border-[#d7dce3] px-3 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-40"
            >
              {t('Réinitialiser', 'Reset')}
            </button>
          </div>
        </div>
      </Carte>

      <Carte>
        {/* En-tête de tableau (masqué sur mobile) */}
        <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
          <span className="flex-1">{t('Fichier', 'File')}</span>
          <span className="w-[160px] flex-none">{t('Scrutateur', 'Poll watcher')}</span>
          <span className="w-[120px] flex-none">{t('Bureau', 'Station')}</span>
          <span className="w-[90px] flex-none">{t('Type', 'Type')}</span>
          <span className="w-[120px] flex-none">{t('Date', 'Date')}</span>
          <span className="w-[90px] flex-none text-right">{t('Action', 'Action')}</span>
        </div>

        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : fichiersFiltres.length === 0 ? (
          <EtatVide>
            {fichiers.length === 0
              ? t('Aucun fichier transmis pour le moment.', 'No file sent yet.')
              : t('Aucun fichier ne correspond aux filtres.', 'No file matches the filters.')}
          </EtatVide>
        ) : (
          fichiersFiltres.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 md:flex-nowrap"
            >
              <div className="min-w-0 flex-1 basis-full md:basis-auto">
                <div className="truncate font-sans text-[15px] font-semibold leading-[1.3] text-knavy">
                  {f.nom_fichier}
                </div>
                <div className="mt-1 font-sans text-[12px] leading-none text-kmuted">
                  {formatTaille(f.taille_octets, lang)}
                </div>
              </div>
              <div className="w-[160px] flex-none truncate font-sans text-[14px] text-kink" title={f.scrutateur_nom}>
                {f.scrutateur_nom}
              </div>
              <div className="w-[120px] flex-none truncate font-sans text-[14px] text-kink">{f.bureau || '—'}</div>
              <div className="w-[90px] flex-none">
                <BadgeType type={f.type} />
              </div>
              <div className="w-[120px] flex-none font-sans text-[13px] text-kfaint">
                {formatDateLongue(f.created_at, lang)}
              </div>
              <div className="w-[90px] flex-none text-right">
                <button
                  type="button"
                  onClick={() => telecharger(f.storage_path)}
                  className="font-sans text-[13px] font-bold text-kgreen"
                >
                  {t('Voir ↗', 'View ↗')}
                </button>
              </div>
            </div>
          ))
        )}
      </Carte>

      {!chargement && !erreur && (
        <p className="mt-3 font-sans text-[12px] text-kfaint">
          {lang === 'en'
            ? `${fichiersFiltres.length} file${fichiersFiltres.length > 1 ? 's' : ''} shown of ${fichiers.length}.`
            : `${fichiersFiltres.length} fichier${fichiersFiltres.length > 1 ? 's' : ''} affiché${fichiersFiltres.length > 1 ? 's' : ''} sur ${fichiers.length}.`}
        </p>
      )}
    </div>
  )
}
