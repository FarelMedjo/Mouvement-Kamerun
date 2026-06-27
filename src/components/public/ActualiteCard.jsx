import { formatDateLongue } from '../../lib/dates'
import { useLang } from '../../i18n/LanguageContext'

// Carte d'actualité (grille). Données issues de la table actualites.
export default function ActualiteCard({ actualite }) {
  const { lang, t } = useLang()
  const { titre_en, contenu_en, image_url, created_at } = actualite
  // Repli sur le FR si la version EN est absente (même logique que le programme).
  const titre = t({ fr: actualite.titre, en: titre_en || actualite.titre })
  const contenu = t({ fr: actualite.contenu, en: contenu_en || actualite.contenu })
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-kline transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_32px_rgba(17,32,63,.12)]">
      <div className="aspect-[16/9] overflow-hidden bg-[#cdd4dd]">
        {image_url ? (
          <img
            src={image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c7ced8] to-[#dfe4ea] text-kgold">
            <span className="font-heading text-[28px]">★</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 font-sans text-[12px] font-semibold leading-none text-[#9aa6bf]">
          {formatDateLongue(created_at, lang)}
        </div>
        <h3 className="m-0 mb-[10px] font-heading text-[22px] font-semibold uppercase leading-[1.08] tracking-[0.01em] text-knavy">
          {titre}
        </h3>
        {contenu && (
          <p className="m-0 mb-[18px] line-clamp-3 font-sans text-[15px] leading-[1.6] text-[#56607a]">
            {contenu}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 font-sans text-[14px] font-bold leading-none text-kred">
          {t('Lire', 'Read')}{' '}
          <span className="text-[16px] transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </article>
  )
}
