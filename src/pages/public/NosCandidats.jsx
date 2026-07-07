import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import StateMessage from '../../components/public/StateMessage'
import Reveal from '../../components/ui/Reveal'
import { useLang } from '../../i18n/LanguageContext'
import { getCandidats } from '../../lib/content'
import { TYPES_ELECTION } from '../../config/site'

// Repli codé en dur si la table `candidats` est vide ou inaccessible (avant
// l'application de la migration) — le contenu réel est administré depuis
// l'espace admin (« Contenus → Candidats »). Comme pour Programme.jsx.
const REPLI = [
  { id: 'repli-bouhga-hagbe', nom: 'Dr Jacques Bouhga-Hagbe', type_election: 'presidentielle', circonscription: null, bio: null, bio_en: null, photo_url: null, ordre: 1 },
]

// Classes littérales par couleur d'accent (pas de classe dynamique → pas de
// purge CSS). L'or utilise un ton lisible sur fond blanc, comme Programme.jsx.
const ACCENT = {
  kgreen: { bord: 'border-t-kgreen', txt: 'text-kgreen', avatar: 'bg-kgreen' },
  kred: { bord: 'border-t-kred', txt: 'text-kred', avatar: 'bg-kred' },
  kgold: { bord: 'border-t-kgold', txt: 'text-[#b58f00]', avatar: 'bg-kgold' },
}

// Initiales (2 lettres max) pour l'avatar de repli quand aucune photo n'est
// fournie.
function initiales(nom) {
  return (nom || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join('')
}

function CarteCandidat({ candidat, accent, lang, t }) {
  const a = ACCENT[accent] || ACCENT.kgreen
  const bio = lang === 'en' && candidat.bio_en ? candidat.bio_en : candidat.bio
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[5px] border border-[#e3e7ec] border-t-4 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(17,32,63,.12)] ${a.bord}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-klight">
        {candidat.photo_url ? (
          <img src={candidat.photo_url} alt={candidat.nom} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${a.avatar}`}>
            <span className="font-heading text-[44px] font-bold uppercase leading-none text-white/90">
              {initiales(candidat.nom)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {candidat.circonscription && (
          <div className={`mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.08em] ${a.txt}`}>
            {candidat.circonscription}
          </div>
        )}
        <h3 className="m-0 font-heading text-[24px] font-bold uppercase leading-[1.05] text-knavy">
          {candidat.nom}
        </h3>
        {bio && (
          <p className="m-0 mt-3 font-sans text-[15px] leading-[1.6] text-[#56607a]">{bio}</p>
        )}
      </div>
    </div>
  )
}

export default function NosCandidats() {
  const { lang, t } = useLang()
  // Repli immédiat (Jacques Bougha en présidentielle), remplacé par les données
  // de la base dès qu'elles sont chargées — et seulement s'il y en a.
  const [candidats, setCandidats] = useState(REPLI)
  useEffect(() => {
    getCandidats()
      .then((rows) => {
        if (rows && rows.length) setCandidats(rows)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <PageBanner surtitre={t('Nos candidats', 'Our candidates')} fil={t('Nos candidats', 'Our candidates')} />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(20px,3vw,32px)] pt-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className="m-0 mb-[18px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
            {t('Les candidats du mouvement', 'The movement’s candidates')}
          </h1>
          <p className="m-0 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
            {t(
              'Les femmes et les hommes que le Mouvement Kamerun soutient aux élections présidentielle, législatives et municipales.',
              'The women and men supported by Mouvement Kamerun in the presidential, legislative and municipal elections.',
            )}
          </p>
        </div>
      </section>

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(48px,6vw,72px)] pt-[clamp(20px,3vw,32px)]">
        <div className="mx-auto flex max-w-site flex-col gap-[clamp(36px,5vw,56px)]">
          {TYPES_ELECTION.map(({ cle, label, accent }) => {
            const liste = candidats.filter((c) => c.type_election === cle)
            const a = ACCENT[accent] || ACCENT.kgreen
            return (
              <div key={cle}>
                <div className="mb-6">
                  <Eyebrow color={a.txt} className="mb-3">
                    {t('Élection', 'Election')}
                  </Eyebrow>
                  <h2 className="m-0 font-heading text-[clamp(28px,4vw,42px)] font-bold uppercase leading-none text-knavy">
                    {t(label)}
                  </h2>
                </div>
                {liste.length === 0 ? (
                  <StateMessage>
                    {t('Les candidats seront annoncés prochainement.', 'Candidates will be announced soon.')}
                  </StateMessage>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
                    {liste.map((c, i) => (
                      <Reveal as="div" key={c.id} delay={(i % 3) * 80}>
                        <CarteCandidat candidat={c} accent={accent} lang={lang} t={t} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kgreen px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)] text-center">
        <div className="mx-auto max-w-[680px]">
          <h2 className="m-0 mb-[14px] font-heading text-[clamp(30px,5vw,46px)] font-bold uppercase leading-none text-white">
            {t('Soutenez nos candidats', 'Support our candidates')}
          </h2>
          <p className="m-0 mb-7 font-sans text-[17px] leading-[1.6] text-[#d7ece1]">
            {t(
              'Rejoignez le Mouvement Kamerun et portez avec nous un nouveau départ pour le Cameroun.',
              'Join Mouvement Kamerun and help us carry a new beginning for Cameroon.',
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            <Link to="/adhesion" className="rounded-[3px] bg-kgold px-7 py-4 font-sans text-[15px] font-bold leading-none text-knavy no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_8px_20px_rgba(252,209,22,.35)]">
              {t('Adhérer au mouvement', 'Join the movement')}
            </Link>
            <Link to="/benevoles" className="rounded-[3px] border-2 border-white/60 bg-transparent px-[26px] py-[14px] font-sans text-[15px] font-bold leading-none text-white no-underline transition-colors duration-200 hover:border-white hover:bg-white/10">
              {t('Devenir bénévole', 'Become a volunteer')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
