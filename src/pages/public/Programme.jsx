import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'

const THEMES = [
  { n: '01', t: 'Économie & finances publiques', pts: ["Un nouveau modèle de financement de l'économie", 'Une gestion saine des finances publiques', "Informatisation de l'économie et réforme fiscale"], c: 'kgreen' },
  { n: '02', t: 'Souveraineté monétaire', pts: ["Un système monétaire national au service du crédit et de l'emploi", 'Un réseau financier des peuples pour les échanges internationaux'], c: 'kred' },
  { n: '03', t: 'Emploi & entreprises', pts: ["Une nouvelle politique de l'emploi pour la jeunesse", 'Des entreprises populaires pour bâtir les infrastructures publiques'], c: 'kgold' },
  { n: '04', t: 'Protection sociale & santé', pts: ['Un système de protection sociale pour tous', 'Un système de santé accessible sur tout le territoire'], c: 'knavy' },
  { n: '05', t: 'Territoire & foncier', pts: ["Un aménagement favorisant l'intégration africaine", 'Une réforme foncière au profit de tous'], c: 'kgreen' },
  { n: '06', t: 'Culture & identité', pts: ['Un Cameroun fier de ses cultures, traditions et langues', 'Un Cameroun qui reconnaît tous ses enfants'], c: 'kred' },
  { n: '07', t: 'Institutions & gouvernance', pts: ['Une réforme constitutionnelle et un pouvoir judiciaire indépendant', 'Un équilibre clair des pouvoirs et des mandats'], c: 'knavy' },
  { n: '08', t: 'Éducation, recherche & intégration', pts: ['Une éducation nationale et une recherche renforcées', "L'unité africaine : Fonds monétaire et université panafricains"], c: 'kgold' },
]

const ACCENT = {
  kgreen: { bord: 'border-t-kgreen', txt: 'text-kgreen', puce: 'text-kgreen' },
  kred: { bord: 'border-t-kred', txt: 'text-kred', puce: 'text-kred' },
  kgold: { bord: 'border-t-kgold', txt: 'text-[#b58f00]', puce: 'text-[#b58f00]' },
  knavy: { bord: 'border-t-knavy', txt: 'text-knavy', puce: 'text-knavy' },
}

export default function Programme() {
  return (
    <>
      <PageBanner surtitre="Le programme" fil="Le programme" />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(20px,3vw,32px)] pt-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className="m-0 mb-[18px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
            Mes propositions pour le Cameroun
          </h1>
          <p className="m-0 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
            Un projet structurant organisé par grands thèmes. Explorez les propositions et
            téléchargez la synthèse du programme ou l'ouvrage complet.
          </p>
        </div>
      </section>

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,72px)] pt-[clamp(20px,3vw,32px)]">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
          {THEMES.map((th) => {
            const a = ACCENT[th.c]
            return (
              <div key={th.n} className={`rounded-[5px] border border-[#e3e7ec] border-t-4 bg-white p-[30px] ${a.bord}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`font-heading text-[13px] font-bold uppercase tracking-[0.06em] ${a.txt}`}>Thème {th.n}</div>
                  <span className={`text-[18px] ${a.txt}`}>→</span>
                </div>
                <h3 className="m-0 mb-[14px] font-heading text-[26px] font-semibold uppercase leading-[1.02] tracking-[0.02em] text-knavy">{th.t}</h3>
                <div className="flex flex-col gap-[9px]">
                  {th.pts.map((p) => (
                    <div key={p} className="flex gap-[10px] font-sans text-[15px] leading-[1.5] text-[#56607a]">
                      <span className={`font-bold ${a.puce}`}>·</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* documents */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <div className="mb-8">
            <Eyebrow color="text-kred" className="mb-3">Documents</Eyebrow>
            <h2 className="m-0 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none text-knavy">
              Téléchargez le programme
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
            <div className="flex flex-wrap items-center gap-6 rounded-[5px] bg-knavy p-8">
              <div className="w-[120px] flex-none overflow-hidden rounded-[3px] shadow-[0_8px_20px_rgba(0,0,0,.35)]">
                <img src="/uploads/71pZImYrlSL._SY522_.jpg" alt="Kamerun — Propositions pour un nouveau départ" className="block w-full" />
              </div>
              <div className="flex-1 basis-[180px]">
                <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgold">L'ouvrage</div>
                <h3 className="m-0 mb-[10px] font-heading text-[26px] font-bold uppercase leading-[1.02] text-white">Kamerun — Propositions pour un nouveau départ</h3>
                <p className="m-0 mb-[14px] font-sans text-[14px] leading-[1.55] text-[#aeb9d0]">La vision et les propositions, détaillées et argumentées.</p>
                <span className="inline-block rounded-[3px] bg-kgold px-[18px] py-3 font-sans text-[14px] font-bold leading-none text-knavy">Commander le livre</span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[5px] border border-[#e3e7ec] bg-white p-8">
              <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgreen">PDF</div>
              <h3 className="m-0 mb-[10px] font-heading text-[30px] font-bold uppercase leading-[1.02] text-knavy">Synthèse du programme</h3>
              <p className="m-0 mb-[18px] font-sans text-[15px] leading-[1.6] text-[#56607a]">
                L'essentiel des propositions du Mouvement Kamerun en un document à télécharger.
              </p>
              <Link to="/ressources" className="inline-flex items-center gap-2 font-sans text-[15px] font-bold leading-none text-kred no-underline">
                Télécharger le PDF <span className="text-[17px]">↓</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kgreen px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)] text-center">
        <div className="mx-auto max-w-[680px]">
          <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,5vw,46px)] font-bold uppercase leading-none text-white">
            Vous partagez cette vision ?
          </h2>
          <p className="m-0 mb-7 font-sans text-[17px] leading-[1.6] text-[#d7ece1]">
            Rejoignez le Mouvement Kamerun et soutenez un programme pour un nouveau départ.
          </p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            <Link to="/faire-un-don" className="rounded-[3px] bg-kgold px-7 py-4 font-sans text-[15px] font-bold leading-none text-knavy no-underline">Soutenir le mouvement</Link>
            <Link to="/benevoles" className="rounded-[3px] border-2 border-white/60 bg-transparent px-[26px] py-[14px] font-sans text-[15px] font-bold leading-none text-white no-underline">Devenir bénévole</Link>
          </div>
        </div>
      </section>
    </>
  )
}
