import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, ROLES } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'

// Écran d'inscription. L'utilisateur choisit son profil : « scrutateur » ou
// « bénévole » — JAMAIS administrateur (le rôle admin n'est pas proposé ici,
// et la RLS de user_roles le refuserait de toute façon).
const PROFILS = [
  {
    valeur: ROLES.SCRUTATEUR,
    titre: 'Scrutateur',
    desc: "Surveiller un bureau de vote et transmettre des fichiers (PV, photos, audio, vidéo) aux administrateurs.",
  },
  {
    valeur: ROLES.BENEVOLE,
    titre: 'Bénévole',
    desc: "Contribuer à l'action du mouvement dans un ou plusieurs domaines (graphisme, communication, logistique…).",
  },
]

export default function Inscription() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const roleParDefaut = PROFILS.some((p) => p.valeur === params.get('role'))
    ? params.get('role')
    : ROLES.SCRUTATEUR

  const [role, setRole] = useState(roleParDefaut)
  const [nomComplet, setNomComplet] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')

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
      const data = await signUp({
        email: email.trim(),
        password,
        role,
        nomComplet: nomComplet.trim(),
        telephone: telephone.trim(),
      })
      // Si une session est ouverte immédiatement (confirmation d'e-mail
      // désactivée), on entre directement dans l'espace personnel.
      if (data.session) {
        navigate('/espace', { replace: true })
        return
      }
      // Sinon : confirmation d'e-mail requise.
      setSucces(
        "Compte créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous."
      )
      setLoading(false)
    } catch (err) {
      setErreur(traduireErreur(err))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre="Créer un compte"
      sousTitre="Rejoignez le Mouvement Kamerun."
      bas={
        <>
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="font-bold text-kgreen no-underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <Alert>{erreur}</Alert>
        <Alert type="success">{succes}</Alert>

        {/* Choix du profil */}
        <fieldset className="mb-[18px] border-0 p-0">
          <legend className="mb-2 font-sans text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-knavy">
            Je m'inscris comme
          </legend>
          <div className="flex flex-col gap-3">
            {PROFILS.map((p) => (
              <label
                key={p.valeur}
                className={`flex cursor-pointer gap-3 rounded-md border p-3 ${
                  role === p.valeur
                    ? 'border-kgreen bg-kgreen/[0.06]'
                    : 'border-[#d7dce3] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={p.valeur}
                  checked={role === p.valeur}
                  onChange={() => setRole(p.valeur)}
                  className="mt-[3px] h-[17px] w-[17px] flex-none accent-kgreen"
                />
                <span>
                  <span className="block font-sans text-[15px] font-bold leading-none text-knavy">
                    {p.titre}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] leading-[1.45] text-[#56607a]">
                    {p.desc}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id="nomComplet"
          label="Nom et prénom(s)"
          value={nomComplet}
          onChange={(e) => setNomComplet(e.target.value)}
          placeholder="Ex. Jean Mbarga"
          autoComplete="name"
        />
        <Field
          id="telephone"
          label="Téléphone"
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="+237 6 XX XX XX XX"
          autoComplete="tel"
          required={false}
        />
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

        <SubmitButton loading={loading}>Créer mon compte</SubmitButton>
      </form>
    </AuthShell>
  )
}

function traduireErreur(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('user already registered') || msg.includes('already been registered'))
    return 'Un compte existe déjà avec cette adresse e-mail.'
  if (msg.includes('password'))
    return 'Mot de passe trop faible. Utilisez au moins 8 caractères.'
  if (msg.includes('invalid') && msg.includes('email'))
    return "L'adresse e-mail saisie n'est pas valide."
  return err?.message || 'Une erreur est survenue. Réessayez.'
}
