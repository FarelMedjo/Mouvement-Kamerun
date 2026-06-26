import { useEffect, useState } from 'react'
import PageBanner from '../../components/public/PageBanner'
import ActualiteCard from '../../components/public/ActualiteCard'
import StateMessage from '../../components/public/StateMessage'
import { formatDateLongue } from '../../lib/dates'
import { getActualites } from '../../lib/content'

export default function Actualites() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    getActualites().then(setItems).catch(() => setItems([]))
  }, [])

  const aLaUne = items && items.length ? items[0] : null
  const reste = items && items.length > 1 ? items.slice(1) : []

  return (
    <>
      <PageBanner surtitre="Actualités" fil="Actualités" />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(24px,3vw,32px)] pt-[clamp(40px,6vw,60px)]">
        <div className="mx-auto max-w-site">
          {items === null ? (
            <StateMessage>Chargement des actualités…</StateMessage>
          ) : items.length === 0 ? (
            <StateMessage>Aucune actualité publiée pour le moment.</StateMessage>
          ) : (
            <>
              {/* À la une */}
              <article className="mb-9 flex flex-wrap items-center gap-[clamp(24px,4vw,40px)] overflow-hidden rounded-md bg-klight">
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
                    <span className="rounded-[3px] bg-kred px-[11px] py-[7px] font-sans text-[11px] font-bold uppercase tracking-[0.1em] leading-none text-white">À la une</span>
                    <span className="font-sans text-[13px] font-semibold leading-none text-kfaint">{formatDateLongue(aLaUne.created_at)}</span>
                  </div>
                  <h2 className="m-0 mb-[14px] font-heading text-[clamp(28px,4vw,42px)] font-bold uppercase leading-[1.02] text-knavy">{aLaUne.titre}</h2>
                  {aLaUne.contenu && <p className="m-0 mb-[22px] max-w-[520px] font-sans text-[17px] leading-[1.7] text-[#3b465c] line-clamp-4">{aLaUne.contenu}</p>}
                  <span className="inline-flex items-center gap-[9px] font-sans text-[15px] font-bold leading-none text-kgreen">Lire l'article <span className="text-[18px]">→</span></span>
                </div>
              </article>

              {/* grille */}
              {reste.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
                  {reste.map((a) => (
                    <ActualiteCard key={a.id} actualite={a} />
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
