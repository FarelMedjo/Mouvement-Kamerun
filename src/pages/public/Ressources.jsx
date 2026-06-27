import { useEffect, useState } from 'react'
import PageBanner from '../../components/public/PageBanner'
import StateMessage from '../../components/public/StateMessage'
import { Skeleton } from '../../components/ui/Skeleton'
import { getRessources, lienRessource } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

// Bibliothèque de documents (textes de référence, programme…), administrée
// depuis l'espace admin (onglet « Contenus » → « Documents »). Chaque entrée
// pointe vers un fichier téléversé (bucket public) ou un lien externe.
export default function Ressources() {
  const { lang, t } = useLang()
  const [ressources, setRessources] = useState(null) // null = chargement

  useEffect(() => {
    getRessources()
      .then(setRessources)
      .catch(() => setRessources([]))
  }, [])

  return (
    <>
      <PageBanner surtitre={t('Ressources', 'Resources')} fil={t('Bibliothèque de documents', 'Document library')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-site">
          <h1 className="m-0 mb-7 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none text-knavy">
            {t('Ressources', 'Resources')}
          </h1>

          {ressources === null ? (
            <div className="flex flex-col border-t border-[#e3e7ec]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-[#e3e7ec] px-1 py-[18px]">
                  <Skeleton className="h-5 w-3/5" />
                </div>
              ))}
            </div>
          ) : ressources.length === 0 ? (
            <StateMessage>{t('Aucun document publié pour le moment.', 'No document published yet.')}</StateMessage>
          ) : (
            <div className="flex flex-col border-t border-[#e3e7ec]">
              {ressources.map((r) => {
                const titre = lang === 'en' && r.titre_en ? r.titre_en : r.titre
                const href = lienRessource(r)
                return (
                  <a
                    key={r.id}
                    href={href || '#'}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noreferrer' : undefined}
                    className="flex items-center justify-between gap-4 border-b border-[#e3e7ec] px-1 py-[18px] no-underline"
                  >
                    <span className="font-sans text-[17px] font-semibold leading-[1.3] text-knavy">{titre}</span>
                    <span className="whitespace-nowrap font-sans text-[13px] font-bold uppercase tracking-[0.06em] text-kgreen">
                      {t('Ouvrir', 'Open')} ↓
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
