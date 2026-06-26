import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'
import { useT } from '../../i18n/LanguageContext'

// Écran de connexion (e-mail + mot de passe).
export default function Connexion() {
  const t = useT()
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
      setErreur(traduireErreur(err, t))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre={t('Connexion', 'Sign in')}
      sousTitre={t('Connectez-vous à votre compte sécurisé.', 'Sign in to your secure account.')}
      bas={
        <>
          {t('Pas encore de compte ?', 'No account yet?')}{' '}
          <Link to="/inscription" className="font-bold text-kgreen no-underline">
            {t('Créer un compte', 'Create an account')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Alert>{erreur}</Alert>

        <Field
          id="email"
          label={t('Adresse e-mail', 'Email address')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.cm"
          autoComplete="email"
        />

        <Field
          id="password"
          label={t('Mot de passe', 'Password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Votre mot de passe', 'Your password')}
          autoComplete="current-password"
          right={
            <Link
              to="/mot-de-passe-oublie"
              className="font-sans text-[13px] font-semibold leading-none text-kgreen no-underline"
            >
              {t('Mot de passe oublié ?', 'Forgot password?')}
            </Link>
          }
        />

        <SubmitButton loading={loading}>{t('Se connecter', 'Sign in')}</SubmitButton>
      </form>

      <p className="mt-4 text-center font-sans text-[13px] leading-[1.5] text-kfaint">
        {t('🔒 Accès réservé aux comptes validés.', '🔒 Access reserved for approved accounts.')}
      </p>
    </AuthShell>
  )
}

// Messages d'erreur Supabase traduits pour l'utilisateur (selon la langue active).
function traduireErreur(err, t) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('invalid login credentials'))
    return t('Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.', 'Incorrect credentials. Check your email and password.')
  if (msg.includes('email not confirmed'))
    return t("Votre adresse e-mail n'a pas encore été confirmée. Consultez votre boîte de réception.", 'Your email address has not been confirmed yet. Please check your inbox.')
  return err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.')
}
