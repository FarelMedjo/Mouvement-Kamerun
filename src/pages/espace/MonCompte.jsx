import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../auth/AuthContext'
import { useLang } from '../../i18n/LanguageContext'
import {
  changerMotDePasse,
  supprimerMonCompte,
  LONGUEUR_MIN_MOT_DE_PASSE,
} from '../../lib/compte'

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

const label =
  'mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-[#9aa6bf]'

// Page « Mon compte » : commune à tous les espaces (scrutateur, bénévole,
// membre, admin). Deux opérations sensibles, chacune protégée par une
// ré-authentification (le mot de passe actuel est redemandé) :
//   · changer son mot de passe ;
//   · supprimer définitivement son compte.
export default function MonCompte() {
  const t = useLang().t
  const { user, roles } = useAuth()

  return (
    <>
      {/* bandeau d'accueil */}
      <div className="bg-kgreen px-[clamp(16px,5vw,40px)] py-[clamp(22px,3vw,30px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 font-heading text-[clamp(26px,4vw,38px)] font-bold uppercase leading-none text-white">
              {t('Mon compte', 'My account')}
            </h1>
            <p className="m-0 mt-[6px] font-sans text-[14px] leading-[1.5] text-[#d7ece1]">
              {t(
                'Gérez vos identifiants de connexion et votre compte.',
                'Manage your sign-in credentials and your account.',
              )}
            </p>
          </div>
          <div className="rounded-md bg-white/10 px-[18px] py-3">
            <div
              className="max-w-[240px] truncate font-heading text-[16px] font-bold leading-none text-kgold"
              title={user?.email}
            >
              {user?.email || '—'}
            </div>
            <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">
              {t('compte connecté', 'signed-in account')}
            </div>
          </div>
        </div>
      </div>

      <section className="px-[clamp(16px,5vw,40px)] py-[clamp(28px,4vw,44px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start gap-[clamp(22px,3vw,32px)]">
          <div className="flex-1 basis-[380px]">
            <FormulaireMotDePasse />
          </div>
          <div className="flex-1 basis-[380px]">
            <ZoneSuppression estAdmin={roles.includes(ROLES.ADMIN)} estScrutateur={roles.includes(ROLES.SCRUTATEUR)} />
          </div>
        </div>
      </section>
    </>
  )
}

// --- Changement de mot de passe ---------------------------------------------

function FormulaireMotDePasse() {
  const t = useLang().t
  const [actuel, setActuel] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setOk('')

    if (nouveau.length < LONGUEUR_MIN_MOT_DE_PASSE) {
      setErr(
        t(
          `Le nouveau mot de passe doit contenir au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`,
          `The new password must contain at least ${LONGUEUR_MIN_MOT_DE_PASSE} characters.`,
        ),
      )
      return
    }
    if (nouveau !== confirmation) {
      setErr(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
      return
    }
    if (nouveau === actuel) {
      setErr(
        t(
          "Le nouveau mot de passe doit être différent de l'actuel.",
          'The new password must be different from the current one.',
        ),
      )
      return
    }

    setLoading(true)
    try {
      await changerMotDePasse({ motDePasseActuel: actuel, nouveauMotDePasse: nouveau })
      setOk(t('Mot de passe mis à jour.', 'Password updated.'))
      setActuel('')
      setNouveau('')
      setConfirmation('')
    } catch (e2) {
      setErr(
        e2?.message === 'MOT_DE_PASSE_INCORRECT'
          ? t('Mot de passe actuel incorrect.', 'Current password is incorrect.')
          : e2?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-[14px] font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
        {t('Mot de passe', 'Password')}
      </div>

      <form onSubmit={onSubmit} noValidate className="rounded-lg border border-[#e3e7ec] bg-white p-5">
        {err && <div className="mb-3 rounded-md border border-kred/30 bg-kred/10 px-4 py-3 font-sans text-[13px] leading-[1.45] text-kred" role="alert">{err}</div>}
        {ok && <div className="mb-3 rounded-md border border-kgreen/30 bg-kgreen/10 px-4 py-3 font-sans text-[13px] leading-[1.45] text-kgreen" role="status">{ok}</div>}

        <label htmlFor="mdp-actuel" className={label}>{t('Mot de passe actuel', 'Current password')}</label>
        <input
          id="mdp-actuel"
          type="password"
          autoComplete="current-password"
          value={actuel}
          onChange={(e) => setActuel(e.target.value)}
          className={`${champ} mb-4`}
        />

        <label htmlFor="mdp-nouveau" className={label}>{t('Nouveau mot de passe', 'New password')}</label>
        <input
          id="mdp-nouveau"
          type="password"
          autoComplete="new-password"
          placeholder={t(`Au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères`, `At least ${LONGUEUR_MIN_MOT_DE_PASSE} characters`)}
          value={nouveau}
          onChange={(e) => setNouveau(e.target.value)}
          className={`${champ} mb-4`}
        />

        <label htmlFor="mdp-confirmation" className={label}>{t('Confirmer le nouveau mot de passe', 'Confirm new password')}</label>
        <input
          id="mdp-confirmation"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={`${champ} mb-4`}
        />

        <button
          type="submit"
          disabled={loading || !actuel || !nouveau || !confirmation}
          className="rounded-md bg-kgreen px-5 py-[11px] font-sans text-[14px] font-bold text-white transition-colors hover:bg-[#095638] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t('Mise à jour…', 'Updating…') : t('Modifier le mot de passe', 'Change password')}
        </button>
      </form>
    </>
  )
}

// --- Suppression du compte ---------------------------------------------------

function ZoneSuppression({ estAdmin, estScrutateur }) {
  const t = useLang().t
  const navigate = useNavigate()

  const MOT_CONFIRMATION = t('SUPPRIMER', 'DELETE')

  const [ouvert, setOuvert] = useState(false)
  const [motDePasse, setMotDePasse] = useState('')
  const [saisie, setSaisie] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')

    if (saisie.trim().toUpperCase() !== MOT_CONFIRMATION) {
      setErr(t(`Saisissez « ${MOT_CONFIRMATION} » pour confirmer.`, `Type “${MOT_CONFIRMATION}” to confirm.`))
      return
    }

    setLoading(true)
    try {
      await supprimerMonCompte({ motDePasseActuel: motDePasse })
      navigate('/', { replace: true })
    } catch (e2) {
      const msg = e2?.message || ''
      setErr(
        msg === 'MOT_DE_PASSE_INCORRECT'
          ? t('Mot de passe actuel incorrect.', 'Current password is incorrect.')
          : msg.includes('dernier compte administrateur')
            ? t(
                "Vous êtes le dernier administrateur : désignez d'abord un autre administrateur.",
                'You are the last administrator: designate another administrator first.',
              )
            : msg || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.'),
      )
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-[14px] font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
        {t('Supprimer mon compte', 'Delete my account')}
      </div>

      <div className="rounded-lg border border-[#f0cfcf] bg-[#fdf3f3] p-5">
        <p className="m-0 font-sans text-[14px] leading-[1.6] text-[#8a2a2a]">
          {t(
            'La suppression est définitive. Votre profil, vos rôles et les informations liées à votre engagement seront effacés, et vous perdrez immédiatement l’accès à votre espace.',
            'Deletion is permanent. Your profile, your roles and the information related to your involvement will be erased, and you will immediately lose access to your area.',
          )}
        </p>

        {estScrutateur && (
          <p className="m-0 mt-3 font-sans text-[13px] leading-[1.6] text-[#8a2a2a]">
            {t(
              'Les pièces électorales que vous avez déjà transmises sont conservées par le mouvement : elles ne peuvent être retirées que par un administrateur.',
              'The electoral documents you have already submitted are retained by the movement: only an administrator can remove them.',
            )}
          </p>
        )}

        {estAdmin && (
          <p className="m-0 mt-3 font-sans text-[13px] leading-[1.6] text-[#8a2a2a]">
            {t(
              'Compte administrateur : la suppression est refusée s’il ne reste aucun autre administrateur.',
              'Administrator account: deletion is refused if no other administrator remains.',
            )}
          </p>
        )}

        {!ouvert ? (
          <button
            type="button"
            onClick={() => setOuvert(true)}
            className="mt-4 rounded-md border border-kred px-5 py-[11px] font-sans text-[14px] font-bold text-kred transition-colors hover:bg-kred hover:text-white"
          >
            {t('Supprimer mon compte', 'Delete my account')}
          </button>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-4 border-t border-[#f0cfcf] pt-4">
            {err && <div className="mb-3 rounded-md border border-kred/30 bg-white px-4 py-3 font-sans text-[13px] leading-[1.45] text-kred" role="alert">{err}</div>}

            <label htmlFor="suppr-mdp" className={label}>{t('Mot de passe actuel', 'Current password')}</label>
            <input
              id="suppr-mdp"
              type="password"
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={`${champ} mb-4`}
            />

            <label htmlFor="suppr-confirmation" className={label}>
              {t(`Saisissez « ${MOT_CONFIRMATION} »`, `Type “${MOT_CONFIRMATION}”`)}
            </label>
            <input
              id="suppr-confirmation"
              type="text"
              autoComplete="off"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              className={`${champ} mb-4`}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading || !motDePasse || !saisie}
                className="rounded-md bg-kred px-5 py-[11px] font-sans text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t('Suppression…', 'Deleting…') : t('Supprimer définitivement', 'Delete permanently')}
              </button>
              <button
                type="button"
                onClick={() => { setOuvert(false); setErr(''); setMotDePasse(''); setSaisie('') }}
                className="rounded-md border border-[#d7dce3] bg-white px-5 py-[11px] font-sans text-[14px] font-bold text-[#56607a]"
              >
                {t('Annuler', 'Cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
