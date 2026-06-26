import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'

// Écran de connexion (e-mail + mot de passe).
export default function Connexion() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/espace'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      // Redirige vers l'espace approprié (résolu selon le rôle réel en base).
      navigate(from, { replace: true })
    } catch (err) {
      setErreur(traduireErreur(err))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre="Connexion"
      sousTitre="Connectez-vous à votre compte sécurisé."
      bas={
        <>
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="font-bold text-kgreen no-underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Alert>{erreur}</Alert>

        <Field
          id="email"
          label="Adresse e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.cm"
          autoComplete="email"
        />

        <Field
          id="password"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          right={
            <Link
              to="/mot-de-passe-oublie"
              className="font-sans text-[13px] font-semibold leading-none text-kgreen no-underline"
            >
              Mot de passe oublié ?
            </Link>
          }
        />

        <SubmitButton loading={loading}>Se connecter</SubmitButton>
      </form>

      <p className="mt-4 text-center font-sans text-[13px] leading-[1.5] text-kfaint">
        🔒 Accès réservé aux comptes validés.
      </p>
    </AuthShell>
  )
}

// Messages d'erreur Supabase traduits pour l'utilisateur.
function traduireErreur(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('invalid login credentials'))
    return 'Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.'
  if (msg.includes('email not confirmed'))
    return "Votre adresse e-mail n'a pas encore été confirmée. Consultez votre boîte de réception."
  return err?.message || 'Une erreur est survenue. Réessayez.'
}
