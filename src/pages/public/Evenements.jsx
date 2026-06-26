import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import EvenementItem from '../../components/public/EvenementItem'
import StateMessage from '../../components/public/StateMessage'
import NewsletterForm from '../../components/public/NewsletterForm'
import Reveal from '../../components/ui/Reveal'
import { Skeleton, SkeletonLigne } from '../../components/ui/Skeleton'
import { partsDate } from '../../lib/dates'
import { getEvenementsClasses } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

const ACCENTS = ['kgreen', 'kred', 'kgold']

export default function Evenements() {
  const { lang, t } = useLang()
  const [data, setData] = useState(null)

  useEffect(() => {
    getEvenementsClasses()
      .then(setData)
      .catch(() => setData({ aVenir: [], passes: [], prochain: null }))
  }, [])

  const prochain = data?.prochain ?? null

  return (
    <>
      <PageBanner surtitre={t('Événements', 'Events')} fil={t('Événements de campagne', 'Campaign events')} />

      {/* prochain événement (à la une) */}
      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(28px,3vw,36px)] pt-[clamp(40px,6vw,60px)]">
        <div className="mx-auto max-w-site">
          <Eyebrow color="text-kred" className="mb-[18px]">{t('Prochain événement', 'Next event')}</Eyebrow>
          {data === null ? (
            <div className="flex flex-wrap overflow-hidden rounded-md shadow-[0_2px_14px_rgba(17,32,63,.08)]">
              <Skeleton className="min-h-[320px] flex-1 basis-[380px] rounded-none" />
              <div className="flex flex-1 basis-[380px] flex-col justify-center gap-4 bg-knavy p-[clamp(28px,3.5vw,44px)]">
                <Skeleton className="h-[60px] w-[60px] !bg-[#243456]" />
                <Skeleton className="h-9 w-4/5 !bg-[#243456]" />
                <Skeleton className="h-4 w-full !bg-[#243456]" />
                <Skeleton className="h-4 w-2/3 !bg-[#243456]" />
              </div>
            </div>
          ) : !prochain ? (
            <StateMessage>{t("Aucun événement à venir n'est encore publié.", 'No upcoming event has been published yet.')}</StateMessage>
          ) : (
            <Reveal as="div" className="flex flex-wrap overflow-hidden rounded-md shadow-[0_2px_14px_rgba(17,32,63,.08)]">
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
                    <div className="font-heading text-[30px] font-bold leading-none">{partsDate(prochain.date_event, lang).jour}</div>
                    <div className="mt-[3px] font-sans text-[12px] font-bold uppercase tracking-[0.1em]">{partsDate(prochain.date_event, lang).mois}</div>
                  </div>
                  {prochain.lieu && <div className="font-sans text-[14px] font-semibold leading-[1.4] text-[#cfd6e4]">{prochain.lieu}</div>}
                </div>
                <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,4vw,46px)] font-bold uppercase leading-[1.02] text-white">{prochain.titre}</h2>
                {prochain.description && <p className="m-0 mb-6 max-w-[480px] font-sans text-[16px] leading-[1.7] text-[#aeb9d0]">{prochain.description}</p>}
                <div>
                  <Link to="/contact" className="inline-block rounded-[3px] bg-kgold px-6 py-[15px] font-sans text-[15px] font-bold leading-none text-knavy no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_8px_20px_rgba(252,209,22,.35)]">{t('Nous écrire', 'Write to us')}</Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* à venir */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(20px,3vw,28px)]">
        <div className="mx-auto max-w-site">
          <h2 className="mb-6 font-heading text-[clamp(28px,4.5vw,42px)] font-bold uppercase leading-none text-knavy">{t('À venir', 'Upcoming')}</h2>
          {data === null ? (
            <div className="flex flex-col gap-[18px]">
              <SkeletonLigne />
              <SkeletonLigne />
            </div>
          ) : data.aVenir.length === 0 ? (
            <StateMessage>{t('Aucun événement à venir publié.', 'No upcoming events published.')}</StateMessage>
          ) : (
            <div className="flex flex-col gap-[18px]">
              {data.aVenir.map((e, i) => (
                <Reveal key={e.id} delay={(i % 4) * 80}>
                  <EvenementItem evenement={e} accent={ACCENTS[i % ACCENTS.length]} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* passés */}
      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,64px)] pt-[clamp(28px,3vw,36px)]">
        <div className="mx-auto max-w-site">
          <h2 className="mb-7 font-heading text-[clamp(28px,4.5vw,42px)] font-bold uppercase leading-none text-knavy">{t('Événements passés', 'Past events')}</h2>
          {data === null ? (
            <div className="flex flex-col gap-[18px]">
              <SkeletonLigne />
              <SkeletonLigne />
            </div>
          ) : data.passes.length === 0 ? (
            <StateMessage>{t('Aucun événement passé.', 'No past events.')}</StateMessage>
          ) : (
            <div className="flex flex-col gap-[18px]">
              {data.passes.map((e, i) => (
                <Reveal key={e.id} delay={(i % 4) * 80}>
                  <EvenementItem evenement={e} accent={ACCENTS[i % ACCENTS.length]} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterForm variant="green" />
    </>
  )
}
