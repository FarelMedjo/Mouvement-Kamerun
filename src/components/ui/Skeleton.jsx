// Blocs de chargement (squelettes) affichés pendant la récupération des
// données Supabase, à la place d'un écran figé. Le balayage est porté par la
// classe .skeleton (index.css), neutralisée sous prefers-reduced-motion.

// Brique de base : un rectangle gris animé.
export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`skeleton rounded ${className}`} />
}

// Squelette reproduisant la forme d'une carte d'actualité.
export function SkeletonCarte() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-kline">
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

// Grille de squelettes de cartes (par défaut 3), même gabarit que les grilles
// d'actualités du site.
export function SkeletonGrille({ nombre = 3 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
      {Array.from({ length: nombre }).map((_, i) => (
        <SkeletonCarte key={i} />
      ))}
    </div>
  )
}

// Squelette d'une ligne d'événement (jour + intitulé).
export function SkeletonLigne() {
  return (
    <div className="flex items-center gap-5 rounded-md border border-kline border-l-4 border-l-[#e7eaef] p-[18px]">
      <Skeleton className="h-12 w-[74px] flex-none" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  )
}
