// Petits éléments d'interface partagés par les panneaux de l'espace admin.
// Style aligné sur le reste du site (palette nationale, polices heading/sans).

export function PanelHeader({ titre, sousTitre, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="m-0 font-heading text-[clamp(22px,3vw,30px)] font-bold uppercase leading-none text-knavy">
          {titre}
        </h2>
        {sousTitre && (
          <p className="m-0 mt-2 font-sans text-[14px] leading-[1.5] text-kfaint">{sousTitre}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Carte({ children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.05)] ${className}`}
    >
      {children}
    </div>
  )
}

export function EtatVide({ children }) {
  return (
    <div className="px-5 py-10 text-center font-sans text-[14px] text-kmuted">{children}</div>
  )
}

export function Chargement({ children = 'Chargement…' }) {
  return (
    <div className="px-5 py-10 text-center font-sans text-[14px] text-kmuted">{children}</div>
  )
}

const BADGE_STATUT = {
  en_attente: 'bg-[#fff5d6] text-[#8a6d1a]',
  validee: 'bg-kgreen/10 text-kgreen',
  rejetee: 'bg-kred/10 text-kred',
}
const LABEL_STATUT = { en_attente: 'En attente', validee: 'Validée', rejetee: 'Rejetée' }

export function BadgeStatut({ statut }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[10px] py-[5px] font-sans text-[11px] font-bold ${
        BADGE_STATUT[statut] || 'bg-black/5 text-kfaint'
      }`}
    >
      {LABEL_STATUT[statut] || statut}
    </span>
  )
}

const BADGE_TYPE = {
  pv: 'bg-knavy/10 text-knavy',
  image: 'bg-kgreen/10 text-kgreen',
  audio: 'bg-kred/10 text-kred',
  video: 'bg-[#b58f00]/10 text-[#b58f00]',
  autre: 'bg-black/5 text-kfaint',
}
const LABEL_TYPE = { pv: 'PV / Doc', image: 'Image', audio: 'Audio', video: 'Vidéo', autre: 'Autre' }

export function BadgeType({ type }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[10px] py-[5px] font-sans text-[11px] font-bold ${
        BADGE_TYPE[type] || BADGE_TYPE.autre
      }`}
    >
      {LABEL_TYPE[type] || 'Autre'}
    </span>
  )
}

// Champs de formulaire réutilisables.
const inputClass =
  'w-full rounded-md border border-[#d7dce3] bg-white px-3 py-2 font-sans text-[14px] text-knavy outline-none focus:border-kgreen'

export function Champ({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-kfaint">
          {label}
        </span>
      )}
      <input className={inputClass} {...props} />
    </label>
  )
}

export function ChampZone({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-kfaint">
          {label}
        </span>
      )}
      <textarea className={`${inputClass} min-h-[96px] resize-y`} {...props} />
    </label>
  )
}

export function ChampSelect({ label, children, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-kfaint">
          {label}
        </span>
      )}
      <select className={inputClass} {...props}>
        {children}
      </select>
    </label>
  )
}

export function formatTaille(o) {
  if (!o && o !== 0) return ''
  if (o < 1024) return `${o} o`
  if (o < 1024 * 1024) return `${(o / 1024).toFixed(0)} Ko`
  return `${(o / 1024 / 1024).toFixed(1)} Mo`
}
