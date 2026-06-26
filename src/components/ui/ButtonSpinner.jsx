// Petit indicateur circulaire affiché dans un bouton en état « envoi en cours ».
// `currentColor` : il prend la couleur du texte du bouton.
export default function ButtonSpinner({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[15px] w-[15px] animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px] ${className}`}
    />
  )
}
