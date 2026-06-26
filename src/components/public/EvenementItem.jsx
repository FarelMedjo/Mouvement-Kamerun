import { partsDate } from '../../lib/dates'
import { useLang } from '../../i18n/LanguageContext'

// Ligne d'événement (liste « à venir » / « passés »). Données : table evenements.
// `accent` = classe couleur de la barre gauche et du jour.
const ACCENTS = {
  kgreen: { bord: 'border-l-kgreen', texte: 'text-kgreen' },
  kred: { bord: 'border-l-kred', texte: 'text-kred' },
  kgold: { bord: 'border-l-kgold', texte: 'text-[#b58f00]' },
}

export default function EvenementItem({ evenement, accent = 'kgreen' }) {
  const { lang } = useLang()
  const { titre, lieu, date_event } = evenement
  const { jour, mois } = partsDate(date_event, lang)
  const a = ACCENTS[accent] ?? ACCENTS.kgreen

  return (
    <article
      className={`flex flex-wrap items-center gap-[clamp(16px,3vw,28px)] rounded-md border border-kline border-l-4 p-[18px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,32,63,.10)] ${a.bord}`}
    >
      <div className="w-[74px] flex-none text-center">
        <div className={`font-heading text-[34px] font-bold leading-none ${a.texte}`}>{jour}</div>
        <div className="mt-1 font-sans text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-[#56607a]">
          {mois}
        </div>
      </div>
      <div className="flex-1 basis-[220px]">
        {lieu && (
          <div className="mb-[6px] font-sans text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-[#9aa6bf]">
            {lieu}
          </div>
        )}
        <h3 className="m-0 font-heading text-[23px] font-semibold uppercase leading-[1.05] tracking-[0.01em] text-knavy">
          {titre}
        </h3>
      </div>
    </article>
  )
}
