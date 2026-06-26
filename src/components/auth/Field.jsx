// Champ de formulaire (label + input) au style des maquettes.
export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  right, // élément optionnel aligné à droite du label (ex. « Mot de passe oublié ? »)
}) {
  return (
    <div className="mb-[18px]">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-sans text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-knavy"
        >
          {label}
        </label>
        {right}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-md border border-[#d7dce3] px-4 py-[14px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen"
      />
    </div>
  )
}
