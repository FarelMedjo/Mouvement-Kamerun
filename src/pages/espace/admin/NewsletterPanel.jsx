import { useEffect, useState } from 'react'
import { listerNewsletter, exporterCsv } from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement } from './ui'
import { useLang } from '../../../i18n/LanguageContext'

// Inscrits à la newsletter : consultation et export CSV.
export default function NewsletterPanel() {
  const { lang, t } = useLang()
  const [inscrits, setInscrits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let actif = true
    listerNewsletter()
      .then((d) => actif && setInscrits(d))
      .catch((e) => actif && setErreur(e?.message || t('Échec du chargement.', 'Loading failed.')))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [t])

  const exporter = () => {
    const date = new Date().toISOString().slice(0, 10)
    exporterCsv(
      `newsletter-${date}.csv`,
      [
        { cle: 'email', libelle: t('Email', 'Email') },
        { cle: 'nom', libelle: t('Nom', 'Name') },
        { cle: 'created_at', libelle: t('Inscrit le', 'Subscribed on') },
      ],
      inscrits.map((i) => ({ ...i, created_at: formatDateLongue(i.created_at, lang) }))
    )
  }

  return (
    <div>
      <PanelHeader
        titre={t('Newsletter', 'Newsletter')}
        sousTitre={t("Personnes inscrites à la lettre d'information.", 'People subscribed to the newsletter.')}
        actions={
          <button
            type="button"
            onClick={exporter}
            disabled={inscrits.length === 0}
            className="rounded-md bg-knavy px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-40"
          >
            {t('Exporter en CSV', 'Export to CSV')}
          </button>
        }
      />

      <Carte>
        <div className="hidden items-center gap-3 border-b border-kline bg-[#f7f9fb] px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-kmuted md:flex">
          <span className="flex-1">{t('Email', 'Email')}</span>
          <span className="w-[200px] flex-none">{t('Nom', 'Name')}</span>
          <span className="w-[140px] flex-none">{t('Inscrit le', 'Subscribed on')}</span>
        </div>

        {chargement ? (
          <Chargement />
        ) : erreur ? (
          <EtatVide>{erreur}</EtatVide>
        ) : inscrits.length === 0 ? (
          <EtatVide>{t('Aucun inscrit pour le moment.', 'No subscribers yet.')}</EtatVide>
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
                {formatDateLongue(i.created_at, lang)}
              </div>
            </div>
          ))
        )}
      </Carte>

      {!chargement && !erreur && (
        <p className="mt-3 font-sans text-[12px] text-kfaint">
          {lang === 'en'
            ? `${inscrits.length} subscriber${inscrits.length > 1 ? 's' : ''}.`
            : `${inscrits.length} inscrit${inscrits.length > 1 ? 's' : ''}.`}
        </p>
      )}
    </div>
  )
}
