import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'
import { useT } from '../../i18n/LanguageContext'

// Page atteinte via le lien de récupération reçu par e-mail. Supabase ouvre
// alors une session de récupération ; l'utilisateur définit un nouveau mot de
// passe, puis est redirigé vers la connexion.
export default function ReinitialiserMotDePasse() {
  const t = useT()
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [pretEnCours, setPretEnCours] = useState(true)
  const [sessionRecuperation, setSessionRecuperation] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Le lien d'e-mail déclenche un événement PASSWORD_RECOVERY.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setSessionRecuperation(true)
      }
      setPretEnCours(false)
    })
    // Vérifie aussi une éventuelle session déjà présente.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionRecuperation(true)
      setPretEnCours(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    if (password.length < 8) {
      setErreur(t('Le mot de passe doit contenir au moins 8 caractères.', 'The password must contain at least 8 characters.'))
      return
    }
    if (password !== confirmation) {
      setErreur(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      setSucces(t('Mot de passe mis à jour. Redirection vers la connexion…', 'Password updated. Redirecting to sign in…'))
      setTimeout(() => navigate('/connexion', { replace: true }), 1800)
    } catch (err) {
      setErreur(err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.'))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre={t('Nouveau mot de passe', 'New password')}
      sousTitre={t('Choisissez un nouveau mot de passe pour votre compte.', 'Choose a new password for your account.')}
    >
      {pretEnCours ? (
        <p className="text-center font-sans text-[14px] text-kfaint">{t('Vérification du lien…', 'Checking the link…')}</p>
      ) : !sessionRecuperation && !succes ? (
        <Alert>
          {t(
            'Lien de réinitialisation invalide ou expiré. Refaites une demande depuis « Mot de passe oublié ».',
            'Invalid or expired reset link. Please request a new one from “Forgot password”.',
          )}
        </Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Alert>{erreur}</Alert>
          <Alert type="success">{succes}</Alert>

          <Field
            id="password"
            label={t('Nouveau mot de passe', 'New password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('Au moins 8 caractères', 'At least 8 characters')}
            autoComplete="new-password"
          />
          <Field
            id="confirmation"
            label={t('Confirmer le mot de passe', 'Confirm password')}
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={t('Retapez le mot de passe', 'Re-enter the password')}
            autoComplete="new-password"
          />

          <SubmitButton loading={loading}>{t('Mettre à jour', 'Update')}</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
