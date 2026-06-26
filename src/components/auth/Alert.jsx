// Bandeau de message (erreur ou succès) au-dessus des formulaires d'auth.
export default function Alert({ type = 'error', children }) {
  if (!children) return null
  const styles =
    type === 'success'
      ? 'border-kgreen/30 bg-kgreen/10 text-kgreen'
      : 'border-kred/30 bg-kred/10 text-kred'
  return (
    <div
      role="alert"
      className={`mb-4 rounded-md border px-4 py-3 font-sans text-[14px] leading-[1.45] ${styles}`}
    >
      {children}
    </div>
  )
}
