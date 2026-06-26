import ButtonSpinner from '../ui/ButtonSpinner'
import { useT } from '../../i18n/LanguageContext'

// Bouton de soumission principal (vert) avec état « en cours » (spinner).
export default function SubmitButton({ children, loading, disabled }) {
  const t = useT()
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-kgreen px-4 py-[17px] text-center font-sans text-[16px] font-bold leading-none tracking-[0.02em] text-white transition-all duration-200 hover:bg-[#095638] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <ButtonSpinner /> {t('Veuillez patienter…', 'Please wait…')}
        </>
      ) : (
        children
      )}
    </button>
  )
}
