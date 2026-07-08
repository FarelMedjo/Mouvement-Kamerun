import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, ROLES } from '../../auth/AuthContext'
import AuthShell from '../../components/auth/AuthShell'
import Field from '../../components/auth/Field'
import SubmitButton from '../../components/auth/SubmitButton'
import Alert from '../../components/auth/Alert'
import { useT } from '../../i18n/LanguageContext'

// Écran d'inscription. L'utilisateur choisit son profil : « scrutateur » ou
// « bénévole » — JAMAIS administrateur (le rôle admin n'est pas proposé ici,
// et la RLS de user_roles le refuserait de toute façon).
// `titre` / `desc` bilingues ({ fr, en }).
const PROFILS = [
  {
    valeur: ROLES.SCRUTATEUR,
    titre: { fr: 'Scrutateur', en: 'Poll watcher' },
    desc: {
      fr: "Surveiller un bureau de vote et transmettre des fichiers (PV, photos, audio, vidéo) aux administrateurs.",
      en: 'Monitor a polling station and send files (reports, photos, audio, video) to the administrators.',
    },
  },
  {
    valeur: ROLES.BENEVOLE,
    titre: { fr: 'Bénévole', en: 'Volunteer' },
    desc: {
      fr: "Contribuer à l'action du mouvement dans un ou plusieurs domaines (graphisme, communication, logistique…).",
      en: 'Contribute to the movement’s action in one or more areas (design, communication, logistics…).',
    },
  },
]

export default function Inscription() {
  const t = useT()
  const { signUp, resendConfirmation } = useAuth()
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
      setErreur(t('Le mot de passe doit contenir au moins 8 caractères.', 'The password must contain at least 8 characters.'))
      return
    }
    if (password !== confirmation) {
      setErreur(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
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
        t(
          "Compte créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous.",
          'Account created. A confirmation email has been sent to you: click the link, then sign in.',
        )
      )
      setLoading(false)
    } catch (err) {
      const msg = (err?.message || '').toLowerCase()
      const dejaInscrit = msg.includes('user already registered') || msg.includes('already been registered')
      if (dejaInscrit) {
        // Adresse déjà utilisée : si le compte n'est pas encore confirmé,
        // c'est probablement le 1er e-mail qui a été perdu — on le renvoie.
        try {
          await resendConfirmation(email.trim())
          setSucces(
            t(
              "Un compte existe déjà avec cette adresse e-mail. Nous venons de vous renvoyer l'e-mail de confirmation : cliquez sur le lien, puis connectez-vous.",
              "An account already exists with this email address. We've just resent the confirmation email: click the link, then sign in."
            )
          )
        } catch (resendErr) {
          setErreur(traduireErreur(resendErr, t))
        }
      } else {
        setErreur(traduireErreur(err, t))
      }
      setLoading(false)
    }
  }

  return (
    <AuthShell
      titre={t('Créer un compte', 'Create an account')}
      sousTitre={t('Rejoignez le Mouvement Kamerun.', 'Join Mouvement Kamerun.')}
      bas={
        <>
          {t('Déjà inscrit ?', 'Already registered?')}{' '}
          <Link to="/connexion" className="font-bold text-kgreen no-underline">
            {t('Se connecter', 'Sign in')}
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
            {t("Je m'inscris comme", 'I am registering as')}
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
                    {t(p.titre)}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] leading-[1.45] text-[#56607a]">
                    {t(p.desc)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id="nomComplet"
          label={t('Nom et prénom(s)', 'Full name')}
          value={nomComplet}
          onChange={(e) => setNomComplet(e.target.value)}
          placeholder={t('Ex. Jean Mbarga', 'E.g. Jean Mbarga')}
          autoComplete="name"
        />
        <Field
          id="telephone"
          label={t('Téléphone', 'Phone')}
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="+237 6 XX XX XX XX"
          autoComplete="tel"
          required={false}
        />
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

        <SubmitButton loading={loading}>{t('Créer mon compte', 'Create my account')}</SubmitButton>
      </form>
    </AuthShell>
  )
}

function traduireErreur(err, t) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('user already registered') || msg.includes('already been registered'))
    return t('Un compte existe déjà avec cette adresse e-mail.', 'An account already exists with this email address.')
  if (msg.includes('already confirmed'))
    return t(
      'Un compte existe déjà avec cette adresse e-mail et est déjà confirmé. Connectez-vous.',
      'An account with this email already exists and is already confirmed. Please sign in.'
    )
  if (msg.includes('rate limit'))
    return t(
      "Trop de tentatives d'envoi d'e-mail. Réessayez dans quelques minutes.",
      'Too many email attempts. Please try again in a few minutes.'
    )
  if (msg.includes('password'))
    return t('Mot de passe trop faible. Utilisez au moins 8 caractères.', 'Password too weak. Use at least 8 characters.')
  if (msg.includes('invalid') && msg.includes('email'))
    return t("L'adresse e-mail saisie n'est pas valide.", 'The email address entered is not valid.')
  return err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.')
}
