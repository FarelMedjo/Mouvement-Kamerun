import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'

// Demande de réinitialisation : envoie un e-mail contenant un lien de
// récupération vers /reinitialiser-mot-de-passe.
export default function MotDePasseOublie() {
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
        "Si un compte est associé à cette adresse, un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams."
      )
    } catch (err) {
      setErreur(err?.message || 'Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre="Mot de passe oublié"
      sousTitre="Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."
      bas={
        <Link to="/connexion" className="font-bold text-kgreen no-underline">
          ← Retour à la connexion
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Alert>{erreur}</Alert>
        <Alert type="success">{succes}</Alert>

        <Field
          id="email"
          label="Adresse e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.cm"
          autoComplete="email"
        />

        <SubmitButton loading={loading}>Envoyer le lien</SubmitButton>
      </form>
    </AuthShell>
  )
}
