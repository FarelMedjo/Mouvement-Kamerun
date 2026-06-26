import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Eyebrow from '../../components/public/Eyebrow'
import NewsletterForm from '../../components/public/NewsletterForm'
import ActualiteCard from '../../components/public/ActualiteCard'
import StateMessage from '../../components/public/StateMessage'
import HeroCarousel from '../../components/public/HeroCarousel'
import ChiffresCles from '../../components/public/ChiffresCles'
import Reveal from '../../components/ui/Reveal'
import { Skeleton, SkeletonGrille } from '../../components/ui/Skeleton'
import { partsDate } from '../../lib/dates'
import { getActualites, getEvenementsClasses } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

// `t` (titre) et `d` (description) sont bilingues ({ fr, en }), résolus à l'affichage.
const PROPOSITIONS = [
  { n: '01', t: { fr: "Financement de l'économie", en: 'Financing the economy' }, d: { fr: 'Un nouveau modèle pour financer durablement le développement national.', en: 'A new model to sustainably finance national development.' }, c: 'kgreen' },
  { n: '02', t: { fr: 'Souveraineté monétaire', en: 'Monetary sovereignty' }, d: { fr: "Un système monétaire national au service du crédit et de l'emploi.", en: 'A national monetary system serving credit and employment.' }, c: 'kred' },
  { n: '03', t: { fr: "Politique de l'emploi", en: 'Employment policy' }, d: { fr: "Une nouvelle politique de l'emploi tournée vers la jeunesse.", en: 'A new employment policy focused on young people.' }, c: 'kgold' },
  { n: '04', t: { fr: 'Protection sociale', en: 'Social protection' }, d: { fr: 'Une couverture sociale juste pour tous les Camerounais.', en: 'Fair social coverage for all Cameroonians.' }, c: 'kgreen' },
  { n: '05', t: { fr: 'Santé pour tous', en: 'Healthcare for all' }, d: { fr: 'Un système de santé accessible et équitable sur tout le territoire.', en: 'An accessible and equitable health system across the country.' }, c: 'kred' },
  { n: '06', t: { fr: 'Réforme foncière', en: 'Land reform' }, d: { fr: "Une réforme foncière au profit de tous et de l'intégration africaine.", en: 'Land reform that benefits everyone and African integration.' }, c: 'kgold' },
]

const PASTILLE = {
  kgreen: 'bg-kgreen text-kgold',
  kred: 'bg-kred text-white',
  kgold: 'bg-kgold text-knavy',
}
const BORDURE = { kgreen: 'border-t-kgreen', kred: 'border-t-kred', kgold: 'border-t-kgold' }

export default function Accueil() {
  const { lang, t } = useLang()
  const [actualites, setActualites] = useState(null)
  const [prochain, setProchain] = useState(null)
  const [evtCharge, setEvtCharge] = useState(false)

  useEffect(() => {
    getActualites({ limit: 3 })
      .then(setActualites)
      .catch(() => setActualites([]))
    getEvenementsClasses()
      .then(({ prochain }) => setProchain(prochain))
      .catch(() => setProchain(null))
      .finally(() => setEvtCharge(true))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,72px)] pt-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-[clamp(32px,5vw,56px)]">
          <div className="flex-1 basis-[360px]">
            {/* Carrousel de messages (autoplay, pause au survol, contrôles) */}
            <HeroCarousel />
            <div className="flex flex-wrap gap-[14px]">
              <Link to="/adhesion" className="rounded-[3px] bg-kgreen px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#095638] hover:shadow-[0_8px_20px_rgba(11,107,67,.30)]">
                {t('Rejoindre le mouvement', 'Join the movement')}
              </Link>
              <Link to="/le-programme" className="rounded-[3px] border-2 border-kred bg-white px-6 py-[14px] font-sans text-[15px] font-bold leading-none text-kred no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-kred hover:text-white">
                {t('Découvrir le programme', 'Discover the programme')}
              </Link>
            </div>

            {/* lecteur audio — hymne */}
            <div className="mt-8 max-w-[420px] rounded-md border border-[#e3e7ec] bg-white p-4">
              <div className="mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-kgreen">
                {t("♪ L'hymne du mouvement", '♪ The movement’s anthem')}
              </div>
              <audio controls preload="none" className="w-full">
                <source
                  src="https://bouhga2025.net/wp-content/uploads/hymne-mcnc-2025.mp3"
                  type="audio/mpeg"
                />
                {t('Votre navigateur ne prend pas en charge la lecture audio.', 'Your browser does not support audio playback.')}
              </audio>
            </div>
          </div>

          {/* portrait */}
          <div className="relative mb-[18px] max-w-[440px] flex-1 basis-[300px]">
            <div className="aspect-[4/5] overflow-hidden rounded-[4px] bg-[#c7ced8]">
              <img
                src="/uploads/jacques-hagbe.webp"
                alt="Dr Jacques Bouhga-Hagbe"
                className="ken-burns h-full w-full object-cover object-[center_top]"
              />
            </div>
            <div className="absolute bottom-[-18px] left-6 rounded-[3px] bg-knavy px-5 py-[14px] text-white shadow-[0_8px_20px_rgba(17,32,63,.25)]">
              <div className="font-heading text-[18px] font-bold uppercase tracking-[0.04em] leading-none">
                Dr Jacques Bouhga-Hagbe
              </div>
              <div className="mt-[5px] font-sans text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-kgold">
                {t('Président du Mouvement Kamerun', 'President of Mouvement Kamerun')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <Reveal as="div" className="mx-auto flex max-w-site flex-wrap items-center gap-[clamp(32px,5vw,48px)]">
          <div className="group aspect-square max-w-[420px] flex-1 basis-[260px] overflow-hidden rounded-[4px] bg-[#cdd4dd]">
            <img src="/uploads/Jacques-Bougha-Hagbe.webp" alt="Dr Jacques Bouhga-Hagbe" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          </div>
          <div className="flex-1 basis-[360px]">
            <Eyebrow color="text-kgreen" className="mb-4">{t('À propos', 'About')}</Eyebrow>
            <h2 className="m-0 mb-5 font-heading text-[clamp(30px,4.5vw,44px)] font-bold uppercase leading-none text-knavy">
              {t('Un économiste au service du Cameroun', 'An economist serving Cameroon')}
            </h2>
            <p className="m-0 mb-4 font-sans text-[17px] leading-[1.7] text-[#3b465c]">
              {t(
                "Fort de plus de deux décennies d'expérience au Fonds monétaire international, le Dr Jacques Bouhga-Hagbe est un économiste chevronné. Ses travaux couvrent les politiques budgétaire et monétaire, la gestion des finances publiques et les besoins des économies en développement.",
                'With more than two decades of experience at the International Monetary Fund, Dr Jacques Bouhga-Hagbe is a seasoned economist. His work spans fiscal and monetary policy, public finance management and the needs of developing economies.',
              )}
            </p>
            <p className="m-0 mb-6 font-sans text-[17px] leading-[1.7] text-[#3b465c]">
              {t(
                "Titulaire d'un doctorat de l'Université Cornell, panafricaniste convaincu, il croit au potentiel de transformation de l'Afrique par un leadership stratégique.",
                'A Cornell University PhD and a committed pan-Africanist, he believes in Africa’s potential for transformation through strategic leadership.',
              )}
            </p>
            <Link to="/a-propos" className="group inline-flex items-center gap-[9px] font-sans text-[15px] font-bold leading-none text-kgreen no-underline">
              {t('En savoir plus', 'Learn more')}{' '}
              <span className="text-[18px] transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CHIFFRES CLÉS — compteurs animés */}
      <ChiffresCles />

      {/* PROGRAMME — propositions */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <Reveal as="div" className="mx-auto mb-11 max-w-[680px] text-center">
            <Eyebrow color="text-kred" className="mb-[14px] justify-center">{t('Le programme', 'The programme')}</Eyebrow>
            <h2 className="m-0 mb-[14px] font-heading text-[clamp(32px,5vw,46px)] font-bold uppercase leading-none text-knavy">
              {t('Mes propositions pour le Cameroun', 'My proposals for Cameroon')}
            </h2>
            <p className="m-0 font-sans text-[17px] leading-[1.6] text-[#3b465c]">
              {t(
                "Un projet structurant autour de la souveraineté économique, de l'emploi et de la justice sociale.",
                'A structuring project built around economic sovereignty, employment and social justice.',
              )}
            </p>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {PROPOSITIONS.map((p, i) => (
              <Reveal
                key={p.n}
                delay={(i % 3) * 90}
                className={`rounded-[4px] border-t-4 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(17,32,63,.12)] ${BORDURE[p.c]}`}
              >
                <div className={`mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-full font-heading text-[17px] font-bold ${PASTILLE[p.c]}`}>
                  {p.n}
                </div>
                <h3 className="m-0 mb-[9px] font-heading text-[23px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-knavy">
                  {t(p.t)}
                </h3>
                <p className="m-0 font-sans text-[15px] leading-[1.55] text-[#56607a]">{t(p.d)}</p>
              </Reveal>
            ))}
          </div>

          {/* livre + synthèse */}
          <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            <div className="flex flex-wrap items-center gap-6 rounded-[4px] bg-knavy p-8">
              <div className="w-[108px] flex-none overflow-hidden rounded-[3px] shadow-[0_8px_20px_rgba(0,0,0,.35)]">
                <img src="/uploads/71pZImYrlSL._SY522_.jpg" alt="Kamerun — Propositions pour un nouveau départ" className="block w-full" />
              </div>
              <div className="flex-1 basis-[180px]">
                <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgold">{t('Le livre', 'The book')}</div>
                <h3 className="m-0 mb-[10px] font-heading text-[26px] font-bold uppercase leading-[1.02] text-white">
                  {t('Kamerun — Propositions pour un nouveau départ', 'Kamerun — Proposals for a new beginning')}
                </h3>
                <span className="inline-block rounded-[3px] bg-kgold px-[18px] py-3 font-sans text-[14px] font-bold leading-none text-knavy">
                  {t('Commander le livre', 'Order the book')}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[4px] border border-[#e3e7ec] bg-white p-8">
              <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgreen">{t('Document', 'Document')}</div>
              <h3 className="m-0 mb-2 font-heading text-[26px] font-bold uppercase leading-[1.02] text-knavy">{t('Synthèse du programme', 'Programme summary')}</h3>
              <p className="m-0 mb-4 font-sans text-[15px] leading-[1.55] text-[#56607a]">
                {t("L'essentiel des propositions en un document à télécharger.", 'The key proposals in a single downloadable document.')}
              </p>
              <Link to="/ressources" className="inline-flex items-center gap-2 font-sans text-[15px] font-bold leading-none text-kred no-underline">
                {t('Télécharger le PDF', 'Download the PDF')} <span className="text-[17px]">↓</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS — depuis la base */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow color="text-kgreen" className="mb-3">{t('Actualités', 'News')}</Eyebrow>
              <h2 className="m-0 font-heading text-[clamp(28px,4.5vw,40px)] font-bold uppercase leading-none text-knavy">
                {t('Dernières actualités', 'Latest news')}
              </h2>
            </div>
            <Link to="/actualites" className="font-sans text-[14px] font-bold text-kred no-underline">
              {t('Toutes les actualités →', 'All news →')}
            </Link>
          </div>

          {actualites === null ? (
            <SkeletonGrille nombre={3} />
          ) : actualites.length === 0 ? (
            <StateMessage>{t('Aucune actualité publiée pour le moment.', 'No news published yet.')}</StateMessage>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
              {actualites.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 90} className="h-full">
                  <ActualiteCard actualite={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROCHAIN ÉVÉNEMENT — depuis la base */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <Eyebrow color="text-kred" className="mb-[18px]">{t('Prochain événement', 'Next event')}</Eyebrow>
          {!evtCharge ? (
            <div className="flex flex-wrap overflow-hidden rounded-md shadow-[0_2px_14px_rgba(17,32,63,.08)]">
              <Skeleton className="min-h-[280px] flex-1 basis-[380px] rounded-none" />
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
              <div className="relative min-h-[280px] flex-1 basis-[380px] self-stretch bg-[#cdd4dd]">
                {prochain.image_url ? (
                  <img src={prochain.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#c7ced8] to-[#dfe4ea] text-kgold">
                    <span className="font-heading text-[40px]">★</span>
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
                <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,4vw,46px)] font-bold uppercase leading-[1.02] text-white">
                  {prochain.titre}
                </h2>
                {prochain.description && (
                  <p className="m-0 mb-6 max-w-[480px] font-sans text-[16px] leading-[1.7] text-[#aeb9d0]">{prochain.description}</p>
                )}
                <div>
                  <Link to="/evenements" className="inline-block rounded-[3px] bg-kgold px-6 py-[15px] font-sans text-[15px] font-bold leading-none text-knavy no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_8px_20px_rgba(252,209,22,.35)]">
                    {t('Voir les événements', 'See the events')}
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterForm variant="green" />
    </>
  )
}
