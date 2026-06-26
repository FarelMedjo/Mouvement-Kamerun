// Page provisoire (gabarit) : sert uniquement à valider la mise en page commune
// et la navigation. Le contenu réel de chaque page sera construit aux étapes
// suivantes, d'après les maquettes.
export default function Placeholder({ titre, intro }) {
  return (
    <section className="bg-klight px-[clamp(16px,5vw,44px)] py-[clamp(48px,7vw,84px)]">
      <div className="mx-auto max-w-site">
        <span className="font-sans text-[13px] font-bold uppercase tracking-[0.16em] text-kgreen">
          Mouvement Kamerun
        </span>
        <h1 className="mt-3 font-heading text-[clamp(34px,6vw,52px)] font-bold uppercase leading-[1.05] tracking-[0.01em] text-knavy">
          {titre}
        </h1>
        {intro && (
          <p className="mt-4 max-w-[640px] font-sans text-[17px] leading-[1.6] text-kink">
            {intro}
          </p>
        )}
        <div className="mt-8 inline-block rounded-[3px] border border-dashed border-kgreen/50 bg-white px-5 py-3 font-sans text-[14px] text-kfaint">
          Contenu à construire à l'étape suivante.
        </div>
      </div>
    </section>
  )
}
