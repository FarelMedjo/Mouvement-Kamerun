// Gabarit visuel commun aux écrans d'authentification (fidèle aux maquettes) :
// fond gris clair, carte blanche centrée (max 440px), pastille, titre, sous-titre.
export default function AuthShell({ titre, sousTitre, children, bas }) {
  return (
    <section className="flex justify-center bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,72px)]">
      <div className="w-full max-w-[440px]">
        <div className="mb-7 text-center">
          <span
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-kgreen text-[28px] leading-none text-kgold"
            aria-hidden="true"
          >
            ★
          </span>
          <h1 className="m-0 font-heading text-[clamp(30px,5vw,40px)] font-bold uppercase leading-none text-knavy">
            {titre}
          </h1>
          {sousTitre && (
            <p className="m-0 mt-2 font-sans text-[15px] leading-[1.5] text-[#56607a]">
              {sousTitre}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-[#e3e7ec] bg-white p-[clamp(24px,3vw,32px)] shadow-[0_6px_28px_rgba(17,32,63,.08)]">
          {children}
        </div>

        {bas && (
          <p className="mt-5 text-center font-sans text-[14px] text-[#56607a]">{bas}</p>
        )}
      </div>
    </section>
  )
}
