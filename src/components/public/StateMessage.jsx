// Message d'état neutre (chargement / vide / erreur) pour les sections
// alimentées par la base.
export default function StateMessage({ children }) {
  return (
    <div className="rounded-md border border-dashed border-kline bg-white px-5 py-6 font-sans text-[15px] text-kfaint">
      {children}
    </div>
  )
}
