// Bouton de soumission principal (vert) avec état « en cours ».
export default function SubmitButton({ children, loading, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full rounded-md bg-kgreen px-4 py-[17px] text-center font-sans text-[16px] font-bold leading-none tracking-[0.02em] text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Veuillez patienter…' : children}
    </button>
  )
}
