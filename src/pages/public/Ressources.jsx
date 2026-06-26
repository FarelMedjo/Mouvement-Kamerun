import PageBanner from '../../components/public/PageBanner'

// Bibliothèque de documents (textes de référence, programme…).
// Les liens pointeront vers les fichiers réels une fois ceux-ci fournis.
const RESSOURCES = [
  { titre: 'La Constitution de la République du Cameroun', href: '#' },
  { titre: "Acte constitutif de l'Union africaine", href: '#' },
  { titre: "Charte de l'OUA", href: '#' },
  { titre: 'Synthèse du programme de Jacques Bouhga-Hagbe', href: '#' },
]

export default function Ressources() {
  return (
    <>
      <PageBanner surtitre="Ressources" fil="Bibliothèque de documents" />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-site">
          <h1 className="m-0 mb-7 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none text-knavy">
            Ressources
          </h1>
          <div className="flex flex-col border-t border-[#e3e7ec]">
            {RESSOURCES.map((r) => (
              <a
                key={r.titre}
                href={r.href}
                className="flex items-center justify-between gap-4 border-b border-[#e3e7ec] px-1 py-[18px] no-underline"
              >
                <span className="font-sans text-[17px] font-semibold leading-[1.3] text-knavy">{r.titre}</span>
                <span className="whitespace-nowrap font-sans text-[13px] font-bold uppercase tracking-[0.06em] text-kgreen">PDF ↓</span>
              </a>
            ))}
          </div>
          <p className="mt-6 font-sans text-[14px] text-kfaint">
            Les fichiers téléchargeables seront rattachés à ces entrées une fois fournis par le
            mouvement.
          </p>
        </div>
      </section>
    </>
  )
}
