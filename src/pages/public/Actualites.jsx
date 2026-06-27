import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import ActualiteCard from '../../components/public/ActualiteCard'
import StateMessage from '../../components/public/StateMessage'
import Reveal from '../../components/ui/Reveal'
import { Skeleton, SkeletonGrille } from '../../components/ui/Skeleton'
import { formatDateLongue } from '../../lib/dates'
import { getActualites } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

export default function Actualites() {
  const { lang, t } = useLang()
  const [items, setItems] = useState(null)

  useEffect(() => {
    getActualites().then(setItems).catch(() => setItems([]))
  }, [])

  const aLaUne = items && items.length ? items[0] : null
  const reste = items && items.length > 1 ? items.slice(1) : []

  return (
    <>
      <PageBanner surtitre={t('Actualités', 'News')} fil={t('Actualités', 'News')} />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(24px,3vw,32px)] pt-[clamp(40px,6vw,60px)]">
        <div className="mx-auto max-w-site">
          {items === null ? (
            <>
              {/* squelette « à la une » */}
              <div className="mb-9 flex flex-wrap items-stretch gap-[clamp(24px,4vw,40px)] overflow-hidden rounded-md bg-klight">
                <Skeleton className="min-h-[280px] flex-1 basis-[360px] rounded-none" />
                <div className="flex flex-1 basis-[360px] flex-col justify-center gap-3 py-[clamp(24px,3vw,40px)] pr-[clamp(24px,3vw,40px)]">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <SkeletonGrille nombre={3} />
            </>
          ) : items.length === 0 ? (
            <StateMessage>{t('Aucune actualité publiée pour le moment.', 'No news published yet.')}</StateMessage>
          ) : (
            <>
              {/* À la une */}
              <Reveal as={Link} to={`/actualites/${aLaUne.id}`} className="group mb-9 flex flex-wrap items-center gap-[clamp(24px,4vw,40px)] overflow-hidden rounded-md bg-klight no-underline transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(17,32,63,.12)]">
                <div className="relative min-h-[280px] flex-1 basis-[360px] self-stretch bg-[#cdd4dd]">
                  {aLaUne.image_url ? (
                    <img src={aLaUne.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#c7ced8] to-[#dfe4ea] text-kgold">
                      <span className="font-heading text-[40px]">★</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 basis-[360px] py-[clamp(24px,3vw,40px)] pr-[clamp(24px,3vw,40px)]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-[3px] bg-kred px-[11px] py-[7px] font-sans text-[11px] font-bold uppercase tracking-[0.1em] leading-none text-white">{t('À la une', 'Featured')}</span>
                    <span className="font-sans text-[13px] font-semibold leading-none text-kfaint">{formatDateLongue(aLaUne.created_at, lang)}</span>
                  </div>
                  <h2 className="m-0 mb-[14px] font-heading text-[clamp(28px,4vw,42px)] font-bold uppercase leading-[1.02] text-knavy">{t({ fr: aLaUne.titre, en: aLaUne.titre_en || aLaUne.titre })}</h2>
                  {aLaUne.contenu && <p className="m-0 mb-[22px] max-w-[520px] font-sans text-[17px] leading-[1.7] text-[#3b465c] line-clamp-4">{t({ fr: aLaUne.contenu, en: aLaUne.contenu_en || aLaUne.contenu })}</p>}
                  <span className="inline-flex items-center gap-[9px] font-sans text-[15px] font-bold leading-none text-kgreen">{t("Lire l'article", 'Read the article')} <span className="text-[18px] transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                </div>
              </Reveal>

              {/* grille */}
              {reste.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
                  {reste.map((a, i) => (
                    <Reveal key={a.id} delay={(i % 3) * 90} className="h-full">
                      <Link to={`/actualites/${a.id}`} className="block h-full no-underline">
                        <ActualiteCard actualite={a} />
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
