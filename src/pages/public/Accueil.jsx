import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Eyebrow from '../../components/public/Eyebrow'
import NewsletterForm from '../../components/public/NewsletterForm'
import ActualiteCard from '../../components/public/ActualiteCard'
import StateMessage from '../../components/public/StateMessage'
import { partsDate } from '../../lib/dates'
import { getActualites, getEvenementsClasses } from '../../lib/content'

const PROPOSITIONS = [
  { n: '01', t: "Financement de l'économie", d: 'Un nouveau modèle pour financer durablement le développement national.', c: 'kgreen' },
  { n: '02', t: 'Souveraineté monétaire', d: "Un système monétaire national au service du crédit et de l'emploi.", c: 'kred' },
  { n: '03', t: "Politique de l'emploi", d: "Une nouvelle politique de l'emploi tournée vers la jeunesse.", c: 'kgold' },
  { n: '04', t: 'Protection sociale', d: 'Une couverture sociale juste pour tous les Camerounais.', c: 'kgreen' },
  { n: '05', t: 'Santé pour tous', d: 'Un système de santé accessible et équitable sur tout le territoire.', c: 'kred' },
  { n: '06', t: 'Réforme foncière', d: "Une réforme foncière au profit de tous et de l'intégration africaine.", c: 'kgold' },
]

const PASTILLE = {
  kgreen: 'bg-kgreen text-kgold',
  kred: 'bg-kred text-white',
  kgold: 'bg-kgold text-knavy',
}
const BORDURE = { kgreen: 'border-t-kgreen', kred: 'border-t-kred', kgold: 'border-t-kgold' }

export default function Accueil() {
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
            <Eyebrow color="text-kred" dash className="mb-[22px]">
              Cameroun · Le mouvement continue
            </Eyebrow>
            <h1 className="m-0 font-heading text-[clamp(46px,8vw,78px)] font-bold uppercase leading-[0.92] tracking-[0.005em] text-knavy">
              Le nouveau départ
            </h1>
            {/* drapeau tricolore */}
            <div className="my-6 flex h-[6px] w-[120px] overflow-hidden rounded-sm">
              <span className="flex-1 bg-kgreen" />
              <span className="flex-1 bg-kred" />
              <span className="flex-1 bg-kgold" />
            </div>
            <p className="m-0 mb-8 max-w-[480px] font-sans text-[19px] leading-[1.6] text-[#3b465c]">
              Avec le Dr Jacques Bouhga-Hagbe, bâtissons un Cameroun souverain, prospère et
              fier — porté par un programme économique solide et une vision panafricaine.
            </p>
            <div className="flex flex-wrap gap-[14px]">
              <Link to="/adhesion" className="rounded-[3px] bg-kgreen px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline">
                Rejoindre le mouvement
              </Link>
              <Link to="/le-programme" className="rounded-[3px] border-2 border-kred bg-white px-6 py-[14px] font-sans text-[15px] font-bold leading-none text-kred no-underline">
                Découvrir le programme
              </Link>
            </div>

            {/* lecteur audio — hymne */}
            <div className="mt-8 max-w-[420px] rounded-md border border-[#e3e7ec] bg-white p-4">
              <div className="mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-kgreen">
                ♪ L'hymne du mouvement
              </div>
              <audio controls preload="none" className="w-full">
                <source
                  src="https://bouhga2025.net/wp-content/uploads/hymne-mcnc-2025.mp3"
                  type="audio/mpeg"
                />
                Votre navigateur ne prend pas en charge la lecture audio.
              </audio>
            </div>
          </div>

          {/* portrait */}
          <div className="relative mb-[18px] max-w-[440px] flex-1 basis-[300px]">
            <div className="aspect-[4/5] overflow-hidden rounded-[4px] bg-[#c7ced8]">
              <img
                src="/uploads/jacques-hagbe.webp"
                alt="Dr Jacques Bouhga-Hagbe"
                className="h-full w-full object-cover object-[center_top]"
              />
            </div>
            <div className="absolute bottom-[-18px] left-6 rounded-[3px] bg-knavy px-5 py-[14px] text-white shadow-[0_8px_20px_rgba(17,32,63,.25)]">
              <div className="font-heading text-[18px] font-bold uppercase tracking-[0.04em] leading-none">
                Dr Jacques Bouhga-Hagbe
              </div>
              <div className="mt-[5px] font-sans text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-kgold">
                Président du Mouvement Kamerun
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-[clamp(32px,5vw,48px)]">
          <div className="aspect-square max-w-[420px] flex-1 basis-[260px] overflow-hidden rounded-[4px] bg-[#cdd4dd]">
            <img src="/uploads/Jacques-Bougha-Hagbe.webp" alt="Dr Jacques Bouhga-Hagbe" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 basis-[360px]">
            <Eyebrow color="text-kgreen" className="mb-4">À propos</Eyebrow>
            <h2 className="m-0 mb-5 font-heading text-[clamp(30px,4.5vw,44px)] font-bold uppercase leading-none text-knavy">
              Un économiste au service du Cameroun
            </h2>
            <p className="m-0 mb-4 font-sans text-[17px] leading-[1.7] text-[#3b465c]">
              Fort de plus de deux décennies d'expérience au Fonds monétaire international, le
              Dr Jacques Bouhga-Hagbe est un économiste chevronné. Ses travaux couvrent les
              politiques budgétaire et monétaire, la gestion des finances publiques et les
              besoins des économies en développement.
            </p>
            <p className="m-0 mb-6 font-sans text-[17px] leading-[1.7] text-[#3b465c]">
              Titulaire d'un doctorat de l'Université Cornell, panafricaniste convaincu, il
              croit au potentiel de transformation de l'Afrique par un leadership stratégique.
            </p>
            <Link to="/a-propos" className="inline-flex items-center gap-[9px] font-sans text-[15px] font-bold leading-none text-kgreen no-underline">
              En savoir plus <span className="text-[18px]">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMME — propositions */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <div className="mx-auto mb-11 max-w-[680px] text-center">
            <Eyebrow color="text-kred" className="mb-[14px] justify-center">Le programme</Eyebrow>
            <h2 className="m-0 mb-[14px] font-heading text-[clamp(32px,5vw,46px)] font-bold uppercase leading-none text-knavy">
              Mes propositions pour le Cameroun
            </h2>
            <p className="m-0 font-sans text-[17px] leading-[1.6] text-[#3b465c]">
              Un projet structurant autour de la souveraineté économique, de l'emploi et de la
              justice sociale.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {PROPOSITIONS.map((p) => (
              <div key={p.n} className={`rounded-[4px] border-t-4 bg-white p-7 ${BORDURE[p.c]}`}>
                <div className={`mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-full font-heading text-[17px] font-bold ${PASTILLE[p.c]}`}>
                  {p.n}
                </div>
                <h3 className="m-0 mb-[9px] font-heading text-[23px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-knavy">
                  {p.t}
                </h3>
                <p className="m-0 font-sans text-[15px] leading-[1.55] text-[#56607a]">{p.d}</p>
              </div>
            ))}
          </div>

          {/* livre + synthèse */}
          <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            <div className="flex flex-wrap items-center gap-6 rounded-[4px] bg-knavy p-8">
              <div className="w-[108px] flex-none overflow-hidden rounded-[3px] shadow-[0_8px_20px_rgba(0,0,0,.35)]">
                <img src="/uploads/71pZImYrlSL._SY522_.jpg" alt="Kamerun — Propositions pour un nouveau départ" className="block w-full" />
              </div>
              <div className="flex-1 basis-[180px]">
                <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgold">Le livre</div>
                <h3 className="m-0 mb-[10px] font-heading text-[26px] font-bold uppercase leading-[1.02] text-white">
                  Kamerun — Propositions pour un nouveau départ
                </h3>
                <span className="inline-block rounded-[3px] bg-kgold px-[18px] py-3 font-sans text-[14px] font-bold leading-none text-knavy">
                  Commander le livre
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[4px] border border-[#e3e7ec] bg-white p-8">
              <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgreen">Document</div>
              <h3 className="m-0 mb-2 font-heading text-[26px] font-bold uppercase leading-[1.02] text-knavy">Synthèse du programme</h3>
              <p className="m-0 mb-4 font-sans text-[15px] leading-[1.55] text-[#56607a]">
                L'essentiel des propositions en un document à télécharger.
              </p>
              <Link to="/ressources" className="inline-flex items-center gap-2 font-sans text-[15px] font-bold leading-none text-kred no-underline">
                Télécharger le PDF <span className="text-[17px]">↓</span>
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
              <Eyebrow color="text-kgreen" className="mb-3">Actualités</Eyebrow>
              <h2 className="m-0 font-heading text-[clamp(28px,4.5vw,40px)] font-bold uppercase leading-none text-knavy">
                Dernières actualités
              </h2>
            </div>
            <Link to="/actualites" className="font-sans text-[14px] font-bold text-kred no-underline">
              Toutes les actualités →
            </Link>
          </div>

          {actualites === null ? (
            <StateMessage>Chargement des actualités…</StateMessage>
          ) : actualites.length === 0 ? (
            <StateMessage>Aucune actualité publiée pour le moment.</StateMessage>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
              {actualites.map((a) => (
                <ActualiteCard key={a.id} actualite={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROCHAIN ÉVÉNEMENT — depuis la base */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <Eyebrow color="text-kred" className="mb-[18px]">Prochain événement</Eyebrow>
          {!evtCharge ? (
            <StateMessage>Chargement…</StateMessage>
          ) : !prochain ? (
            <StateMessage>Aucun événement à venir n'est encore publié.</StateMessage>
          ) : (
            <div className="flex flex-wrap overflow-hidden rounded-md shadow-[0_2px_14px_rgba(17,32,63,.08)]">
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
                    <div className="font-heading text-[30px] font-bold leading-none">{partsDate(prochain.date_event).jour}</div>
                    <div className="mt-[3px] font-sans text-[12px] font-bold uppercase tracking-[0.1em]">{partsDate(prochain.date_event).mois}</div>
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
                  <Link to="/evenements" className="inline-block rounded-[3px] bg-kgold px-6 py-[15px] font-sans text-[15px] font-bold leading-none text-knavy no-underline">
                    Voir les événements
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterForm variant="green" />
    </>
  )
}
