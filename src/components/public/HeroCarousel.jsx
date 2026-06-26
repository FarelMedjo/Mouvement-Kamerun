import { useEffect, useRef, useState } from 'react'
import Eyebrow from './Eyebrow'
import { useT } from '../../i18n/LanguageContext'

// Messages du hero. Le premier reprend la maquette d'origine ; les suivants
// déclinent le même ton. Chaque champ est bilingue ({ fr, en }), résolu via t().
const MESSAGES = [
  {
    surtitre: { fr: 'Cameroun · Le mouvement continue', en: 'Cameroon · The movement continues' },
    titre: { fr: 'Le nouveau départ', en: 'A new beginning' },
    texte: {
      fr: "Avec le Dr Jacques Bouhga-Hagbe, bâtissons un Cameroun souverain, prospère et fier — porté par un programme économique solide et une vision panafricaine.",
      en: 'With Dr Jacques Bouhga-Hagbe, let us build a sovereign, prosperous and proud Cameroon — driven by a solid economic programme and a pan-African vision.',
    },
  },
  {
    surtitre: { fr: 'Souveraineté · Prospérité', en: 'Sovereignty · Prosperity' },
    titre: { fr: 'Un Cameroun souverain', en: 'A sovereign Cameroon' },
    texte: {
      fr: "Une économie maîtrisée, une monnaie au service du crédit et de l'emploi, une gestion saine des finances publiques.",
      en: 'A controlled economy, a currency serving credit and employment, and sound management of public finances.',
    },
  },
  {
    surtitre: { fr: 'Ensemble · Partout au pays', en: 'Together · Across the country' },
    titre: { fr: 'La force du nombre', en: 'Strength in numbers' },
    texte: {
      fr: "Citoyennes et citoyens, de toutes les régions et de la diaspora, unis pour porter le changement. Rejoignez le mouvement.",
      en: 'Citizens from every region and the diaspora, united to carry change forward. Join the movement.',
    },
  },
]

const prefereReductionMouvement = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const DELAI = 6000 // ms entre deux messages

// Carrousel du hero : transition douce entre plusieurs messages.
//  - défilement automatique, en pause au survol / focus ;
//  - contrôles manuels (pastilles) ;
//  - pas d'autoplay si l'utilisateur demande moins de mouvement.
export default function HeroCarousel() {
  const t = useT()
  const [index, setIndex] = useState(0)
  const [enPause, setEnPause] = useState(false)

  useEffect(() => {
    if (enPause || prefereReductionMouvement()) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length)
    }, DELAI)
    return () => clearInterval(id)
  }, [enPause])

  const actuel = MESSAGES[index]

  return (
    <div
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
      onFocusCapture={() => setEnPause(true)}
      onBlurCapture={() => setEnPause(false)}
      aria-roledescription={t('carrousel', 'carousel')}
    >
      {/* La `key` force le rejeu du fondu d'entrée à chaque message. */}
      <div key={index} className="slide-fade" aria-live="polite">
        <Eyebrow color="text-kred" dash className="mb-[22px]">
          {t(actuel.surtitre)}
        </Eyebrow>
        <h1 className="m-0 font-heading text-[clamp(46px,8vw,78px)] font-bold uppercase leading-[0.92] tracking-[0.005em] text-knavy">
          {t(actuel.titre)}
        </h1>
        {/* drapeau tricolore */}
        <div className="my-6 flex h-[6px] w-[120px] overflow-hidden rounded-sm">
          <span className="flex-1 bg-kgreen" />
          <span className="flex-1 bg-kred" />
          <span className="flex-1 bg-kgold" />
        </div>
        <p className="m-0 mb-6 max-w-[480px] font-sans text-[19px] leading-[1.6] text-[#3b465c]">
          {t(actuel.texte)}
        </p>
      </div>

      {/* Pastilles de contrôle manuel */}
      <div className="mb-8 flex items-center gap-[10px]" role="tablist" aria-label={t('Choisir le message', 'Choose the message')}>
        {MESSAGES.map((m, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${t('Message', 'Message')} ${i + 1} : ${t(m.titre)}`}
            onClick={() => setIndex(i)}
            className={`h-[7px] rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-kgreen' : 'w-[7px] bg-[#c3cad6] hover:bg-[#9aa6bf]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
