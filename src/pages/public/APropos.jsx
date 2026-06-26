import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'

const FAITS = [
  { v: '+20', d: 'ans au Fonds monétaire international', c: 'text-kgreen' },
  { v: 'PhD', d: 'Doctorat en économie · Université Cornell', c: 'text-kred' },
  { v: 'McGill', d: "Maîtrise d'économie", c: 'text-knavy' },
  { v: 'Centrale', d: "Diplôme d'ingénieur · École Centrale Paris", c: 'text-kgreen' },
]

const VALEURS = [
  { t: 'Souveraineté', d: 'Une économie et une monnaie au service du peuple camerounais et de son indépendance.', c: 'border-t-kgreen' },
  { t: 'Justice sociale', d: 'Une protection sociale, une santé et un emploi accessibles à tous, sans exclusion.', c: 'border-t-kred' },
  { t: 'Panafricanisme', d: "L'unité des peuples africains et l'intégration du continent comme horizon commun.", c: 'border-t-kgold' },
  { t: 'Intégrité', d: 'Une gestion des finances publiques saine, transparente et responsable.', c: 'border-t-knavy' },
]

export default function APropos() {
  return (
    <>
      <PageBanner surtitre="À propos" fil="Le mouvement" />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,72px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-[clamp(32px,5vw,56px)]">
          <div className="flex-1 basis-[360px]">
            <Eyebrow color="text-kred" dash className="mb-5">Le mouvement</Eyebrow>
            <h1 className="m-0 mb-6 font-heading text-[clamp(40px,6.5vw,68px)] font-bold uppercase leading-[0.94] text-knavy">
              Un mouvement pour un nouveau départ
            </h1>
            <p className="m-0 mb-4 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              Le Mouvement Kamerun rassemble les Camerounaises et les Camerounais qui croient
              en un pays souverain, prospère et fier de ses cultures. Porté par le Dr Jacques
              Bouhga-Hagbe et soutenu par le Mouvement citoyen national camerounais (MCNC), il
              défend un projet économique solide et une vision panafricaine.
            </p>
            <p className="m-0 mb-7 font-sans text-[17px] leading-[1.7] text-[#56607a]">
              Notre ambition : remettre le Cameroun sur la voie du développement par des
              réformes concrètes — financement de l'économie, souveraineté monétaire, emploi,
              santé et justice sociale — au service de tous les citoyens.
            </p>
            <div className="flex flex-wrap gap-[14px]">
              <Link to="/le-programme" className="rounded-[3px] bg-kred px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline">En savoir plus</Link>
              <Link to="/faire-un-don" className="rounded-[3px] bg-kgreen px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline">Soutenir</Link>
            </div>
          </div>
          <div className="relative mb-[18px] max-w-[440px] flex-1 basis-[300px]">
            <div className="aspect-[4/5] overflow-hidden rounded-[4px] bg-[#c7ced8]">
              <img src="/uploads/jacques-hagbe.webp" alt="Dr Jacques Bouhga-Hagbe" className="h-full w-full object-cover object-[center_top]" />
            </div>
            <div className="absolute bottom-[-18px] left-6 rounded-[3px] bg-knavy px-5 py-[14px] text-white shadow-[0_8px_20px_rgba(17,32,63,.25)]">
              <div className="font-heading text-[18px] font-bold uppercase tracking-[0.04em] leading-none">Dr Jacques Bouhga-Hagbe</div>
              <div className="mt-[5px] font-sans text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-kgold">Président du Mouvement Kamerun</div>
            </div>
          </div>
        </div>
      </section>

      {/* parcours */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(36px,5vw,52px)]">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {FAITS.map((f) => (
            <div key={f.d}>
              <div className={`font-heading text-[clamp(34px,5vw,46px)] font-bold leading-none ${f.c}`}>{f.v}</div>
              <div className="mt-[6px] font-sans text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.04em] text-[#56607a]">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* valeurs */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,76px)]">
        <div className="mx-auto max-w-site">
          <div className="mb-11 max-w-[680px]">
            <Eyebrow color="text-kred" className="mb-[14px]">Nos valeurs</Eyebrow>
            <h2 className="m-0 mb-[14px] font-heading text-[clamp(32px,5vw,46px)] font-bold uppercase leading-none text-knavy">
              Les principes qui nous guident
            </h2>
            <p className="m-0 font-sans text-[17px] leading-[1.6] text-[#3b465c]">
              Quatre engagements au cœur de notre action pour le Cameroun.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
            {VALEURS.map((v) => (
              <div key={v.t} className={`rounded-[4px] border border-[#e3e7ec] border-t-4 bg-white p-[30px] ${v.c}`}>
                <h3 className="m-0 mb-[10px] font-heading text-[24px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-knavy">{v.t}</h3>
                <p className="m-0 font-sans text-[15px] leading-[1.6] text-[#56607a]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vision */}
      <section className="bg-kgreen px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-[900px] text-center">
          <Eyebrow color="text-kgold" className="mb-[18px] justify-center">Notre vision</Eyebrow>
          <p className="m-0 mb-7 font-heading text-[clamp(26px,4.2vw,42px)] font-semibold uppercase leading-[1.15] text-white">
            Un Cameroun souverain et prospère, fier de ses cultures, qui reconnaît tous ses
            enfants et prend toute sa place dans une Afrique unie.
          </p>
          <Link to="/le-programme" className="inline-block rounded-[3px] bg-kgold px-7 py-4 font-sans text-[15px] font-bold leading-none text-knavy no-underline">
            Découvrir le programme
          </Link>
        </div>
      </section>
    </>
  )
}
