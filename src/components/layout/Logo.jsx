import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

// Logo du mouvement : drapeau camerounais circulaire (vert-rouge-jaune, étoile
// or sur la bande rouge) + nom et slogan.
// `variant` = 'header' (texte marine) ou 'footer' (texte blanc).
export default function Logo({ variant = 'header' }) {
  const t = useT()
  const isFooter = variant === 'footer'
  const dotSize = isFooter ? 'h-[38px] w-[38px]' : 'h-11 w-11'
  const nameColor = isFooter ? 'text-white' : 'text-knavy'
  const nameSize = isFooter ? 'text-[18px]' : 'text-[20px]'

  const mark = (
    <>
      <svg
        viewBox="0 0 48 48"
        className={`flex-none rounded-full ${dotSize}`}
        role="img"
        aria-label="Mouvement Kamerun"
      >
        <clipPath id="mk-flag-circle">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <g clipPath="url(#mk-flag-circle)">
          <rect x="0" y="0" width="16" height="48" fill="#0B6B43" />
          <rect x="16" y="0" width="16" height="48" fill="#CE1126" />
          <rect x="32" y="0" width="16" height="48" fill="#FCD116" />
          <polygon
            fill="#FCD116"
            points="24,16.8 25.616,21.775 30.848,21.775 26.615,24.85 28.232,29.825 24,26.75 19.768,29.825 21.385,24.85 17.152,21.775 22.384,21.775"
          />
        </g>
      </svg>
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
