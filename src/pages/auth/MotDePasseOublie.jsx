import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'
import { useT } from '../../i18n/LanguageContext'

// Demande de réinitialisation : envoie un e-mail contenant un lien de
// récupération vers /reinitialiser-mot-de-passe.
export default function MotDePasseOublie() {
  const t = useT()
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      setSucces(
        t(
          "Si un compte est associé à cette adresse, un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.",
          'If an account is associated with this address, a reset email has just been sent. Remember to check your spam folder.',
        )
      )
    } catch (err) {
      setErreur(err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre={t('Mot de passe oublié', 'Forgot password')}
      sousTitre={t('Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.', 'Enter your email address to receive a reset link.')}
      bas={
        <Link to="/connexion" className="font-bold text-kgreen no-underline">
          {t('← Retour à la connexion', '← Back to sign in')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Alert>{erreur}</Alert>
        <Alert type="success">{succes}</Alert>

        <Field
          id="email"
          label={t('Adresse e-mail', 'Email address')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.cm"
          autoComplete="email"
        />

        <SubmitButton loading={loading}>{t('Envoyer le lien', 'Send the link')}</SubmitButton>
      </form>
    </AuthShell>
  )
}
