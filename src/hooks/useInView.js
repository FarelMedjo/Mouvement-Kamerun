import { useEffect, useRef, useState } from 'react'

// Détecte l'entrée d'un élément dans la zone visible via Intersection Observer.
// Retourne [ref, visible]. Par défaut l'animation ne se joue qu'une fois
// (`once`), pour ne pas rejouer en boucle au défilement.
//
// Repli : si IntersectionObserver est absent (très vieux navigateur, SSR),
// on considère l'élément comme visible afin de ne jamais masquer le contenu.
export function useInView({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  once = true,
} = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}
