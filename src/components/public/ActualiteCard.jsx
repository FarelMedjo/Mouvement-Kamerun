import { formatDateLongue } from '../../lib/dates'

// Carte d'actualité (grille). Données issues de la table actualites.
export default function ActualiteCard({ actualite }) {
  const { titre, contenu, image_url, created_at } = actualite
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-kline">
      <div className="aspect-[16/9] overflow-hidden bg-[#cdd4dd]">
        {image_url ? (
          <img
            src={image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c7ced8] to-[#dfe4ea] text-kgold">
            <span className="font-heading text-[28px]">★</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 font-sans text-[12px] font-semibold leading-none text-[#9aa6bf]">
          {formatDateLongue(created_at)}
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
          Lire <span className="text-[16px]">→</span>
        </span>
      </div>
    </article>
  )
}
