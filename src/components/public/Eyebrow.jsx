// Petit surtitre en capitales (avec tiret optionnel), motif récurrent des
// maquettes. `color` = classe texte Tailwind (ex. 'text-kred').
export default function Eyebrow({ children, color = 'text-kred', dash = false, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-[10px] font-sans text-[13px] font-semibold uppercase leading-none tracking-[0.16em] ${color} ${className}`}
    >
      {dash && <span className="inline-block h-[2px] w-[26px] bg-current" />}
      {children}
    </div>
  )
}
