import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import EvenementItem from '../../components/public/EvenementItem'
import StateMessage from '../../components/public/StateMessage'
import NewsletterForm from '../../components/public/NewsletterForm'
import { partsDate } from '../../lib/dates'
import { getEvenementsClasses } from '../../lib/content'

const ACCENTS = ['kgreen', 'kred', 'kgold']

export default function Evenements() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getEvenementsClasses()
      .then(setData)
      .catch(() => setData({ aVenir: [], passes: [], prochain: null }))
  }, [])

  const prochain = data?.prochain ?? null

  return (
    <>
      <PageBanner surtitre="Événements" fil="Événements de campagne" />

      {/* prochain événement (à la une) */}
      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(28px,3vw,36px)] pt-[clamp(40px,6vw,60px)]">
        <div className="mx-auto max-w-site">
          <Eyebrow color="text-kred" className="mb-[18px]">Prochain événement</Eyebrow>
          {data === null ? (
            <StateMessage>Chargement…</StateMessage>
          ) : !prochain ? (
            <StateMessage>Aucun événement à venir n'est encore publié.</StateMessage>
          ) : (
            <div className="flex flex-wrap overflow-hidden rounded-md shadow-[0_2px_14px_rgba(17,32,63,.08)]">
              <div className="relative min-h-[320px] flex-1 basis-[380px] self-stretch bg-[#cdd4dd]">
                {prochain.image_url ? (
                  <img src={prochain.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#c7ced8] to-[#dfe4ea] text-kgold">
                    <span className="font-heading text-[44px]">★</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 basis-[380px] flex-col justify-center bg-knavy p-[clamp(28px,3.5vw,44px)]">
                <div className="mb-5 flex items-center gap-4">
                  <div className="rounded-[4px] bg-kgold px-4 py-[10px] text-center leading-none text-knavy">
                    <div className="font-heading text-[30px] font-bold leading-none">{partsDate(prochain.date_event).jour}</div>
                    <div className="mt-[3px] font-sans text-[12px] font-bold uppercase tracking-[0.1em]">{partsDate(prochain.date_event).mois}</div>
                  </div>
                  {prochain.lieu && <div className="font-sans text-[14px] font-semibold leading-[1.4] text-[#cfd6e4]">{prochain.lieu}</div>}
                </div>
                <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,4vw,46px)] font-bold uppercase leading-[1.02] text-white">{prochain.titre}</h2>
                {prochain.description && <p className="m-0 mb-6 max-w-[480px] font-sans text-[16px] leading-[1.7] text-[#aeb9d0]">{prochain.description}</p>}
                <div>
                  <Link to="/contact" className="inline-block rounded-[3px] bg-kgold px-6 py-[15px] font-sans text-[15px] font-bold leading-none text-knavy no-underline">Nous écrire</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* à venir */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(20px,3vw,28px)]">
        <div className="mx-auto max-w-site">
          <h2 className="mb-6 font-heading text-[clamp(28px,4.5vw,42px)] font-bold uppercase leading-none text-knavy">À venir</h2>
          {data === null ? (
            <StateMessage>Chargement…</StateMessage>
          ) : data.aVenir.length === 0 ? (
            <StateMessage>Aucun événement à venir publié.</StateMessage>
          ) : (
            <div className="flex flex-col gap-[18px]">
              {data.aVenir.map((e, i) => (
                <EvenementItem key={e.id} evenement={e} accent={ACCENTS[i % ACCENTS.length]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* passés */}
      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,64px)] pt-[clamp(28px,3vw,36px)]">
        <div className="mx-auto max-w-site">
          <h2 className="mb-7 font-heading text-[clamp(28px,4.5vw,42px)] font-bold uppercase leading-none text-knavy">Événements passés</h2>
          {data === null ? (
            <StateMessage>Chargement…</StateMessage>
          ) : data.passes.length === 0 ? (
            <StateMessage>Aucun événement passé.</StateMessage>
          ) : (
            <div className="flex flex-col gap-[18px]">
              {data.passes.map((e, i) => (
                <EvenementItem key={e.id} evenement={e} accent={ACCENTS[i % ACCENTS.length]} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterForm variant="green" />
    </>
  )
}
