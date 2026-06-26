import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'

const prefereReductionMouvement = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Compteur qui s'incrémente jusqu'à `valeur` quand il devient visible.
// `duree` en ms. `prefixe`/`suffixe` encadrent le nombre (ex. « + », « % »).
// Le séparateur de milliers est l'espace insécable (convention française).
// Sous prefers-reduced-motion, on affiche directement la valeur finale.
export default function Compteur({
  valeur = 0,
  duree = 1600,
  prefixe = '',
  suffixe = '',
  className = '',
}) {
  const [ref, visible] = useInView({ threshold: 0.4 })
  const [valeurAffichee, setValeurAffichee] = useState(0)
  const demarre = useRef(false)

  useEffect(() => {
    if (!visible || demarre.current) return
    demarre.current = true

    if (prefereReductionMouvement()) {
      setValeurAffichee(valeur)
      return
    }

    let frame
    let debut = null
    const animer = (t) => {
      if (debut === null) debut = t
      const progres = Math.min((t - debut) / duree, 1)
      // Adoucissement (easeOutCubic) pour une fin de course naturelle.
      const eased = 1 - Math.pow(1 - progres, 3)
      setValeurAffichee(Math.round(eased * valeur))
      if (progres < 1) frame = requestAnimationFrame(animer)
    }
    frame = requestAnimationFrame(animer)
    return () => cancelAnimationFrame(frame)
  }, [visible, valeur, duree])

  return (
    <span ref={ref} className={className}>
      {prefixe}
      {valeurAffichee.toLocaleString('fr-FR')}
      {suffixe}
    </span>
  )
}
