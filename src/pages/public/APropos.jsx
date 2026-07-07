import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import { useT } from '../../i18n/LanguageContext'

// `d` (et `t`) bilingues ({ fr, en }), résolus à l'affichage via le helper i18n.
const VALEURS = [
  { t: { fr: 'Souveraineté', en: 'Sovereignty' }, d: { fr: 'Une économie et une monnaie au service du peuple camerounais et de son indépendance.', en: 'An economy and a currency serving the Cameroonian people and their independence.' }, c: 'border-t-kgreen' },
  { t: { fr: 'Justice sociale', en: 'Social justice' }, d: { fr: 'Une protection sociale, une santé et un emploi accessibles à tous, sans exclusion.', en: 'Social protection, healthcare and employment accessible to all, without exclusion.' }, c: 'border-t-kred' },
  { t: { fr: 'Panafricanisme', en: 'Pan-Africanism' }, d: { fr: "L'unité des peuples africains et l'intégration du continent comme horizon commun.", en: 'The unity of African peoples and the integration of the continent as a shared horizon.' }, c: 'border-t-kgold' },
  { t: { fr: 'Intégrité', en: 'Integrity' }, d: { fr: 'Une gestion des finances publiques saine, transparente et responsable.', en: 'Sound, transparent and accountable management of public finances.' }, c: 'border-t-knavy' },
]

export default function APropos() {
  const t = useT()
  return (
    <>
      <PageBanner surtitre={t('À propos', 'About')} fil={t('Le mouvement', 'The movement')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,72px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-center gap-[clamp(32px,5vw,56px)]">
          <div className="flex-1 basis-[360px]">
            <Eyebrow color="text-kred" dash className="mb-5">{t('Le mouvement', 'The movement')}</Eyebrow>
            <h1 className="m-0 mb-6 font-heading text-[clamp(40px,6.5vw,68px)] font-bold uppercase leading-[0.94] text-knavy">
              {t('Un mouvement pour un nouveau départ', 'A movement for a new beginning')}
            </h1>
            <p className="m-0 mb-4 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              {t(
                'Le Mouvement Kamerun rassemble les Camerounaises et les Camerounais qui croient en un pays souverain, prospère et fier de ses cultures. Porté par le Dr Jacques Bouhga-Hagbe et soutenu par le Mouvement citoyen national camerounais (MCNC), il défend un projet économique solide et une vision panafricaine.',
                'Mouvement Kamerun brings together Cameroonian women and men who believe in a sovereign, prosperous country proud of its cultures. Led by Dr Jacques Bouhga-Hagbe and supported by the Cameroonian National Citizens’ Movement (MCNC), it stands for a solid economic project and a pan-African vision.',
              )}
            </p>
            <p className="m-0 mb-7 font-sans text-[17px] leading-[1.7] text-[#56607a]">
              {t(
                "Notre ambition : remettre le Cameroun sur la voie du développement par des réformes concrètes — financement de l'économie, souveraineté monétaire, emploi, santé et justice sociale — au service de tous les citoyens.",
                'Our ambition: to put Cameroon back on the path of development through concrete reforms — financing the economy, monetary sovereignty, employment, health and social justice — for the benefit of all citizens.',
              )}
            </p>
            <div className="flex flex-wrap gap-[14px]">
              <Link to="/le-programme" className="rounded-[3px] bg-kred px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline">{t('En savoir plus', 'Learn more')}</Link>
              <Link to="/faire-un-don" className="rounded-[3px] bg-kgreen px-[26px] py-4 font-sans text-[15px] font-bold leading-none text-white no-underline">{t('Soutenir', 'Support')}</Link>
            </div>
          </div>
          <div className="mb-[18px] max-w-[440px] flex-1 basis-[300px]">
            <div className="overflow-hidden rounded-[4px] bg-[#c7ced8]">
              <img src="/uploads/banniere-mouvement-kamerun.jpg" alt="Mouvement Kamerun — Unis pour un Kamerun fort et solidaire" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* valeurs */}
      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,76px)]">
        <div className="mx-auto max-w-site">
          <div className="mb-11 max-w-[680px]">
            <Eyebrow color="text-kred" className="mb-[14px]">{t('Nos valeurs', 'Our values')}</Eyebrow>
            <h2 className="m-0 mb-[14px] font-heading text-[clamp(32px,5vw,46px)] font-bold uppercase leading-none text-knavy">
              {t('Les principes qui nous guident', 'The principles that guide us')}
            </h2>
            <p className="m-0 font-sans text-[17px] leading-[1.6] text-[#3b465c]">
              {t('Quatre engagements au cœur de notre action pour le Cameroun.', 'Four commitments at the heart of our action for Cameroon.')}
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
            {VALEURS.map((v) => (
              <div key={v.t.fr} className={`rounded-[4px] border border-[#e3e7ec] border-t-4 bg-white p-[30px] ${v.c}`}>
                <h3 className="m-0 mb-[10px] font-heading text-[24px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-knavy">{t(v.t)}</h3>
                <p className="m-0 font-sans text-[15px] leading-[1.6] text-[#56607a]">{t(v.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vision */}
      <section className="bg-kgreen px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-[900px] text-center">
          <Eyebrow color="text-kgold" className="mb-[18px] justify-center">{t('Notre vision', 'Our vision')}</Eyebrow>
          <p className="m-0 mb-7 font-heading text-[clamp(26px,4.2vw,42px)] font-semibold uppercase leading-[1.15] text-white">
            {t(
              'Un Cameroun souverain et prospère, fier de ses cultures, qui reconnaît tous ses enfants et prend toute sa place dans une Afrique unie.',
              'A sovereign and prosperous Cameroon, proud of its cultures, that recognises all its children and takes its full place in a united Africa.',
            )}
          </p>
          <Link to="/le-programme" className="inline-block rounded-[3px] bg-kgold px-7 py-4 font-sans text-[15px] font-bold leading-none text-knavy no-underline">
            {t('Découvrir le programme', 'Discover the programme')}
          </Link>
        </div>
      </section>
    </>
  )
}
