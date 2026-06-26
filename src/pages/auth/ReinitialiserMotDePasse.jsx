import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'

// Page atteinte via le lien de récupération reçu par e-mail. Supabase ouvre
// alors une session de récupération ; l'utilisateur définit un nouveau mot de
// passe, puis est redirigé vers la connexion.
export default function ReinitialiserMotDePasse() {
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
      setErreur('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirmation) {
      setErreur('Les deux mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      setSucces('Mot de passe mis à jour. Redirection vers la connexion…')
      setTimeout(() => navigate('/connexion', { replace: true }), 1800)
    } catch (err) {
      setErreur(err?.message || 'Une erreur est survenue. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre="Nouveau mot de passe"
      sousTitre="Choisissez un nouveau mot de passe pour votre compte."
    >
      {pretEnCours ? (
        <p className="text-center font-sans text-[14px] text-kfaint">Vérification du lien…</p>
      ) : !sessionRecuperation && !succes ? (
        <Alert>
          Lien de réinitialisation invalide ou expiré. Refaites une demande depuis
          « Mot de passe oublié ».
        </Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Alert>{erreur}</Alert>
          <Alert type="success">{succes}</Alert>

          <Field
            id="password"
            label="Nouveau mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 8 caractères"
            autoComplete="new-password"
          />
          <Field
            id="confirmation"
            label="Confirmer le mot de passe"
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Retapez le mot de passe"
            autoComplete="new-password"
          />

          <SubmitButton loading={loading}>Mettre à jour</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
