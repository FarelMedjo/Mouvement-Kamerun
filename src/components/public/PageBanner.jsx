import { Link } from 'react-router-dom'

// Bandeau de page (fond marine) repris des maquettes : surtitre or + fil
// d'Ariane.
export default function PageBanner({ surtitre, fil }) {
  return (
    <div className="bg-knavy px-[clamp(16px,5vw,44px)] py-[clamp(28px,4vw,40px)]">
      <div className="mx-auto max-w-site">
        <div className="mb-[10px] font-sans text-[12px] font-semibold uppercase leading-none tracking-[0.14em] text-kgold">
          {surtitre}
        </div>
        <div className="font-sans text-[13px] font-semibold leading-none text-kmuted">
          <Link to="/" className="text-kmuted no-underline hover:text-white">
            Accueil
          </Link>{' '}
          · {fil}
        </div>
      </div>
    </div>
  )
}
