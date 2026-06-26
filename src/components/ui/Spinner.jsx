// Petit indicateur de chargement plein écran (pendant la résolution de session).
export default function Spinner({ label = 'Chargement…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-klight px-6 py-20">
      <span
        className="h-9 w-9 animate-spin rounded-full border-[3px] border-kline border-t-kgreen"
        aria-hidden="true"
      />
      <span className="font-sans text-[14px] text-kfaint">{label}</span>
    </div>
  )
}
