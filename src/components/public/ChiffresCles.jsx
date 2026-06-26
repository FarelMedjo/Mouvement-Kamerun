import Compteur from '../ui/Compteur'
import Eyebrow from './Eyebrow'
import { useInView } from '../../hooks/useInView'
import { useT } from '../../i18n/LanguageContext'

// Section « chiffres clés » : compteurs qui s'incrémentent à l'apparition.
// ⚠️ Valeurs à confirmer par le mouvement — ce sont des ordres de grandeur de
// présentation, à remplacer par les chiffres réels. « Régions couvertes : 10 »
// correspond aux 10 régions du Cameroun.
const CHIFFRES = [
  { valeur: 12000, suffixe: '+', label: { fr: 'Soutiens et sympathisants', en: 'Supporters and sympathisers' } },
  { valeur: 850, suffixe: '+', label: { fr: 'Bénévoles engagés', en: 'Committed volunteers' } },
  { valeur: 10, suffixe: '', label: { fr: 'Régions couvertes', en: 'Regions covered' } },
  { valeur: 8, suffixe: '', label: { fr: 'Grands axes du programme', en: 'Key programme pillars' } },
]

export default function ChiffresCles() {
  const t = useT()
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <section className="bg-knavy px-[clamp(16px,5vw,44px)] py-[clamp(48px,6vw,72px)]">
      <div ref={ref} className="mx-auto max-w-site">
        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <Eyebrow color="text-kgold" className="mb-[14px] justify-center">
            {t('Le mouvement en chiffres', 'The movement in numbers')}
          </Eyebrow>
          <h2 className="m-0 font-heading text-[clamp(30px,4.5vw,44px)] font-bold uppercase leading-none text-white">
            {t('Une dynamique qui grandit', 'A growing momentum')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-9 text-center md:grid-cols-4">
          {CHIFFRES.map((c, i) => (
            <div
              key={c.label.fr}
              className={`reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="font-heading text-[clamp(38px,6vw,58px)] font-bold leading-none text-kgold">
                <Compteur valeur={c.valeur} suffixe={c.suffixe} />
              </div>
              <div className="mx-auto mt-3 max-w-[160px] font-sans text-[14px] font-semibold leading-[1.4] text-[#aeb9d0]">
                {t(c.label)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
