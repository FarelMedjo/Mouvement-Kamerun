import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import Reveal from '../../components/ui/Reveal'
import { useT } from '../../i18n/LanguageContext'
import { getProgrammeThemes } from '../../lib/content'

// `t` (titre) et chaque entrée de `pts` sont bilingues ({ fr, en }).
// Thèmes par défaut (repli) si la table `programme_themes` est vide ou
// inaccessible — le contenu réel est administré depuis l'espace admin.
const THEMES = [
  { n: '01', t: { fr: 'Économie & finances publiques', en: 'Economy & public finances' }, pts: [{ fr: "Un nouveau modèle de financement de l'économie", en: 'A new model for financing the economy' }, { fr: 'Une gestion saine des finances publiques', en: 'Sound management of public finances' }, { fr: "Informatisation de l'économie et réforme fiscale", en: 'Digitalising the economy and tax reform' }], c: 'kgreen' },
  { n: '02', t: { fr: 'Souveraineté monétaire', en: 'Monetary sovereignty' }, pts: [{ fr: "Un système monétaire national au service du crédit et de l'emploi", en: 'A national monetary system serving credit and employment' }, { fr: 'Un réseau financier des peuples pour les échanges internationaux', en: 'A peoples’ financial network for international trade' }], c: 'kred' },
  { n: '03', t: { fr: 'Emploi & entreprises', en: 'Employment & enterprise' }, pts: [{ fr: "Une nouvelle politique de l'emploi pour la jeunesse", en: 'A new employment policy for young people' }, { fr: 'Des entreprises populaires pour bâtir les infrastructures publiques', en: 'Community enterprises to build public infrastructure' }], c: 'kgold' },
  { n: '04', t: { fr: 'Protection sociale & santé', en: 'Social protection & health' }, pts: [{ fr: 'Un système de protection sociale pour tous', en: 'A social protection system for all' }, { fr: 'Un système de santé accessible sur tout le territoire', en: 'A health system accessible across the country' }], c: 'knavy' },
  { n: '05', t: { fr: 'Territoire & foncier', en: 'Territory & land' }, pts: [{ fr: "Un aménagement favorisant l'intégration africaine", en: 'Spatial planning that fosters African integration' }, { fr: 'Une réforme foncière au profit de tous', en: 'Land reform that benefits everyone' }], c: 'kgreen' },
  { n: '06', t: { fr: 'Culture & identité', en: 'Culture & identity' }, pts: [{ fr: 'Un Cameroun fier de ses cultures, traditions et langues', en: 'A Cameroon proud of its cultures, traditions and languages' }, { fr: 'Un Cameroun qui reconnaît tous ses enfants', en: 'A Cameroon that recognises all its children' }], c: 'kred' },
  { n: '07', t: { fr: 'Institutions & gouvernance', en: 'Institutions & governance' }, pts: [{ fr: 'Une réforme constitutionnelle et un pouvoir judiciaire indépendant', en: 'Constitutional reform and an independent judiciary' }, { fr: 'Un équilibre clair des pouvoirs et des mandats', en: 'A clear balance of powers and mandates' }], c: 'knavy' },
  { n: '08', t: { fr: 'Éducation, recherche & intégration', en: 'Education, research & integration' }, pts: [{ fr: 'Une éducation nationale et une recherche renforcées', en: 'Strengthened national education and research' }, { fr: "L'unité africaine : Fonds monétaire et université panafricains", en: 'African unity: a pan-African monetary fund and university' }], c: 'kgold' },
]

const ACCENT = {
  kgreen: { bord: 'border-t-kgreen', txt: 'text-kgreen', puce: 'text-kgreen' },
  kred: { bord: 'border-t-kred', txt: 'text-kred', puce: 'text-kred' },
  kgold: { bord: 'border-t-kgold', txt: 'text-[#b58f00]', puce: 'text-[#b58f00]' },
  knavy: { bord: 'border-t-knavy', txt: 'text-knavy', puce: 'text-knavy' },
}

// Met une ligne de la table `programme_themes` au format attendu par le rendu
// ({ n, t: {fr,en}, pts: [{fr,en}], c }). Le numéro « 01 » est dérivé de la
// position ; le texte EN retombe sur le FR s'il manque.
function adapterTheme(row, i) {
  const ptsFr = row.points || []
  const ptsEn = row.points_en || []
  return {
    n: String(i + 1).padStart(2, '0'),
    t: { fr: row.titre, en: row.titre_en || row.titre },
    pts: ptsFr.map((p, j) => ({ fr: p, en: ptsEn[j] || p })),
    c: ACCENT[row.couleur] ? row.couleur : 'knavy',
  }
}

export default function Programme() {
  const t = useT()
  // Repli immédiat sur les thèmes codés en dur, remplacés par ceux de la base
  // dès qu'ils sont chargés (et seulement s'il y en a).
  const [themes, setThemes] = useState(THEMES)
  useEffect(() => {
    getProgrammeThemes()
      .then((rows) => {
        if (rows && rows.length) setThemes(rows.map(adapterTheme))
      })
      .catch(() => {})
  }, [])
  return (
    <>
      <PageBanner surtitre={t('Le programme', 'The programme')} fil={t('Le programme', 'The programme')} />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(20px,3vw,32px)] pt-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className="m-0 mb-[18px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
            {t('Mes propositions pour le Cameroun', 'My proposals for Cameroon')}
          </h1>
          <p className="m-0 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
            {t(
              "Un projet structurant organisé par grands thèmes. Explorez les propositions et téléchargez la synthèse du programme ou l'ouvrage complet.",
              'A structuring project organised by major themes. Explore the proposals and download the programme summary or the full book.',
            )}
          </p>
        </div>
      </section>

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,72px)] pt-[clamp(20px,3vw,32px)]">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
          {themes.map((th, i) => {
            const a = ACCENT[th.c]
            return (
              <Reveal
                as="div"
                key={th.n}
                delay={(i % 3) * 80}
                className={`group rounded-[5px] border border-[#e3e7ec] border-t-4 bg-white p-[30px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(17,32,63,.12)] ${a.bord}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`font-heading text-[13px] font-bold uppercase tracking-[0.06em] ${a.txt}`}>{t('Thème', 'Theme')} {th.n}</div>
                  <span className={`text-[18px] transition-transform duration-200 group-hover:translate-x-1 ${a.txt}`}>→</span>
                </div>
                <h3 className="m-0 mb-[14px] font-heading text-[26px] font-semibold uppercase leading-[1.02] tracking-[0.02em] text-knavy">{t(th.t)}</h3>
                <div className="flex flex-col gap-[9px]">
                  {th.pts.map((p) => (
                    <div key={p.fr} className="flex gap-[10px] font-sans text-[15px] leading-[1.5] text-[#56607a]">
                      <span className={`font-bold ${a.puce}`}>·</span>
                      {t(p)}
                    </div>
                  ))}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* documents */}
      <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
        <div className="mx-auto max-w-site">
          <div className="mb-8">
            <Eyebrow color="text-kred" className="mb-3">{t('Documents', 'Documents')}</Eyebrow>
            <h2 className="m-0 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none text-knavy">
              {t('Téléchargez le programme', 'Download the programme')}
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
            <div className="flex flex-wrap items-center gap-6 rounded-[5px] bg-knavy p-8">
              <div className="w-[120px] flex-none overflow-hidden rounded-[3px] shadow-[0_8px_20px_rgba(0,0,0,.35)]">
                <img src="/uploads/71pZImYrlSL._SY522_.jpg" alt="Kamerun — Propositions pour un nouveau départ" className="block w-full" />
              </div>
              <div className="flex-1 basis-[180px]">
                <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgold">{t("L'ouvrage", 'The book')}</div>
                <h3 className="m-0 mb-[10px] font-heading text-[26px] font-bold uppercase leading-[1.02] text-white">{t('Kamerun — Propositions pour un nouveau départ', 'Kamerun — Proposals for a new beginning')}</h3>
                <p className="m-0 mb-[14px] font-sans text-[14px] leading-[1.55] text-[#aeb9d0]">{t('La vision et les propositions, détaillées et argumentées.', 'The vision and proposals, detailed and argued.')}</p>
                <span className="inline-block rounded-[3px] bg-kgold px-[18px] py-3 font-sans text-[14px] font-bold leading-none text-knavy">{t('Commander le livre', 'Order the book')}</span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[5px] border border-[#e3e7ec] bg-white p-8">
              <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-kgreen">PDF</div>
              <h3 className="m-0 mb-[10px] font-heading text-[30px] font-bold uppercase leading-[1.02] text-knavy">{t('Synthèse du programme', 'Programme summary')}</h3>
              <p className="m-0 mb-[18px] font-sans text-[15px] leading-[1.6] text-[#56607a]">
                {t("L'essentiel des propositions du Mouvement Kamerun en un document à télécharger.", 'The key proposals of Mouvement Kamerun in a single downloadable document.')}
              </p>
              <Link to="/ressources" className="inline-flex items-center gap-2 font-sans text-[15px] font-bold leading-none text-kred no-underline">
                {t('Télécharger le PDF', 'Download the PDF')} <span className="text-[17px]">↓</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kgreen px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)] text-center">
        <div className="mx-auto max-w-[680px]">
          <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,5vw,46px)] font-bold uppercase leading-none text-white">
            {t('Vous partagez cette vision ?', 'Do you share this vision?')}
          </h2>
          <p className="m-0 mb-7 font-sans text-[17px] leading-[1.6] text-[#d7ece1]">
            {t('Rejoignez le Mouvement Kamerun et soutenez un programme pour un nouveau départ.', 'Join Mouvement Kamerun and support a programme for a new beginning.')}
          </p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            <Link to="/faire-un-don" className="rounded-[3px] bg-kgold px-7 py-4 font-sans text-[15px] font-bold leading-none text-knavy no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_8px_20px_rgba(252,209,22,.35)]">{t('Soutenir le mouvement', 'Support the movement')}</Link>
            <Link to="/benevoles" className="rounded-[3px] border-2 border-white/60 bg-transparent px-[26px] py-[14px] font-sans text-[15px] font-bold leading-none text-white no-underline transition-colors duration-200 hover:border-white hover:bg-white/10">{t('Devenir bénévole', 'Become a volunteer')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
