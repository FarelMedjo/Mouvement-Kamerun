import { Link } from 'react-router-dom'
import Logo from './Logo'
import { SITE, NAV_FOOTER } from '../../config/site'

// Pied de page (fond marine) : présentation, liens rapides, contacts, réseaux.
export default function Footer() {
  return (
    <footer className="bg-knavy px-[clamp(16px,5vw,44px)] pb-[30px] pt-[clamp(40px,5vw,54px)]">
      <div className="mx-auto max-w-site">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          {/* Présentation */}
          <div>
            <div className="mb-4">
              <Logo variant="footer" />
            </div>
            <p className="m-0 max-w-[260px] font-sans text-[14px] font-normal leading-[1.6] text-kmuted">
              {SITE.description}
            </p>
            <p className="mt-3 max-w-[260px] font-sans text-[12px] font-semibold leading-[1.55] text-[#cbd5e1]">
              {SITE.soutien}
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <div className="mb-4 font-sans text-[13px] font-bold uppercase leading-none tracking-[0.1em] text-kgold">
              Liens rapides
            </div>
            <div className="flex flex-col gap-[10px] font-sans text-[14px] font-normal leading-none">
              {NAV_FOOTER.map((item) => (
                <Link key={item.to} to={item.to} className="text-[#cfd6e4] no-underline hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div className="mb-4 font-sans text-[13px] font-bold uppercase leading-none tracking-[0.1em] text-kgold">
              Contactez-nous
            </div>
            <div className="flex flex-col gap-[10px] font-sans text-[14px] font-normal leading-[1.5] text-[#cfd6e4]">
              <a href={`mailto:${SITE.emails.mouvement}`} className="text-[#cfd6e4] no-underline hover:text-white">
                {SITE.emails.mouvement}
              </a>
              <a href={`mailto:${SITE.emails.gmail}`} className="text-[#cfd6e4] no-underline hover:text-white">
                {SITE.emails.gmail}
              </a>
              {SITE.telephones.map((tel) => (
                <span key={tel}>{tel}</span>
              ))}
              <Link to="/contact" className="mt-1 font-bold text-kgold no-underline">
                Formulaire de contact →
              </Link>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <div className="mb-4 font-sans text-[13px] font-bold uppercase leading-none tracking-[0.1em] text-kgold">
              Suivez-nous
            </div>
            <div className="flex gap-[10px]">
              {SITE.reseaux.map((r) => (
                <a
                  key={r.nom}
                  href={r.url}
                  aria-label={r.nom}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-sans text-[13px] font-bold leading-none text-white no-underline hover:bg-white/20"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[34px] border-t border-white/10 pt-5 font-sans text-[13px] font-normal leading-[1.5] text-kfaint">
          © 2026 {SITE.nom}. Tous droits réservés. · Mentions légales
        </div>
      </div>
    </footer>
  )
}
