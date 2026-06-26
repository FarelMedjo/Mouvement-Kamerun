import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

// Logo du mouvement : pastille verte avec étoile or + nom et slogan.
// `variant` = 'header' (texte marine) ou 'footer' (texte blanc).
export default function Logo({ variant = 'header' }) {
  const t = useT()
  const isFooter = variant === 'footer'
  const dotSize = isFooter ? 'h-[38px] w-[38px] text-[20px]' : 'h-11 w-11 text-[23px]'
  const nameColor = isFooter ? 'text-white' : 'text-knavy'
  const nameSize = isFooter ? 'text-[18px]' : 'text-[20px]'

  const mark = (
    <>
      <span
        className={`flex flex-none items-center justify-center rounded-full bg-kgreen text-kgold leading-none ${dotSize}`}
        aria-hidden="true"
      >
        ★
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-heading font-bold uppercase tracking-[0.05em] ${nameColor} ${nameSize}`}
        >
          {SITE.nom}
        </span>
        {!isFooter && (
          <span className="mt-[3px] font-sans text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.18em] text-kgreen">
            {t(SITE.slogan)}
          </span>
        )}
      </span>
    </>
  )

  if (isFooter) {
    return <div className="flex items-center gap-[11px]">{mark}</div>
  }

  return (
    <Link to="/" className="flex items-center gap-3 no-underline" aria-label={`${SITE.nom} — ${t('Accueil', 'Home')}`}>
      {mark}
    </Link>
  )
}
