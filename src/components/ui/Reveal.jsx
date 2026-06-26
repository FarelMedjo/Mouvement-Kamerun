import { useInView } from '../../hooks/useInView'

// Enveloppe une section ou une carte pour la faire apparaître (fondu + léger
// glissement) lorsqu'elle entre dans la vue. Une seule fois, discrètement.
//
//  - `as`    : balise rendue (div par défaut ; ex. 'section', 'article').
//  - `delay` : décalage en ms pour échelonner une grille de cartes.
//
// Le mouvement réel est porté par la classe CSS .reveal (voir index.css), qui
// est neutralisée sous prefers-reduced-motion.
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
  ...rest
}) {
  const [ref, visible] = useInView()
  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
