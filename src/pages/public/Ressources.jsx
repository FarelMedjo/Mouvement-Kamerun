import PageBanner from '../../components/public/PageBanner'
import { useT } from '../../i18n/LanguageContext'

// Bibliothèque de documents (textes de référence, programme…).
// Les liens pointeront vers les fichiers réels une fois ceux-ci fournis.
// `titre` bilingue ({ fr, en }).
const RESSOURCES = [
  { titre: { fr: 'La Constitution de la République du Cameroun', en: 'The Constitution of the Republic of Cameroon' }, href: '#' },
  { titre: { fr: "Acte constitutif de l'Union africaine", en: 'Constitutive Act of the African Union' }, href: '#' },
  { titre: { fr: "Charte de l'OUA", en: 'Charter of the OAU' }, href: '#' },
  { titre: { fr: 'Synthèse du programme de Jacques Bouhga-Hagbe', en: 'Summary of Jacques Bouhga-Hagbe’s programme' }, href: '#' },
]

export default function Ressources() {
  const t = useT()
  return (
    <>
      <PageBanner surtitre={t('Ressources', 'Resources')} fil={t('Bibliothèque de documents', 'Document library')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,64px)]">
        <div className="mx-auto max-w-site">
          <h1 className="m-0 mb-7 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none text-knavy">
            {t('Ressources', 'Resources')}
          </h1>
          <div className="flex flex-col border-t border-[#e3e7ec]">
            {RESSOURCES.map((r) => (
              <a
                key={r.titre.fr}
                href={r.href}
                className="flex items-center justify-between gap-4 border-b border-[#e3e7ec] px-1 py-[18px] no-underline"
              >
                <span className="font-sans text-[17px] font-semibold leading-[1.3] text-knavy">{t(r.titre)}</span>
                <span className="whitespace-nowrap font-sans text-[13px] font-bold uppercase tracking-[0.06em] text-kgreen">PDF ↓</span>
              </a>
            ))}
          </div>
          <p className="mt-6 font-sans text-[14px] text-kfaint">
            {t(
              'Les fichiers téléchargeables seront rattachés à ces entrées une fois fournis par le mouvement.',
              'Downloadable files will be attached to these entries once provided by the movement.',
            )}
          </p>
        </div>
      </section>
    </>
  )
}
