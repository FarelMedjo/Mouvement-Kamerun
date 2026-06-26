import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import Alert from '../../components/auth/Alert'
import { useAuth } from '../../auth/AuthContext'
import { SECTEURS, nettoyerSecteurs, declareScrutateur } from '../../lib/benevole'
import { REGIONS } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

// `t` (titre) / `d` (description) bilingues ({ fr, en }).
const MISSIONS = [
  { n: '01', t: { fr: 'Contribuer', en: 'Contribute' }, d: { fr: 'Mettre vos compétences au service du mouvement.', en: 'Put your skills at the service of the movement.' }, c: 'bg-knavy text-white' },
  { n: '02', t: { fr: 'Mobiliser', en: 'Mobilise' }, d: { fr: 'Fédérer et faire grandir la communauté sur le terrain.', en: 'Unite and grow the community on the ground.' }, c: 'bg-kgreen text-kgold' },
  { n: '03', t: { fr: 'Soutenir', en: 'Support' }, d: { fr: 'Appuyer la logistique, la communication et les actions.', en: 'Back the logistics, communication and actions.' }, c: 'bg-kred text-white' },
  { n: '04', t: { fr: 'Veiller', en: 'Watch over' }, d: { fr: 'Surveiller un bureau de vote en devenant aussi scrutateur.', en: 'Monitor a polling station by also becoming a poll watcher.' }, c: 'bg-kgold text-knavy' },
]

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

// Construit la chaîne « zone géographique » à partir de la région et d'une
// précision facultative (ville / quartier). Stockée dans benevole_details.zone.
function composerZone(region, precision) {
  const p = (precision || '').trim()
  if (region && p) return `${region} · ${p}`
  return region || p || ''
}

export default function EspaceBenevoles() {
  const t = useT()
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [f, setF] = useState({
    prenom: '', nom: '', telephone: '', email: '',
    region: '', precision: '', disponibilites: '',
    password: '', confirmation: '', consent: false,
  })
  const [secteurs, setSecteurs] = useState([])
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [scrutateurChoisi, setScrutateurChoisi] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) =>
    setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const toggleSecteur = (valeur) =>
    setSecteurs((prev) =>
      prev.includes(valeur) ? prev.filter((v) => v !== valeur) : [...prev, valeur]
    )

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')

    if (!f.nom.trim() || !f.prenom.trim()) return setErreur(t('Nom et prénom sont obligatoires.', 'First and last name are required.'))
    const secteursPropres = nettoyerSecteurs(secteurs)
    if (secteursPropres.length === 0)
      return setErreur(t("Sélectionnez au moins un secteur d'intervention.", 'Select at least one area of involvement.'))
    if (f.password.length < 8) return setErreur(t('Le mot de passe doit contenir au moins 8 caractères.', 'The password must contain at least 8 characters.'))
    if (f.password !== f.confirmation) return setErreur(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
    if (!f.consent) return setErreur(t("Merci d'accepter la charte du bénévole pour continuer.", 'Please accept the volunteer charter to continue.'))

    setLoading(true)
    try {
      const data = await signUp({
        email: f.email.trim(),
        password: f.password,
        role: 'benevole',
        nomComplet: `${f.prenom.trim()} ${f.nom.trim()}`,
        telephone: f.telephone.trim(),
        metaExtra: {
          bn_zone: composerZone(f.region, f.precision) || null,
          bn_disponibilites: f.disponibilites.trim() || null,
          bn_secteurs: secteursPropres,
        },
      })
      setScrutateurChoisi(declareScrutateur(secteursPropres))

      // Session immédiate (confirmation d'e-mail désactivée) : on entre dans
      // l'espace bénévole, où l'activation du compte scrutateur est proposée si
      // le secteur a été déclaré.
      if (data.session) {
        navigate('/benevoles/tableau-de-bord', { replace: true })
        return
      }
      // Sinon : confirmation d'e-mail requise.
      setSucces(
        t(
          'Compte bénévole créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous pour accéder à votre espace.',
          'Volunteer account created. A confirmation email has been sent to you: click the link, then sign in to access your area.',
        )
      )
      setLoading(false)
    } catch (err) {
      setErreur(traduireErreur(err, t))
      setLoading(false)
    }
  }

  return (
    <>
      <PageBanner surtitre={t('Espace Bénévoles', 'Volunteers')} fil={t('Inscription bénévole', 'Volunteer registration')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* présentation du rôle */}
          <div className="flex-1 basis-[340px]">
            <Eyebrow color="text-kgreen" dash className="mb-5">{t('Forces vives du mouvement', 'The driving force of the movement')}</Eyebrow>
            <h1 className="m-0 mb-5 font-heading text-[clamp(34px,5.5vw,56px)] font-bold uppercase leading-[0.96] text-knavy">
              {t('Devenir bénévole', 'Become a volunteer')}
            </h1>
            <p className="m-0 mb-7 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              {t(
                "Le bénévole donne de son temps et de ses compétences pour faire avancer le mouvement. Graphisme, communication, logistique, mobilisation… ou surveillance d'un bureau de vote : chaque engagement compte. Indiquez vos secteurs et vos disponibilités, nous vous orientons vers les actions qui vous correspondent.",
                'Volunteers give their time and skills to move the movement forward. Design, communication, logistics, mobilisation… or monitoring a polling station: every commitment counts. Tell us your areas and availability, and we will guide you towards the actions that suit you.',
              )}
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {MISSIONS.map((m) => (
                <div key={m.n} className="rounded-md border border-[#e3e7ec] bg-white p-5">
                  <div className={`mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-full font-heading text-[17px] font-bold ${m.c}`}>
                    {m.n}
                  </div>
                  <h3 className="m-0 mb-2 font-heading text-[20px] font-semibold uppercase leading-none text-knavy">{t(m.t)}</h3>
                  <p className="m-0 font-sans text-[15px] leading-[1.55] text-[#56607a]">{t(m.d)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* formulaire d'inscription */}
          <div className="w-full max-w-[520px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="flex items-center justify-between bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">{t('Créer mon compte bénévole', 'Create my volunteer account')}</div>
              <span className="font-sans text-[12px] font-semibold text-white/90">{t('🔒 Espace sécurisé', '🔒 Secure area')}</span>
            </div>

            <div className="p-[clamp(22px,3vw,30px)]">
              <Alert>{erreur}</Alert>
              <Alert type="success">{succes}</Alert>

              {succes ? (
                scrutateurChoisi && (
                  <div className="mt-2 rounded-lg border border-[#cfe6da] bg-[#eaf3ee] px-5 py-[18px]">
                    <div className="mb-1 font-sans text-[14px] font-bold text-[#1f5b41]">
                      {t('Secteur scrutateur déclaré', 'Poll watcher area declared')}
                    </div>
                    <p className="m-0 font-sans text-[14px] leading-[1.6] text-[#1f5b41]">
                      {t(
                        'Après confirmation de votre e-mail et connexion, vous pourrez activer votre compte scrutateur depuis votre tableau de bord pour obtenir les droits de téléversement des documents électoraux.',
                        'After confirming your email and signing in, you will be able to activate your poll watcher account from your dashboard to obtain upload rights for electoral documents.',
                      )}
                    </p>
                  </div>
                )
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identité & contact', 'Identity & contact')}</div>
                  <div className="mb-[14px] grid grid-cols-2 gap-3">
                    <input type="text" placeholder={t('Prénom', 'First name')} value={f.prenom} onChange={set('prenom')} className={champ} />
                    <input type="text" placeholder={t('Nom', 'Last name')} value={f.nom} onChange={set('nom')} className={champ} />
                  </div>
                  <input type="tel" placeholder={t('Téléphone (+237…)', 'Phone (+237…)')} value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[14px]`} />
                  <input type="email" placeholder={t('Adresse e-mail', 'Email address')} value={f.email} onChange={set('email')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Zone géographique', 'Geographic area')}</div>
                  <select value={f.region} onChange={set('region')} className={`${champ} mb-[14px]`}>
                    <option value="">{t('Région…', 'Region…')}</option>
                    {REGIONS.map((r) => <option key={r.fr} value={t(r)}>{t(r)}</option>)}
                  </select>
                  <input type="text" placeholder={t('Ville / quartier (facultatif)', 'City / neighbourhood (optional)')} value={f.precision} onChange={set('precision')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Disponibilités', 'Availability')}</div>
                  <textarea
                    rows={2}
                    placeholder={t('Ex. Week-ends, soirées en semaine, périodes de campagne…', 'E.g. Weekends, weekday evenings, campaign periods…')}
                    value={f.disponibilites}
                    onChange={set('disponibilites')}
                    className={`${champ} mb-[22px] resize-y leading-[1.5]`}
                  />

                  <div className="mb-[6px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t("Secteurs d'intervention", 'Areas of involvement')}</div>
                  <p className="m-0 mb-3 font-sans text-[13px] leading-[1.45] text-[#7c879c]">{t('Sélectionnez un ou plusieurs secteurs.', 'Select one or more areas.')}</p>
                  <div className="mb-[22px] flex flex-col gap-[10px]">
                    {SECTEURS.map((s) => {
                      const actif = secteurs.includes(s.valeur)
                      return (
                        <label
                          key={s.valeur}
                          className={`flex cursor-pointer gap-3 rounded-md border p-3 ${
                            actif ? 'border-kgreen bg-kgreen/[0.06]' : 'border-[#d7dce3] bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={actif}
                            onChange={() => toggleSecteur(s.valeur)}
                            className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen"
                          />
                          <span>
                            <span className="block font-sans text-[15px] font-bold leading-none text-knavy">{t(s.label)}</span>
                            <span className="mt-1 block font-sans text-[13px] leading-[1.45] text-[#56607a]">{t(s.desc)}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  {declareScrutateur(secteurs) && (
                    <div className="mb-[22px] flex items-start gap-2 rounded-md border border-[#f0d9a8] bg-[#fff8e8] px-4 py-3 font-sans text-[13px] leading-[1.5] text-[#7c6a3a]">
                      <span className="flex-none font-bold text-[#b58f00]">ⓘ</span>
                      {t(
                        "Vous avez choisi le secteur scrutateur : nous vous proposerons d'activer votre compte scrutateur (droits de téléversement) après la création de votre compte.",
                        'You have chosen the poll watcher area: we will offer to activate your poll watcher account (upload rights) after your account is created.',
                      )}
                    </div>
                  )}

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identifiants de connexion', 'Login credentials')}</div>
                  <div className="mb-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input type="password" placeholder={t('Mot de passe', 'Password')} value={f.password} onChange={set('password')} autoComplete="new-password" className={champ} />
                    <input type="password" placeholder={t('Confirmer le mot de passe', 'Confirm password')} value={f.confirmation} onChange={set('confirmation')} autoComplete="new-password" className={champ} />
                  </div>

                  <label className="mb-[22px] flex cursor-pointer items-start gap-[10px]">
                    <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen" />
                    <span className="font-sans text-[14px] leading-[1.5] text-[#56607a]">
                      {t(
                        "Je m'engage à contribuer à l'action du mouvement avec intégrité et j'accepte la charte du bénévole.",
                        'I commit to contributing to the movement’s action with integrity and I accept the volunteer charter.',
                      )}
                    </span>
                  </label>

                  <button type="submit" disabled={loading} className="w-full rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white disabled:opacity-60">
                    {loading ? t('Création…', 'Creating…') : t('Créer mon compte', 'Create my account')}
                  </button>
                </form>
              )}

              <p className="mt-5 text-center font-sans text-[14px] text-[#56607a]">
                {t('Déjà inscrit ?', 'Already registered?')}{' '}
                <Link to="/connexion" className="font-bold text-kgreen no-underline">{t('Se connecter', 'Sign in')}</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function traduireErreur(err, t) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return t('Un compte existe déjà avec cette adresse e-mail.', 'An account already exists with this email address.')
  if (msg.includes('password')) return t('Mot de passe trop faible (au moins 8 caractères).', 'Password too weak (at least 8 characters).')
  if (msg.includes('invalid') && msg.includes('email')) return t("L'adresse e-mail n'est pas valide.", 'The email address is not valid.')
  return err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.')
}
